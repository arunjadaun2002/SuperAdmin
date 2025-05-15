const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Debug: Log environment variables
console.log('Current working directory:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB.');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Collections:', Object.keys(mongoose.connection.collections));
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if cannot connect to database
});

// LMS Schema (normalized to username and password)
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
}, { collection: 'LMS' });

const Admin = mongoose.model('LMS', adminSchema, 'LMS');

// Test route
app.get('/', (req, res) => {
    res.json({ message: "Backend is connected successfully!" });
});

// Get all admins (normalized fields)
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await Admin.find().sort({ _id: -1 });
        const mapped = admins.map(doc => ({
            id: doc._id,
            username: doc.username,
            password: doc.password
        }));
        res.json(mapped);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching admins', error: error.message });
    }
});

// Add new admin (accepts username, password)
app.post('/api/admins', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug log
        const { username, password } = req.body;
        console.log('Creating new admin:', { username, password });
        const newAdmin = new Admin({
            username,
            password
        });
        const savedAdmin = await newAdmin.save();
        console.log('Admin created successfully:', savedAdmin);
        res.status(201).json(savedAdmin);
    } catch (error) {
        console.error('Error creating admin:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'Error creating admin', error: error.message });
        }
    }
});

// Update admin (accepts username, password)
app.put('/api/admins/:id', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug log
        const { username, password } = req.body;
        console.log('Updating admin:', { id: req.params.id, username, password });
        
        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            { username, password },
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            console.log('Admin not found:', req.params.id);
            return res.status(404).json({ message: 'Admin not found' });
        }

        console.log('Admin updated successfully:', updatedAdmin);
        res.json(updatedAdmin);
    } catch (error) {
        console.error('Error updating admin:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: 'Error updating admin', error: error.message });
        }
    }
});

// Delete admin
app.delete('/api/admins/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting admin:', id);
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        
        if (!deletedAdmin) {
            console.log('Admin not found:', id);
            return res.status(404).json({ message: 'Admin not found' });
        }

        console.log('Admin deleted successfully:', deletedAdmin);
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ message: 'Error deleting admin', error: error.message });
    }
});

// API routes
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
