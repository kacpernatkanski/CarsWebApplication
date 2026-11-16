import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';
import CarCard from '../components/CarCard';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles.includes('Admin') ?? false;

  const searchTerm = useCarUiStore(
    (state) => state.searchTerm
  );

  const setSearchTerm = useCarUiStore(
    (state) => state.setSearchTerm
  );

  const showFavoritesOnly = useCarUiStore(
    (state) => state.showFavoritesOnly
  );

  const setShowFavoritesOnly = useCarUiStore(
    (state) => state.setShowFavoritesOnly
  );

  const favoriteCarIdsByUser = useCarUiStore(
    (state) => state.favoriteCarIdsByUser
  );

  const removeFavorite = useCarUiStore(
    (state) => state.removeFavorite
  );

  const favoriteCarIds = user
    ? favoriteCarIdsByUser[user.id] ?? []
    : [];

  useEffect(() => {
    const controller = new AbortController();

    getCars(controller.signal)
      .then((data) => {
        setCars(data);
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Wystąpił nieznany błąd.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  async function handleDelete(id: string) {
    if (!isAdmin) {
      return;
    }

    const confirmed = window.confirm(
      'Czy na pewno chcesz usunąć ten samochód?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCar(id);

      if (user) {
        removeFavorite(user.id, id);
      }

      setCars((currentCars) =>
        currentCars.filter((car) => car.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się usunąć samochodu.'
      );
    }
  }

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite =
      !showFavoritesOnly ||
      favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
  });

  if (loading) {
    return <p>Ładowanie samochodów...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  return (
    <section className="collection-page">
      <div className="collection-heading">
        <div>
          <span className="eyebrow">
            01 / TWOJA KOLEKCJA
          </span>

          <h1>Samochody<span className="heading-dot">.</span></h1>

          <p className="collection-description">
            Wszystkie pojazdy. Jedna kolekcja.
          </p>
        </div>

        <div className="collection-stat">
          <strong>{String(cars.length).padStart(2, '0')}</strong>
          <span>POJAZDY W KOLEKCJI</span>
        </div>
      </div>

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Wyszukaj markę lub model..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <label className="favorite-filter">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) =>
              setShowFavoritesOnly(event.target.checked)
            }
          />
          Tylko ulubione
        </label>

        <span className="results-count">
          WYNIKI / {String(visibleCars.length).padStart(2, '0')}
        </span>
      </div>

      {cars.length === 0 ? (
        <p>Brak samochodów w bazie danych.</p>
      ) : visibleCars.length === 0 ? (
        <p>Nie znaleziono samochodów.</p>
      ) : (
        <ul className="cars-grid">
          {visibleCars.map((car, index) => (
            <CarCard
              key={car.id}
              car={car}
              index={index + 1}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
