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
