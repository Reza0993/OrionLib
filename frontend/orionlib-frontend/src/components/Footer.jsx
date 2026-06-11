import './Footer.css';

function Footer() {
    return (
        <footer className="orion-footer">
            <div className="orion-footer__inner container">
                <div className="orion-footer__brand">
                    <span className="orion-footer__logo">✦ Orionlab</span>
                </div>
                <nav className="orion-footer__links" aria-label="Footer Navigation">
                    <a href="#" className="orion-footer__link">Privacy Policy</a>
                    <a href="#" className="orion-footer__link">Terms of Service</a>
                    <a href="#" className="orion-footer__link">Library Clinic</a>
                    <a href="#" className="orion-footer__link">Contact Support</a>
                </nav>
                <p className="orion-footer__copy">
                    © {new Date().getFullYear()} Smart Orionlab System, University Academic Affairs
                </p>
            </div>
        </footer>
    );
}

export default Footer;