import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Heatmap({ compact = false }) {
  const { history } = useContext(AppContext);

  // Generate the last 365 days of data
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    // Go back 364 days to get a total of 365 days (52 weeks + a few days)
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const historyItem = history[dateStr];
      const completedCount = historyItem ? historyItem.completed : 0;
      
      let level = 0;
      if (completedCount > 0) {
        if (completedCount <= 2) level = 1;
        else if (completedCount <= 4) level = 2;
        else if (completedCount <= 6) level = 3;
        else level = 4;
      }

      data.push({
        dateStr,
        dateObj: d,
        completed: completedCount,
        level
      });
    }
    return data;
  };

  const allDays = generateHeatmapData();

  // Group days by month (e.g. "YYYY-MM")
  const monthsMap = {};
  allDays.forEach(day => {
    const year = day.dateObj.getFullYear();
    const month = day.dateObj.getMonth();
    const key = `${year}-${month}`;
    if (!monthsMap[key]) {
      monthsMap[key] = [];
    }
    monthsMap[key].push(day);
  });

  // Sort keys chronologically
  const sortedMonthKeys = Object.keys(monthsMap).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number);
    const [yearB, monthB] = b.split('-').map(Number);
    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });

  const monthsData = sortedMonthKeys.map(key => {
    const days = monthsMap[key];
    const firstDay = days[0];
    const monthName = firstDay.dateObj.toLocaleDateString('en-US', { month: 'short' });
    
    // Group days in this month into weeks (columns)
    const weeks = [];
    let currentWeek = [];
    
    // Determine weekday of first day in the month's days list
    const startWeekday = firstDay.dateObj.getDay();
    for (let i = 0; i < startWeekday; i++) {
      currentWeek.push(null);
    }
    
    days.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return {
      monthName,
      weeks
    };
  });

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="glass-panel" style={{ padding: compact ? '1rem 1.25rem' : '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? '0.75rem' : '1rem' }}>
        <h3 style={{ fontSize: compact ? '1rem' : '1.25rem' }}>Productivity Heatmap</h3>
        {compact && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              fontSize: '0.7rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span>Less</span>
            <div className="heatmap-cell level-0" style={{ cursor: 'default', width: '8px', height: '8px' }}></div>
            <div className="heatmap-cell level-1" style={{ cursor: 'default', width: '8px', height: '8px' }}></div>
            <div className="heatmap-cell level-2" style={{ cursor: 'default', width: '8px', height: '8px' }}></div>
            <div className="heatmap-cell level-3" style={{ cursor: 'default', width: '8px', height: '8px' }}></div>
            <div className="heatmap-cell level-4" style={{ cursor: 'default', width: '8px', height: '8px' }}></div>
            <span>More</span>
          </div>
        )}
      </div>

      {!compact && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Visualize your consistency over the past 365 days. Hover over cells to see task details.
        </p>
      )}

      {/* Grid Container */}
      <div className="heatmap-container" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {/* Weekday labels column */}
        <div style={{ 
          display: 'grid', 
          gridTemplateRows: 'repeat(7, 10px)', 
          gap: '3px', 
          marginRight: '8px',
          marginTop: '19px', // align with the month grid row (under the month label)
          alignItems: 'center'
        }}>
          {daysOfWeek.map((day, idx) => (
            <span 
              key={`day-label-${idx}`} 
              style={{ 
                fontSize: '0.65rem', 
                color: 'var(--text-muted)', 
                gridRowStart: idx + 1,
                lineHeight: '10px',
                fontWeight: '600',
                height: '10px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {idx % 2 === 1 ? day : ''}
            </span>
          ))}
        </div>

        {/* Months wrapper */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {monthsData.map((monthGroup, mIdx) => {
            return (
              <div key={`month-group-${mIdx}`} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Month Name label */}
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  marginBottom: '5px',
                  height: '14px', // fixed height for alignment
                  lineHeight: '14px'
                }}>
                  {monthGroup.monthName}
                </span>

                {/* Month Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: `repeat(${monthGroup.weeks.length}, 10px)`, 
                  gridTemplateRows: 'repeat(7, 10px)',
                  gap: '3px',
                  alignItems: 'center'
                }}>
                  {monthGroup.weeks.map((week, weekIdx) => {
                    return week.map((day, dayIdx) => {
                      if (day === null) return null;

                      const formattedDate = day.dateObj.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });

                      return (
                        <div
                          key={`cell-${mIdx}-${weekIdx}-${dayIdx}`}
                          className={`heatmap-cell level-${day.level} tooltip-trigger`}
                          style={{
                            gridRowStart: dayIdx + 1,
                            gridColumnStart: weekIdx + 1
                          }}
                        >
                          <div className="tooltip-box">
                            <strong>{day.completed} {day.completed === 1 ? 'task' : 'tasks'}</strong> completed on {formattedDate}
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {!compact && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            gap: '0.35rem', 
            marginTop: '1.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          <span>Less</span>
          <div className="heatmap-cell level-0" style={{ cursor: 'default' }}></div>
          <div className="heatmap-cell level-1" style={{ cursor: 'default' }}></div>
          <div className="heatmap-cell level-2" style={{ cursor: 'default' }}></div>
          <div className="heatmap-cell level-3" style={{ cursor: 'default' }}></div>
          <div className="heatmap-cell level-4" style={{ cursor: 'default' }}></div>
          <span>More</span>
        </div>
      )}
    </div>
  );
}
