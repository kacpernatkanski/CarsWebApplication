import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getCars(controller.signal)
      .then((data) => {
        setCars(data);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') {
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

      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            <strong>
              {car.brand} {car.model}
            </strong>
            {' - '}
            <Link to={`/cars/${car.id}`}>
              Szczegóły
            </Link>
            {' | '}
            <button
              type="button"
              onClick={() => handleDelete(car.id)}
            >
              Usuń
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
