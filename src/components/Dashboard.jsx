import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [range, setRange] = useState('');
  const [rating, setRating] = useState('');
  const [locations, setLocations] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([
    'restaurant',
    'hospital',
    'park',
    'parking',
    'shopping_mall',
    'cafe',
    'gas_station',
  ]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddLocation = () => {
    if (selectedCategory && range && rating) {
      const newLocation = {
        category: selectedCategory,
        range,
        rating,
      };
      setLocations([...locations, newLocation]);
      // Clear the input fields after adding a location
      setSelectedCategory('');
      setRange('');
      setRating('');
    } else {
      // Display an error or alert for incomplete inputs
      alert('Please fill in all fields');
    }
  };

  const handleDeleteLocation = (index) => {
    const updatedLocations = [...locations];
    const deletedLocation = updatedLocations.splice(index, 1)[0];
    setLocations(updatedLocations);

    // Add the deleted category back to dropdown options
    setDropdownOptions((options) => [...options, deletedLocation.category]);
  };

  const handleSubmit = () => {
    // Pass the locations state variable to MyComponent
    navigate('/mycomponent', { state: { locations } });
  };

  return (
    <div className="Dashboard">
      <div className='Dashboard-main'>
      <div className="container ">
        <h1>Welcome to Highway Alerts</h1>
      </div>
      <div className="container border border-dark rounded pt-3">
        <div className="row">
          <div className="col-sm">
            <div className="dropdown">
              <select
                name="category"
                id="category"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                <option value="">Select Category</option>
                {dropdownOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm">
            <div className="input-group mb-3">
              <input type="text" className="form-control" placeholder="Range" aria-label="Recipient's username" aria-describedby="basic-addon2" value={range} onChange={(e) => setRange(e.target.value)}/>
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2"> In Kms. </span>
              </div>
            </div>
          </div>
          <div className="col-sm">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter rating 0-5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div className="col-sm">
            <button type="button" className="btn btn-primary" onClick={handleAddLocation} >  Add  </button>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="container border">
          {locations.map((location, index) => (
            <div className="row" key={index}>
              <div className="col-sm">{location.category}</div>
              <div className="col-sm">{location.range}</div>
              <div className="col-sm">{location.rating}</div>
              <div className="col-sm">
                <button type="button" className="btn btn-danger" onClick={() => handleDeleteLocation(index)}>  Delete </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container">
      <button type="button" className="btn btn-dark" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
    </div>
    
  );
}