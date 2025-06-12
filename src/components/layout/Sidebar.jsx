import styled from 'styled-components';

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>YourLogo</Logo>
      <Nav>
        <NavItem>My Info.</NavItem>
        <NavItem>Blogs</NavItem>
        <NavItem className="group">General Info.</NavItem>
        <NavItem className="group">Team</NavItem>
        <NavItem className="active">Photos</NavItem>
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

const NavItem = styled.a`
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
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