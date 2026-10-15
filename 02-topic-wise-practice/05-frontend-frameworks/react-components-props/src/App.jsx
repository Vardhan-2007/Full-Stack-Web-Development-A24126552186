import Header from './components/Header';
import CourseCard from './components/CourseCard';
import Panel from './components/Panel';

const courses = [
  { id: 1, code: 'CS301', title: 'Full Stack Development', faculty: 'Dr. Lakshmi', credits: 3, hasLab: true, topics: ['HTML', 'CSS', 'JavaScript', 'Node', 'React'] },
  { id: 2, code: 'CS302', title: 'Database Management Systems', faculty: 'Prof. Rao', credits: 4, hasLab: true, topics: ['ER model', 'SQL', 'Normalization'] },
  { id: 3, code: 'AM303', title: 'Machine Learning', faculty: 'Dr. Prasad', credits: 3, hasLab: false, topics: ['Regression', 'Classification', 'Clustering'] },
  { id: 4, code: 'HS304', title: 'Professional Ethics', faculty: 'Ms. Swathi', credits: 2, hasLab: false, topics: [] }
];

function App() {
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="app">
      <Header title="Semester Course Catalog" subtitle="B.Tech CSE (AI & ML), ANITS" />

      <Panel heading="Summary">
        <p>{courses.length} courses, {totalCredits} credits in total.</p>
      </Panel>

      <div className="grid">
        {courses.map(course => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
}

export default App;
