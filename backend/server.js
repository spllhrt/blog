const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const cloudinary = require('cloudinary').v2; 

require('dotenv').config(); 

const userRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const packageRoutes = require('./routes/package');
const reviewRoutes = require('./routes/reviews');
const responseRoutes = require('./routes/response');
const pbookingRoutes = require('./routes/pbooking');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

const uri = 'mongodb+srv://hayet:hayet123@cluster0.4hcp3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
}));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(express.json());


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/', categoryRoutes); 
app.use('/api/', packageRoutes); 
app.use('/api/', reviewRoutes);
app.use('/api/', responseRoutes); 
app.use('/api/', pbookingRoutes);
app.use('/api/', wishlistRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
