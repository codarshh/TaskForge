import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Heatmap from './Heatmap';
import { 
  Plus, 
  Flame, 
  Trophy, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FolderOpen,
  Calendar,
  Zap
} from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const { 
    user, 
    tasks, 
    addTask, 
    streak, 
    perfectDaysCount, 
    lifetimeCompleted,
    weeklyObjectives,
    monthlyGoals,
    theme
  } = useContext(AppContext);

  const [quickTitle, setQuickTitle] = useState('');

  // Handle Quick Add
  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask(quickTitle.trim(), 'Personal', 'medium');
    setQuickTitle('');
  };

  // Greeting based on time of day
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Completion calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const partialTasks = tasks.filter(t => t.partial).length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Circle progress calculation (r=38, C=2*pi*r = 238.76)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Reminders / Alerts
  const highPriorityAlerts = tasks.filter(t => !t.completed && t.priority === 'high');
  const upcomingTimes = tasks
    .filter(t => !t.completed && t.dueTime)
    .sort((a, b) => a.dueTime.localeCompare(b.dueTime));

  const totalGoals = weeklyObjectives.length + monthlyGoals.length;
  const completedGoals = weeklyObjectives.filter(o => o.completed).length + monthlyGoals.filter(g => g.completed).length;

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{getGreeting()}, {user?.username || 'User'}!</h1>
          <p className="page-subtitle">"Small consistent actions every day create extraordinary results."</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="settings-btn settings-btn-primary" onClick={() => setActiveTab('tasks')}>
            <Plus size={18} />
            <span>Manage Tasks</span>
          </button>
        </div>
      </div>

      {/* Grid: 3 Main Cards */}
      <div className="grid-3">
        {/* Card 1: Today's Completion Circle */}
        <div className="glass-panel stat-card" style={{ padding: '1rem 1.25rem' }}>
          <div className="stat-card-glow"></div>
          <div className="progress-ring-container" style={{ padding: '0.5rem' }}>
            <svg width="110" height="110" className="progress-ring">
              <g transform="rotate(-90 55 55)">
                <circle
                  stroke="rgba(255,255,255,0.03)"
                  fill="transparent"
                  strokeWidth="8"
                  r={radius}
                  cx="55"
                  cy="55"
                />
                <circle
                  stroke="url(#progress-gradient)"
                  fill="transparent"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  r={radius}
                  cx="55"
                  cy="55"
                  className="progress-ring-circle"
                />
              </g>
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#B91C1C' : '#CBAD8D'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#EF4444' : '#3A2D28'} />
                </linearGradient>
              </defs>
              <text x="55" y="50" textAnchor="middle" className="progress-ring-text" style={{ fontSize: '1.45rem' }}>
                {completionPercentage}%
              </text>
              <text x="55" y="70" textAnchor="middle" className="progress-ring-label" style={{ fontSize: '0.6rem' }}>
                Today
              </text>
            </svg>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {completedTasks} of {totalTasks} tasks complete {partialTasks > 0 && `(${partialTasks} partial)`}
            </div>
          </div>
        </div>

        {/* Card 2: Consistency & Streaks */}
        <div className="glass-panel stat-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="stat-card-glow" style={{ background: 'var(--warning)' }}></div>
          <div>
            <div className="stat-card-header" style={{ marginBottom: '0.5rem' }}>
              <span className="stat-card-title">Streak Progress</span>
              <div className="stat-card-icon" style={{ color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.05)', width: '32px', height: '32px' }}>
                <Flame size={16} fill={streak.current > 0 ? "var(--warning)" : "transparent"} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="stat-card-value" style={{ fontSize: '2rem' }}>{streak.current}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>days consistent</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Longest Streak:</span>
              <span style={{ fontWeight: '700', color: 'var(--warning)' }}>{streak.longest} days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Perfect Days:</span>
              <span style={{ fontWeight: '700', color: 'var(--success)' }}>{perfectDaysCount} days</span>
            </div>
          </div>
        </div>

        {/* Card 3: Lifetime Productivity */}
        <div className="glass-panel stat-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="stat-card-glow" style={{ background: 'var(--success)' }}></div>
          <div>
            <div className="stat-card-header" style={{ marginBottom: '0.5rem' }}>
              <span className="stat-card-title">Lifetime Productivity</span>
              <div className="stat-card-icon" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)', width: '32px', height: '32px' }}>
                <Trophy size={16} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span className="stat-card-value" style={{ fontSize: '2rem' }}>{lifetimeCompleted}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>tasks finished</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Goals:</span>
              <span style={{ fontWeight: '700' }}>{totalGoals - completedGoals} active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Goals Completed:</span>
              <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{completedGoals} / {totalGoals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap */}
      <div style={{ margin: '1.5rem 0' }}>
        <Heatmap compact={true} />
      </div>

      {/* Quick Action Input Form */}
      <form onSubmit={handleQuickAdd} className="quick-action-form animate-fade-in">
        <input
          type="text"
          className="quick-action-input"
          placeholder="What do you want to accomplish today? (e.g., Solve 3 LeetCode problems)"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          required
        />
        <button type="submit" className="quick-action-btn">
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </form>

      {/* Lower half grid (2-column layout) */}
      <div className="grid-2">
        {/* Left Column: Reminders & Alerts */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} style={{ color: 'var(--accent-primary)' }} />
            Today's Schedule & Reminders
          </h3>
          
          {upcomingTimes.length === 0 && highPriorityAlerts.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
              No critical reminders for today. Set a high priority or due time on a task.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {highPriorityAlerts.map(t => (
              <div 
                key={t.id} 
                className="glass-panel" 
                style={{ 
                  padding: '1rem', 
                  borderColor: 'rgba(239, 68, 68, 0.25)', 
                  background: 'rgba(239, 68, 68, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    High Priority Action Required
                  </div>
                </div>
                <button 
                  className="filter-btn" 
                  style={{ background: 'var(--bg-primary)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setActiveTab('tasks')}
                >
                  View
                </button>
              </div>
            ))}

            {upcomingTimes.map(t => (
              <div 
                key={t.id} 
                className="glass-panel" 
                style={{ 
                  padding: '1rem', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Clock size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Due today at {t.dueTime} • {t.category}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', background: 'var(--accent-glow)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  {t.dueTime}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Consistency Boosters / Motivation panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} style={{ color: 'var(--warning)' }} />
              Consistency Insights
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '8px', background: '#10b981', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Daily Target</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Completing even 1 task keeps your consistency streak alive. Set manageable targets.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '8px', background: '#eab308', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Visual Progression</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Check off tasks to fill the circular ring and light up your contribution heatmap.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '8px', background: 'var(--accent-secondary)', borderRadius: '4px' }}></div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Plan in Advance</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Reduce cognitive load by scheduling future events. Use the Future Planner tab to line up next week's milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div 
            style={{ 
              background: 'radial-gradient(circle at top right, var(--accent-glow), transparent)',
              border: '1px dashed var(--glass-border)',
              borderRadius: 'var(--border-radius-md)',
              padding: '1rem',
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Trophy size={24} style={{ color: 'var(--warning)' }} />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Streak Reward Alert:</strong> Build a 3-day, 7-day, or 30-day streak to unlock rare profile badges!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
