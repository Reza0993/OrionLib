import { useState, useEffect } from 'react';
import './EResources.css';

const TABS = ['All Resources', 'E-Books', 'Journals', 'Research Papers', 'Thesis', 'Magazines', 'Learning Materials'];

const RECOMMENDED = [
    { 
        id: 1, 
        title: 'The Future of Artificial Intelligence', 
        type: 'E-Books', 
        fileType: 'PDF', 
        year: 2024, 
        author: 'Dr. Aris Thorne', 
        cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&q=80&auto=format&fit=crop',
        size: '7.8 MB',
        citations: 18,
        views: '2.5k',
        abstract: 'An investigation into the near-term progress of Artificial General Intelligence (AGI). This book highlights recent developments in transformer scaling laws, reinforcement learning from human feedback, and neural alignment protocols, while addressing socio-economic risks.'
    },
    { 
        id: 2, 
        title: 'Advances in Genetic Engineering', 
        type: 'Journals', 
        fileType: 'HTML', 
        year: 2023, 
        author: 'BioTech Institute', 
        cover: 'https://images.unsplash.com/photo-1532187863486-abf9db0c28a3?w=200&q=80&auto=format&fit=crop',
        size: '1.2 MB',
        citations: 56,
        views: '1.8k',
        abstract: 'A compilation of recent reports on CRISPR-Cas9 enhancements, editing accuracy improvements, and preclinical trials for hereditary disease correctives.'
    },
    { 
        id: 3, 
        title: 'Quantum Networking Protocol', 
        type: 'Research Papers', 
        fileType: 'PDF', 
        year: 2024, 
        author: 'L. S. Miller', 
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80&auto=format&fit=crop',
        size: '5.4 MB',
        citations: 34,
        views: '980',
        abstract: 'Proposing a secure decentralized quantum key distribution (QKD) routing protocol suitable for regional network nodes using fiberoptic channels.'
    },
];

const FEATURED_RESOURCE = {
    id: 100,
    title: 'Zero-Trust Architectures in Modern Cloud Infrastructure',
    type: 'Research Papers',
    fileType: 'PDF',
    year: 2024,
    author: 'Dr. Sarah Connor',
    desc: 'An in-depth analysis of zero-trust protocols and their implementation across distributed cloud systems...',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80&auto=format&fit=crop',
    size: '12.4 MB',
    citations: 85,
    views: '5.6k',
    abstract: 'Traditional perimeter-based network security models are insufficient for modern cloud-native environments. This research paper explores Zero-Trust Network Access (ZTNA) principles, continuous authentication, identity-aware proxies, and micro-segmentation. We present an empirical assessment of system latencies and security postures when deploying ZTNA frameworks across AWS, Google Cloud, and Azure environments.'
};

const SIDE_RESOURCES = [
    {
        id: 200,
        type: 'E-Books',
        title: 'Macroeconomic Trends 2024',
        author: 'Global Finance Review',
        fileType: 'PDF',
        year: 2024,
        size: '10.5 MB',
        citations: 15,
        views: '1.2k',
        abstract: 'An annual overview tracking global monetary policies, post-pandemic recovery indices, trade corridors, inflation thresholds, and decentralized finance regulations.'
    },
    {
        id: 201,
        type: 'Learning Materials',
        title: 'Advanced Calculus: Problem Sets',
        author: 'Department of Mathematics',
        fileType: 'PDF',
        year: 2023,
        size: '3.1 MB',
        citations: 0,
        views: '4.2k',
        abstract: 'A collection of challenge problems in multivariable integration, vector analysis, and differential equations compiled for undergraduate mathematics students.'
    }
];

