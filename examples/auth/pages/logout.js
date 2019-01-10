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
