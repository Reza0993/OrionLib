import { useState } from 'react';
import BookManagement from './BookManagement';
import EResources from './EResources';
import UserLibrary from './UserLibrary';
import './UserDashboard.css';

const TOPIC_TABS = ['All Topics', 'Technology', 'Science', 'Business', 'History', 'Literature', 'Religion'];


function UserDashboard({ user, onLogout, books, loading, isAdmin, userLibrary, onEditClick, onDeleteClick, onAddNew, onBorrowBook, onReturnBook, onToggleSave, onBookClick, onGoHome }) {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('All Topics');

    const NAV_ITEMS = [
        { key: 'dashboard', label: 'Dashboard', emoji: '⊞' },
        { key: 'mybooks', label: 'My Books', emoji: '📚' },
        { key: 'eresources', label: 'E-Resources', emoji: '🖥' },
        /*{ key: 'fines', label: 'Fines', emoji: '💰' },*/
        { key: 'history', label: 'History', emoji: '🕐' },
    ];

    return (
        <div className="ud-layout">
            {/* Sidebar */}
            <aside className="ud-sidebar">
                <div className="ud-sidebar__top">
                    <div className="ud-sidebar__logo" onClick={onGoHome} style={{ cursor: 'pointer' }} title="Back to Homepage">
                        <div className="ud-sidebar__logo-icon">✦</div>
                        <div>
                            <div className="ud-sidebar__logo-name">Orionlab</div>
                            <div className="ud-sidebar__logo-sub">Academic Portal</div>
                        </div>
                    </div>
                    <nav className="ud-sidebar__nav">
                        {NAV_ITEMS.map((item) => (
                            <button key={item.key} className={`ud-sidebar__nav-item ${activeNav === item.key ? 'active' : ''}`} onClick={() => setActiveNav(item.key)} id={`nav-${item.key}`}>
                                <span className="ud-sidebar__nav-icon">{item.emoji}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                        <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                        <button className="ud-sidebar__nav-item" onClick={onGoHome}>
                            <span className="ud-sidebar__nav-icon">⬅️</span>
                            <span>Back to Home</span>
                        </button>
                    </nav>
                </div>
                <div className="ud-sidebar__bottom">

                    <button className="ud-sidebar__util-btn">⚙ <span>Settings</span></button>
                    <button className="ud-sidebar__util-btn ud-sidebar__util-btn--logout" onClick={onLogout}>⤴ <span>Logout</span></button>
                </div>
            </aside>

            {/* Main */}
            <main className="ud-main">
                {/* Topbar */}
                <div className="ud-topbar">
                    <div className="ud-topbar__search">
                        <span className="ud-topbar__search-icon">🔍</span>
                        <input type="text" placeholder="Search books, authors, or ISBN..." className="ud-topbar__search-input" />
                    </div>
                    <div className="ud-topbar__actions">
                        <button className="ud-topbar__icon-btn">🔔</button>
                        <button className="ud-topbar__icon-btn">❓</button>
                        <div className="ud-topbar__avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                    </div>
                </div>

                {/* Render Views based on Sidebar */}
                {activeNav === 'mybooks' ? (
                    <div className="ud-content">
                        {isAdmin ? (
                            <BookManagement
                                books={books || []}
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
                    <div className="ud-content" style={{ background: 'var(--bg-light)' }}>
                        <EResources />
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="ud-tabs">
                            {TOPIC_TABS.map((tab) => (
                                <button key={tab} className={`ud-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} id={`tab-${tab.toLowerCase().replace(' ', '-')}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="ud-content">
                            {/* Recommended */}
                            <section className="ud-section">
                                <div className="ud-section__header">
                                    <h2>Recommended for You</h2>
                                    <a href="#" className="ud-view-all">View All</a>
                                </div>
                                <div className="ud-book-grid">
                                    {(books || []).slice(0, 4).map((book) => {
                                        const isBorrowed = userLibrary?.borrowed?.some(b => b.book_id === book.id);
                                        const isSaved = userLibrary?.saved?.some(b => b.book_id === book.id);
                                        const coverSrc = book.cover_img
                                            ? (book.cover_img.startsWith('http') ? book.cover_img : `http://localhost:3000${book.cover_img}`)
                                            : null;

                                        return (
                                            <div key={book.id} className="ud-book-card">
                                                <div className="ud-book-card__cover" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                    {coverSrc ? (
                                                        <img src={coverSrc} alt={book.title} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontSize: '2rem' }}>📘</div>
                                                    )}
                                                    {book.stock > 0
                                                        ? <span className="ud-book-card__badge badge badge-green">Available</span>
                                                        : <span className="ud-book-card__badge badge badge-red">Unavailable</span>
                                                    }
                                                </div>
                                                <div className="ud-book-card__info" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                    <div className="ud-book-card__cat">{book.category_name || 'GENERAL'}</div>
                                                    <h4 className="ud-book-card__title">{book.title}</h4>
                                                    <p className="ud-book-card__author">{book.author}</p>
                                                </div>
                                                <div className="ud-book-card__actions">
                                                    {isBorrowed ? (
                                                        <button className="ud-btn ud-btn--primary ud-btn--sm" onClick={() => onReturnBook(book.id)}>Return</button>
                                                    ) : (
                                                        <button className="ud-btn ud-btn--outline ud-btn--sm" onClick={() => onBorrowBook(book.id)} disabled={book.stock <= 0}>Borrow</button>
                                                    )}
                                                    <button
                                                        className="ud-btn ud-btn--ghost ud-btn--sm"
                                                        onClick={() => onBookClick(book)}
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* New Arrivals */}
                            <section className="ud-section">
                                <div className="ud-section__header"><h2>New Arrivals</h2></div>
                                <div className="ud-new-arrivals">
                                    {/* Featured book = first book from second half of catalog */}
                                    {books?.length > 8 && (() => {
                                        const featured = books[8];
                                        const fCover = featured.cover_img?.startsWith('http') ? featured.cover_img : `http://localhost:3000${featured.cover_img}`;
                                        const fBorrowed = userLibrary?.borrowed?.some(b => b.book_id === featured.id);
                                        const fSaved = userLibrary?.saved?.some(b => b.book_id === featured.id);
                                        return (
                                            <div className="ud-featured-card">
                                                <div className="ud-featured-card__img">
                                                    <img src={fCover} alt={featured.title} />
                                                </div>
                                                <div className="ud-featured-card__body">
                                                    <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginBottom: '0.75rem', display: 'inline-block' }}>FEATURED</span>
                                                    <h3>{featured.title}</h3>
                                                    <p>by {featured.author} — {featured.category_name || 'General'}</p>
                                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                                        {fBorrowed ? (
                                                            <button className="ud-btn ud-btn--primary" onClick={() => onReturnBook(featured.id)}>Return Book</button>
                                                        ) : (
                                                            <button className="ud-btn ud-btn--primary" onClick={() => onBorrowBook(featured.id)}>Borrow Book</button>
                                                        )}
                                                        <button className={`ud-btn ${fSaved ? 'ud-btn--primary' : 'ud-btn--outline'}`} onClick={() => onToggleSave(featured.id, fSaved)}>
                                                            {fSaved ? 'Saved' : 'Add to List'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <div className="ud-arrivals-list">
                                        {(books || []).slice(9, 12).map((b) => {
                                            const bCover = b.cover_img?.startsWith('http') ? b.cover_img : `http://localhost:3000${b.cover_img}`;
                                            const bBorrowed = userLibrary?.borrowed?.some(l => l.book_id === b.id);
                                            return (
                                                <div key={b.id} className="ud-mini-card">
                                                    <div className="ud-mini-card__cover" style={{ overflow: 'hidden' }}>
                                                        {b.cover_img ? (
                                                            <img src={bCover} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <span style={{ fontSize: '1.5rem' }}>📘</span>
                                                        )}
                                                    </div>
                                                    <div className="ud-mini-card__body">
                                                        <h5>{b.title}</h5>
                                                        <p>{b.author}</p>
                                                        {bBorrowed ? (
                                                            <button className="ud-btn ud-btn--xs ud-btn--primary" onClick={() => onReturnBook(b.id)}>Return</button>
                                                        ) : (
                                                            <button className="ud-btn ud-btn--xs ud-btn--outline" onClick={() => onBorrowBook(b.id)}>Borrow</button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* Popular Books */}
                            <section className="ud-section">
                                <div className="ud-section__header"><h2>Popular Books</h2></div>
                                <div className="ud-book-grid">
                                    {(books || []).slice(4, 8).map((book) => {
                                        const isBorrowed = userLibrary?.borrowed?.some(b => b.book_id === book.id);
                                        const isSaved = userLibrary?.saved?.some(b => b.book_id === book.id);
                                        const coverSrc = book.cover_img
                                            ? (book.cover_img.startsWith('http') ? book.cover_img : `http://localhost:3000${book.cover_img}`)
                                            : null;

                                        return (
                                            <div key={book.id} className="ud-book-card">
                                                <div className="ud-book-card__cover" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                    {coverSrc ? (
                                                        <img src={coverSrc} alt={book.title} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontSize: '2rem' }}>📘</div>
                                                    )}
                                                    {book.stock > 0
                                                        ? <span className="ud-book-card__badge badge badge-green">Available</span>
                                                        : <span className="ud-book-card__badge badge badge-red">Unavailable</span>
                                                    }
                                                </div>
                                                <div className="ud-book-card__info" onClick={() => onBookClick(book)} style={{ cursor: 'pointer' }}>
                                                    <div className="ud-book-card__cat">{book.category_name || 'GENERAL'}</div>
                                                    <h4 className="ud-book-card__title">{book.title}</h4>
                                                    <p className="ud-book-card__author">{book.author}</p>
                                                </div>
                                                <div className="ud-book-card__actions">
                                                    <button className="ud-btn ud-btn--outline ud-btn--sm" onClick={() => onBookClick(book)}>View Details</button>
                                                    {isBorrowed ? (
                                                        <button className="ud-btn ud-btn--ghost ud-btn--sm" onClick={() => onReturnBook(book.id)}>Return</button>
                                                    ) : (
                                                        <button className="ud-btn ud-btn--primary ud-btn--sm" onClick={() => onBorrowBook(book.id)} disabled={book.stock <= 0}>Borrow Book</button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
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
