import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Auth from './Auth';
import { 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Sun, 
  Moon, 
  ArrowRight, 
  Flame, 
  Check, 
  X,
  Star,
  Award,
  Zap,
  LayoutGrid,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

export default function LandingPage() {
  const { 
    login, 
    theme, 
    toggleTheme 
  } = useContext(AppContext);

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', date: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showWhyTaskForge, setShowWhyTaskForge] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState('heatmap');

  // Fast mock login to let them explore instantly
  const handleTryDemo = async () => {
    try {
      await login('dev@taskforge.local', 'password');
    } catch (err) {
      console.error('Demo login error', err);
    }
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBooking(false);
      setBookingSuccess(false);
      setBookingForm({ name: '', email: '', date: '' });
    }, 3000);
  };

  // Mock heatmap cells data
  const heatmapCells = [
    [2, 0, 1, 3, 2, 4, 1, 0, 2, 3],
    [1, 3, 0, 2, 4, 1, 2, 3, 0, 1],
    [0, 1, 2, 0, 3, 2, 4, 1, 3, 2],
    [3, 2, 4, 1, 0, 3, 1, 2, 4, 0],
    [1, 0, 2, 3, 2, 1, 0, 4, 2, 3]
  ];

  const getHeatmapColorClass = (val) => {
    if (val === 0) return 'heatmap-cell-empty';
    if (val === 1) return 'heatmap-cell-low';
    if (val === 2) return 'heatmap-cell-medium';
    if (val === 3) return 'heatmap-cell-high';
    return 'heatmap-cell-max';
  };

  return (
    <div className="landing-container">
      {/* Decorative Grid Background */}
      <div className="landing-grid-bg"></div>
      <div className="landing-glow-top"></div>
      <div className="landing-glow-bottom"></div>

      {/* Header Navigation */}
      <header className="landing-header">
        <div className="landing-logo">
          <Sparkles size={26} className="logo-sparkle" />
          <span>TaskForge</span>
        </div>

        <nav className="landing-nav-links">
          <a href="#features" onClick={(e) => { e.preventDefault(); setShowHowItWorks(true); }} className="nav-link">Features</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); alert("TaskForge is currently 100% Free during Beta testing!"); }} className="nav-link">Pricing</a>
          <a href="#integrations" onClick={(e) => { e.preventDefault(); setActiveFeatureTab('integrations'); setShowHowItWorks(true); }} className="nav-link">Integrations</a>
        </nav>

        <div className="landing-header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button className="btn-signin" onClick={() => handleOpenAuth('login')}>
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-hero-section">
        {/* Tagline & Headlines */}
        <div className="hero-text-container">
          <h1 className="hero-title animate-title">
            Your Daily Productivity Command Center
          </h1>
          
          <p className="hero-description animate-fade-in-delayed">
            Stay organized, build productive habits, and focus on the work that creates the greatest impact every day.
            Success isn't achieved overnight—it's earned through consistency, dedication, and steady progress.
          </p>

          {/* Bullet points with checkmarks */}
          <div className="hero-bullets">
            <div className="bullet-item">
              <CheckCircle2 size={18} className="bullet-icon-check" />
              <span>Plan Better. Execute Smarter. Stay Consistent.</span>
            </div>
            <div className="bullet-item">
              <CheckCircle2 size={18} className="bullet-icon-check" />
              <span>Gamified habits, productivity heatmaps, and coding platform sync.</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="hero-ctas">
            <button className="btn-cta-primary btn-glow" onClick={() => setShowWhyTaskForge(true)}>
              Why TaskForge <ArrowRight size={18} style={{ marginLeft: '6px' }} />
            </button>
            
            <button className="btn-cta-secondary" onClick={() => setShowHowItWorks(true)}>
              <Play size={16} fill="currentColor" style={{ marginRight: '8px' }} />
              How It Works
            </button>
          </div>
        </div>

        {/* Dashboard Preview Section (Glowing Outline) */}
        <div className="dashboard-preview-wrapper animate-preview">
          <div className="glowing-border-mask"></div>
          
          {/* Glowing Border Container */}
          <div className="dashboard-mockup">
            
            {/* Mock Sidebar */}
            <div className="mock-sidebar">
              <div className="mock-sidebar-logo">
                <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div className="mock-sidebar-icons">
                <div className="mock-icon active"><LayoutGrid size={16} /></div>
                <div className="mock-icon"><TrendingUp size={16} /></div>
                <div className="mock-icon"><Star size={16} /></div>
                <div className="mock-icon"><Award size={16} /></div>
                <div className="mock-icon"><Zap size={16} /></div>
              </div>
              <div className="mock-sidebar-footer">
                <div className="mock-avatar">G</div>
              </div>
            </div>

            {/* Mock Dashboard Area */}
            <div className="mock-main">
              {/* Header */}
              <div className="mock-header">
                <div>
                  <div className="mock-title">Developer Workspace</div>
                  <div className="mock-subtitle">7 of 9 tasks completed today</div>
                </div>
                <div className="mock-badge">
                  <Flame size={12} fill="var(--warning)" style={{ color: 'var(--warning)', marginRight: '4px' }} />
                  7 Day Streak
                </div>
              </div>

              {/* Grid Content */}
              <div className="mock-grid">
                
                {/* Left Column: Tasks Checklist */}
                <div className="mock-card mock-tasks-card">
                  <div className="mock-card-header">Today's Checkpoint</div>
                  
                  <div className="mock-task-list">
                    <div className="mock-task-item completed">
                      <div className="mock-checkbox checked"><Check size={10} /></div>
                      <span className="mock-task-text">LeetCode Daily Challenge</span>
                      <span className="mock-pill mock-pill-high">High</span>
                    </div>

                    <div className="mock-task-item">
                      <div className="mock-checkbox"></div>
                      <span className="mock-task-text">Review team architecture pull request</span>
                      <span className="mock-pill mock-pill-medium">Medium</span>
                    </div>

                    <div className="mock-task-item completed">
                      <div className="mock-checkbox checked"><Check size={10} /></div>
                      <span className="mock-task-text">Update database indexes and schemas</span>
                      <span className="mock-pill mock-pill-high">High</span>
                    </div>

                    <div className="mock-task-item">
                      <div className="mock-checkbox"></div>
                      <span className="mock-task-text">Codeforces contest practice session</span>
                      <span className="mock-pill mock-pill-low">Low</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Statistics & Heatmap */}
                <div className="mock-right-col">
                  
                  {/* Row 1: Streak Progress Card */}
                  <div className="mock-card mock-streak-card">
                    <div className="mock-streak-stat">
                      <div className="mock-streak-val">
                        <Flame size={24} fill="var(--warning)" style={{ color: 'var(--warning)', marginRight: '8px' }} className="bounce-flame" />
                        <span>7 Days</span>
                      </div>
                      <div className="mock-streak-label">Consistent actions</div>
                    </div>
                  </div>

                  {/* Row 2: Heatmap Visual */}
                  <div className="mock-card mock-heatmap-card">
                    <div className="mock-card-header">Activity Tracker</div>
                    
                    <div className="mock-heatmap-grid">
                      {heatmapCells.map((row, rIndex) => (
                        <div className="mock-heatmap-row" key={rIndex}>
                          {row.map((cellVal, cIndex) => (
                            <div 
                              className={`mock-heatmap-cell ${getHeatmapColorClass(cellVal)}`} 
                              key={cIndex}
                              title={`${cellVal} tasks completed`}
                            ></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL 1: AUTHENTICATION OVERLAY */}
      {showAuth && (
        <Auth 
          initialMode={authMode} 
          onClose={() => setShowAuth(false)} 
        />
      )}

      {/* MODAL 2: BOOKING DEMO MODAL */}
      {showBooking && (
        <div className="auth-modal-overlay modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="auth-card glass-panel animate-pop-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', position: 'relative' }}>
            <button className="auth-close-btn" onClick={() => setShowBooking(false)} aria-label="Close">
              <X size={20} />
            </button>
            
            <div className="auth-header">
              <div className="auth-logo">
                <Sparkles size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom', color: 'var(--accent-secondary)' }} />
                Book Demo
              </div>
              <p className="auth-tagline">"Schedule a personalized command center walk-through"</p>
            </div>

            {bookingSuccess ? (
              <div className="auth-success animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '0.5rem', textAlign: 'center' }}>
                <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                <strong>Demo Reservation Pending!</strong>
                <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>Check your email inbox shortly for your calendar invite.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter name"
                    value={bookingForm.name} 
                    onChange={e => setBookingForm({...bookingForm, name: e.target.value})} 
                    style={{ paddingLeft: '1rem' }}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="Enter email"
                    value={bookingForm.email} 
                    onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                    style={{ paddingLeft: '1rem' }}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={bookingForm.date} 
                    onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                    style={{ paddingLeft: '1rem' }}
                    required 
                  />
                </div>

                <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
                  Schedule Demo
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: HOW IT WORKS FEATURE TOUR */}
      {showHowItWorks && (
        <div className="auth-modal-overlay modal-overlay" onClick={() => setShowHowItWorks(false)}>
          <div className="auth-card glass-panel animate-pop-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', position: 'relative', padding: '2rem' }}>
            <button className="auth-close-btn" onClick={() => setShowHowItWorks(false)} aria-label="Close">
              <X size={20} />
            </button>
            
            <div className="auth-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <div className="auth-logo" style={{ fontSize: '1.8rem', background: 'none', WebkitTextFillColor: 'unset', color: 'var(--text-primary)' }}>
                How TaskForge Works
              </div>
              <p className="auth-tagline" style={{ textAlign: 'left' }}>Your productivity dashboard engineered for programmers</p>
            </div>

            {/* Feature Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', gap: '1rem', marginBottom: '1.5rem' }}>
              <button 
                className={`tab-link ${activeFeatureTab === 'heatmap' ? 'active' : ''}`}
                onClick={() => setActiveFeatureTab('heatmap')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeFeatureTab === 'heatmap' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  fontWeight: activeFeatureTab === 'heatmap' ? '700' : '500',
                  padding: '0.5rem 0 0.75rem 0',
                  borderBottom: activeFeatureTab === 'heatmap' ? '2px solid var(--accent-primary)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                📊 Activity Heatmap
              </button>
              <button 
                className={`tab-link ${activeFeatureTab === 'streaks' ? 'active' : ''}`}
                onClick={() => setActiveFeatureTab('streaks')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeFeatureTab === 'streaks' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  fontWeight: activeFeatureTab === 'streaks' ? '700' : '500',
                  padding: '0.5rem 0 0.75rem 0',
                  borderBottom: activeFeatureTab === 'streaks' ? '2px solid var(--accent-primary)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                🔥 Habit Streaks
              </button>
              <button 
                className={`tab-link ${activeFeatureTab === 'integrations' ? 'active' : ''}`}
                onClick={() => setActiveFeatureTab('integrations')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeFeatureTab === 'integrations' ? 'var(--accent-hover)' : 'var(--text-secondary)',
                  fontWeight: activeFeatureTab === 'integrations' ? '700' : '500',
                  padding: '0.5rem 0 0.75rem 0',
                  borderBottom: activeFeatureTab === 'integrations' ? '2px solid var(--accent-primary)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                💻 Dev Integrations
              </button>
            </div>

            {/* Feature Content */}
            <div style={{ minHeight: '160px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {activeFeatureTab === 'heatmap' && (
                <div className="animate-fade-in">
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '700' }}>Visualize Consistency, Like Coding</h4>
                  <p style={{ marginBottom: '1rem' }}>
                    TaskForge translates your completed productivity objectives into an activity heatmap, similar to GitHub contributions. It helps you stay visually committed to filling your board every single day.
                  </p>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[4, 1, 3, 2, 4, 0, 2, 3, 4, 1, 4].map((v, i) => (
                        <div 
                          key={i} 
                          className={`mock-heatmap-cell ${getHeatmapColorClass(v)}`} 
                          style={{ width: '16px', height: '16px', borderRadius: '3px' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'streaks' && (
                <div className="animate-fade-in">
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '700' }}>Gamified Progress Safeguards</h4>
                  <p style={{ marginBottom: '1rem' }}>
                    Never break a streak. Complete all high-priority cards today to maintain your streak level. The flame badge grows, and perfect days score multipliers to help build core atomic habits.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <Flame size={32} fill="var(--warning)" style={{ color: 'var(--warning)', animation: 'pulse 1.5s infinite' }} />
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Streak Bonus Multiplier Active</strong>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>+1.5x score bonus for 7 days consistent streak</div>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'integrations' && (
                <div className="animate-fade-in">
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '700' }}>Connected Developer Pipelines</h4>
                  <p style={{ marginBottom: '1rem' }}>
                    Sync your workspace with platform profiles like GitHub and LeetCode. Complete challenges or push code commits, and watch TaskForge automatically track, log, and reward your developer tasks!
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>⚫</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-primary)' }}>GitHub Profile</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Connected & Listening</div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>🟠</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-primary)' }}>LeetCode Profile</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Connected & Listening</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="settings-btn settings-btn-outline" onClick={() => setShowHowItWorks(false)} style={{ padding: '0.5rem 1rem' }}>
                Close Overview
              </button>
              <button className="settings-btn settings-btn-primary" onClick={() => { setShowHowItWorks(false); handleTryDemo(); }} style={{ padding: '0.5rem 1rem' }}>
                Launch Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Why TaskForge Modal */}
      {showWhyTaskForge && (
        <div className="settings-modal-overlay animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 1000 }}>
          <div className="settings-modal-content glass-card animate-scale-up" style={{ maxWidth: '600px', width: '90%', padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ margin: 0, fontWeight: '800', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Why TaskForge?</h3>
              </div>
              <button 
                onClick={() => setShowWhyTaskForge(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.15)', minWidth: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '0.95rem' }}>Built for Developers</h4>
                  <p style={{ margin: 0 }}>Sync your workflow with LeetCode, GitHub, and other platforms. Complete daily code challenges and commits, and watch them resolve to your task list automatically.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.15)', minWidth: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
                  <Flame size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '0.95rem' }}>Gamified Consistency Tracker</h4>
                  <p style={{ margin: 0 }}>Visualize your habit progress with interactive contribution heatmaps and level up streaks. Complete cards daily to maintain multipliers and achieve your goals.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', minWidth: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '0.95rem' }}>Cloud-Synced & Offline-First</h4>
                  <p style={{ margin: 0 }}>Work uninterrupted on staging or local environments. Your progress is cached instantly offline and synchronized securely to MongoDB Atlas once back online.</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="settings-btn settings-btn-outline" onClick={() => setShowWhyTaskForge(false)} style={{ padding: '0.5rem 1.5rem', background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
