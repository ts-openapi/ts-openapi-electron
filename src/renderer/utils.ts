/* eslint-disable import/prefer-default-export */

const isType = <T>(arg: T): arg is T => {
  if (arg && Object.keys(arg).length > 0) {
    return true;
  }
  return false;
};

export { isType };
