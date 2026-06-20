import { useState, useEffect } from 'react';
import api from '../services/api';
import './BookManagement.css';

function BookManagement({ isAdmin, loadAllBooks }) {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Search, Filter, Sort, Pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('title-asc');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    // Modals
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState({ open: false, book: null });
    const [bulkModal, setBulkModal] = useState(false);

    // Form inputs
    const [addForm, setAddForm] = useState({
        title: '', author: '', publisher: '', publish_year: new Date().getFullYear(), isbn: '', stock: 0, category_id: ''
    });
    const [editForm, setEditForm] = useState({
        title: '', author: '', publisher: '', publish_year: '', isbn: '', stock: 0, category_id: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [bulkJson, setBulkJson] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch books & categories
    const fetchData = async () => {
        try {
            setLoading(true);
            const [booksRes, catsRes] = await Promise.all([
                api.get('/books'),
                api.get('/categories')
            ]);
            if (booksRes.data.success) setBooks(booksRes.data.data);
            if (catsRes.data.success) setCategories(catsRes.data.data);
        } catch (err) {
            console.error('Error fetching inventory data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Cover image helper
    const getCoverSrc = (b) => {
        if (!b?.cover_img) return null;
        return b.cover_img.startsWith('http') ? b.cover_img : `/uploads/${b.cover_img}`;
    };

    // Delete book
    const handleDelete = async (id, title) => {
        if (!window.confirm(`Apakah Anda yakin ingin menghapus buku "${title}"?`)) return;
        try {
            const res = await api.delete(`/books/${id}`);
            if (res.data.success) {
                alert('Buku berhasil dihapus.');
                fetchData();
                if (loadAllBooks) loadAllBooks();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus buku.');
        }
    };

    // Open Edit modal
    const openEdit = (b) => {
        setEditForm({
            title: b.title,
            author: b.author,
            publisher: b.publisher || '',
            publish_year: b.publish_year || '',
            isbn: b.isbn || '',
            stock: b.stock || 0,
            category_id: b.category_id || ''
        });
        setCoverFile(null);
        setEditModal({ open: true, book: b });
    };

    // Add Book Form Handler
    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!addForm.title.trim() || !addForm.author.trim()) return alert('Judul dan Penulis wajib diisi.');
        setSaving(true);

        const formData = new FormData();
        Object.keys(addForm).forEach(key => {
            formData.append(key, addForm[key]);
        });
        if (coverFile) {
            formData.append('cover_img', coverFile);
        }

        try {
            const res = await api.post('/books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                alert('Buku berhasil ditambahkan.');
                setAddModal(false);
                setAddForm({ title: '', author: '', publisher: '', publish_year: new Date().getFullYear(), isbn: '', stock: 0, category_id: '' });
                setCoverFile(null);
                fetchData();
                if (loadAllBooks) loadAllBooks();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menambahkan buku.');
        } finally {
            setSaving(false);
        }
    };

    // Edit Book Form Handler
    const handleEditBook = async (e) => {
        e.preventDefault();
        if (!editForm.title.trim() || !editForm.author.trim()) return alert('Judul dan Penulis wajib diisi.');
        setSaving(true);

        const formData = new FormData();
        Object.keys(editForm).forEach(key => {
            formData.append(key, editForm[key]);
        });
        if (coverFile) {
            formData.append('cover_img', coverFile);
        }

        try {
            const res = await api.put(`/books/${editModal.book.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                alert('Buku berhasil diperbarui.');
                setEditModal({ open: false, book: null });
                setCoverFile(null);
                fetchData();
                if (loadAllBooks) loadAllBooks();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal memperbarui buku.');
        } finally {
            setSaving(false);
        }
    };

    // Bulk Upload Handler
    const handleBulkUpload = async (e) => {
        e.preventDefault();
        try {
            const parsed = JSON.parse(bulkJson);
            if (!Array.isArray(parsed)) throw new Error('Format input harus berupa array JSON.');
            setSaving(true);
            const res = await api.post('/books/bulk', { books: parsed });
            if (res.data.success) {
                alert(res.data.message || 'Bulk upload berhasil.');
                setBulkModal(false);
                setBulkJson('');
                fetchData();
                if (loadAllBooks) loadAllBooks();
            }
        } catch (err) {
            alert(err.message || err.response?.data?.message || 'Gagal melakukan bulk upload. Periksa format JSON.');
        } finally {
            setSaving(false);
        }
    };

    const loadExampleJson = () => {
        const example = [
            {
                title: "Laskar Pelangi",
                author: "Andrea Hirata",
                publisher: "Bentang Pustaka",
                publish_year: 2005,
                isbn: "979-3062-79-7",
                stock: 5,
                category_id: 1
            },
            {
                title: "Pemrograman Javascript Modern",
                author: "Andrea Hirata",
                publisher: "Informatika",
                publish_year: 2023,
                isbn: "978-602-6232-94-6",
                stock: 3,
                category_id: 2
            }
        ];
        setBulkJson(JSON.stringify(example, null, 2));
    };

    // Filter, Search, Sort & Paginate logic
    const filtered = books.filter(b => {
        const q = searchQuery.toLowerCase();
        const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.toLowerCase().includes(q));
        const matchCategory = categoryFilter === 'all' || String(b.category_id) === String(categoryFilter);
        return matchSearch && matchCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'year-newest') return b.publish_year - a.publish_year;
        if (sortBy === 'year-oldest') return a.publish_year - b.publish_year;
        if (sortBy === 'stock-high') return b.stock - a.stock;
        if (sortBy === 'stock-low') return a.stock - b.stock;
        return 0;
    });

    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const startEntry = sorted.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
    const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, sorted.length);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter, sortBy]);

    // Statistics counts
    const totalTitlesCount = books.length;
    const outOfStockCount = books.filter(b => b.stock === 0).length;

    return (
        <div className="book-mgmt">
            <div className="book-mgmt__header">
                <div>
                    <h1 className="bm-main-title">Book Management</h1>
                    <p className="bm-sub-title">Manage the library's physical and digital collection.</p>
                </div>
                {isAdmin && (
                    <div className="book-mgmt__actions">
                        <button className="bm-btn bm-btn--upload" onClick={() => setBulkModal(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Bulk Upload</span>
                        </button>
                        <button className="bm-btn bm-btn--primary" onClick={() => setAddModal(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Add New Book</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Row */}
            <div className="bm-stats">
                <div className="bm-stat-card">
                    <div className="bm-stat-icon-wrapper blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="7" height="9" />
                            <rect x="14" y="3" width="7" height="5" />
                            <rect x="14" y="12" width="7" height="9" />
                            <rect x="3" y="16" width="7" height="5" />
                        </svg>
                    </div>
                    <div className="bm-stat-info">
                        <span className="bm-stat-label">Total Titles</span>
                        <span className="bm-stat-value">{loading ? '...' : totalTitlesCount.toLocaleString()}</span>
                    </div>
                    <div className="bm-stat-trend positive">+2.4%</div>
                </div>

                <div className="bm-stat-card">
                    <div className="bm-stat-icon-wrapper light-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div className="bm-stat-info">
                        <span className="bm-stat-label">Out of Stock</span>
                        <span className="bm-stat-value">{loading ? '...' : outOfStockCount.toLocaleString()}</span>
                    </div>
                    <div className="bm-stat-trend percent">Health: OK</div>
                </div>

                <div className="bm-banner-card">
                    <div className="bm-banner-content">
                        <h3>Inventory Health</h3>
                        <p>All academic departments are currently above 85% availability threshold.</p>
                        <span className="bm-banner-link" onClick={() => alert('Viewing inventory health report...')}>View Report</span>
                    </div>
                    <div className="bm-banner-bg-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="bm-filters-row">
                <div className="bm-search-wrapper">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input 
                        type="text" 
                        placeholder="Search by title, author, ISBN..." 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        className="bm-search-input"
                    />
                </div>
                <div className="bm-filter-dropdowns">
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bm-filter-select">
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                        ))}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bm-filter-select">
                        <option value="title-asc">Title: A-Z</option>
                        <option value="title-desc">Title: Z-A</option>
                        <option value="year-newest">Year: Newest</option>
                        <option value="year-oldest">Year: Oldest</option>
                        <option value="stock-high">Stock: High to Low</option>
                        <option value="stock-low">Stock: Low to High</option>
                    </select>
                </div>
            </div>

            {/* Table Area */}
            <div className="bm-table-container">
                <div className="bm-table-header">
                    <div className="bm-table-title-group">
                        <h2>Inventory List</h2>
                        <span className="bm-results-badge">{sorted.length} Results</span>
                    </div>
                </div>
                
                <table className="bm-table">
                    <thead>
                        <tr>
                            <th>Title & ISBN</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Availability</th>
                            {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                                    <div className="bm-loading-spinner"></div> Loading Catalog...
                                </td>
                            </tr>
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                                    No books found in the catalog.
                                </td>
                            </tr>
                        ) : (
                            paginated.map(book => {
                                const coverSrc = getCoverSrc(book);
                                const isAvailable = book.stock > 0;
                                const statusText = isAvailable ? 'Available' : 'Out of Stock';
                                const statusClass = isAvailable ? 'available' : 'borrowed';

                                return (
                                    <tr key={book.id}>
                                        <td>
                                            <div className="bm-cell-title">
                                                <div className="bm-book-cover">
                                                    {coverSrc ? (
                                                        <img src={coverSrc} alt={book.title} />
                                                    ) : (
                                                        <div className="bm-book-cover-placeholder">📘</div>
                                                    )}
                                                </div>
                                                <div className="bm-title-isbn">
                                                    <span className="bm-book-title">{book.title}</span>
                                                    <span className="bm-book-isbn">ISBN: {book.isbn || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bm-author-cell">{book.author}</td>
                                        <td>
                                            <span className="bm-cat-badge">{book.category_name || 'General'}</span>
                                        </td>
                                        <td>
                                            <span className={`bm-status-badge ${statusClass}`}>
                                                <span className="bm-status-dot"></span>
                                                <span>{statusText} ({book.stock} left)</span>
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <div className="bm-action-icons">
                                                    <button className="bm-icon-btn edit" onClick={() => openEdit(book)} title="Edit Book">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button className="bm-icon-btn delete" onClick={() => handleDelete(book.id, book.title)} title="Delete Book">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            <line x1="10" y1="11" x2="10" y2="17" />
                                                            <line x1="14" y1="11" x2="14" y2="17" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {!loading && sorted.length > 0 && (
                    <div className="bm-table-footer">
                        <span className="bm-entries-text">Showing {startEntry} to {endEntry} of {sorted.length} entries</span>
                        <div className="bm-pagination">
                            <button className="bm-paginate-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i + 1} className={`bm-paginate-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            ))}
                            <button className="bm-paginate-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ ADD BOOK MODAL ═══ */}
            {addModal && (
                <div className="bm-modal-overlay" onClick={() => setAddModal(false)}>
                    <div className="bm-modal" onClick={e => e.stopPropagation()}>
                        <div className="bm-modal__header">
                            <h3>Add New Book</h3>
                            <button className="bm-modal__close" onClick={() => setAddModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleAddBook}>
                            <div className="bm-modal__body">
                                <label className="bm-form-label">Book Title *
                                    <input className="bm-form-input" required placeholder="e.g. Clean Code" value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} />
                                </label>
                                <label className="bm-form-label">Author Name *
                                    <input className="bm-form-input" required placeholder="e.g. Robert C. Martin" value={addForm.author} onChange={e => setAddForm({ ...addForm, author: e.target.value })} />
                                </label>
                                <div className="bm-form-row">
                                    <label className="bm-form-label">Publisher
                                        <input className="bm-form-input" placeholder="e.g. Prentice Hall" value={addForm.publisher} onChange={e => setAddForm({ ...addForm, publisher: e.target.value })} />
                                    </label>
                                    <label className="bm-form-label">Publish Year *
                                        <input className="bm-form-input" type="number" required placeholder="e.g. 2008" value={addForm.publish_year} onChange={e => setAddForm({ ...addForm, publish_year: e.target.value })} />
                                    </label>
                                </div>
                                <div className="bm-form-row">
                                    <label className="bm-form-label">ISBN
                                        <input className="bm-form-input" placeholder="e.g. 978-0132350884" value={addForm.isbn} onChange={e => setAddForm({ ...addForm, isbn: e.target.value })} />
                                    </label>
                                    <label className="bm-form-label">Stock *
                                        <input className="bm-form-input" type="number" required min="0" placeholder="e.g. 10" value={addForm.stock} onChange={e => setAddForm({ ...addForm, stock: e.target.value })} />
                                    </label>
                                </div>
                                <label className="bm-form-label">Category *
                                    <select className="bm-form-input" required value={addForm.category_id} onChange={e => setAddForm({ ...addForm, category_id: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="bm-form-label">Cover Image File
                                    <input className="bm-form-input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />
                                </label>
                            </div>
                            <div className="bm-modal__footer">
                                <button type="button" className="bm-btn bm-btn--upload" onClick={() => setAddModal(false)}>Cancel</button>
                                <button type="submit" className="bm-btn bm-btn--primary" disabled={saving}>{saving ? 'Adding...' : 'Add Book'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══ EDIT BOOK MODAL ═══ */}
            {editModal.open && (
                <div className="bm-modal-overlay" onClick={() => setEditModal({ open: false, book: null })}>
                    <div className="bm-modal" onClick={e => e.stopPropagation()}>
                        <div className="bm-modal__header">
                            <h3>Edit Book</h3>
                            <button className="bm-modal__close" onClick={() => setEditModal({ open: false, book: null })}>✕</button>
                        </div>
                        <form onSubmit={handleEditBook}>
                            <div className="bm-modal__body">
                                <label className="bm-form-label">Book Title *
                                    <input className="bm-form-input" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                </label>
                                <label className="bm-form-label">Author Name *
                                    <input className="bm-form-input" required value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} />
                                </label>
                                <div className="bm-form-row">
                                    <label className="bm-form-label">Publisher
                                        <input className="bm-form-input" value={editForm.publisher} onChange={e => setEditForm({ ...editForm, publisher: e.target.value })} />
                                    </label>
                                    <label className="bm-form-label">Publish Year *
                                        <input className="bm-form-input" type="number" required value={editForm.publish_year} onChange={e => setEditForm({ ...editForm, publish_year: e.target.value })} />
                                    </label>
                                </div>
                                <div className="bm-form-row">
                                    <label className="bm-form-label">ISBN
                                        <input className="bm-form-input" value={editForm.isbn} onChange={e => setEditForm({ ...editForm, isbn: e.target.value })} />
                                    </label>
                                    <label className="bm-form-label">Stock *
                                        <input className="bm-form-input" type="number" required min="0" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />
                                    </label>
                                </div>
                                <label className="bm-form-label">Category *
                                    <select className="bm-form-input" required value={editForm.category_id} onChange={e => setEditForm({ ...editForm, category_id: e.target.value })}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="bm-form-label">Replace Cover Image File
                                    <input className="bm-form-input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />
                                </label>
                            </div>
                            <div className="bm-modal__footer">
                                <button type="button" className="bm-btn bm-btn--upload" onClick={() => setEditModal({ open: false, book: null })}>Cancel</button>
                                <button type="submit" className="bm-btn bm-btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══ BULK UPLOAD MODAL ═══ */}
            {bulkModal && (
                <div className="bm-modal-overlay" onClick={() => setBulkModal(false)}>
                    <div className="bm-modal bm-modal--wide" onClick={e => e.stopPropagation()}>
                        <div className="bm-modal__header">
                            <h3>Bulk Book Upload</h3>
                            <button className="bm-modal__close" onClick={() => setBulkModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleBulkUpload}>
                            <div className="bm-modal__body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Masukkan data buku dalam format JSON Array.</span>
                                    <button type="button" className="bm-btn bm-btn--upload" style={{ padding: '6px 12px' }} onClick={loadExampleJson}>Load Example Template</button>
                                </div>
                                <textarea 
                                    className="bm-form-textarea" 
                                    required 
                                    rows="10" 
                                    placeholder='[\n  {\n    "title": "Clean Code",\n    "author": "Robert C. Martin",\n    "publish_year": 2008,\n    "stock": 10,\n    "category_id": 2\n  }\n]'
                                    value={bulkJson}
                                    onChange={e => setBulkJson(e.target.value)}
                                />
                            </div>
                            <div className="bm-modal__footer">
                                <button type="button" className="bm-btn bm-btn--upload" onClick={() => setBulkModal(false)}>Cancel</button>
                                <button type="submit" className="bm-btn bm-btn--primary" disabled={saving}>{saving ? 'Uploading...' : 'Upload Data'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookManagement;
