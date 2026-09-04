import { Link } from 'react-router-dom';

export default function Placeholder({ title, message }) {
  return (
    <main className="page-shell">
      <section className="auth-card placeholder-card">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">+</div>
          <span>Conecta+</span>
        </div>
        <div className="auth-heading">
          <p className="eyebrow">Próxima etapa</p>
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
        <Link className="primary-button button-link" to="/login">Voltar ao login</Link>
      </section>
    </main>
  );
}
