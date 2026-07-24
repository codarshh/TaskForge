import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  LayoutGrid, 
  CalendarRange, 
  Flame, 
  CalendarDays, 
  Clock, 
  TrendingUp, 
  Activity, 
  Trophy, 
  Code, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  X,
  Sun,
  Moon
} from 'lucide-react';

// Custom sleek toast injector
export const showToast = (message) => {
  const existing = document.getElementById('taskforge-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'taskforge-toast';
  toast.className = 'custom-toast';
  toast.innerText = message;
  document.body.appendChild(toast);
  
  // Trigger entry animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Trigger exit animation and removal
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
};

export default function MobileDrawer({ isOpen, onClose, activeTab, setActiveTab }) {
  const { 
    user, 
    logout, 
    streak, 
    theme, 
    toggleTheme,
    updateTaskViewMode 
  } = useContext(AppContext);

  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  // Keypress and scroll locks
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Shift focus to the close button inside the drawer
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus inside drawer
  useEffect(() => {
    const handleFocusTrap = (e) => {
      if (!isOpen || !drawerRef.current) return;
      if (e.key !== 'Tab') return;

      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleFocusTrap);
    return () => window.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  // Touch Swipe gestures to close drawer
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe && isOpen) {
      onClose();
    }
  };

  if (!user) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks-list', label: 'My Tasks', icon: CheckSquare },
    { id: 'tasks-kanban', label: 'Kanban Board', icon: LayoutGrid },
    { id: 'calendar', label: 'Calendar History', icon: CalendarRange },
    { id: 'goals', label: 'Goals', icon: Flame },
    { id: 'future', label: 'Future Planner', icon: CalendarDays },
    { id: 'focus-timer', label: 'Focus Timer', icon: Clock },
    { id: 'analytics', label: 'Productivity Analytics', icon: TrendingUp },
    { id: 'heatmap', label: 'Productivity Heatmap', icon: Activity },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'dev-viewer', label: 'Developer Hub', icon: Code },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (itemId) => {
    onClose();

    // Mapping custom items to their tab states and element scroll targets
    if (itemId === 'tasks-list') {
      updateTaskViewMode('list');
      setActiveTab('tasks');
    } else if (itemId === 'tasks-kanban') {
      updateTaskViewMode('kanban');
      setActiveTab('tasks');
    } else if (itemId === 'goals') {
      setActiveTab('planner');
    } else if (itemId === 'focus-timer') {
      setActiveTab('profile');
      setTimeout(() => {
        const el = document.getElementById('focus-timer');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else if (itemId === 'heatmap') {
      setActiveTab('dashboard');
      setTimeout(() => {
        const el = document.getElementById('heatmap-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else if (itemId === 'achievements') {
      setActiveTab('profile');
      setTimeout(() => {
        const el = document.getElementById('achievements');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else if (itemId === 'notifications') {
      showToast('📬 You are all caught up! No unread notifications.');
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <div 
      className={`mobile-drawer-wrapper ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Backdrop overlay */}
      <div 
        className="mobile-drawer-backdrop" 
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside 
        ref={drawerRef}
        className={`mobile-drawer-aside ${isOpen ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top header with close button */}
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-logo" onClick={() => handleNavClick('dashboard')}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>TaskForge</span>
          </div>
          <button 
            ref={closeButtonRef}
            className="mobile-drawer-close-btn"
            onClick={onClose}
            aria-label="Close navigation drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Card inside drawer */}
        <div className="mobile-drawer-profile">
          <div 
            className="mobile-drawer-avatar"
            onClick={() => handleNavClick('profile')}
          >
            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="mobile-drawer-profile-info">
            <div className="mobile-drawer-username">{user.username}</div>
            {streak.current > 0 && (
              <div className="mobile-drawer-streak">
                <Flame size={12} fill="#f59e0b" />
                <span>{streak.current} Day Streak</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation items list */}
        <nav className="mobile-drawer-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Determine active highlight status
            let isActive = activeTab === item.id;
            if (item.id === 'tasks-list' && activeTab === 'tasks') {
              isActive = (localStorage.getItem('taskforge_view_preference') || 'kanban') === 'list';
            } else if (item.id === 'tasks-kanban' && activeTab === 'tasks') {
              isActive = (localStorage.getItem('taskforge_view_preference') || 'kanban') === 'kanban';
            } else if (item.id === 'goals' && activeTab === 'planner') {
              isActive = true;
            }

            return (
              <button
                key={item.id}
                className={`mobile-drawer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={20} className="mobile-drawer-nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="mobile-drawer-footer">
          <button 
            className="mobile-drawer-nav-item toggle-theme-btn" 
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button 
            className="mobile-drawer-nav-item logout-btn" 
            onClick={logout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
