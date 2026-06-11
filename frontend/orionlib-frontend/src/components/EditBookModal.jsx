import { useState } from 'react';
import api from '../services/api';

function EditBookModal({ isOpen, bookData, onClose, onEditSuccess }) {
    const [title, setTitle] = useState(bookData?.title || '');
    const [author, setAuthor] = useState(bookData?.author || '');
    const [year, setYear] = useState(bookData?.publish_year || bookData?.year || '');
    const [stock, setStock] = useState(bookData?.stock || '0');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen || !bookData) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            const response = await api.put(`/books/${bookData.id}`, {
                title,
                author,
                publish_year: parseInt(year),
                stock: parseInt(stock)
            });

            if (response.data.success) {
                alert(`Sukses! Buku "${title}" berhasil diperbarui.`);
                onEditSuccess();
                onClose();
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Gagal memperbarui data buku ke server.');
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
        width: '420px',
        maxWidth: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative'
    };

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

    const buttonGroupStyle = {
        display: 'flex',
        gap: '10px',
        marginTop: '1.5rem'
    };

    const saveButtonStyle = {
        flex: 1,
        padding: '12px',
        backgroundColor: '#00adb5',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    };

    const cancelButtonStyle = {
        flex: 1,
        padding: '12px',
        backgroundColor: '#e2e8f0',
        color: '#475569',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.95rem',
        cursor: 'pointer',
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
                
                <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✏️ Edit Data Buku
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
                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Judul Buku</label>
                        <input 
                            type="text"
                            placeholder="Masukkan judul buku..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Nama Penulis</label>
                        <input 
                            type="text"
                            placeholder="Masukkan nama penulis..."
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={inputGroupStyle}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Tahun Terbit</label>
                            <input 
                                type="number"
                                placeholder="Contoh: 2024"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Jumlah Stok</label>
                            <input 
                                type="number"
                                placeholder="Contoh: 10"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    <div style={buttonGroupStyle}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            style={cancelButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={saveButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#008c94'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#00adb5'}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBookModal;
