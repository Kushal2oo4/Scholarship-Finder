import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api/scholarships';

const useSaved = () => {
  const { token } = useAuth();
  const [saved, setSaved] = useState([]);

  const loadSaved = useCallback(async () => {
    try {
      const res = await axios.get(API + '/saved', {
        headers: { Authorization: 'Bearer ' + token },
      });
      setSaved(res.data);
    } catch (err) {
      console.error('Failed to load saved scholarships', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadSaved();
    }
  }, [token, loadSaved]);

  const isSaved = (url) => {
    return saved.some((scholarship) => scholarship.url === url);
  };

  const toggleSave = async (scholarship) => {
    const headers = { Authorization: 'Bearer ' + token };

    try {
      if (isSaved(scholarship.url)) {
        await axios.delete(API + '/save/' + scholarship._id, { headers });
      } else {
        await axios.post(API + '/save/' + scholarship._id, {}, { headers });
      }
      await loadSaved();
    } catch (err) {
      console.error('Failed to update saved scholarship', err);
    }
  };

  return { saved, isSaved, toggleSave };
};

export default useSaved;
