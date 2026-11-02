import React from 'react';

const SaveButton = ({ saved, onClick }) => {
  return (
    <button type="button" className="save-button" onClick={onClick}>
      {saved ? '★ Saved' : '☆ Save'}
    </button>
  );
};

export default SaveButton;
