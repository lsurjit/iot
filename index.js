const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

// Firebase Admin Setup
admin.initializeApp({
    credential: admin.credential.cert(require('./firebase-service-account.json')),
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});

const db = admin.database();

app.get('/send', (req, res) => {
    const { temperature, humidity } = req.query;
    if (!temperature || !humidity) {
        return res.status(400).send('Temperature and Humidity are required!');
    }

    const data = {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        timestamp: Date.now()
    };

    db.ref('iot-data').push(data)
        .then(() => res.send('Data recorded successfully!'))
        .catch(error => res.status(500).send(error.message));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
