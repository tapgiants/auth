import React from 'react';
import Router from 'next/router';
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

      Router.push('/private_page');
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
