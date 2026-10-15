// Renders a list from an array prop, with a fallback when the array is empty
function TopicList({ topics }) {
  if (topics.length === 0) {
    return <p className="muted">Topics not announced yet.</p>;
  }
  return (
    <ul className="topics">
      {topics.map(topic => (
        <li key={topic}>{topic}</li>
      ))}
    </ul>
  );
}

export default TopicList;
