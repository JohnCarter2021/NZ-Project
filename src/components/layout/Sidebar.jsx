import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>YourLogo</Logo>
      <Nav>
        <NavItem to="/my-info">My Info.</NavItem>
        <NavItem to="/blogs">Blogs</NavItem>
        <NavItem to="/general-info" className="group">General Info.</NavItem>
        <NavItem to="/team" className="group">Team</NavItem>
        <NavItem to="/">Photos</NavItem>
      </Nav>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 280px;
  background-color: #1D7874;
  color: white;
  padding: 30px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 50px;
  padding-left: 15px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(NavLink)`
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  text-decoration: none; // Add this to remove default underline from NavLink
  color: white; // Ensure text color is white

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active { // This class is automatically applied by NavLink
    background-color: white;
    color: #1D7874;
    position: relative;
    
    // Creates the curved edge effect
    &::after {
        content: '';
        position: absolute;
        bottom: -30px;
        right: 0;
        height: 30px;
        width: 30px;
        background-color: white;
        clip-path: path('M0 30 L0 0 C15 0 30 15 30 30 Z');
    }
  }

  &.group {
    // Styling for items with dropdown arrows (not implemented)
    position: relative;
    &::before {
      content: '>';
      position: absolute;
      right: 20px;
      transform: rotate(90deg);
    }
  }
`;

export default Sidebar;