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
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  isSidebarCollapsed, 
  setIsSidebarCollapsed 
}) {
  const { 
    user, 
    logout, 
    streak, 
    theme, 
    toggleTheme 
  } = useContext(AppContext);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

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
    <aside 
      className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isSidebarOpen ? 'open' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mobile Drawer Close Button */}
      {isSidebarOpen && (
        <button 
          className="sidebar-mobile-close-btn" 
          onClick={() => setIsSidebarOpen(false)}
          title="Close Sidebar"
        >
          <X size={20} />
        </button>
      )}

      <div className="sidebar-logo">
        <Sparkles size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        {!isSidebarCollapsed && <span>TaskForge</span>}
        
        {/* Toggle Button for Tablet/Desktop Collapsing */}
        <button 
          className="sidebar-collapse-btn" 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="sidebar-profile">
        <div 
          className="sidebar-avatar" 
          onClick={() => setActiveTab('profile')} 
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
        {!isSidebarCollapsed && (
          <div className="sidebar-profile-info">
            <div className="sidebar-username">{user.username}</div>
            {streak.current > 0 && (
              <div className="sidebar-streak-badge">
                <Flame size={12} fill="#f59e0b" />
                <span>{streak.current} Day Streak</span>
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="sidebar-nav-item" 
          onClick={toggleTheme}
          title={isSidebarCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : ''}
        >
          {theme === 'dark' ? <Sun size={20} style={{ flexShrink: 0 }} /> : <Moon size={20} style={{ flexShrink: 0 }} />}
          {!isSidebarCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        
        <button 
          className="sidebar-nav-item" 
          onClick={logout} 
          style={{ color: '#ef4444' }}
          title={isSidebarCollapsed ? 'Reset Session' : ''}
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          {!isSidebarCollapsed && <span>Reset Session</span>}
        </button>
      </div>
    </aside>
  );
}
