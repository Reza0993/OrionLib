import './SeamlessAccess.css';

const FEATURES = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
        ),
        title: 'Digital Loans',
        description: 'Borrow digital resources directly to your personal device.',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        ),
        title: 'Study Spaces',
        description: 'Reserve individual and group collaborative rooms in seconds.',
    },
];

const UPCOMING_EVENTS = [
    {
        id: 1,
        month: 'OCT',
        day: '12',
        title: 'Research Methodology Workshop',
        time: '10:00 AM · Hall 4th',
    },
    {
        id: 2,
        month: 'OCT',
        day: '18',
        title: 'Digital Archive Unveiling',
        time: '02:00 PM · Online',
    },
    {
        id: 3,
        month: 'OCT',
        day: '21',
        title: 'Visiting Author Seminar',
        time: '11:00 AM · Room 205',
    },
];

function SeamlessAccess({ onLoginClick }) {
    return (
        <section className="seamless" id="research">
            <div className="seamless__container container">
                {/* Left column */}
                <div className="seamless__left">
                    <h2 className="seamless__title">
                        Seamless Access to<br />Global Knowledge
                    </h2>
                    <p className="seamless__desc">
                        The Star Library system integrates digital repositories with
                        traditional physical collections. Whether you need a 17th-century
                        manuscript or the latest peer-reviewed journal article, our platform
                        makes discovery effortless.
                    </p>

                    <div className="seamless__features">
                        {FEATURES.map((f) => (
                            <div key={f.title} className="seamless__feature">
                                <div className="seamless__feature-icon">{f.icon}</div>
                                <div>
                                    <h4 className="seamless__feature-title">{f.title}</h4>
                                    <p className="seamless__feature-desc">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="seamless__cta"
                        onClick={onLoginClick}
                        id="seamless-get-started"
                    >
                        Get Started Today
                    </button>
                </div>

                {/* Right column – upcoming events */}
                <div className="seamless__right">
                    <div className="events-card">
                        <div className="events-card__header">
                            <h3 className="events-card__title">Upcoming Events</h3>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                        </div>

                        <div className="events-card__list">
                            {UPCOMING_EVENTS.map((ev) => (
                                <div key={ev.id} className="event-item" id={`event-${ev.id}`}>
                                    <div className="event-item__date">
                                        <span className="event-item__month">{ev.month}</span>
                                        <span className="event-item__day">{ev.day}</span>
                                    </div>
                                    <div className="event-item__info">
                                        <p className="event-item__title">{ev.title}</p>
                                        <p className="event-item__time">{ev.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SeamlessAccess;
