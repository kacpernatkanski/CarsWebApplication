import { NavLink, Outlet, useNavigate } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

export default function RootLayout() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const favoriteCarIdsByUser = useCarUiStore(
    (state) => state.favoriteCarIdsByUser
  );

  const favoriteCount = user
    ? (favoriteCarIdsByUser[user.id] ?? []).length
    : 0;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <header>
        <nav className="site-nav">
          <NavLink to="/" className="brand-logo">
            KN GARAGE
          </NavLink>

          <div className="nav-links">
            <NavLink to="/" end>
              Strona główna
            </NavLink>

            {user && (
              <>
                <NavLink to="/cars" end>
                  Samochody
                </NavLink>
                <NavLink to="/cars/new">
                  Dodaj samochód
                </NavLink>
              </>
            )}

            <NavLink to="/about">
              O aplikacji
            </NavLink>
          </div>

          <div className="nav-account">
            {user ? (
              <>
                <span className="favorite-counter">
                  Ulubione / {favoriteCount}
                </span>

                <span className="user-info">
                  {user.userName}
                  <span className="user-role">
                    {user.roles.join(', ')}
                  </span>
                </span>

                <button
                  type="button"
                  className="nav-button"
                  onClick={handleLogout}
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  Logowanie
                </NavLink>
                <NavLink to="/register">
                  Rejestracja
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
