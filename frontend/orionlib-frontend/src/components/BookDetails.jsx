import './BookDetails.css';

const SIMILAR_BOOKS = [
    {
        id: 101,
        title: 'Cognitive Science: Neural Foundations',
        author: 'L. Fitzgerald',
        category: 'COGNITIVE SCIENCE',
        badge: 'Borrowed',
        badgeType: 'blue',
        cover: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&q=80&auto=format&fit=crop',
    },
    {
        id: 102,
        title: 'Ethics & Tech: Algorithmic Ethics',
        author: 'Sarah Chen',
        category: 'ETHICS & TECH',
        badge: 'Available',
        badgeType: 'green',
        cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80&auto=format&fit=crop',
    },
    {
        id: 103,
        title: 'Sociology: Digital Societies',
        author: 'Professor Omar K.',
        category: 'SOCIOLOGY',
        badge: 'Available',
        badgeType: 'green',
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80&auto=format&fit=crop',
    },
    {
        id: 104,
        title: 'Mathematics: Emergent Systems',
        author: 'Dr. Julia Ortiz',
        category: 'MATHEMATICS',
        badge: 'Reference Only',
        badgeType: 'blue',
        cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&q=80&auto=format&fit=crop',
    }
];

function BookDetails({ book, userLibrary, onBorrowBook, onToggleSave, onBack }) {
    if (!book) return null;

    const currentBook = book;
    const isBorrowed = userLibrary?.borrowed?.some(b => b.book_id === book.id);
    const isSaved = userLibrary?.saved?.some(b => b.book_id === book.id);

    return (
        <div className="book-details">
            <div className="book-details__container container">

                {/* Clear Back Button */}
                <div style={{ marginBottom: '1rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#334155'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>⬅️</span> Back to Previous Page
                    </button>
                </div>

                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <button onClick={onBack} className="breadcrumb__link">Catalog</button>
                    <span className="breadcrumb__sep">›</span>
                    <span className="breadcrumb__link">Academic Resources</span>
                    <span className="breadcrumb__sep">›</span>
                    <span className="breadcrumb__current">{currentBook.title}</span>
                </div>

                {/* Main Content */}
                <div className="book-details__main">

                    {/* Left Column - Cover */}
                    <div className="book-details__left">
                        <div className="book-cover-wrapper">
                            <img src={currentBook.cover} alt={currentBook.title} className="book-cover-large" />
                            <div className="badge-save">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                                SAVE
                            </div>
                        </div>
                        <div className="book-meta-boxes">
                            <p className="bd-desc">
                                Buku ini adalah salah satu karya penting dalam literatur modern. Menggabungkan gaya bahasa naratif dengan riset mendalam, penulis mengupas tuntas setiap aspek subjek utama.
                            </p>

                            <div className="bd-actions">
                                {isBorrowed ? (
                                    <button className="bd-btn bd-btn--primary" onClick={() => onBorrowBook(book.id)}>
                                        Return Book
                                    </button>
                                ) : (
                                    <button className="bd-btn bd-btn--primary" onClick={() => onBorrowBook(book.id)}>
                                        Borrow Book
                                    </button>
                                )}
                                <button
                                    className={`bd-btn ${isSaved ? 'bd-btn--primary' : 'bd-btn--outline'}`}
                                    onClick={() => onToggleSave(book.id, isSaved)}
                                >
                                    {isSaved ? 'Saved to List' : 'Reserve / Add to List'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info */}
                    <div className="book-details__right">
                        <div className="book-header-meta">
                            <span className="badge-new">NEW ARRIVAL</span>
                            <span className="rating-text">
                                <span style={{ color: '#3b82f6' }}>★</span> 4.9 (124 reviews)
                            </span>
                        </div>

                        <h1 className="book-title">{currentBook.title}</h1>
                        <p className="book-author">By <strong>{currentBook.author}</strong></p>

                        <div className="book-specs">
                            <div className="spec-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <strong>ISBN:</strong> 978-3-16-148410-0
                            </div>
                            <div className="spec-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <strong>Published:</strong> Oct 2023
                            </div>
                        </div>

                        <div className="book-description">
                            <h3>Description</h3>
                            <p>
                                An exhaustive exploration of modern cognitive architectures, this seminal work bridges the gap
                                between biological neural networks and synthetic computational intelligence. Dr. Vance and
                                Thorne propose a radical new framework for understanding consciousness as an emergent
                                property of structured information flow, supported by five years of primary research at the
                                Institute of Advanced Cognition.
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="action-bar">
                            <div className="action-bar__status">
                                <div className="status-icon">
                                    {isBorrowed ? (
                                        <span style={{ fontSize: '1.2rem' }}>📚</span>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <div className="status-title">{isBorrowed ? "Currently Borrowed" : "Available Now"}</div>
                                    <div className="status-desc">{isBorrowed ? "Enjoy reading!" : "Located in North Wing, Section B-14"}</div>
                                </div>
                            </div>
                            <div className="action-bar__buttons">
                                {isBorrowed ? (
                                    <button className="btn-borrow" onClick={() => onBorrowBook(book.id)} style={{ background: '#10b981' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="9 10 4 15 9 20"></polyline>
                                            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
                                        </svg>
                                        Return Book
                                    </button>
                                ) : (
                                    <button className="btn-borrow" onClick={() => onBorrowBook(book.id)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        </svg>
                                        Borrow Book
                                    </button>
                                )}
                                <button
                                    className="btn-reserve"
                                    onClick={() => onToggleSave(book.id, isSaved)}
                                    style={isSaved ? { background: '#3b82f6', color: 'white', borderColor: '#3b82f6' } : {}}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {isSaved ? "Saved" : "Reserve"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Similar Titles */}
                <div className="similar-section">
                    <div className="similar-header">
                        <h2>Similar Titles</h2>
                        <a href="#" className="explore-more">Explore More →</a>
                    </div>

                    <div className="similar-grid">
                        {SIMILAR_BOOKS.map((b) => (
                            <div key={b.id} className="similar-card">
                                <div className="similar-card__cover">
                                    <img src={b.cover} alt={b.title} />
                                </div>
                                <div className="similar-card__info">
                                    <div className="similar-card__category">{b.category}</div>
                                    <h4 className="similar-card__title">
                                        {b.title.split(':').map((part, i) => (
                                            <span key={i}>
                                                {part}
                                                {i === 0 && b.title.includes(':') && <br />}
                                            </span>
                                        ))}
                                    </h4>
                                    <p className="similar-card__author">{b.author}</p>
                                    <div className="similar-card__footer">
                                        <span className={`badge badge-${b.badgeType}`}>{b.badge}</span>
                                        <button className="add-btn">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BookDetails;
