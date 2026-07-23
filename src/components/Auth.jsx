import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Mail, 
  Lock, 
  User, 
  KeyRound, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.81-2.6-.81-5.19 0-7.79H2.18z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const GithubIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Auth({ initialMode = 'login', onClose }) {
  const { 
    register, 
    login, 
    verifyEmailCode,
    loginWithGoogle,
    loginWithGitHub,
    forgotPassword,
    resetPassword,
    authError, 
    authSuccess, 
    setAuthError, 
    setAuthSuccess 
  } = useContext(AppContext);
  
  // modes: 'login' | 'register' | 'forgot' | 'reset' | 'verify'
  const [mode, setMode] = useState(initialMode);

  // Sync mode if initialMode prop changes
  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]); 
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Loading & Simulator states
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [simulatedCodeAlert, setSimulatedCodeAlert] = useState(null);
  const [simulatedResetTokenAlert, setSimulatedResetTokenAlert] = useState(null);
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');

  const clearForm = () => {
    setFullName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setResetToken('');
    setRememberMe(false);
    setTermsAccepted(false);
    setAuthError(null);
    setAuthSuccess(null);
    setSimulatedCodeAlert(null);
    setSimulatedResetTokenAlert(null);
  };

  const handleSwitchMode = (newMode) => {
    clearForm();
    setMode(newMode);
  };

  const handleOAuthLogin = async (provider) => {
    setAuthError(null);
    setAuthSuccess(null);
    setLoading(true);
    setLoadingMessage(`Connecting to ${provider} OAuth 2.0 Secure Gate...`);
    
    try {
      if (provider === 'Google') {
        await loginWithGoogle();
      } else if (provider === 'GitHub') {
        await loginWithGitHub();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (mode === 'login') {
      if (!email || !password) {
        setAuthError('Please enter your email and password');
        return;
      }
      setLoading(true);
      setLoadingMessage('Verifying credentials...');
      
      try {
        const result = await login(email, password, rememberMe);
        if (result && result.unverified) {
          setPendingVerifyEmail(result.email);
          setSimulatedCodeAlert(result.code);
          setMode('verify');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    } else if (mode === 'register') {
      if (!fullName || !email || !password || !confirmPassword) {
        setAuthError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }
      if (!termsAccepted) {
        setAuthError('You must accept the Terms of Service & Privacy Policy');
        return;
      }
      
      setLoading(true);
      setLoadingMessage('Creating secure account profile...');
      
      try {
        const result = await register(fullName, username, email, password);
        if (result && result.success) {
          setPendingVerifyEmail(result.email);
          setSimulatedCodeAlert(result.code);
          setMode('verify');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    } else if (mode === 'forgot') {
      if (!email) {
        setAuthError('Please enter your email address');
        return;
      }
      setLoading(true);
      setLoadingMessage('Searching registered databases...');
      
      try {
        const result = await forgotPassword(email);
        if (result && result.success) {
          setSimulatedResetTokenAlert(result.token);
          setMode('reset');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    } else if (mode === 'reset') {
      if (!resetToken || !password || !confirmPassword) {
        setAuthError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }
      
      setLoading(true);
      setLoadingMessage('Updating password attributes...');
      
      try {
        const success = await resetPassword(resetToken, password);
        if (success) {
          setMode('login');
          clearForm();
          setAuthSuccess('Password reset successful! Please log in.');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    } else if (mode === 'verify') {
      if (!verificationCode) {
        setAuthError('Please enter the 6-digit verification code');
        return;
      }
      setLoading(true);
      setLoadingMessage('Validating verification code...');
      
      try {
        const success = await verifyEmailCode(pendingVerifyEmail || email, verificationCode);
        if (success) {
          setAuthSuccess('Email verified! Redirecting to Dashboard...');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={onClose ? "auth-modal-overlay modal-overlay" : "auth-page"} onClick={onClose}>
      {/* Simulation Code banners */}
      {simulatedCodeAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid #ffd700',
          padding: '1rem 2rem',
          borderRadius: '8px',
          color: '#FEFEFF',
          zIndex: 99999,
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxWidth: '90%'
        }} onClick={(e) => e.stopPropagation()}>
          <h4 style={{ color: '#ffd700', fontWeight: '800', marginBottom: '0.25rem' }}>📧 Mock SMTP Server Mail Out</h4>
          <p style={{ fontSize: '0.85rem' }}>
            Verification code sent to <strong>{pendingVerifyEmail}</strong> is: <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '2px', color: '#ffd700' }}>{simulatedCodeAlert}</span>
          </p>
        </div>
      )}

      {simulatedResetTokenAlert && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid #ffd700',
          padding: '1rem 2rem',
          borderRadius: '8px',
          color: '#FEFEFF',
          zIndex: 99999,
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxWidth: '90%'
        }} onClick={(e) => e.stopPropagation()}>
          <h4 style={{ color: '#ffd700', fontWeight: '800', marginBottom: '0.25rem' }}>🔑 Mock SMTP Password Reset Mail</h4>
          <p style={{ fontSize: '0.85rem' }}>
            Use this secure token to reset your password: <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffd700' }}>{simulatedResetTokenAlert}</span>
          </p>
        </div>
      )}

      {/* Glassmorphic Auth Card */}
      <div className="auth-card glass-panel animate-pop-in" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        {onClose && (
          <button 
            type="button" 
            className="auth-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        )}
        
        {/* Loading Overlay */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--border-radius-lg)',
            gap: '1rem'
          }}>
            <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--accent-secondary)' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '700' }}>{loadingMessage}</p>
          </div>
        )}

        <div className="auth-header">
          <div className="auth-logo">
            <Sparkles size={32} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom', color: 'var(--accent-secondary)' }} />
            TaskForge
          </div>
          <p className="auth-tagline">"Plan Better. Execute Smarter. Stay Consistent."</p>
        </div>

        {authError && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="auth-success">
            <CheckCircle2 size={18} />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* View render cases */}
        <form onSubmit={handleSubmit}>
          
          {/* REGISTER: Name & Username */}
          {mode === 'register' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-container">
                  <User size={18} className="form-input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Rahul Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Username (Optional)</label>
                <div className="form-input-container">
                  <User size={18} className="form-input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="rahul_dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* EMAIL (All except Reset and Verify) */}
          {mode !== 'reset' && mode !== 'verify' && (
            <div className="form-group" style={{ marginTop: mode === 'register' ? '1rem' : 0 }}>
              <label className="form-label">Email Address</label>
              <div className="form-input-container">
                <Mail size={18} className="form-input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* VERIFY MODE CODE INPUT */}
          {mode === 'verify' && (
            <div className="form-group animate-fade-in" style={{ textAlign: 'center' }}>
              <ShieldCheck size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem auto', opacity: 0.8 }} />
              <label className="form-label" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Enter Verification Code</label>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                We sent a 6-digit secure activation code to verification system.
              </p>
              <div className="form-input-container">
                <KeyRound size={18} className="form-input-icon" />
                <input
                  type="text"
                  maxLength="6"
                  className="form-input"
                  placeholder="e.g. 581903"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g,''))}
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.1rem', fontWeight: '800' }}
                  required
                />
              </div>
            </div>
          )}

          {/* RESET MODE TOKEN INPUT */}
          {mode === 'reset' && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Reset Token</label>
              <div className="form-input-container">
                <KeyRound size={18} className="form-input-icon" />
                <input
                  type="text"
                  maxLength="6"
                  className="form-input"
                  placeholder="Enter token from email banner"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value.toUpperCase())}
                  style={{ textAlign: 'center', fontWeight: '800' }}
                  required
                />
              </div>
            </div>
          )}

          {/* PASSWORD INPUT (Login, Register, Reset) */}
          {mode !== 'forgot' && mode !== 'verify' && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">
                {mode === 'reset' ? 'New Password' : 'Password'}
              </label>
              <div className="form-input-container">
                <Lock size={18} className="form-input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* CONFIRM PASSWORD INPUT (Register, Reset) */}
          {(mode === 'register' || mode === 'reset') && (
            <div className="form-group animate-fade-in" style={{ marginTop: '1rem' }}>
              <label className="form-label">Confirm Password</label>
              <div className="form-input-container">
                <Lock size={18} className="form-input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* REGISTER: Accept Terms & Privacy Checkbox */}
          {mode === 'register' && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: '1rem 0' }}>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ marginTop: '3px', accentColor: 'var(--accent-secondary)' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                I accept the TaskForge Terms of Service and Privacy Policy. Name registration must be valid.
              </label>
            </div>
          )}

          {/* LOGIN: Remember Me & Forgot Password link */}
          {mode === 'login' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--accent-secondary)' }}
                />
                Remember Me
              </label>
              
              <span 
                className="auth-switch-link" 
                style={{ fontSize: '0.8rem' }}
                onClick={() => handleSwitchMode('forgot')}
              >
                Forgot Password?
              </span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button type="submit" className="auth-submit-btn" style={{ marginTop: '1.25rem' }}>
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Register Profile'}
            {mode === 'forgot' && 'Send Reset Code'}
            {mode === 'reset' && 'Confirm New Password'}
            {mode === 'verify' && 'Verify Code'}
          </button>
        </form>

        {/* OAuth Social login block (Only login/register) */}
        {(mode === 'login' || mode === 'register') && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="settings-btn settings-btn-outline" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', borderRadius: '8px' }}
                onClick={() => handleOAuthLogin('Google')}
              >
                <GoogleIcon size={18} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Continue with Google</span>
              </button>

              <button 
                type="button" 
                className="settings-btn settings-btn-outline"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', borderRadius: '8px' }}
                onClick={() => handleOAuthLogin('GitHub')}
              >
                <GithubIcon size={18} color="#FEFEFF" />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Continue with GitHub</span>
              </button>
            </div>
          </div>
        )}

        {/* View Switch Links */}
        <div className="auth-switch">
          {mode === 'login' && (
            <>
              Don't have an account?
              <span className="auth-switch-link" onClick={() => handleSwitchMode('register')}>
                Sign Up
              </span>
            </>
          )}
          {mode === 'register' && (
            <>
              Already have an account?
              <span className="auth-switch-link" onClick={() => handleSwitchMode('login')}>
                Sign In
              </span>
            </>
          )}
          {(mode === 'forgot' || mode === 'reset' || mode === 'verify') && (
            <>
              Back to
              <span className="auth-switch-link" onClick={() => handleSwitchMode('login')}>
                Sign In
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
