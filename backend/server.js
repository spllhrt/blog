const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const userRoutes = require('./routes/auth')

const app = express();

const uri = 'mongodb+srv://hayet:hayet123@cluster0.4hcp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

app.use('/api/auth', userRoutes )

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
