import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchUsers, selectAllUsers } from '../features/users/usersSlice';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/AdminPage/Header';
import UserCard from '../components/AdminPage/UserCard';
import Pagination from '../components/AdminPage/Pagination';

const AdminPage = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const userStatus = useSelector((state) => state.users.status);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Even, Odd, Prime
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [userStatus, dispatch]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
  };

  return (
    <DashboardContainer>
      <Sidebar />
      <MainContent>
        <Header />
        <ContentBody>
          <FilterBar>
            <SearchInput
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
            />
            <StyledSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All</option>
                <option value="Even">Even</option>
                <option value="Odd">Odd</option>
                <option value="Prime">Prime</option>
            </StyledSelect>
            <AddPhotoButton>Add Photo</AddPhotoButton>
          </FilterBar>

          <UserGrid>
            {userStatus === 'loading' && <p>Loading users...</p>}
            {userStatus === 'succeeded' &&
              currentUsers.map((user) => (
                <UserCard key={user.id} user={user} filterType={filterType} isPrime={isPrime} />
              ))}
          </UserGrid>
          
          <PaginationFooter>
             <p>Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries</p>
             <Pagination
                usersPerPage={usersPerPage}
                totalUsers={filteredUsers.length}
                paginate={paginate}
                currentPage={currentPage}
             />
          </PaginationFooter>
        </ContentBody>
      </MainContent>
    </DashboardContainer>
  );
};

// --- Styled Components ---

const DashboardContainer = styled.div`
  display: flex;
  background-color: #F8F9FA;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ContentBody = styled.div`
  padding: 30px;
  background-color: #fff;
  margin: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const FilterBar = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
`;

const StyledSelect = styled.select`
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  min-width: 150px;
`;

const AddPhotoButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  background-color: #1D7874;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
`;

const PaginationFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    color: #6c757d;
`;

export default AdminPage;