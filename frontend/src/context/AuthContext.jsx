import { createContext, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useGetCurrentUserQuery } from '../store/features/auth/authApi';
import { setUser, clearAuth } from '../store/features/auth/authSlice';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const { data, error, isSuccess, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data));
    } else if (error) {
      dispatch(clearAuth());
    }
  }, [isSuccess, data, error, dispatch]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
