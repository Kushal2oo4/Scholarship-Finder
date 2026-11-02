import React from 'react';
import useSaved from '../hooks/useSaved';
import SaveButton from '../components/SaveButton';
import './AllScholarships.css';

const SavedScholarships = () => {
  const { saved, isSaved, toggleSave } = useSaved();

  return (
    <div className="list-container">
      <h2>Saved Scholarships</h2>

      {saved.length === 0 ? (
        <p className="center-text">
          You have not saved any scholarships yet. Use the Save button on any scholarship.
        </p>
      ) : (
        <ul className="scholarship-list">
          {saved.map((sch) => (
            <li key={sch._id} className="scholarship-item">
              <div className="scholarship-header">
                <h3>{sch.title}</h3>
                <a href={sch.url} target="_blank" rel="noopener noreferrer" className="apply-button">
                  Apply Now
                </a>
              </div>
              <p><strong>Amount:</strong> {sch.amount || 'N/A'}</p>
              <p><strong>Deadline:</strong> {sch.deadline || 'N/A'}</p>
              <p><strong>Required GPA:</strong> {sch.gpa ?? 'Any'}</p>
              <SaveButton saved={isSaved(sch.url)} onClick={() => toggleSave(sch)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedScholarships;
