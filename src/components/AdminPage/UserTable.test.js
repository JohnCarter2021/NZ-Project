import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserTable from './UserTable';

// Basic mock for styled-components
jest.mock('styled-components', () => {
    const actualStyled = jest.requireActual('styled-components');
    const MOCK_ID = 'mock-styled-component';
    const styledMock = (WrappedComponent) => {
      const ComponentToRender = typeof WrappedComponent === 'string' ? WrappedComponent : 'div';
      return React.forwardRef((props, ref) => {
        const testId = props['data-testid'] || `${MOCK_ID}-${ComponentToRender.toLowerCase()}`;
        return <ComponentToRender ref={ref} {...props} data-testid={testId} />;
      });
    };
    Object.keys(actualStyled).forEach(key => {
      styledMock[key] = actualStyled[key];
    });
    return styledMock;
  });

const mockUsers = [
  {
    id: '1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    role: 'Manager',
    status: 'Inactive',
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Suspended',
  },
];

describe('UserTable Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  it('should render "No users to display." when users array is empty', () => {
    render(<UserTable users={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No users to display.')).toBeInTheDocument();
  });

  it('should render "No users to display." when users prop is null or undefined', () => {
    render(<UserTable users={null} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No users to display.')).toBeInTheDocument();
    render(<UserTable users={undefined} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText('No users to display.')).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    render(<UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument();
  });

  it('should render user data correctly in table rows', () => {
    render(<UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    mockUsers.forEach(user => {
      expect(screen.getByRole('cell', { name: user.name })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: user.email })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: user.role })).toBeInTheDocument();
      expect(screen.getByRole('cell', { name: user.status })).toBeInTheDocument();
    });
  });

  it('should render Edit and Delete buttons for each user', () => {
    render(<UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

    expect(editButtons.length).toBe(mockUsers.length);
    expect(deleteButtons.length).toBe(mockUsers.length);
  });

  it('should call onEdit with the correct user when Edit button is clicked', () => {
    render(<UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    fireEvent.click(editButtons[0]); // Click Edit for the first user
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);

    fireEvent.click(editButtons[1]); // Click Edit for the second user
    expect(mockOnEdit).toHaveBeenCalledTimes(2);
    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[1]);
  });

  it('should call onDelete with the correct user ID when Delete button is clicked', () => {
    render(<UserTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]); // Click Delete for the first user
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockUsers[0].id);

    fireEvent.click(deleteButtons[1]); // Click Delete for the second user
    expect(mockOnDelete).toHaveBeenCalledTimes(2);
    expect(mockOnDelete).toHaveBeenCalledWith(mockUsers[1].id);
  });

  it('should display N/A if role or status is not provided for a user', () => {
    const usersWithMissingData = [
      { id: '1', name: 'Test User One', email: 'one@test.com', role: null, status: 'Active' },
      { id: '2', name: 'Test User Two', email: 'two@test.com', role: 'User', status: undefined },
    ];
    render(<UserTable users={usersWithMissingData} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // For user 1 (role is null)
    const userOneRow = screen.getByRole('cell', { name: 'Test User One' }).closest('tr');
    expect(userOneRow.cells[2].textContent).toBe('N/A'); // Role column
    expect(userOneRow.cells[3].textContent).toBe('Active'); // Status column

    // For user 2 (status is undefined)
    const userTwoRow = screen.getByRole('cell', { name: 'Test User Two' }).closest('tr');
    expect(userTwoRow.cells[2].textContent).toBe('User'); // Role column
    expect(userTwoRow.cells[3].textContent).toBe('N/A'); // Status column
  });

});
