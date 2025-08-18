import { useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function MainNav() {
  const { user } = useContext(UserContext);

  return (
    <nav id="main-nav">
      <div className="container">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <img src="/Logo.png" alt="Logo" className="app-logo" />
          </Link>

          <div className="nav-list">
            <div className="nav-link">
              <NavLink to="/">Home</NavLink>
            </div>

            {!user && (
              <>
                <div className="nav-link">
                  <NavLink to="/register" >Register</NavLink>
                </div>
                <div className="nav-link">
                  <NavLink to="/login" >Login</NavLink>
                </div>
               
              </>
            )}


            {user && (
              <>
                <div className="nav-link">
                  <NavLink to="/browseMovies">
                    Browse Movie
                  </NavLink>
                </div>
                <div className="nav-link">
                  <NavLink to="/userProfile">
                    Profile
                  </NavLink>
                </div>
                <div className="nav-link">
                  <Link to="/logout">
                    Logout
                  </Link>
                </div>
                <div className="nav-link">
                  <Link to="/admin/add-movies">
                    Admin
                  </Link>
                </div>
               
              </>
            )}
          </div>
        </div>
      </div>
    </nav>

  );
}
