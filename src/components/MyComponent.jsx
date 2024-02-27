import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Animation from './Animation';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SpeechRecognitionComponent from './SpeechRecognitionComponent';
// import { AdvancedMarkerElement } from '@googlemaps/marker'; 
// import { AdvancedMarkerElement } from '@react-google-maps/api';



const containerStyle = {
  width: '90vw',
  height: '75vh',
  borderRadius: '20px',
  border:'2px solid gray'
};



const calculateDistance = (point1, point2) => {// Helper function to calculate distance between two points
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
  const { transcript, browserSupportsSpeechRecognition , resetTranscript } = useSpeechRecognition();
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
  const [animation, setAnimation] = useState(null);
  const [speechInputText, setSpeechInputText] = useState('');
  const [isListening, setIsListening] = useState(false); 
 const [isProcessingNextLocation, setIsProcessingNextLocation] = useState(false);


  const location = useLocation();
  const submittedData = location.state?.locations || [];
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCEDPL-K9wz3yqfQ-WygYXm7lzgYpec8Yk" 
  });


  const convertToSpeech = async (text) => {
    return new Promise((resolve) => {
      console.log('convertToSpeech start');
      setAnimation('speaking');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = window.speechSynthesis.getVoices()[1];

      utterance.onend = () => {
        console.log('convertToSpeech end');
        setAnimation(null);
        resolve(); // Resolve the promise
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const listenToUser = async () => {
    return new Promise((resolve) => {
      console.log('listenToUser start');
      if (!browserSupportsSpeechRecognition) {
        console.log("YOUR BROWSER DOES NOT SUPPORT SPEECH RECOGNITION");
        resolve(); // Resolve the promise
        return;
      }
  
      setAnimation('listening');
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
      console.log('Listening starts');
  
      // Reset transcript before listening to a new input
      resetTranscript();
  
      const listeningTimeout = setTimeout(() => {
        SpeechRecognition.stopListening();
        console.log('Listening stops');
  
        // Use the transcript to update speechInputText after stopping listening
        setSpeechInputText(transcript);
        console.log('Spoken Text:', transcript);
  
        // Reset transcript to an empty string after capturing the spoken text
        resetTranscript();
  
        setAnimation(null);
        resolve(); // Resolve the promise
      }, 5000);
  
      // Add an event listener for SpeechRecognition.onEnd to handle unexpected stops
      SpeechRecognition.onEnd = () => {
        console.log('Listening ended unexpectedly');
        clearTimeout(listeningTimeout); // Clear the timeout
        setAnimation(null);
        resolve(); // Resolve the promise
      };
    });
  };
  

  
  
  
  
  
  const renderMarkers = (locations, onClickCallback) => {
  
    return locations.map((location) => {
      // Find the corresponding submitted data for this location
      const matchingData = submittedData.find((data) => data.category === location.types[0]);  
      // Add a condition to check if the rating is greater than or equal to matchingData.rating
      return matchingData && location.rating >= matchingData.rating && (
        <Marker
          key={location.name}
          position={{
            lat: location.geometry.location.lat,
            lng: location.geometry.location.lng,
          }}
          onClick={() => onClickCallback(location)}
        />
      );
    });
  };
  
  useEffect(() => {
    processLocationQueue();
  }, [locationQueue, isProcessingNextLocation]);

  

  const processLocationQueue = async () => {
    if (locationQueue.length > 0) {
      const { name, distance, rating } = locationQueue[0];
      console.log(`There is ${name} at the distance of ${distance.toFixed(2)} km having a rating of ${rating} stars`);
      await convertToSpeech(`There is ${name} at the distance of ${distance.toFixed(2)} km having a rating of ${rating} stars, do you want to add this location to your map?`);
      await listenToUser();
      setLocationQueue((prevQueue) => prevQueue.slice(1));
      setIsProcessingNextLocation(true);
    }
  };

  const fetchNearbyLocations = async (location, radius, keyword, rating) => {
    try{
      const response = await fetch (
        `http://localhost:3001/api/places?location=${location.lat},${location.lng}&radius=${radius}&keyword=${keyword}&key=AIzaSyBdX-NUL9qM2og-93MWzi_nzoNW0y_gzmk`
        )
        const data = await response.json();
        console.log(`Fetched locations of type ${keyword} -->>`,data);

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
          .filter((result) => result.geometry && result.geometry.location && result.rating >= rating)
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
          submittedData.forEach(element => {//ITERATING OVER SUBMITTED DATA AND CALLING fetchNearbyLocations
            fetchNearbyLocations({lat: userLat, lng: userLng},element.range*1000, element.category,element.rating)
          });
        },
        (error) => console.error('Error getting user location:', error) );
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

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  return isLoaded ? (
    <div className='map'>
      <div className="heading">
        Welcome To Highway Alerts
      </div>
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
        <img src={selectedMarker.icon} alt="" style={{ width: '20%',height:'20%', marginBottom: '5px' }} />
        <p>{selectedMarker.vicinity}</p>
        </div>
        <p>Rating : {selectedMarker.rating}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <SpeechRecognitionComponent/>
      <div className="bottom">
        <div className="vertical">
        <img src="https://cdn-icons-png.flaticon.com/128/12320/12320298.png" alt="" />
        <img src="https://cdn-icons-png.flaticon.com/128/9068/9068771.png" alt="" />
        </div>
        <Animation Animation={animation}/>
        <div className="vertical">
        <div className="count">
        <img src="https://cdn-icons-png.flaticon.com/128/4457/4457168.png" alt="" />
        <p>21</p>
        </div>
        <img src="https://cdn-icons-png.flaticon.com/128/10152/10152161.png" alt="" />
      
        </div>
        </div>
    </div>
  ) : <></>;
}
export default React.memo(MyComponent);