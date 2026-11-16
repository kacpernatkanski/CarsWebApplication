import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';

interface CarCardProps {
  car: Car;
  index: number;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

export default function CarCard({
  car,
  index,
  isAdmin,
  onDelete,
}: CarCardProps) {
  const user = useAuthStore((state) => state.user);

  const favoriteCarIdsByUser = useCarUiStore(
    (state) => state.favoriteCarIdsByUser
  );

  const toggleFavorite = useCarUiStore(
    (state) => state.toggleFavorite
  );

  const favoriteCarIds = user
    ? favoriteCarIdsByUser[user.id] ?? []
    : [];

  const isFavorite = favoriteCarIds.includes(car.id);

  return (
    <li className="car-card">
      <div className="car-card-top">
        <span className="car-number">
          {String(index).padStart(3, '0')}
        </span>

        <span className="car-category">
          MOTOR / COLLECTION
        </span>
      </div>

      <div className="car-card-content">
        <h2>
          {car.brand}
          <span>{car.model}</span>
        </h2>

        <div className="car-specs">
          <span>{car.bodyType}</span>
          <span>{car.fuelType}</span>
          <span>
            {car.productionDate
              ? String(car.productionDate).slice(0, 4)
              : '—'}
          </span>
        </div>
      </div>

      <div className="car-card-actions">
        <Link to={`/cars/${car.id}`} className="car-details-link">
          Zobacz szczegóły <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className={
            isFavorite
              ? 'favorite-button active-favorite'
              : 'favorite-button'
          }
          onClick={() => {
            if (user) {
              toggleFavorite(user.id, car.id);
            }
          }}
        >
          {isFavorite ? '★ Ulubiony' : '☆ Ulubione'}
        </button>

        {isAdmin && (
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(car.id)}
          >
            Usuń
          </button>
        )}
      </div>
    </li>
  );
}
