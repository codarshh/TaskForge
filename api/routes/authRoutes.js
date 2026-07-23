import express from 'express';
import {
  register,
  verifyEmail,
  login,
  oauthSimulate,
  forgotPassword,
  resetPassword,
  logout,
  deleteAccount,
  googleLogin,
  getUserData,
  saveUserData
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/oauth/simulate', oauthSimulate);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.delete('/account', requireAuth, deleteAccount);

// Google OAuth
router.post('/google', googleLogin);

// Unified Dashboard Data Persistance
router.get('/data', requireAuth, getUserData);
router.post('/data', requireAuth, saveUserData);

export default router;
