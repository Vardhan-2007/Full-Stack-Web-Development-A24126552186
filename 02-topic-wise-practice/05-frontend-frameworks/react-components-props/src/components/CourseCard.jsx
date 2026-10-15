import Badge from './Badge';
import TopicList from './TopicList';

// Receives several props, passes some of them down to child components,
// and uses conditional rendering for the lab badge.
function CourseCard({ code, title, faculty, credits, hasLab, topics }) {
  return (
    <article className="card">
      <div className="card-top">
        <span className="code">{code}</span>
        <Badge text={`${credits} credits`} />
        {hasLab ? <Badge text="Lab" variant="lab" /> : null}
      </div>
      <h3>{title}</h3>
      <p className="faculty">Faculty: {faculty}</p>
      <TopicList topics={topics} />
    </article>
  );
}

export default CourseCard;
