const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/places', async (req, res) => { 
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${new URLSearchParams(req.query)}&key=${process.env.REACT_APP_PLACES_AND_MAP_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
