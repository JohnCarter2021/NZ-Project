import React from 'react';
import styled from 'styled-components';

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
  z-index: 1000; // Ensure it's above other content
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.25rem;
  color: #333;
`;

const Message = styled.p`
  margin-bottom: 20px;
  font-size: 1rem;
  color: #555;
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
  transition: background-color 0.2s ease-in-out;

  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #d9534f; // Red for delete
  color: white;

  &:hover {
    background-color: #c9302c;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0; // Light gray
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  const dialogTitle = title || 'Confirm Deletion';
  const dialogMessage = message || 'Are you sure you want to perform this action?';

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}> {/* Prevents closing when clicking inside content */}
        <Title>{dialogTitle}</Title>
        <Message>{dialogMessage}</Message>
        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton> {/* Changed from "Delete" to "Confirm" for generic use */}
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmationDialog;
