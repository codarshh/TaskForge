import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Trash2, CheckCircle2, Bookmark, Target, Award, ListChecks } from 'lucide-react';

export default function WeeklyMonthlyPlanner() {
  const {
    weeklyObjectives,
    addWeeklyObjective,
    toggleWeeklyObjective,
    deleteWeeklyObjective,
    monthlyGoals,
    addMonthlyGoal,
    toggleMonthlyGoal,
    deleteMonthlyGoal
  } = useContext(AppContext);

  const [activeBoard, setActiveBoard] = useState('weekly'); // 'weekly' | 'monthly'
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeBoard === 'weekly') {
      addWeeklyObjective(newTitle.trim());
    } else {
      addMonthlyGoal(newTitle.trim());
    }
    setNewTitle('');
  };

  // Progress Calculations
  const weeklyTotal = weeklyObjectives.length;
  const weeklyCompleted = weeklyObjectives.filter(o => o.completed).length;
  const weeklyRate = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

  const monthlyTotal = monthlyGoals.length;
  const monthlyCompleted = monthlyGoals.filter(g => g.completed).length;
  const monthlyRate = monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0;

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Long-Term Goal Planner</h1>
          <p className="page-subtitle">Align your daily actions with high-level weekly objectives and monthly milestones.</p>
        </div>
      </div>

      {/* Tab Triggers */}
      <div className="planner-tabs">
        <div 
          className={`planner-tab-btn ${activeBoard === 'weekly' ? 'active' : ''}`}
          onClick={() => { setActiveBoard('weekly'); setNewTitle(''); }}
        >
          Weekly Objectives
        </div>
        <div 
          className={`planner-tab-btn ${activeBoard === 'monthly' ? 'active' : ''}`}
          onClick={() => { setActiveBoard('monthly'); setNewTitle(''); }}
        >
          Monthly Milestones
        </div>
      </div>

      {/* Main Grid: Input Form + Progress Card (left) & Interactive List Board (right) */}
      <div className="planner-layout-grid">
        {/* Left Column: Input Panel & Analytics card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Add Goal Form */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {activeBoard === 'weekly' ? <Bookmark size={18} style={{ color: 'var(--accent-primary)' }} /> : <Target size={18} style={{ color: 'var(--accent-secondary)' }} />}
              {activeBoard === 'weekly' ? 'Add Weekly Target' : 'Add Monthly Goal'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '1rem' }}
                  placeholder={activeBoard === 'weekly' ? 'e.g. Complete sprint prototype' : 'e.g. Read 3 books, Publish app'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="auth-submit-btn" 
                style={{ 
                  background: activeBoard === 'weekly' 
                    ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%)'
                    : 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-hover) 100%)',
                  marginTop: '0.25rem' 
                }}
              >
                Create Objective
              </button>
            </form>
          </div>

          {/* Progress Analytics Widget */}
          <div className="glass-panel stat-card">
            <div className="stat-card-glow" style={{ background: activeBoard === 'weekly' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}></div>
            <div className="stat-card-header">
              <span className="stat-card-title">Completion Rate</span>
              <div className="stat-card-icon">
                <Award size={20} style={{ color: activeBoard === 'weekly' ? 'var(--accent-primary)' : 'var(--accent-secondary)' }} />
              </div>
            </div>
            
            <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              {activeBoard === 'weekly' ? weeklyRate : monthlyRate}%
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                <span>Progress:</span>
                <span>
                  {activeBoard === 'weekly' ? `${weeklyCompleted} / ${weeklyTotal}` : `${monthlyCompleted} / ${monthlyTotal}`} completed
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${activeBoard === 'weekly' ? weeklyRate : monthlyRate}%`,
                    background: activeBoard === 'weekly' 
                      ? 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-hover) 100%)'
                      : 'linear-gradient(90deg, var(--accent-secondary) 0%, var(--accent-hover) 100%)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Objectives checklist list */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <ListChecks size={20} style={{ color: 'var(--text-secondary)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>
              {activeBoard === 'weekly' ? 'This Week\'s Core Targets' : 'Long-Term Monthly Objectives'}
            </h3>
          </div>

          {activeBoard === 'weekly' ? (
            weeklyObjectives.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
                <Bookmark size={40} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--accent-primary)' }} />
                <h4>No weekly objectives set</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Set specific goals to focus on during this week.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {weeklyObjectives.map(obj => (
                  <div key={obj.id} className={`planner-objective-item ${obj.completed ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                      <label className="task-checkbox-container">
                        <input
                          type="checkbox"
                          className="task-checkbox-input"
                          checked={obj.completed}
                          onChange={() => toggleWeeklyObjective(obj.id)}
                        />
                        <span className="task-checkbox-checkmark"></span>
                      </label>
                      <span 
                        style={{ 
                          fontWeight: '600', 
                          fontSize: '0.95rem',
                          textDecoration: obj.completed ? 'line-through' : 'none',
                          color: obj.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={() => toggleWeeklyObjective(obj.id)}
                      >
                        {obj.title}
                      </span>
                    </div>
                    <button 
                      className="task-action-btn delete-btn"
                      onClick={() => deleteWeeklyObjective(obj.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            monthlyGoals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
                <Target size={40} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--accent-secondary)' }} />
                <h4>No monthly milestones set</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Map out larger goals to tackle across the calendar month.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {monthlyGoals.map(goal => (
                  <div key={goal.id} className={`planner-objective-item ${goal.completed ? 'completed' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                      <label className="task-checkbox-container">
                        <input
                          type="checkbox"
                          className="task-checkbox-input"
                          checked={goal.completed}
                          onChange={() => toggleMonthlyGoal(goal.id)}
                        />
                        <span className="task-checkbox-checkmark" style={{ borderColor: 'var(--text-muted)' }}></span>
                      </label>
                      <span 
                        style={{ 
                          fontWeight: '600', 
                          fontSize: '0.95rem',
                          textDecoration: goal.completed ? 'line-through' : 'none',
                          color: goal.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        onClick={() => toggleMonthlyGoal(goal.id)}
                      >
                        {goal.title}
                      </span>
                    </div>
                    <button 
                      className="task-action-btn delete-btn"
                      onClick={() => deleteMonthlyGoal(goal.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
