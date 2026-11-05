import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import { useCarUiStore } from '../store/useCarUiStore';
import CarCard from '../components/CarCard';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const favoriteCarIds = useCarUiStore(
    (state) => state.favoriteCarIds
  );

  const removeFavorite = useCarUiStore(
    (state) => state.removeFavorite
  );

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
    const confirmed = window.confirm(
      'Czy na pewno chcesz usunąć ten samochód?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCar(id);

      removeFavorite(id);

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

  if (cars.length === 0) {
    return <p>Brak samochodów w bazie danych.</p>;
  }

  return (
    <section>
      <h1>Lista samochodów</h1>

      <div className="cars-toolbar">
        <input
          type="search"
          placeholder="Szukaj po marce lub modelu..."
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
      </div>

      {visibleCars.length === 0 ? (
        <p>Nie znaleziono samochodów.</p>
      ) : (
        <ul>
          {visibleCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
