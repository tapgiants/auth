# What is @tapgiants/auth

@tapgiants/auth provides authentication functionality.

## Installation

Install @tapgiants/auth

```bash
yarn add @tapgiants/auth
```

## Auth API

### withAuth(AuthComponent: React.Component, onLoginFailed: Function):React.Component

Renders `AuthComponent` with `auth` property instance of the `AuthService` class if `AuthService.loggedIn` returns `true`. Otherwise calls `onLoginFailed`.

#### Arguments

**AuthComponent**: React.Component - The cache argument is provided by Apollo.

**onLoginFailed**: Function - A callback function. It is executed when AuthService.loggedIn returns false.

### withAuth example
```jsx
export default () => (
  <ApolloWrapper uri="http://localhost:4001/api">

  </ApolloWrapper>
);
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

**onError**: Function - It is called when the authentication fails.

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

**onError**: Function - It is called when the registration fails.

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

## GraphQL conventions

Add link to an external repo that describes all the conventions.

## Development

Link the package from your target project and run `yarn start`. This will start the webpacker watcher.

Once you are satisfied with your changes, use `yarn publish` to push the new version to npmjs.org.
