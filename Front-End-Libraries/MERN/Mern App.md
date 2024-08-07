Creating a basic CRUD (Create, Read, Update, Delete) application using the MERN (MongoDB, Express, React, Node.js) stack involves several steps. Here's a simple example of a MERN application that manages saving configurations stored in a JSON document.

### 1. Setting up the Backend

#### Step 1: Initialize the Project

1. Create a new directory for your project and navigate into it.
2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```
3. Install the required packages:
   ```bash
   npm install express mongoose body-parser cors
   ```

#### Step 2: Create the Server

1. Create an `index.js` file:

   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const bodyParser = require('body-parser');
   const cors = require('cors');

   const app = express();
   const PORT = 5000;

   // Middleware
   app.use(bodyParser.json());
   app.use(cors());

   // MongoDB connection
   mongoose.connect('mongodb://localhost:27017/savings', {
       useNewUrlParser: true,
       useUnifiedTopology: true,
   });

   const db = mongoose.connection;
   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', () => {
       console.log('Connected to MongoDB');
   });

   // Schema and Model
   const savingSchema = new mongoose.Schema({
       name: String,
       amount: Number,
   });

   const Saving = mongoose.model('Saving', savingSchema);

   // CRUD Routes
   app.get('/savings', async (req, res) => {
       const savings = await Saving.find();
       res.json(savings);
   });

   app.post('/savings', async (req, res) => {
       const newSaving = new Saving(req.body);
       await newSaving.save();
       res.json(newSaving);
   });

   app.put('/savings/:id', async (req, res) => {
       const updatedSaving = await Saving.findByIdAndUpdate(req.params.id, req.body, { new: true });
       res.json(updatedSaving);
   });

   app.delete('/savings/:id', async (req, res) => {
       await Saving.findByIdAndDelete(req.params.id);
       res.json({ message: 'Saving deleted' });
   });

   app.listen(PORT, () => {
       console.log(`Server is running on http://localhost:${PORT}`);
   });
   ```

#### Step 3: Start the Server

Start the server:
```bash
node index.js
```

### 2. Setting up the Frontend

#### Step 1: Initialize the React Project

1. In a new terminal window, create a React application using Create React App:
   ```bash
   npx create-react-app mern-savings
   ```
2. Navigate into the project directory:
   ```bash
   cd mern-savings
   ```
3. Install Axios for making HTTP requests:
   ```bash
   npm install axios
   ```

#### Step 2: Create Components

1. Create a new directory `src/components` and add the following files: `SavingForm.js`, `SavingsList.js`, and `App.js`.

**SavingForm.js**

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SavingForm({ selectedSaving, onSave }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (selectedSaving) {
            setName(selectedSaving.name);
            setAmount(selectedSaving.amount);
        }
    }, [selectedSaving]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const saving = { name, amount: Number(amount) };
        if (selectedSaving) {
            await axios.put(`http://localhost:5000/savings/${selectedSaving._id}`, saving);
        } else {
            await axios.post('http://localhost:5000/savings', saving);
        }
        onSave();
        setName('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <button type="submit">Save</button>
        </form>
    );
}

export default SavingForm;
```

**SavingsList.js**

```javascript
import React from 'react';

function SavingsList({ savings, onEdit, onDelete }) {
    return (
        <ul>
            {savings.map((saving) => (
                <li key={saving._id}>
                    {saving.name} - ${saving.amount}
                    <button onClick={() => onEdit(saving)}>Edit</button>
                    <button onClick={() => onDelete(saving._id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

export default SavingsList;
```

**App.js**

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SavingForm from './components/SavingForm';
import SavingsList from './components/SavingsList';
import './App.css';

function App() {
    const [savings, setSavings] = useState([]);
    const [selectedSaving, setSelectedSaving] = useState(null);

    useEffect(() => {
        fetchSavings();
    }, []);

    const fetchSavings = async () => {
        const response = await axios.get('http://localhost:5000/savings');
        setSavings(response.data);
    };

    const handleSave = () => {
        fetchSavings();
        setSelectedSaving(null);
    };

    const handleEdit = (saving) => {
        setSelectedSaving(saving);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/savings/${id}`);
        fetchSavings();
    };

    return (
        <div className="App">
            <h1>Savings Manager</h1>
            <SavingForm selectedSaving={selectedSaving} onSave={handleSave} />
            <SavingsList savings={savings} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
}

export default App;
```

### 3. Running the Application

1. Start the React development server:
   ```bash
   npm start
   ```

2. Ensure your backend server is still running. You can interact with the application by opening `http://localhost:3000` in your browser.

### Summary

This example demonstrates how to create a simple CRUD application using the MERN stack, managing saving configurations in JSON documents. The backend handles the API requests and database interactions, while the frontend manages the user interface and interactions.