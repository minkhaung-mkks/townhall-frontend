import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkDetail from './pages/WorkDetail';
import Profile from './pages/Profile';
import MyWorks from './pages/MyWorks';
import CreateWork from './pages/CreateWork';
import EditWork from './pages/EditWork';
import AdminUsers from './pages/AdminUsers';
import AdminWorks from './pages/AdminWorks';
import AdminComments from './pages/AdminComments';
import AdminCategories from './pages/AdminCategories';
import EditorDashboard from './pages/EditorDashboard';
import NotFound from './pages/NotFound';

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
                            
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/my-works" element={
                                <ProtectedRoute>
                                    <MyWorks />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/create-work" element={
                                <ProtectedRoute>
                                    <CreateWork />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/edit-work/:id" element={
                                <ProtectedRoute>
                                    <EditWork />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/editor-dashboard" element={
                                <ProtectedRoute allowedRoles={['editor', 'admin']}>
                                    <EditorDashboard />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/admin/users" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminUsers />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/admin/works" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminWorks />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/admin/comments" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminComments />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/admin/categories" element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminCategories />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;