const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection to ensure table creation
require('./config/database');

const authRoutes = require('./routes/auth');
const registrationRoutes = require('./routes/registration');
const memberRoutes = require('./routes/members');
const newMemberRoutes = require('./routes/memberRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/routemember', newMemberRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use('/', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});