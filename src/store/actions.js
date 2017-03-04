export const REQUEST_SESSION = 'REQUEST_SESSION';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';
export const IS_LOGGEDIN = 'IS_LOGGEDIN';
export const REFRESH = 'REFRESH';
export const AUTH_USER = 'AUTH_USER';
export const REGISTER_USER = 'REGISTER_USER';
export const USER_LOGOUT = 'USER_LOGOUT';

export const selectState = session => ({
  type: IS_LOGGEDIN,
  session
});

export const refreshSession = session => ({
  type: REFRESH,
  session
});

function requestSession (email) {
  return {
    type: REQUEST_SESSION,
    email
  };
}

function receiveSession (email, json) {
  return {
    type: RECEIVE_SESSION,
    email,
    posts: json,
    receivedAt: Date.now()
  };
}

function authUser (email, json) {
  return {
    type: AUTH_USER,
    email,
    posts: json,
    receivedAt: Date.now()
  };
}

function regUser (email, json) {
  return {
    type: REGISTER_USER,
    email,
    posts: json,
    receivedAt: Date.now()
  };
}

function userLogOut (email, json) {
  return {
    type: USER_LOGOUT,
    email,
    posts: json,
    receivedAt: Date.now()
  };
}

const fetchSession = (username) => dispatch => {
  dispatch(requestSession(username));
  return fetch(`http://138.197.29.193:3001/users/home`, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(json => {
      dispatch(receiveSession(username, json));
      dispatch(selectState(json.authenticated));
    });
};

const authenticateUser = (username, password) => dispatch => {
  dispatch(requestSession(username));
  return fetch(`http://138.197.29.193:3001/users/login?username=${username}&password=${password}`, {
    method: 'POST',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch(authUser(username, json));
      dispatch(selectState(json.authenticated));
    });
};

const registerUser = (username, password, fname, lname) => dispatch => {
  dispatch(requestSession(username));
  return fetch(`http://138.197.29.193:3001/users/signup?username=${username}&password=${password}&first_name=${fname}&last_name=${lname}`, {
    method: 'POST',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch(regUser(username, json));
      dispatch(selectState(json.authenticated));
    });
};

const signOutUser = (username) => dispatch => {
  dispatch(requestSession(username));
  return fetch(`http://138.197.29.193:3001/users/logout`, {
    method: 'GET',
    credentials: 'include'
  })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      dispatch(userLogOut(username, json));
      dispatch(selectState(json.authenticated));
    });
};

const shouldfetchSession = (state, session) => {
  const posts = state.postsBySession[session];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
};

export const fetchSessionIfNeeded = (username) => (dispatch, getState) => {
  if (shouldfetchSession(getState(), username)) {
    return dispatch(fetchSession(username));
  }
};

export const authenticateUserIfNeeded = (username, password) => (dispatch, getState) => {
  if (shouldfetchSession(getState(), username)) {
    return dispatch(authenticateUser(username, password));
  }
};

export const registerUserIfNeeded = (username, password, fname, lname) => (dispatch, getState) => {
  if (shouldfetchSession(getState(), username)) {
    return dispatch(registerUser(username, password, fname, lname));
  }
};

export const signOutUserIfNeeded = (username) => (dispatch, getState) => {
  if (shouldfetchSession(getState(), username)) {
    return dispatch(signOutUser(username));
  }
};
