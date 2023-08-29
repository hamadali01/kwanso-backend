import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(` email: ${email} password ${password}`, req.body)
    if (!email || !password) {
      return res.json({Credential:"empty"})
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({response:"user already exist"})
    }
    let salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    console.log(newUser)
    await newUser.save();
    res.json({ user: { id: newUser._id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log("error", error)
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const secret = process.env.SECRET || "bhvycdfqyv"
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, secret);
    res.json({ jwt: token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
