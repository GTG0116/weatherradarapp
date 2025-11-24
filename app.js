/**
 * NWS Nexrad Radar Viewer - Main Application
 */

class NexradRadarApp {
    constructor() {
        this.radarData = null;
        this.alerts = [];
        this.stations = [];
        this.playbackActive = false;
        this.playbackSpeed = 1;
        this.currentFrame = 0;
        this.selectedRadarType = 'reflectivity';
        this.selectedElevation = '0.5';
        this.visibleAlerts = {
            'tornado-warning': true,
            'tornado-watch': true,
            'severe-thunderstorm-warning': true,
            'severe-thunderstorm-watch': true,
            'flash-flood-warning': true
        };

        this.initializeApp();
    }

    initializeApp() {
        console.log('Initializing NWS Nexrad Radar Viewer...');
        
        // Initialize map
        this.map = new RadarMap();
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadRadarStations();
        this.loadWeatherAlerts();
        
        // Start auto-refresh
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Radar selection
        document.getElementById('radar-select').addEventListener('change', (e) => {
            this.selectedRadarType = e.target.value;
            this.updateRadarDisplay();
        });

        // Elevation selection
        document.getElementById('elevation-select').addEventListener('change', (e) => {
            this.selectedElevation = e.target.value;
            this.updateRadarDisplay();
        });

        // Playback controls
        document.getElementById('play-btn').addEventListener('click', () => this.playPlayback());
        document.getElementById('pause-btn').addEventListener('click', () => this.pausePlayback());
        document.getElementById('stop-btn').addEventListener('click', () => this.stopPlayback());

        document.getElementById('speed-select').addEventListener('change', (e) => {
            this.playbackSpeed = parseFloat(e.target.value);
        });

        document.getElementById('time-input').addEventListener('change', (e) => {
            this.currentFrame = parseInt(e.target.value);
            this.updateRadarDisplay();
        });

        // Alert checkboxes
        ['tornado-warning', 'tornado-watch', 'severe-thunderstorm-warning', 
         'severe-thunderstorm-watch', 'flash-flood-warning'].forEach(alertType => {
            document.getElementById(alertType).addEventListener('change', (e) => {
                this.visibleAlerts[alertType] = e.target.checked;
                this.map.updateAlertVisibility(this.visibleAlerts);
            });
        });
    }

    async loadRadarStations() {
        try {
            // In production, fetch from NWS API
            // https://api.weather.gov/points/{lat},{lon}
            const mockStations = await this.getMockRadarStations();
            this.stations = mockStations;
            this.map.addRadarStations(mockStations);
        } catch (error) {
            console.error('Error loading radar stations:', error);
        }
    }

    async loadWeatherAlerts() {
        try {
            // In production, fetch from NWS API
            // https://api.weather.gov/alerts/active
            const mockAlerts = await this.getMockAlerts();
            this.alerts = mockAlerts;
            this.map.displayAlerts(mockAlerts, this.visibleAlerts);
            this.updateAlertsList();
        } catch (error) {
            console.error('Error loading alerts:', error);
        }
    }

    updateRadarDisplay() {
        if (this.map.selectedStation) {
            this.map.updateRadarLayer(
                this.map.selectedStation,
                this.selectedRadarType,
                this.selectedElevation,
                this.currentFrame
            );
        }
    }

    playPlayback() {
        if (!this.playbackActive) {
            this.playbackActive = true;
            this.playbackLoop();
        }
    }

    pausePlayback() {
        this.playbackActive = false;
    }

    stopPlayback() {
        this.playbackActive = false;
        this.currentFrame = 0;
        document.getElementById('time-input').value = 0;
        document.getElementById('current-time').textContent = '00:00';
        this.updateRadarDisplay();
    }

    playbackLoop() {
        if (!this.playbackActive) return;

        this.currentFrame += this.playbackSpeed;
        
        // Assume 144 frames (every 5 minutes for 12 hours)
        if (this.currentFrame >= 144) {
            this.currentFrame = 0;
        }

        const minutes = Math.floor(this.currentFrame * 5);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        document.getElementById('current-time').textContent = 
            `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        
        document.getElementById('time-input').value = this.currentFrame;
        
        this.updateRadarDisplay();
        requestAnimationFrame(() => this.playbackLoop());
    }

    updateAlertsList() {
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = '';

        this.alerts.forEach(alert => {
            if (this.visibleAlerts[alert.type]) {
                const alertEl = document.createElement('div');
                alertEl.className = `alert-item ${alert.severity}`;
                alertEl.innerHTML = `
                    <div>${alert.title}</div>
                    <div class="alert-time">${alert.issuedTime}</div>
                `;
                alertEl.addEventListener('click', () => {
                    this.map.centerOnAlert(alert);
                });
                alertsList.appendChild(alertEl);
            }
        });
    }

    async getMockRadarStations() {
        // Mock data for major NEXRAD stations
        return [
            { id: 'KORD', name: 'Chicago/Romeoville', lat: 41.5, lng: -88.24, elevation: 204 },
            { id: 'KLOT', name: 'Lot', lat: 41.61, lng: -88.09, elevation: 205 },
            { id: 'KMKX', name: 'Milwaukee', lat: 42.97, lng: -88.1, elevation: 290 },
            { id: 'KMDW', name: 'Chicago/Midway', lat: 41.44, lng: -87.92, elevation: 205 },
            { id: 'KRDU', name: 'Raleigh', lat: 35.66, lng: -78.49, elevation: 106 },
            { id: 'KGSP', name: 'Greenville', lat: 34.88, lng: -82.22, elevation: 265 },
        ];
    }

    async getMockAlerts() {
        const now = new Date();
        return [
            {
                id: '1',
                type: 'tornado-warning',
                title: 'Tornado Warning - Cook County, IL',
                severity: 'warning',
                lat: 41.8,
                lng: -87.9,
                issuedTime: now.toLocaleTimeString(),
                expiresTime: new Date(now.getTime() + 60 * 60000).toLocaleTimeString()
            },
            {
                id: '2',
                type: 'severe-thunderstorm-warning',
                title: 'Severe Thunderstorm Warning - DuPage County, IL',
                severity: 'warning',
                lat: 41.7,
                lng: -88.1,
                issuedTime: now.toLocaleTimeString(),
                expiresTime: new Date(now.getTime() + 60 * 60000).toLocaleTimeString()
            },
            {
                id: '3',
                type: 'tornado-watch',
                title: 'Tornado Watch - Northern Illinois',
                severity: 'watch',
                lat: 41.5,
                lng: -88.5,
                issuedTime: now.toLocaleTimeString(),
                expiresTime: new Date(now.getTime() + 180 * 60000).toLocaleTimeString()
            }
        ];
    }

    startAutoRefresh() {
        // Refresh alerts every 5 minutes
        setInterval(() => {
            this.loadWeatherAlerts();
        }, 5 * 60 * 1000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NexradRadarApp();
});