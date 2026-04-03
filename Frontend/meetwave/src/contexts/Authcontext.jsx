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
          username: email,
          email,
          password,
        },
      );

      console.log("Register response:", result.data);
    } catch (err) {
      console.log("Register error:", err);
    }
  };

  const handelLogin = async (email, password) => {
  try {
    // ✅ DEBUG
    console.log("Sending:", {
      username: email,
      password: password,
    });

    const result = await axios.post(
      "http://localhost:8000/api/v1/users/signin",
      {
        username: email,
        password: password,
      }
    );

    console.log("Response:", result.data);

    if (result.status === 200) {
      setUser(result.data.user);
      localStorage.setItem("token", result.data.token);

      return {
        success: true,
        message: "Login Successfully",
      };
    }
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
};
  const getHistoryOfUser = async () => {
    try {
      let request = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });

      return request.data?.data || request.data;
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
