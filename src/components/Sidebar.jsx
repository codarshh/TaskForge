import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarDays, 
  CalendarRange, 
  BookOpen, 
  TrendingUp, 
  User, 
  Settings, 
  LogOut,
  Flame,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

const PLATFORM_META = {
  leetcode: { name: 'LeetCode', logo: '🟠' },
  codeforces: { name: 'Codeforces', logo: '🔵' },
  github: { name: 'GitHub', logo: '⚫' },
  codechef: { name: 'CodeChef', logo: '🟢' },
  hackerrank: { name: 'HackerRank', logo: '🟣' },
  geeksforgeeks: { name: 'GeeksforGeeks', logo: '🟢' }
};

export default function Sidebar({ activeTab, setActiveTab }) {
  const { 
    user, 
    logout, 
    streak, 
    theme, 
    toggleTheme, 
    openDevPlatform, 
    currentDevPlatformTab 
  } = useContext(AppContext);

  const [isHubExpanded, setIsHubExpanded] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'future', label: 'Future Planner', icon: CalendarDays },
    { id: 'planner', label: 'Weekly & Monthly', icon: BookOpen },
    { id: 'calendar', label: 'Calendar History', icon: CalendarRange },
    { id: 'analytics', label: 'Productivity Analytics', icon: TrendingUp },
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Sparkles size={24} style={{ color: 'var(--accent-primary)' }} />
        <span>TaskForge</span>
      </div>

      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-username">{user.username}</div>
          {streak.current > 0 && (
            <div className="sidebar-streak-badge">
              <Flame size={12} fill="#f59e0b" />
              <span>{streak.current} Day Streak</span>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>


      <div className="sidebar-footer">
        <button className="sidebar-nav-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        
        <button className="sidebar-nav-item" onClick={logout} style={{ color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Reset Session</span>
        </button>
      </div>
    </aside>
  );
}
