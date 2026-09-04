import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../services/api';

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    dataNascimento: '',
    senha: ''
  });
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

    if (!form.nome.trim()) {
      nextErrors.nome = 'Informe seu nome.';
    } else if (form.nome.trim().length < 2) {
      nextErrors.nome = 'Informe seu nome completo.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!form.dataNascimento) {
      nextErrors.dataNascimento = 'Informe sua data de nascimento.';
    } else {
      const birthDate = new Date(`${form.dataNascimento}T00:00:00`);
      const today = new Date();

      if (Number.isNaN(birthDate.getTime()) || birthDate > today) {
        nextErrors.dataNascimento = 'Informe uma data de nascimento válida.';
      }
    }

    if (!form.senha) {
      nextErrors.senha = 'Informe uma senha.';
    } else if (form.senha.length < 6) {
      nextErrors.senha = 'A senha deve possuir pelo menos 6 caracteres.';
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
      await cadastrarUsuario(form);

      setStatus({
        type: 'success',
        message: 'Conta criada com sucesso! Redirecionando para o login...'
      });

      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Não foi possível criar sua conta.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="auth-card" aria-labelledby="cadastro-title">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">+</div>
          <span>Conecta+</span>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">Comece sua jornada</p>
          <h1 id="cadastro-title">Criar conta</h1>
          <p>Preencha seus dados para entrar na plataforma.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Maria da Silva"
              value={form.nome}
              onChange={handleChange}
              aria-invalid={Boolean(errors.nome)}
              aria-describedby={errors.nome ? 'nome-error' : undefined}
            />
            {errors.nome && <span id="nome-error" className="field-error">{errors.nome}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="maria@email.com"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span id="email-error" className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="dataNascimento">Data de nascimento</label>
            <input
              id="dataNascimento"
              name="dataNascimento"
              type="date"
              autoComplete="bday"
              value={form.dataNascimento}
              onChange={handleChange}
              aria-invalid={Boolean(errors.dataNascimento)}
              aria-describedby={errors.dataNascimento ? 'data-error' : undefined}
            />
            {errors.dataNascimento && <span id="data-error" className="field-error">{errors.dataNascimento}</span>}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
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
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
