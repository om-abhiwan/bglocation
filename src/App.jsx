import { useEffect, useState } from 'react';
import "./App.css"
const App = () => {
  const [locations, setLocations] = useState(() => {
    // Initialize state from localStorage
    try {
      const savedLocations = localStorage.getItem('locations');
      return savedLocations ? JSON.parse(savedLocations) : [];
    } catch (e) {
      console.error('Error loading locations from localStorage', e);
      return [];
    }
  });
  const [error, setError] = useState(null);

  // Save locations to localStorage whenever locations state changes
  useEffect(() => {
    try {
      localStorage.setItem('locations', JSON.stringify(locations));
      console.log('Saved locations to localStorage:', locations);
    } catch (e) {
      console.error('Error saving locations to localStorage', e);
    }
  }, [locations]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp,
          };
          console.log('New location:', newLocation);
          setLocations((prevLocations) => [...prevLocations, newLocation]);
        },
        (err) => {
          setError(err.message);
          console.error('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watcher);
        console.log('Geolocation watcher cleared');
      };
    } else {
      setError('Geolocation is not supported by this browser.');
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <h1>PWA Geolocation Example</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <h2>Locations:</h2>
          <ul>
            {locations.map((location, index) => (
              <li key={index}>
                <strong>Latitude:</strong> {location.lat}, <strong>Longitude:</strong> {location.lng}, <strong>Timestamp:</strong> {new Date(location.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
