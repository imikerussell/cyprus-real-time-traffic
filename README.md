# 🇨🇾 Cyprus Real-Time Traffic Map

An interactive web-based map visualizing real-time traffic data from the Cyprus Department of Roads traffic monitoring system.

![Cyprus Traffic Map](https://img.shields.io/badge/Status-Live-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- **Interactive Map**: Leaflet.js-powered map centered on Cyprus
- **60+ Measurement Sites**: Bluetooth traffic monitoring stations displayed as blue markers
- **200+ Route Segments**: Color-coded by real-time traffic speed
  - 🟢 Green: Fast traffic (>60 km/h)
  - 🟡 Yellow: Moderate traffic (30-60 km/h)
  - 🔴 Red: Slow traffic (<30 km/h)
  - ⚪ Gray: No data available
- **Control Panel**:
  - Manual refresh button
  - Auto-refresh toggle (off by default, 1-minute intervals)
  - Real-time statistics
  - Last update timestamp
- **Interactive Popups**: Click any site or route for detailed information
- **Responsive Design**: Modern, clean UI that works on all devices

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

To check if you have Node.js and npm installed:

```bash
node --version
npm --version
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/imikerussell/cyprus-real-time-traffic.git
cd cyprus-real-time-traffic
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - CORS middleware
- `node-fetch` - HTTP client for API requests

### 3. Start the Server

```bash
npm start
```

You should see output like:

```
╔════════════════════════════════════════════════════╗
║  🇨🇾  Cyprus Real-Time Traffic Map Server         ║
╚════════════════════════════════════════════════════╝

Server running on: http://localhost:3000
API endpoints:
  - GET /api/sites      (Measurement sites)
  - GET /api/locations  (Route geometries)
  - GET /api/data       (Real-time traffic data)
  - GET /api/health     (Health check)

Open http://localhost:3000 in your browser to view the map!
```

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

The map will load automatically and display the current traffic conditions!

## Usage

### Manual Refresh
Click the **🔄 Refresh Now** button to manually update the traffic data.

### Auto-Refresh
Toggle the **Auto-refresh (1 min)** switch to enable automatic updates every 60 seconds.
- By default, auto-refresh is **OFF** to save bandwidth
- Enable it when you want continuous monitoring

### View Details
Click on any:
- **Blue marker** to see measurement site details
- **Colored route line** to see speed and travel time information

## How It Works

### Architecture

The application consists of two main components:

1. **Backend (server.js)**: Node.js/Express server that:
   - Proxies requests to the Cyprus traffic API (avoids CORS issues)
   - Caches responses for 30 seconds to reduce API load
   - Serves the static HTML/CSS/JavaScript files

2. **Frontend (index.html)**: Interactive map that:
   - Uses Leaflet.js for map rendering
   - Fetches data from the local proxy server
   - Parses XML data and visualizes it on the map
   - Handles user interactions and auto-refresh

### Data Sources

The application pulls data from three Cyprus Department of Roads endpoints:

1. **BTMeasurementSiteTablePublication**: Locations of Bluetooth measurement sites
2. **PredefinedLocationPublication**: Route segment geometries (GML format)
3. **PredefinedLocationDataPublication**: Real-time traffic speeds and travel times

## Project Structure

```
cyprus-real-time-traffic/
├── server.js           # Node.js backend proxy server
├── index.html          # Frontend map interface
├── package.json        # Node.js dependencies
├── .gitignore          # Git ignore rules
├── CLAUDE.md          # Project requirements
└── README.md          # This file
```

## Configuration

### Change Server Port

Set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

Or edit `server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your preferred port
```

### Adjust Cache Duration

Edit the cache duration in `server.js`:

```javascript
const CACHE_DURATION = 30000; // 30 seconds (in milliseconds)
```

### Change Auto-Refresh Interval

Edit the interval in `index.html`:

```javascript
autoRefreshInterval = setInterval(loadTrafficData, 60000); // 60 seconds
```

## API Endpoints

The backend server exposes the following endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /` | Serves the main map interface |
| `GET /api/sites` | Proxies measurement site data |
| `GET /api/locations` | Proxies route geometry data |
| `GET /api/data` | Proxies real-time traffic data |
| `GET /api/health` | Health check and cache status |

## Troubleshooting

### No data showing on the map

1. Check the browser console for errors (F12)
2. Verify the server is running on port 3000
3. Check server logs for API connection issues
4. Try manually refreshing the data

### Port already in use

If port 3000 is already in use:

```bash
PORT=8080 npm start
```

### Dependencies not installing

Try clearing npm cache:

```bash
npm cache clean --force
npm install
```

## Development

### Run in Development Mode

```bash
npm run dev
```

For automatic server restart on file changes, install and use `nodemon`:

```bash
npm install -g nodemon
nodemon server.js
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Traffic data provided by the [Cyprus Department of Roads](https://www.traffic4cyprus.org.cy)
- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/)
- Mapping library: [Leaflet.js](https://leafletjs.com/)

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the server logs for error messages
3. Open an issue on GitHub

---

Made with ❤️ for Cyprus traffic monitoring
