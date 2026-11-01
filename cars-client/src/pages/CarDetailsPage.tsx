import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';

export default function CarDetailsPage() {
  const { id } = useParams();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Nie podano identyfikatora samochodu.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    getCarById(id, controller.signal)
      .then((data) => {
        setCar(data);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Nie udało się pobrać samochodu.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return <p>Ładowanie danych samochodu...</p>;
  }

  if (error) {
    return <p>Błąd: {error}</p>;
  }

  if (!car) {
    return <p>Nie znaleziono samochodu.</p>;
  }

  return (
    <section>
      <h1>
        {car.brand} {car.model}
      </h1>

      <p><strong>ID:</strong> {car.id}</p>
      <p><strong>Marka:</strong> {car.brand}</p>
      <p><strong>Model:</strong> {car.model}</p>
      <p><strong>Liczba drzwi:</strong> {car.doorsNumber}</p>
      <p><strong>Pojemność bagażnika:</strong> {car.luggageCapacity} l</p>
      <p><strong>Pojemność silnika:</strong> {car.engineCapacity} cm³</p>
      <p><strong>Rodzaj paliwa:</strong> {car.fuelType}</p>
      <p><strong>Data produkcji:</strong> {car.productionDate}</p>
      <p><strong>Średnie spalanie:</strong> {car.averageFuelConsumption} l/100 km</p>
      <p><strong>Typ nadwozia:</strong> {car.bodyType}</p>

      <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
      {' | '}
      <Link to="/cars">Powrót do listy samochodów</Link>
    </section>
  );
}
