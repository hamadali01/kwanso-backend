import express from 'express';
import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secret = process.env.SECRET || "bhvycdfqyv"

  if (token == null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secret, async (err, id) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await User.findById(id.userId)
    req.user = user;
    console.log(req.user)
    next();
  });
};

router.use(authenticateToken);

router.post('/create-task', async (req, res) => {
  try {
    const { name } = req.body;
    const newTask = new Task({ name });
    await newTask.save();
    res.json({ task: { id: newTask._id, name: newTask.name } });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/list-tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/user', async (req, res) => {
  try {
    res.json({user:{
      id:req.user._id,
      email: req.user.email
    }})
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });    
  }
})

export default router;
