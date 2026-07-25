import React, { createContext, useState, useEffect } from 'react';
import { themeVariables } from '../theme';

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  : '';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const defaultMockUser = {
    id: 'default_user',
    _id: 'default_user',
    username: 'Developer',
    fullName: 'TaskForge Developer',
    email: 'dev@taskforge.local',
    bio: 'Productivity Explorer',
    authProviders: ['Email'],
    developerProfiles: {
      leetcode: { username: '', profileUrl: '', connected: false },
      codeforces: { username: '', profileUrl: '', connected: false },
      github: { username: '', profileUrl: '', connected: false },
      codechef: { username: '', profileUrl: '', connected: false },
      hackerrank: { username: '', profileUrl: '', connected: false },
      geeksforgeeks: { username: '', profileUrl: '', connected: false }
    }
  };

  // Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taskforge_mock_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (!parsed.developerProfiles) {
          parsed.developerProfiles = {
            leetcode: { username: '', profileUrl: '', connected: false },
            codeforces: { username: '', profileUrl: '', connected: false },
            github: { username: '', profileUrl: '', connected: false },
            codechef: { username: '', profileUrl: '', connected: false },
            hackerrank: { username: '', profileUrl: '', connected: false },
            geeksforgeeks: { username: '', profileUrl: '', connected: false }
          };
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('taskforge_mock_user') !== null;
  });
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  // Handle OAuth Redirect URL parsing on startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');
      const errorParam = urlParams.get('error');

      if (token && userParam) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('taskforge_token', token);
          localStorage.setItem('taskforge_mock_user', JSON.stringify(parsedUser));
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Clean up the URL by removing the query parameters
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (e) {
          console.error('Error parsing OAuth user data:', e);
          setAuthError('OAuth verification failed');
        }
      } else if (errorParam) {
        setAuthError(`OAuth login failed: ${errorParam.replace(/_/g, ' ')}`);
        
        // Clean up URL error params
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  // Sync mock user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('taskforge_mock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('taskforge_mock_user');
    }
  }, [user]);

  // Core Application Data (scoped to user)
  const [tasks, setTasks] = useState([]);
  const [futureTasks, setFutureTasks] = useState([]);
  const [weeklyObjectives, setWeeklyObjectives] = useState([]);
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [history, setHistory] = useState({}); // Date string YYYY-MM-DD -> { completedCount, totalCount, score }
  
  // Theme State
  const [theme, setTheme] = useState('dark');
  const themeVars = themeVariables[theme] || themeVariables.dark;

  // Global Task View Mode (List vs Kanban)
  const [taskViewMode, setTaskViewMode] = useState(() => localStorage.getItem('taskforge_view_preference') || 'kanban');

  const updateTaskViewMode = (mode) => {
    setTaskViewMode(mode);
    localStorage.setItem('taskforge_view_preference', mode);
  };

  // Load User Theme on Startup
  useEffect(() => {
    const savedTheme = user 
      ? (localStorage.getItem(`taskforge_theme_${user._id || user.id}`) || 'dark')
      : (localStorage.getItem('taskforge_theme_guest') || 'dark');
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, [user]);

  const refreshSession = async () => {
    return true;
  };

  const logoutLocal = () => {
    localStorage.removeItem('taskforge_token');
    
    // Clear localStorage for the current mock user
    if (user) {
      const userId = user._id || user.id;
      localStorage.removeItem(`taskforge_tasks_${userId}`);
      localStorage.removeItem(`taskforge_future_${userId}`);
      localStorage.removeItem(`taskforge_weekly_${userId}`);
      localStorage.removeItem(`taskforge_monthly_${userId}`);
      localStorage.removeItem(`taskforge_history_${userId}`);
      localStorage.removeItem(`taskforge_streak_${userId}`);
      localStorage.removeItem(`taskforge_theme_${userId}`);
    }
    localStorage.removeItem('taskforge_mock_user');
    localStorage.removeItem('taskforge_view_mode');

    setUser(null);
    setIsAuthenticated(false);
    setTasks([]);
    setFutureTasks([]);
    setWeeklyObjectives([]);
    setMonthlyGoals([]);
    setHistory({});
  };

  // Load user data when user changes, and fetch latest state from server
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const userId = user._id || user.id;
        const savedTasks = localStorage.getItem(`taskforge_tasks_${userId}`);
        const savedFutureTasks = localStorage.getItem(`taskforge_future_${userId}`);
        const savedWeekly = localStorage.getItem(`taskforge_weekly_${userId}`);
        const savedMonthly = localStorage.getItem(`taskforge_monthly_${userId}`);
        const savedHistory = localStorage.getItem(`taskforge_history_${userId}`);

        // Set initial state from local storage (instant UI feedback)
        setTasks(savedTasks ? JSON.parse(savedTasks) : []);
        setFutureTasks(savedFutureTasks ? JSON.parse(savedFutureTasks) : []);
        setWeeklyObjectives(savedWeekly ? JSON.parse(savedWeekly) : []);
        setMonthlyGoals(savedMonthly ? JSON.parse(savedMonthly) : []);
        setHistory(savedHistory ? JSON.parse(savedHistory) : {});

        // Fetch fresh data from cloud server
        try {
          const token = localStorage.getItem('taskforge_token');
          if (token) {
            const response = await fetch(`${API_BASE}/api/auth/data`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
              const data = await response.json();
              setTasks(data.tasks || []);
              setFutureTasks(data.futureTasks || []);
              setWeeklyObjectives(data.weeklyObjectives || []);
              setMonthlyGoals(data.monthlyGoals || []);
              setHistory(data.history || {});
              
              // Cache and update user profile data
              if (data.user) {
                setUser(data.user);
                localStorage.setItem('taskforge_mock_user', JSON.stringify(data.user));
              }

              // Update offline cache
              localStorage.setItem(`taskforge_tasks_${userId}`, JSON.stringify(data.tasks || []));
              localStorage.setItem(`taskforge_future_${userId}`, JSON.stringify(data.futureTasks || []));
              localStorage.setItem(`taskforge_weekly_${userId}`, JSON.stringify(data.weeklyObjectives || []));
              localStorage.setItem(`taskforge_monthly_${userId}`, JSON.stringify(data.monthlyGoals || []));
              localStorage.setItem(`taskforge_history_${userId}`, JSON.stringify(data.history || {}));
            }
          }
        } catch (err) {
          console.warn('[Sync] Failed to fetch fresh data from cloud, using offline cache', err);
        }
      }
    };
    loadData();
  }, [user?._id || user?.id]);

  // Sync state to local storage instantly & debounce cloud database sync
  useEffect(() => {
    if (!user) return;
    const userId = user._id || user.id;

    // Save to local storage for offline-first resilience
    localStorage.setItem(`taskforge_tasks_${userId}`, JSON.stringify(tasks));
    localStorage.setItem(`taskforge_future_${userId}`, JSON.stringify(futureTasks));
    localStorage.setItem(`taskforge_weekly_${userId}`, JSON.stringify(weeklyObjectives));
    localStorage.setItem(`taskforge_monthly_${userId}`, JSON.stringify(monthlyGoals));
    localStorage.setItem(`taskforge_history_${userId}`, JSON.stringify(history));

    // Debounced database cloud sync
    const delayDebounce = setTimeout(async () => {
      try {
        const token = localStorage.getItem('taskforge_token');
        if (token) {
          await fetch(`${API_BASE}/api/auth/data`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tasks, futureTasks, weeklyObjectives, monthlyGoals, history })
          });
        }
      } catch (err) {
        console.warn('[Sync] Failed to sync data to cloud database (offline)', err);
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [tasks, futureTasks, weeklyObjectives, monthlyGoals, history, user]);

  // Helper: Get formatted date string YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Run Date Scheduler & Sync on load/login
  useEffect(() => {
    if (user && futureTasks.length > 0) {
      const todayStr = getTodayString();
      const tasksToMove = futureTasks.filter(t => t.scheduledDate <= todayStr);
      
      if (tasksToMove.length > 0) {
        // Add to active tasks
        const newActiveTasks = tasksToMove.map(ft => ({
          id: ft.id,
          title: ft.title,
          completed: false,
          partial: false,
          priority: ft.priority || 'medium',
          category: ft.category || 'Personal',
          dueTime: ft.dueTime || '',
          notes: ft.notes || '',
          estimatedTime: ft.estimatedTime || 0,
          actualTime: 0,
          createdAt: ft.createdAt || Date.now()
        }));

        setTasks(prev => [...prev, ...newActiveTasks]);
        
        // Remove from future tasks
        setFutureTasks(prev => prev.filter(t => t.scheduledDate > todayStr));
      }
    }
  }, [user, futureTasks]);

  // Dynamically record history log whenever today's tasks change
  useEffect(() => {
    if (user && tasks.length > 0) {
      const todayStr = getTodayString();
      const completedCount = tasks.filter(t => t.completed).length;
      const totalCount = tasks.length;
      const rate = Math.round((completedCount / totalCount) * 100);

      setHistory(prev => {
        const updated = { ...prev };
        updated[todayStr] = {
          date: todayStr,
          completed: completedCount,
          total: totalCount,
          rate: rate,
          tasksList: tasks // Save a full copy of the task states for this day
        };
        return updated;
      });
    }
  }, [tasks, user]);

  // Authentication Handlers
  const validatePasswordStr = (pw) => {
    if (pw.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pw)) return 'Password must contain at least one lowercase letter';
    if (!/[0-9]/.test(pw)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return 'Password must contain at least one special character';
    return null;
  };

  const register = async (fullName, username, email, password) => {
    setAuthError(null);
    setAuthSuccess(null);
    if (fullName.length < 3 || fullName.length > 50) {
      setAuthError('Name must be between 3 and 50 characters');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('Please enter a valid email address');
      return false;
    }
    const pwError = validatePasswordStr(password);
    if (pwError) {
      setAuthError(pwError);
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, username, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || 'Registration failed');
        return false;
      }
      setAuthSuccess(data.message || 'Verification code sent!');
      return { success: true, email: data.email, code: data.simulatedCode };
    } catch (err) {
      console.warn('[Auth Server Offline] Falling back to simulated register', err);
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      return { success: true, email, code: mockCode };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || 'Login failed');
        return false;
      }
      if (data.unverified) {
        return { unverified: true, email: data.email, code: data.simulatedCode };
      }
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('taskforge_token', data.accessToken);
      localStorage.setItem('taskforge_mock_user', JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      console.warn('[Auth Server Offline] Falling back to simulated login', err);
      const mockUser = {
        id: 'default_user',
        _id: 'default_user',
        username: email.split('@')[0],
        fullName: 'TaskForge Developer',
        email,
        bio: 'Productivity Explorer',
        authProviders: ['Email']
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('taskforge_mock_user', JSON.stringify(mockUser));
      return { success: true };
    }
  };

  const verifyEmailCode = async (email, code) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || 'Verification failed');
        return false;
      }
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('taskforge_token', data.accessToken);
      localStorage.setItem('taskforge_mock_user', JSON.stringify(data.user));
      setAuthSuccess('Email verified successfully!');
      return true;
    } catch (err) {
      console.warn('[Auth Server Offline] Falling back to simulated verification', err);
      const mockUser = {
        id: 'default_user',
        _id: 'default_user',
        username: email.split('@')[0],
        fullName: 'TaskForge Developer',
        email,
        bio: 'Productivity Explorer',
        authProviders: ['Email']
      };
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('taskforge_mock_user', JSON.stringify(mockUser));
      setAuthSuccess('Email verified successfully! (Mock)');
      return true;
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    return new Promise((resolve) => {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || clientId.includes('dummyclientid') || clientId.includes('your_google_client_id')) {
          console.warn('[Google Auth] Using simulated OAuth fallback - please configure VITE_GOOGLE_CLIENT_ID in your .env');
          // Perform simulation fallback
          const mockGoogleId = 'g_' + Math.random().toString(36).substr(2, 9);
          fetch(`${API_BASE}/api/auth/oauth/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: 'Google',
              oauthId: mockGoogleId,
              email: 'google_user@gmail.com',
              fullName: 'Google User',
              profileImage: 'https://api.dicebear.com/7.x/initials/svg?seed=GoogleUser',
              username: 'Google_User'
            })
          })
          .then(res => res.json())
          .then(data => {
            if (data.accessToken) {
              setUser(data.user);
              setIsAuthenticated(true);
              localStorage.setItem('taskforge_token', data.accessToken);
              localStorage.setItem('taskforge_mock_user', JSON.stringify(data.user));
              resolve(true);
            } else {
              setAuthError(data.message || 'Google Auth simulation failed');
              resolve(false);
            }
          })
          .catch(err => {
            console.error(err);
            resolve(false);
          });
          return;
        }

        // Real Google Login Flow using Google Identity Services client SDK
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch(`${API_BASE}/api/auth/google`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ accessToken: tokenResponse.access_token })
                });
                const data = await res.json();
                if (!res.ok) {
                  setAuthError(data.message || 'Google Login failed');
                  resolve(false);
                  return;
                }
                setUser(data.user);
                setIsAuthenticated(true);
                localStorage.setItem('taskforge_token', data.accessToken);
                localStorage.setItem('taskforge_mock_user', JSON.stringify(data.user));
                resolve(true);
              } catch (err) {
                console.error('Google Auth backend verification failed:', err);
                setAuthError('Backend verification failed');
                resolve(false);
              }
            } else {
              setAuthError('Google sign in failed');
              resolve(false);
            }
          }
        });
        client.requestAccessToken();
      } catch (err) {
        console.error('Google Auth init error:', err);
        // Offline / script not loaded fallback
        const mockGoogleId = 'g_' + Math.random().toString(36).substr(2, 9);
        const mockUser = {
          id: mockGoogleId,
          _id: mockGoogleId,
          username: 'Google_User',
          fullName: 'Google User',
          email: 'google_user@gmail.com',
          bio: 'Logged in via Google',
          authProviders: ['Google']
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('taskforge_mock_user', JSON.stringify(mockUser));
        resolve(true);
      }
    });
  };

  const loginWithGitHub = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

      // Fallback to simulation if client ID is dummy or not configured
      if (!clientId || clientId.includes('mock_github') || clientId.includes('dummy')) {
        console.warn('[GitHub Auth] Using simulated OAuth fallback - please configure VITE_GITHUB_CLIENT_ID in your .env');
        const mockGithubId = 'git_' + Math.random().toString(36).substr(2, 9);
        const response = await fetch(`${API_BASE}/api/auth/oauth/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'GitHub',
            oauthId: mockGithubId,
            email: 'github_dev@github.com',
            fullName: 'GitHub Developer',
            profileImage: 'https://api.dicebear.com/7.x/initials/svg?seed=GithubDev',
            username: 'GitHub_Dev'
          })
        });
        const data = await response.json();
        if (!response.ok) {
          setAuthError(data.message || 'GitHub OAuth failed');
          return false;
        }
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('taskforge_token', data.accessToken);
        localStorage.setItem('taskforge_mock_user', JSON.stringify(data.user));
        return true;
      }

      // Real GitHub OAuth redirect flow
      const callback = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/auth/github/callback'
        : 'https://taskforge-workspace.vercel.app/api/auth/github/callback';

      const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callback)}&scope=read:user user:email`;
      window.location.href = githubUrl;
      return new Promise(() => {}); // never resolves because page redirects
    } catch (err) {
      console.error('GitHub Login initialization failed:', err);
      setAuthError('GitHub Login initialization failed');
      return false;
    }
  };

  const forgotPassword = async (email) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || 'Request failed');
        return false;
      }
      setAuthSuccess(data.message || 'Reset link sent!');
      return { success: true, email, token: data.simulatedToken };
    } catch (err) {
      console.warn('[Auth Server Offline] Falling back to simulated password recovery', err);
      return { success: true, email, token: 'mock_reset_token' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.message || 'Reset failed');
        return false;
      }
      setAuthSuccess(data.message || 'Password reset successful!');
      return true;
    } catch (err) {
      console.warn('[Auth Server Offline] Falling back to simulated password reset', err);
      setAuthSuccess('Password reset successful! Please log in. (Mock)');
      return true;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.warn('[Auth Server Offline] Logging out locally', err);
    }
    logoutLocal();
  };

  const logoutAll = async () => {
    logoutLocal();
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('taskforge_token');
      await fetch(`${API_BASE}/api/auth/account`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.warn('[Auth Server Offline] Deleting account locally', err);
    }
    logoutLocal();
    return true;
  };

  const linkOAuthProvider = async (provider) => {
    if (!user) return false;
    const providers = user.authProviders || [];
    if (!providers.includes(provider)) {
      setUser(prev => ({
        ...prev,
        authProviders: [...providers, provider]
      }));
    }
    return true;
  };

  const unlinkOAuthProvider = async (provider) => {
    if (!user) return { success: false, error: 'User session not found' };
    const providers = user.authProviders || [];
    setUser(prev => ({
      ...prev,
      authProviders: providers.filter(p => p !== provider)
    }));
    return { success: true };
  };

  const updateProfile = async (username, bio) => {
    if (!user) return false;
    setUser(prev => ({
      ...prev,
      username,
      bio
    }));
    return true;
  };

  // Developer Profiles states & connection handlers
  const [activeDevPlatformTabs, setActiveDevPlatformTabs] = useState([]);
  const [currentDevPlatformTab, setCurrentDevPlatformTab] = useState(null);

  const connectDeveloperProfile = (platformId, username, profileUrl) => {
    if (!user) return false;
    setUser(prev => {
      const updatedProfiles = {
        ...(prev.developerProfiles || {}),
        [platformId]: {
          username,
          profileUrl,
          connected: true
        }
      };
      return {
        ...prev,
        developerProfiles: updatedProfiles
      };
    });
    return true;
  };

  const disconnectDeveloperProfile = (platformId) => {
    if (!user) return false;
    setUser(prev => {
      const updatedProfiles = {
        ...(prev.developerProfiles || {}),
        [platformId]: {
          username: '',
          profileUrl: '',
          connected: false
        }
      };
      return {
        ...prev,
        developerProfiles: updatedProfiles
      };
    });
    closeDevPlatform(platformId);
    return true;
  };

  const openDevPlatform = (platformId) => {
    setActiveDevPlatformTabs(prev => {
      if (!prev.includes(platformId)) {
        return [...prev, platformId];
      }
      return prev;
    });
    setCurrentDevPlatformTab(platformId);
  };

  const closeDevPlatform = (platformId) => {
    setActiveDevPlatformTabs(prev => {
      const filtered = prev.filter(id => id !== platformId);
      if (currentDevPlatformTab === platformId) {
        if (filtered.length > 0) {
          setCurrentDevPlatformTab(filtered[filtered.length - 1]);
        } else {
          setCurrentDevPlatformTab(null);
        }
      }
      return filtered;
    });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    if (user) {
      const userId = user._id || user.id;
      localStorage.setItem(`taskforge_theme_${userId}`, nextTheme);
    } else {
      localStorage.setItem('taskforge_theme_guest', nextTheme);
    }
  };

  // Task Operations
  const addTask = (title, category = 'Personal', priority = 'medium', dueTime = '', estimatedTime = 0, notes = '') => {
    const newTask = {
      id: 'task_' + Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      partial: false,
      inProgress: false,
      priority,
      category,
      dueTime,
      notes,
      estimatedTime: Number(estimatedTime) || 0,
      actualTime: 0,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskCompleted = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed && !t.partial && !t.inProgress) {
          // Uncompleted (To Do) -> In Progress
          return { ...t, completed: false, partial: false, inProgress: true };
        } else if (t.inProgress) {
          // In Progress -> Partially Completed
          return { ...t, completed: false, partial: true, inProgress: false };
        } else if (t.partial) {
          // Partially Completed -> Completed
          return { ...t, completed: true, partial: false, inProgress: false };
        } else {
          // Completed -> Uncompleted (To Do)
          return { ...t, completed: false, partial: false, inProgress: false };
        }
      }
      return t;
    }));
  };

  const moveTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        switch (newStatus) {
          case 'todo':
            return { ...t, completed: false, partial: false, inProgress: false };
          case 'inprogress':
            return { ...t, completed: false, partial: false, inProgress: true };
          case 'partial':
            return { ...t, completed: false, partial: true, inProgress: false };
          case 'completed':
            return { ...t, completed: true, partial: false, inProgress: false };
          default:
            return t;
        }
      }
      return t;
    }));
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updatedFields } : t)));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Future Planner Operations
  const addFutureTask = (title, dateStr, category = 'Personal', priority = 'medium', dueTime = '', estimatedTime = 0, notes = '') => {
    const newFutureTask = {
      id: 'future_' + Math.random().toString(36).substr(2, 9),
      title,
      scheduledDate: dateStr,
      priority,
      category,
      dueTime,
      notes,
      estimatedTime: Number(estimatedTime) || 0,
      createdAt: Date.now()
    };
    setFutureTasks(prev => [newFutureTask, ...prev]);
  };

  const deleteFutureTask = (id) => {
    setFutureTasks(prev => prev.filter(t => t.id !== id));
  };

  // Weekly & Monthly Planner Operations
  const addWeeklyObjective = (title) => {
    const newObj = {
      id: 'weekly_' + Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      createdAt: Date.now()
    };
    setWeeklyObjectives(prev => [...prev, newObj]);
  };

  const toggleWeeklyObjective = (id) => {
    setWeeklyObjectives(prev => prev.map(o => (o.id === id ? { ...o, completed: !o.completed } : o)));
  };

  const deleteWeeklyObjective = (id) => {
    setWeeklyObjectives(prev => prev.filter(o => o.id !== id));
  };

  const addMonthlyGoal = (title) => {
    const newGoal = {
      id: 'monthly_' + Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      createdAt: Date.now()
    };
    setMonthlyGoals(prev => [...prev, newGoal]);
  };

  const toggleMonthlyGoal = (id) => {
    setMonthlyGoals(prev => prev.map(g => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const deleteMonthlyGoal = (id) => {
    setMonthlyGoals(prev => prev.filter(g => g.id !== id));
  };

  // Backup & Reset Operations
  const exportBackup = () => {
    if (!user) return;
    const backupData = {
      version: '1.0.0',
      exportedAt: Date.now(),
      user: { id: user._id || user.id, username: user.username, email: user.email, bio: user.bio },
      theme,
      tasks,
      futureTasks,
      weeklyObjectives,
      monthlyGoals,
      history
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskforge_backup_${user.username}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonString) => {
    if (!user) return false;
    try {
      const data = JSON.parse(jsonString);
      if (!data.version || !data.tasks || !data.history) {
        alert('Invalid TaskForge backup schema.');
        return false;
      }
      
      // Map loaded states
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.futureTasks)) setFutureTasks(data.futureTasks);
      if (Array.isArray(data.weeklyObjectives)) setWeeklyObjectives(data.weeklyObjectives);
      if (Array.isArray(data.monthlyGoals)) setMonthlyGoals(data.monthlyGoals);
      if (typeof data.history === 'object') setHistory(data.history);
      
      if (data.theme) {
        setTheme(data.theme);
        document.body.setAttribute('data-theme', data.theme);
      }

      alert('Backup imported successfully!');
      return true;
    } catch (err) {
      console.error(err);
      alert('Error parsing backup file.');
      return false;
    }
  };

  const resetAllData = () => {
    if (!user) return;
    if (confirm('Are you absolutely sure you want to clear all your TaskForge tasks, calendars, milestones, and history? This cannot be undone.')) {
      setTasks([]);
      setFutureTasks([]);
      setWeeklyObjectives([]);
      setMonthlyGoals([]);
      setHistory({});
      localStorage.removeItem(`taskforge_tasks_${user.id}`);
      localStorage.removeItem(`taskforge_future_${user.id}`);
      localStorage.removeItem(`taskforge_weekly_${user.id}`);
      localStorage.removeItem(`taskforge_monthly_${user.id}`);
      localStorage.removeItem(`taskforge_history_${user.id}`);
      localStorage.removeItem('taskforge_view_mode');
    }
  };

  // Streak Calculation Utility
  // Streaks increase when a user completes at least 1 task on consecutive days.
  const calculateStreak = () => {
    const dates = Object.keys(history).sort();
    if (dates.length === 0) return { current: 0, longest: 0 };

    let longest = 0;
    let current = 0;
    let tempCurrent = 0;

    // Helper: Find date range between two dates
    const getDaysDiff = (d1, d2) => {
      const diffTime = Math.abs(new Date(d2) - new Date(d1));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const todayStr = getTodayString();
    
    // Sort chronological lists of active days (where they completed at least one task)
    const activeDates = dates.filter(date => {
      const record = history[date];
      return record && record.completed > 0;
    });

    if (activeDates.length === 0) return { current: 0, longest: 0 };

    // Calculate Longest Streak
    longest = 1;
    tempCurrent = 1;
    for (let i = 1; i < activeDates.length; i++) {
      const diff = getDaysDiff(activeDates[i - 1], activeDates[i]);
      if (diff === 1) {
        tempCurrent++;
      } else if (diff > 1) {
        longest = Math.max(longest, tempCurrent);
        tempCurrent = 1;
      }
    }
    longest = Math.max(longest, tempCurrent);

    // Calculate Current Streak
    const lastActiveDate = activeDates[activeDates.length - 1];
    const diffFromToday = getDaysDiff(lastActiveDate, todayStr);

    if (diffFromToday === 0) {
      // Last active is today -> count back
      current = 1;
      for (let i = activeDates.length - 2; i >= 0; i--) {
        if (getDaysDiff(activeDates[i], activeDates[i + 1]) === 1) {
          current++;
        } else {
          break;
        }
      }
    } else if (diffFromToday === 1) {
      // Last active was yesterday, today not active yet -> streak is still preserved at yesterday's count
      current = 1;
      for (let i = activeDates.length - 2; i >= 0; i--) {
        if (getDaysDiff(activeDates[i], activeDates[i + 1]) === 1) {
          current++;
        } else {
          break;
        }
      }
    } else {
      // Streak broken
      current = 0;
    }

    return { current, longest: Math.max(longest, current) };
  };

  const streak = calculateStreak();

  // Perfect Days Count
  const perfectDaysCount = Object.values(history).filter(h => h.total > 0 && h.completed === h.total).length;

  // Total Lifetime Completed Tasks
  // Sum up from active history or combine with today's completed tasks
  const getTotalLifetimeCompleted = () => {
    let count = 0;
    Object.values(history).forEach(h => {
      count += h.completed;
    });
    return count;
  };

  const lifetimeCompleted = getTotalLifetimeCompleted();

  // Achievements evaluation engine
  const evaluateAchievements = () => {
    const list = [
      {
        id: 'first_step',
        name: 'First Step',
        desc: 'Complete your first task',
        unlocked: lifetimeCompleted >= 1
      },
      {
        id: 'perfect_start',
        name: 'Perfect Start',
        desc: 'Complete 100% of tasks in a single day',
        unlocked: perfectDaysCount >= 1
      },
      {
        id: 'consistent_3',
        name: 'Consistent',
        desc: 'Reach a 3-day productivity streak',
        unlocked: streak.longest >= 3
      },
      {
        id: 'habit_7',
        name: 'Habit Builder',
        desc: 'Reach a 7-day productivity streak',
        unlocked: streak.longest >= 7
      },
      {
        id: 'ninja_30',
        name: 'Productivity Ninja',
        desc: 'Reach a 30-day productivity streak',
        unlocked: streak.longest >= 30
      },
      {
        id: 'weekly_crusher',
        name: 'Goal Crusher',
        desc: 'Complete a Weekly Objective',
        unlocked: weeklyObjectives.some(o => o.completed)
      },
      {
        id: 'monthly_visionary',
        name: 'Visionary',
        desc: 'Complete a Monthly Goal',
        unlocked: monthlyGoals.some(g => g.completed)
      },
      {
        id: 'century_club',
        name: 'Century Club',
        desc: 'Complete 100 total lifetime tasks',
        unlocked: lifetimeCompleted >= 100
      },
      {
        id: 'time_boxer',
        name: 'Time Boxer',
        desc: 'Log estimated hours on 5 tasks',
        unlocked: tasks.concat(futureTasks).filter(t => t.estimatedTime > 0).length >= 5
      },
      {
        id: 'planner_pro',
        name: 'Planner Pro',
        desc: 'Pre-schedule 5 tasks in the Future Planner',
        unlocked: (futureTasks.length + tasks.filter(t => t.createdAt && (Date.now() - t.createdAt > 1000 * 60) && t.scheduledDate).length) >= 5
      },
      {
        id: 'category_master',
        name: 'Category Master',
        desc: 'Complete a task in all 6 default categories',
        unlocked: false // evaluated below
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        desc: 'Complete a task between 10 PM and 4 AM',
        unlocked: false // evaluated below
      }
    ];

    // Evaluate Category Master
    const defaultCategories = ['Work', 'Personal', 'Study', 'Fitness', 'Reading', 'Finance'];
    // Check if we completed tasks in all of these categories
    // We can look at active tasks that are completed
    const completedCategories = new Set();
    tasks.forEach(t => {
      if (t.completed) completedCategories.add(t.category);
    });
    // Also scan local storage history if available, but for simplicity let's scan all completed tasks
    const allCategoriesMet = defaultCategories.every(cat => completedCategories.has(cat));
    const categoryMasterIndex = list.findIndex(a => a.id === 'category_master');
    if (categoryMasterIndex !== -1) {
      list[categoryMasterIndex].unlocked = allCategoriesMet;
    }

    // Evaluate Night Owl
    // Simply check if any completed task has a due time or completed log during night hours
    // For demonstration, let's unlock if there are any completed tasks with due time of night (e.g. "22:", "23:", "00:", "01:", "02:", "03:", "04:")
    const nightOwlCompleted = tasks.some(t => {
      if (t.completed && t.dueTime) {
        const hour = parseInt(t.dueTime.split(':')[0]);
        return hour >= 22 || hour <= 4;
      }
      return false;
    });
    const nightOwlIndex = list.findIndex(a => a.id === 'night_owl');
    if (nightOwlIndex !== -1) {
      list[nightOwlIndex].unlocked = nightOwlCompleted;
    }

    return list;
  };

  const achievements = evaluateAchievements();

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        isAuthenticated,
        authError,
        authSuccess,
        setAuthError,
        setAuthSuccess,
        register,
        login,
        verifyEmailCode,
        loginWithGoogle,
        loginWithGitHub,
        forgotPassword,
        resetPassword,
        linkOAuthProvider,
        unlinkOAuthProvider,
        logout,
        logoutAll,
        deleteAccount,
        updateProfile,

        // Theme
        theme,
        themeVars,
        toggleTheme,

        // Tasks
        tasks,
        addTask,
        toggleTaskCompleted,
        moveTaskStatus,
        updateTask,
        deleteTask,
        taskViewMode,
        updateTaskViewMode,

        // Future Planner
        futureTasks,
        addFutureTask,
        deleteFutureTask,

        // Weekly & Monthly Objectives
        weeklyObjectives,
        addWeeklyObjective,
        toggleWeeklyObjective,
        deleteWeeklyObjective,
        monthlyGoals,
        addMonthlyGoal,
        toggleMonthlyGoal,
        deleteMonthlyGoal,

        // History, Stats, Streaks
        history,
        streak,
        perfectDaysCount,
        lifetimeCompleted,
        achievements,

        // Backup
        exportBackup,
        importBackup,
        resetAllData,
        getTodayString,

        // Developer Profiles
        activeDevPlatformTabs,
        currentDevPlatformTab,
        connectDeveloperProfile,
        disconnectDeveloperProfile,
        openDevPlatform,
        closeDevPlatform,
        setActiveDevPlatformTabs,
        setCurrentDevPlatformTab
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
