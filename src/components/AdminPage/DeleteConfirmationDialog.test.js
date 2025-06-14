import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import styled from 'styled-components';

// Mock styled-components to avoid issues with them in test environment if not using a full setup
// This is a basic mock. For more complex scenarios, you might need a more sophisticated approach.
jest.mock('styled-components', () => {
  const actualStyled = jest.requireActual('styled-components');
  const MOCK_ID = 'mock-styled-component'; // Unique ID for mocked components
  const styledMock = (WrappedComponent) => {
    // Check if WrappedComponent is a string (e.g., 'div', 'button') or a React component
    const ComponentToRender = typeof WrappedComponent === 'string' ? WrappedComponent : 'div';
    return React.forwardRef((props, ref) => {
      // Add a data-testid to easily identify mocked components
      const testId = props['data-testid'] || `${MOCK_ID}-${ComponentToRender}`;
      return <ComponentToRender ref={ref} {...props} data-testid={testId} />;
    });
  };

  // Allow actualStyled to be used where needed (e.g., actualStyled.div)
  Object.keys(actualStyled).forEach(key => {
    styledMock[key] = actualStyled[key];
  });

  return styledMock;
});


describe('DeleteConfirmationDialog Component', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  it('should not render when isOpen is false', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
  });

  it('should render correctly when isOpen is true', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this user?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onConfirm when Delete button is clicked', () => {
    render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when overlay is clicked', () => {
     render(
      <DeleteConfirmationDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );
    // The ModalOverlay is the parent div that gets the onClick for close
    // It will have a test id like 'mock-styled-component-div' if styled.div was used
    // Or find it by its role if appropriate, or a more specific test-id if you added one to ModalOverlay
    const modalOverlay = screen.getByText('Confirm Deletion').closest('div[data-testid^="mock-styled-component"]');
    if (modalOverlay) {
        fireEvent.click(modalOverlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
        throw new Error("ModalOverlay not found for click test. Check styled-components mock or component structure.");
    }
  });
});
