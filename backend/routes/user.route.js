// user.route.js
import express from 'express';
import { register, login, logout, updateProfile } from '../controllers/user.controller.js';
import isAuthenticated from "../middlewares/isAuthnicated.js";


const router = express.Router();

// Define routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile',isAuthenticated, updateProfile);

export default router;
