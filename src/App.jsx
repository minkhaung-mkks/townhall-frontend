import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkDetail from './pages/WorkDetail';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/work/:id" element={<WorkDetail />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;