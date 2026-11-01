import { NavLink, Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Strona główna</NavLink>
          {' | '}
          <NavLink to="/cars">Samochody</NavLink>
          {' | '}
          <NavLink to="/cars/new">Dodaj samochód</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
