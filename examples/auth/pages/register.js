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
