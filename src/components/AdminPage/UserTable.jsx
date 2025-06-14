import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto; // Allows horizontal scrolling on smaller screens
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #f8f9fa; // Light gray background for header
`;

const TableHeaderCell = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #dee2e6; // Separator for header
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9; // Zebra striping for rows
  }
  &:hover {
    background-color: #f1f1f1; // Highlight on hover
  }
`;

const TableCell = styled.td`
  padding: 10px 15px;
  text-align: left;
  color: #555;
  border-bottom: 1px solid #eee; // Light border for cells
  vertical-align: middle; // Ensure checkbox and text are aligned
`;

const CheckboxHeaderCell = styled(TableHeaderCell)`
  width: 50px; // Adjust as needed
  text-align: center;
`;

const CheckboxCell = styled(TableCell)`
  text-align: center;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s ease-in-out;

  &:last-child {
    margin-right: 0;
  }
`;

const EditButton = styled(ActionButton)`
  background-color: #ffc107; // Yellow for edit
  color: #333;
  &:hover {
    background-color: #e0a800;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #dc3545; // Red for delete
  color: white;
  &:hover {
    background-color: #c82333;
  }
`;

const UserTable = ({ users, onEdit, onDelete, onSelectionChange }) => {
  const [selectedUserIds, setSelectedUserIds] = React.useState(new Set());

  // Effect to update parent component when selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedUserIds));
    }
  }, [selectedUserIds, onSelectionChange]);

  // Effect to reset selection when users list changes (e.g. pagination, filtering)
  // This prevents stale selections if users causing selection are no longer visible.
  React.useEffect(() => {
    setSelectedUserIds(new Set());
  }, [users]);


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const allUserIds = new Set(users.map(user => user.id));
      setSelectedUserIds(allUserIds);
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleUserSelectClick = (event, userId) => {
    const newSelectedUserIds = new Set(selectedUserIds);
    if (event.target.checked) {
      newSelectedUserIds.add(userId);
    } else {
      newSelectedUserIds.delete(userId);
    }
    setSelectedUserIds(newSelectedUserIds);
  };

  const isAllSelected = users && users.length > 0 && selectedUserIds.size === users.length;
  // Determine if the header checkbox should be indeterminate or checked
  const isHeaderIndeterminate = selectedUserIds.size > 0 && selectedUserIds.size < users.length;


  if (!users || users.length === 0) {
    return <p>No users to display.</p>;
  }

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <CheckboxHeaderCell>
              <input
                type="checkbox"
                ref={el => el && (el.indeterminate = isHeaderIndeterminate)}
                checked={isAllSelected}
                onChange={handleSelectAllClick}
                disabled={users.length === 0}
              />
            </CheckboxHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {users.map((user) => (
            <TableRow key={user.id} style={selectedUserIds.has(user.id) ? { backgroundColor: '#e6f7ff' } : {}}>
              <CheckboxCell>
                <input
                  type="checkbox"
                  checked={selectedUserIds.has(user.id)}
                  onChange={(event) => handleUserSelectClick(event, user.id)}
                />
              </CheckboxCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role || 'N/A'}</TableCell>
              <TableCell>{user.status || 'N/A'}</TableCell>
              <TableCell>
                <EditButton onClick={() => onEdit(user)}>Edit</EditButton>
                <DeleteButton onClick={() => onDelete(user.id)}>Delete</DeleteButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default UserTable;
