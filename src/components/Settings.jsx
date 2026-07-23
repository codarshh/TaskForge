import React, { useContext, useRef, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Sun, 
  Moon, 
  Eye,
  User,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function Settings() {
  const { 
    theme, 
    toggleTheme, 
    exportBackup, 
    importBackup, 
    resetAllData,
    user
  } = useContext(AppContext);

  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState('');

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target.result;
      const success = importBackup(result);
      if (success) {
        setImportStatus('Backup loaded successfully!');
      } else {
        setImportStatus('Error reading backup file schema.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & Customization</h1>
          <p className="page-subtitle">Configure application settings, visual themes, and local database backup configurations.</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Card 1: Theme & Interface */}
        <div className="glass-panel settings-section">
          <h3 className="settings-section-title">
            <Eye size={20} style={{ color: 'var(--accent-primary)' }} />
            Appearance & Styling
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Choose your preferred color theme. Dark theme helps lower eye strain during late focus hours.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Active Mode:</span>
            <button 
              className="settings-btn settings-btn-outline" 
              onClick={toggleTheme}
              style={{ minWidth: '130px', justifyContent: 'center' }}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon size={16} />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Backup & Restore */}
        <div className="glass-panel settings-section">
          <h3 className="settings-section-title">
            <Download size={20} style={{ color: 'var(--success)' }} />
            Data Backups & Profiles
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Save or load your TaskForge dataset. Recommended before clear-ups or for transferring logs to another device.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="settings-btn settings-btn-outline" onClick={exportBackup}>
              <Download size={16} />
              <span>Export Backup JSON</span>
            </button>

            <button className="settings-btn settings-btn-outline" onClick={triggerFileSelect}>
              <Upload size={16} />
              <span>Import Backup JSON</span>
            </button>

            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportFile}
              className="hidden-file-input"
            />
          </div>

          {importStatus && (
            <div 
              style={{ 
                marginTop: '1rem', 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: importStatus.includes('successfully') ? 'var(--success)' : 'var(--danger)' 
              }}
            >
              {importStatus}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel settings-section" style={{ borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.02)' }}>
        <h3 className="settings-section-title" style={{ color: 'var(--danger)' }}>
          <ShieldAlert size={20} />
          Danger Zone
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Be careful. These actions are irreversible and wipe configurations, task lists, calendar histories, and streaks.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="settings-btn settings-btn-danger" onClick={resetAllData}>
            <Trash2 size={16} />
            <span>Reset Active Database</span>
          </button>
        </div>
      </div>

      {/* Footnote */}
      <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <Sparkles size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: 'var(--accent-primary)' }} />
        <strong>TaskForge Version 1.0.0</strong> • Designed for consistency.
      </div>
    </div>
  );
}
