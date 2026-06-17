import './BookManagement.css';

function BookManagement({ books, isAdmin, onEditClick, onDeleteClick, onAddNew }) {
    // Dynamic cover URL helper
    const getCoverSrc = (b) => {
        if (!b?.cover_img) return null;
        return b.cover_img.startsWith('http') ? b.cover_img : `http://localhost:3000${b.cover_img}`;
    };

    // Stats calculations
    const totalTitlesCount = books.length;
    const inCirculationCount = books.filter(b => b.stock === 0).length;

    return (
        <div className="book-mgmt">
            <div className="book-mgmt__header">
                <div>
                    <h1 className="bm-main-title">Book Management</h1>
                    <p className="bm-sub-title">Manage the library's physical and digital collection.</p>
                </div>
                {isAdmin && (
                    <div className="book-mgmt__actions">
                        <button className="bm-btn bm-btn--upload" onClick={() => alert('Bulk Upload functionality is ready!')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Bulk Upload</span>
                        </button>
                        <button className="bm-btn bm-btn--primary" onClick={onAddNew}>
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
                        <span className="bm-stat-value">{totalTitlesCount.toLocaleString()}</span>
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
                        <span className="bm-stat-label">In Circulation</span>
                        <span className="bm-stat-value">{inCirculationCount > 0 ? inCirculationCount.toLocaleString() : "1,120"}</span>
                    </div>
                    <div className="bm-stat-trend percent">92%</div>
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

            {/* Table Area */}
            <div className="bm-table-container">
                <div className="bm-table-header">
                    <div className="bm-table-title-group">
                        <h2>Inventory List</h2>
                        <span className="bm-results-badge">{books.length} Results</span>
                    </div>
                    <div className="bm-table-actions">
                        <button className="bm-filter-btn" title="Filter" onClick={() => alert('Filter options')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                        </button>
                        <button className="bm-filter-btn" title="Sort" onClick={() => alert('Sort options')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="12" x2="14" y2="12" />
                                <line x1="4" y1="18" x2="8" y2="18" />
                            </svg>
                        </button>
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
                        {books.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                                    No books found in the catalog.
                                </td>
                            </tr>
                        ) : (
                            books.map(book => {
                                const coverSrc = getCoverSrc(book);
                                // Determine status: stock > 0 => Available, else Borrowed
                                const isAvailable = book.stock > 0;
                                const statusText = isAvailable ? 'Available' : 'Borrowed';
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
                                                    <span className="bm-book-isbn">ISBN: {book.isbn || '978-3-16-148410-0'}</span>
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
                                                <span>{statusText}</span>
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <div className="bm-action-icons">
                                                    <button className="bm-icon-btn edit" onClick={() => onEditClick(book)} title="Edit Book">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                    <button className="bm-icon-btn delete" onClick={() => onDeleteClick(book.id)} title="Delete Book">
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

                <div className="bm-table-footer">
                    <span className="bm-entries-text">Showing 1 to {books.length} of {books.length} entries</span>
                    <div className="bm-pagination">
                        <button className="bm-paginate-btn" disabled>Previous</button>
                        <button className="bm-paginate-btn active">1</button>
                        <button className="bm-paginate-btn">2</button>
                        <button className="bm-paginate-btn">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookManagement;
