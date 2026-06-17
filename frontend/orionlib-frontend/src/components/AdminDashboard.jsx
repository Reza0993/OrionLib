import { useState, useEffect } from 'react';
import BookManagement from './BookManagement';
import UserManagement from './UserManagement';
import Settings from './Settings';
import api from '../services/api';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout, books, loading: booksLoading, onEditClick, onDeleteClick, onAddNew, onUpdateUser, onGoHome, loadAllBooks }) {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'users', 'inventory', 'analytics', 'settings'
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    // Fetch dashboard stats (counters, activity, approvals)
    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            const response = await api.get('/admin/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            setError('Gagal memuat data statistik dashboard.');
        } finally {
            setLoadingStats(false);
        }
    };

    // Fetch users list
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await api.get('/admin/users');
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Gagal memuat data pengguna.');
        } finally {
            setLoadingUsers(false);
        }
    };

    // Handle approval
    const handleApprove = async (loanId) => {
        try {
            const response = await api.post(`/admin/loans/${loanId}/approve`);
            if (response.data.success) {
                showToast(response.data.message || 'Permintaan peminjaman disetujui.');
                fetchStats();
                if (loadAllBooks) loadAllBooks(); // reload catalog in App state
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menyetujui permintaan.');
        }
    };

    // Handle denial
    const handleDeny = async (loanId) => {
        try {
            const response = await api.post(`/admin/loans/${loanId}/deny`);
            if (response.data.success) {
                showToast(response.data.message || 'Permintaan peminjaman ditolak.');
                fetchStats();
                if (loadAllBooks) loadAllBooks();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menolak permintaan.');
        }
    };

    // Handle user delete
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini? Semua data terkait (peminjaman dll) akan terhapus.')) return;
        try {
            const response = await api.delete(`/admin/users/${userId}`);
            if (response.data.success) {
                showToast(response.data.message || 'Pengguna berhasil dihapus.');
                fetchUsers();
                fetchStats();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus pengguna.');
        }
    };

    // Show temporary toast notification
    const showToast = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    // Format date beautifully
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format relative time (e.g. 5 minutes ago)
    const formatRelativeTime = (dateStr) => {
        if (!dateStr) return '';
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minutes ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

        return formatDate(dateStr);
    };

    // Filtering data based on search bar
    const filteredPendingApprovals = stats?.pendingApprovals?.filter(item => {
        const query = searchQuery.toLowerCase();
        return item.requester_name.toLowerCase().includes(query) || 
               item.book_title.toLowerCase().includes(query);
    }) || [];

    const filteredUsers = users.filter(u => {
        const query = searchQuery.toLowerCase();
        return u.name.toLowerCase().includes(query) || 
               u.email.toLowerCase().includes(query) ||
               u.role.toLowerCase().includes(query);
    });

    const activeLoansCount = stats?.stats?.activeLoans || 0;
    // Calculate Capacity Used: active loans relative to an arbitrary maximum limit (e.g., 200) or dynamic
    const maxCapacity = 200;
    const capacityPercentage = Math.min(Math.round((activeLoansCount / maxCapacity) * 100), 100);

    return (
        <div className="adm-layout">
            {/* Toast Notification */}
            {notification && (
                <div className="adm-toast">
                    <span>{notification}</span>
                </div>
            )}

            {/* ══════════ Sidebar ══════════ */}
            <aside className="adm-sidebar">
                <div className="adm-sidebar__logo-wrapper" onClick={onGoHome} title="Back to Homepage">
                    <div className="adm-logo-text">Orionlab</div>
                    <div className="adm-logo-sub">Admin Portal</div>
                </div>

                <nav className="adm-sidebar__nav">
                    <button 
                        className={`adm-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
                    >
                        <svg className="adm-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="9" rx="1" />
                            <rect x="14" y="3" width="7" height="5" rx="1" />
                            <rect x="14" y="12" width="7" height="9" rx="1" />
                            <rect x="3" y="16" width="7" height="5" rx="1" />
                        </svg>
                        Overview
                    </button>
                    <button 
                        className={`adm-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                    >
                        <svg className="adm-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        User Management
                    </button>
                    <button 
                        className={`adm-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('inventory'); setSearchQuery(''); }}
                    >
                        <svg className="adm-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        Book Inventory
                    </button>
                    <button 
                        className={`adm-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('analytics'); setSearchQuery(''); }}
                    >
                        <svg className="adm-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        Resource Analytics
                    </button>
                    <button 
                        className={`adm-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
                    >
                        <svg className="adm-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        System Settings
                    </button>
                </nav>

                <div className="adm-sidebar__footer">
                    <button className="adm-report-btn" onClick={() => window.print()}>
                        Generate Report
                    </button>
                    <button className="adm-logout-btn" onClick={onLogout}>
                        <svg className="adm-logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ══════════ Main Content Area ══════════ */}
            <main className="adm-main">
                {/* Topbar */}
                <header className="adm-topbar">
                    <div className="adm-search-wrapper">
                        <svg className="adm-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input 
                            type="text" 
                            placeholder={
                                activeTab === 'users' ? "Search users by name or email..." :
                                activeTab === 'inventory' ? "Search catalog by title, author, or ISBN..." :
                                "Search records, assets, or users..."
                            } 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="adm-search-input"
                        />
                    </div>

                    <div className="adm-topbar__actions">
                        <button className="adm-icon-btn" title="Notifications">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span className="adm-badge-dot"></span>
                        </button>
                        <button className="adm-icon-btn" title="Help">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </button>
                        <div className="adm-profile">
                            <div className="adm-profile__info">
                                <div className="adm-profile__name">{user?.name || 'Admin User'}</div>
                                <div className="adm-profile__role">Institution Admin</div>
                            </div>
                            <div className="adm-avatar">
                                {user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'AD'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="adm-content">
                    {/* ─── TAB 1: DASHBOARD ─── */}
                    {activeTab === 'dashboard' && (
                        <div className="adm-dashboard-view">
                            {/* Stats Cards Row */}
                            <section className="adm-stats-grid">
                                {/* Card 1: Total Enrollment */}
                                <div className="adm-stat-card">
                                    <div className="adm-stat-label">TOTAL ENROLLMENT</div>
                                    <div className="adm-stat-value">
                                        {loadingStats ? '...' : (stats?.stats?.totalMembers?.toLocaleString() || '0')}
                                    </div>
                                    <div className="adm-stat-footer">
                                        <span className="adm-trend-up">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                                <polyline points="17 6 23 6 23 12" />
                                            </svg>
                                            +4.2%
                                        </span>
                                        <div className="adm-sparkline-wrapper">
                                            <svg viewBox="0 0 100 30" className="adm-sparkline">
                                                <path d="M0 25 C10 22, 20 28, 30 18 C40 8, 50 15, 60 12 C70 9, 80 5, 90 7 C95 8, 100 2, 100 2" fill="none" stroke="#22c55e" strokeWidth="2"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Active Loans */}
                                <div className="adm-stat-card">
                                    <div className="adm-stat-label">ACTIVE LOANS</div>
                                    <div className="adm-stat-value">
                                        {loadingStats ? '...' : (stats?.stats?.activeLoans?.toLocaleString() || '0')}
                                    </div>
                                    <div className="adm-stat-footer adm-stat-footer--gauge">
                                        <span className="adm-gauge-label">Capacity Used</span>
                                        <div className="adm-gauge-wrapper">
                                            <svg width="36" height="36" viewBox="0 0 36 36" className="adm-gauge">
                                                <circle className="adm-gauge-bg" cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"></circle>
                                                <circle className="adm-gauge-fill" cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3.5"
                                                    strokeDasharray={`${capacityPercentage} 100`}
                                                    transform="rotate(-90 18 18)"></circle>
                                            </svg>
                                            <span className="adm-gauge-val-text">{capacityPercentage}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: New Acquisitions */}
                                <div className="adm-stat-card">
                                    <div className="adm-stat-label">
                                        NEW ACQUISITIONS 
                                        <span className="adm-new-badge">NEW</span>
                                    </div>
                                    <div className="adm-stat-value">
                                        {loadingStats ? '...' : (stats?.stats?.newAcquisitions?.toLocaleString() || '0')}
                                    </div>
                                    <div className="adm-stat-footer">
                                        <span className="adm-subtext">Last 30 days summary</span>
                                    </div>
                                </div>

                                {/* Card 4: System Uptime */}
                                <div className="adm-stat-card">
                                    <div className="adm-stat-label">SYSTEM UPTIME</div>
                                    <div className="adm-stat-value">99.98%</div>
                                    <div className="adm-stat-footer">
                                        <span className="adm-status-dot green"></span>
                                        <span className="adm-status-text">ONLINE</span>
                                    </div>
                                </div>
                            </section>

                            {/* Middle section: Feed and Resource Chart */}
                            <section className="adm-middle-section">
                                {/* Live Activity Feed */}
                                <div className="adm-card adm-activity-feed">
                                    <div className="adm-card-header">
                                        <h3>Live Activity Feed</h3>
                                        <a href="#" className="adm-view-all-link" onClick={(e) => { e.preventDefault(); showToast('Showing all activity logs.'); }}>View All</a>
                                    </div>
                                    <div className="adm-activity-list">
                                        {loadingStats ? (
                                            <div className="adm-feed-loading">Loading activity feed...</div>
                                        ) : stats?.liveFeed?.length === 0 ? (
                                            <div className="adm-feed-empty">No recent activity found.</div>
                                        ) : (
                                            stats?.liveFeed?.map((act, index) => (
                                                <div key={index} className="adm-activity-item">
                                                    <div className={`adm-activity-icon-bg ${act.type}`}>
                                                        {act.type === 'user' && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                                <circle cx="9" cy="7" r="4" />
                                                            </svg>
                                                        )}
                                                        {act.type === 'borrow' && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                                            </svg>
                                                        )}
                                                        {act.type === 'return' && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="23 4 23 10 17 10" />
                                                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                                            </svg>
                                                        )}
                                                        {act.type === 'pending' && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="12 6 12 12 16 14" />
                                                            </svg>
                                                        )}
                                                        {act.type === 'denied' && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <line x1="15" y1="9" x2="9" y2="15" />
                                                                <line x1="9" y1="9" x2="15" y2="15" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="adm-activity-details">
                                                        <div className="adm-activity-text">
                                                            <strong>{act.message.split(' ')[0]}</strong> {act.message.substring(act.message.indexOf(' ') + 1)}
                                                        </div>
                                                        <div className="adm-activity-meta">
                                                            {formatRelativeTime(act.timestamp)} • {act.meta}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Resource Utilization */}
                                <div className="adm-card adm-resource-utilization">
                                    <div className="adm-card-header">
                                        <h3>Resource Utilization</h3>
                                    </div>
                                    <div className="adm-chart-container">
                                        <div className="adm-radial-chart-wrapper">
                                            {/* Circular utilization visualization */}
                                            <svg className="adm-radial-chart" width="160" height="160" viewBox="0 0 36 36">
                                                <circle className="adm-radial-bg" cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3"></circle>
                                                {/* Stacked percentages for visually matching the 78% average wheel */}
                                                <circle className="adm-radial-fg" cx="18" cy="18" r="14" fill="none" stroke="#0f172a" strokeWidth="3"
                                                    strokeDasharray="78 100" strokeDashoffset="0"
                                                    transform="rotate(-90 18 18)"></circle>
                                            </svg>
                                            <div className="adm-radial-center-text">
                                                <div className="adm-radial-percent">78%</div>
                                                <div className="adm-radial-label">AVERAGE</div>
                                            </div>
                                        </div>
                                        
                                        <div className="adm-legend-list">
                                            {loadingStats ? (
                                                <div className="adm-legend-loading">Loading breakdown...</div>
                                            ) : stats?.utilization?.length === 0 ? (
                                                <div className="adm-legend-empty">No catalog categories yet.</div>
                                            ) : (
                                                stats?.utilization?.map((item, idx) => {
                                                    const dotColors = ['#0f172a', '#94a3b8', '#cbd5e1'];
                                                    return (
                                                        <div key={idx} className="adm-legend-item">
                                                            <div className="adm-legend-left">
                                                                <span className="adm-legend-dot" style={{ backgroundColor: dotColors[idx] || '#cbd5e1' }}></span>
                                                                <span className="adm-legend-name">{item.name} Resources</span>
                                                            </div>
                                                            <span className="adm-legend-value">{item.percentage}%</span>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Pending Approvals Table Section */}
                            <section className="adm-card adm-pending-approvals">
                                <div className="adm-card-header">
                                    <div className="adm-card-title-group">
                                        <h3>Pending Approvals</h3>
                                        <span className="adm-action-badge">
                                            {filteredPendingApprovals.length} ACTION REQUIRED
                                        </span>
                                    </div>
                                </div>

                                <div className="adm-table-container">
                                    <table className="adm-table">
                                        <thead>
                                            <tr>
                                                <th>REQUESTER</th>
                                                <th>RESOURCE TYPE</th>
                                                <th>DATE SUBMITTED</th>
                                                <th className="text-right">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loadingStats ? (
                                                <tr>
                                                    <td colSpan="4" className="adm-table-loading">Loading pending approvals...</td>
                                                </tr>
                                            ) : filteredPendingApprovals.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="adm-table-empty">
                                                        {searchQuery ? 'No matching requests found.' : 'All requests approved! No pending actions.'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredPendingApprovals.map((item) => (
                                                    <tr key={item.loan_id}>
                                                        <td>
                                                            <div className="adm-table-requester">
                                                                <div className="adm-table-initials">
                                                                    {item.requester_name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                                                                </div>
                                                                <span className="adm-requester-name">{item.requester_name}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="adm-resource-pill">
                                                                {item.book_title}
                                                            </span>
                                                        </td>
                                                        <td>{formatDate(item.date_submitted)}</td>
                                                        <td className="text-right">
                                                            <div className="adm-action-btns">
                                                                <button 
                                                                    className="adm-btn-deny"
                                                                    onClick={() => handleDeny(item.loan_id)}
                                                                >
                                                                    Deny
                                                                </button>
                                                                <button 
                                                                    className="adm-btn-approve"
                                                                    onClick={() => handleApprove(item.loan_id)}
                                                                >
                                                                    Approve
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Floating Action Button (FAB) for adding new book */}
                            <button 
                                className="adm-fab" 
                                onClick={onAddNew} 
                                title="Add New Book to Inventory"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* ─── TAB 2: USER MANAGEMENT ─── */}
                    {activeTab === 'users' && (
                        <UserManagement 
                            currentUser={user}
                            onShowToast={showToast}
                        />
                    )}

                    {/* ─── TAB 3: INVENTORY (BOOK MANAGEMENT) ─── */}
                    {activeTab === 'inventory' && (
                        <div className="adm-inventory-view">
                            <BookManagement 
                                isAdmin={true} 
                                loadAllBooks={loadAllBooks}
                            />
                        </div>
                    )}

                    {/* ─── TAB 4: ANALYTICS ─── */}
                    {activeTab === 'analytics' && (
                        <div className="adm-card adm-analytics-view">
                            <div className="adm-card-header">
                                <h3>Library Usage Analytics</h3>
                            </div>
                            <div className="adm-analytics-grid">
                                <div className="adm-analytics-card">
                                    <h4>Inventory Overview</h4>
                                    <div className="adm-analytics-stat">
                                        <div className="adm-stat-item">
                                            <span>Total Unique Titles</span>
                                            <strong>{books.length}</strong>
                                        </div>
                                        <div className="adm-stat-item">
                                            <span>Total Stock Available</span>
                                            <strong>{books.reduce((acc, b) => acc + b.stock, 0)} copies</strong>
                                        </div>
                                    </div>
                                    <div className="adm-bar-chart-mock">
                                        <div className="adm-chart-bar-item">
                                            <span>Available Stock</span>
                                            <div className="adm-bar-outer">
                                                <div className="adm-bar-inner available" style={{ width: `${Math.round((books.reduce((acc,b)=>acc+b.stock,0) / (books.length * 5 || 1)) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="adm-analytics-card">
                                    <h4>System Load Indicators</h4>
                                    <div className="adm-load-indicators">
                                        <div className="adm-indicator-item">
                                            <div className="adm-indicator-val">0.45 ms</div>
                                            <div className="adm-indicator-lbl">API Response Time</div>
                                        </div>
                                        <div className="adm-indicator-item">
                                            <div className="adm-indicator-val">100%</div>
                                            <div className="adm-indicator-lbl">Database Health</div>
                                        </div>
                                        <div className="adm-indicator-item">
                                            <div className="adm-indicator-val">12</div>
                                            <div className="adm-indicator-lbl">Concurrent Sessions</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ─── TAB 5: SETTINGS ─── */}
                    {activeTab === 'settings' && (
                        <div className="adm-settings-view">
                            <Settings user={user} onUpdateUser={onUpdateUser} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
