const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// ====== CONFIGURATION ======
// Replace with your own MongoDB URI if needed
const MONGO_URI = 'mongodb+srv://sayem:sayem@cluster0.rn5h9hp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// ====== APP SETUP ======
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ====== MONGOOSE SETUP ======
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));

const medicineSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true }
});

const Medicine = mongoose.model('Medicine', medicineSchema);

// ====== ROUTES ======

// Get all medicines
app.get('/api/medicines', async (req, res) => {
    try {
        const meds = await Medicine.find();
        res.json(meds);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch medicines' });
    }
});

// Add a new medicine
app.post('/api/medicines', async (req, res) => {
    try {
        const med = new Medicine(req.body);
        await med.save();
        res.status(201).json(med);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an existing medicine by "id"
// Use $set to allow partial updates!
app.put('/api/medicines/:id', async (req, res) => {
    try {
        const med = await Medicine.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body }, // Only update provided fields
            { new: true }
        );
        if (!med) return res.status(404).json({ error: 'Medicine not found' });
        res.json(med);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a medicine by "id"
app.delete('/api/medicines/:id', async (req, res) => {
    try {
        const med = await Medicine.findOneAndDelete({ id: req.params.id });
        if (!med) return res.status(404).json({ error: 'Medicine not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
