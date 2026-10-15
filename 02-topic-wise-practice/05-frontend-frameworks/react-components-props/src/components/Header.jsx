// Receives plain string props
function Header({ title, subtitle }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export default Header;
