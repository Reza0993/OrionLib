import './UserLibrary.css';

function UserLibrary({ library, onReturnBook, onUnsaveBook, onBrowseBooks }) {
    const { borrowed = [], saved = [] } = library || {};

    return (
        <div className="ul-layout">
            <div className="ul-header">
                <div>
                    <h1>My Library</h1>
                    <p>Track your active loans and saved books</p>
                </div>
            </div>

            {/* Active Loans */}
            <section className="ul-section">
                <div className="ul-section-header">
                    <h2>
                        <span className="ul-icon-bg" style={{background: '#dbeafe', color: '#3b82f6'}}>📚</span> 
                        Currently Borrowed ({borrowed.length})
                    </h2>
                </div>
                
                {borrowed.length === 0 ? (
                    <div className="ul-empty-state">
                        <div className="ul-empty-icon">📖</div>
                        <h3>No Active Loans</h3>
                        <p>You haven't borrowed any books yet. Explore the catalog to find your next read.</p>
                        <button className="ul-btn ul-btn--primary" onClick={onBrowseBooks}>Explore Catalog</button>
                    </div>
                ) : (
                    <div className="ul-grid">
                        {borrowed.map(book => (
                            <div key={book.id} className="ul-card">
                                <div className="ul-card-cover">
                                    {book.cover_img ? (
                                        <img 
                                            src={book.cover_img.startsWith('http') ? book.cover_img : `/uploads/${img}`} 
                                            alt={book.title} 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="ul-placeholder-cover">📘</div>
                                    )}
                                </div>
                                <div className="ul-card-info">
                                    <div className="ul-cat">{book.category_name || 'Uncategorized'}</div>
                                    <h4>{book.title}</h4>
                                    <p>{book.author}</p>
                                    <div className="ul-loan-meta">
                                        <div className="ul-meta-item">
                                            <span>Borrowed On</span>
                                            <strong>{new Date(book.borrow_date).toLocaleDateString()}</strong>
                                        </div>
                                    </div>
                                     {book.status === 'pending' ? (
                                         <button 
                                             className="ul-btn ul-btn--outline" 
                                             style={{ borderColor: '#d97706', color: '#d97706', cursor: 'default', opacity: 0.8 }}
                                             disabled
                                         >
                                             Awaiting Approval
                                         </button>
                                     ) : (
                                         <button 
                                             className="ul-btn ul-btn--outline" 
                                             onClick={() => onReturnBook(book.book_id)}
                                         >
                                             Return Book
                                         </button>
                                     )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Saved Books / Wishlist */}
            <section className="ul-section" style={{marginTop: '2rem'}}>
                <div className="ul-section-header">
                    <h2>
                        <span className="ul-icon-bg" style={{background: '#fee2e2', color: '#ef4444'}}>❤️</span> 
                        My Saved Books ({saved.length})
                    </h2>
                </div>
                
                {saved.length === 0 ? (
                    <div className="ul-empty-state ul-empty-state--small">
                        <p>Your wishlist is empty. Click the "Reserve/Save" button on any book to add it here.</p>
                    </div>
                ) : (
                    <div className="ul-grid">
                        {saved.map(book => (
                            <div key={book.saved_id} className="ul-card">
                                <div className="ul-card-cover">
                                    {book.cover_img ? (
                                        <img 
                                            src={book.cover_img.startsWith('http') ? book.cover_img : `/uploads/${img}`} 
                                            alt={book.title} 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="ul-placeholder-cover">📘</div>
                                    )}
                                </div>
                                <div className="ul-card-info">
                                    <div className="ul-cat">{book.category_name || 'Uncategorized'}</div>
                                    <h4>{book.title}</h4>
                                    <p>{book.author}</p>
                                    <div className="ul-card-actions" style={{marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '8px'}}>
                                        <button 
                                            className="ul-btn ul-btn--ghost" 
                                            onClick={() => onUnsaveBook(book.id)}
                                            title="Remove from saved"
                                            style={{padding: '8px', color: '#ef4444'}}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                        </button>
                                        <button className="ul-btn ul-btn--primary" style={{flex: 1}} onClick={() => onBrowseBooks()}>View Details</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default UserLibrary;
