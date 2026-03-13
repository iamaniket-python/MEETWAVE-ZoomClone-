import httpStatus from "http-status";
import { User } from "../models/user.js";
import bcrypt, { hash } from "bcrypt";
import crypto  from "crypto";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "User Not Found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Invalid Password"
            });
        }

        const token = crypto.randomBytes(20).toString("hex");
        user.token = token;

        await user.save();

        return res.status(httpStatus.OK).json({ token });

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: error.message
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

