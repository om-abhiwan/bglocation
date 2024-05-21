import { useEffect, useState } from 'react';
import './App.css'


const App = () => {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp,
          };
          setLocations((prevLocations) => [...prevLocations, newLocation]);
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watcher);
      };
    } else {
      setError('Geolocation is not supported by this browser.');
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
