import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { selectCurrentUser, logOut } from '../../features/auth/authSlice';

const Header = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  return (
    <HeaderContainer>
      <Title>Photo Managment</Title>
      <UserMenu>
        <span>🔔</span>
        <UserName>{user?.name || 'User'}</UserName>
        <button onClick={() => dispatch(logOut())}>Logout</button>
      </UserMenu>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: #1D7874;
  }
`;

const UserName = styled.span`
  font-weight: 500;
`;

export default Header;