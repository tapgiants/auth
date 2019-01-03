import docCookies from './docCookies';

class AuthService {
  login(login, email, password, onSuccess, onError) {
    login({
      variables: {
        input: {
          email,
          password
        }
      }
    }).then(({ data: { login } }) => {
      if (login.user && login.user.token) {
        this.setToken(login.user.token);
        onSuccess();
      } else if (login.errors) {
        onError(login.errors);
      }

      return Promise.resolve(login);
    });
  }

  loggedIn() {
    const token = this.getToken();
    return !!token;
  }

  setToken(token) {
    docCookies.setItem('session_id', token);
  }

  getToken() {
    return docCookies.getItem('session_id');
  }

  register(register, userData, onSuccess, onError) {
    register({
      variables: {
        input: userData
      }
    }).then(({ data: { createUser } }) => {
      if (createUser.user && createUser.user.token) {
        this.setToken(createUser.user.token);
        onSuccess();
      } else if (createUser.errors) {
        onError(createUser.errors);
      }
    });
  }

  logout(logout, onSuccess) {
    logout({
      variables: {
        token: this.getToken()
      }
    }).then((_response) => {
      docCookies.removeItem('session_id');
      onSuccess();
    });
  }
}

export default AuthService;
