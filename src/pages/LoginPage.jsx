import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { setCredentials } from '../features/auth/authSlice';

// A simple SVG eye icon component for better UI
const EyeIcon = ({ closed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {closed ? (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    )}
  </svg>
);


const LoginPage = () => {
  const [email, setEmail] = useState('niravparmar@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 1. State for password visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      dispatch(setCredentials({ user, token }));
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    }
  };

  return (
    <LoginPageContainer>
      <LoginPanel>
        <WelcomeHeader>Welcome to Nusukh!</WelcomeHeader>
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>
          
          {/* 2. UPDATED: Password input section */}
          <InputGroup>
            <Label>Password</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <PasswordToggleButton 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon closed={showPassword} />
              </PasswordToggleButton>
            </PasswordWrapper>
          </InputGroup>

          <OptionsContainer>
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#">Forgot Password?</a>
          </OptionsContainer>
          <LoginButton type="submit">LOG IN</LoginButton>
        </Form>
      </LoginPanel>
      <DecorativePanel>
        <FooterText>Nusukh Haramain Technologies Pvt Ltd</FooterText>
      </DecorativePanel>
    </LoginPageContainer>
  );
};

// --- Styled Components ---

const ErrorMessage = styled.p`
    color: #842029;
    background-color: #f8d7da;
    border: 1px solid #f5c2c7;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 0.9rem;
`;

const LoginPageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fff;
`;

const LoginPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  max-width: 600px;
`;

const WelcomeHeader = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 40px;
  align-self: flex-start;
  max-width: 400px;
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #6c757d;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
`;

// 3. ADDED: Styled-components for the password toggle feature
const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  
  /* Add padding to the input *within* this wrapper to make space for the button */
  & > ${Input} {
    padding-right: 50px; 
  }
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6c757d;

  &:hover {
    color: #343a40;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 0.9rem;

  a {
    color: #1D7874;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background-color: #1D7874;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #18625f;
  }
`;

const DecorativePanel = styled.div`
  flex: 1;
  background-color: #1D7874;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 40px;
`;

const FooterText = styled.p`
  color: white;
  font-size: 1rem;
`;

export default LoginPage;