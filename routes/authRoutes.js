const express = require("express");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Register
router.post("/register", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details);

  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash: hash
  });

  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const valid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) return res.status(400).json({ msg: "Wrong password" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({ accessToken, refreshToken });
});

module.exports = router;