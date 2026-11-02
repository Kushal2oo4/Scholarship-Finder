
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api/scholarships';

const AlertsBanner = () => {
  const { token } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [days, setDays] = useState(7);

  const loadAlerts = async () => {
    try {
      const res = await axios.get(API + '/alerts', {
        headers: { Authorization: 'Bearer ' + token },
      });

      setAlerts(res.data.alerts);
      setDays(res.data.alertDays);
    } catch (err) {
      console.error('Failed to load alerts', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadAlerts();
    }
  }, [token]);

  const handleDaysChange = async (e) => {
    const value = parseInt(e.target.value, 10);

    try {
      await axios.put(
        API + '/alert-days',
        { alertDays: value },
        { headers: { Authorization: 'Bearer ' + token } }
      );

      loadAlerts();
    } catch (err) {
      console.error('Failed to update alert days', err);
    }
  };

  return (
    <div className="alerts-banner">
      <label>
        Alert me about deadlines within{' '}
        <select value={days} onChange={handleDaysChange}>
          <option value={3}>3 days</option>
          <option value={7}>7 days</option>
          <option value={14}>14 days</option>
          <option value={30}>30 days</option>
        </select>
      </label>

      {alerts.length === 0 ? (
        <p className="no-data">
          No upcoming scholarship deadlines in this period.
        </p>
      ) : (
        <div className="alerts-list">
          {alerts.map((scholarship) => (
            <div key={scholarship._id} className="alert-item">
              <strong>{scholarship.title}</strong>
              <span>Deadline: {scholarship.deadline}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsBanner;
