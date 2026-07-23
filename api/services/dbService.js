import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOCK_DB_PATH = path.resolve(__dirname, '../mock_db.json');

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  profileImage: { type: String },
  bio: { type: String, default: 'Productivity Explorer' },
  authProviders: { type: [String], default: ['Email'] },
  googleId: { type: String, default: null },
  githubId: { type: String, default: null },
  emailVerified: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  perfectDays: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 0 },
  achievements: { type: [String], default: [] },
  refreshTokens: { type: [String], default: [] },
  verificationToken: { type: String, default: null },
  verificationTokenExpires: { type: Number, default: null },
  
  // Dashboard persistence fields
  tasks: { type: Array, default: [] },
  futureTasks: { type: Array, default: [] },
  weeklyObjectives: { type: Array, default: [] },
  monthlyGoals: { type: Array, default: [] },
  history: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

let User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', userSchema);
}

// Read from mock_db.json
const readMockDB = () => {
  try {
    if (!fs.existsSync(MOCK_DB_PATH)) {
      fs.writeFileSync(MOCK_DB_PATH, JSON.stringify({ users: [] }, null, 2));
    }
    const data = fs.readFileSync(MOCK_DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading mock_db.json:', error);
    return { users: [] };
  }
};

// Write to mock_db.json
const writeMockDB = (data) => {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing mock_db.json:', error);
  }
};

export const dbService = {
  findUserByEmail: async (email) => {
    if (global.isMockDB) {
      const db = readMockDB();
      return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    return await User.findOne({ email });
  },

  findUserById: async (id) => {
    if (global.isMockDB) {
      const db = readMockDB();
      return db.users.find(u => u._id === id) || null;
    }
    return await User.findById(id);
  },

  findUserByUsername: async (username) => {
    if (global.isMockDB) {
      const db = readMockDB();
      return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    }
    return await User.findOne({ username });
  },

  createUser: async (userData) => {
    if (global.isMockDB) {
      const db = readMockDB();
      const newUser = {
        _id: 'usr_' + Math.random().toString(36).substr(2, 9),
        bio: 'Productivity Explorer',
        authProviders: ['Email'],
        googleId: null,
        githubId: null,
        emailVerified: false,
        role: 'user',
        currentStreak: 0,
        longestStreak: 0,
        perfectDays: 0,
        totalTasks: 0,
        completedTasks: 0,
        productivityScore: 0,
        achievements: [],
        refreshTokens: [],
        verificationToken: null,
        verificationTokenExpires: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...userData
      };
      db.users.push(newUser);
      writeMockDB(db);
      return newUser;
    }
    const user = new User(userData);
    return await user.save();
  },

  updateUser: async (id, updates) => {
    if (global.isMockDB) {
      const db = readMockDB();
      const index = db.users.findIndex(u => u._id === id);
      if (index === -1) return null;
      db.users[index] = {
        ...db.users[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      writeMockDB(db);
      return db.users[index];
    }
    return await User.findByIdAndUpdate(id, updates, { new: true });
  },

  deleteUser: async (id) => {
    if (global.isMockDB) {
      const db = readMockDB();
      const initialLength = db.users.length;
      db.users = db.users.filter(u => u._id !== id);
      if (db.users.length === initialLength) return null;
      writeMockDB(db);
      return { success: true };
    }
    return await User.findByIdAndDelete(id);
  }
};
