/*jshint esversion: 8 */
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }));

// Load local JSON files directly
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

let reviews = reviews_data.reviews || reviews_data;
let dealerships = dealerships_data.dealerships || dealerships_data;

// Express route to home
app.get('/', async (req, res) => {
  res.send("Welcome to the Dealership API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  res.json(reviews);
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = reviews.filter(r => r.dealership === id);
  res.json(result);
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  res.json(dealerships);
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  const state = req.params.state.toLowerCase();
  const result = dealerships.filter(d => d.state && d.state.toLowerCase() === state);
  res.json(result);
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = dealerships.filter(d => d.id === id);
  res.json(result);
});

// Express route to insert review
app.post('/insert_review', async (req, res) => {
  try {
    let data = req.body;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    const new_id = reviews.length > 0 ? Math.max(...reviews.map(r => r.id || 0)) + 1 : 1;
    const newReview = { id: new_id, ...data };
    reviews.push(newReview);
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});