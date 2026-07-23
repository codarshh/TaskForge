import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCw, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  X, 
  Terminal,
  AlertTriangle,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlatformIcon } from './PlatformIcons';

// Platform metadata configuration
const PLATFORM_META = {
  leetcode: {
    name: 'LeetCode',
    logo: '🟠',
    color: '#FFA116',
    iframeSupported: false,
    defaultDomain: 'leetcode.com'
  },
  codeforces: {
    name: 'Codeforces',
    logo: '🔵',
    color: '#1F8EEA',
    iframeSupported: true,
    defaultDomain: 'codeforces.com'
  },
  codechef: {
    name: 'CodeChef',
    logo: '🟢',
    color: '#5B4636',
    iframeSupported: true,
    defaultDomain: 'codechef.com'
  },
  geeksforgeeks: {
    name: 'GeeksforGeeks',
    logo: '🟢',
    color: '#2F8D46',
    iframeSupported: false,
    defaultDomain: 'geeksforgeeks.org'
  },
  github: {
    name: 'GitHub',
    logo: '⚫',
    color: '#181717',
    iframeSupported: false,
    defaultDomain: 'github.com'
  },
  hackerrank: {
    name: 'HackerRank',
    logo: '🟣',
    color: '#2EC866',
    iframeSupported: false,
    defaultDomain: 'hackerrank.com'
  }
};

export default function EmbeddedViewer({ setActiveTab }) {
  const { 
    user,
    activeDevPlatformTabs,
    currentDevPlatformTab,
    setCurrentDevPlatformTab,
    closeDevPlatform
  } = useContext(AppContext);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Used to force refresh iframes

  // Auto-redirect if all tabs are closed
  useEffect(() => {
    if (activeDevPlatformTabs.length === 0) {
      setActiveTab('profile');
    }
  }, [activeDevPlatformTabs, setActiveTab]);

  if (activeDevPlatformTabs.length === 0 || !currentDevPlatformTab) {
    return null;
  }

  const activeMeta = PLATFORM_META[currentDevPlatformTab];
  const activeProfile = user?.developerProfiles?.[currentDevPlatformTab];

  if (!activeProfile || !activeMeta) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', margin: '2rem auto', maxWidth: '500px' }}>
        <AlertTriangle size={32} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
        <h3>Platform Not Connected</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Please go to your Profile page to connect this platform.
        </p>
        <button 
          className="settings-btn settings-btn-primary" 
          style={{ marginTop: '1.25rem' }}
          onClick={() => setActiveTab('profile')}
        >
          Go to Profile
        </button>
      </div>
    );
  }

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleOpenNewTab = () => {
    if (activeProfile.profileUrl) {
      window.open(activeProfile.profileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCloseTab = (platformId, e) => {
    e.stopPropagation();
    closeDevPlatform(platformId);
  };

  return (
    <div 
      className={`embedded-viewer-layout ${isFullscreen ? 'fullscreen-mode' : ''}`}
      style={isFullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'var(--bg-app)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        boxSizing: 'border-box'
      } : {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 5rem)',
        width: '100%'
      }}
    >
      {/* Tab bar header */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'var(--bg-primary)', 
          border: '2px solid var(--text-muted)', 
          borderRadius: '12px 12px 0 0',
          padding: '0.5rem 1rem',
          borderBottom: 'none',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button 
            className="kanban-slider-action-btn"
            onClick={() => setActiveTab('profile')}
            title="Back to Profile"
            style={{ width: '32px', height: '32px', border: '1px solid var(--text-muted)' }}
          >
            <ArrowLeft size={16} />
          </button>
          
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {activeDevPlatformTabs.map(tabId => {
              const meta = PLATFORM_META[tabId];
              const profile = user?.developerProfiles?.[tabId];
              const isActive = currentDevPlatformTab === tabId;
              if (!meta || !profile) return null;

              return (
                <motion.div
                  key={tabId}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setCurrentDevPlatformTab(tabId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.02)',
                    color: isActive ? (document.body.getAttribute('data-theme') === 'light' ? '#F1EDE6' : 'white') : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    userSelect: 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>{getPlatformIcon(tabId, 16)}</span>
                  <span>{meta.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tabId, e)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'inherit',
                      opacity: 0.6,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                      borderRadius: '50%'
                    }}
                    title="Close tab"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* View controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ marginRight: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Terminal size={14} style={{ color: activeMeta.color }} />
            <span>Connected as:</span>
            <strong style={{ color: 'var(--text-primary)' }}>@{activeProfile.username}</strong>
          </div>

          <button 
            className="settings-btn settings-btn-outline" 
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--text-muted)' }}
            onClick={handleRefresh}
            title="Refresh View"
          >
            <RotateCw size={14} />
            <span style={{ marginLeft: '0.25rem' }}>Refresh</span>
          </button>

          <button 
            className="settings-btn settings-btn-outline"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--text-muted)' }}
            onClick={handleOpenNewTab}
            title="Open in Browser Tab"
          >
            <ExternalLink size={14} />
            <span style={{ marginLeft: '0.25rem' }}>Open Tab</span>
          </button>

          <button 
            className="settings-btn settings-btn-outline"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', border: '1px solid var(--text-muted)' }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span style={{ marginLeft: '0.25rem' }}>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div 
        className="glass-panel" 
        style={{ 
          flex: 1, 
          background: 'var(--bg-secondary)', 
          border: '2px solid var(--text-muted)', 
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {activeMeta.iframeSupported ? (
          /* Embedding supported (Codeforces, CodeChef) */
          <iframe
            key={iframeKey}
            src={activeProfile.profileUrl}
            title={`${activeMeta.name} Embedded View`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'white' // Prevents see-through rendering for light mode
            }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          /* Embedding disallows / fallbacks (GitHub, LeetCode, HackerRank, GeeksforGeeks) */
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '3rem 2rem', 
              textAlign: 'center',
              flex: 1,
              background: 'var(--bg-primary)'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-panel"
              style={{
                maxWidth: '520px',
                padding: '2.5rem',
                background: 'var(--bg-secondary)',
                border: '2px solid var(--text-muted)',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.25rem'
              }}
            >
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'rgba(58, 45, 40, 0.04)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem',
                  border: '1px solid var(--text-muted)'
                }}
              >
                {getPlatformIcon(currentDevPlatformTab, 32)}
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Embedded View Restricted</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.65rem', lineHeight: 1.5 }}>
                  {activeMeta.name} restricts embedded viewing inside iframes due to security policies (such as <code>X-Frame-Options</code> or Content Security Policies).
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem', fontStyle: 'italic' }}>
                  You can access your connected coding profile securely in a new browser tab.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
                <button 
                  className="auth-submit-btn" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}
                  onClick={handleOpenNewTab}
                >
                  <ExternalLink size={16} />
                  <span>Open Profile in New Tab</span>
                </button>
                
                <button 
                  className="settings-btn settings-btn-outline" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '1px solid var(--text-muted)' }}
                  onClick={() => setActiveTab('profile')}
                >
                  <ArrowLeft size={16} />
                  <span>Return to Profile</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
