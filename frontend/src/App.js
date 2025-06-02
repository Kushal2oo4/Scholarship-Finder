import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    gpa: '',
    course: '',
    location: '',
    incomeStatus: '',
    specialCategory: ''
  });

  const [allScholarships, setAllScholarships] = useState([]);
  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // ✅ Fetch all scholarships on load
  useEffect(() => {
    axios.get('http://localhost:5000/api/scholarships')
      .then(response => setAllScholarships(response.data))
      .catch(error => {
        console.error('Error loading scholarships:', error);
        setErrorMsg('Failed to load scholarships.');
      });
  }, []);

  // 🧩 Handle input changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // 🚀 Handle form submit (filter scholarships)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/match', formData);
      setMatchedScholarships(res.data);
    } catch (error) {
      console.error('Error matching scholarships:', error);
      setErrorMsg('Error finding matching scholarships.');
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Reusable component
  const ScholarshipList = ({ title, scholarships }) => (
    <>
      <h2 style={{ marginTop: '2rem' }}>{title}</h2>
      {scholarships.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {scholarships.map((sch, i) => (
            <li key={i} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
              <strong style={{ fontSize: '1.1rem' }}>{sch.title}</strong><br />
              <p>{sch.description}</p>
              <a href={sch.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                Apply Here
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No scholarships found.</p>
      )}
    </>
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓 Scholarship Finder</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <input name="gpa" placeholder="GPA (e.g., 3.8)" value={formData.gpa} onChange={handleChange} required />
        <input name="course" placeholder="Course (e.g., Computer Science)" value={formData.course} onChange={handleChange} required />
        <input name="location" placeholder="Location (e.g., California)" value={formData.location} onChange={handleChange} />
        <input name="incomeStatus" placeholder="Income Status (e.g., Low)" value={formData.incomeStatus} onChange={handleChange} />
        <input name="specialCategory" placeholder="Special Category (e.g., First-gen)" value={formData.specialCategory} onChange={handleChange} />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Searching...' : 'Find Scholarships'}
        </button>
      </form>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {matchedScholarships.length > 0 && (
        <ScholarshipList title="🎯 Matched Scholarships" scholarships={matchedScholarships} />
      )}

      <ScholarshipList title="📚 All Scholarships" scholarships={allScholarships} />
    </div>
  );
}

export default App;
