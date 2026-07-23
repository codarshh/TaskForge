import React, { useState, useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import FuturePlanner from './components/FuturePlanner';
import CalendarView from './components/CalendarView';
import WeeklyMonthlyPlanner from './components/WeeklyMonthlyPlanner';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import EmbeddedViewer from './components/EmbeddedViewer';

function AppContent() {
  const { isAuthenticated, tasks } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [celebrate, setCelebrate] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  // Handle remember me session cleanup on unload
  useEffect(() => {
    const handleUnload = () => {
      const rememberMe = localStorage.getItem('taskforge_remember_me');
      if (rememberMe === 'false') {
        localStorage.removeItem('taskforge_token');
        localStorage.removeItem('taskforge_active_user');
        localStorage.removeItem('taskforge_refresh_token');
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Monitor task completion for celebration
  useEffect(() => {
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
      // Check if we've already celebrated in this session
      const alreadyCelebrated = sessionStorage.getItem('taskforge_celebrated_today');
      if (!alreadyCelebrated) {
        triggerCelebration();
        sessionStorage.setItem('taskforge_celebrated_today', 'true');
      }
    } else if (tasks.length > 0 && !tasks.every(t => t.completed)) {
      // Reset celebration if a task is unchecked
      sessionStorage.removeItem('taskforge_celebrated_today');
    }
  }, [tasks]);

  const triggerCelebration = () => {
    // Generate 60 random confetti particles
    const pieces = [];
    const colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#3b82f6'];
    
    for (let i = 0; i < 60; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100, // random percentage across screen width
        delay: Math.random() * 2, // random delay up to 2s
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6, // 6px - 14px size
        duration: Math.random() * 1.5 + 1.5 // 1.5s - 3s fall duration
      });
    }

    setConfettiPieces(pieces);
    setCelebrate(true);

    // Turn off celebration after 4 seconds
    setTimeout(() => {
      setCelebrate(false);
      setConfettiPieces([]);
    }, 4500);
  };

  // Render view based on active tab selection
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'tasks':
        return <TaskManager />;
      case 'future':
        return <FuturePlanner />;
      case 'planner':
        return <WeeklyMonthlyPlanner />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile setActiveTab={setActiveTab} />;
      case 'settings':
        return <Settings />;
      case 'dev-viewer':
        return <EmbeddedViewer setActiveTab={setActiveTab} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="app-container animate-fade-in">
      {/* Confetti Celebration Overlay */}
      {celebrate && (
        <div className="confetti-container">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.left}vw`,
                backgroundColor: piece.color,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px'
              }}
            />
          ))}
        </div>
      )}

      {/* Main sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content wrapper */}
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
