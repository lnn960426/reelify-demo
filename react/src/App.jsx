import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import HomeView from './views/HomeView/HomeView';
import LoginView from './views/LoginView/LoginView';
import LogoutView from './views/LogoutView';
import RegisterView from './views/RegisterView/RegisterView';
import UserProfileView from './views/UserProfileView/UserProfileView';
import MainNav from './components/MainNav/MainNav';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer/Footer';
import BrowseMovies from './views/BrowseMoviesView/BrowseMovies';
import AdminAddMovies from './views/AdminAddMovies/AdminAddMovies';
import AdminAccountManagement from './views/AdminAccountManagement/AdminAccountManagement';
import ErrorPage from './views/ErrorPage/ErrorPage';
import AdminDashboard from './views/AdminDashboard/AdminDashboard';



export default function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div id="app">
        <MainNav />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route
              path="/browseMovies"
              element={
                <ProtectedRoute roles={['USER']}>
                  <BrowseMovies />
                </ProtectedRoute>
              } />

            <Route path="/login" element={<LoginView />} />
            <Route path="/logout" element={<LogoutView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route
              path="/userProfile"
              element={
                <ProtectedRoute roles={['USER']}>
                  <UserProfileView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/add-movies"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminAddMovies />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/account-management"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminAccountManagement />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<ErrorPage />} />

          </Routes>
        </main>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
