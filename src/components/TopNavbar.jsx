import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Menu, Bell, Sparkles } from 'lucide-react';

export default function TopNavbar({ 
  setIsSidebarOpen, 
  setIsSidebarCollapsed, 
  isSidebarCollapsed, 
  activeTab, 
  setActiveTab 
}) {
  const { user } = useContext(AppContext);

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button 
          className="hamburger-btn" 
          onClick={handleMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="top-navbar-logo" onClick={() => setActiveTab('dashboard')}>
          <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>TaskForge</span>
        </div>
      </div>

      <div className="top-navbar-right">
        {/* Notification Bell Badge */}
        <button className="top-navbar-bell" aria-label="Notifications">
          <Bell size={20} />
          <span className="bell-badge"></span>
        </button>

        {/* Profile Avatar Trigger */}
        <button 
          className={`top-navbar-avatar-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          aria-label="View user profile"
        >
          <div className="top-navbar-avatar">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
        </button>
      </div>
    </header>
  );
}
