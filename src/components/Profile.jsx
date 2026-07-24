import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Edit3, 
  Sparkles,
  Lock,
  Mail,
  ShieldAlert,
  Award,
  Zap,
  Crown,
  Target,
  Compass,
  Clock,
  Calendar,
  Layers,
  Moon,
  Check,
  Play,
  Pause,
  RotateCcw,
  Search,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Code
} from 'lucide-react';
import { getPlatformIcon } from './PlatformIcons';

const GoogleIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.6-.81-5.19 0-7.79H2.18z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const GithubIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const InlineWheelPicker = ({ label, range, value, onChange }) => {
  const containerRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTopStart, setScrollTopStart] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const index = range.indexOf(value);
      if (index !== -1) {
        const targetScrollTop = index * 36;
        if (Math.abs(containerRef.current.scrollTop - targetScrollTop) > 2) {
          containerRef.current.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [value, range]);

  const handleScroll = (e) => {
    if (isDragging) return;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / 36);
    if (index >= 0 && index < range.length) {
      const selectedValue = range[index];
      if (selectedValue !== value) {
        onChange(selectedValue);
      }
    }
  };

  const handleKeyDown = (e) => {
    const currentIndex = range.indexOf(value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < range.length - 1) {
        onChange(range[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        onChange(range[currentIndex - 1]);
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY);
    setScrollTopStart(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const yDiff = e.pageY - startY;
    containerRef.current.scrollTop = scrollTopStart - yDiff;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / 36);
    const targetScrollTop = Math.max(0, Math.min(range.length - 1, index)) * 36;
    containerRef.current.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    onChange(range[Math.max(0, Math.min(range.length - 1, index))]);
  };

  return (
    <div className="wheel-column">
      <span className="wheel-label" style={{ fontSize: '0.7rem' }}>{label}</span>
      <div 
        className="inline-wheel-scroll-wrapper"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        aria-label={`${label} selector`}
        style={{ outline: 'none' }}
      >
        <div 
          ref={containerRef}
          className="inline-wheel-scroll-viewport"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            setIsDragging(true);
            setStartY(e.touches[0].pageY);
            setScrollTopStart(containerRef.current.scrollTop);
          }}
          onTouchMove={(e) => {
            if (!isDragging) return;
            const yDiff = e.touches[0].pageY - startY;
            containerRef.current.scrollTop = scrollTopStart - yDiff;
          }}
          onTouchEnd={() => {
            setIsDragging(false);
            const scrollTop = containerRef.current.scrollTop;
            const index = Math.round(scrollTop / 36);
            const targetScrollTop = Math.max(0, Math.min(range.length - 1, index)) * 36;
            containerRef.current.scrollTo({
              top: targetScrollTop,
              behavior: 'smooth'
            });
            onChange(range[Math.max(0, Math.min(range.length - 1, index))]);
          }}
        >
          <div className="inline-wheel-scroll-content">
            {range.map((val) => {
              const formatted = val.toString().padStart(2, '0');
              const isActive = val === value;
              return (
                <div 
                  key={val}
                  className={`inline-wheel-item ${isActive ? 'active' : ''}`}
                  onClick={() => onChange(val)}
                >
                  {formatted}
                </div>
              );
            })}
          </div>
        </div>
        <div className="inline-wheel-picker-overlay"></div>
      </div>
    </div>
  );
};

const WheelPicker = ({ label, range, value, onChange }) => {
  const containerRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTopStart, setScrollTopStart] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const index = range.indexOf(value);
      if (index !== -1) {
        const targetScrollTop = index * 40;
        if (Math.abs(containerRef.current.scrollTop - targetScrollTop) > 2) {
          containerRef.current.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [value, range]);

  const handleScroll = (e) => {
    if (isDragging) return;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / 40);
    if (index >= 0 && index < range.length) {
      const selectedValue = range[index];
      if (selectedValue !== value) {
        onChange(selectedValue);
      }
    }
  };

  const handleKeyDown = (e) => {
    const currentIndex = range.indexOf(value);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < range.length - 1) {
        onChange(range[currentIndex + 1]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        onChange(range[currentIndex - 1]);
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY);
    setScrollTopStart(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const yDiff = e.pageY - startY;
    containerRef.current.scrollTop = scrollTopStart - yDiff;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const scrollTop = containerRef.current.scrollTop;
    const index = Math.round(scrollTop / 40);
    const targetScrollTop = Math.max(0, Math.min(range.length - 1, index)) * 40;
    containerRef.current.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
    onChange(range[Math.max(0, Math.min(range.length - 1, index))]);
  };

  return (
    <div className="wheel-column">
      <span className="wheel-label">{label}</span>
      <div 
        className="wheel-scroll-wrapper"
        tabIndex="0"
        onKeyDown={handleKeyDown}
        aria-label={`${label} selector`}
        style={{ outline: 'none' }}
      >
        <div 
          ref={containerRef}
          className="wheel-scroll-viewport"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            setIsDragging(true);
            setStartY(e.touches[0].pageY);
            setScrollTopStart(containerRef.current.scrollTop);
          }}
          onTouchMove={(e) => {
            if (!isDragging) return;
            const yDiff = e.touches[0].pageY - startY;
            containerRef.current.scrollTop = scrollTopStart - yDiff;
          }}
          onTouchEnd={() => {
            setIsDragging(false);
            const scrollTop = containerRef.current.scrollTop;
            const index = Math.round(scrollTop / 40);
            const targetScrollTop = Math.max(0, Math.min(range.length - 1, index)) * 40;
            containerRef.current.scrollTo({
              top: targetScrollTop,
              behavior: 'smooth'
            });
            onChange(range[Math.max(0, Math.min(range.length - 1, index))]);
          }}
        >
          <div className="wheel-scroll-content">
            {range.map((val) => {
              const formatted = val.toString().padStart(2, '0');
              const isActive = val === value;
              return (
                <div 
                  key={val}
                  className={`wheel-item ${isActive ? 'active' : ''}`}
                  onClick={() => onChange(val)}
                >
                  {formatted}
                </div>
              );
            })}
          </div>
        </div>
        <div className="wheel-picker-overlay"></div>
      </div>
    </div>
  );
};

