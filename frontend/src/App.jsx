
import React, { useEffect, useState } from 'react';

function App() {
  const [occupations, setOccupations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching occupations');
    fetch('/getOccupations')
      .then((res) => res.json())
      .then((data) => {
        setOccupations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching occupations:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Occupations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {occupations.map((occ, index) => (
            <li key={index}>{occ.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
