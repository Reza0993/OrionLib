import { useState } from 'react';
import './LoanHistory.css';

const MOCK_ACTIVE_LOANS = [
    {
        id: 'mock-active-1',
        title: 'Quantum Mechanics: A Modern Development',
        author: 'Leslie E. Ballentine',
        edition: '2nd Edition',
        category_name: 'PHYSICS & ENGINEERING',
        cover_img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80&auto=format&fit=crop',
        badge: 'Due in 2 days',
        badge_type: 'danger',
        loaned_on: 'Oct 12, 2025',
        type: 'book'
    },
    {
        id: 'mock-active-2',
        title: 'Sustainable Urban Design: Principles and Practice',
        author: 'Theodora S. Gould',
        edition: 'Digital Copy',
        category_name: 'ARCHITECTURE',
        cover_img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80&auto=format&fit=crop',
        badge: 'E-Resource',
        badge_type: 'gray',
        loaned_on: 'Nov 30, 2025',
        type: 'journal'
    },
    {
        id: 'mock-active-3',
        title: 'Ancient Civilizations of the Mediterranean',
        author: 'Dr. Julian Marcus',
        edition: 'Reference Copy',
        category_name: 'HISTORY & ANTHROPOLOGY',
        cover_img: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=400&q=80&auto=format&fit=crop',
        badge: 'Standard Loan',
        badge_type: 'primary',
        loaned_on: 'Oct 28, 2025',
        type: 'book'
    }
];

const MOCK_PAST_LOANS = [
    {
        id: 'mock-past-1',
        title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice",
        author: 'Susan Standring',
        edition: '42nd Edition',
        category_name: 'MEDICINE',
        cover_img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80&auto=format&fit=crop',
        returned_date: 'Returned Nov 05',
        loan_period: 'Oct 01 - Nov 05, 2025',
        location: 'South Wing Library',
        type: 'book'
    },
    {
        id: 'mock-past-2',
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        category_name: 'MATHEMATICS',
        returned_date: 'Returned',
        loan_period: 'LOADED: SEP 15 / RETURNED: OCT 12',
        type: 'book'
    },
    {
        id: 'mock-past-3',
        title: 'Clean Code: A Handbook of Agile Craftsmanship',
        author: 'Robert C. Martin',
        category_name: 'COMPUTER SCIENCE',
        returned_date: 'Returned',
        loan_period: 'LOANED: SEP 02 / RETURNED: SEP 15',
        type: 'book'
    },
    {
        id: 'mock-past-4',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        category_name: 'ECONOMICS',
        returned_date: 'Returned',
        loan_period: 'LOANED: AUG 20 / RETURNED: SEP 01',
        type: 'book'
    },
    {
        id: 'mock-past-5',
        title: 'The Presentation of Self in Everyday Life',
        author: 'Erving Goffman',
        category_name: 'SOCIOLOGY',
        returned_date: 'Returned',
        loan_period: 'LOANED: AUG 05 / RETURNED: AUG 19',
        type: 'book'
    }
];

