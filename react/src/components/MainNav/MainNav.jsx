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
               {user.role === 'USER' && (
                <div className="nav-link">
                  <NavLink to="/browseMovies">
                    Browse Movie
                  </NavLink>
                </div>
              )}

                {user.role === 'USER' && (
                <div className="nav-link">
                  <NavLink to="/userProfile">
                    Profile
                  </NavLink>
                </div>
                )}

                 {user.role === 'ADMIN' && (
                         <div className="nav-link">
                         <NavLink to="/admin/add-movies">
                           Dashboard
                         </NavLink>
                       </div>
                 )}

                <div className="nav-link">
                  <Link to="/logout">
                    Logout
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
