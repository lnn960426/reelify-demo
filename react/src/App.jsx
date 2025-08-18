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




export default function App() {

  return (
    <BrowserRouter>
    <ScrollToTop />
      <div id="app">
          <MainNav />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/browseMovies" element={<BrowseMovies />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/logout" element={<LogoutView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route
                path="/userProfile"
                element={
                  <ProtectedRoute>
                    <UserProfileView />
                  </ProtectedRoute>
                }
              />
              <Route 
              path="/admin/add-movies"
              element={
                <ProtectedRoute>
                  <AdminAddMovies />
                </ProtectedRoute>
              }
              />

            <Route 
              path="/admin/account-management"
              element={
                <ProtectedRoute>
                  <AdminAccountManagement />
                </ProtectedRoute>
              }
              />
          
              </Routes>
          </main>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
