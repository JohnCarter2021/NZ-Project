import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Re-using ModalOverlay from DeleteConfirmationDialog or define locally if preferred
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
  text-align: center;
`;

const StyledForm = styled.form``;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.9rem;
  background-color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease-in-out;
`;

const SubmitButton = styled(Button)`
  background-color: #007bff; // Primary blue
  color: white;
  &:hover {
    background-color: #0056b3;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
`;


const UserForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User', // Default role
    status: 'Active', // Default status
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' }); // Clear password for edit
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'User',
        status: 'Active',
      });
    }
    setErrors({}); // Clear errors when form opens or data changes
  }, [initialData, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: null}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    // Password is not required for editing, only for creation if desired
    // For this component, we'll make it optional for edit, but if provided, it should be submittable.
    // If it's a new user (no initialData) and password is empty, it could be an error.
    // However, the subtask implies password is optional for edit, so we won't enforce it here.
    // The backend will handle if password is required for creation.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = { ...formData };
      if (!initialData || (initialData && formData.password === '')) {
        // If it's a new user, or if it's an existing user and password field is empty,
        // don't submit the password field.
        // The backend should handle password updates separately or ignore empty passwords during update.
        // For this component, if password is empty, we assume it's not being changed.
        delete dataToSubmit.password;
      }
      onSubmit(dataToSubmit);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <Title>{initialData ? 'Edit User' : 'Create User'}</Title>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password {initialData ? '(leave blank to keep current)' : ''}</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {/* No error message for password for now, can be added if strict rules are needed */}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </Select>
          </FormGroup>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
            <SubmitButton type="submit">{initialData ? 'Save Changes' : 'Create User'}</SubmitButton>
          </ButtonGroup>
        </StyledForm>
      </FormContainer>
    </ModalOverlay>
  );
};

export default UserForm;
