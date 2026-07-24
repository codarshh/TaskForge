import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar, CheckSquare, AlertCircle } from 'lucide-react';

export default function CalendarView() {
  const { history, tasks, getTodayString } = useContext(AppContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => getTodayString());

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(prev => {
      const copy = new Date(prev);
      copy.setMonth(prev.getMonth() - 1);
      return copy;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      const copy = new Date(prev);
      copy.setMonth(prev.getMonth() + 1);
      return copy;
    });
  };

  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  
  // Empty slots for padding before 1st of month
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }

  // Days of the month
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Selected Day Details
  const historyRecord = history[selectedDateStr];
  // If selectedDateStr is today, and we don't have a history record saved in local storage yet, or we want the active live tasks:
  const isSelectedToday = selectedDateStr === getTodayString();
  const selectedTasksList = isSelectedToday 
    ? tasks 
    : (historyRecord?.tasksList || []);

  const getIndicatorClass = (dateStr) => {
    const record = history[dateStr];
    if (!record || record.total === 0) return 'none';
    if (record.rate === 100) return 'perfect';
    if (record.rate >= 50) return 'high';
    return 'partial';
  };

  const handleCellClick = (day) => {
    if (!day) return;
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDateStr(`${year}-${monthStr}-${dayStr}`);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar History</h1>
          <p className="page-subtitle">Browse through your productivity logs. Select any day to inspect details and see archived tasks.</p>
        </div>
      </div>

      <div className="calendar-layout-grid">
        {/* Calendar Grid card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {/* Calendar Header Control */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: 'var(--accent-primary)' }} />
              {monthNames[month]} {year}
            </h3>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="task-action-btn" onClick={prevMonth}>
                <ChevronLeft size={20} />
              </button>
              <button className="task-action-btn" onClick={nextMonth}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Weekday Titles */}
          <div className="calendar-grid">
            {weekdays.map(day => (
              <div key={day} className="calendar-day-label">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="calendar-grid">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} style={{ aspectRatio: 1 }}></div>;
              }

              const monthStr = String(month + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const cellDateStr = `${year}-${monthStr}-${dayStr}`;
              
              const isToday = cellDateStr === getTodayString();
              const isSelected = cellDateStr === selectedDateStr;
              const indicator = getIndicatorClass(cellDateStr);

              return (
                <div
                  key={`day-${day}`}
                  className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCellClick(day)}
                >
                  <span className="calendar-cell-num">{day}</span>
                  {indicator !== 'none' && !isSelected && (
                    <span className={`calendar-cell-indicator ${indicator}`} title={`${history[cellDateStr]?.rate}% Complete`}></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
              <span>Perfect Day (100%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
              <span>High (50% - 99%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }}></span>
              <span>Partial (1% - 49%)</span>
            </div>
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
            Day Inspector
          </h3>

          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {historyRecord ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Daily Stats Summary */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>Tasks Checklist:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{historyRecord.completed} / {historyRecord.total}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <span>Completion Rate:</span>
                  <strong style={{ color: historyRecord.rate === 100 ? 'var(--success)' : 'var(--text-primary)' }}>{historyRecord.rate}%</strong>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${historyRecord.rate}%`,
                      background: historyRecord.rate === 100 ? 'var(--success)' : 'var(--accent-primary)'
                    }}
                  ></div>
                </div>
              </div>

              {/* Task list list details */}
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Archived Task Records</h4>
                {selectedTasksList.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    No recorded tasks on this day.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '250px', overflowY: 'auto' }}>
                    {selectedTasksList.map(task => (
                      <div 
                        key={task.id} 
                        style={{ 
                          padding: '0.6rem 0.75rem', 
                          borderRadius: '6px', 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--glass-border)',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                        }}
                      >
                        <CheckSquare 
                          size={14} 
                          style={{ 
                            color: task.completed 
                              ? 'var(--success)' 
                              : task.partial 
                              ? 'var(--warning)' 
                              : 'var(--text-muted)', 
                            flexShrink: 0 
                          }} 
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : isSelectedToday && tasks.length > 0 ? (
            // Today has active tasks but hasn't saved a final history cell yet
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>Tasks Today (Active):</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{tasks.filter(t => t.completed).length} / {tasks.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  <span>Completion Rate:</span>
                  <strong>{Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%</strong>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Today's Tasks</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      style={{ 
                        padding: '0.6rem 0.75rem', 
                        borderRadius: '6px', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid var(--glass-border)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}
                    >
                      <CheckSquare size={14} style={{ color: task.completed ? 'var(--success)' : task.partial ? 'var(--warning)' : 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem' }}>
              <AlertCircle size={24} style={{ display: 'block', margin: '0 auto 0.75rem', color: 'var(--text-muted)' }} />
              No task records or logs exist for this date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
