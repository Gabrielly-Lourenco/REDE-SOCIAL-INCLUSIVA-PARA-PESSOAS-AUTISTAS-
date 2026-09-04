import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setStatus({ type: '', message: '' });
  }

  function validate() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!form.senha) {
      nextErrors.senha = 'Informe sua senha.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await loginUsuario(form);

      if (response?.token) {
        localStorage.setItem('authToken', response.token);
      } else if (response?.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
      }

      setStatus({
        type: 'success',
        message: 'Login realizado com sucesso! Redirecionando...'
      });

      setTimeout(() => navigate('/feed'), 500);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Não foi possível realizar o login.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">+</div>
          <span>Conecta+</span>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">Rede social inclusiva</p>
          <h1 id="login-title">Bem-vindo(a)!</h1>
          <p>Entre na sua conta para continuar.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seuemail@email.com"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span id="email-error" className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange}
              aria-invalid={Boolean(errors.senha)}
              aria-describedby={errors.senha ? 'senha-error' : undefined}
            />
            {errors.senha && <span id="senha-error" className="field-error">{errors.senha}</span>}
          </div>

          {status.message && (
            <div className={`status-message ${status.type}`} role="alert">
              {status.message}
            </div>
          )}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não possui uma conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </section>
    </main>
  );
}
