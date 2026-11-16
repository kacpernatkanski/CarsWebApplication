import { Link } from 'react-router';

export default function AboutPage() {
  return (
    <section>
      <h1>O aplikacji</h1>

      <p>
        Cars Client to aplikacja internetowa służąca do
        przeglądania i zarządzania samochodami.
      </p>

      <h2>Funkcjonalności</h2>

      <ul>
        <li>Wyświetlanie listy i szczegółów samochodów</li>
        <li>Dodawanie i edytowanie samochodów</li>
        <li>Usuwanie samochodów przez administratora</li>
        <li>Wyszukiwanie i oznaczanie ulubionych samochodów</li>
        <li>Rejestracja i logowanie użytkowników</li>
        <li>Potwierdzanie adresu e-mail i resetowanie hasła</li>
        <li>Autoryzacja na podstawie tokenów JWT i ról użytkowników</li>
      </ul>

      <h2>Wykorzystane technologie</h2>

      <ul>
        <li>React i TypeScript</li>
        <li>React Router</li>
        <li>Axios</li>
        <li>Zustand</li>
        <li>ASP.NET Core Web API</li>
        <li>ASP.NET Core Identity i JWT</li>
        <li>SQLite</li>
      </ul>

      <p>
        Aplikacja została przygotowana w ramach laboratoriów
        z przedmiotu Aplikacje webowe i sieciowe.
      </p>

      <Link to="/">Powrót do strony głównej</Link>
    </section>
  );
}
