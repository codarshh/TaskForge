import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  AlertTriangle,
  FolderOpen,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';

export default function TaskManager() {
  const { 
    tasks, 
    addTask, 
    toggleTaskCompleted, 
    moveTaskStatus,
    updateTask, 
    deleteTask,
    taskViewMode,
    updateTaskViewMode
  } = useContext(AppContext);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' | 'priority' | 'dueTime' | 'estimatedTime'
  const viewMode = taskViewMode;
  const setViewMode = updateTaskViewMode;
  const [draggedOverCol, setDraggedOverCol] = useState(null);

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, status) => {
    e.preventDefault();
    setDraggedOverCol(status);
  };

  const handleDragLeave = (e) => {
    setDraggedOverCol(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, newStatus);
    }
  };

  const handleShiftTask = (id, currentStatus, direction) => {
    if (currentStatus === 'todo') {
      if (direction === 'right') moveTaskStatus(id, 'inprogress');
    } else if (currentStatus === 'inprogress') {
      if (direction === 'left') moveTaskStatus(id, 'todo');
      if (direction === 'right') moveTaskStatus(id, 'partial');
    } else if (currentStatus === 'partial') {
      if (direction === 'left') moveTaskStatus(id, 'inprogress');
      if (direction === 'right') moveTaskStatus(id, 'completed');
    } else if (currentStatus === 'completed') {
      if (direction === 'left') moveTaskStatus(id, 'partial');
    }
  };

  // Accordion state for notes toggling
  const [expandedNotesId, setExpandedNotesId] = useState(null);

  // Edit / Add Task Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTaskToEdit, setActiveTaskToEdit] = useState(null);

  // Form states (shared by Add/Edit)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskEstimatedTime, setTaskEstimatedTime] = useState(0);
  const [taskActualTime, setTaskActualTime] = useState(0);
  const [taskNotes, setTaskNotes] = useState('');

  const categories = ['Work', 'Personal', 'Study', 'Fitness', 'Reading', 'Finance'];

  // Handle Add Form Submission
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask(
      taskTitle.trim(),
      taskCategory,
      taskPriority,
      taskDueTime,
      taskEstimatedTime,
      taskNotes.trim()
    );
    closeAddModal();
  };

  // Open Add Modal
  const openAddModal = () => {
    setTaskTitle('');
    setTaskCategory('Personal');
    setTaskPriority('medium');
    setTaskDueTime('');
    setTaskEstimatedTime(0);
    setTaskNotes('');
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  // Handle Edit Form Submission
  const handleEditTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !activeTaskToEdit) return;
    updateTask(activeTaskToEdit.id, {
      title: taskTitle.trim(),
      category: taskCategory,
      priority: taskPriority,
      dueTime: taskDueTime,
      estimatedTime: Number(taskEstimatedTime) || 0,
      actualTime: Number(taskActualTime) || 0,
      notes: taskNotes.trim()
    });
    closeEditModal();
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setActiveTaskToEdit(task);
    setTaskTitle(task.title);
    setTaskCategory(task.category || 'Personal');
    setTaskPriority(task.priority || 'medium');
    setTaskDueTime(task.dueTime || '');
    setTaskEstimatedTime(task.estimatedTime || 0);
    setTaskActualTime(task.actualTime || 0);
    setTaskNotes(task.notes || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setActiveTaskToEdit(null);
  };

  // Toggle notes accordion
  const toggleNotes = (id) => {
    setExpandedNotesId(prev => (prev === id ? null : id));
  };

  // Priority numerical weights for sorting
  const priorityWeights = { high: 3, medium: 2, low: 1 };

  // Filters & Sorting logic
  const filteredTasks = tasks
    .filter(t => {
      // 1. Status Filter
      if (activeTab === 'active') return !t.completed;
      if (activeTab === 'completed') return t.completed;
      return true;
    })
    .filter(t => {
      // 2. Category Filter
      if (selectedCategory === 'All') return true;
      return t.category === selectedCategory;
    })
    .filter(t => {
      // 3. Priority Filter
      if (selectedPriority === 'All') return true;
      return t.priority === selectedPriority;
    })
    .filter(t => {
      // 4. Search Filter
      const titleMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const notesMatch = t.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      return titleMatch || notesMatch;
    })
    .sort((a, b) => {
      // 5. Sorting
      if (sortBy === 'createdAt') {
        return b.createdAt - a.createdAt; // newest first
      }
      if (sortBy === 'priority') {
        return priorityWeights[b.priority] - priorityWeights[a.priority]; // highest first
      }
      if (sortBy === 'dueTime') {
        if (!a.dueTime) return 1;
        if (!b.dueTime) return -1;
        return a.dueTime.localeCompare(b.dueTime); // earliest first
      }
      if (sortBy === 'estimatedTime') {
        return b.estimatedTime - a.estimatedTime; // longest estimated first
      }
      return 0;
    });

  const renderKanbanCard = (task, status) => {
    // Determine progress fill percentages
    let progressPercent = 0;
    let progressColor = 'var(--text-secondary)';
    if (status === 'todo') {
      progressPercent = 0;
      progressColor = 'var(--text-muted)';
    } else if (status === 'inprogress') {
      progressPercent = 25;
      progressColor = 'var(--accent-primary)';
    } else if (status === 'partial') {
      progressPercent = 50;
      progressColor = 'var(--warning)';
    } else if (status === 'completed') {
      progressPercent = 100;
      progressColor = 'var(--success)';
    }

    // Truncate notes description
    const notesExcerpt = task.notes 
      ? (task.notes.length > 60 ? task.notes.substring(0, 60) + '...' : task.notes) 
      : '';

    return (
      <div
        key={task.id}
        className="kanban-card"
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragEnd={handleDragEnd}
        style={{
          borderLeft: task.completed 
            ? '4px solid var(--success)' 
            : task.partial 
            ? '4px solid var(--warning)'
            : task.inProgress
            ? '4px solid var(--accent-primary)'
            : task.priority === 'high' 
            ? '4px solid var(--danger)' 
            : '4px solid var(--text-muted)'
        }}
      >
        {/* Quick actions top overlay */}
        <div className="kanban-card-actions-overlay">
          {status !== 'todo' && (
            <button 
              className="kanban-slider-action-btn"
              onClick={() => handleShiftTask(task.id, status, 'left')}
              title="Move Left"
            >
              <ChevronLeft size={12} />
            </button>
          )}
          {status !== 'completed' && (
            <button 
              className="kanban-slider-action-btn"
              onClick={() => handleShiftTask(task.id, status, 'right')}
              title="Move Right"
            >
              <ChevronRight size={12} />
            </button>
          )}
          <button 
            className="kanban-slider-action-btn"
            onClick={() => openEditModal(task)}
            title="Edit Task"
            style={{ marginLeft: '0.25rem' }}
          >
            <Edit3 size={12} />
          </button>
          <button 
            className="kanban-slider-action-btn"
            onClick={() => deleteTask(task.id)}
            title="Delete Task"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* Title */}
        <div className="kanban-card-title-row">
          <div className="kanban-card-title">{task.title}</div>
        </div>

        {/* Notes (Excerpt) */}
        {notesExcerpt && (
          <p className="kanban-card-desc">{notesExcerpt}</p>
        )}

        {/* Badges */}
        <div className="kanban-card-meta">
          <span className={`kanban-card-badge priority-${task.priority}`}>
            {task.priority}
          </span>
          <span className="kanban-card-badge category">
            {task.category}
          </span>
        </div>

        {/* Custom Progress Line (Visual progression indicator) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          <span>Progress</span>
          <span style={{ fontWeight: '700', color: progressColor }}>{progressPercent}%</span>
        </div>
        <div className="kanban-card-progress-bar">
          <div 
            className="kanban-card-progress-fill"
            style={{ width: `${progressPercent}%`, background: progressColor }}
          ></div>
        </div>

        {/* Footer Info */}
        <div className="kanban-card-footer">
          <div className="kanban-card-footer-info">
            {task.dueTime ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                <Clock size={11} />
                {task.dueTime}
              </span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>No due time</span>
            )}
          </div>

          <div>
            {task.estimatedTime > 0 ? (
              <span>Est: {task.estimatedTime}h</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>--</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Task Manager</h1>
          <p className="page-subtitle">Track, filter, and complete your tasks. Click a checkbox twice to toggle full completion.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="kanban-view-controls">
            <button 
              className={`kanban-view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => { setViewMode('kanban'); localStorage.setItem('taskforge_view_preference', 'kanban'); }}
              title="Kanban View"
            >
              <LayoutGrid size={15} />
              <span>Kanban</span>
            </button>
            <button 
              className={`kanban-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => { setViewMode('list'); localStorage.setItem('taskforge_view_preference', 'list'); }}
              title="List View"
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>

          <button className="settings-btn settings-btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task Filters & Tabs */}
      <div className="task-manager-header glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Status Tabs */}
          <div className="task-filters">
            <button 
              className={`filter-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Tasks
            </button>
            <button 
              className={`filter-btn ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button 
              className={`filter-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Filter size={14} />
              <span>Category:</span>
              <select 
                className="sort-select" 
                style={{ padding: '0.4rem 1.5rem 0.4rem 0.6rem', fontSize: '0.8rem', minWidth: '100px' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <Filter size={14} />
              <span>Priority:</span>
              <select 
                className="sort-select" 
                style={{ padding: '0.4rem 1.5rem 0.4rem 0.6rem', fontSize: '0.8rem', minWidth: '100px' }}
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Bar & Sorting Option */}
        <div className="task-list-controls" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Sort By:</span>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Created</option>
              <option value="priority">Priority Rank</option>
              <option value="dueTime">Due Time</option>
              <option value="estimatedTime">Time Estimate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List / Kanban Switcher */}
      {viewMode === 'list' ? (
        filteredTasks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No tasks found</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Create a new task, adjust your filters, or enjoy your clear dashboard!</p>
          </div>
        ) : (
          <div className="task-list animate-fade-in">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-item glass-panel ${task.completed ? 'completed' : ''}`}
                style={{
                  borderLeft: task.completed 
                    ? '4px solid var(--success)' 
                    : task.partial 
                    ? '4px solid var(--warning)'
                    : task.inProgress
                    ? '4px solid var(--accent-primary)'
                    : task.priority === 'high' 
                    ? '4px solid var(--danger)' 
                    : '4px solid var(--text-muted)'
                }}
              >
                <div className="task-item-left">
                  {/* Cycles check: Uncompleted -> In Progress -> Partial -> Completed */}
                  <label className="task-checkbox-container">
                    <input
                      type="checkbox"
                      className="task-checkbox-input"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(task.id)}
                    />
                    <span className={`task-checkbox-checkmark ${task.partial ? 'partial' : ''}`}></span>
                  </label>

                  <div className="task-info">
                    <div className="task-title" onClick={() => toggleTaskCompleted(task.id)} style={{ cursor: 'pointer' }}>
                      {task.title}
                      {task.inProgress && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                          In Progress
                        </span>
                      )}
                    </div>
                    
                    <div className="task-metadata">
                      <span className={`task-badge priority-${task.priority}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="task-badge category-tag">
                        {task.category}
                      </span>
                      
                      {task.dueTime && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                          <Clock size={12} />
                          {task.dueTime}
                        </span>
                      )}

                      {task.estimatedTime > 0 && (
                        <span style={{ color: 'var(--text-muted)' }}>
                          Est: {task.estimatedTime}h {task.actualTime > 0 && `| Act: ${task.actualTime}h`}
                        </span>
                      )}

                      {task.notes && (
                        <button 
                          onClick={() => toggleNotes(task.id)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                          {expandedNotesId === task.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          Notes
                        </button>
                      )}
                    </div>

                    {task.notes && expandedNotesId === task.id && (
                      <div className="task-notes animate-fade-in">
                        {task.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <button 
                    className="task-action-btn"
                    onClick={() => openEditModal(task)}
                    title="Edit Task"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    className="task-action-btn delete-btn"
                    onClick={() => deleteTask(task.id)}
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Kanban Board View */
        <div className="kanban-board-container animate-fade-in">
          <div className="kanban-board">
            {/* 1. To Do Column */}
            <div 
              className={`kanban-column ${draggedOverCol === 'todo' ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, 'todo')}
              onDragEnter={(e) => handleDragEnter(e, 'todo')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'todo')}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title-container">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                  <span className="kanban-column-title">To Do</span>
                </div>
                <span className="kanban-column-counter">
                  {filteredTasks.filter(t => !t.completed && !t.partial && !t.inProgress).length}
                </span>
              </div>
              <div className="kanban-cards-wrapper">
                {filteredTasks
                  .filter(t => !t.completed && !t.partial && !t.inProgress)
                  .map(task => renderKanbanCard(task, 'todo'))}
              </div>
            </div>

            {/* 2. In Progress Column */}
            <div 
              className={`kanban-column ${draggedOverCol === 'inprogress' ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, 'inprogress')}
              onDragEnter={(e) => handleDragEnter(e, 'inprogress')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'inprogress')}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title-container">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                  <span className="kanban-column-title">In Progress</span>
                </div>
                <span className="kanban-column-counter">
                  {filteredTasks.filter(t => !t.completed && !t.partial && t.inProgress).length}
                </span>
              </div>
              <div className="kanban-cards-wrapper">
                {filteredTasks
                  .filter(t => !t.completed && !t.partial && t.inProgress)
                  .map(task => renderKanbanCard(task, 'inprogress'))}
              </div>
            </div>

            {/* 3. Partially Completed Column */}
            <div 
              className={`kanban-column ${draggedOverCol === 'partial' ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, 'partial')}
              onDragEnter={(e) => handleDragEnter(e, 'partial')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'partial')}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title-container">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }}></div>
                  <span className="kanban-column-title">Partial</span>
                </div>
                <span className="kanban-column-counter">
                  {filteredTasks.filter(t => !t.completed && t.partial).length}
                </span>
              </div>
              <div className="kanban-cards-wrapper">
                {filteredTasks
                  .filter(t => !t.completed && t.partial)
                  .map(task => renderKanbanCard(task, 'partial'))}
              </div>
            </div>

            {/* 4. Completed Column */}
            <div 
              className={`kanban-column ${draggedOverCol === 'completed' ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, 'completed')}
              onDragEnter={(e) => handleDragEnter(e, 'completed')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'completed')}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title-container">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                  <span className="kanban-column-title">Completed</span>
                </div>
                <span className="kanban-column-counter">
                  {filteredTasks.filter(t => t.completed).length}
                </span>
              </div>
              <div className="kanban-cards-wrapper">
                {filteredTasks
                  .filter(t => t.completed)
                  .map(task => renderKanbanCard(task, 'completed'))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-pop-in">
            <button className="modal-close-btn" onClick={closeAddModal}>
              <X size={20} />
            </button>
            <h2 className="modal-title">Create Daily Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Finish React Project"
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
                  placeholder="Add specific details or checklists..."
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
                Add to List
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && activeTaskToEdit && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-pop-in">
            <button className="modal-close-btn" onClick={closeEditModal}>
              <X size={20} />
            </button>
            <h2 className="modal-title">Edit Task</h2>
            <form onSubmit={handleEditTask}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
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
                  <label className="form-label">Due Time</label>
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

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Actual Time Spent (Hours)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className="form-input"
                    value={taskActualTime}
                    onChange={(e) => setTaskActualTime(e.target.value)}
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
