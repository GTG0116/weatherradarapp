/**
 * Leaflet Map Manager for Radar Display
 */

class RadarMap {
    constructor() {
        this.map = L.map('map').setView([39.8, -98.6], 4);
        this.radarLayers = {};
        this.alertMarkers = [];
        this.stationMarkers = [];
        this.selectedStation = null;

        this.initializeBaseLayers();
        this.addMapControls();
    }

    initializeBaseLayers() {
        // Add OpenStreetMap as base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            className: 'map-tile'
        }).addTo(this.map);

        // Add satellite layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Esri',
            maxZoom: 18
        });
    }

    addMapControls() {
        L.control.layers(
            {
                'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
                'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')
            },
            {},
            { position: 'topright' }
        ).addTo(this.map);

        L.control.scale({ position: 'bottomright' }).addTo(this.map);
    }

    addRadarStations(stations) {
        stations.forEach(station => {
            const marker = L.circleMarker([station.lat, station.lng], {
                radius: 8,
                fillColor: '#2196F3',
                color: '#1976D2',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);

            marker.bindPopup(`
                <div class="station-popup">
                    <strong>${station.id}</strong><br>
                    ${station.name}<br>
                    Elevation: ${station.elevation}m
                </div>
            `);

            marker.on('click', () => {
                this.selectStation(station, marker);
            });

            this.stationMarkers.push({ marker, station });
        });
    }

    selectStation(station, marker) {
        this.selectedStation = station;

        // Update station info panel
        document.getElementById('station-info').innerHTML = `
            <strong>${station.id}</strong><br>
            <strong>Name:</strong> ${station.name}<br>
            <strong>Latitude:</strong> ${station.lat.toFixed(2)}°<br>
            <strong>Longitude:</strong> ${station.lng.toFixed(2)}°<br>
            <strong>Elevation:</strong> ${station.elevation}m
        `;

        // Highlight selected marker
        this.stationMarkers.forEach(({ marker: m }) => {
            m.setStyle({ fillColor: '#2196F3', fillOpacity: 0.8 });
        });
        marker.setStyle({ fillColor: '#FF5722', fillOpacity: 1 });

        // Update radar display
        window.app.updateRadarDisplay();
    }

    updateRadarLayer(station, radarType, elevation, frame) {
        // Remove existing radar layer
        if (this.radarLayers[radarType]) {
            this.map.removeLayer(this.radarLayers[radarType]);
        }

        // In production, construct actual NWS NEXRAD WMS URL
        // Example: https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.py
        const wmsUrl = this.constructRadarWmsUrl(station.id, radarType, elevation, frame);

        const radarLayer = L.tileLayer.wms(wmsUrl, {
            layers: 'nexrad',
            format: 'image/png',
            transparent: true,
            attribution: 'NWS Nexrad',
            opacity: 0.7
        }).addTo(this.map);

        this.radarLayers[radarType] = radarLayer;
    }

    constructRadarWmsUrl(stationId, radarType, elevation, frame) {
        // This is a template for the actual WMS URL
        // In production, you would use real NOAA/NWS endpoints
        const baseUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/';
        
        const productMap = {
            'reflectivity': 'n0q',
            'velocity': 'n0u',
            'spectrum-width': 'n0s',
            'differential-reflectivity': 'n0z',
            'correlation-coefficient': 'n0c'
        };

        return `${baseUrl}${productMap[radarType]}.py`;
    }

    displayAlerts(alerts, visibleAlerts) {
        // Clear existing alert markers
        this.alertMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.alertMarkers = [];

        // Add new alert markers
        alerts.forEach(alert => {
            if (visibleAlerts[alert.type]) {
                const color = this.getAlertColor(alert.type);
                const marker = L.circleMarker([alert.lat, alert.lng], {
                    radius: 12,
                    fillColor: color,
                    color: 'darkred',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7
                }).addTo(this.map);

                marker.bindPopup(`
                    <div class="alert-popup">
                        <strong>${alert.title}</strong><br>
                        Issued: ${alert.issuedTime}<br>
                        Expires: ${alert.expiresTime}
                    </div>
                `);

                this.alertMarkers.push(marker);
            }
        });
    }

    updateAlertVisibility(visibleAlerts) {
        this.alertMarkers.forEach(marker => {
            marker.setOpacity(0);
            marker.remove();
        });

        // Re-display with new visibility settings
        if (window.app && window.app.alerts) {
            this.displayAlerts(window.app.alerts, visibleAlerts);
        }
    }

    getAlertColor(alertType) {
        const colors = {
            'tornado-warning': '#ff0000',
            'tornado-watch': '#ff6600',
            'severe-thunderstorm-warning': '#ffff00',
            'severe-thunderstorm-watch': '#00ccff',
            'flash-flood-warning': '#008080'
        };
        return colors[alertType] || '#808080';
    }

    centerOnAlert(alert) {
        this.map.setView([alert.lat, alert.lng], 8);
    }
}