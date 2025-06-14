import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Re-using common modal styled components (can be imported from a shared file if available)
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

const ModalContent = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
  color: #333;
`;

const SelectGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
  text-align: left;
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
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 100px;
  transition: background-color 0.2s ease-in-out;
`;

const ConfirmButton = styled(Button)`
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

const BulkUpdateModal = ({ isOpen, onClose, onConfirm, type, selectedCount }) => {
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Reset selected value when modal opens or type changes
    if (isOpen) {
      if (type === 'role') {
        setSelectedValue('User'); // Default role
      } else if (type === 'status') {
        setSelectedValue('Active'); // Default status
      } else {
        setSelectedValue('');
      }
    }
  }, [isOpen, type]);

  if (!isOpen || !type || selectedCount === 0) {
    return null;
  }

  const handleConfirmClick = () => {
    if (selectedValue) {
      onConfirm(selectedValue);
    }
  };

  const titleCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Set {titleCase(type)} for {selectedCount} User(s)</Title>

        <SelectGroup>
          <Label htmlFor="bulkUpdateSelect">Select New {titleCase(type)}:</Label>
          <Select
            id="bulkUpdateSelect"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {type === 'role' && (
              <>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </>
            )}
            {type === 'status' && (
              <>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </>
            )}
          </Select>
        </SelectGroup>

        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={handleConfirmClick} disabled={!selectedValue}>
            Confirm
          </ConfirmButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BulkUpdateModal;
