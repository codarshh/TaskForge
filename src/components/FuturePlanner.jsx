import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, Calendar, Trash2, Tag, AlertTriangle, ArrowRight } from 'lucide-react';

export default function FuturePlanner() {
  const { futureTasks, addFutureTask, deleteFutureTask, getTodayString } = useContext(AppContext);
  
  // Date selector for active display
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Modal controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState(0);
  const [taskNotes, setTaskNotes] = useState('');

  const categories = ['Work', 'Personal', 'Study', 'Fitness', 'Reading', 'Finance'];

  // Generate list of the next 14 days
  const getNext14Days = () => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      const dateStr = next.toISOString().split('T')[0];
      const dayName = next.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = next.getDate();
      const monthName = next.toLocaleDateString('en-US', { month: 'short' });
      list.push({ dateStr, dayName, dayNum, monthName });
    }
    return list;
  };

  const next14Days = getNext14Days();

  // Tasks scheduled for the currently selected date
  const selectedTasks = futureTasks.filter(t => t.scheduledDate === selectedDate);

  const handleAddFutureTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    addFutureTask(
      taskTitle.trim(),
      selectedDate,
      taskCategory,
      taskPriority,
      taskDueTime,
      taskEstimatedTime,
      taskNotes.trim()
    );
    
    // Reset Form
    setTaskTitle('');
    setTaskCategory('Personal');
    setTaskPriority('medium');
    setTaskDueTime('');
    setTaskEstimatedTime(0);
    setTaskNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Future Planner</h1>
          <p className="page-subtitle">Schedule tasks in advance. They will automatically migrate to your Daily Task Manager when their scheduled date arrives.</p>
        </div>
        <button className="settings-btn settings-btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          <span>Schedule Task</span>
        </button>
      </div>

      {/* Horizontal slider of next 14 days */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          overflowX: 'auto', 
          paddingBottom: '1rem',
          marginBottom: '2rem'
        }}
      >
        {next14Days.map((day) => {
          const isActive = selectedDate === day.dateStr;
          const dayTasksCount = futureTasks.filter(t => t.scheduledDate === day.dateStr).length;

          return (
            <div
              key={day.dateStr}
              onClick={() => setSelectedDate(day.dateStr)}
              className="glass-panel"
              style={{
                flexShrink: 0,
                width: '80px',
                padding: '0.75rem 0.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--glass-border)',
                background: isActive ? 'var(--accent-primary)' : 'var(--glass-bg)',
                color: isActive ? 'white' : 'var(--text-primary)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: isActive ? 0.9 : 0.6, fontWeight: '700' }}>
                {day.dayName}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0.15rem 0' }}>
                {day.dayNum}
              </div>
              <div style={{ fontSize: '0.7rem', opacity: isActive ? 0.9 : 0.6 }}>
                {day.monthName}
              </div>
              {dayTasksCount > 0 && (
                <div 
                  style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.65rem', 
                    fontWeight: '800',
                    background: isActive ? 'white' : 'var(--accent-primary)',
                    color: isActive ? 'var(--accent-primary)' : 'white',
                    borderRadius: '9999px',
                    padding: '0.05rem 0.25rem',
                    display: 'inline-block'
                  }}
                >
                  {dayTasksCount} {dayTasksCount === 1 ? 'task' : 'tasks'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid: Date Panel & Task list */}
      <div className="planner-layout-grid">
        {/* Date summary panel */}
        <div className="glass-panel" style={{ padding: '1.75rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
            <Calendar size={24} />
            <h3 style={{ fontSize: '1.25rem' }}>Active Planning</h3>
          </div>
          
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Target Date: <strong style={{ color: 'var(--text-primary)' }}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Overview</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <span>Total Scheduled:</span>
              <strong>{selectedTasks.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Average priority:</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {selectedTasks.length > 0 
                  ? selectedTasks.filter(t => t.priority === 'high').length > selectedTasks.filter(t => t.priority === 'low').length 
                    ? 'High' : 'Medium' 
                  : 'N/A'
                }
              </strong>
            </div>
          </div>
        </div>

        {/* Task lists scheduled */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Scheduled Tasks</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedTasks.length} planned</span>
          </div>

          {selectedTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
              <Calendar size={40} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--accent-primary)' }} />
              <h4>No tasks scheduled for this day</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Click "Schedule Task" to add work items ahead of time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedTasks.map(t => (
                <div 
                  key={t.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: '1.25rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderLeft: t.priority === 'high' ? '4px solid var(--danger)' : '4px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{t.title}</div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span className={`task-badge priority-${t.priority}`}>{t.priority.toUpperCase()}</span>
                      <span className="task-badge category-tag">{t.category}</span>
                      {t.dueTime && <span>Due: {t.dueTime}</span>}
                      {t.estimatedTime > 0 && <span>Est: {t.estimatedTime}h</span>}
                    </div>
                    {t.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>Notes: {t.notes}</div>}
                  </div>
                  <button 
                    className="task-action-btn delete-btn"
                    onClick={() => deleteFutureTask(t.id)}
                    title="Remove Schedule"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Future Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-pop-in">
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
              <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
            </button>
            <h2 className="modal-title">Schedule Future Task</h2>
            <div style={{ marginBottom: '1.25rem', background: 'var(--accent-glow)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={14} />
              <span>Scheduling for: <strong>{selectedDate}</strong></span>
            </div>
            <form onSubmit={handleAddFutureTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Call client regarding contract"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  style={{ paddingLeft: '1rem' }}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-select"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Due Time (Optional)</label>
                  <input
                    type="time"
                    className="form-input"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Est. Time (Hours)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="form-input"
                    value={taskEstimatedTime}
                    onChange={(e) => setTaskEstimatedTime(e.target.value)}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Specific sub-items or description..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
                Schedule Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
