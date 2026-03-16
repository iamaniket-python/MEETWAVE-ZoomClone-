import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const handelRegister = async (name, email, password) => {
    try {

      const result = await axios.post("http://localhost:8000/register", {
        name,
        email,
        password
      });

      if (result.status === 200) {
        console.log("User Registered");
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handelLogin = async (email, password) => {
    try {

      const result = await axios.post("http://localhost:8000/login", {
        email,
        password
      });

      if (result.status === 200) {
        setUser(result.data.user);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthContext.Provider value={{ handelLogin, handelRegister, user }}>
      {children}
    </AuthContext.Provider>
  );
};