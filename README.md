# NWS Nexrad Radar Viewer

An interactive web application for viewing NOAA/NWS Nexrad weather radar data with real-time alerts, playback capabilities, and multiple radar product options.

## Features

### Radar Display
- **Multiple Radar Products**
  - Base Reflectivity (dBZ)
  - Radial Velocity (m/s)
  - Spectrum Width
  - Differential Reflectivity (ZDR)
  - Correlation Coefficient (CC)

- **Elevation Angle Selection**
  - 0.5°, 1.45°, 2.4°, 3.35° and more
  - Real-time switching between elevation angles

- **Interactive Map**
  - Leaflet-based mapping
  - Street and satellite imagery options
  - Scale and coordinate display
  - Multiple NEXRAD station access

### Weather Alerts
- **Alert Types**
  - Tornado Warnings (Red)
  - Tornado Watches (Orange)
  - Severe Thunderstorm Warnings (Yellow)
  - Severe Thunderstorm Watches (Cyan)
  - Flash Flood Warnings (Teal)

- **Alert Management**
  - Toggle alert visibility by type
  - Click alerts to center map
  - Real-time alert updates
  - Alert details on hover/click

### Playback Controls
- **Playback Features**
  - Play/Pause/Stop controls
  - Adjustable playback speed (0.5x to 5x)
  - 12-hour historical data access
  - Frame-by-frame navigation
  - Time slider with timestamp display

### Station Information
- Station identifier and name
- Geographic coordinates
- Elevation information
- Quick station selection from map

## Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for real-time data

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexrad-viewer.git
cd nexrad-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8080
```

## Usage

### Basic Workflow

1. **Select a Radar Product**
   - Use the "Radar Data" dropdown to choose between different radar products
   - Base Reflectivity is recommended for beginners

2. **Choose an Elevation Angle**
   - Select appropriate elevation angle
   - Lower angles (0.5°) show surface-level storms
   - Higher angles detect upper-level rotation

3. **Click a Radar Station**
   - Click on blue circle markers on the map
   - Station information appears in the sidebar
   - Radar data loads for that station

4. **View Weather Alerts**
   - Check the Alerts section in the sidebar
   - Toggle alert types on/off
   - Click alerts to center map on location
   - Colors indicate severity

5. **Use Playback**
   - Click Play to animate radar data
   - Adjust speed for different perspectives
   - Use time slider for manual navigation
   - Stop to reset playback

## Data Sources

- **Radar Data**: NOAA/NWS Nexrad Network
  - Source: https://www.ncei.noaa.gov/products/weather-radar-data-nexrad-level-2

- **Weather Alerts**: NWS API
  - Source: https://api.weather.gov/alerts/active

- **Map Tiles**: OpenStreetMap & ESRI
  - Street Map: © OpenStreetMap contributors
  - Satellite: © ESRI

## API Integration

### Nexrad Data
```javascript
// Using Iowa Mesonet WMS
https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.py
```

### NWS Weather Alerts
```javascript
// Fetch active alerts
https://api.weather.gov/alerts/active

// Get area-specific alerts
https://api.weather.gov/points/{lat},{lon}
```

## Understanding Radar Products

### Base Reflectivity (dBZ)
- Measures precipitation intensity
- Green = Light rain
- Yellow = Moderate rain
- Red = Heavy rain/potential hail

### Radial Velocity
- Shows wind motion toward/away from radar
- Green = Moving away
- Red = Moving toward
- Used to detect rotation and tornados

### Spectrum Width
- Indicates wind variability
- High values = turbulent air
- Useful for severe weather detection

### Differential Reflectivity (ZDR)
- Compares horizontal vs vertical reflectivity
- Helps identify hail vs rain
- Positive = Rain, Negative = Hail

### Correlation Coefficient (CC)
- Quality indicator
- High values = good data quality
- Low values = precipitation type mix

## Keyboard Shortcuts

- **Space**: Play/Pause
- **S**: Stop playback
- **+/-**: Zoom in/out
- **Arrow Keys**: Pan map (when focused)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. **Optimize for Mobile**
   - Use lower resolution maps on mobile
   - Reduce playback speed for slower connections

2. **Cache Management**
   - Clear browser cache if data seems stale
   - Use Shift+Refresh for hard refresh

3. **Data Usage**
   - Disable playback when not actively viewing
   - Historical data uses significant bandwidth

## Troubleshooting

### Radar Not Loading
- Check internet connection
- Verify NEXRAD station is operational
- Try a different radar product
- Clear browser cache

### Alerts Not Appearing
- Ensure alerts are enabled in sidebar
- Check if alerts exist for selected area
- Refresh page to update alert data

### Playback Issues
- Ensure historical data is loaded
- Reduce playback speed for stability
- Check browser console for errors

## Development

### Project Structure
```
nexrad-viewer/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # Styling
├── js/
│   ├── app.js         # Main application
│   ├── map.js         # Map management
│   ├── radar.js       # Radar data handling
│   ├── alerts.js      # Alert management
│   └── playback.js    # Playback controls
├── assets/            # Images, icons
└── README.md          # This file
```

### Adding New Features

#### New Radar Product
1. Add option to `radar-select` in HTML
2. Update `productMap` in `map.js`
3. Add fetch method in `radar.js`

#### New Alert Type
1. Add checkbox in HTML alerts section
2. Update `visibleAlerts` object in `app.js`
3. Add color mapping in `map.js`

### Testing

Manual testing checklist:
- [ ] Map loads correctly
- [ ] All radar products load
- [ ] Elevation angles change data display
- [ ] Alerts display with correct colors
- [ ] Alert toggles work
- [ ] Playback starts/stops/pauses
- [ ] Speed adjustment works
- [ ] Time slider navigates correctly
- [ ] Station info displays on click
- [ ] Responsive on mobile devices

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This is an unofficial educational tool. For critical weather decisions, always refer to official NWS alerts and forecasts at https://weather.gov

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Custom alert filtering by county/zone
- [ ] Storm tracking overlay
- [ ] Hail detection algorithm
- [ ] Tornado signature detection
- [ ] Multi-radar composite view
- [ ] Export radar images
- [ ] Real-time cross-sections
- [ ] User accounts for saved preferences
- [ ] Dark/Light theme toggle

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing discussions
- Review documentation

## References

- [NWS Nexrad Information](https://www.nws.noaa.gov/om/csd/nexrad.html)
- [Radar Education](https://www.weather.gov/pa/RadarEducation)
- [Leaflet Documentation](https://leafletjs.com/)
- [NOAA/NWS API Docs](https://weather.gov/documentation/services-web-api)