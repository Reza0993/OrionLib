import { useState } from 'react';
import api from '../services/api';
import './LoginPage.css';

function LoginPage({ onLoginSuccess, onGuestContinue, onNavigateRegister }) {
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            if (activeTab === 'login') {
                const response = await api.post('/auth/login', { email, password });
                if (response.data.success) {
                    const token = response.data.token;
                    localStorage.setItem('orion_token', token);
                    const payload = JSON.parse(window.atob(token.split('.')[1]));
                    onLoginSuccess(payload);
                }
            } else {
                const response = await api.post('/auth/register', { name, email, password, role });
                if (response.data.success) {
                    setErrorMsg('');
                    alert('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
                    setActiveTab('login');
                    setName('');
                }
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Left Panel – Library Image */}
            <div className="login-page__left">
                <img
                    src="https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=80&auto=format&fit=crop"
                    alt="Library interior"
                    className="login-page__bg-img"
                />
                <div className="login-page__left-overlay" />
                <div className="login-page__left-content">
                    <div className="login-page__left-logo">
                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.2"/>
                            <path d="M8 24L16 8L24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.5 19H21.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Orionlab</span>
                    </div>
                    <div className="login-page__left-text">
                        <h2>Unlock the Knowledge of Tomorrow</h2>
                        <p>Access over 2 million digital resources, journals, and archival records within the Orionlab ecosystem.</p>
                    </div>
                </div>
            </div>

            {/* Right Panel – Form */}
            <div className="login-page__right">
                <div className="login-page__form-wrapper">
                    {/* Logo */}
                    <div className="login-form__logo">
                        <div className="login-form__logo-icon">
                            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                                <rect width="32" height="32" rx="8" fill="#1a1a2e"/>
                                <path d="M8 24L16 8L24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10.5 19H21.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span>Orionlab</span>
                    </div>

                    {/* Heading */}
                    <div className="login-form__heading">
                        <h1>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>{activeTab === 'login' ? 'Please enter your academic credentials to continue.' : 'Register a new OrionLib account.'}</p>
                    </div>

                    {/* Tabs */}
                    <div className="login-form__tabs">
                        <button
                            className={`login-form__tab ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                        >Login</button>
                        <button
                            className={`login-form__tab ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                        >Register</button>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                        <div className="login-form__error">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {errorMsg}
                        </div>
                    )}

                    <form className="login-form__form" onSubmit={handleSubmit}>
                        {/* Name (Register only) */}
                        {activeTab === 'register' && (
                            <div className="login-form__field">
                                <label htmlFor="lf-name">Full Name</label>
                                <div className="login-form__input-wrapper">
                                    <svg className="login-form__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    <input
                                        id="lf-name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="login-form__field">
                            <label htmlFor="lf-email">Email or Student ID (NIM)</label>
                            <div className="login-form__input-wrapper">
                                <svg className="login-form__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                </svg>
                                <input
                                    id="lf-email"
                                    type="email"
                                    placeholder="name@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="login-form__field">
                            <div className="login-form__field-header">
                                <label htmlFor="lf-password">Password</label>
                                {activeTab === 'login' && (
                                    <a href="#" className="login-form__forgot">Forgot Password?</a>
                                )}
                            </div>
                            <div className="login-form__input-wrapper">
                                <svg className="login-form__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                                <input
                                    id="lf-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-form__eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Role (Register only) */}
                        {activeTab === 'register' && (
                            <div className="login-form__field">
                                <label htmlFor="lf-role">Access Role</label>
                                <div className="login-form__input-wrapper">
                                    <svg className="login-form__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                    </svg>
                                    <select id="lf-role" value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="member">Member (Read-only)</option>
                                        <option value="admin">Admin (Full CRUD)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Remember me */}
                        {activeTab === 'login' && (
                            <label className="login-form__remember">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <span>Remember this device for 30 days</span>
                            </label>
                        )}

                        {/* Submit */}
                        <button type="submit" className="login-form__submit" disabled={loading} id="login-submit-btn">
                            {loading ? 'Processing...' : activeTab === 'login' ? 'Login to Portal →' : 'Create Account →'}
                        </button>
                    </form>

                    {activeTab === 'login' && (
                        <>
                            <p className="login-form__register-link">
                                Don't have an account?{' '}
                                <button className="login-form__link-btn" onClick={() => setActiveTab('register')}>
                                    Create an account
                                </button>
                            </p>
                            <div className="login-form__divider"><span>OR</span></div>
                            <button className="login-form__guest" onClick={onGuestContinue} id="guest-login-btn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                                </svg>
                                Continue as Guest
                            </button>
                        </>
                    )}

                    <p className="login-form__copyright">
                        © 2024 Academic Information Systems. All rights reserved.<br />
                        Authorized Access Only.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
