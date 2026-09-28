import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { apiLogin, apiRegister, apiForgotPassword, apiVerifyOtp, apiResetPassword } from '../services/api';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, setCurrentUser, showToast } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setTimeout(() => {
      setAuthMode('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      setResetToken('');
      setResendTimer(0);
    }, 300); // Wait for transition
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill all fields", "error");
      return;
    }
    const result = await apiLogin(email, password);
    if (result.success) {
      setCurrentUser(result.data || { name: email.split("@")[0], email });
      closeAuthModal();
      showToast(`Welcome back, ${result.data?.name || email.split("@")[0]}!`, "success");
    } else {
      showToast(result.message || "Login failed", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill all required fields", "error");
      return;
    }
    
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      showToast("Mobile number must be exactly 10 digits.", "error");
      return;
    }

    const result = await apiRegister({ name, email, phone, password });
    if (result.success) {
      setCurrentUser(result.data || { name, email, phone });
      closeAuthModal();
      showToast(`Account created! Welcome, ${name}! 🎉`, "success");
    } else {
      showToast(result.message || "Registration failed", "error");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }
    const result = await apiForgotPassword(email);
    if (result.success) {
      showToast(result.message, "success");
      setAuthMode('verify_otp');
      setResendTimer(60);
    } else {
      showToast(result.message || "Failed to send OTP", "error");
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    const result = await apiForgotPassword(email);
    if (result.success) {
      showToast("A new OTP has been sent to your email", "success");
      setResendTimer(60);
    } else {
      showToast(result.message || "Failed to resend OTP", "error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      showToast("Please enter the OTP", "error");
      return;
    }
    const result = await apiVerifyOtp(email, otp);
    if (result.success) {
      showToast("OTP Verified successfully", "success");
      setResetToken(result.resetToken);
      setAuthMode('change_password');
      setPassword('');
      setConfirmPassword('');
    } else {
      showToast(result.message || "Invalid OTP", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast("Please fill all fields", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (!resetToken) {
      showToast("Session expired, please restart password reset", "error");
      setAuthMode('forgot_password');
      return;
    }

    const result = await apiResetPassword(email, resetToken, password);
    if (result.success) {
      showToast("Password updated successfully! Please login.", "success");
      setAuthMode('login');
      setPassword('');
      setConfirmPassword('');
      setOtp('');
      setResetToken('');
    } else {
      showToast(result.message || "Failed to update password", "error");
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            {authMode === 'forgot_password' && 'Forgot Password'}
            {authMode === 'verify_otp' && 'Verify OTP'}
            {authMode === 'change_password' && 'Change Password'}
            {(authMode === 'login' || authMode === 'register') && 'Welcome to Zwigato'}
          </h3>
          <button className="close-btn" onClick={closeAuthModal}>✕</button>
        </div>

        <div className="modal-body">
          {(authMode === 'login' || authMode === 'register') && (
            <div className="tab-group">
              <button 
                className={`tab-btn ${authMode === 'login' ? 'active' : ''}`} 
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`tab-btn ${authMode === 'register' ? 'active' : ''}`} 
                onClick={() => setAuthMode('register')}
              >
                Sign Up
              </button>
            </div>
          )}

          {authMode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" placeholder="name@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input" placeholder="Enter your password" required />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '14px' }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                <button type="button" onClick={() => { setAuthMode('forgot_password'); setPassword(''); }} style={{ color: 'var(--primary)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>Forgot Password?</button>
              </div>
              <button type="submit" className="submit-btn">Sign In to Zwigato</button>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="form-input" placeholder="e.g. Rahul Sharma" required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" placeholder="name@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} className="form-input" placeholder="e.g. 9876543210" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input" placeholder="Create a strong password" required />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '14px' }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>
              <button type="submit" className="submit-btn">Create Account</button>
            </form>
          )}

          {authMode === 'forgot_password' && (
            <form onSubmit={handleForgotPassword}>
              <p style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>Enter your registered email address. We'll send you a 6-digit OTP to reset your password.</p>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="form-input" placeholder="name@example.com" required />
              </div>
              <button type="submit" className="submit-btn">Send OTP</button>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button type="button" onClick={() => setAuthMode('login')} style={{ color: 'var(--primary)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Login</button>
              </div>
            </form>
          )}

          {authMode === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp}>
              <p style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>We've sent a 6-digit OTP to <strong>{email}</strong>.</p>
              <div className="form-group">
                <label className="form-label">Enter 6-Digit OTP</label>
                <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} className="form-input" placeholder="e.g. 123456" maxLength={6} required style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }} />
              </div>
              <button type="submit" className="submit-btn">Verify OTP</button>
              <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  disabled={resendTimer > 0}
                  style={{ color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--primary)', fontSize: '13px', background: 'none', border: 'none', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
                <button type="button" onClick={() => setAuthMode('forgot_password')} style={{ color: 'var(--text-muted)', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>Change Email</button>
              </div>
            </form>
          )}

          {authMode === 'change_password' && (
            <form onSubmit={handleChangePassword}>
              <p style={{ marginBottom: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>Create a strong new password for your account.</p>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="form-input" placeholder="Enter new password (min 6 chars)" required minLength={6} />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '14px' }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="form-input" placeholder="Confirm your new password" required />
              </div>
              <button type="submit" className="submit-btn">Update Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
