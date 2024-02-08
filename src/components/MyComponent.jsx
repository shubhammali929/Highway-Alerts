import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
const containerStyle = {
  width: '80vw',
  height: '80vh'
};
function convertToSpeech(text ) {
  
  // Check if the browser supports the SpeechSynthesis API
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: You can configure additional properties of the utterance here
    // For example: utterance.rate = 1.5; // Adjust the speed

    // Speak the text
    synth.speak(utterance);
  } else {
    alert('Your browser does not support the SpeechSynthesis API.');
  }
}


const renderMarkers = (locationQueue, onClickCallback) => {
  return locationQueue.map((location) => (
    <Marker
      key={location.name}
      position={{
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng,
      }}
      onClick={() => onClickCallback(location)}
    />
  ));
};
// Helper function to calculate distance between two points
const calculateDistance = (point1, point2) => {
  const lat1 = point1.lat;
  const lon1 = point1.lng;
  const lat2 = point2.lat;
  const lon2 = point2.lng;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
};
function MyComponent() {
  const location = useLocation();
  const submittedData = location.state?.locations || [];
  // console.log("s------->",submittedData)
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCEDPL-K9wz3yqfQ-WygYXm7lzgYpec8Yk" 
  });

  const [map, setMap] = useState(null);
  const [locationQueue, setLocationQueue] = useState([]); // Queue to store locations
  const [restaurant, setRestaurants] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [park, setParks] = useState([]);
  const [hospital, setHospitals] = useState([]);
  const [parking, setParkings] = useState([]);
  const [cafe, setCafes] = useState([]);
  const [shopping_mall, setShopping_malls] = useState([]);
  const [gas_station, setGas_stations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);


  useEffect(() => {
    // console.log("Location Queue:", locationQueue);
    // After logging, process the locationQueue
    processLocationQueue();
  }, [locationQueue]);
  
  const processLocationQueue = () => {
    if (locationQueue.length > 0) {
      const { name, distance, rating } = locationQueue[0];
      console.log(`There is ${name} at the distance of ${distance.toFixed(2)} km having a rating of ${rating}`);
      convertToSpeech(`There is ${name} at the distance of ${distance.toFixed(2)} km having a rating of ${rating} stars`);
      
  
      // Optionally, you can call the text-to-speech function here
      // Example: textToSpeech(`There is ${name} at the distance of ${distance} km having a rating of ${rating}`);
  
      // Remove the processed location from the queue
      setLocationQueue((prevQueue) => prevQueue.slice(1));
    }
  };



  const fetchNearbyLocations = async (location, radius, keyword) => {
    // const categoryToIcon = {
    //   restaurant: 'https://cdn-icons-png.flaticon.com/128/5695/5695138.png',
    //   gyms: 'https://cdn-icons-png.flaticon.com/128/5695/5695172.png',
    //   park: 'https://cdn-icons-png.flaticon.com/128/12348/12348378.png',
    //   hospital: 'https://cdn-icons-png.flaticon.com/128/4314/4314279.png',
    //   parking: 'https://cdn-icons-png.flaticon.com/128/2634/2634162.png',
    //   cafe: 'https://cdn-icons-png.flaticon.com/128/1183/1183374.png',
    //   shopping_mall: 'https://cdn-icons-png.flaticon.com/128/4287/4287689.png',
    //   gas_station: 'https://cdn-icons-png.flaticon.com/128/9922/9922079.png',
    // };
    try{
      const response = await fetch (
        `http://localhost:3001/api/places?location=${location.lat},${location.lng}&radius=${radius}&keyword=${keyword}&key=AIzaSyBdX-NUL9qM2og-93MWzi_nzoNW0y_gzmk`
        )
        const data = await response.json();
        console.log(`Fetched locations of type ${keyword} -->>`,data);


        // Filter out locations that are already in the locationQueue
    const newLocations = data.results.filter((result) => {
      const newLocationKey = `${result.geometry.location.lat}-${result.geometry.location.lng}`;
      return !locationQueue.some(
        (existingLocation) =>
          `${existingLocation.geometry.location.lat}-${existingLocation.geometry.location.lng}` === newLocationKey
      );
    });



        if(keyword === 'restaurant') {
          setRestaurants(data.results);
        } else if (keyword === 'gyms') {
          setGyms(data.results);
        } else if (keyword === 'park') {
          setParks(data.results);
        } else if (keyword === 'hospital') {
          setHospitals(data.results);
        } else if (keyword === 'parking') {
          setParkings(data.results);
        } else if (keyword === 'cafe') {
          setCafes(data.results);
        } else if (keyword === 'shopping_mall') {
          setShopping_malls(data.results);
        } else if (keyword === 'gas_station') {
          setGas_stations(data.results);
        }

        // Update the locationQueue with the new locations
      setLocationQueue((prevQueue) => [
        ...prevQueue,
        ...data.results
          .filter((result) => result.geometry && result.geometry.location)
          .map((result) => ({
            name: result.name,
            distance: calculateDistance(location, result.geometry.location),
            rating: result.rating || 'N/A',
            geometry: result.geometry,
          })),
      ]);
      }catch(error){
        console.log('Error fetching nearby location make sure you have started server.js')
      }

  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation({ lat: userLat, lng: userLng });

          //ITERATING OVER SUBMITTED DATA AND CALLING fetchNearbyLocations
          submittedData.forEach(element => {
            // console.log("category is :",element.category);
            // console.log("range is :",element.range*1000);
            // console.log("rating is :",element.rating)
            fetchNearbyLocations({lat: userLat, lng: userLng},element.range*1000, element.category)
          });
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          // fetchNearbyLocations({lat: userLat, lng: userLng},2000, 'gyms')
          // fetchNearbyLocations({lat: userLat, lng: userLng},2000, 'restaurant')
          // fetchNearbyLocations({lat: userLat, lng: userLng},3000, 'hospital')
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  };

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
    getUserLocation();
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    // Fetch nearby locations when the component mounts
    if (isLoaded) {
      getUserLocation();
    }
  }, [isLoaded]);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };


  


  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || { lat: -3.745, lng: -38.523 }}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {renderMarkers(restaurant, handleMarkerClick)}
      {renderMarkers(gyms, handleMarkerClick)}
      {renderMarkers(park, handleMarkerClick)}
      {renderMarkers(hospital, handleMarkerClick)}
      {renderMarkers(parking, handleMarkerClick)}
      {renderMarkers(cafe, handleMarkerClick)}
      {renderMarkers(shopping_mall, handleMarkerClick)}
      {renderMarkers(gas_station, handleMarkerClick)}
      
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            // url: 'https://cdn-icons-png.flaticon.com/128/7509/7509212.png', // Change the URL to your desired marker icon
            url: 'https://cdn-icons-png.flaticon.com/128/1783/1783356.png',
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
      )}

      {selectedMarker && (
        <InfoWindow
          position={{
            lat: selectedMarker.geometry.location.lat,
            lng: selectedMarker.geometry.location.lng,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          
            <div style={{ fontSize: '10px', maxWidth: '100px' }}>
      <h3 style={{ fontSize: '13px', margin: '0 0 1px' }}>{selectedMarker.name}</h3>
      <div className="temp" style={{display:'flex'}}>
      {/* <img src={selectedMarker.icon} alt="" style={{ width: '20%',height:'20%', marginBottom: '5px' }} /> */}
      <p>{selectedMarker.vicinity}</p>
      </div>
      {/* <p>IsOpen? : {selectedMarker.opening_hours.open_now}</p> */}
      <p>Rating : {selectedMarker.rating}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <></>;
}

export default React.memo(MyComponent);