const ALL_RESOURCES = [
    {
        id: 4,
        type: 'Research Papers',
        fileType: 'HTML',
        year: 2024,
        title: 'Smart Cities: Integrating IoT for Sustainability',
        author: 'Prof. Julian Vane',
        desc: 'A comprehensive study on the efficacy of sensor-driven traffic management and energy usage in smart city architectures.',
        cover: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&q=80&auto=format&fit=crop',
        size: '4.2 MB',
        citations: 45,
        views: '1.2k',
        abstract: 'As urban populations grow, the integration of Internet of Things (IoT) technologies becomes imperative for optimizing resource allocation. This paper presents an integrated IoT framework deployed across three pilot metropolitan areas. We analyze real-time data from 5,000 traffic sensors and smart grid controllers over a 12-month period, demonstrating a 14% decrease in traffic congestion and an 8% increase in energy distribution efficiency.'
    },
    {
        id: 5,
        type: 'Journals',
        fileType: 'PDF',
        year: 2023,
        title: 'Biomedical Engineering: The Next Decade',
        author: 'Elena R. Sterling',
        desc: 'Exploring the intersection of robotics and biology in the development of adaptive prosthetics and neural interfaces.',
        cover: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&q=80&auto=format&fit=crop',
        size: '18.7 MB',
        citations: 128,
        views: '3.4k',
        abstract: 'Recent breakthroughs in neuroprosthetic devices have bridged the gap between human intent and robotic execution. This journal paper reviews the current state of adaptive biomechanics, concentrating on non-invasive neural interfaces, muscle signal telemetry, and closed-loop feedback systems.'
    },
    {
        id: 6,
        type: 'Learning Materials',
        fileType: 'SCORM',
        year: 2024,
        title: 'Data Science Fundamentals: A Practical Guide',
        author: 'Global Ed Group',
        desc: 'Interactive learning module covering Python, exploratory data analysis, statistics, and machine learning basics.',
        cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80&auto=format&fit=crop',
        size: '45.1 MB',
        citations: 0,
        views: '8.7k',
        abstract: 'A structured curriculum designed for undergraduates and professionals pivoting into data science. This interactive course module features code challenges, quiz assessments, and hands-on laboratory exercises using Jupyter Notebooks.'
    },
    {
        id: 7,
        type: 'Thesis',
        fileType: 'PDF',
        year: 2022,
        title: 'Market Volatility in Emerging Economies',
        author: 'Marcus A. Wei',
        desc: 'Doctoral dissertation analyzing the impact of global trade shifts and exchange rates on local markets.',
        cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&q=80&auto=format&fit=crop',
        size: '8.4 MB',
        citations: 12,
        views: '920',
        abstract: 'This doctoral thesis investigates the transmission channels of external macroeconomic shocks to domestic market indices in Southeast Asia. Using a Vector Autoregression (VAR) framework with daily financial data from 2012 to 2022, we model the impact of interest rate hikes in major economies, bilateral tariff adjustments, and foreign capital flows.'
    },
    {
        id: 8,
        type: 'Magazines',
        fileType: 'PDF',
        year: 2026,
        title: 'Wired Tech Magazine - Special AI Issue',
        author: 'Tech Media Editorial',
        desc: 'Special edition discussing the fusion of robotics in hospitality, space travels, and quantum computing hardware.',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&auto=format&fit=crop',
        size: '12.6 MB',
        citations: 0,
        views: '2.1k',
        abstract: 'Welcome to the special issue of Wired Tech Magazine. In this edition, we explore how spatial computing is redefining social collaboration, how humanoid robots are transitioning from research labs to hotel reception desks, and why the race for room-temperature superconductor materials has reached a critical bottleneck.'
    },
    {
        id: 9,
        type: 'E-Books',
        fileType: 'PDF',
        year: 2025,
        title: 'Design Patterns in React & TypeScript',
        author: 'Sarah K. Jenkins',
        desc: 'Master production-grade React architecture, custom hooks, context isolation, and TypeScript interfaces.',
        cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&q=80&auto=format&fit=crop',
        size: '6.8 MB',
        citations: 0,
        views: '4.5k',
        abstract: 'A comprehensive handbook for modern frontend developers. This book details advanced design patterns that solve state management bottlenecks, component re-render overheads, and type safety issues. Learn how to construct composite components, utilize render props, and write custom React hooks.'
    },
    {
        id: 10,
        type: 'E-Books',
        fileType: 'PDF',
        year: 2024,
        title: 'Deep Learning for Computer Vision',
        author: 'Dr. Ian Goodfellow',
        desc: 'A detailed reference covering CNNs, vision transformers, image segmentation, and generative adversarial networks.',
        cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&q=80&auto=format&fit=crop',
        size: '22.3 MB',
        citations: 890,
        views: '11.2k',
        abstract: 'Deep learning has revolutionized the field of visual recognition. This textbook provides a rigorous mathematical and practical foundation for visual architectures. Starting with classical image processing and convolutional layers, we step into advanced topics including object detection and vision transformers.'
    },
    {
        id: 11,
        type: 'Magazines',
        fileType: 'PDF',
        year: 2025,
        title: 'Scientific American: The Climate Frontiers',
        author: 'Scientific Press',
        desc: 'Articles exploring climate resilience, microbial adaptations, and marine conservation technologies.',
        cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&auto=format&fit=crop',
        size: '14.2 MB',
        citations: 4,
        views: '1.5k',
        abstract: 'In this edition of Scientific American: The Climate Frontiers, we examine carbon sequestration projects across Northern Europe, how marine biologists are deploying acoustic arrays to monitor coral reef health in real-time, and the discovery of plastic-eating bacteria strains.'
    },
    {
        id: 12,
        type: 'Thesis',
        fileType: 'PDF',
        year: 2023,
        title: 'Autonomous Vehicle Routing in Urban Environments',
        author: 'Ahmad S. Al-Farsi',
        desc: 'Investigating path planning optimization algorithms for automated electric trucks in urban logistics networks.',
        cover: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&q=80&auto=format&fit=crop',
        size: '9.1 MB',
        citations: 8,
        views: '710',
        abstract: 'This thesis focuses on the dynamic vehicle routing problem with time windows (DVRPTW) for autonomous fleets. We propose a hybrid metaheuristic algorithm combining genetic algorithms with local search neighborhoods to minimize energy consumption and transport delays.'
    }
];

