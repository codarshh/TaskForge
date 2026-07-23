import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { TrendingUp, BarChart3, PieChart, Star, Target, CheckCircle2, Clock } from 'lucide-react';

export default function Analytics() {
  const { history, tasks, getTodayString, theme } = useContext(AppContext);

  // 1. Line Chart Data: Last 7 days completion rate
  const getLast7DaysData = () => {
    const list = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const record = history[dateStr];
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Default to 0 rate if no record exists
      list.push({
        dateStr,
        name,
        rate: record ? record.rate : 0,
        completed: record ? record.completed : 0,
        total: record ? record.total : 0
      });
    }
    return list;
  };

  const lineChartData = getLast7DaysData();

  // Draw Line SVG Coordinates
  // width = 500, height = 200
  // X padding = 40, Y padding = 30
  // chart width = 420, chart height = 140
  const chartWidth = 420;
  const chartHeight = 140;
  const xOffset = 50;
  const yOffset = 30;

  const points = lineChartData.map((item, index) => {
    const x = xOffset + (index * (chartWidth / 6));
    // Y points: 100% is top (yOffset), 0% is bottom (yOffset + chartHeight)
    const y = yOffset + chartHeight - (item.rate / 100) * chartHeight;
    return { x, y, ...item };
  });

  const linePath = points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${yOffset + chartHeight} L ${points[0].x} ${yOffset + chartHeight} Z`
    : '';

  // 2. Pie Chart Data: Category Distribution of Completed Tasks
  const getCategoryData = () => {
    // Count completed tasks from today & past history log
    const categoryCounts = {};
    const defaultCategories = ['Work', 'Personal', 'Study', 'Fitness', 'Reading', 'Finance'];
    
    // Initialize default categories
    defaultCategories.forEach(cat => {
      categoryCounts[cat] = 0;
    });

    // Scan today's completed tasks
    tasks.forEach(t => {
      if (t.completed) {
        categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
      }
    });

    // Scan history completed tasks
    Object.values(history).forEach(h => {
      if (h.tasksList) {
        h.tasksList.forEach(t => {
          if (t.completed) {
            categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
          }
        });
      }
    });

    const totalCompleted = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

    const colors = theme === 'dark' ? {
      Work: '#DC2626',      // Primary Red
      Personal: '#B91C1C',  // Secondary Red
      Study: '#EF4444',     // Accent Red
      Fitness: '#252525',   // Surface Dark
      Reading: '#3A3A3A',   // Border Gray
      Finance: '#FFFFFF'    // Pure White
    } : {
      Work: '#3A2D28',      // Dark Espresso
      Personal: '#CBAD8D',  // Warm Sand
      Study: '#A48374',     // Warm Brown
      Fitness: '#8E7264',   // Soft Cocoa
      Reading: '#705448',   // Medium Espresso
      Finance: '#503D36'    // Muted Cocoa
    };

    return Object.keys(categoryCounts)
      .map(key => {
        const count = categoryCounts[key];
        const percent = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
        return {
          name: key,
          count,
          percent,
          color: colors[key] || '#64748b'
        };
      })
      .filter(item => item.count > 0); // Only render categories with completed tasks
  };

  const pieChartData = getCategoryData();
  const totalCompletedCount = pieChartData.reduce((acc, curr) => acc + curr.count, 0);

  // Generate Pie Segments coordinates (Radius=50, Center=75,75)
  // We can render this as stroke-dasharray circles!
  // r=40, C = 2 * pi * r = 251.3
  const pieRadius = 40;
  const pieCircumference = 2 * Math.PI * pieRadius;
  
  let accumulatedPercent = 0;

  // 3. Priority stats
  const getPriorityStats = () => {
    const counts = { high: { comp: 0, tot: 0 }, medium: { comp: 0, tot: 0 }, low: { comp: 0, tot: 0 } };
    
    // Scan active
    tasks.forEach(t => {
      const p = t.priority;
      if (counts[p]) {
        counts[p].tot++;
        if (t.completed) counts[p].comp++;
      }
    });

    // Scan history
    Object.values(history).forEach(h => {
      if (h.tasksList) {
        h.tasksList.forEach(t => {
          const p = t.priority;
          if (counts[p]) {
            counts[p].tot++;
            if (t.completed) counts[p].comp++;
          }
        });
      }
    });

    return counts;
  };

  const priorityStats = getPriorityStats();

  // 4. Best day tracker
  const getBestDay = () => {
    let bestDate = 'N/A';
    let maxCompleted = 0;

    Object.keys(history).forEach(date => {
      const record = history[date];
      if (record.completed > maxCompleted) {
        maxCompleted = record.completed;
        bestDate = date;
      }
    });

    if (bestDate !== 'N/A') {
      const d = new Date(bestDate);
      return `${d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} (${maxCompleted} tasks)`;
    }
    return 'No records yet';
  };

  // 5. Estimation and Actual Time statistics
  const getTimeStatistics = () => {
    let totalEstimated = 0;
    let totalActual = 0;

    // Scan active
    tasks.forEach(t => {
      if (t.completed) {
        totalEstimated += t.estimatedTime || 0;
        totalActual += t.actualTime || 0;
      }
    });

    // Scan history
    Object.values(history).forEach(h => {
      if (h.tasksList) {
        h.tasksList.forEach(t => {
          if (t.completed) {
            totalEstimated += t.estimatedTime || 0;
            totalActual += t.actualTime || 0;
          }
        });
      }
    });

    return { totalEstimated, totalActual };
  };

  const timeStats = getTimeStatistics();

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Productivity Analytics</h1>
          <p className="page-subtitle">Interactive logs detailing where your time goes, priority completion, and weekly trends.</p>
        </div>
      </div>

      {/* Grid: 2 Charts */}
      <div className="grid-2">
        {/* Line Chart Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
            Weekly Completion Rates
          </h3>
          
          <div className="chart-container">
            <svg viewBox="0 0 500 200" className="chart-svg">
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(val => {
                const y = yOffset + chartHeight - (val / 100) * chartHeight;
                return (
                  <g key={`grid-${val}`}>
                    <line x1={xOffset} y1={y} x2={xOffset + chartWidth} y2={y} className="chart-grid-line" />
                    <text x={xOffset - 10} y={y + 3} textAnchor="end" className="chart-axis-text">{val}%</text>
                  </g>
                );
              })}

              {/* Shaded Area */}
              {areaPath && <path d={areaPath} className="chart-area" />}

              {/* Line path */}
              {linePath && <path d={linePath} className="chart-line" />}

              {/* Nodes / Tooltips */}
              {points.map((p, idx) => (
                <g key={`node-${idx}`} className="tooltip-trigger">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    fill="var(--accent-primary)"
                    stroke="var(--bg-primary)"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                  />
                  {/* Invisible larger hover target */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="12"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Custom SVG Tooltip */}
                  <g className="chart-svg-tooltip" style={{ pointerEvents: 'none' }}>
                    <rect 
                      x={p.x - 45} 
                      y={p.y - 35} 
                      width="90" 
                      height="25" 
                      rx="4" 
                      fill="rgba(15,23,42,0.95)" 
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      className="tooltip-box"
                      style={{ opacity: 1 }}
                    />
                    <text 
                      x={p.x} 
                      y={p.y - 18} 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="9" 
                      fontWeight="bold"
                    >
                      {p.rate}% ({p.completed}/{p.total})
                    </text>
                  </g>
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((p, idx) => (
                <text key={`label-${idx}`} x={p.x} y={yOffset + chartHeight + 20} textAnchor="middle" className="chart-axis-text">
                  {p.name}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={20} style={{ color: 'var(--accent-secondary)' }} />
            Category Distribution
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '2rem', flexWrap: 'wrap' }}>
            {totalCompletedCount === 0 ? (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', flex: 1 }}>
                Complete daily tasks to see category analytics logs.
              </div>
            ) : (
              <>
                {/* SVG Pie Chart */}
                <svg width="150" height="150" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                  {pieChartData.map((item, idx) => {
                    const offset = pieCircumference - (accumulatedPercent / 100) * pieCircumference;
                    const strokeDash = `${(item.percent / 100) * pieCircumference} ${pieCircumference}`;
                    accumulatedPercent += item.percent;
                    
                    return (
                      <circle
                        key={`pie-slice-${idx}`}
                        cx="50"
                        cy="50"
                        r={pieRadius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="12"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={offset}
                        className="chart-pie-sector"
                      />
                    );
                  })}
                  {/* Center circle text overlay */}
                  <circle cx="50" cy="50" r="30" fill="var(--bg-primary)" />
                  <g style={{ transform: 'rotate(90deg)', transformOrigin: '50px 50px' }}>
                    <text x="50" y="47" textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontWeight="bold">
                      {totalCompletedCount}
                    </text>
                    <text x="50" y="58" textAnchor="middle" fill="var(--text-muted)" fontSize="6" fontWeight="bold" letterSpacing="0.05em">
                      COMPLETED
                    </text>
                  </g>
                </svg>

                {/* Pie Chart Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
                  {pieChartData.map((item, idx) => (
                    <div key={`legend-${idx}`} style={{ display: 'flex', alignItems: 'center', justify: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></span>
                        <span>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>
                        {item.percent}% ({item.count})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Lower Insights */}
      <div className="grid-3">
        {/* Box 1: Best Day */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-card-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', width: '48px', height: '48px' }}>
            <Star size={24} fill="var(--accent-primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Most Productive Day</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', marginTop: '0.15rem' }}>{getBestDay()}</div>
          </div>
        </div>

        {/* Box 2: Time Box stats */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-card-icon" style={{ background: 'rgba(34, 197, 94, 0.05)', color: 'var(--success)', width: '48px', height: '48px' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Time Estimation Logs</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', marginTop: '0.15rem' }}>
              {timeStats.totalActual}h / {timeStats.totalEstimated}h logged
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Actual hours vs. Estimated hours</div>
          </div>
        </div>

        {/* Box 3: Target Completion */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="stat-card-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', width: '48px', height: '48px' }}>
            <Target size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>High Priority Rate</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', marginTop: '0.15rem' }}>
              {priorityStats.high.tot > 0 
                ? `${Math.round((priorityStats.high.comp / priorityStats.high.tot) * 100)}%` 
                : 'N/A'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {priorityStats.high.comp} of {priorityStats.high.tot} High-priority tasks done
            </div>
          </div>
        </div>
      </div>

      {/* Priority Progress Board (Lower section details) */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} style={{ color: 'var(--accent-primary)' }} />
          Completion Rate by Priority
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {['high', 'medium', 'low'].map(level => {
            const stat = priorityStats[level];
            const rate = stat.tot > 0 ? Math.round((stat.comp / stat.tot) * 100) : 0;
            const barColors = {
              high: 'var(--danger)',
              medium: 'var(--warning)',
              low: 'var(--accent-primary)'
            };

            return (
              <div key={level}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>{level} Priority</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {rate}% ({stat.comp} / {stat.tot} tasks completed)
                  </span>
                </div>
                <div className="progress-bar-container" style={{ height: '10px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${rate}%`,
                      background: barColors[level] 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
