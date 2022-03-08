/* eslint-disable no-console */
// import { useContext } from 'react';
import { Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiFileCode, mdiDotsHorizontal } from '@mdi/js';
import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { /* Context, */ Spec as ISpec } from '../../GlobalStore';
import './Spec.css';

function Spec() {
  // const [state, dispatch] = useContext(Context);

  const openSpecFile = async () => {
    window.electron.open.specFile();
    window.electron.ipcRenderer.on('open-spec-file', (res: string) => {
      const json = JSON.parse(res);
      const result: Partial<ISpec> = {
        path: json.path,
      };
      if (json.content.swagger) {
        result.version = 2;
        result.dereferenced = json.content as OpenAPIV2.Document;
      } else {
        result.version = json.content.openapi;
        if (result.version && result.version < 3.1) {
          result.dereferenced = json.content as OpenAPIV3.Document;
        } else {
          result.dereferenced = json.content as OpenAPIV3_1.Document;
        }
      }
      console.log(result);
    });
  };

  return (
    <div className="Spec">
      <Container fluid>
        <Row>
          <Col>
            <Card bg="dark" text="white" className="page-header mt-3" body>
              <div className="float-start">
                <Icon
                  className="page-header-icon"
                  path={mdiFileCode}
                  size={1}
                />
                <span className="page-header-title">API Specifications</span>
              </div>
              <Dropdown className="float-end ml-auto" id="spec-header-dropdown">
                <Dropdown.Toggle
                  variant="dark"
                  // className="btn-sm"
                  // onClick={openSpecFile}
                >
                  <Icon
                    className="button-icon"
                    path={mdiDotsHorizontal}
                    size={1}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                  <Dropdown.Item onClick={openSpecFile}>
                    Open Swagger/OpenAPI Document
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Spec;
