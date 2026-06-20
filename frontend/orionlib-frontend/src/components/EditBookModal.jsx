import { useState, useEffect } from 'react';
import api from '../services/api';

function EditBookModal({ isOpen, bookData, onClose, onEditSuccess }) {
    const [form, setForm] = useState({
        title: '',
        author: '',
        publisher: '',
        publish_year: new Date().getFullYear(),
        isbn: '',
        stock: 0,
        category_id: ''
    });
    const [categories, setCategories] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isEditMode = !!bookData;

    useEffect(() => {
        if (bookData) {
            setForm({
                title: bookData.title || '',
                author: bookData.author || '',
                publisher: bookData.publisher || '',
                publish_year: bookData.publish_year || '',
                isbn: bookData.isbn || '',
                stock: bookData.stock || 0,
                category_id: bookData.category_id || ''
            });
        } else {
            setForm({
                title: '',
                author: '',
                publisher: '',
                publish_year: new Date().getFullYear(),
                isbn: '',
                stock: 0,
                category_id: ''
            });
        }
        setCoverFile(null);
        setErrorMsg('');
    }, [bookData, isOpen]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                if (res.data.success) setCategories(res.data.data);
            } catch (err) {
                console.error('Gagal memuat kategori:', err);
            }
        };
        if (isOpen) fetchCategories();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });
        if (coverFile) {
            formData.append('cover_img', coverFile);
        }

        try {
            let response;
            if (isEditMode) {
                response = await api.put(`/books/${bookData.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                response = await api.post('/books', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            if (response.data.success) {
                alert(isEditMode
                    ? `Sukses! Buku "${form.title}" berhasil diperbarui.`
                    : `Sukses! Buku "${form.title}" berhasil ditambahkan.`
                );
                onEditSuccess();
                onClose();
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || (isEditMode ? 'Gagal memperbarui data buku.' : 'Gagal menambahkan buku baru.'));
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
        width: '480px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
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
                    {isEditMode ? '✏️ Edit Data Buku' : '📚 Tambah Buku Baru'}
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
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Judul Buku *</label>
                        <input 
                            type="text"
                            name="title"
                            placeholder="Masukkan judul buku..."
                            value={form.title}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Nama Penulis *</label>
                        <input 
                            type="text"
                            name="author"
                            placeholder="Masukkan nama penulis..."
                            value={form.author}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Penerbit</label>
                        <input 
                            type="text"
                            name="publisher"
                            placeholder="Masukkan nama penerbit..."
                            value={form.publisher}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={inputGroupStyle}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Tahun Terbit *</label>
                            <input 
                                type="number"
                                name="publish_year"
                                placeholder="Contoh: 2024"
                                value={form.publish_year}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Jumlah Stok *</label>
                            <input 
                                type="number"
                                name="stock"
                                placeholder="Contoh: 10"
                                min="0"
                                value={form.stock}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ISBN</label>
                        <input 
                            type="text"
                            name="isbn"
                            placeholder="Contoh: 978-0132350884"
                            value={form.isbn}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Kategori *</label>
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Cover Image</label>
                        <input 
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={(e) => setCoverFile(e.target.files[0])}
                            style={inputStyle}
                        />
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
                            {loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Buku')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBookModal;
