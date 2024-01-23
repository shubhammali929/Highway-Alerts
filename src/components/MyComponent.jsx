import React, { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
const containerStyle = {
  width: '80vw',
  height: '80vh'
};

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCEDPL.....lzgYpec8Yk" 
  });

  const [map, setMap] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [park, setParks] = useState([]);
  const [hospital, setHospitals] = useState([]);
  const [parking, setParkings] = useState([]);
  const [cafe, setCafes] = useState([]);
  const [shopping_mall, setShopping_malls] = useState([]);
  const [gas_station, setGas_stations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const fetchNearbyLocations = async (location, radius, keyword) => {
    try{
      const response = await fetch (
        `http://localhost:3001/api/places?location=${location.lat},${location.lng}&radius=${radius}&keyword=${keyword}&key=AIzaS.....nzoNW0y_gzmk`
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
      }catch(error){
        console.log('Error fetching nearby location')
      }

  }
  // const fetchNearbyRestaurants = async (location) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/api/places?location=${location.lat},${location.lng}&radius=5000&keyword=restaurant&key=AIzaSyBdX-NUL9qM2og-93MWzi_nzoNW0y_gzmk`
  //     );
  //     const data = await response.json();
  //     console.log('Fetched restaurant data:', data);
  //     setRestaurants(data.results);
  //   } catch (error) {
  //     console.error('Error fetching nearby restaurants:', error);
  //   }
  // };

  // const fetchNearbyGyms = async (location) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/api/places?location=${location.lat},${location.lng}&radius=2000&keyword=gym&key=AIzaSyBdX-NUL9qM2og-93MWzi_nzoNW0y_gzmk`
  //     );
  //     const data = await response.json();
  //     console.log('Fetched gym data:', data);
  //     setGyms(data.results);
  //   } catch (error) {
  //     console.error('Error fetching nearby gyms:', error);
  //   }
  // };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setUserLocation({ lat: userLat, lng: userLng });
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          //----------------------------------------------------------------get locations from here-----------------------------------------------------------------------------
          fetchNearbyLocations({lat: userLat, lng: userLng},2000, 'gyms')
          // fetchNearbyRestaurants({ lat: userLat, lng: userLng });
          // fetchNearbyGyms({ lat: userLat, lng: userLng });
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
    // Fetch nearby restaurants and gyms when the component mounts
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
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.place_id}
          position={{
            lat: restaurant.geometry.location.lat,
            lng: restaurant.geometry.location.lng,
          }}
          onClick={() => handleMarkerClick(restaurant)}
        />
      ))}

      {gyms.map((gym) => (
        <Marker
          key={gym.place_id}
          position={{
            lat: gym.geometry.location.lat,
            lng: gym.geometry.location.lng,
          }}
          onClick={() => handleMarkerClick(gym)}
        />
      ))}
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
      {/* <img src={selectedMarker.icon} alt="" style={{ maxWidth: '50%', marginBottom: '5px' }} /> */}
      <p>{selectedMarker.vicinity}</p>
      {/* <p>IsOpen? : {selectedMarker.opening_hours.open_now}</p> */}
      <p>Rating : {selectedMarker.rating}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : <></>;
}

export default React.memo(MyComponent);
