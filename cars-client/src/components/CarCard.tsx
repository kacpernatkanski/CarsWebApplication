import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';

interface CarCardProps {
  car: Car;
  onDelete: (id: string) => void;
}

export default function CarCard({ car, onDelete }: CarCardProps) {
  const isFavorite = useCarUiStore(
    (state) => state.favoriteCarIds.includes(car.id)
  );

  const toggleFavorite = useCarUiStore(
    (state) => state.toggleFavorite
  );

  return (
    <li>
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
        className={
          isFavorite
            ? 'favorite-button active-favorite'
            : 'favorite-button'
        }
        onClick={() => toggleFavorite(car.id)}
      >
        {isFavorite ? 'Ulubiony' : 'Ulubione'}
      </button>

      {' | '}

      <button
        type="button"
        onClick={() => onDelete(car.id)}
      >
        Usuń
      </button>
    </li>
  );
}
