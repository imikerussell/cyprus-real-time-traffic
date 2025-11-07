const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Cyprus traffic API endpoints
const CYPRUS_API_BASE = 'https://www.traffic4cyprus.org.cy/swarco3/api/Data';

const ENDPOINTS = {
    sites: `${CYPRUS_API_BASE}/BTMeasurementSiteTablePublication`,
    locations: `${CYPRUS_API_BASE}/PredefinedLocationPublication`,
    data: `${CYPRUS_API_BASE}/PredefinedLocationDataPublication`
};

// Cache configuration
const CACHE_DURATION = 30000; // 30 seconds
const cache = {
    sites: { data: null, timestamp: 0 },
    locations: { data: null, timestamp: 0 },
    data: { data: null, timestamp: 0 }
};

// Helper function to check if cache is valid
function isCacheValid(cacheEntry) {
    return cacheEntry.data && (Date.now() - cacheEntry.timestamp < CACHE_DURATION);
}

// Proxy endpoint for measurement sites
app.get('/api/sites', async (req, res) => {
    try {
        // Return cached data if available
        if (isCacheValid(cache.sites)) {
            console.log('Serving measurement sites from cache');
            return res.type('application/xml').send(cache.sites.data);
        }

        console.log('Fetching measurement sites from Cyprus API...');
        const response = await fetch(ENDPOINTS.sites);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.text();

        // Update cache
        cache.sites = { data, timestamp: Date.now() };

        res.type('application/xml').send(data);
    } catch (error) {
        console.error('Error fetching measurement sites:', error);
        res.status(500).json({
            error: 'Failed to fetch measurement sites',
            message: error.message
        });
    }
});

// Proxy endpoint for location definitions
app.get('/api/locations', async (req, res) => {
    try {
        // Return cached data if available
        if (isCacheValid(cache.locations)) {
            console.log('Serving locations from cache');
            return res.type('application/xml').send(cache.locations.data);
        }

        console.log('Fetching locations from Cyprus API...');
        const response = await fetch(ENDPOINTS.locations);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.text();

        // Update cache
        cache.locations = { data, timestamp: Date.now() };

        res.type('application/xml').send(data);
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({
            error: 'Failed to fetch locations',
            message: error.message
        });
    }
});

// Proxy endpoint for traffic data
app.get('/api/data', async (req, res) => {
    try {
        // Return cached data if available
        if (isCacheValid(cache.data)) {
            console.log('Serving traffic data from cache');
            return res.type('application/xml').send(cache.data.data);
        }

        console.log('Fetching traffic data from Cyprus API...');
        const response = await fetch(ENDPOINTS.data);

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.text();

        // Update cache
        cache.data = { data, timestamp: Date.now() };

        res.type('application/xml').send(data);
    } catch (error) {
        console.error('Error fetching traffic data:', error);
        res.status(500).json({
            error: 'Failed to fetch traffic data',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        cache: {
            sites: isCacheValid(cache.sites),
            locations: isCacheValid(cache.locations),
            data: isCacheValid(cache.data)
        }
    });
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║  🇨🇾  Cyprus Real-Time Traffic Map Server         ║
╚════════════════════════════════════════════════════╝

Server running on: http://localhost:${PORT}
API endpoints:
  - GET /api/sites      (Measurement sites)
  - GET /api/locations  (Route geometries)
  - GET /api/data       (Real-time traffic data)
  - GET /api/health     (Health check)

Open http://localhost:${PORT} in your browser to view the map!
    `);
});
