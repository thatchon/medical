const initialState = {
  user: null,
  role: null
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'CLEAR_USER':
      return initialState;
    default:
      return state;
  }
};

