import './BookManagement.css';

function BookManagement({ books, isAdmin, onEditClick, onDeleteClick, onAddNew }) {
    // Basic stats calculation (mocked for 'in circulation')
    const totalTitles = books.length;
    const inCirculation = Math.floor(totalTitles * 0.15) || 0; // Just a placeholder

    return (
        <div className="book-mgmt">
            <div className="book-mgmt__header">
                <div>
                    <h1>Book Management</h1>
                    <p>Manage the library's physical and digital collection.</p>
                </div>
                {isAdmin && (
                    <div className="book-mgmt__actions">
                        <button className="bm-btn bm-btn--outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export
                        </button>
                        <button className="bm-btn bm-btn--primary" onClick={onAddNew}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add New Book
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Row */}
            <div className="bm-stats">
                <div className="bm-stat-card">
                    <div className="bm-stat-icon" style={{color: '#6366f1', background: '#e0e7ff'}}>📚</div>
                    <div className="bm-stat-info">
                        <span className="bm-stat-label">Total Titles</span>
                        <span className="bm-stat-value">{totalTitles.toLocaleString()}</span>
                    </div>
                    <div className="bm-stat-trend positive">+2.4%</div>
                </div>
                <div className="bm-stat-card">
                    <div className="bm-stat-icon" style={{color: '#3b82f6', background: '#dbeafe'}}>🔄</div>
                    <div className="bm-stat-info">
                        <span className="bm-stat-label">In Circulation</span>
                        <span className="bm-stat-value">{inCirculation.toLocaleString()}</span>
                    </div>
                    <div className="bm-stat-trend neutral">~0%</div>
                </div>
                <div className="bm-banner-card">
                    <h3>Inventory Health</h3>
                    <p>All academic departments are currently above 95% availability threshold.</p>
                    <a href="#">View Report</a>
                </div>
            </div>

            {/* Table Area */}
            <div className="bm-table-container">
                <div className="bm-table-header">
                    <h2>Inventory List <span className="bm-badge">{books.length} Results</span></h2>
                    <button className="bm-filter-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                    </button>
                </div>
                
                <table className="bm-table">
                    <thead>
                        <tr>
                            <th>Title & ISBN</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Availability</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {books.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 5 : 4} style={{textAlign: 'center', padding: '2rem'}}>No books found in the catalog.</td>
                            </tr>
                        ) : (
                            books.map(book => (
                                <tr key={book.id}>
                                    <td>
                                        <div className="bm-cell-title">
                                            <div className="bm-book-cover">
                                                {book.cover_img ? (
                                                    <img src={`http://localhost:3000${book.cover_img}`} alt={book.title} />
                                                ) : (
                                                    <div className="bm-book-cover-placeholder">📘</div>
                                                )}
                                            </div>
                                            <div>
                                                <strong>{book.title}</strong>
                                                <span>ISBN: {book.isbn || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{book.author}</td>
                                    <td>
                                        <span className="bm-cat-pill">{book.Category?.category_name || 'Uncategorized'}</span>
                                    </td>
                                    <td>
                                        {book.stock > 0 ? (
                                            <span className="bm-status bm-status--available">● Available ({book.stock})</span>
                                        ) : (
                                            <span className="bm-status bm-status--unavailable">● Borrowed</span>
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td>
                                            <div className="bm-action-icons">
                                                <button className="bm-icon-btn edit" onClick={() => onEditClick(book)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                                    </svg>
                                                </button>
                                                <button className="bm-icon-btn delete" onClick={() => onDeleteClick(book.id)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="bm-table-footer">
                    <span>Showing 1 to {books.length} of {books.length} entries.</span>
                    <div className="bm-pagination">
                        <button disabled>Previous</button>
                        <button className="active">1</button>
                        <button disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookManagement;
