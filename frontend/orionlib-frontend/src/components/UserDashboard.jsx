import { useState } from 'react';
import BookManagement from './BookManagement';
import EResources from './EResources';
import UserLibrary from './UserLibrary';
import Settings from './Settings';
import LoanHistory from './LoanHistory';
import './UserDashboard.css';

const TOPIC_TABS = ['All Topics', 'Technology', 'Science', 'Business', 'History', 'Literature', 'Religion'];

function UserDashboard({ user, onLogout, books, loading, isAdmin, userLibrary, onEditClick, onDeleteClick, onAddNew, onBorrowBook, onReturnBook, onToggleSave, onBookClick, onGoHome, onUpdateUser }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('All Topics');
    const [searchQuery, setSearchQuery] = useState('');

    const NAV_ITEMS = [
        { 
            key: 'dashboard', 
            label: 'Dashboard', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                </svg>
            )
        },
        { 
            key: 'mybooks', 
            label: 'My Books', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            )
        },
        { 
            key: 'eresources', 
            label: 'E-Resources', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
            )
        },
        { 
            key: 'history', 
            label: 'History', 
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            )
        },
    ];

    const getCoverSrc = (book) => {
        if (!book?.cover_img) return null;
        return book.cover_img.startsWith('http') ? book.cover_img : `/uploads/${img}`;
    };

    const checkBorrowed = (book) => userLibrary?.borrowed?.some(b => b.book_id === book.id);
    const checkSaved = (book) => userLibrary?.saved?.some(b => b.book_id === book.id);

    const allBooks = books || [];
    const recommendedBooks = allBooks.slice(3, 7);
    const featuredBook = allBooks.length > 7 ? allBooks[7] : null;
    const smallFeaturedBook = allBooks.length > 8 ? allBooks[8] : null;
    const miniArrivalBooks = allBooks.slice(9, 11);
    const popularBooks = allBooks.slice(11, 19);

    const isFiltered = activeTab !== 'All Topics' || searchQuery.trim() !== '';

    const filteredBooksList = allBooks.filter((book) => {
        const matchesCategory = activeTab === 'All Topics' ||
            book.category_name?.toLowerCase() === activeTab.toLowerCase();
        const matchesSearch = !searchQuery.trim() ||
            book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="ud-layout">
            {/* ══════════ Sidebar ══════════ */}
            <aside className="ud-sidebar">
                <div className="ud-sidebar__top">
                    <div className="ud-sidebar__logo" onClick={onGoHome} style={{ cursor: 'pointer' }} title="Back to Homepage">
                        <div className="ud-sidebar__logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                            </svg>
                        </div>
                        <div>
                            <div className="ud-sidebar__logo-name">Orionlib</div>
                            <div className="ud-sidebar__logo-sub">Academic Portal</div>
                        </div>
                    </div>
                    <nav className="ud-sidebar__nav">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.key}
                                className={`ud-sidebar__nav-item ${activeNav === item.key ? 'active' : ''}`}
                                onClick={() => setActiveNav(item.key)}
                                id={`nav-${item.key}`}
                            >
                                <span className="ud-sidebar__nav-icon">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="ud-sidebar__bottom">
                    <button className="ud-sidebar__recent-btn" onClick={() => alert('Renew Books functionality is ready!')}>
                        Renew Books
                    </button>
                    <button className={`ud-sidebar__util-btn ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => setActiveNav('settings')}>
                        <span className="ud-sidebar__nav-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </span>
                        <span>Settings</span>
                    </button>
                    <button className="ud-sidebar__util-btn ud-sidebar__util-btn--logout" onClick={onLogout}>
                        <span className="ud-sidebar__nav-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ══════════ Main ══════════ */}
            <main className="ud-main">
                {/* Topbar */}
                <div className="ud-topbar">
                    <div className="ud-topbar__search">
                        <span className="ud-topbar__search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder={activeNav === 'history' ? 'Search catalog or history...' : 'Search for books, authors, or ISBN...'}
                            className="ud-topbar__search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="ud-topbar__actions">
                        <button className="ud-topbar__icon-btn">🔔</button>
                        <button className="ud-topbar__icon-btn">❓</button>
                        <div className="ud-topbar__avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                    </div>
                </div>

                {/* ── View Router ── */}
                {activeNav === 'mybooks' ? (
                    <div className="ud-content">
                        {isAdmin ? (
                            <BookManagement
                                books={allBooks}
                                isAdmin={isAdmin}
                                onEditClick={onEditClick}
                                onDeleteClick={onDeleteClick}
                                onAddNew={onAddNew}
                            />
                        ) : (
                            <UserLibrary
                                library={userLibrary}
                                onReturnBook={onReturnBook}
                                onUnsaveBook={(id) => onToggleSave(id, true)}
                                onBrowseBooks={() => setActiveNav('dashboard')}
                            />
                        )}
                    </div>
                ) : activeNav === 'eresources' ? (
                    <div className="ud-content" style={{ background: '#f8fafc' }}>
                        <EResources searchQuery={searchQuery} />
                    </div>
                ) : activeNav === 'history' ? (
                    <div className="ud-content" style={{ background: '#f8fafc' }}>
                        <LoanHistory
                            library={userLibrary}
                            onReturnBook={onReturnBook}
                            searchQuery={searchQuery}
                        />
                    </div>
                ) : activeNav === 'settings' ? (
                    <div className="ud-content">
                        <Settings user={user} onUpdateUser={onUpdateUser} />
                    </div>
                ) : (
                    <>
                        {/* Topic Tabs */}
                        <div className="ud-tabs">
                            {TOPIC_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    className={`ud-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                    id={`tab-${tab.toLowerCase().replace(' ', '-')}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {isFiltered ? (
                            <div className="ud-content">
                                <section className="ud-section">
                                    <div className="ud-section__header">
                                        <h2>{searchQuery ? `Search Results for "${searchQuery}"` : `${activeTab} Books`}</h2>
                                        <span className="ud-results-count" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                            {filteredBooksList.length} books found
                                        </span>
                                    </div>
                                    {filteredBooksList.length > 0 ? (
                                        <div className="ud-book-grid">
                                            {filteredBooksList.map((book) => {
                                                const coverSrc = getCoverSrc(book);
                                                const borrowed = checkBorrowed(book);
                                                return (
                                                    <div key={book.id} className="ud-book-card">
                                                        <div className="ud-book-card__cover" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                            {coverSrc ? (
                                                                <img src={coverSrc} alt={book.title} />
                                                            ) : (
                                                                <div className="ud-book-card__placeholder">📘</div>
                                                            )}
                                                            {book.stock > 0
                                                                ? <span className="ud-book-card__badge badge badge-green">AVAILABLE</span>
                                                                : <span className="ud-book-card__badge badge badge-orange">BORROWED</span>
                                                            }
                                                        </div>
                                                        <div className="ud-book-card__info" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                            <div className="ud-book-card__cat">{book.category_name || 'GENERAL'}</div>
                                                            <h4 className="ud-book-card__title">{book.title}</h4>
                                                            <p className="ud-book-card__author">{book.author}</p>
                                                        </div>
                                                        <div className="ud-book-card__actions">
                                                            <button className="ud-btn ud-btn--outline ud-btn--sm" onClick={() => onBookClick(book)}>Details</button>
                                                            {borrowed ? (
                                                                <button className="ud-btn ud-btn--return ud-btn--sm" onClick={() => onReturnBook(book.id)}>Return</button>
                                                            ) : (
                                                                book.stock > 0 ? (
                                                                    <button className="ud-btn ud-btn--borrow ud-btn--sm" onClick={() => onBorrowBook(book.id)}>Borrow</button>
                                                                ) : (
                                                                    <button className="ud-btn ud-btn--waitlist ud-btn--sm" disabled>Waitlist</button>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="ud-no-results" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📚</span>
                                            <h3>No books found</h3>
                                            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>Try using different keywords or resetting filters.</p>
                                        </div>
                                    )}
                                </section>
                            </div>
                        ) : (
                            <div className="ud-content">
                                {/* ═══════════════════════════════
                                    SECTION 1: Recommended for You 
                                   ═══════════════════════════════ */}
                                <section className="ud-section">
                                    <div className="ud-section__header">
                                        <h2>Recommended for You</h2>
                                        <a href="#" className="ud-view-all" onClick={(e) => { e.preventDefault(); setActiveTab('Technology'); }}>View All &gt;</a>
                                    </div>
                                    <div className="ud-book-grid">
                                        {recommendedBooks.map((book) => {
                                            const coverSrc = getCoverSrc(book);
                                            const borrowed = checkBorrowed(book);
                                            return (
                                                <div key={book.id} className="ud-book-card">
                                                    <div className="ud-book-card__cover" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                        {coverSrc ? (
                                                            <img src={coverSrc} alt={book.title} />
                                                        ) : (
                                                            <div className="ud-book-card__placeholder">📘</div>
                                                        )}
                                                        {book.stock > 0
                                                            ? <span className="ud-book-card__badge badge badge-green">AVAILABLE</span>
                                                            : <span className="ud-book-card__badge badge badge-orange">BORROWED</span>
                                                        }
                                                    </div>
                                                    <div className="ud-book-card__info" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                        <div className="ud-book-card__cat">{book.category_name || 'GENERAL'}</div>
                                                        <h4 className="ud-book-card__title">{book.title}</h4>
                                                        <p className="ud-book-card__author">{book.author}</p>
                                                    </div>
                                                    <div className="ud-book-card__actions">
                                                        <button className="ud-btn ud-btn--outline ud-btn--sm" onClick={() => onBookClick(book)}>Details</button>
                                                        {borrowed ? (
                                                            <button className="ud-btn ud-btn--return ud-btn--sm" onClick={() => onReturnBook(book.id)}>Return</button>
                                                        ) : (
                                                            book.stock > 0 ? (
                                                                <button className="ud-btn ud-btn--borrow ud-btn--sm" onClick={() => onBorrowBook(book.id)}>Borrow</button>
                                                            ) : (
                                                                <button className="ud-btn ud-btn--borrow ud-btn--sm" onClick={() => onBorrowBook(book.id)}>Borrow</button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>

                                {/* ═══════════════════════════════
                                    SECTION 2: New Arrivals
                                   ═══════════════════════════════ */}
                                <section className="ud-section">
                                    <div className="ud-section__header"><h2>New Arrivals</h2></div>
                                    <div className="ud-new-arrivals">
                                        {/* LEFT: Large featured card */}
                                        {featuredBook && (() => {
                                            const fCover = getCoverSrc(featuredBook);
                                            const fBorrowed = checkBorrowed(featuredBook);
                                            const fSaved = checkSaved(featuredBook);
                                            return (
                                                <div className="ud-featured-card">
                                                    <div className="ud-featured-card__body">
                                                        <span className="ud-featured-badge">JUST ADDED</span>
                                                        <h3>{featuredBook.title}</h3>
                                                        <p className="ud-featured-desc">
                                                            The definitive text on AI, updated with new chapters on neural networks and deep learning architectures.
                                                        </p>
                                                        <div className="ud-featured-btns">
                                                            <button className="ud-btn ud-btn--white" onClick={() => onBookClick(featuredBook)}>Explore This Book</button>
                                                            <button
                                                                className={`ud-btn ${fSaved ? 'ud-btn--saved' : 'ud-btn--outline-light'}`}
                                                                onClick={() => onToggleSave(featuredBook.id, fSaved)}
                                                            >
                                                                {fSaved ? '✓ Saved' : 'Add to List'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="ud-featured-card__cover-wrapper">
                                                        {fCover && <img className="ud-featured-card__cover" src={fCover} alt={featuredBook.title} />}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* RIGHT: Small featured + Mini cards */}
                                        <div className="ud-arrivals-right">
                                            {/* Small featured card (top) - styled horizontally now */}
                                            {smallFeaturedBook && (() => {
                                                const sCover = getCoverSrc(smallFeaturedBook);
                                                const sBorrowed = checkBorrowed(smallFeaturedBook);
                                                return (
                                                    <div className="ud-horizontal-card" onClick={() => onBookClick(smallFeaturedBook)}>
                                                        <div className="ud-horizontal-card__cover">
                                                            {sCover ? (
                                                                <img src={sCover} alt={smallFeaturedBook.title} />
                                                            ) : (
                                                                <div className="ud-book-card__placeholder">📘</div>
                                                            )}
                                                        </div>
                                                        <div className="ud-horizontal-card__body">
                                                            <div className="ud-horizontal-card__cat">{smallFeaturedBook.category_name}</div>
                                                            <h4>{smallFeaturedBook.title}</h4>
                                                            <p className="ud-horizontal-card__author">{smallFeaturedBook.author}</p>
                                                            {sBorrowed ? (
                                                                <button className="ud-horizontal-card__link ud-horizontal-card__link--return" onClick={(e) => { e.stopPropagation(); onReturnBook(smallFeaturedBook.id); }}>Return Now</button>
                                                            ) : (
                                                                <button className="ud-horizontal-card__link" onClick={(e) => { e.stopPropagation(); onBorrowBook(smallFeaturedBook.id); }}>Borrow Now</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Mini cards row (bottom — side by side) */}
                                            <div className="ud-mini-row">
                                                {miniArrivalBooks.map((b) => {
                                                    const bCover = getCoverSrc(b);
                                                    const bBorrowed = checkBorrowed(b);
                                                    return (
                                                        <div key={b.id} className="ud-horizontal-card ud-horizontal-card--mini" onClick={() => onBookClick(b)}>
                                                            <div className="ud-horizontal-card__cover">
                                                                {bCover ? (
                                                                    <img src={bCover} alt={b.title} />
                                                                ) : (
                                                                    <div className="ud-book-card__placeholder">📘</div>
                                                                )}
                                                            </div>
                                                            <div className="ud-horizontal-card__body">
                                                                <div className="ud-horizontal-card__cat">{b.category_name}</div>
                                                                <h4>{b.title}</h4>
                                                                <p className="ud-horizontal-card__author">{b.author}</p>
                                                                {bBorrowed ? (
                                                                    <button className="ud-horizontal-card__link ud-horizontal-card__link--return" onClick={(e) => { e.stopPropagation(); onReturnBook(b.id); }}>Return Now</button>
                                                                ) : (
                                                                    <button className="ud-horizontal-card__link" onClick={(e) => { e.stopPropagation(); onBorrowBook(b.id); }}>Borrow Now</button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* ═══════════════════════════════
                                    SECTION 3: Popular Books
                                   ═══════════════════════════════ */}
                                <section className="ud-section">
                                    <div className="ud-section__header"><h2>Popular Books</h2></div>
                                    <div className="ud-popular-grid">
                                        {popularBooks.map((book) => {
                                            const coverSrc = getCoverSrc(book);
                                            const borrowed = checkBorrowed(book);
                                            return (
                                                <div key={book.id} className="ud-book-card">
                                                    <div className="ud-book-card__cover" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                        {coverSrc ? (
                                                            <img src={coverSrc} alt={book.title} />
                                                        ) : (
                                                            <div className="ud-book-card__placeholder">📘</div>
                                                        )}
                                                        {book.stock > 0
                                                            ? <span className="ud-book-card__badge badge badge-green">AVAILABLE</span>
                                                            : <span className="ud-book-card__badge badge badge-orange">BORROWED</span>
                                                        }
                                                    </div>
                                                    <div className="ud-book-card__info" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                        <div className="ud-book-card__cat">{book.category_name || 'GENERAL'}</div>
                                                        <h4 className="ud-book-card__title">{book.title}</h4>
                                                        <p className="ud-book-card__author">{book.author}</p>
                                                    </div>
                                                    <div className="ud-book-card__actions">
                                                        <button className="ud-btn ud-btn--outline ud-btn--sm" onClick={() => onBookClick(book)}>View Details</button>
                                                        {borrowed ? (
                                                            <button className="ud-btn ud-btn--return ud-btn--sm" onClick={() => onReturnBook(book.id)}>Return</button>
                                                        ) : (
                                                            book.stock > 0 ? (
                                                                <button className="ud-btn ud-btn--borrow-book ud-btn--sm" onClick={() => onBorrowBook(book.id)}>Borrow Book</button>
                                                            ) : (
                                                                <button className="ud-btn ud-btn--borrow-book ud-btn--sm" onClick={() => onBorrowBook(book.id)}>Borrow Book</button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </div>
                        )}
                    </>
                )}

                {/* Footer */}
                <footer className="ud-footer">
                    <div className="ud-footer__brand">✦ Orionlab</div>
                    <nav className="ud-footer__links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Library Ethics</a>
                        <a href="#">Contact Support</a>
                    </nav>
                    <p>© {new Date().getFullYear()} Orionlab, University Academic Affairs</p>
                </footer>
            </main>
        </div>
    );
}

export default UserDashboard;
