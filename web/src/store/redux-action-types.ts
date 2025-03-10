const ReduxActionTypes = {
  INIT_APP: "INIT_APP",
  INIT_SESSION_SAGA: "INIT_SESSION_SAGA",
  INIT_BUILD_SAGA: "INIT_BUILD_SAGA",

  //Session
  FETCH_SESSIONS_INIT: "FETCH_SESSION_INIT",
  FETCH_SESSIONS_SUCCESS: "FETCH_SESSION_SUCCESS",
  FETCH_SESSION: "FETCH_SESSION",
  FETCH_SESSION_SUCCESS: "FETCH_SESSION_SUCCESS",
  SELECT_SESSION: "SELECT_SESSION",
  DESELECT_SESSION: "DESELECT_SESSION",
  SET_SESSION_FILTER: "SET_SESSION_FILTER",
  DELETE_SESSION: "DELETE_SESSION",
  DELETE_ALL_SESSION: "DELETE_ALL_SESSION",
  PAUSE_SESSION: "PAUSE_SESSION",
  RUN_SCRIPT_FOR_SESSION: "RUN_SCRIPT_FOR_SESSION",
  RUN_SCRIPT_FOR_SESSION_FINISH: "RUN_SCRIPT_FOR_SESSION_FINISH",
  RESET_SCRIPT_RESPONSE_FOR_SESSION: "RESET_SCRIPT_RESPONSE_FOR_SESSION",
  RESUME_SESSION: "RESUME_SESSION",
  SESSION_STATE_CHANGE_FINISH: "SESSION_STATE_CHANGE_FINISH",
  //Logs
  FETCH_SESSION_TEXT_LOG: "FETCH_SESSION_TEXT_LOG",
  FETCH_SESSION_TEXT_LOG_SUCCESS: "FETCH_SESSION_TEXT_LOG_SUCCESS",
  FETCH_SESSION_DEVICE_LOG: "FETCH_SESSION_DEVICE_LOG",
  FETCH_SESSION_DEVICE_LOG_SUCCESS: "FETCH_SESSION_DEVICE_LOG_SUCCESS",
  FETCH_SESSION_DEBUG_LOG: "FETCH_SESSION_DEBUG_LOG",
  FETCH_SESSION_DEBUG_LOG_SUCCESS: "FETCH_SESSION_DEBUG_LOG_SUCCESS",
  FETCH_SESSION_HTTP_LOG: "FETCH_SESSION_HTTP_LOG",
  FETCH_SESSION_HTTP_LOG_SUCCESS: "FETCH_SESSION_HTTP_LOG_SUCCESS",
  FETCH_SESSION_PROFILING_DATA: "FETCH_SESSION_PROFILING_DATA",
  FETCH_SESSION_PROFILING_DATA_SUCCESS: "FETCH_SESSION_PROFILING_DATA_SUCCESS",
  FETCH_SESSIONS_BY_BUILD_ID :"FETCH_SESSIONS_BY_BUILD_ID",

  //polling
  POLLING_INIT: "POLLING_INIT",
  POLLING_STOP: "POLLING_STOP",
  ADD_POLLING_TASK: "ADD_POLLING_TASK",
  REMOVE_POLLING_TASK: "REMOVE_POLLING_TASK",

  //loaders
  SESSION_DELETE_INIT: "SESSION_DELETE_INIT",
  SESSION_DELETE_FINISH: "SESSION_DELETE_FINISH",

  //Builds,
  FETCH_BUILD_INIT: "FETCH_BUILD_INIT",
  FETCH_BUILD : "FETCH_BUILD",
  FETCH_BUILD_SUCCESS: "FETCH_BUILD_SUCCESS",
  SET_BUILD_FILTER: "SET_BUILD_FILTER",
  SELECT_BUILD: "SELECT_BUILD",
  DESELECT_BUILD: "DESELECT_BUILD",

};

export default ReduxActionTypes;