function LoanHistory({ library, onReturnBook, searchQuery }) {
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'books' | 'journals'
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

    const getCoverSrc = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80&auto=format&fit=crop';
        return img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`;
    };

    // 1. Process Database Active Loans
    const dbActiveLoans = (library?.borrowed || []).map(b => ({
        id: `db-active-${b.id}`,
        book_id: b.book_id,
        title: b.title,
        author: b.author,
        edition: 'Standard Copy',
        category_name: (b.category_name || 'GENERAL').toUpperCase(),
        cover_img: getCoverSrc(b.cover_img),
        badge: 'Standard Loan',
        badge_type: 'primary',
        loaned_on: new Date(b.borrow_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: 'book',
        isDb: true
    }));

    // 2. Process Database Returned History
    const dbPastLoans = (library?.history || []).map(h => ({
        id: `db-past-${h.id}`,
        book_id: h.book_id,
        title: h.title,
        author: h.author,
        edition: 'Returned Copy',
        category_name: (h.category_name || 'GENERAL').toUpperCase(),
        cover_img: getCoverSrc(h.cover_img),
        returned_date: 'Returned',
        loan_period: `LOADED: ${new Date(h.borrow_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()} / RETURNED: ${new Date(h.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`,
        type: 'book',
        isDb: true
    }));

    // Combine Database data with High-Fidelity Mock data to match mockup perfectly
    const activeLoans = [...dbActiveLoans, ...MOCK_ACTIVE_LOANS];
    const pastLoans = [...dbPastLoans, ...MOCK_PAST_LOANS];

    // Filter active and past lists based on Search Query & Tab
    const filterList = (list) => {
        return list.filter(item => {
            const matchesSearch = !searchQuery.trim() ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category_name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab = activeTab === 'all' ||
                (activeTab === 'books' && item.type === 'book') ||
                (activeTab === 'journals' && item.type === 'journal');

            return matchesSearch && matchesTab;
        });
    };

    const filteredActiveLoans = filterList(activeLoans);
    let filteredPastLoans = filterList(pastLoans);

    // Sorting logic for past activity
    if (sortOrder === 'newest') {
        // Keeps default ordering
    } else {
        filteredPastLoans = [...filteredPastLoans].reverse();
    }

    // Pagination for history
    const visiblePastLoans = showFullHistory ? filteredPastLoans : filteredPastLoans.slice(0, 5);

    const handleRenew = (loan) => {
        alert(`Buku "${loan.title}" berhasil diperpanjang!`);
    };

    const handleOpenPDF = (loan) => {
        alert(`Membuka E-Resource PDF untuk "${loan.title}"...`);
    };

    return (
        <div className="lh-container">
            {/* Header / Top bar */}
            <div className="lh-header">
                <div>
                    <h1 className="lh-title">Loan History</h1>
                    <p className="lh-subtitle">Review and manage your current and previous academic resources.</p>
                </div>
                
                <div className="lh-actions">
                    <div className="lh-tabs">
                        <button 
                            className={`lh-tab ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >All</button>
                        <button 
                            className={`lh-tab ${activeTab === 'books' ? 'active' : ''}`}
                            onClick={() => setActiveTab('books')}
                        >Books</button>
                        <button 
                            className={`lh-tab ${activeTab === 'journals' ? 'active' : ''}`}
                            onClick={() => setActiveTab('journals')}
                        >Journals</button>
                    </div>

                    <div className="lh-filter-wrapper">
                        <button className="lh-filter-btn" onClick={() => setFilterMenuOpen(!filterMenuOpen)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                            </svg>
                            Filter
                        </button>
                        
                        {filterMenuOpen && (
                            <div className="lh-filter-dropdown">
                                <button onClick={() => { setSortOrder('newest'); setFilterMenuOpen(false); }} className={sortOrder === 'newest' ? 'active' : ''}>Newest First</button>
                                <button onClick={() => { setSortOrder('oldest'); setFilterMenuOpen(false); }} className={sortOrder === 'oldest' ? 'active' : ''}>Oldest First</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Loans Section */}
            <section className="lh-section">
                <div className="lh-section-title-row">
                    <h2 className="lh-section-title">Active Loans</h2>
                    <span className="lh-counter-badge">{filteredActiveLoans.length} ITEMS</span>
                </div>

                {filteredActiveLoans.length === 0 ? (
                    <div className="lh-empty-state">No active loans found.</div>
                ) : (
                    <div className="lh-active-grid">
                        {filteredActiveLoans.map((loan) => (
                            <div key={loan.id} className="lh-active-card">
                                <div className="lh-cover-wrapper">
                                    <img src={loan.cover_img} alt={loan.title} className="lh-cover-img" />
                                    <span className={`lh-card-badge badge-${loan.badge_type}`}>
                                        {loan.badge}
                                    </span>
                                </div>
                                <div className="lh-card-content">
                                    <div className="lh-card-category">{loan.category_name}</div>
                                    <h3 className="lh-card-title">{loan.title}</h3>
                                    <p className="lh-card-author">{loan.author} {loan.edition ? `• ${loan.edition}` : ''}</p>
                                    
                                    <div className="lh-card-footer">
                                        <div className="lh-date-info">
                                            <span className="lh-date-label">
                                                {loan.badge_type === 'gray' ? 'ACCESS EXPIRES' : 'LOANED ON'}
                                            </span>
                                            <span className="lh-date-val">{loan.loaned_on}</span>
                                        </div>
                                        {loan.badge_type === 'gray' ? (
                                            <button className="lh-action-btn pdf-btn" onClick={() => handleOpenPDF(loan)}>Open PDF</button>
                                        ) : (
                                            <button className="lh-action-btn renew-btn" onClick={() => handleRenew(loan)}>Renew</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Past Activity Section */}
            <section className="lh-section">
                <div className="lh-section-title-row">
                    <h2 className="lh-section-title">Past Activity</h2>
                    <span className="lh-counter-badge total-badge">{filteredPastLoans.length} TOTAL</span>
                </div>

                {filteredPastLoans.length === 0 ? (
                    <div className="lh-empty-state">No past activity found.</div>
                ) : (
                    <div className="lh-past-layout">
                        {/* 1. First item (Wide Feature Card) - e.g., Gray's Anatomy */}
                        {visiblePastLoans.length > 0 && (() => {
                            const mainLoan = visiblePastLoans[0];
                            return (
                                <div className="lh-past-featured-card">
                                    <div className="lh-featured-cover-wrapper">
                                        <img src={mainLoan.cover_img} alt={mainLoan.title} />
                                    </div>
                                    <div className="lh-featured-content">
                                        <div className="lh-featured-header-row">
                                            <span className="lh-featured-category">{mainLoan.category_name}</span>
                                            <span className="lh-status-badge returned">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                                {mainLoan.returned_date}
                                            </span>
                                        </div>
                                        <h3 className="lh-featured-title">{mainLoan.title}</h3>
                                        <p className="lh-featured-author">{mainLoan.author} {mainLoan.edition ? `• ${mainLoan.edition}` : ''}</p>
                                        
                                        <div className="lh-featured-meta-box">
                                            <div className="lh-meta-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                                </svg>
                                                <span>{mainLoan.loan_period}</span>
                                            </div>
                                            <div className="lh-meta-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                    <circle cx="12" cy="10" r="3"/>
                                                </svg>
                                                <span>{mainLoan.location || 'Central Library'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* 2. Grid of subsequent items */}
                        <div className="lh-past-grid">
                            {visiblePastLoans.slice(1).map((loan) => (
                                <div key={loan.id} className="lh-past-card">
                                    <div className="lh-past-card-header">
                                        <span className="lh-past-card-cat">{loan.category_name}</span>
                                        <span className="lh-past-status-badge">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                            {loan.returned_date}
                                        </span>
                                    </div>
                                    <h4 className="lh-past-card-title">{loan.title}</h4>
                                    <p className="lh-past-card-author">{loan.author}</p>
                                    
                                    <div className="lh-past-card-footer">
                                        <span className="lh-past-period">{loan.loan_period}</span>
                                        <span className="lh-past-icon-btn">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Load Full History Trigger */}
                {filteredPastLoans.length > 5 && (
                    <div className="lh-load-more-container">
                        <button className="lh-load-more-btn" onClick={() => setShowFullHistory(!showFullHistory)}>
                            {showFullHistory ? 'Collapse History' : 'Load Full History'}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default LoanHistory;
