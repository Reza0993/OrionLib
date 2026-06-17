import './FeaturedBooks.css';

function FeaturedBooks({ liveBooks = [], loading, error, isAdmin, userLibrary, onEditClick, onReloadBooks, onBookClick, onBorrowBook, onReturnBook, onToggleSave, onViewFullCatalog }) {
    if (loading) return <section className="featured-books"><div className="featured-books__loading">Sedang memuat katalog...</div></section>;

    return (
        <section className="featured" id="catalog">
            <div className="featured__container container">
                {/* Header row */}
                <div className="featured__header">
                    <div>
                        <h2 className="featured__title">Curated for Your Research</h2>
                        <p className="featured__subtitle">
                            Discover the most influential titles across disciplines, hand-picked by our
                            faculty librarians.
                        </p>
                    </div>
                    <a href="#catalog" className="featured__view-all" id="view-full-catalog" onClick={(e) => { e.preventDefault(); if(onViewFullCatalog) onViewFullCatalog(); }}>
                        View Full Catalog →
                    </a>
                </div>

                {/* Book cards grid */}
                <div className="featured__grid">
                    {liveBooks.slice(0, 4).map((book) => {
                        const isBorrowed = userLibrary?.borrowed?.some(b => b.book_id === book.id);
                        const isSaved = userLibrary?.saved?.some(b => b.book_id === book.id);

                        return (
                            <div key={book.id} className="book-card" id={`book-card-${book.id}`}>
                                {/* Cover */}
                                <div className="book-card__cover" onClick={() => onBookClick && onBookClick(book)} style={{cursor: 'pointer', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    {book.cover_img && (
                                        <img 
                                            src={book.cover_img.startsWith('http') ? book.cover_img : `/uploads/${img}`} 
                                            alt={book.title} 
                                            className="book-card__cover-img" 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    )}
                                    <div className="book-card__cover-fallback" style={{display: book.cover_img ? 'none' : 'flex'}}>
                                        📘
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="book-card__info" onClick={() => onBookClick && onBookClick(book)} style={{cursor: 'pointer'}}>
                                    <div className="book-card__category">{book.category_name || 'Umum'}</div>
                                    <h3 className="book-card__title">{book.title}</h3>
                                    <p className="book-card__author">{book.author}</p>
                                    <div className="book-card__meta">
                                        {book.stock > 0 ? (
                                            <span style={{color: '#10b981', fontWeight: 600, fontSize: '0.8rem'}}>Tersedia: {book.stock}</span>
                                        ) : (
                                            <span style={{color: '#ef4444', fontWeight: 600, fontSize: '0.8rem'}}>Habis Dipinjam</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{display: 'flex', gap: '8px', padding: '0 1.25rem 1.25rem'}}>
                                    {isBorrowed ? (
                                        <button className="book-card__action book-card__action--primary" style={{flex: 1}} onClick={() => onReturnBook(book.id)}>Return</button>
                                    ) : (
                                        <button className="book-card__action book-card__action--outline" style={{flex: 1}} onClick={() => onBorrowBook(book.id)}>Borrow</button>
                                    )}
                                    <button 
                                        className="book-card__action book-card__action--outline"
                                        style={{flex: 1}}
                                        onClick={() => onBookClick && onBookClick(book)}
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FeaturedBooks;
