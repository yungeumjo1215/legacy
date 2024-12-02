const rootPath = "http://localhost:8000";

const GET_HERITAGE_API_URL = `${rootPath}/heritage`;
const GET_FESTIVAL_API_URL = `${rootPath}/festival`;
const CREATE_ACCOUNT_API_URL = `${rootPath}/account/create`;
const DELETE_ACCOUNT_API_URL = `${rootPath}/account/delete/:uuid`;
const LOGIN_ACCOUNT_API_URL = `${rootPath}/account/login`;
const LOGOUT_ACCOUNT_API_URL = `${rootPath}/account/logout`;
const EVENT_ACCOUNT_API_URL = `${rootPath}/event`;

export {
  GET_HERITAGE_API_URL,
  CREATE_ACCOUNT_API_URL,
  DELETE_ACCOUNT_API_URL,
  GET_FESTIVAL_API_URL,
  LOGOUT_ACCOUNT_API_URL,
  LOGIN_ACCOUNT_API_URL,
  EVENT_ACCOUNT_API_URL,
};
