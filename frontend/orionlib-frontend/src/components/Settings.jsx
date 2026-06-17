import { useState } from 'react';
import api from '../services/api';
import './Settings.css';

function Settings({ user, onUpdateUser }) {
    // Profile Form State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Preferences State
    const [language, setLanguage] = useState('en');
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [prefSuccess, setPrefSuccess] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileSuccess('');
        setProfileError('');
        
        if (!name.trim() || !email.trim()) {
            setProfileError('Nama dan email tidak boleh kosong.');
            return;
        }

        setProfileLoading(true);
        try {
            const res = await api.put('/user/profile', { name, email });
            if (res.data.success) {
                // Update local storage token
                if (res.data.token) {
                    localStorage.setItem('orion_token', res.data.token);
                }
                // Update parent state
                if (onUpdateUser && res.data.user) {
                    onUpdateUser(res.data.user);
                }
                setProfileSuccess('Profile updated successfully!');
                setTimeout(() => setProfileSuccess(''), 4000);
            }
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordSuccess('');
        setPasswordError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Please fill out all password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await api.put('/user/password', { currentPassword, newPassword });
            if (res.data.success) {
                setPasswordSuccess('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordSuccess(''), 4000);
            }
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSavePreferences = (e) => {
        e.preventDefault();
        setPrefSuccess('Preferences saved successfully!');
        setTimeout(() => setPrefSuccess(''), 3000);
    };

    return (
        <div className="se-layout">
            <div className="se-header">
                <div>
                    <h1 className="se-main-title">Account Settings</h1>
                    <p className="se-sub-title">Manage your library profile, security settings, and interface preferences.</p>
                </div>
            </div>

            <div className="se-grid">
                {/* Profile Card */}
                <div className="se-card">
                    <div className="se-card-header">
                        <div className="se-card-icon blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h3>Personal Profile</h3>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="se-form">
                        {profileSuccess && <div className="se-alert success">{profileSuccess}</div>}
                        {profileError && <div className="se-alert error">{profileError}</div>}

                        <div className="se-form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Your Name"
                                required
                            />
                        </div>

                        <div className="se-form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="email@domain.com"
                                required
                            />
                        </div>

                        <div className="se-form-group">
                            <label>Portal Role</label>
                            <div className="se-role-badge-wrapper">
                                <span className={`se-role-badge ${user?.role === 'admin' ? 'admin' : 'member'}`}>
                                    {user?.role === 'admin' ? '🛡️ Administrator' : '🎓 Library Member'}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="se-btn se-btn--primary" disabled={profileLoading}>
                            {profileLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                {/* Password / Security Card */}
                <div className="se-card">
                    <div className="se-card-header">
                        <div className="se-card-icon orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h3>Security & Password</h3>
                    </div>

                    <form onSubmit={handleChangePassword} className="se-form">
                        {passwordSuccess && <div className="se-alert success">{passwordSuccess}</div>}
                        {passwordError && <div className="se-alert error">{passwordError}</div>}

                        <div className="se-form-group">
                            <label>Current Password</label>
                            <input 
                                type="password" 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="se-form-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                placeholder="Min. 6 characters"
                                required
                            />
                        </div>

                        <div className="se-form-group">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button type="submit" className="se-btn se-btn--orange" disabled={passwordLoading}>
                            {passwordLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Preferences Card */}
                <div className="se-card se-card--full-width">
                    <div className="se-card-header">
                        <div className="se-card-icon teal">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </div>
                        <h3>Portal Preferences</h3>
                    </div>

                    <form onSubmit={handleSavePreferences} className="se-preferences-form">
                        {prefSuccess && <div className="se-alert success">{prefSuccess}</div>}

                        <div className="se-pref-grid">
                            <div className="se-form-group">
                                <label>Interface Language</label>
                                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="en">English (US)</option>
                                    <option value="id">Bahasa Indonesia</option>
                                </select>
                            </div>

                            <div className="se-form-group checkbox-group">
                                <label className="se-checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={emailAlerts} 
                                        onChange={(e) => setEmailAlerts(e.target.checked)} 
                                    />
                                    <span>Send loan expiry due alerts to my email</span>
                                </label>
                                <span className="se-checkbox-desc">You'll receive a reminder 3 days before any borrowed book's due date.</span>
                            </div>
                        </div>

                        <button type="submit" className="se-btn se-btn--teal">
                            Save Preferences
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;