function EResources({ searchQuery }) {
    const [activeTab, setActiveTab] = useState('All Resources');
    const [sortBy, setSortBy] = useState('Relevance');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [bookmarkedIds, setBookmarkedIds] = useState(() => {
        const saved = localStorage.getItem('eresource_bookmarks');
        return saved ? JSON.parse(saved) : [];
    });
    const [visibleCount, setVisibleCount] = useState(4);
    const [selectedResource, setSelectedResource] = useState(null);
    const [readingResource, setReadingResource] = useState(null);
    
    // Download simulation state
    const [downloadingResource, setDownloadingResource] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    // Reader state
    const [readerLoading, setReaderLoading] = useState(false);
    const [readerZoom, setReaderZoom] = useState(100);
    const [readerPage, setReaderPage] = useState(1);
    const [readerSearch, setReaderSearch] = useState('');

    // Toasts notification state
    const [toasts, setToasts] = useState([]);

    // Helpers
    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const toggleBookmark = (id, title, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setBookmarkedIds(prev => {
            let updated;
            if (prev.includes(id)) {
                updated = prev.filter(item => item !== id);
                addToast(`Removed "${title}" from bookmarks`, 'info');
            } else {
                updated = [...prev, id];
                addToast(`Saved "${title}" to bookmarks`, 'success');
            }
            localStorage.setItem('eresource_bookmarks', JSON.stringify(updated));
            return updated;
        });
    };

    const triggerDownload = (resource, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (downloadingResource) {
            addToast(`Please wait for current download to complete`, 'warning');
            return;
        }
        setDownloadingResource(resource);
        setDownloadProgress(0);
        addToast(`Starting download: ${resource.title}`, 'info');

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setDownloadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setDownloadingResource(null);
                    addToast(`Download Complete: ${resource.title}`, 'success');
                    
                    // Actually trigger mock file download in browser
                    try {
                        const element = document.createElement("a");
                        const file = new Blob([
                            `OrionLib Academic Portal - E-Resource\n\n` +
                            `Title: ${resource.title}\n` +
                            `Author: ${resource.author}\n` +
                            `Type: ${resource.type}\n` +
                            `Format: ${resource.fileType}\n` +
                            `Published: ${resource.year}\n\n` +
                            `Abstract:\n${resource.abstract || resource.desc || 'No abstract available.'}`
                        ], { type: 'text/plain' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${resource.fileType.toLowerCase() === 'scorm' ? 'zip' : 'pdf'}`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                    } catch (err) {
                        console.error("Mock download failed", err);
                    }
                }, 400);
            }
        }, 150);
    };

    const openReader = (resource, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setReadingResource(resource);
        setReaderLoading(true);
        setReaderPage(1);
        setReaderZoom(100);
        setReaderSearch('');
        setTimeout(() => {
            setReaderLoading(false);
        }, 850);
    };

    // Close on escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedResource(null);
                setReadingResource(null);
                setShowSortDropdown(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter and Sort logic
    const filteredResources = ALL_RESOURCES.filter(r => {
        const matchesTab = activeTab === 'All Resources' || r.type === activeTab;
        const matchesSearch = !searchQuery?.trim() || 
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const sortedResources = [...filteredResources].sort((a, b) => {
        if (sortBy === 'Newest') return b.year - a.year;
        if (sortBy === 'Oldest') return a.year - b.year;
        if (sortBy === 'Title') return a.title.localeCompare(b.title);
        return a.id - b.id; // Relevance
    });

    const visibleResources = sortedResources.slice(0, visibleCount);

    // Simulated content for Reader
    const getReaderPagesContent = (resource) => {
        const title = resource.title;
        const author = resource.author;
        const year = resource.year;
        const abstract = resource.abstract || resource.desc;

        const pages = [
            {
                title: "Cover & Title Page",
                content: (
                    <div className="reader-doc-cover-page">
                        <div className="reader-doc-uni">ORIONLAB ACADEMIC PLATFORM</div>
                        <h1 className="reader-doc-title-large">{title}</h1>
                        <p className="reader-doc-author-large">{author}</p>
                        <div className="reader-doc-meta-large">
                            <p><strong>Resource Type:</strong> {resource.type}</p>
                            <p><strong>Published:</strong> {year}</p>
                            <p><strong>Format:</strong> {resource.fileType} Digital Edition</p>
                        </div>
                        <div className="reader-doc-logo-watermark">✦</div>
                        <p className="reader-doc-footer-note">Repository Copy. For Academic Reference Only.</p>
                    </div>
                )
            },
            {
                title: "1. Abstract & Introduction",
                content: (
                    <div className="reader-page-body">
                        <div className="reader-doc-section">
                            <h3>Abstract</h3>
                            <p className="reader-doc-abstract">{abstract}</p>
                        </div>
                        <div className="reader-doc-section">
                            <h3>1. Introduction</h3>
                            <p className="reader-doc-paragraph">
                                The transition toward modern digital structures has motivated substantial review of existing technological solutions. In this document, we present an exhaustive overview of the factors influencing <strong>{title}</strong>. By analyzing both empirical case studies and qualitative research from the past decade, we construct a unified framework of understanding.
                            </p>
                            <p className="reader-doc-paragraph">
                                First, we define the scope of {resource.type.toLowerCase().slice(0, -1)} systems. This classification enables scholars to segment architectural layers, isolate variables, and address optimization bottlenecks efficiently.
                            </p>
                        </div>
                    </div>
                )
            },
            {
                title: "2. Technical Review & Systems",
                content: (
                    <div className="reader-page-body">
                        <div className="reader-doc-section">
                            <h3>2. Technical Overview</h3>
                            <p className="reader-doc-paragraph">
                                A critical aspect of {title} lies in the orchestration of underlying services. In traditional implementations, legacy setups often fail to balance load spikes, leading to critical database locking or buffer issues.
                            </p>
                            <div className="reader-doc-callout">
                                <strong>Technical Warning:</strong> Deploying these services without isolation layers poses security threats, specifically identity mimicking or state poisoning. Zero-trust approaches must be strictly adhered to.
                            </div>
                            <p className="reader-doc-paragraph">
                                To mitigate this, our recommended model distributes transaction weight uniformly using key hashing. This prevents hotspot creation, ensuring consistent latency levels even under adversarial traffic loads.
                            </p>
                        </div>
                    </div>
                )
            },
            {
                title: "3. Architecture Flow Diagram",
                content: (
                    <div className="reader-page-body">
                        <div className="reader-doc-section">
                            <h3>3. Core Architecture</h3>
                            <p className="reader-doc-paragraph">
                                The implementation lifecycle of this {resource.type.toLowerCase().slice(0, -1)} follows a linear sequence, augmented by continuous health-check loops. Below, we illustrate the conceptual pathway:
                            </p>
                            <div className="reader-doc-diagram">
                                <div className="diagram-node">Raw Data Input</div>
                                <div className="diagram-link">↓</div>
                                <div className="diagram-node primary">Validation & Parser</div>
                                <div className="diagram-link">↓</div>
                                <div className="diagram-node accent">Decoupled Processing Engine</div>
                                <div className="diagram-link">↓</div>
                                <div className="diagram-node">Distributed Database Sync</div>
                            </div>
                            <p className="diagram-caption">Figure 3.1: Structural data flow and security validation boundary layout.</p>
                        </div>
                    </div>
                )
            },
            {
                title: "4. Quantitative Benchmark Results",
                content: (
                    <div className="reader-page-body">
                        <div className="reader-doc-section">
                            <h3>4. Experimental Results</h3>
                            <p className="reader-doc-paragraph">
                                Validation trials were executed across a 3-week test window. The metrics below highlight comparative latency and throughput values, illustrating the performance advantages of our optimized design:
                            </p>
                            <table className="reader-doc-table">
                                <thead>
                                    <tr>
                                        <th>Framework Iteration</th>
                                        <th>Throughput (Ops/sec)</th>
                                        <th>95th % Latency (ms)</th>
                                        <th>Failure Rate (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Legacy Baseline</td>
                                        <td>1,450</td>
                                        <td>240ms</td>
                                        <td>3.45%</td>
                                    </tr>
                                    <tr>
                                        <td>Hybrid Cloud</td>
                                        <td>4,800</td>
                                        <td>94ms</td>
                                        <td>1.20%</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Our Proposed Model</strong></td>
                                        <td><strong>9,120</strong></td>
                                        <td><strong>21ms</strong></td>
                                        <td><strong>0.02%</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="reader-doc-paragraph">
                                As observed, the proposed architecture yields a 90% reduction in late-tail latencies, alongside a 2x increase in overall operational capacity.
                            </p>
                        </div>
                    </div>
                )
            },
            {
                title: "5. Conclusions & References",
                content: (
                    <div className="reader-page-body">
                        <div className="reader-doc-section">
                            <h3>5. Conclusion</h3>
                            <p className="reader-doc-paragraph">
                                This document serves to validate that adopting structured, modern patterns for <strong>{title}</strong> dramatically improves performance metrics while safeguarding data integrity. Future steps will focus on edge-tier deployment and localized telemetry integrations.
                            </p>
                            <hr className="reader-doc-divider" style={{ marginTop: '2.5rem' }} />
                            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--primary)' }}>Key References</h4>
                            <ol className="reader-doc-references">
                                <li>Vane, J. (2024). Smart Cities and IoT Integrations. Academic Press.</li>
                                <li>Sterling, E. R. (2023). Biomedical Engineering Systems. Tech Jour, 18(4), 112-125.</li>
                                <li>Connor, S. (2024). Practical Zero-Trust Cloud Guidelines. Cloud Sec Rev, 31(2), 77-89.</li>
                            </ol>
                        </div>
                    </div>
                )
            }
        ];

        // Highlight matching text if search filter is applied
        if (readerSearch.trim()) {
            // Simulated search in reader - returns matched pages
            return pages;
        }

        return pages;
    };

    const readerPages = readingResource ? getReaderPagesContent(readingResource) : [];

    return (
        <div className="er-layout">
            <div className="er-header">
                <h1>Explore E-Resources</h1>
            </div>

            <div className="er-tabs">
                {TABS.map((t, i) => (
                    <button 
                        key={i} 
                        className={`er-tab ${activeTab === t ? 'active' : ''}`}
                        onClick={() => {
                            setActiveTab(t);
                            setVisibleCount(4); // Reset pagination on tab change
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Recommended Section (Only show on 'All Resources' tab to keep dashboard tidy) */}
            {activeTab === 'All Resources' && (
                <section className="er-section">
                    <div className="er-section-header">
                        <h2>Recommended for You</h2>
                        <a href="#all-resources" onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('all-resources')?.scrollIntoView({ behavior: 'smooth' });
                        }}>View All</a>
                    </div>
                    <div className="er-rec-grid">
                        {RECOMMENDED.map(r => {
                            const isBookmarked = bookmarkedIds.includes(r.id);
                            return (
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
                                            <button className="er-btn-primary" onClick={(e) => openReader(r, e)}>Read</button>
                                            <button 
                                                className={`er-btn-icon ${isBookmarked ? 'bookmarked' : ''}`}
                                                onClick={(e) => toggleBookmark(r.id, r.title, e)}
                                                title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Popular Resources (Only show on 'All Resources' tab) */}
            {activeTab === 'All Resources' && (
                <section className="er-section">
                    <div className="er-section-header">
                        <h2>Popular Resources</h2>
                    </div>
                    <div className="er-pop-grid">
                        <div className="er-pop-featured">
                            <div className="er-pop-featured-img">
                                <span className="er-badge-top">Featured Research</span>
                                <img src={FEATURED_RESOURCE.cover} alt={FEATURED_RESOURCE.title} />
                            </div>
                            <div className="er-pop-featured-info">
                                <div className="er-pop-featured-cat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                                    </svg>
                                    Cybersecurity Journal {FEATURED_RESOURCE.year}
                                </div>
                                <h3>{FEATURED_RESOURCE.title}</h3>
                                <p>{FEATURED_RESOURCE.desc}</p>
                                <div className="er-tags">
                                    <span>PDF ({FEATURED_RESOURCE.size})</span>
                                    <span>{FEATURED_RESOURCE.citations} Citations</span>
                                    <span>Peer Reviewed</span>
                                </div>
                                <div className="er-pop-featured-actions">
                                    <button className="er-btn-primary" onClick={(e) => openReader(FEATURED_RESOURCE, e)}>Read Online</button>
                                    <button 
                                        className={`er-btn-icon ${bookmarkedIds.includes(FEATURED_RESOURCE.id) ? 'bookmarked' : ''}`}
                                        onClick={(e) => toggleBookmark(FEATURED_RESOURCE.id, FEATURED_RESOURCE.title, e)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarkedIds.includes(FEATURED_RESOURCE.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </button>
                                    <button 
                                        className="er-btn-icon" 
                                        onClick={(e) => triggerDownload(FEATURED_RESOURCE, e)}
                                        title="Download PDF"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="er-pop-side">
                            {/* Card 1: Macroeconomic */}
                            <div className="er-side-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedResource(SIDE_RESOURCES[0])}>
                                <div className="er-side-cat">{SIDE_RESOURCES[0].type.toUpperCase()}</div>
                                <h4>{SIDE_RESOURCES[0].title}</h4>
                                <p>{SIDE_RESOURCES[0].author}</p>
                                <div className="er-side-footer">
                                    <span className="er-badge-new">NEW RELEASE</span>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedResource(SIDE_RESOURCES[0]);
                                    }}>View Details →</a>
                                </div>
                            </div>
                            
                            {/* Card 2: Advanced Calculus */}
                            <div className="er-side-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedResource(SIDE_RESOURCES[1])}>
                                <div className="er-side-cat">{SIDE_RESOURCES[1].type.toUpperCase()}</div>
                                <h4>{SIDE_RESOURCES[1].title}</h4>
                                <p>{SIDE_RESOURCES[1].author}</p>
                                <div className="er-side-footer">
                                    <div className="er-avatars">
                                        <div className="er-avatar">M</div>
                                        <div className="er-avatar">R</div>
                                    </div>
                                    <span className="er-views">{SIDE_RESOURCES[1].views} Views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* All E-Resources Grid */}
            <section className="er-section" id="all-resources" style={{ scrollMarginTop: '20px' }}>
                <div className="er-section-header">
                    <h2>{activeTab === 'All Resources' ? 'All E-Resources' : activeTab}</h2>
                    <div className="er-sort-container" style={{ position: 'relative' }}>
                        <div className="er-sort" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                            Sort by: <strong>{sortBy}</strong>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                        {showSortDropdown && (
                            <div className="er-sort-dropdown">
                                <button className={sortBy === 'Relevance' ? 'active' : ''} onClick={() => { setSortBy('Relevance'); setShowSortDropdown(false); }}>Relevance</button>
                                <button className={sortBy === 'Newest' ? 'active' : ''} onClick={() => { setSortBy('Newest'); setShowSortDropdown(false); }}>Year (Newest)</button>
                                <button className={sortBy === 'Oldest' ? 'active' : ''} onClick={() => { setSortBy('Oldest'); setShowSortDropdown(false); }}>Year (Oldest)</button>
                                <button className={sortBy === 'Title' ? 'active' : ''} onClick={() => { setSortBy('Title'); setShowSortDropdown(false); }}>Title (A-Z)</button>
                            </div>
                        )}
                    </div>
                </div>
                
                {sortedResources.length > 0 ? (
                    <div className="er-all-grid">
                        {visibleResources.map(r => {
                            const isBookmarked = bookmarkedIds.includes(r.id);
                            return (
                                <div key={r.id} className="er-all-card">
                                    <div className="er-all-cover" onClick={() => setSelectedResource(r)} style={{ cursor: 'pointer' }}>
                                        <img src={r.cover} alt={r.title} />
                                        <span className="er-badge-topleft">{r.type}</span>
                                    </div>
                                    <div className="er-all-info">
                                        <div className="er-rec-meta">
                                            <span className="er-year">{r.year}</span>
                                            <span className="er-badge-type">{r.fileType}</span>
                                        </div>
                                        <h4 onClick={() => setSelectedResource(r)} style={{ cursor: 'pointer' }}>{r.title}</h4>
                                        <p className="er-author">{r.author}</p>
                                        <p className="er-desc">{r.desc}</p>
                                        <div className="er-all-actions">
                                            <button className="er-btn-primary" onClick={(e) => openReader(r, e)}>Read Online</button>
                                            <button className="er-btn-outline" onClick={() => setSelectedResource(r)}>Details</button>
                                        </div>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                            <a href="#" className="er-dl-link" onClick={(e) => triggerDownload(r, e)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                                                </svg>
                                                Download {r.fileType}
                                            </a>
                                            <button 
                                                className={`er-btn-bookmark-only ${isBookmarked ? 'active' : ''}`}
                                                onClick={(e) => toggleBookmark(r.id, r.title, e)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? '#eab308' : '#94a3b8' }}
                                                title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="er-no-results">
                        <span>🔍</span>
                        <h3>No resources found</h3>
                        <p>No matches in "{activeTab}" {searchQuery && `for "${searchQuery}"`}. Try clearing your search or filtering by another category.</p>
                    </div>
                )}

                {sortedResources.length > visibleCount && (
                    <div className="er-load-more">
                        <button 
                            className="er-btn-outline er-btn-large"
                            onClick={() => setVisibleCount(prev => prev + 4)}
                        >
                            Load More Resources
                        </button>
                    </div>
                )}
            </section>

            {/* ══════════ DETAILS MODAL OVERLAY ══════════ */}
            {selectedResource && (
                <div className="er-modal-overlay animate-fade-in" onClick={() => setSelectedResource(null)}>
                    <div className="er-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="er-modal-close-btn" onClick={() => setSelectedResource(null)}>×</button>
                        
                        <div className="er-modal-details-grid">
                            <div className="er-modal-left">
                                <div className="er-modal-cover-wrapper">
                                    <img 
                                        src={selectedResource.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&auto=format&fit=crop'} 
                                        alt={selectedResource.title} 
                                    />
                                </div>
                                <span className="er-modal-format-badge">{selectedResource.fileType} • {selectedResource.size || '3.5 MB'}</span>
                            </div>
                            
                            <div className="er-modal-right">
                                <span className="er-badge-type" style={{ width: 'fit-content', marginBottom: '8px' }}>{selectedResource.type}</span>
                                <h2>{selectedResource.title}</h2>
                                <p className="er-modal-author">Published in {selectedResource.year} • By {selectedResource.author}</p>
                                
                                <div className="er-modal-stats">
                                    <div className="er-stat-item">
                                        <span className="er-stat-val">📊 {selectedResource.views || '1.2k'}</span>
                                        <span className="er-stat-lbl">Views</span>
                                    </div>
                                    <div className="er-stat-item">
                                        <span className="er-stat-val">📌 {selectedResource.citations || 0}</span>
                                        <span className="er-stat-lbl">Citations</span>
                                    </div>
                                    <div className="er-stat-item">
                                        <span className="er-stat-val">🔐 Open</span>
                                        <span className="er-stat-lbl">Access</span>
                                    </div>
                                </div>

                                <div className="er-modal-abstract-section">
                                    <h3>Abstract / Summary</h3>
                                    <p>{selectedResource.abstract || selectedResource.desc}</p>
                                </div>

                                <div className="er-modal-actions">
                                    <button 
                                        className="er-btn-primary er-btn-large-modal"
                                        onClick={(e) => {
                                            setSelectedResource(null);
                                            openReader(selectedResource, e);
                                        }}
                                    >
                                        Read Document Online
                                    </button>
                                    <button 
                                        className="er-btn-outline er-btn-large-modal"
                                        onClick={(e) => triggerDownload(selectedResource, e)}
                                    >
                                        Download File
                                    </button>
                                    <button 
                                        className={`er-btn-icon er-btn-large-modal-icon ${bookmarkedIds.includes(selectedResource.id) ? 'bookmarked' : ''}`}
                                        onClick={(e) => toggleBookmark(selectedResource.id, selectedResource.title, e)}
                                        title="Bookmark Resource"
                                        style={{ width: '48px', height: '48px' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarkedIds.includes(selectedResource.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ SIMULATED READER MODAL ══════════ */}
            {readingResource && (
                <div className="er-reader-overlay">
                    <div className="er-reader-container">
                        
                        {/* Reader Top Bar */}
                        <div className="er-reader-top">
                            <div className="er-reader-title-section">
                                <div className="er-reader-badge-type">{readingResource.type.slice(0, -1)}</div>
                                <h2 className="er-reader-title-text" title={readingResource.title}>{readingResource.title}</h2>
                            </div>
                            
                            <div className="er-reader-controls">
                                {/* Page pagination */}
                                <div className="er-reader-page-nav">
                                    <button 
                                        disabled={readerPage <= 1 || readerLoading}
                                        onClick={() => setReaderPage(prev => prev - 1)}
                                        className="er-reader-btn-nav"
                                    >
                                        ◀
                                    </button>
                                    <span className="er-reader-page-indicator">
                                        Page <strong>{readerPage}</strong> of {readerPages.length}
                                    </span>
                                    <button 
                                        disabled={readerPage >= readerPages.length || readerLoading}
                                        onClick={() => setReaderPage(prev => prev + 1)}
                                        className="er-reader-btn-nav"
                                    >
                                        ▶
                                    </button>
                                </div>

                                {/* Zoom controls */}
                                <div className="er-reader-zoom">
                                    <button onClick={() => setReaderZoom(prev => Math.max(50, prev - 10))} className="er-reader-zoom-btn">−</button>
                                    <span className="er-reader-zoom-val">{readerZoom}%</span>
                                    <button onClick={() => setReaderZoom(prev => Math.min(150, prev + 10))} className="er-reader-zoom-btn">+</button>
                                </div>

                                {/* In-text search */}
                                <div className="er-reader-search-box">
                                    <input 
                                        type="text" 
                                        placeholder="Find in text..." 
                                        value={readerSearch}
                                        onChange={(e) => setReaderSearch(e.target.value)}
                                        className="er-reader-search-input"
                                    />
                                    {readerSearch && (
                                        <button className="er-reader-search-clear" onClick={() => setReaderSearch('')}>×</button>
                                    )}
                                </div>

                                <button 
                                    className="er-reader-btn-header er-reader-btn-dl"
                                    onClick={(e) => triggerDownload(readingResource, e)}
                                    title="Download Document"
                                >
                                    📥 Download
                                </button>
                                
                                <button 
                                    className="er-reader-btn-header er-reader-btn-close"
                                    onClick={() => setReadingResource(null)}
                                    title="Exit Reader"
                                >
                                    ✕ Close
                                </button>
                            </div>
                        </div>

                        {/* Reader Main Space */}
                        <div className="er-reader-body">
                            
                            {/* Left Document Outline Sidebar */}
                            <aside className="er-reader-sidebar">
                                <h4 className="sidebar-heading">Document Outline</h4>
                                <ul className="sidebar-outline-list">
                                    {readerPages.map((page, idx) => (
                                        <li 
                                            key={idx}
                                            className={`sidebar-outline-item ${readerPage === idx + 1 ? 'active' : ''}`}
                                            onClick={() => {
                                                if (!readerLoading) setReaderPage(idx + 1);
                                            }}
                                        >
                                            <span className="outline-number">{idx + 1}</span>
                                            <span className="outline-title">{page.title}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="sidebar-doc-details">
                                    <p><strong>Format:</strong> Verified {readingResource.fileType}</p>
                                    <p><strong>Author:</strong> {readingResource.author}</p>
                                    <p><strong>Citations:</strong> {readingResource.citations || 0}</p>
                                    <p><strong>License:</strong> CC-BY-NC 4.0</p>
                                </div>
                            </aside>

                            {/* Main Document Panel */}
                            <div className="er-reader-canvas">
                                {readerLoading ? (
                                    <div className="er-reader-loading">
                                        <div className="reader-spinner"></div>
                                        <p>Rendering digital document framework...</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="er-reader-page-sheet"
                                        style={{ transform: `scale(${readerZoom / 100})`, transformOrigin: 'top center' }}
                                    >
                                        {readerPages[readerPage - 1]?.content}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reader Footer Info Bar */}
                        <div className="er-reader-footer-bar">
                            <span>University Academic Repository Services</span>
                            <span>Secure Connection (HTTPS)</span>
                            <span>Document ID: er_uuid_{readingResource.id}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MOCK DOWNLOAD PROGRESS TOAST OVERLAY ══════════ */}
            {downloadingResource && (
                <div className="er-download-overlay-toast">
                    <div className="er-dl-toast-content">
                        <div className="er-dl-toast-spinner"></div>
                        <div className="er-dl-toast-info">
                            <span className="er-dl-toast-title">Downloading Digital E-Resource...</span>
                            <span className="er-dl-toast-name">{downloadingResource.title}</span>
                            <div className="er-dl-progress-container">
                                <div className="er-dl-progress-bar" style={{ width: `${downloadProgress}%` }}></div>
                            </div>
                            <span className="er-dl-toast-percent">{downloadProgress}% completed ({downloadingResource.size || '3.5 MB'})</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ TOAST ALERTS NOTIFICATIONS CONTAINER ══════════ */}
            <div className="er-toasts-container">
                {toasts.map(t => (
                    <div key={t.id} className={`er-toast er-toast-${t.type}`}>
                        <span className="er-toast-icon">
                            {t.type === 'success' && '✓'}
                            {t.type === 'info' && '🛈'}
                            {t.type === 'warning' && '⚠'}
                        </span>
                        <span className="er-toast-msg">{t.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EResources;
