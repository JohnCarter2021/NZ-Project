import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchUsers, selectAllUsers, createUser, updateUser, deleteUser } from '../features/users/usersSlice';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/AdminPage/Header';
// import UserCard from '../components/AdminPage/UserCard'; // Removed
import Pagination from '../components/AdminPage/Pagination';
import UserTable from '../components/AdminPage/UserTable'; // Added
import UserForm from '../components/AdminPage/UserForm'; // Added
import DeleteConfirmationDialog from '../components/AdminPage/DeleteConfirmationDialog'; // Added

const AdminPage = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector(selectAllUsers);
  const userStatus = useSelector((state) => state.users.status);
  // const usersError = useSelector((state) => state.users.error); // Can be used for displaying errors

  const [searchQuery, setSearchQuery] = useState('');
  // const [filterType, setFilterType] = useState('All'); // Removed filterType as UserTable doesn't use it
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8; // Or a different number suitable for table view

  // State for modals and selected user data
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [selectedUserIdsFromTable, setSelectedUserIdsFromTable] = useState([]);
  const [isBulkDeleteDialogVisible, setIsBulkDeleteDialogVisible] = useState(false);
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateType, setBulkUpdateType] = useState(null); // 'role' or 'status'

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

  // Handlers for UserForm (no changes here from previous state)
  const handleOpenCreateUserForm = () => {
    setCurrentUserToEdit(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUserToEdit(user);
    setIsUserFormOpen(true);
  };

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false);
    setCurrentUserToEdit(null);
  };

  const handleUserFormSubmit = (userData) => {
    if (currentUserToEdit) {
      dispatch(updateUser({ id: currentUserToEdit.id, ...userData }));
    } else {
      dispatch(createUser(userData));
    }
    handleCloseUserForm();
  };

  // Handlers for single user DeleteConfirmationDialog
  const handleDeleteRequest = (id) => {
    setUserIdToDelete(id);
    setIsDeleteDialogVisible(true); // Use the renamed state variable
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogVisible(false); // Use the renamed state variable
    setUserIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userIdToDelete) {
      dispatch(deleteUser(userIdToDelete));
    }
    handleCloseDeleteDialog();
  };

  // Handler for UserTable selection change
  const handleTableSelectionChange = (selectedIds) => {
    setSelectedUserIdsFromTable(selectedIds);
  };
  
  // Handlers for Bulk Delete
  const handleOpenBulkDeleteDialog = () => {
    if (selectedUserIdsFromTable.length > 0) {
      setIsBulkDeleteDialogVisible(true);
    } else {
      // Optionally, show an alert or message if no users are selected
      alert("No users selected for bulk deletion.");
    }
  };

  const handleCloseBulkDeleteDialog = () => {
    setIsBulkDeleteDialogVisible(false);
  };

  const handleConfirmBulkDelete = () => {
    selectedUserIdsFromTable.forEach(id => {
      dispatch(deleteUser(id));
    });
    handleCloseBulkDeleteDialog();
    setSelectedUserIdsFromTable([]); // Clear selection after bulk delete
  };

  // Handlers for Bulk Update (Role/Status)
  const handleOpenBulkSetRoleClick = () => {
    if (selectedUserIdsFromTable.length > 0) {
      setBulkUpdateType('role');
      setIsBulkUpdateModalOpen(true);
    } else {
      alert("No users selected.");
    }
  };

  const handleOpenBulkSetStatusClick = () => {
    if (selectedUserIdsFromTable.length > 0) {
      setBulkUpdateType('status');
      setIsBulkUpdateModalOpen(true);
    } else {
      alert("No users selected.");
    }
  };

  const handleCloseBulkUpdateModal = () => {
    setIsBulkUpdateModalOpen(false);
    setBulkUpdateType(null);
  };

  const handleConfirmBulkUpdate = (newValue) => {
    if (!bulkUpdateType || selectedUserIdsFromTable.length === 0) return;

    selectedUserIdsFromTable.forEach(id => {
      const userToUpdate = allUsers.find(user => user.id === id);
      if (userToUpdate) {
        dispatch(updateUser({
          id,
          ...userToUpdate, // Pass existing user data
          [bulkUpdateType]: newValue // Update only the specific field (role or status)
        }));
      }
    });
    handleCloseBulkUpdateModal();
    setSelectedUserIdsFromTable([]); // Clear selection
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
            <CreateUserButton onClick={handleOpenCreateUserForm}>Create User</CreateUserButton>
          </FilterBar>

          <BulkActionsContainer>
            {selectedUserIdsFromTable.length > 0 && (
              <>
                <DeleteSelectedButton onClick={handleOpenBulkDeleteDialog}>
                  Delete Selected ({selectedUserIdsFromTable.length})
                </DeleteSelectedButton>
                <BulkActionButton onClick={handleOpenBulkSetRoleClick}>
                  Set Role for Selected
                </BulkActionButton>
                <BulkActionButton onClick={handleOpenBulkSetStatusClick}>
                  Set Status for Selected
                </BulkActionButton>
              </>
            )}
          </BulkActionsContainer>

          {userStatus === 'loading' && <p>Loading users...</p>}
          {userStatus === 'succeeded' && (
            <UserTable
              users={currentUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteRequest}
              onSelectionChange={handleTableSelectionChange} // Pass callback
            />
          )}
          {/* Consider adding userStatus === 'failed' message with usersError */}
          
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

      {/* Modals */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={handleCloseUserForm}
        onSubmit={handleUserFormSubmit}
        initialData={currentUserToEdit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogVisible}
        title="Confirm Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone.`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
      <DeleteConfirmationDialog
        isOpen={isBulkDeleteDialogVisible}
        title="Confirm Bulk Deletion"
        message={`Are you sure you want to delete ${selectedUserIdsFromTable.length} selected user(s)? This action cannot be undone.`}
        onClose={handleCloseBulkDeleteDialog}
        onConfirm={handleConfirmBulkDelete}
      />
      <BulkUpdateModal
        isOpen={isBulkUpdateModalOpen}
        onClose={handleCloseBulkUpdateModal}
        onConfirm={handleConfirmBulkUpdate}
        type={bulkUpdateType}
        selectedCount={selectedUserIdsFromTable.length}
      />

    </DashboardContainer>
  );
};

// --- Styled Components ---
const BulkActionsContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap; // Allow buttons to wrap on smaller screens
`;

const BaseButton = styled.button` // Base for common button styles
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:disabled {
    cursor: not-allowed;
  }
`;

const DeleteSelectedButton = styled(BaseButton)`
  background-color: #dc3545; // Red for delete
  &:hover {
    background-color: #c82333;
  }
  &:disabled {
    background-color: #f8d7da;
  }
`;

const BulkActionButton = styled(BaseButton)`
  background-color: #007bff; // Blue for general actions
  &:hover {
    background-color: #0056b3;
  }
   &:disabled {
    background-color: #cce5ff;
  }
`;

const CreateUserButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background-color: #dc3545; // Red for delete
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c82333;
  }

  &:disabled {
    background-color: #f8d7da;
    cursor: not-allowed;
  }
`;

const CreateUserButton = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  background-color: #28a745; // Green for create
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #218838;
  }
`;

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

// const AddPhotoButton = styled.button` // Replaced by CreateUserButton
//   padding: 12px 25px;
//   border: none;
//   border-radius: 8px;
//   background-color: #1D7874;
//   color: white;
//   font-size: 1rem;
//   font-weight: 500;
//   cursor: pointer;
// `;

// const UserGrid = styled.div` // Replaced by UserTable
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//   gap: 30px;
// `;

const PaginationFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    color: #6c757d;
`;

export default AdminPage;