import './BookDetails.css';

function BookDetails({ book, books, userLibrary, onBorrowBook, onToggleSave, onBack }) {
    if (!book) return null;

    const currentBook = book;
    const isBorrowed = userLibrary?.borrowed?.some(b => b.book_id === book.id);
    const isSaved = userLibrary?.saved?.some(b => b.book_id === book.id);

    // Dynamic cover URL helper
    const getCoverSrc = (b) => {
        if (!b?.cover_img) return null;
        return b.cover_img.startsWith('http') ? b.cover_img : `http://localhost:3000/uploads/${b.cover_img}`;
    };

    const coverSrc = getCoverSrc(currentBook);

    // Derived properties to match design
    const format = currentBook.id % 2 === 0 ? 'Hardcover' : 'Paperback';
    const pages = (currentBook.id * 37) % 150 + 250;

    // Generated Description to match the professional academic tone
    const description = currentBook.description || 
        `An exhaustive exploration of modern concepts, this seminal work bridges the gap between fundamental research and practical applications. The author proposes a radical new framework for understanding the core principles, supported by years of primary research and case studies. Written in an accessible yet rigorous style, it is an essential resource for students, academics, and professionals.`;

    // Dynamic Similar Books based on same category
    const similarBooks = (books || [])
        .filter(b => b.id !== currentBook.id) // exclude current
        .sort((a, b) => {
            // prioritize same category
            if (a.category_id === currentBook.category_id && b.category_id !== currentBook.category_id) return -1;
            if (a.category_id !== currentBook.category_id && b.category_id === currentBook.category_id) return 1;
            return 0;
        })
        .slice(0, 4); // get top 4

    return (
        <div className="book-details-page">
            <div className="bd-container">
                
                {/* Breadcrumbs */}
                <div className="bd-breadcrumbs">
                    <span className="bd-breadcrumbs__link" onClick={onBack}>Catalog</span>
                    <span className="bd-breadcrumbs__separator">›</span>
                    <span className="bd-breadcrumbs__link">Academic Resources</span>
                    <span className="bd-breadcrumbs__separator">›</span>
                    <span className="bd-breadcrumbs__current">{currentBook.title}</span>
                </div>

                {/* Main Section */}
                <div className="bd-main-layout">
                    
                    {/* Left Side: Book Cover & Quick Meta */}
                    <div className="bd-left-column">
                        <div className="bd-cover-card">
                            {coverSrc ? (
                                <img src={coverSrc} alt={currentBook.title} className="bd-cover-image" />
                            ) : (
                                <div className="bd-cover-placeholder">📘</div>
                            )}
                            <button 
                                className={`bd-cover-save-btn ${isSaved ? 'saved' : ''}`}
                                onClick={() => onToggleSave(currentBook.id, isSaved)}
                                aria-label="Save Book"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                                <span>{isSaved ? "SAVED" : "SAVE"}</span>
                            </button>
                        </div>

                        {/* Format & Pages boxes */}
                        <div className="bd-meta-boxes">
                            <div className="bd-meta-box">
                                <span className="bd-meta-box__label">FORMAT</span>
                                <span className="bd-meta-box__value">{format}</span>
                            </div>
                            <div className="bd-meta-box">
                                <span className="bd-meta-box__label">PAGES</span>
                                <span className="bd-meta-box__value">{pages}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Detailed Info */}
                    <div className="bd-right-column">
                        <div className="bd-tag-rating-row">
                            <span className="bd-badge-new">NEW ARRIVAL</span>
                            <span className="bd-rating">
                                <span className="bd-star">★</span> 4.9 (124 reviews)
                            </span>
                        </div>

                        <h1 className="bd-title">{currentBook.title}</h1>
                        <p className="bd-author-row">
                            By <span className="bd-author-name">{currentBook.author}</span>
                        </p>

                        <div className="bd-specs-row">
                            <div className="bd-spec-pill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <span><strong>ISBN:</strong> {currentBook.isbn || '978-3-16-148410-0'}</span>
                            </div>
                            <div className="bd-spec-pill">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span><strong>Published:</strong> Oct {currentBook.publish_year}</span>
                            </div>
                        </div>

                        <div className="bd-description-section">
                            <h3 className="bd-description-title">Description</h3>
                            <p className="bd-description-text">{description}</p>
                        </div>

                        {/* Status Box */}
                        <div className="bd-status-box">
                            <div className="bd-status-info">
                                <div className={`bd-status-icon-circle ${isBorrowed ? 'borrowed' : currentBook.stock > 0 ? 'available' : 'unavailable'}`}>
                                    {isBorrowed ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                    ) : currentBook.stock > 0 ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    )}
                                </div>
                                <div className="bd-status-text">
                                    <h4 className="bd-status-title">
                                        {isBorrowed ? "Currently Borrowed" : currentBook.stock > 0 ? "Available Now" : "Unavailable / Borrowed"}
                                    </h4>
                                    <p className="bd-status-subtitle">
                                        {isBorrowed 
                                            ? "You have borrowed this book. Enjoy reading!" 
                                            : currentBook.stock > 0 
                                                ? "Located in North Wing, Section B-14" 
                                                : "All copies are currently loaned out."}
                                    </p>
                                </div>
                            </div>

                            <div className="bd-status-actions">
                                {isBorrowed ? (
                                    <button className="bd-action-btn bd-action-btn--borrow return" onClick={() => onBorrowBook(currentBook.id)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9 10 4 15 9 20" />
                                            <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                                        </svg>
                                        <span>Return Book</span>
                                    </button>
                                ) : (
                                    <button 
                                        className="bd-action-btn bd-action-btn--borrow" 
                                        onClick={() => onBorrowBook(currentBook.id)}
                                        disabled={currentBook.stock <= 0}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                        <span>Borrow Book</span>
                                    </button>
                                )}

                                <button 
                                    className={`bd-action-btn bd-action-btn--reserve ${isSaved ? 'reserved' : ''}`}
                                    onClick={() => onToggleSave(currentBook.id, isSaved)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>{isSaved ? "Saved" : "Reserve"}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Similar Titles Section */}
                <div className="bd-similar-section">
                    <div className="bd-similar-header">
                        <h2 className="bd-similar-title-text">Similar Titles</h2>
                        <span className="bd-explore-more-link" onClick={onBack}>Explore More →</span>
                    </div>

                    <div className="bd-similar-grid">
                        {similarBooks.map((simBook) => {
                            const simCover = getCoverSrc(simBook);
                            const simSaved = userLibrary?.saved?.some(b => b.book_id === simBook.id);
                            const simStatusBadge = simBook.stock > 0 ? 'Available' : 'Borrowed';
                            const simBadgeType = simBook.stock > 0 ? 'green' : 'blue';

                            return (
                                <div key={simBook.id} className="bd-sim-card">
                                    <div className="bd-sim-card__cover">
                                        {simCover ? (
                                            <img src={simCover} alt={simBook.title} />
                                        ) : (
                                            <div className="bd-sim-card__placeholder">📘</div>
                                        )}
                                    </div>
                                    <div className="bd-sim-card__info">
                                        <div className="bd-sim-card__category">{simBook.category_name?.toUpperCase() || 'GENERAL'}</div>
                                        <h4 className="bd-sim-card__title">{simBook.title}</h4>
                                        <p className="bd-sim-card__author">{simBook.author}</p>
                                        <div className="bd-sim-card__footer">
                                            <span className={`bd-sim-badge bd-sim-badge--${simBadgeType}`}>{simStatusBadge}</span>
                                            <button 
                                                className={`bd-sim-save-btn ${simSaved ? 'saved' : ''}`}
                                                onClick={() => onToggleSave(simBook.id, simSaved)}
                                                title={simSaved ? "Remove from Saved" : "Save Book"}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill={simSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="16" />
                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BookDetails;
