import React from 'react';
import AuthService from './AuthService'

export default function withAuth(AuthComponent, onLoginFailed) {
  const Auth = new AuthService();

  return class Authenticated extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isLoading: true
      };
    }

    componentDidMount() {
      if (!Auth.loggedIn()) {
        onLoginFailed();
      }
      this.setState({ isLoading: false })
    }

    render() {
      return (
        <React.Fragment>
          {this.state.isLoading ? (
            <React.Fragment>LOADING....</React.Fragment>
          ) : (Auth.loggedIn() ?
            <AuthComponent {...this.props} auth={Auth} /> : null
            )}
        </React.Fragment>
      )
    }
  }
}
