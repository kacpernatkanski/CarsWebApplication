import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState<NewCar | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        const { id: carId, ...carData } = data;
        setCar(carData);
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

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setCar((currentCar) => {
      if (!currentCar) {
        return currentCar;
      }

      return {
        ...currentCar,
        [name]: [
          'doorsNumber',
          'luggageCapacity',
          'engineCapacity',
          'fuelType',
          'averageFuelConsumption',
          'bodyType'
        ].includes(name)
          ? Number(value)
          : value
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !car) {
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await updateCar(id, car);
      navigate(`/cars/${id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się zaktualizować samochodu.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Ładowanie danych samochodu...</p>;
  }

  if (error && !car) {
    return <p>Błąd: {error}</p>;
  }

  if (!car) {
    return <p>Nie znaleziono samochodu.</p>;
  }

  return (
    <section>
      <h1>Edytuj samochód</h1>

      {error && <p>Błąd: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="brand">Marka:</label>
          <input
            id="brand"
            name="brand"
            value={car.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="model">Model:</label>
          <input
            id="model"
            name="model"
            value={car.model}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="doorsNumber">Liczba drzwi:</label>
          <input
            id="doorsNumber"
            name="doorsNumber"
            type="number"
            value={car.doorsNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="luggageCapacity">Pojemność bagażnika:</label>
          <input
            id="luggageCapacity"
            name="luggageCapacity"
            type="number"
            value={car.luggageCapacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="engineCapacity">Pojemność silnika:</label>
          <input
            id="engineCapacity"
            name="engineCapacity"
            type="number"
            value={car.engineCapacity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="fuelType">Rodzaj paliwa:</label>
          <input
            id="fuelType"
            name="fuelType"
            type="number"
            value={car.fuelType}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="productionDate">Data produkcji:</label>
          <input
            id="productionDate"
            name="productionDate"
            type="date"
            value={car.productionDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="averageFuelConsumption">
            Średnie spalanie:
          </label>
          <input
            id="averageFuelConsumption"
            name="averageFuelConsumption"
            type="number"
            step="0.1"
            value={car.averageFuelConsumption}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="bodyType">Typ nadwozia:</label>
          <input
            id="bodyType"
            name="bodyType"
            type="number"
            value={car.bodyType}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
      </form>
    </section>
  );
}
