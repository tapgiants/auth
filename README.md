# What is @tapgiants/auth

@tapgiants/auth provides authentication and session management functionality.

## Installation

Install @tapgiants/auth

```bash
yarn add @tapgiants/auth
```

## Auth API

### withAuth(AuthComponent: React.Component, onLoginFailed: Function):React.Component

Renders `AuthComponent` with `auth` property instance of the [`AuthService`](#authservice-api) class if [`AuthService.loggedIn`](#loggedinboolean) returns `true`. Otherwise calls `onLoginFailed`.

#### Arguments

**AuthComponent**: React.Component - The cache argument is provided by Apollo.

**onLoginFailed**: Function - A callback function. It is executed when AuthService.loggedIn returns false.

### withAuth example
```jsx
import React from 'react';
import Router from 'next/router';
import { withAuth } from '@tapgiants/auth';

const PrivatePage = ({ auth }) => {
  console.log('Logged in?', auth.loggedIn());
  console.log('User token', auth.getToken());

  return (
    <div>
      Private Content
    </div>
  );
};

export default withAuth(PrivatePage, () => Router.push('/login'));
```

## AuthService API

All of the authentication and session managment logic is handled by AuthService class.
If the authentication is successful stores provided user token in a cookie.

### login(login: Function, email: String, password: String, onSuccess: Function, onError: Function):void

Authenticates an user if passed user credentials are valid and calls `onSuccess` callback, otherwise calls `onError`.

#### Arguments

**login**: Function: Promise - A callback function that performs login request against authentication service. It can be an Apollo mutate function from [`render prop function`](https://www.apollographql.com/docs/react/essentials/mutations.html#render-prop) or a custom function that returns a promise.

The function receives the following json shape as an argument:
```js
{
  variables: {
    input: {
      email,
      password
    }
  }
}
```

Should return a promise that resolves the server response in the following shape:
```js
new Promise(
  (resolve) => resolve({
    data: {
      login: {
        user: {
          token: 'user-token'
        }
      }
    }
  }
)).then(serverResponse => console.log(serverResponse))
```
>Check the GraphQL input type and response type conventions described in the [*GraphQL conventions*](#graphql-conventions) section

**email**: String - E-mail address.

**password**: String - Password.

**onSuccess**: Function - It is called when the authentication is successful.

**onError**: Function - It is called when the authentication fails. Receives an array with errors as an argument.
Check [*GraphQL conventions*](#graphql-conventions) section for errors format reference.

### login example

```jsx
import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloWrapper, formatGQLErrors } from '@tapgiants/graphql';
import { AuthService } from '@tapgiants/auth';

const LOGIN = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        firstName
        lastName
        token
      }
      errors {
        key
        message
      }
    }
  }
`;

class Login extends React.Component {
  state = {
    email: '',
    password: ''
  }

  handleLogin = (login) => {
    const auth = new AuthService();


    const onSuccess = () => {
      console.log('User token', auth.getToken());
      // User token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9

      console.log('loggedIn', auth.loggedIn());
      // loggedIn true
    };

    const onError = (errors) => {
      console.log('Errors', formatGQLErrors(errors));
      // Errors { generalError: "Incorrect login credentials" }

      console.log('loggedIn', auth.loggedIn());
      // loggedIn false
    };

    auth.login(
      login,
      this.state.email,
      this.state.password,
      onSuccess,
      onError
    );
  }

  setCredential(name, e) {
    const currentState = this.state;

    this.setState({ ...currentState, ...{ [name]: e.target.value } });
  }

  render() {
    const { email, password } = this.state;

    return (
      <ApolloWrapper uri="http://localhost:4000/api">
        <Mutation mutation={LOGIN}>
          {(login) => {
            return (
              <form>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => this.setCredential('email', e)}
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => this.setCredential('password', e)}
                />

                <button type="button" onClick={() => this.handleLogin(login)}>Login</button>
              </form>
            )
          }}
        </Mutation>
      </ApolloWrapper>
    );
  }
}

export default Login;
```

### loggedIn():Boolean

**Returns** true if there is a stored token in the cookie.

### setToken(token: String):Boolean

Sets a token in the cookie.

#### Arguments

**token**: String - token string.

**Returns** true if the token is successfully stored in the cookie. Otherwise returns false.

### getToken():String

**Returns** the user's token.

### register(register: Function, userData: Object, onSuccess: Function, onError: Function):void

Registers an user on a remote service.

#### Arguments

**register**: Function: Promise - A callback function that performs registration request on a remote server. It can be an Apollo mutate function from [`render prop function`](https://www.apollographql.com/docs/react/essentials/mutations.html#render-prop) or a custom function that returns a promise.

The function receives the following json shape as an argument:
```js
{
  variables: {
    input: userData
  }
}
```

Should return a promise that resolves the server response in the following shape:
```js
new Promise(
  (resolve) => resolve({
    data: {
      createUser: {
        user: {
          token: 'user-token'
        },
        errors: []
      }
    }
  }
)).then(serverResponse => console.log(serverResponse))
```
>Check the GraphQL input type and response type conventions described in the [*GraphQL conventions*](#graphql-conventions) section

**userData**: Object - User data.
Example:
```js
{
  email: 'john.doe@example.com',
  password: '123456',
  firstName: 'John',
  lastName: 'Doe'
}
```

**onSuccess**: Function - It is called when the registration is successful.

**onError**: Function - It is called when the authentication fails. Receives an array with errors as an argument.
Check [*GraphQL conventions*](#graphql-conventions) section for errors format reference.

### register example

```jsx
import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloWrapper, formatGQLErrors } from '@tapgiants/graphql';
import { AuthService } from '@tapgiants/auth';

const CREATE_USER = gql`
  mutation($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        email
        firstName
        lastName
        token
      }
      errors {
        key
        message
      }
    }
  }
`;

class Register extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  }

  handleRegistration = (register) => {
    const auth = new AuthService();


    const onSuccess = () => {
      console.log('User token', auth.getToken());
      // User token eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9

      console.log('loggedIn', auth.loggedIn());
      // loggedIn true
    };

    const onError = (errors) => {
      console.log('Errors', formatGQLErrors(errors));
      // Errors { email: "can't be blank", firstName: "can't be blank", lastName: "can't be blank", password: "can't be blank" }

      console.log('loggedIn', auth.loggedIn());
      // loggedIn false
    };

    auth.register(
      register,
      {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      },
      onSuccess,
      onError
    );
  }

  setCredential(name, e) {
    const currentState = this.state;

    this.setState({ ...currentState, ...{ [name]: e.target.value } });
  }

  render() {
    const { email, password, firstName, lastName } = this.state;

    return (
      <ApolloWrapper uri="http://localhost:4000/api">
        <Mutation mutation={CREATE_USER}>
          {(register) => {
            return (
              <form>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => this.setCredential('firstName', e)}
                />

                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => this.setCredential('lastName', e)}
                />

                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => this.setCredential('email', e)}
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => this.setCredential('password', e)}
                />

                <button
                  type="button"
                  onClick={() => this.handleRegistration(register)}
                >Register</button>
              </form>
            )
          }}
        </Mutation>
      </ApolloWrapper>
    );
  }
}

