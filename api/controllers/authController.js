import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService.js';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'taskforge_jwt_access_secret_key_987654321';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
};

export const register = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingEmail = await dbService.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const existingUsername = await dbService.findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    const user = await dbService.createUser({
      fullName,
      username,
      email,
      passwordHash,
      verificationToken: verificationCode,
      verificationTokenExpires,
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
    });

    return res.status(201).json({
      message: 'Verification code sent to email!',
      email: user.email,
      simulatedCode: verificationCode // Return simulation code for client fallback
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ message: 'Email and verification code are required' });
  }

  try {
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationToken !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.verificationTokenExpires && Date.now() > user.verificationTokenExpires) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    const updatedUser = await dbService.updateUser(user._id, {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null
    });

    const accessToken = generateToken(updatedUser._id);

    // Remove passwordHash from user object before sending
    const userResponse = updatedUser.toObject ? updatedUser.toObject() : { ...updatedUser };
    delete userResponse.passwordHash;

    return res.status(200).json({
      message: 'Email verified successfully!',
      accessToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      // Regenerate verification code if unverified
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationTokenExpires = Date.now() + 15 * 60 * 1000;

      await dbService.updateUser(user._id, {
        verificationToken: verificationCode,
        verificationTokenExpires
      });

      return res.status(200).json({
        unverified: true,
        email: user.email,
        simulatedCode: verificationCode
      });
    }

    const accessToken = generateToken(user._id);

    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.passwordHash;

    return res.status(200).json({
      accessToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const oauthSimulate = async (req, res) => {
  const { provider, oauthId, email, fullName, profileImage, username } = req.body;
  if (!provider || !email || !fullName) {
    return res.status(400).json({ message: 'Provider, email, and fullName are required' });
  }

  try {
    let user = await dbService.findUserByEmail(email);
    const oauthField = provider.toLowerCase() + 'Id';

    if (user) {
      // Link provider if not already linked
      const providers = user.authProviders || [];
      if (!providers.includes(provider)) {
        providers.push(provider);
      }
      user = await dbService.updateUser(user._id, {
        authProviders: providers,
        [oauthField]: oauthId,
        emailVerified: true // OAuth implies verified
      });
    } else {
      // Create new user for OAuth
      const mockPasswordHash = await bcrypt.hash('oauth_fallback_password_123', 10);
      user = await dbService.createUser({
        fullName,
        username: username || email.split('@')[0],
        email,
        passwordHash: mockPasswordHash,
        authProviders: [provider],
        [oauthField]: oauthId,
        profileImage: profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        emailVerified: true
      });
    }

    const accessToken = generateToken(user._id);

    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.passwordHash;

    return res.status(200).json({
      accessToken,
      user: userResponse
    });
  } catch (error) {
    console.error('OAuth simulate error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email' });
    }

    const simulatedToken = Math.random().toString(36).substr(2, 12);
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await dbService.updateUser(user._id, {
      verificationToken: simulatedToken,
      verificationTokenExpires: resetPasswordExpires
    });

    return res.status(200).json({
      message: 'Password reset link sent to your email!',
      email,
      simulatedToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Read from DB to find the user with this token
    let user;
    if (global.isMockDB) {
      const fs = await import('fs');
      const path = await import('path');
      const MOCK_DB_PATH = path.resolve('api/mock_db.json');
      if (fs.existsSync(MOCK_DB_PATH)) {
        const db = JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
        user = db.users.find(u => u.verificationToken === token) || null;
      }
    } else {
      const mongoose = await import('mongoose');
      const User = mongoose.model('User');
      user = await User.findOne({ verificationToken: token });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (user.verificationTokenExpires && Date.now() > user.verificationTokenExpires) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await dbService.updateUser(user._id, {
      passwordHash,
      verificationToken: null,
      verificationTokenExpires: null
    });

    return res.status(200).json({ message: 'Password reset successful!' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

export const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  try {
    const deleted = await dbService.deleteUser(userId);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const googleLogin = async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ message: 'Google access token is required' });
  }

  try {
    // Call Google's userinfo endpoint using the access token
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const googleUser = await googleResponse.json();

    if (!googleResponse.ok || !googleUser.email) {
      return res.status(400).json({ message: 'Invalid or expired Google access token' });
    }

    const { email, name, sub, picture } = googleUser;

    let user = await dbService.findUserByEmail(email);
    if (user) {
      // Link Google provider if not already linked
      const providers = user.authProviders || [];
      if (!providers.includes('Google')) {
        providers.push('Google');
      }
      user = await dbService.updateUser(user._id, {
        authProviders: providers,
        googleId: sub,
        emailVerified: true
      });
    } else {
      // Create new user for Google login
      const mockPasswordHash = await bcrypt.hash('google_fallback_password_123', 10);
      user = await dbService.createUser({
        fullName: name,
        username: email.split('@')[0],
        email,
        passwordHash: mockPasswordHash,
        authProviders: ['Google'],
        googleId: sub,
        profileImage: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        emailVerified: true
      });
    }

    const newAccessToken = generateToken(user._id);

    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.passwordHash;

    return res.status(200).json({
      accessToken: newAccessToken,
      user: userResponse
    });
  } catch (error) {
    console.error('Google OAuth backend error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const githubCallback = async (req, res) => {
  const { code } = req.query;
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  
  const frontendUrl = (host.includes('localhost') || host.includes('127.0.0.1'))
    ? 'http://localhost:5173'
    : `${protocol}://${host}`;

  if (!code) {
    return res.redirect(`${frontendUrl}/?error=no_code_provided`);
  }

  try {
    const redirect_uri = `${protocol}://${host}/api/auth/github/callback`;

    // Exchange Authorization Code for Access Token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri
      })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token || tokenData.error) {
      console.error('GitHub token exchange failed. Response status:', tokenResponse.status, 'Data:', tokenData);
      const errDetails = tokenData.error_description || tokenData.error || 'token_exchange_failed';
      return res.redirect(`${frontendUrl}/?error=${encodeURIComponent(errDetails)}`);
    }

    const githubAccessToken = tokenData.access_token;

    // Fetch user details
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubAccessToken}`,
        'User-Agent': 'TaskForge-App'
      }
    });

    const githubUser = await userResponse.json();
    if (!userResponse.ok || !githubUser.id) {
      console.error('GitHub user profile fetch failed:', githubUser);
      return res.redirect(`${frontendUrl}/?error=profile_fetch_failed`);
    }

    // Fetch user emails (since user.email might be private)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        'Authorization': `Bearer ${githubAccessToken}`,
        'User-Agent': 'TaskForge-App'
      }
    });

    let email = githubUser.email;
    if (emailsResponse.ok) {
      const emails = await emailsResponse.json();
      const primaryEmail = emails.find(e => e.primary);
      if (primaryEmail) {
        email = primaryEmail.email;
      } else if (emails.length > 0) {
        email = emails[0].email;
      }
    }

    if (!email) {
      email = `${githubUser.login}@users.noreply.github.com`;
    }

    let user = await dbService.findUserByEmail(email);
    if (user) {
      // Link GitHub provider if not already linked
      const providers = user.authProviders || [];
      if (!providers.includes('GitHub')) {
        providers.push('GitHub');
      }
      user = await dbService.updateUser(user._id, {
        authProviders: providers,
        githubId: githubUser.id.toString(),
        emailVerified: true
      });
    } else {
      const mockPasswordHash = await bcrypt.hash('github_fallback_password_123', 10);
      user = await dbService.createUser({
        fullName: githubUser.name || githubUser.login,
        username: githubUser.login || email.split('@')[0],
        email,
        passwordHash: mockPasswordHash,
        authProviders: ['GitHub'],
        githubId: githubUser.id.toString(),
        profileImage: githubUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(githubUser.name || githubUser.login)}`,
        emailVerified: true
      });
    }

    const newAccessToken = generateToken(user._id);

    const userObj = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      bio: user.bio || 'Productivity Explorer',
      profileImage: user.profileImage,
      authProviders: user.authProviders
    };

    // Redirect user to the frontend with token and user object
    return res.redirect(
      `${frontendUrl}/?token=${newAccessToken}&user=${encodeURIComponent(JSON.stringify(userObj))}`
    );
  } catch (error) {
    console.error('GitHub OAuth backend error:', error);
    return res.redirect(`${frontendUrl}/?error=server_error`);
  }
};


export const getUserData = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await dbService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      tasks: user.tasks || [],
      futureTasks: user.futureTasks || [],
      weeklyObjectives: user.weeklyObjectives || [],
      monthlyGoals: user.monthlyGoals || [],
      history: user.history || {},
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        authProviders: user.authProviders
      }
    });
  } catch (error) {
    console.error('Get user data error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveUserData = async (req, res) => {
  const userId = req.user._id;
  const { tasks, futureTasks, weeklyObjectives, monthlyGoals, history } = req.body;

  try {
    const updated = await dbService.updateUser(userId, {
      tasks: tasks || [],
      futureTasks: futureTasks || [],
      weeklyObjectives: weeklyObjectives || [],
      monthlyGoals: monthlyGoals || [],
      history: history || {}
    });

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Save user data error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
