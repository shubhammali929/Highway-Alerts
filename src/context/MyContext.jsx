import React, { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export const useMyContext = () => {
  return useContext(MyContext);
};

export const MyProvider = ({ children }) => {
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
    const [currLocationName, setCurrLocationName] = useState(null);
    const [isProcessingNextLocation, setIsProcessingNextLocation] = useState(false);

  return (
    <MyContext.Provider
      value={{map,setMap,locationQueue,setLocationQueue,restaurant,setRestaurants,gyms,setGyms,park,setParks,hospital, setHospitals, parking, setParkings, cafe, setCafes, shopping_mall, setShopping_malls, gas_station, setGas_stations,
        // ... (other state variables)
        userLocation,setUserLocation,selectedMarker,setSelectedMarker,animation,setAnimation,speechInputText,setSpeechInputText,isProcessingNextLocation,setIsProcessingNextLocation, currLocationName,setCurrLocationName}}
    >
      {children}
    </MyContext.Provider>
  );
};
