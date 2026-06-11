import './HeroSection.css';

const STATS = [
    { value: '50k+', label: 'Resources' },
    { value: '10k+', label: 'Students' },
    { value: '24/7', label: 'Digital Access' },
];

function HeroSection({ onLoginClick }) {
    return (
        <section className="hero" id="home">
            <div className="hero__container container">
                {/* Left column */}
                <div className="hero__left animate-fade-up">
                    {/* Announcement badge */}
                    <div className="hero__badge">
                        <span className="hero__badge-dot" />
                        New Academic Year Resources Available
                    </div>

                    <h1 className="hero__headline">
                        Empowering Minds through Boundless Discovery
                    </h1>

                    <p className="hero__subtext">
                        Access over 50,000 digital and physical resources from anywhere
                        in the world. Your gateway to scholarly research and academic
                        excellence begins here.
                    </p>

                    {/* Stats */}
                    <div className="hero__stats">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="hero__stat">
                                <span className="hero__stat-value">{stat.value}</span>
                                <span className="hero__stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button className="hero__cta" onClick={onLoginClick} id="hero-student-login">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                        Student Login
                    </button>
                </div>

                {/* Right column – library image card */}
                <div className="hero__right animate-fade-right">
                    <div className="hero__img-card">
                        <img
                            src="https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80&auto=format&fit=crop"
                            alt="Grand library interior"
                            className="hero__img"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('hero__img-card--fallback');
                            }}
                        />
                        <div className="hero__img-overlay" />
                        <div className="hero__img-caption">
                            <div className="hero__img-caption-tag">SPOTLIGHT</div>
                            <p className="hero__img-caption-text">Explore the Rare Manuscripts Collection</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
