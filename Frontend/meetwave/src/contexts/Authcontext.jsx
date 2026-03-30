import React, { createContext, useState } from "react";
import axios from "axios";
import client from "../utils/api"; // ✅ FIXED

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const handelRegister = async (name, email, password) => {
    try {
      const result = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        {
          name,
          username: name,
          email,
          password,
        }
      );

      console.log("Register response:", result.data);
    } catch (err) {
      console.log("Register error:", err);
    }
  };

  const handelLogin = async (email, password) => {
    try {
      const result = await axios.post(
  "http://localhost:8000/api/v1/users/signin",
  {
    username: email,
    password,
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

      if (result.status === 200) {
        setUser(result.data.user);

        return {
          success: true,
          message: "Login Successfully",
        };
      }
    } catch (err) {
      console.log(err);
    }
  };
const getHistoryOfUser = async () => {
  try {
    let request = await client.get("/get_all_activity", {
      params: {
        token: localStorage.getItem("token"),
      },
    });

    return request.data?.data || request.data; // ✅ safer
  } catch (err) {
    console.log(err);
    return [];
  }
};

  const addToUserHistory = async (meetingCode) => {
    try {
      const request = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meetingCode,
      });

      return request.data;
    } catch (error) {
      console.error("Error adding to history:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        handelLogin,
        handelRegister,
        user,
        getHistoryOfUser,
        addToUserHistory,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};