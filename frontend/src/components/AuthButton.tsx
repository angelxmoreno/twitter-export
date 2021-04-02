import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { TwitterLoginButton } from 'react-social-login-buttons';
import { NavbarText } from 'reactstrap';
import { useStore } from '../mobx';

const buttonStyles = {
  fontSize: 16,
  height: 30,
  width: 'auto',
};
const AuthButton: FC = () => {
  const { authStore } = useStore();

  const handleLogIn = async () => {
    window.location.href = await authStore.getLogInUrl();
  };

  const handleLogOut = () => {
    authStore.unsetUser();
  };

  return authStore.isAuthenticated ? (
    <>
      <NavbarText>logged in as @{authStore.user?.screenName}</NavbarText>
      <TwitterLoginButton text="Log Out" onClick={handleLogOut} style={buttonStyles} />
    </>
  ) : (
    <TwitterLoginButton
      preventActiveStyles={authStore.isLoading}
      text={authStore.isLoading ? '...loading' : 'Log In with Twitter'}
      onClick={handleLogIn}
      style={buttonStyles}
    />
  );
};

export default observer(AuthButton);
