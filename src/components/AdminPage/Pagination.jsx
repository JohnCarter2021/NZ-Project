import styled from 'styled-components';

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Nav>
      <PageButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
      </PageButton>
      {pageNumbers.map(number => (
        <PageButton key={number} active={number === currentPage} onClick={() => paginate(number)}>
          {number}
        </PageButton>
      ))}
      <PageButton onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
      </PageButton>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  gap: 5px;
`;

const PageButton = styled.button`
  border: 1px solid #dee2e6;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props.active ? '#1D7874' : 'white'};
  color: ${props => props.active ? 'white' : '#1D7874'};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Pagination;