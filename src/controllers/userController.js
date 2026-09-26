import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import { checkPasswordStrength } from "../utls/passwordCheck.js";
import { sendEmail } from "../services/emailService.js";
import jwt from "jsonwebtoken";
import { Loadout } from "../models/loadoutModel.js";
import mongoose from "mongoose";

const createVerificationCode = () => {
  const code = crypto.randomInt(100000, 1000000);
  return code;
};

const generateJwt = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be 8 characters long" });
    }

    const passwordCheck = checkPasswordStrength(password);

    console.log(passwordCheck);

    if (!passwordCheck.isAcceptable) {
      return res.status(400).json({
        error: "Please create a strong password",
        suggestions: passwordCheck.suggestions,
      });
    }

    const cleanedEmail = email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      email: cleanedEmail,
      name,
      passwordHash,
    });

    const verificationCode = createVerificationCode();

    const verificationCodeExpiry = Date.now() + 5 * 60 * 1000;

    createdUser.verificationCode = verificationCode;
    createdUser.verificationCodeExpiry = verificationCodeExpiry;

    await createdUser.save();

    await sendEmail(name, cleanedEmail, "Frag Forge verification Code", {
      title: "Verify your email",
      body: `Your verification code is <strong style="color:#ffffff; font-size:20px;">${verificationCode}</strong>. This code expires in 5 minutes.`,
    });

    return res
      .status(201)
      .json({ message: `Verification email sent to ${cleanedEmail}` });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({
        error: "Email and code are required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or code",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        error: "User already verified",
      });
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return res.status(400).json({
        error: "Invalid email or code",
      });
    }

    if (user.verificationCodeExpiry < Date.now()) {
      return res.status(400).json({
        error: "Code is expired, please resend code.",
      });
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;

    await user.save();
    const token = generateJwt(user._id);

    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      res.status(400).json({ error: "Invalid email or password" });
    }

    const passMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passMatch) {
      res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateJwt(user._id);

    return res.status(200).json({ token, user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const saveLoadout = async (req, res, next) => {
  const { loadoutId } = req.body;

  try {
    if (!loadoutId || !mongoose.Types.ObjectId.isValid(loadoutId)) {
      return res.status(400).json({ error: "LoadoutId is required" });
    }

    const exists = await Loadout.exists({ _id: loadoutId });

    if (!exists) {
      return res.status(404).json({ error: "Loadout not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { savedBuilds: loadoutId } },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const unsaveLoadout = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ error: "LoadoutId is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $pull: {
          savedBuilds: id,
        },
      },
      {
        new: true,
      },
    );

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { register, verifyEmail, login, saveLoadout, unsaveLoadout };
