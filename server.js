import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load all JSON files dynamically
const dataDir = path.join(process.cwd(), 'data');
const apiData = {};

fs.readdirSync(dataDir).forEach(file => {
    if (file.endsWith('.json')) {
        const key = file.replace('.json', '');
        const filePath = path.join(dataDir, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            apiData[key] = content;
        } catch (err) {
            console.error(`Failed to load ${file}:`, err);
        }
    }
});

// Dynamically create endpoints
Object.keys(apiData).forEach(endpoint => {
    app.get(`/api/${endpoint}`, (req, res) => {
        const items = Object.values(apiData[endpoint])[0];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        res.json({ result: randomItem });
    });
});

app.listen(PORT, () => {
    console.log(`Multi API running at http://localhost:${PORT}`);
    console.log(`Available endpoints:`);
    Object.keys(apiData).forEach(ep => console.log(` - /api/${ep}`));
});
