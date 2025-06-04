import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");
  const [scholarships, setScholarships] = useState([]);

  const fetchScholarships = async () => {
    try {
      const params = {};
      if (year) params.year = year;
      if (course) params.course = course;
      const res = await axios.get("http://localhost:5000/api/scholarships", {
        params,
      });
      setScholarships(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchScholarships();
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Scholarship Finder (MERN)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Year (e.g. 1st, 2nd, final):
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 3rd"
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>
            Course (e.g. UG, PG, Btech):
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. UG"
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
        <button type="submit" style={{ marginTop: 15 }}>
          Search
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        {scholarships.length === 0 ? (
          <p>No scholarships found.</p>
        ) : (
          scholarships.map((sch) => (
            <div
              key={sch._id}
              style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
            >
              <h3>{sch.title}</h3>
              <p>
                <strong>Award:</strong> {sch.award}
              </p>
              <p>
                <strong>Eligibility:</strong> {sch.eligibility}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
