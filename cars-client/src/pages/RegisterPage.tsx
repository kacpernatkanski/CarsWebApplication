import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { register } from '../services/authService';

export default function RegisterPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      const result = await register({
        userName,
        email,
        password,
      });

      setMessage(result);
    } catch {
      setError('Nie udało się zarejestrować konta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Rejestracja</h1>

      {message && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="car-form" onSubmit={handleSubmit}>
        <label>
          Nazwa użytkownika
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            required
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Hasło
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </button>
      </form>

      <p>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </section>
  );
}
