import httpStatus from "http-status";
import { User } from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid Password",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;

    await user.save();

    return res.status(httpStatus.OK).json({ token });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

// register
export const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User Already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(httpStatus.CREATED)
      .json({ message: "User succesfully Registered" });
  } catch (e) {
    res.json({ message: `somthing went wrong ${e}` });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });
    const meetings = await meetings.find({ user_id: user.user });
    res.join(meetings);
  } catch (e) {
    res.join({ messages: `Something went Wrong ${e}` });
  }
};
const addToHistory = async (req, res) => {
  const { token, meetings_code } = req.body;

  try {
    const user = await User.findOne({ token: token });

    const newMeetng = new meetings({
      user_id: user.username,
      meetingcode: meetings_code,
    });
    await newMeetng.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    res.join({ message: `something went wrong ${e}` });
  }
};

export { getUserHistory, addToHistory };