const badgeIcons = {
  first_step: Award,
  perfect_start: Sparkles,
  consistent_3: Flame,
  habit_7: Zap,
  ninja_30: Crown,
  weekly_crusher: Target,
  monthly_visionary: Compass,
  century_club: Trophy,
  time_boxer: Clock,
  planner_pro: Calendar,
  category_master: Layers,
  night_owl: Moon,
};

export default function Profile({ setActiveTab }) {
  const { 
    user, 
    updateProfile, 
    streak, 
    perfectDaysCount, 
    lifetimeCompleted,
    weeklyObjectives,
    monthlyGoals,
    achievements,
    linkOAuthProvider,
    unlinkOAuthProvider,
    deleteAccount,
    tasks,
    futureTasks,
    theme,
    connectDeveloperProfile,
    disconnectDeveloperProfile,
    openDevPlatform
  } = useContext(AppContext);

  const [platformSearch, setPlatformSearch] = useState('');
  const [activeConnectingPlatform, setActiveConnectingPlatform] = useState(null);
  const [editModePlatform, setEditModePlatform] = useState(null);
  const [connectionUsername, setConnectionUsername] = useState('');
  const [connectionProfileUrl, setConnectionProfileUrl] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const PLATFORMS = [
    { id: 'leetcode', name: 'LeetCode', logo: '🟠', urlTemplate: 'https://leetcode.com/u/{username}/', domain: 'leetcode.com' },
    { id: 'codeforces', name: 'Codeforces', logo: '🔵', urlTemplate: 'https://codeforces.com/profile/{username}', domain: 'codeforces.com' },
    { id: 'github', name: 'GitHub', logo: '⚫', urlTemplate: 'https://github.com/{username}', domain: 'github.com' },
    { id: 'codechef', name: 'CodeChef', logo: '🟢', urlTemplate: 'https://codechef.com/users/{username}', domain: 'codechef.com' },
    { id: 'hackerrank', name: 'HackerRank', logo: '🟣', urlTemplate: 'https://hackerrank.com/{username}', domain: 'hackerrank.com' },
    { id: 'geeksforgeeks', name: 'GeeksforGeeks', logo: '🟢', urlTemplate: 'https://geeksforgeeks.org/user/{username}/', domain: 'geeksforgeeks.org' }
  ];

  const handleConnectProfile = (platformId) => {
    setConnectionError('');
    const username = connectionUsername.trim();
    let profileUrl = connectionProfileUrl.trim();

    if (!username && !profileUrl) {
      setConnectionError('Please provide either a username or profile URL.');
      return;
    }

    const platform = PLATFORMS.find(p => p.id === platformId);
    let resolvedUsername = username;

    if (username && !profileUrl) {
      profileUrl = platform.urlTemplate.replace('{username}', username);
    } else if (profileUrl && !username) {
      try {
        const urlObj = new URL(profileUrl);
        const paths = urlObj.pathname.split('/').filter(Boolean);
        if (platformId === 'leetcode' && paths[0] === 'u') {
          resolvedUsername = paths[1];
        } else if (platformId === 'geeksforgeeks' && paths[0] === 'user') {
          resolvedUsername = paths[1];
        } else {
          resolvedUsername = paths[0];
        }
      } catch (err) {
        setConnectionError('Failed to parse profile URL.');
        return;
      }
    }

    if (!resolvedUsername) {
      setConnectionError('Could not resolve username.');
      return;
    }

    try {
      const urlObj = new URL(profileUrl);
      if (urlObj.protocol !== 'https:') {
        setConnectionError('URL must use secure HTTPS protocol.');
        return;
      }
      if (!urlObj.hostname.includes(platform.domain)) {
        setConnectionError(`URL must match the platform domain (${platform.domain}).`);
        return;
      }
    } catch (err) {
      setConnectionError('Invalid profile URL format.');
      return;
    }

    connectDeveloperProfile(platformId, resolvedUsername, profileUrl);
    setConnectionUsername('');
    setConnectionProfileUrl('');
    setActiveConnectingPlatform(null);
    setEditModePlatform(null);
  };

  const filteredPlatforms = PLATFORMS.filter(p => {
    const profile = user?.developerProfiles?.[p.id];
    const isConnected = profile?.connected;
    const searchLower = platformSearch.toLowerCase();
    return p.name.toLowerCase().includes(searchLower) || 
           (isConnected && profile.username.toLowerCase().includes(searchLower));
  });

  const hourglassPlatesColor = theme === 'dark' ? '#1e1e1e' : '#3A2D28';
  const hourglassPlatesStroke = theme === 'dark' ? 'rgba(255,255,255,0.15)' : '#D1C7BD';
  const hourglassOutlineStroke = theme === 'dark' ? 'rgba(255,255,255,0.12)' : '#D1C7BD';
  const hourglassOutlineFill = theme === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(58, 45, 40, 0.02)';
  const timerResetBtnBg = theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(58, 45, 40, 0.03)';
  const idleStatusBg = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(58, 45, 40, 0.05)';
  const timerStartBtnText = theme === 'dark' ? 'white' : '#F1EDE6';

  const getBadgeProgress = (id) => {
    switch (id) {
      case 'first_step':
        return { current: lifetimeCompleted, target: 1 };
      case 'perfect_start':
        return { current: perfectDaysCount, target: 1 };
      case 'consistent_3':
        return { current: streak.longest, target: 3 };
      case 'habit_7':
        return { current: streak.longest, target: 7 };
      case 'ninja_30':
        return { current: streak.longest, target: 30 };
      case 'weekly_crusher': {
        const hasCompleted = weeklyObjectives.some(o => o.completed) ? 1 : 0;
        return { current: hasCompleted, target: 1 };
      }
      case 'monthly_visionary': {
        const hasCompleted = monthlyGoals.some(g => g.completed) ? 1 : 0;
        return { current: hasCompleted, target: 1 };
      }
      case 'century_club':
        return { current: lifetimeCompleted, target: 100 };
      case 'time_boxer': {
        const count = (tasks || []).concat(futureTasks || []).filter(t => t.estimatedTime > 0).length;
        return { current: count, target: 5 };
      }
      case 'planner_pro': {
        const count = (futureTasks || []).length + (tasks || []).filter(t => t.createdAt && (Date.now() - t.createdAt > 1000 * 60) && t.scheduledDate).length;
        return { current: count, target: 5 };
      }
      case 'category_master': {
        const defaultCategories = ['Work', 'Personal', 'Study', 'Fitness', 'Reading', 'Finance'];
        const completedCategories = new Set();
        (tasks || []).forEach(t => {
          if (t.completed) completedCategories.add(t.category);
        });
        const count = defaultCategories.filter(cat => completedCategories.has(cat)).length;
        return { current: count, target: 6 };
      }
      case 'night_owl': {
        const nightOwlCompleted = (tasks || []).some(t => {
          if (t.completed && t.dueTime) {
            const hour = parseInt(t.dueTime.split(':')[0]);
            return hour >= 22 || hour <= 4;
          }
          return false;
        });
        return { current: nightOwlCompleted ? 1 : 0, target: 1 };
      }
      default:
        return { current: 0, target: 1 };
    }
  };

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [linkError, setLinkError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLink = (provider) => {
    setLinkError(null);
    const success = linkOAuthProvider(provider);
    if (!success) {
      setLinkError(`Failed to link ${provider} provider.`);
    }
  };

  const handleUnlink = (provider) => {
    setLinkError(null);
    const result = unlinkOAuthProvider(provider);
    if (result && !result.success) {
      setLinkError(result.error);
    }
  };

  const handleDeleteAccount = () => {
    deleteAccount();
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    const success = updateProfile(username.trim(), bio.trim());
    if (success) {
      setEditMode(false);
    }
  };

  // Focus Session Timer States
  const [timeLeft, setTimeLeft] = useState(1500); // default 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('Ready'); // 'Ready', 'Focusing', 'Paused'
  const [presetTime, setPresetTime] = useState(1500);
  const [customMins, setCustomMins] = useState('25');

  // Custom Picker and Preset States
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [pickerHours, setPickerHours] = useState(0);
  const [pickerMinutes, setPickerMinutes] = useState(25);
  const [pickerSeconds, setPickerSeconds] = useState(0);
  const [presetNameInput, setPresetNameInput] = useState('');

  const [customPresets, setCustomPresets] = useState(() => {
    const saved = localStorage.getItem('taskforge_custom_presets');
    return saved ? JSON.parse(saved) : [
      { id: 'focus-standard', name: '25 min Focus', duration: 1500, isDefault: true },
      { id: 'break-short', name: '5 min Break', duration: 300, isDefault: true },
      { id: 'break-long', name: '15 min Break', duration: 900, isDefault: true },
      { id: 'deep-work', name: '45 min Focus', duration: 2700, isDefault: true }
    ];
  });

  useEffect(() => {
    localStorage.setItem('taskforge_custom_presets', JSON.stringify(customPresets));
  }, [customPresets]);

  const handleSavePreset = (name, duration) => {
    if (!name.trim()) return;
    const newPreset = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      duration: duration,
      isDefault: false
    };
    setCustomPresets(prev => [...prev, newPreset]);
    setPresetNameInput('');
  };

  const handleDeletePreset = (id) => {
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleApplyPreset = (duration) => {
    setIsRunning(false);
    setPresetTime(duration);
    setTimeLeft(duration);
    setStatus('Ready');
    setCustomMins(Math.round(duration / 60).toString());
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setStatus('Ready');
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
    setStatus('Focusing');
  };

  const handlePause = () => {
    setIsRunning(false);
    setStatus('Paused');
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(presetTime);
    setStatus('Ready');
  };

  const handlePreset = (minutes) => {
    setIsRunning(false);
    const seconds = minutes * 60;
    setPresetTime(seconds);
    setTimeLeft(seconds);
    setStatus('Ready');
    setCustomMins(minutes.toString());
  };

  const handleAdjustTime = (amountMinutes) => {
    setIsRunning(false);
    setStatus('Ready');
    const newSeconds = Math.max(0, timeLeft + amountMinutes * 60);
    setTimeLeft(newSeconds);
    setPresetTime(newSeconds);
    setCustomMins(Math.round(newSeconds / 60).toString());
  };

  const handleCustomMinsChange = (e) => {
    const val = e.target.value;
    setCustomMins(val);

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 180) {
      setTimeLeft(parsed * 60);
      setPresetTime(parsed * 60);
    }
  };

  const handleApplyCustomMins = () => {
    const parsed = parseInt(customMins, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 180) {
      setTimeLeft(parsed * 60);
      setPresetTime(parsed * 60);
      setCustomMins(parsed.toString());
    } else {
      setCustomMins(Math.round(presetTime / 60).toString());
    }
  };

  const handleCustomMinsKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyCustomMins();
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = presetTime > 0 ? ((presetTime - timeLeft) / presetTime) * 100 : 0;
  const topSandHeight = 52 * (timeLeft / presetTime);
  const topSandY = 20 + (52 - topSandHeight);
  const bottomSandHeight = 52 * (1 - timeLeft / presetTime);
  const bottomSandY = 140 - bottomSandHeight;



  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const activeGoalsCount = weeklyObjectives.filter(w => !w.completed).length + monthlyGoals.filter(m => !m.completed).length;

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile & Achievements</h1>
          <p className="page-subtitle">Inspect your stats, consistency metrics, and gamified productivity awards.</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Column container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Left Column: User Profile Details Edit Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="sidebar-avatar" style={{ width: '100px', height: '100px', fontSize: '3rem', marginBottom: '1rem' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>

            {!editMode ? (
              <>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  {user?.username}
                  <button 
                    onClick={() => { setUsername(user?.username || ''); setBio(user?.bio || ''); setEditMode(true); }}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <Edit3 size={14} />
                  </button>
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: 0 }}>{user?.email}</p>
                <div 
                  style={{ 
                    marginTop: '1rem', 
                    fontSize: '0.95rem', 
                    color: 'var(--text-secondary)', 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '0.65rem 0.85rem', 
                    borderRadius: '8px', 
                    width: '100%',
                    border: '1px solid var(--glass-border)',
                    fontStyle: 'italic',
                    lineHeight: '1.4'
                  }}
                >
                  "{user?.bio || 'Productivity explorer'}"
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} style={{ width: '100%' }}>
                <div className="form-group">
                  <label className="form-label" style={{ textAlign: 'left' }}>Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ paddingLeft: '1rem' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ textAlign: 'left' }}>Bio</label>
                  <textarea
                    className="form-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ minHeight: '60px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="submit" className="settings-btn settings-btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
                    Save
                  </button>
                  <button 
                    type="button" 
                    className="settings-btn settings-btn-outline" 
                    onClick={() => setEditMode(false)}
                    style={{ flex: 1, padding: '0.5rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Statistics details */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Stats Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Lifetime Completed:</span>
                <strong style={{ color: 'var(--success)' }}>{lifetimeCompleted} tasks</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Perfect Days:</span>
                <strong>{perfectDaysCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Longest Streak:</span>
                <strong style={{ color: 'var(--warning)' }}>{streak.longest} days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Objectives:</span>
                <strong>{activeGoalsCount} goals</strong>
              </div>
            </div>
          </div>

          {/* Security & Linked Accounts */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Linked Accounts</h4>
            
            {linkError && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <ShieldAlert size={12} /> {linkError}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Email link status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <Mail size={14} />
                  <span>Email Sign-In</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: user?.authProviders?.includes('Email') ? 'var(--success)' : 'var(--text-muted)' }}>
                  {user?.authProviders?.includes('Email') ? 'Active' : 'Disabled'}
                </span>
              </div>

              {/* Google link status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <GoogleIcon size={14} />
                  <span>Google Account</span>
                </div>
                {user?.authProviders?.includes('Google') ? (
                  <button 
                    onClick={() => handleUnlink('Google')}
                    style={{ fontSize: '0.75rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Unlink
                  </button>
                ) : (
                  <button 
                    onClick={() => handleLink('Google')}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Link
                  </button>
                )}
              </div>

              {/* GitHub link status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <GithubIcon size={14} color="#FEFEFF" />
                  <span>GitHub Profile</span>
                </div>
                {user?.authProviders?.includes('GitHub') ? (
                  <button 
                    onClick={() => handleUnlink('GitHub')}
                    style={{ fontSize: '0.75rem', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Unlink
                  </button>
                ) : (
                  <button 
                    onClick={() => handleLink('GitHub')}
                    style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Link
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Deletion Danger Zone */}
          <div style={{ borderTop: '1px solid rgba(239, 68, 68, 0.15)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#ef4444', marginBottom: '0.75rem' }}>Danger Zone</h4>
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="settings-btn settings-btn-danger" 
                style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.08)' }}
              >
                Delete Account
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Are you sure? This deletes your profile and all task logs permanently.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={handleDeleteAccount}
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Yes, Delete
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Focus Timer / Study Session */}
        <div id="focus-timer" className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            ⏱️ Focus Hourglass
          </h3>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            
            {/* Left: Hourglass SVG */}
            <div style={{ flexShrink: 0, width: '120px', height: '160px', position: 'relative' }}>
              <svg width="120" height="160" viewBox="0 0 120 160">
                {/* Gradients */}
                <defs>
                  <linearGradient id="sand-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <clipPath id="top-clip">
                    <rect x="20" y={topSandY} width="80" height={topSandHeight} />
                  </clipPath>
                  <clipPath id="bottom-clip">
                    <rect x="20" y={bottomSandY} width="80" height={bottomSandHeight} />
                  </clipPath>
                </defs>

                {/* Top and Bottom Plates */}
                <rect x="22" y="10" width="76" height="8" rx="3" fill={hourglassPlatesColor} stroke={hourglassPlatesStroke} strokeWidth="1.5" />
                <rect x="22" y="142" width="76" height="8" rx="3" fill={hourglassPlatesColor} stroke={hourglassPlatesStroke} strokeWidth="1.5" />

                {/* Outer Glass Outline */}
                <path 
                  d="M 30 18 L 90 18 C 90 18, 85 55, 66 76 C 63 79, 63 81, 66 84 C 85 105, 90 142, 90 142 L 30 142 C 30 142, 35 105, 54 84 C 57 81, 57 79, 54 76 C 35 55, 30 18, 30 18 Z" 
                  fill={hourglassOutlineFill} 
                  stroke={hourglassOutlineStroke} 
                  strokeWidth="2.5" 
                />

                {/* Top Sand (draining) */}
                <path 
                  d="M 33 20 L 87 20 C 87 20, 82 55, 64 74 C 62 76, 58 76, 56 74 C 38 55, 33 20, 33 20 Z" 
                  fill="url(#sand-gradient)" 
                  clipPath="url(#top-clip)" 
                />

                {/* Bottom Sand (filling) */}
                <path 
                  d="M 33 140 C 33 140, 38 107, 56 88 C 58 86, 62 86, 64 88 C 82 107, 87 140, 87 140 Z" 
                  fill="url(#sand-gradient)" 
                  clipPath="url(#bottom-clip)" 
                />

                {/* Falling Sand Stream */}
                {isRunning && (
                  <line 
                    x1="60" 
                    y1="76" 
                    x2="60" 
                    y2="134" 
                    stroke="#FBBF24" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                    className="sand-stream"
                  />
                )}

                {/* Sand Pile at the bottom */}
                {isRunning && (
                  <path 
                    d="M 52 140 Q 60 130 68 140 Z" 
                    fill="#FBBF24" 
                    style={{
                      transformOrigin: '60px 140px',
                      animation: 'pulse-pile 1s ease-in-out infinite'
                    }}
                  />
                )}
              </svg>
            </div>

            {/* Right: Timer Readout, Status, Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', flexGrow: 1 }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', fontFamily: 'monospace', color: 'var(--text-primary)', letterSpacing: '1px', lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </div>
              
              <div>
                <span 
                  className="achievement-status-pill" 
                  style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.15rem 0.5rem',
                    background: status === 'Focusing' ? 'rgba(239, 68, 68, 0.15)' : status === 'Paused' ? 'rgba(245, 158, 11, 0.15)' : idleStatusBg,
                    color: status === 'Focusing' ? '#ef4444' : status === 'Paused' ? '#f59e0b' : 'var(--text-secondary)',
                    borderColor: status === 'Focusing' ? 'rgba(239, 68, 68, 0.3)' : status === 'Paused' ? 'rgba(245, 158, 11, 0.3)' : 'var(--glass-border)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    display: 'inline-block'
                  }}
                >
                  {status}
                </span>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', width: '100%', marginTop: '0.25rem' }}>
                {!isRunning ? (
                  <button 
                    className="filter-btn" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: 0,
                      background: 'var(--accent-primary)',
                      borderColor: 'transparent',
                      color: timerStartBtnText,
                      boxShadow: '0 4px 12px var(--accent-glow)'
                    }}
                    onClick={handleStart}
                    disabled={timeLeft === 0}
                    title="Start Session"
                  >
                    <Play size={16} fill={timerStartBtnText} />
                  </button>
                ) : (
                  <button 
                    className="filter-btn" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      padding: 0,
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderColor: 'rgba(245, 158, 11, 0.3)',
                      color: '#f59e0b'
                    }}
                    onClick={handlePause}
                    title="Pause Session"
                  >
                    <Pause size={16} />
                  </button>
                )}
                
                <button 
                  className="filter-btn" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: 0,
                    background: timerResetBtnBg,
                    borderColor: 'var(--glass-border)',
                    color: 'var(--text-secondary)'
                  }}
                  onClick={handleReset}
                  title="Reset Session"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

          </div>

          {/* Presets and Custom Controls Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
            
            {showCustomPicker ? (
              /* Inline Custom Picker Drawer */
              <div className="inline-timer-picker-container">
                <h4 style={{ margin: '0 0 0.15rem 0', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>Create Custom Timer</h4>
                <p style={{ margin: '0 0 0.5rem 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Choose focus session duration.
                </p>

                {/* Scrolling Wheels */}
                <div className="inline-wheel-container">
                  <InlineWheelPicker 
                    label="Hrs" 
                    range={Array.from({ length: 24 }, (_, i) => i)} 
                    value={pickerHours} 
                    onChange={setPickerHours} 
                  />
                  <InlineWheelPicker 
                    label="Mins" 
                    range={Array.from({ length: 60 }, (_, i) => i)} 
                    value={pickerMinutes} 
                    onChange={setPickerMinutes} 
                  />
                  <InlineWheelPicker 
                    label="Secs" 
                    range={Array.from({ length: 60 }, (_, i) => i)} 
                    value={pickerSeconds} 
                    onChange={setPickerSeconds} 
                  />
                </div>

                {/* Quick Chips Section inside Inline Drawer */}
                <div style={{ margin: '0.25rem 0' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quick Presets
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {[
                      { label: '15m', h: 0, m: 15, s: 0 },
                      { label: '25m', h: 0, m: 25, s: 0 },
                      { label: '30m', h: 0, m: 30, s: 0 },
                      { label: '45m', h: 0, m: 45, s: 0 },
                      { label: '1h', h: 1, m: 0, s: 0 },
                      { label: '1.5h', h: 1, m: 30, s: 0 },
                      { label: '2h', h: 2, m: 0, s: 0 }
                    ].map((chip, index) => (
                      <button
                        key={index}
                        className="custom-preset-chip"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                        type="button"
                        onClick={() => {
                          setPickerHours(chip.h);
                          setPickerMinutes(chip.m);
                          setPickerSeconds(chip.s);
                        }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Duration Preview */}
                <div style={{ textAlign: 'center', padding: '0.4rem', background: 'rgba(255,255,255,0.015)', borderRadius: '6px', border: '1px solid var(--glass-border)', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {pickerHours.toString().padStart(2, '0')}:{pickerMinutes.toString().padStart(2, '0')}:{pickerSeconds.toString().padStart(2, '0')}
                </div>

                {/* Save as Preset Optional Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Save Preset (optional):</label>
                  <input 
                    type="text"
                    placeholder="e.g. Coding Session, Workout..."
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '5px',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Validation Message */}
                {pickerHours === 0 && pickerMinutes === 0 && pickerSeconds === 0 && (
                  <div style={{ textAlign: 'center', color: '#ef4444', fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.08)', padding: '0.3rem', borderRadius: '4px' }}>
                    ⚠️ Select a duration greater than zero.
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button 
                    className="filter-btn"
                    style={{ flex: 1, padding: '0.35rem', fontSize: '0.8rem' }}
                    type="button"
                    onClick={() => {
                      setShowCustomPicker(false);
                      setPresetNameInput('');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="filter-btn"
                    disabled={pickerHours === 0 && pickerMinutes === 0 && pickerSeconds === 0}
                    style={{ 
                      flex: 1, 
                      padding: '0.35rem', 
                      fontSize: '0.8rem',
                      background: 'var(--accent-primary)',
                      borderColor: 'transparent',
                      color: 'white',
                      fontWeight: 600
                    }}
                    type="button"
                    onClick={() => {
                      const durationSeconds = (pickerHours * 3600) + (pickerMinutes * 60) + pickerSeconds;
                      if (presetNameInput.trim()) {
                        handleSavePreset(presetNameInput, durationSeconds);
                      }
                      handleApplyPreset(durationSeconds);
                      setShowCustomPicker(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Presets / Steppers / Recents List */
              <>
                {/* Presets Row */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Presets</span>
                  <div className="preset-chip-list">
                    {customPresets.map((preset) => {
                      const isActive = presetTime === preset.duration;
                      return (
                        <div 
                          key={preset.id}
                          className={`custom-preset-chip ${isActive ? 'active' : ''}`}
                          onClick={() => handleApplyPreset(preset.duration)}
                        >
                          {preset.name.replace(' min Focus', 'm Focus').replace(' min Break', 'm Break')}
                          {!preset.isDefault && (
                            <button 
                              className="custom-preset-delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePreset(preset.id);
                              }}
                              title="Delete Preset"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Timer Button & Steppers */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '0.25rem' }}>
                  <button 
                    className="filter-btn"
                    onClick={() => {
                      const hrs = Math.floor(presetTime / 3600);
                      const mins = Math.floor((presetTime % 3600) / 60);
                      const secs = presetTime % 60;
                      setPickerHours(hrs);
                      setPickerMinutes(mins);
                      setPickerSeconds(secs);
                      setShowCustomPicker(true);
                    }}
                    disabled={isRunning}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.35rem', 
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.8rem',
                      background: 'rgba(239, 68, 68, 0.05)',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    ⏳ Custom Timer
                  </button>

                  <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <button 
                      className="filter-btn" 
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => handleAdjustTime(-5)}
                      disabled={isRunning || timeLeft <= 300}
                    >
                      -5m
                    </button>
                    <button 
                      className="filter-btn" 
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => handleAdjustTime(5)}
                      disabled={isRunning}
                    >
                      +5m
                    </button>
                  </div>
                </div>

              </>
            )}

          </div>
        </div>
      </div>

      {/* Right Column: Achievements & Developer Profiles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minWidth: 0 }}>
        {/* Achievements Dashboard */}
        <div id="achievements" className="glass-panel achievements-container" style={{ width: '100%' }}>
            <div className="achievements-header">
              <div className="achievements-title-area">
                <h3 className="achievements-title">
                  🏆 Productivity Achievements
                </h3>
                <p className="achievements-subtitle">
                  Earn badges by staying consistent, completing goals, and maintaining productivity streaks.
                </p>
              </div>
              <span className="achievements-counter-badge">
                {unlockedCount} / {achievements.length} Unlocked
              </span>
            </div>

            <motion.div 
              className="achievement-grid"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {achievements.map((badge) => {
                const IconComponent = badgeIcons[badge.id] || Trophy;
                const { current, target } = getBadgeProgress(badge.id);
                const progressPct = Math.min(Math.round((current / target) * 100), 100);
                
                return (
                  <motion.div 
                    key={badge.id} 
                    className={`achievement-card ${badge.unlocked ? 'unlocked' : 'locked'}`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9, y: 15 },
                      show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                    }}
                    whileHover={{ 
                      y: -6, 
                      scale: 1.03, 
                      transition: { duration: 0.2 } 
                    }}
                    tabIndex={0}
                    aria-label={`${badge.name}: ${badge.desc}. Status: ${badge.unlocked ? 'Unlocked' : `Locked, progress ${current} of ${target}`}`}
                  >
                    {/* Unlocked Sparkle decorations */}
                    {badge.unlocked && <Sparkles className="achievement-sparkle" size={14} />}

                    <div className="achievement-icon-wrapper">
                      <div className="achievement-icon">
                        <IconComponent size={20} />
                      </div>
                      
                      {/* Locked overlay lock icon badge */}
                      {!badge.unlocked && (
                        <div className="achievement-lock-overlay" aria-hidden="true">
                          <Lock size={8} />
                        </div>
                      )}
                    </div>

                    <div className="achievement-name" title={badge.name}>
                      {badge.name}
                    </div>

                    <div className="achievement-desc" title={badge.desc}>
                      <span className="achievement-desc-text">{badge.desc}</span>
                    </div>

                    <div className="achievement-spacer" />

                    <div className="achievement-status-area">
                      {badge.unlocked ? (
                        <span className="achievement-status-pill">
                          <Check size={11} strokeWidth={3} /> Unlocked
                        </span>
                      ) : (
                        <div className="achievement-progress-container">
                          <div className="achievement-progress-bar-track">
                            <div 
                              className="achievement-progress-bar-fill"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="achievement-progress-text">
                            {current} / {target}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
        </div>

        {/* Developer Profiles Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div>
            <h3 className="achievements-title">
              <Code size={20} style={{ color: 'var(--accent-primary)' }} />
              Developer Profiles
            </h3>
            <p className="achievements-subtitle">
              Connect your coding platforms and access them directly from TaskForge.
            </p>
          </div>

          {/* Search bar */}
          <div className="search-bar" style={{ width: '100%' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search platforms or connected usernames..." 
              value={platformSearch}
              onChange={(e) => setPlatformSearch(e.target.value)}
            />
          </div>

          {/* Two column grid of platforms */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '1rem',
              marginTop: '0.5rem'
            }}
          >
            {filteredPlatforms.map(platform => {
              const profile = user?.developerProfiles?.[platform.id];
              const isConnected = profile?.connected;
              const isConnecting = activeConnectingPlatform === platform.id;
              const isEditing = editModePlatform === platform.id;

              return (
                <motion.div 
                  key={platform.id}
                  className="glass-panel"
                  style={{ 
                    padding: '1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.85rem',
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--text-muted)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div 
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: 'rgba(255,255,255,0.03)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          border: '1px solid var(--text-muted)'
                        }}
                      >
                        {getPlatformIcon(platform.id, 20)}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{platform.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: isConnected ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {isConnected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>

                    {isConnected && (
                      <span 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.2rem', 
                          fontSize: '0.7rem', 
                          fontWeight: '700', 
                          background: 'rgba(34, 197, 94, 0.1)', 
                          color: 'var(--success)', 
                          padding: '0.1rem 0.4rem', 
                          borderRadius: '99px',
                          border: '1px solid rgba(34, 197, 94, 0.2)'
                        }}
                      >
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    )}
                  </div>

                  {/* Connection Input form (when active) */}
                  {(isConnecting || isEditing) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--text-muted)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Username</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. john_doe123"
                          value={connectionUsername}
                          onChange={(e) => setConnectionUsername(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '0.1rem 0' }}>— OR —</div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Profile URL</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder={`e.g. https://${platform.domain}/...`}
                          value={connectionProfileUrl}
                          onChange={(e) => setConnectionProfileUrl(e.target.value)}
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                        />
                      </div>

                      {connectionError && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
                          ⚠️ {connectionError}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <button 
                          className="auth-submit-btn" 
                          style={{ margin: 0, padding: '0.45rem', fontSize: '0.8rem', flex: 1 }}
                          onClick={() => handleConnectProfile(platform.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="settings-btn settings-btn-outline" 
                          style={{ padding: '0.45rem', fontSize: '0.8rem', border: '1px solid var(--text-muted)' }}
                          onClick={() => {
                            setActiveConnectingPlatform(null);
                            setEditModePlatform(null);
                            setConnectionUsername('');
                            setConnectionProfileUrl('');
                            setConnectionError('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display platform status & actions */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--text-muted)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      {isConnected ? (
                        <>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Username: <strong style={{ color: 'var(--text-primary)' }}>@{profile.username}</strong>
                          </div>
                          
                          {/* Future statistics architecture placeholder */}
                          <div 
                            style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              gap: '0.25rem', 
                              background: 'rgba(255,255,255,0.01)', 
                              padding: '0.4rem 0.6rem', 
                              borderRadius: '6px',
                              border: '1px dashed var(--text-muted)',
                              fontSize: '0.75rem'
                            }}
                          >
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                              ⚡ Platform Stats (Connected)
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                              {platform.id === 'leetcode' && (
                                <>
                                  <span>Solved: --/3200</span>
                                  <span>Rating: --</span>
                                </>
                              )}
                              {platform.id === 'codeforces' && (
                                <>
                                  <span>Rank: --</span>
                                  <span>Rating: --</span>
                                </>
                              )}
                              {platform.id === 'github' && (
                                <>
                                  <span>Contribs: --</span>
                                  <span>Repos: --</span>
                                </>
                              )}
                              {platform.id === 'codechef' && (
                                <>
                                  <span>Stars: --</span>
                                  <span>Rating: --</span>
                                </>
                              )}
                              {platform.id === 'hackerrank' && (
                                <>
                                  <span>Badges: --</span>
                                  <span>Stars: --</span>
                                </>
                              )}
                              {platform.id === 'geeksforgeeks' && (
                                <>
                                  <span>Solved: --</span>
                                  <span>Score: --</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="auth-submit-btn" 
                              style={{ margin: 0, padding: '0.45rem', fontSize: '0.8rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                              onClick={() => {
                                openDevPlatform(platform.id);
                                setActiveTab('dev-viewer');
                              }}
                            >
                              <ExternalLink size={12} />
                              <span>Open</span>
                            </button>
                            
                            <button 
                              className="settings-btn settings-btn-outline" 
                              style={{ padding: '0.45rem', border: '1px solid var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => {
                                setConnectionUsername(profile.username);
                                setConnectionProfileUrl(profile.profileUrl);
                                setEditModePlatform(platform.id);
                              }}
                              title="Edit Connection"
                            >
                              <Edit3 size={12} />
                            </button>
                            
                            <button 
                              className="settings-btn settings-btn-outline" 
                              style={{ padding: '0.45rem', border: '1px solid var(--text-muted)', color: 'var(--danger)' }}
                              onClick={() => disconnectDeveloperProfile(platform.id)}
                              title="Disconnect Profile"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                            Connect to sync and view your developer stats and workspace.
                          </p>
                          <button 
                            className="settings-btn settings-btn-outline" 
                            style={{ width: '100%', padding: '0.45rem', border: '1px solid var(--text-muted)' }}
                            onClick={() => {
                              setActiveConnectingPlatform(platform.id);
                              setConnectionUsername('');
                              setConnectionProfileUrl('');
                              setConnectionError('');
                            }}
                          >
                            + Connect Account
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
