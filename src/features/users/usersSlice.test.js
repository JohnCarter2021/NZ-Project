import usersReducer, {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from './usersSlice';
import axios from 'axios';

// Mock axios
jest.mock('axios');

const initialState = {
  users: [],
  status: 'idle',
  error: null,
};

describe('usersSlice', () => {
  it('should return the initial state', () => {
    expect(usersReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('fetchUsers async thunk', () => {
    it('should handle fetchUsers.pending', () => {
      const action = { type: fetchUsers.pending.type };
      const state = usersReducer(initialState, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should handle fetchUsers.fulfilled', () => {
      const mockUsers = [{ id: 1, name: 'Test User' }];
      const action = { type: fetchUsers.fulfilled.type, payload: mockUsers };
      const state = usersReducer(initialState, action);
      expect(state.status).toBe('succeeded');
      expect(state.users).toEqual(mockUsers);
    });

    it('should handle fetchUsers.rejected', () => {
      const errorMessage = 'Failed to fetch users';
      const action = { type: fetchUsers.rejected.type, payload: errorMessage };
      const state = usersReducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('createUser async thunk', () => {
    it('should handle createUser.fulfilled', () => {
      const newUser = { id: 1, name: 'New User', email: 'new@example.com', role: 'User', status: 'Active' };
      // The backend returns { message: '...', user: newUser }
      const action = { type: createUser.fulfilled.type, payload: { message: 'User created', user: newUser } };
      const state = usersReducer(initialState, action);
      expect(state.status).toBe('succeeded'); // Assuming status is set to succeeded by the reducer
      expect(state.users).toContainEqual(newUser);
    });
  });

  describe('updateUser async thunk', () => {
    it('should handle updateUser.fulfilled', () => {
      const existingUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'User', status: 'Active' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'Manager', status: 'Inactive' },
      ];
      const updatedUser = { id: 1, name: 'User 1 Updated', email: 'user1updated@example.com', role: 'Admin', status: 'Suspended' };
      // The backend returns { message: '...', user: updatedUser }
      const action = { type: updateUser.fulfilled.type, payload: { message: 'User updated', user: updatedUser } };
      const state = usersReducer({ ...initialState, users: existingUsers }, action);
      expect(state.status).toBe('succeeded');
      expect(state.users.find(user => user.id === 1)).toEqual(updatedUser);
      expect(state.users.find(user => user.id === 2)).toEqual(existingUsers[1]); // Ensure other users are not affected
    });
  });

  describe('deleteUser async thunk', () => {
    it('should handle deleteUser.fulfilled', () => {
      const existingUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ];
      const userIdToDelete = 1;
      // The thunk returns the userId
      const action = { type: deleteUser.fulfilled.type, payload: userIdToDelete };
      const state = usersReducer({ ...initialState, users: existingUsers }, action);
      expect(state.status).toBe('succeeded');
      expect(state.users.find(user => user.id === userIdToDelete)).toBeUndefined();
      expect(state.users.length).toBe(1);
      expect(state.users[0].id).toBe(2);
    });
  });
});
