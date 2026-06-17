import { useState, useEffect } from 'react';
import api from '../services/api';
import './UserManagement.css';

function UserManagement({ currentUser, onShowToast }) {
    const [users, setUsers] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    // Modal states
    const [editModal, setEditModal] = useState({ open: false, user: null });
    const [viewModal, setViewModal] = useState({ open: false, user: null, loans: [] });
    const [addModal, setAddModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: 'member' });
    const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'member' });
    const [saving, setSaving] = useState(false);
    const [viewLoading, setViewLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            if (res.data.success) {
                setUsers(res.data.data);
                if (res.data.userStats) setUserStats(res.data.userStats);
            }
        } catch (err) { console.error('Error fetching users:', err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const getUserStatus = (u) => {
        if (u.role === 'admin') return 'active';
        if (u.active_loans > 0 || u.pending_loans > 0) return 'active';
        return 'inactive';
    };
    const getUserIdNumber = (u) => {
        const yr = new Date(u.created_at).getFullYear();
        return `${u.role === 'admin' ? 'FA' : 'ST'}-${yr}-${String(u.id).padStart(3, '0')}`;
    };
    const getUserDepartment = (u) => u.role === 'admin' ? 'Administration' : u.active_loans > 0 ? 'Active Borrower' : 'General Member';
    const getRoleLabel = (u) => u.role === 'admin' ? 'Administrator' : u.active_loans > 0 ? 'Active Member' : 'Member';
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

    // === EDIT ===
    const openEdit = (u) => {
        setEditForm({ name: u.name, email: u.email, role: u.role });
        setEditModal({ open: true, user: u });
    };
    const handleEdit = async () => {
        if (!editForm.name.trim() || !editForm.email.trim()) return alert('Nama dan email wajib diisi.');
        setSaving(true);
        try {
            const res = await api.put(`/admin/users/${editModal.user.id}`, editForm);
            if (res.data.success) {
                onShowToast?.('Data pengguna berhasil diperbarui.');
                setEditModal({ open: false, user: null });
                fetchUsers();
            }
        } catch (err) { alert(err.response?.data?.message || 'Gagal memperbarui pengguna.'); }
        finally { setSaving(false); }
    };

    // === VIEW ===
    const openView = async (u) => {
        setViewModal({ open: true, user: u, loans: [] });
        setViewLoading(true);
        try {
            const res = await api.get(`/admin/users/${u.id}`);
            if (res.data.success) setViewModal({ open: true, user: res.data.data.user, loans: res.data.data.loans });
        } catch (err) { console.error(err); }
        finally { setViewLoading(false); }
    };

    // === ADD ===
    const handleAdd = async () => {
        const { name, email, password } = addForm;
        if (!name.trim() || !email.trim() || !password.trim()) return alert('Semua field wajib diisi.');
        if (password.length < 6) return alert('Password minimal 6 karakter.');
        setSaving(true);
        try {
            const res = await api.post('/admin/users', addForm);
            if (res.data.success) {
                onShowToast?.('Pengguna baru berhasil dibuat.');
                setAddModal(false);
                setAddForm({ name: '', email: '', password: '', role: 'member' });
                fetchUsers();
            }
        } catch (err) { alert(err.response?.data?.message || 'Gagal membuat pengguna.'); }
        finally { setSaving(false); }
    };

    // === DELETE ===
    const handleDelete = async (userId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
        try {
            const res = await api.delete(`/admin/users/${userId}`);
            if (res.data.success) { onShowToast?.('Pengguna berhasil dihapus.'); fetchUsers(); }
        } catch (err) { alert(err.response?.data?.message || 'Gagal menghapus.'); }
    };

    // Filtering & pagination
    const filtered = users.filter(u => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || getUserIdNumber(u).toLowerCase().includes(q);
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        const matchStatus = statusFilter === 'all' || getUserStatus(u) === statusFilter;
        return matchSearch && matchRole && matchStatus;
    });
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const startE = filtered.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endE = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);
    useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter, statusFilter]);

    const colors = ['#3b82f6','#8b5cf6','#06b6d4','#f59e0b','#ef4444','#10b981','#ec4899','#6366f1'];
    const getColor = (id) => colors[id % colors.length];
    const initials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const statusLabel = { borrowed: 'Dipinjam', returned: 'Dikembalikan', pending: 'Menunggu', denied: 'Ditolak' };
    const statusClass = { borrowed: 'active', returned: 'inactive', pending: 'pending', denied: 'denied' };

    return (
        <div className="um-container">
            {/* Header */}
            <div className="um-page-header">
                <div>
                    <h1 className="um-page-title">User Management</h1>
                    <p className="um-page-subtitle">Manage student accounts, academic roles, and access permissions.</p>
                </div>
                <div className="um-page-header__actions">
                    <button className="um-btn-primary" onClick={() => setAddModal(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add New User
                    </button>
                </div>
            </div>

            {/* Stats */}
            <section className="um-stats-row">
                {[
                    { label: 'TOTAL USERS', val: userStats?.totalUsers ?? users.length, icon: 'users', color: 'blue', trend: '+13%', trendClass: 'up' },
                    { label: 'ACTIVE STUDENTS', val: userStats?.activeMembers ?? 0, icon: 'user', color: 'dark', trend: 'Stable', trendClass: 'stable' },
                    { label: 'PENDING APPROVALS', val: userStats?.pendingApprovals ?? 0, icon: 'clock', color: 'red', trend: 'Action Needed', trendClass: 'warn' },
                    { label: 'FACULTY MEMBERS', val: userStats?.adminCount ?? 0, icon: 'shield', color: 'green', trend: '+3', trendClass: 'neutral' }
                ].map((s, i) => (
                    <div className="um-stat-card" key={i}>
                        <div className={`um-stat-card__icon-wrapper um-stat-card__icon--${s.color}`}>
                            {s.icon === 'users' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                            {s.icon === 'user' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
                            {s.icon === 'clock' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                            {s.icon === 'shield' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                        </div>
                        <span className={`um-stat-trend um-stat-trend--${s.trendClass}`}>{s.trend}</span>
                        <div className="um-stat-card__body">
                            <div className="um-stat-card__label">{s.label}</div>
                            <div className="um-stat-card__value">{loading ? '...' : s.val.toLocaleString()}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Filters */}
            <div className="um-filters-bar">
                <div className="um-search-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" placeholder="Search by name, ID or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="um-search-input"/>
                </div>
                <div className="um-filter-dropdowns">
                    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="um-filter-select">
                        <option value="all">All Departments</option>
                        <option value="admin">Administrators</option>
                        <option value="member">Members</option>
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="um-filter-select">
                        <option value="all">Status: All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="um-table-card">
                <div className="um-table-scroll">
                    <table className="um-table">
                        <thead><tr><th>USER NAME</th><th>ID NUMBER</th><th>DEPARTMENT</th><th>ROLE</th><th>STATUS</th><th className="um-th-right">ACTIONS</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="um-table-loading"><div className="um-loading-spinner"></div>Loading...</td></tr>
                            ) : paginated.length === 0 ? (
                                <tr><td colSpan="6" className="um-table-empty"><p>No users found.</p></td></tr>
                            ) : paginated.map(u => {
                                const st = getUserStatus(u);
                                return (
                                    <tr key={u.id}>
                                        <td><div className="um-user-cell"><div className="um-user-avatar" style={{ backgroundColor: getColor(u.id) }}>{initials(u.name)}</div><div className="um-user-info"><span className="um-user-name">{u.name}</span><span className="um-user-email">{u.email}</span></div></div></td>
                                        <td className="um-cell-id">{getUserIdNumber(u)}</td>
                                        <td className="um-cell-dept">{getUserDepartment(u)}</td>
                                        <td className="um-cell-role">{getRoleLabel(u)}</td>
                                        <td><span className={`um-status-badge um-status--${st}`}>{st === 'active' ? 'Active' : 'Inactive'}</span></td>
                                        <td className="um-th-right">
                                            <div className="um-action-icons">
                                                <button className="um-icon-action" title="Edit" onClick={() => openEdit(u)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                </button>
                                                <button className="um-icon-action" title="View" onClick={() => openView(u)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </button>
                                                {u.id === currentUser?.id ? (
                                                    <button className="um-icon-action um-icon-action--disabled" disabled title="Can't delete self">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                                    </button>
                                                ) : (
                                                    <button className="um-icon-action um-icon-action--danger" title="Delete" onClick={() => handleDelete(u.id)}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {!loading && filtered.length > 0 && (
                    <div className="um-pagination-bar">
                        <div className="um-pagination-info">Showing {startE} to {endE} of {filtered.length} entries</div>
                        <div className="um-pagination-controls">
                            <button className="um-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                                let p = totalPages <= 3 ? i + 1 : currentPage <= 2 ? i + 1 : currentPage >= totalPages - 1 ? totalPages - 2 + i : currentPage - 1 + i;
                                return <button key={p} className={`um-page-btn ${currentPage === p ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>;
                            })}
                            <button className="um-page-btn" disabled={currentPage === totalPages || !totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Cards */}
            <div className="um-bottom-cards">
                <div className="um-bottom-card">
                    <div className="um-bottom-card__header"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg><h4>Access Logs</h4></div>
                    <p className="um-bottom-card__desc">Monitor recent administrative changes and security-sensitive actions.</p>
                    <a href="#" className="um-bottom-card__link" onClick={e => { e.preventDefault(); onShowToast?.('Audit trail coming soon.'); }}>View Audit Trails →</a>
                </div>
                <div className="um-bottom-card">
                    <div className="um-bottom-card__header"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><h4>Bulk Communication</h4></div>
                    <p className="um-bottom-card__desc">Send announcements, credential resets, or notices to selected groups.</p>
                    <a href="#" className="um-bottom-card__link" onClick={e => { e.preventDefault(); onShowToast?.('Broadcast coming soon.'); }}>Compose Broadcast →</a>
                </div>
            </div>

            {/* ═══ EDIT MODAL ═══ */}
            {editModal.open && (
                <div className="um-modal-overlay" onClick={() => setEditModal({ open: false, user: null })}>
                    <div className="um-modal" onClick={e => e.stopPropagation()}>
                        <div className="um-modal__header">
                            <h3>Edit User</h3>
                            <button className="um-modal__close" onClick={() => setEditModal({ open: false, user: null })}>✕</button>
                        </div>
                        <div className="um-modal__body">
                            <div className="um-modal__avatar" style={{ backgroundColor: getColor(editModal.user.id) }}>
                                {initials(editModal.user.name)}
                            </div>
                            <p className="um-modal__id">{getUserIdNumber(editModal.user)}</p>
                            <label className="um-form-label">Full Name
                                <input className="um-form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </label>
                            <label className="um-form-label">Email Address
                                <input className="um-form-input" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                            </label>
                            <label className="um-form-label">Role
                                <select className="um-form-input" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                                    <option value="member">Member</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </label>
                        </div>
                        <div className="um-modal__footer">
                            <button className="um-btn-outline" onClick={() => setEditModal({ open: false, user: null })}>Cancel</button>
                            <button className="um-btn-primary" onClick={handleEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ VIEW MODAL ═══ */}
            {viewModal.open && (
                <div className="um-modal-overlay" onClick={() => setViewModal({ open: false, user: null, loans: [] })}>
                    <div className="um-modal um-modal--wide" onClick={e => e.stopPropagation()}>
                        <div className="um-modal__header">
                            <h3>User Details</h3>
                            <button className="um-modal__close" onClick={() => setViewModal({ open: false, user: null, loans: [] })}>✕</button>
                        </div>
                        <div className="um-modal__body">
                            <div className="um-view-profile">
                                <div className="um-modal__avatar um-modal__avatar--lg" style={{ backgroundColor: getColor(viewModal.user.id) }}>
                                    {initials(viewModal.user.name)}
                                </div>
                                <div>
                                    <h4 className="um-view-name">{viewModal.user.name}</h4>
                                    <p className="um-view-email">{viewModal.user.email}</p>
                                    <div className="um-view-meta">
                                        <span className={`um-status-badge um-status--${getUserStatus(viewModal.user)}`}>{getUserStatus(viewModal.user) === 'active' ? 'Active' : 'Inactive'}</span>
                                        <span className="um-view-tag">{viewModal.user.role === 'admin' ? 'Administrator' : 'Member'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="um-view-details-grid">
                                <div><span className="um-detail-label">User ID</span><span className="um-detail-val">{getUserIdNumber(viewModal.user)}</span></div>
                                <div><span className="um-detail-label">Join Date</span><span className="um-detail-val">{formatDate(viewModal.user.created_at)}</span></div>
                                <div><span className="um-detail-label">Department</span><span className="um-detail-val">{getUserDepartment(viewModal.user)}</span></div>
                                <div><span className="um-detail-label">Total Loans</span><span className="um-detail-val">{viewModal.loans.length}</span></div>
                            </div>
                            <h4 className="um-view-section-title">Loan History</h4>
                            {viewLoading ? <p className="um-view-loading">Loading loan history...</p> : viewModal.loans.length === 0 ? (
                                <p className="um-view-empty">No loan history found.</p>
                            ) : (
                                <div className="um-view-loans">
                                    {viewModal.loans.map(l => (
                                        <div className="um-loan-row" key={l.id}>
                                            <div className="um-loan-info">
                                                <span className="um-loan-title">{l.book_title}</span>
                                                <span className="um-loan-author">{l.author}</span>
                                            </div>
                                            <span className="um-loan-date">{formatDate(l.borrow_date)}</span>
                                            <span className={`um-status-badge um-status--${statusClass[l.status] || 'inactive'}`}>{statusLabel[l.status] || l.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ ADD NEW USER MODAL ═══ */}
            {addModal && (
                <div className="um-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="um-modal" onClick={e => e.stopPropagation()}>
                        <div className="um-modal__header">
                            <h3>Add New User</h3>
                            <button className="um-modal__close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <div className="um-modal__body">
                            <label className="um-form-label">Full Name
                                <input className="um-form-input" placeholder="e.g. John Doe" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
                            </label>
                            <label className="um-form-label">Email Address
                                <input className="um-form-input" type="email" placeholder="e.g. john@orionlib.com" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} />
                            </label>
                            <label className="um-form-label">Password
                                <input className="um-form-input" type="password" placeholder="Min. 6 characters" value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })} />
                            </label>
                            <label className="um-form-label">Role
                                <select className="um-form-input" value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
                                    <option value="member">Member</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </label>
                        </div>
                        <div className="um-modal__footer">
                            <button className="um-btn-outline" onClick={() => setAddModal(false)}>Cancel</button>
                            <button className="um-btn-primary" onClick={handleAdd} disabled={saving}>{saving ? 'Creating...' : 'Create User'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
