import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      try {
        const decoded = jwtDecode(token);
        setUser({ name: decoded.name, id: decoded.id });
      } catch (err) {
        console.error('Invalid token', err);
        setUser(null);
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false); // ✅ Always mark loading complete
  }, [token]);

  const login = (tkn) => {
    setLoading(true);  // Optional: if you want to reset loading during login
    setToken(tkn);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
