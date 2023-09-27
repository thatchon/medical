export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user
});

export const setRole = (role) => ({
  type: 'SET_ROLE',
  payload: role
});

export const clearUser = () => ({
  type: 'CLEAR_USER'
});