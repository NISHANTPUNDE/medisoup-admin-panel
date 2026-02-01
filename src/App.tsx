import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth/context/AuthContext';
import ProtectedRoute from './auth/components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLogin from './auth/pages/AdminLogin';
import SuperAdminLogin from './auth/pages/SuperAdminLogin';
import AdminList from './modules/Admin/pages/List';
import AdminView from './modules/Admin/pages/View';
import UserList from './modules/Users/pages/List';
import UserView from './modules/Users/pages/View';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/superadmin" element={<SuperAdminLogin />} />
        
        {/* Protected routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/admins" element={<AdminList />} />
            <Route path="/admins/:mode/:id" element={<AdminView />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:mode/:id" element={<UserView />} />
          </Route>
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;
