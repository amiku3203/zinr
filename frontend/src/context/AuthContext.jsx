 import { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useGetCurrentUserQuery } from '../store/features/auth/authApi';
 
import { setUser ,clearAuth} from '../store/features/auth/authSlice';
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { data, error, isSuccess } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setUser(data.data));
    } else if (error) {
      dispatch(clearAuth());
    }
  }, [isSuccess, data, error, dispatch]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}
