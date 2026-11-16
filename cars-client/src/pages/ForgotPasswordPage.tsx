import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);

      const result = await forgotPassword(email);
      setMessage(result);
    } catch {
      setError('Nie udało się wysłać wiadomości.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Przypomnienie hasła</h1>

      <p>
        Podaj adres e-mail przypisany do konta.
        Otrzymasz wiadomość z linkiem do ustawienia nowego hasła.
      </p>

      {message && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="car-form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij link'}
        </button>
      </form>

      <p>
        <Link to="/login">Wróć do logowania</Link>
      </p>
    </section>
  );
}
