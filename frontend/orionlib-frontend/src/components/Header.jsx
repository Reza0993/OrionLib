import { useState, useEffect } from 'react';
import './Header.css';

function Header({ user, onLoginClick, onLogout, onDashboardClick }) {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`orion-header ${scrolled ? 'orion-header--scrolled' : ''}`}>
            <div className="orion-header__inner">
                {/* Logo */}
                <a href="#" className="orion-header__logo">
                    <span className="orion-header__logo-icon">✦</span>
                    <span className="orion-header__logo-text">Orionlib</span>
                </a>

                {/* Nav */}
                <nav className="orion-header__nav" aria-label="Main Navigation">
                    <a href="#catalog" className="orion-header__nav-link">Catalog</a>
                    <a href="#reservations" className="orion-header__nav-link">Reservations</a>
                    <a href="#research" className="orion-header__nav-link">Research</a>
                </nav>

                {/* Search */}
                <div className="orion-header__search">
                    <svg className="orion-header__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        className="orion-header__search-input"
                        placeholder="Search books, authors, or ISBN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search books"
                    />
                </div>

                {/* Actions */}
                <div className="orion-header__actions">
                    <button className="orion-header__icon-btn" aria-label="Notifications">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </button>

                    {user ? (
                        <div className="orion-header__user">
                            <div
                                className="orion-header__avatar"
                                title={`${user.name || 'User'} – Go to Dashboard`}
                                onClick={onDashboardClick}
                                style={{cursor:'pointer'}}
                            >
                                {(user.name ? user.name.charAt(0) : 'U').toUpperCase()}
                            </div>
                            <button className="orion-header__logout" onClick={onLogout}>
                                Keluar
                            </button>
                        </div>
                    ) : (
                        <button className="orion-header__avatar orion-header__avatar--guest" onClick={onLoginClick} aria-label="Login">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;