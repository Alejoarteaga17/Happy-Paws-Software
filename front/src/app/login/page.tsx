'use client';

import { FormEvent, useEffect, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../../services/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseConfigured) {
        setCheckingSession(false);
        return;
      }

      const { data } = await getSupabaseClient().auth.getSession();
      if (data.session) window.location.href = '/';
      else setCheckingSession(false);
    };

    void checkSession();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage('Configura las variables públicas de Supabase para iniciar sesión.');
      return;
    }

    setLoading(true);
    const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    window.location.href = '/';
  };

  if (checkingSession) return <main className="login-shell"><p className="login-status">Comprobando sesión...</p></main>;

  return (
    <main className="login-shell">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="brand login-brand"><span className="brand-mark">HP</span><span>Happy Paws<small>Care Central</small></span></div>
        <p className="eyebrow">Acceso clínico</p>
        <h1 id="login-title">Inicia sesión</h1>
        <p className="login-description">Ingresa con tu cuenta autorizada para gestionar el registro de vacunas.</p>
        <form onSubmit={submit}>
          <label className="form-field">Correo electrónico<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vet@happypaws.com" /></label>
          <label className="form-field">Contraseña<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Tu contraseña" /></label>
          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          <button className="primary-button login-button" type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar al panel'}</button>
        </form>
      </section>
    </main>
  );
}