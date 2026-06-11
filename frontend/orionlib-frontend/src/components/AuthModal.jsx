import { useState } from 'react';
import api from '../services/api';

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member'); // default to member
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            if (isLoginTab) {
                // Login action
                const response = await api.post('/auth/login', { email, password });
                if (response.data.success) {
                    const token = response.data.token;
                    localStorage.setItem('orion_token', token);
                    
                    // Decode token to get user info (safe atob decoder)
                    const payload = JSON.parse(window.atob(token.split('.')[1]));
                    onLoginSuccess(payload);
                    onClose();
                    
                    // Reset fields
                    setEmail('');
                    setPassword('');
                }
            } else {
                // Register action
                const response = await api.post('/auth/register', { name, email, password, role });
                if (response.data.success) {
                    alert('Registrasi berhasil! Silakan masuk dengan akun baru Anda.');
                    setIsLoginTab(true);
                    setName('');
                }
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    };

    const modalContentStyle = {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '2rem',
        width: '400px',
        maxWidth: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
    };

    const tabContainerStyle = {
        display: 'flex',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '1.5rem'
    };

    const tabStyle = (active) => ({
        flex: 1,
        padding: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: active ? '#00adb5' : '#64748b',
        borderBottom: active ? '3px solid #00adb5' : '3px solid transparent',
        transition: 'all 0.2s',
        marginBottom: '-2px'
    });

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '1rem'
    };

    const inputStyle = {
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    const buttonStyle = {
        padding: '12px',
        backgroundColor: '#00adb5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        cursor: 'pointer',
        width: '100%',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s'
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'none',
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        color: '#94a3b8'
    };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button style={closeButtonStyle} onClick={onClose}>&times;</button>
                
                {/* Tabs */}
                <div style={tabContainerStyle}>
                    <div 
                        style={tabStyle(isLoginTab)} 
                        onClick={() => { setIsLoginTab(true); setErrorMsg(''); }}
                    >
                        Masuk
                    </div>
                    <div 
                        style={tabStyle(!isLoginTab)} 
                        onClick={() => { setIsLoginTab(false); setErrorMsg(''); }}
                    >
                        Daftar
                    </div>
                </div>

                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', textAlign: 'center' }}>
                    {isLoginTab ? '🔑 Selamat Datang Kembali' : '✍️ Buat Akun OrionLib'}
                </h3>

                {errorMsg && (
                    <div style={{ 
                        backgroundColor: '#fee2e2', 
                        color: '#b91c1c', 
                        padding: '8px 12px', 
                        borderRadius: '6px', 
                        fontSize: '0.85rem', 
                        marginBottom: '1rem',
                        border: '1px solid #fca5a5'
                    }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLoginTab && (
                        <div style={inputGroupStyle}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Nama Lengkap</label>
                            <input 
                                type="text"
                                placeholder="Masukkan nama..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                    )}

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Alamat Email</label>
                        <input 
                            type="email"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Kata Sandi</label>
                        <input 
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {!isLoginTab && (
                        <div style={inputGroupStyle}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Hak Akses (Role)</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="member">Member biasa (Read-only)</option>
                                <option value="admin">Admin Perpustakaan (Full CRUD)</option>
                            </select>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={buttonStyle}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#008c94'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#00adb5'}
                    >
                        {loading ? 'Memproses...' : isLoginTab ? 'Masuk' : 'Daftar Sekarang'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;
