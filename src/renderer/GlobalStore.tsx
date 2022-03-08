/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import { createContext, useReducer, Reducer } from 'react';

export type SpecVersion = 2 | 3 | 3.1;

export type Spec = {
  path: string;
  version: SpecVersion;
  refs: OpenAPI.Document;
  dereferenced: OpenAPI.Document;
  types?: string;
};

export type State = {
  spec?: Spec;
  tabKey?: string;
  error?: any;
};

export type ActionTypes =
  | 'SET_SPEC'
  | 'SET_TAB_KEY'
  | 'SET_TYPES'
  | 'SET_ERROR';

export type Action = { type: ActionTypes; payload: any };

export const defaultState: State = {};

const reducer: Reducer<State, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_SPEC':
      return {
        ...state,
        swagger: action.payload,
      };
    case 'SET_TAB_KEY':
      return {
        ...state,
        tabKey: action.payload,
      };
    case 'SET_TYPES':
      return {
        ...state,
        types: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

const GlobalStore = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    defaultState
  );
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export const Context: any = createContext(defaultState);
export default GlobalStore;
