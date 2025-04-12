import React from 'react';
import * as LoginContext from './LoginContext'; // Reusing styled components
import './style.css'; // Shared styles
import { useNavigate } from 'react-router-dom';

function StudentLogin() {
    const navigate = useNavigate();
  return (
    <LoginContext.PageWrapper>
        
      <LoginContext.Container>
        <LoginContext.SignInContainer>
          <LoginContext.Form>
            <LoginContext.Title>Student Login</LoginContext.Title>
            <LoginContext.Input type="email" placeholder="Email" />
            <LoginContext.Input type="password" placeholder="Password" />
            <LoginContext.Button>Sign In</LoginContext.Button>
            <LoginContext.Anchor href="#">Forgot your password?</LoginContext.Anchor>
          </LoginContext.Form>
        </LoginContext.SignInContainer>

        <LoginContext.OverlayContainer signinIn={false}>
          <LoginContext.Overlay signinIn={false}>
            <LoginContext.RightOverlayPanel>
              <LoginContext.Title style={{ color: '#ffffff' }}><p>Hello, Student!</p></LoginContext.Title>
              <LoginContext.Paragraph style={{ color: '#ffffff' }}>
                Access your account and manage your appointments.
              </LoginContext.Paragraph>
            </LoginContext.RightOverlayPanel>
          </LoginContext.Overlay>
        </LoginContext.OverlayContainer>
      </LoginContext.Container>
    </LoginContext.PageWrapper>
  );
}

export default StudentLogin;
