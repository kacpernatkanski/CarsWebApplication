import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';

export default function CreateCarPage() {
  const navigate = useNavigate();

  const [car, setCar] = useState<NewCar>({
    brand: '',
    model: '',
    doorsNumber: 5,
    luggageCapacity: 0,
    engineCapacity: 0,
    fuelType: 1,
    productionDate: '',
    averageFuelConsumption: 0,
    bodyType: 1
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setCar((currentCar) => ({
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
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const createdCar = await createCar(car);
      navigate(`/cars/${createdCar.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Nie udało się dodać samochodu.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1>Dodaj samochód</h1>

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
          {saving ? 'Zapisywanie...' : 'Dodaj samochód'}
        </button>
      </form>
    </section>
  );
}
