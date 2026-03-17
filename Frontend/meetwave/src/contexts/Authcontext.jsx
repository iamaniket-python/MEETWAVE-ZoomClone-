import React, { createContext, useState } from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const handelRegister = async (name, email, password) => {
    try {
      const result = await axios.post("http://localhost:8000/api/v1/users/register", {
        name,
        username:name,
        email,
        password
      });

      console.log("Register response:", result.data);

    } catch (err) {
      console.log("Register error:", err);
    }
  };

  const handelLogin = async (email, password) => {
    try {

      const result = await axios.post("http://localhost:8000/api/v1/users/login", {
        username:email,
        password
      });

      if (result.status === 200) {
        setUser(result.data.user);

        return {
          success:true,
          message :"Login Succssfully"
        };
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