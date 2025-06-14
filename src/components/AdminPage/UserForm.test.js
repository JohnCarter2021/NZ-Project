import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserForm from './UserForm';

// Basic mock for styled-components, similar to DeleteConfirmationDialog.test.js
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

describe('UserForm Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const initialDataUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'Admin',
    status: 'Active',
  };

  beforeEach(() => {
    // Clear mock calls before each test
    mockOnClose.mockClear();
    mockOnSubmit.mockClear();
  });

  it('should not render when isOpen is false', () => {
    render(<UserForm isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.queryByText('Create User')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit User')).not.toBeInTheDocument();
  });

  it('should render for creating a user when isOpen is true and no initialData', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Create User')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument(); // Check for "Password" (case-insensitive)
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create User' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should render for editing a user when isOpen is true and initialData is provided', () => {
    render(
      <UserForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={initialDataUser}
      />
    );
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByLabelText('Name').value).toBe(initialDataUser.name);
    expect(screen.getByLabelText('Email').value).toBe(initialDataUser.email);
    expect(screen.getByLabelText(/Password/i).value).toBe(''); // Password should be blank for edit
    expect(screen.getByLabelText('Role').value).toBe(initialDataUser.role);
    expect(screen.getByLabelText('Status').value).toBe(initialDataUser.status);
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    // The ModalOverlay is the parent div with testid "mock-styled-component-div"
    const modalOverlay = screen.getByText('Create User').closest('div[data-testid="mock-styled-component-div"]');
    if (modalOverlay) {
        fireEvent.click(modalOverlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
        throw new Error("ModalOverlay (for UserForm) not found for click test.");
    }
  });

  it('should update form fields on change', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.value).toBe('New Name');

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
    expect(emailInput.value).toBe('newemail@example.com');

    const roleSelect = screen.getByLabelText('Role');
    fireEvent.change(roleSelect, { target: { value: 'Manager' } });
    expect(roleSelect.value).toBe('Manager');
  });

  it('should show validation errors for required fields (name, email)', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: 'Create User' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid email format', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });

    const submitButton = screen.getByRole('button', { name: 'Create User' });
    fireEvent.click(submitButton);

    expect(screen.getByText('Email is invalid.')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when form is valid (create mode)', () => {
    render(<UserForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Inactive' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create User' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123', // Password included for new user
      role: 'Manager',
      status: 'Inactive',
    });
  });

  it('should call onSubmit with form data (excluding password if empty) when form is valid (edit mode)', () => {
    render(
      <UserForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={initialDataUser}
      />
    );
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User Updated' } });
    // Password field is left blank

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: initialDataUser.id, // id should be part of initial data and thus part of submission implicitly
      name: 'Test User Updated',
      email: initialDataUser.email, // Email not changed in this test
      // password field is not included if it was blank during edit
      role: initialDataUser.role,   // Role not changed
      status: initialDataUser.status, // Status not changed
    });
  });

   it('should call onSubmit with form data (including password if provided) when form is valid (edit mode)', () => {
    render(
      <UserForm
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={initialDataUser}
      />
    );
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User New Pass' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'newSecurePassword' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      id: initialDataUser.id,
      name: 'Test User New Pass',
      email: initialDataUser.email,
      password: 'newSecurePassword', // Password included as it was provided
      role: initialDataUser.role,
      status: initialDataUser.status,
    });
  });

});