export default Register;
```

### logout(logout: Function, onSuccess: Function):void

Deletes the token from the cookie.

#### Arguments

**logout**: Function: Promise - A callback function that performs logout request on a remote server. It can be an Apollo mutate function from [`render prop function`](https://www.apollographql.com/docs/react/essentials/mutations.html#render-prop) or a custom function that returns a promise.

The function receives the following json shape as an argument:
```js
{
  variables: {
    token: 'token-from-the-cookie'
  }
}
```

Should return a promise.
>Check the GraphQL input type conventions described in the [*GraphQL conventions*](#graphql-conventions) section

**onSuccess**: Function - It is called when the logout is successful.

### logout example

```jsx
import React from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloWrapper } from '@tapgiants/graphql';
import { withAuth } from '@tapgiants/auth';

const LOGOUT = gql`
  mutation($token: String!) {
    logout(token: $token) {
      user {
        id
        email
        firstName
        lastName
        token
      }
      errors {
        key
        message
      }
    }
  }
`;

const LogoutButton = ({ auth }) => (
  <Mutation mutation={LOGOUT}>
    {(logout) => {

      return (
        <button
          type="button"
          onClick={() => {
            auth.logout(
              logout,
              () => Router.push('/login')
            )
          }}
        >Logout</button>
      );
    }}
  </Mutation>
);

const PrivatePage = ({ auth }) => {
  console.log('Logged in?', auth.loggedIn());
  console.log('User token', auth.getToken());

  return (
    <ApolloWrapper uri="http://localhost:4000/api">
      Private Content

      <LogoutButton auth={auth} />
    </ApolloWrapper>
  );
};

export default withAuth(PrivatePage, () => Router.push('/login'));
```

## GraphQL conventions

Add link to an external repo that describes all the conventions.

## Development

Link the package from your target project and run `yarn start`. This will start the webpacker watcher.

Once you are satisfied with your changes, use `yarn publish` to push the new version to npmjs.org.
