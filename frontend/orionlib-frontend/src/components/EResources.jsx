import './EResources.css';

const TABS = ['All Resources', 'E-Books', 'Journals', 'Research Papers', 'Thesis', 'Magazines', 'Learning Materials'];

const RECOMMENDED = [
    { id: 1, title: 'The Future of Artificial Intelligence', type: 'PDF', year: 2024, author: 'Dr. Aris Thorne', cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&q=80&auto=format&fit=crop' },
    { id: 2, title: 'Advances in Genetic Engineering', type: 'HTML', year: 2023, author: 'BioTech Institute', cover: 'https://images.unsplash.com/photo-1532187863486-abf9db0c28a3?w=200&q=80&auto=format&fit=crop' },
    { id: 3, title: 'Quantum Networking Protocol', type: 'PDF', year: 2024, author: 'L. S. Miller', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80&auto=format&fit=crop' },
];

const ALL_RESOURCES = [
    { id: 4, type: 'RESEARCH PAPER', fileType: 'HTML', year: 2024, title: 'Smart Cities: Integrating IoT for Sustainability', author: 'Prof. Julian Vane', desc: 'A comprehensive study on the efficacy of sensor-driven traffic management and energy usage.', cover: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&q=80&auto=format&fit=crop' },
    { id: 5, type: 'JOURNAL', fileType: 'PDF', year: 2023, title: 'Biomedical Engineering: The Next Decade', author: 'Elena R. Sterling', desc: 'Exploring the intersection of robotics and biology in the development of adaptive prosthetics.', cover: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&q=80&auto=format&fit=crop' },
    { id: 6, type: 'LEARNING MATERIAL', fileType: 'SCORM', year: 2024, title: 'Data Science Fundamentals: A Practical Guide', author: 'Global Ed Group', desc: 'Interactive module covering Python, statistics, and machine learning basics.', cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80&auto=format&fit=crop' },
    { id: 7, type: 'THESIS', fileType: 'PDF', year: 2022, title: 'Market Volatility in Emerging Economies', author: 'Marcus A. Wei', desc: 'Doctoral dissertation analyzing the impact of global trade shifts on local markets.', cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80&auto=format&fit=crop' },
];

function EResources() {
    return (
        <div className="er-layout">
            <div className="er-header">
                <h1>Explore E-Resources</h1>
            </div>

            <div className="er-tabs">
                {TABS.map((t, i) => (
                    <button key={i} className={`er-tab ${i === 0 ? 'active' : ''}`}>{t}</button>
                ))}
            </div>

            {/* Recommended */}
            <section className="er-section">
                <div className="er-section-header">
                    <h2>Recommended for You</h2>
                    <a href="#">View All</a>
                </div>
                <div className="er-rec-grid">
                    {RECOMMENDED.map(r => (
                        <div key={r.id} className="er-rec-card">
                            <div className="er-rec-cover">
                                <img src={r.cover} alt={r.title} />
                            </div>
                            <div className="er-rec-info">
                                <div className="er-rec-meta">
                                    <span className="er-badge-type">{r.type}</span>
                                    <span className="er-year">{r.year}</span>
                                </div>
                                <h4>{r.title}</h4>
                                <p>{r.author}</p>
                                <div className="er-rec-actions">
                                    <button className="er-btn-primary">Read</button>
                                    <button className="er-btn-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popular Resources */}
            <section className="er-section">
                <div className="er-section-header">
                    <h2>Popular Resources</h2>
                </div>
                <div className="er-pop-grid">
                    <div className="er-pop-featured">
                        <div className="er-pop-featured-img">
                            <span className="er-badge-top">Featured Research</span>
                            <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&auto=format&fit=crop" alt="Cybersecurity" />
                        </div>
                        <div className="er-pop-featured-info">
                            <div className="er-pop-featured-cat">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                                </svg>
                                Cybersecurity Journal 2024
                            </div>
                            <h3>Zero-Trust Architectures in Modern Cloud Infrastructure</h3>
                            <p>An in-depth analysis of zero-trust protocols and their implementation across distributed cloud systems...</p>
                            <div className="er-tags">
                                <span>PDF (12.4 MB)</span>
                                <span>85 Citations</span>
                                <span>Peer Reviewed</span>
                            </div>
                            <div className="er-pop-featured-actions">
                                <button className="er-btn-primary">Read Online</button>
                                <button className="er-btn-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="er-pop-side">
                        <div className="er-side-card">
                            <div className="er-side-cat">E-BOOK</div>
                            <h4>Macroeconomic Trends 2024</h4>
                            <p>Global Finance Review</p>
                            <div className="er-side-footer">
                                <span className="er-badge-new">NEW RELEASE</span>
                                <a href="#">View Details →</a>
                            </div>
                        </div>
                        <div className="er-side-card">
                            <div className="er-side-cat">LEARNING MATERIALS</div>
                            <h4>Advanced Calculus: Problem Sets</h4>
                            <p>Department of Mathematics</p>
                            <div className="er-side-footer">
                                <div className="er-avatars">
                                    <div className="er-avatar">M</div>
                                    <div className="er-avatar">R</div>
                                </div>
                                <span className="er-views">4.2k Views</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* All E-Resources */}
            <section className="er-section">
                <div className="er-section-header">
                    <h2>All E-Resources</h2>
                    <div className="er-sort">
                        Sort by: <strong>Relevance</strong>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </div>
                </div>
                
                <div className="er-all-grid">
                    {ALL_RESOURCES.map(r => (
                        <div key={r.id} className="er-all-card">
                            <div className="er-all-cover">
                                <img src={r.cover} alt={r.title} />
                                <span className="er-badge-topleft">{r.type}</span>
                            </div>
                            <div className="er-all-info">
                                <div className="er-rec-meta">
                                    <span className="er-year">{r.year}</span>
                                    <span className="er-badge-type">{r.fileType}</span>
                                </div>
                                <h4>{r.title}</h4>
                                <p className="er-author">{r.author}</p>
                                <p className="er-desc">{r.desc}</p>
                                <div className="er-all-actions">
                                    <button className="er-btn-primary">Read Online</button>
                                    <button className="er-btn-outline">Details</button>
                                </div>
                                <a href="#" className="er-dl-link">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                    </svg>
                                    Download {r.fileType}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="er-load-more">
                    <button className="er-btn-outline er-btn-large">Load More Resources</button>
                </div>
            </section>
        </div>
    );
}

export default EResources;
