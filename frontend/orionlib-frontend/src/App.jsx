import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturedBooks from './components/FeaturedBooks';
import SeamlessAccess from './components/SeamlessAccess';
import AuthModal from './components/AuthModal';
import EditBookModal from './components/EditBookModal';
import BookDetails from './components/BookDetails';
import LoginPage from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { apiService } from './services/api';
import api from './services/api';

function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    // view: 'home' | 'login' | 'details' | 'dashboard'
    const [view, setView] = useState('home');
    const [activeBook, setActiveBook] = useState(null);

    // 1. Inisialisasi State Autentikasi Pengguna dari Local Storage (Pertemuan 7)
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('orion_token');
        if (token) {
            try {
                const payload = JSON.parse(window.atob(token.split('.')[1]));
                // Periksa jika token sudah kedaluwarsa (payload.exp dalam hitungan detik)
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    localStorage.removeItem('orion_token');
                    return null;
                }
                return payload;
            } catch {
                localStorage.removeItem('orion_token');
            }
        }
        return null;
    });

    const [userLibrary, setUserLibrary] = useState({ borrowed: [], saved: [] });

    // Load User Library
    const loadUserLibrary = async () => {
        if (!user) return;
        try {
            const response = await apiService.getUserLibrary();
            if (response.data.success) {
                setUserLibrary(response.data.data);
            }
        } catch (err) {
            console.error('Failed to load user library', err);
        }
    };

    // 2. Ambil Data Buku (GET) dari Database MySQL secara Asinkron
    const loadAllBooks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/books');
            if (response.data.success) setBooks(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal tersambung ke API Gateway OrionLib');
        } finally {
            setLoading(false);
        }
    };

    // 3. Efek untuk Memuat Katalog Buku pada Mount
    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                const response = await api.get('/books');
                if (active && response.data.success) setBooks(response.data.data);
            } catch (err) {
                if (active) setError(err.response?.data?.message || 'Gagal tersambung ke API Gateway OrionLib');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchData();
        return () => { active = false; };
    }, []);

    // 3b. Efek untuk memuat User Library saat user berubah
    useEffect(() => {
        if (user) loadUserLibrary();
        else setUserLibrary({ borrowed: [], saved: [] });
    }, [user]);

    // 3c. Efek untuk menangani response error 401 (Unauthorized/Token Kedaluwarsa) secara global
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    const msg = error.response.data?.message || "";
                    if (msg.includes("tidak valid") || msg.includes("kedaluwarsa") || msg.includes("Token tidak ada")) {
                        localStorage.removeItem('orion_token');
                        setUser(null);
                        setView('login');
                        alert("Sesi Anda telah berakhir. Silakan login kembali.");
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // 4. Handle Login Success
    const handleLoginSuccess = (userData) => {
        setUser(userData);
        setView('dashboard');
        window.scrollTo(0, 0);
    };

    // 5. Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('orion_token');
        setUser(null);
        setView('home');
        window.scrollTo(0, 0);
    };

    // 6. Handle Edit Buku
    const handleEditClick = (book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    // 6b. Handle Delete Buku
    const handleDeleteBook = async (bookId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) return;
        try {
            const response = await api.delete(`/books/${bookId}`);
            if (response.data.success) {
                loadAllBooks();
            }
        } catch (err) {
            alert('Gagal menghapus buku: ' + (err.response?.data?.message || err.message));
        }
    };

    // 7. Handle Book Card Click → Detail
    const handleBookClick = (book) => {
        setActiveBook(book);
        setView('details');
        window.scrollTo(0, 0);
    };

    // 8. Handle Borrow
    const handleBorrowBook = async (bookId) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        try {
            const res = await apiService.borrowBook(bookId);
            if (res.data.success) {
                alert("Berhasil meminjam buku!");
                loadAllBooks();
                loadUserLibrary();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Gagal meminjam buku");
        }
    };

    // 9. Handle Return
    const handleReturnBook = async (bookId) => {
        try {
            const res = await apiService.returnBook(bookId);
            if (res.data.success) {
                alert("Berhasil mengembalikan buku!");
                loadAllBooks();
                loadUserLibrary();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengembalikan buku");
        }
    };

    // 10. Handle Save / Reserve
    const handleToggleSaveBook = async (bookId, isSaved) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        try {
            if (isSaved) {
                await apiService.unsaveBook(bookId);
            } else {
                await apiService.saveBook(bookId);
            }
            loadUserLibrary();
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menyimpan buku");
        }
    };

    const isAdmin = user?.role === 'admin';

    // ── RENDER ──

    // Login Page (full-screen, no header/footer)
    if (view === 'login') {
        return (
            <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onGuestContinue={() => setView('home')}
            />
        );
    }

    // User Dashboard (full-screen, no header/footer)
    if (view === 'dashboard' && user) {
        return (
            <>
                {isAdmin ? (
                    <AdminDashboard
                        user={user}
                        onLogout={handleLogout}
                        books={books}
                        loading={loading}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteBook}
                        onAddNew={() => { setSelectedBook(null); setIsEditModalOpen(true); }}
                        onUpdateUser={setUser}
                        onGoHome={() => {
                            setView('home');
                            window.scrollTo(0, 0);
                        }}
                        loadAllBooks={loadAllBooks}
                    />
                ) : (
                    <UserDashboard 
                        user={user} 
                        onLogout={handleLogout} 
                        books={books}
                        loading={loading}
                        isAdmin={isAdmin}
                        userLibrary={userLibrary}
                        onEditClick={handleEditClick}
                        onDeleteClick={handleDeleteBook}
                        onAddNew={() => { setSelectedBook(null); setIsEditModalOpen(true); }}
                        onBorrowBook={handleBorrowBook}
                        onReturnBook={handleReturnBook}
                        onToggleSave={handleToggleSaveBook}
                        onBookClick={handleBookClick}
                        onUpdateUser={setUser}
                        onGoHome={() => {
                            setView('home');
                            window.scrollTo(0, 0);
                        }}
                    />
                )}
                {/* Edit Book Modal still available for admin */}
                {isEditModalOpen && (
                    <EditBookModal
                        isOpen={isEditModalOpen}
                        bookData={selectedBook}
                        onClose={() => { setIsEditModalOpen(false); setSelectedBook(null); }}
                        onEditSuccess={loadAllBooks}
                    />
                )}
            </>
        );
    }

    // Default: Public Homepage (home / details views)
    return (
        <div>
            {/* Header — shows on home & details */}
            <Header
                user={user}
                onLoginClick={() => setView('login')}
                onLogout={handleLogout}
                onDashboardClick={() => setView('dashboard')}
            />

            <main>
                {view === 'home' ? (
                    <>
                        {/* Section 1: Hero */}
                        <HeroSection onLoginClick={() => setView('login')} />

                        {/* Section 2: Curated / Featured Books */}
                        <FeaturedBooks
                            liveBooks={books}
                            loading={loading}
                            error={error}
                            isAdmin={isAdmin}
                            userLibrary={userLibrary}
                            onEditClick={handleEditClick}
                            onReloadBooks={loadAllBooks}
                            onBookClick={handleBookClick}
                            onBorrowBook={handleBorrowBook}
                            onToggleSave={handleToggleSaveBook}
                            onViewFullCatalog={() => {
                                if (user) {
                                    setView('dashboard');
                                    window.scrollTo(0, 0);
                                } else {
                                    setView('login');
                                }
                            }}
                        />

                        {/* Section 3: Seamless Access + Events */}
                        <SeamlessAccess onLoginClick={() => setView('login')} />
                    </>
                ) : (
                    <BookDetails
                        book={activeBook}
                        books={books}
                        userLibrary={userLibrary}
                        onBorrowBook={handleBorrowBook}
                        onToggleSave={handleToggleSaveBook}
                        onBack={() => setView('home')}
                    />
                )}
            </main>

            {/* AuthModal (kept as fallback for quick login if already on homepage) */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            {/* Edit Book Modal */}
            {isEditModalOpen && (
                <EditBookModal
                    isOpen={isEditModalOpen}
                    bookData={selectedBook}
                    onClose={() => { setIsEditModalOpen(false); setSelectedBook(null); }}
                    onEditSuccess={loadAllBooks}
                />
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;