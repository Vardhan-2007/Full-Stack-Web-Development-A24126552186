// Uses the special "children" prop to wrap any content
function Panel({ heading, children }) {
  return (
    <section className="panel">
      <h2>{heading}</h2>
      {children}
    </section>
  );
}

export default Panel;
