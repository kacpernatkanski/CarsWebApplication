import { NavLink, Outlet } from 'react-router';
import { useCarUiStore } from '../store/useCarUiStore';

export default function RootLayout() {
  const favoriteCount = useCarUiStore(
    (state) => state.favoriteCarIds.length
  );

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Strona główna</NavLink>
          {' | '}
          <NavLink to="/cars">Samochody</NavLink>
          {' | '}
          <NavLink to="/cars/new">Dodaj samochód</NavLink>

          <span className="favorite-counter">
            Ulubione: {favoriteCount}
          </span>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
