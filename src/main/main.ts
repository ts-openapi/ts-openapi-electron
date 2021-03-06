/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import yaml from 'js-yaml';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import SwaggerParser from '@apidevtools/swagger-parser';
// import { generateTypesForDocument } from 'openapi-client-axios-typegen';
// import { Project, ScriptTarget } from 'ts-morph';
import { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const store = new Store();

/** Local Storage */
ipcMain.on('store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('store-set', async (_, key, val) => {
  store.set(key, val);
});

/** http requests */
ipcMain.on('axios-request', async (event, arg) => {
  const handler = async (cfg: string) => {
    const res = await axios(JSON.parse(cfg));
    return JSON.stringify({
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  };
  event.reply('axios-request', await handler(arg));
});

ipcMain.on('open-spec-file', async (event) => {
  const handler = async () => {
    const open = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openFile'],
      filters: [{ name: 'Swagger', extensions: ['yaml', 'yml', 'json'] }],
    });
    if (open.canceled) {
      return undefined;
    }
    const filePath = open.filePaths[0];
    let parsedContent: OpenAPIV3.Document | OpenAPIV2.Document;
    const ext = path.extname(filePath);
    if (ext === '.json') {
      parsedContent = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as
        | OpenAPIV3.Document
        | OpenAPIV2.Document;
    }
    if (ext === '.yml' || ext === '.yaml') {
      parsedContent = yaml.load(fs.readFileSync(filePath, 'utf-8')) as
        | OpenAPIV3.Document
        | OpenAPIV2.Document;
    }
    const parser = new SwaggerParser();
    const parserOptions: SwaggerParser.Options = {
      dereference: {
        circular: true,
      },
      validate: { schema: false },
      resolve: {
        external: false,
        http: false,
        file: true,
      },
    };
    parsedContent = (await parser.validate(parsedContent!, parserOptions)) as
      | OpenAPIV2.Document
      | OpenAPIV3.Document;
    console.log(parsedContent);
    // const types = parsedContent?.swagger
    //   ? (
    //       await generateTypesForDocument(parsedContent, {
    //         transformOperationName: (str: string) => str,
    //       })
    //     ).join('\n')
    //   : null;
    // console.log(types);
    // const project = new Project({
    //   compilerOptions: {
    //     target: ScriptTarget.ES3,
    //   },
    // });
    // const sourceFile = project.createSourceFile('__tempfile__.ts', types);
    // const interfaceArr: InterfaceDeclaration[] = sourceFile.getInterfaces();
    // const declarationsArr: string[] = [];
    // for (const interfaceDeclaration of interfaceArr) {
    //   const txt = interfaceDeclaration.getText();
    //   declarationsArr.push(txt);
    // }
    // const declarations = sourceFile
    //   .getInterfaces()
    //   .map((intf) => intf.findReferencesAsNodes());
    // const parsedTypes = declarations[0].map((decl) => decl.print());
    // do things with source file
    // sourceFile.delete();
    return JSON.stringify({
      path: filePath,
      content: parsedContent,
      // types: parsedTypes,
    });
  };
  event.reply('open-spec-file', await handler());
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
