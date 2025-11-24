/**
 * Weather Alerts Handler
 */

class WeatherAlertsHandler {
    constructor() {
        this.baseUrl = 'https://api.weather.gov/';
        this.alertsCache = null;
        this.lastUpdate = null;
    }

    /**
     * Fetch active alerts from NWS API
     */
    async fetchActiveAlerts() {
        const cacheTimeout = 5 * 60 * 1000; // 5 minutes

        if (this.alertsCache && 
            this.lastUpdate && 
            Date.now() - this.lastUpdate < cacheTimeout) {
            return this.alertsCache;
        }

        try {
            const response = await fetch(`${this.baseUrl}alerts/active`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            this.alertsCache = this.parseAlerts(data.features);
            this.lastUpdate = Date.now();
            
            return this.alertsCache;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            return this.alertsCache || [];
        }
    }

    /**
     * Parse alert data from NWS API response
     */
    parseAlerts(features) {
        return features.map((feature, index) => {
            const props = feature.properties;
            const coordinates = feature.geometry.coordinates[0];
            
            return {
                id: props.id,
                type: this.categorizeAlert(props.event),
                title: `${props.event} - ${props.areaDesc}`,
                severity: this.getSeverity(props.event),
                description: props.description,
                headline: props.headline,
                lat: coordinates[1],
                lng: coordinates[0],
                issuedTime: new Date(props.sent).toLocaleTimeString(),
                expiresTime: new Date(props.expires).toLocaleTimeString(),
                effective: props.effective,
                expires: props.expires,
                areaDesc: props.areaDesc,
                event: props.event
            };
        });
    }

    /**
     * Categorize alert type
     */
    categorizeAlert(eventType) {
        const eventLower = eventType.toLowerCase();
        
        if (eventLower.includes('tornado') && eventLower.includes('warning')) {
            return 'tornado-warning';
        } else if (eventLower.includes('tornado')) {
            return 'tornado-watch';
        } else if (eventLower.includes('thunderstorm') && eventLower.includes('warning')) {
            return 'severe-thunderstorm-warning';
        } else if (eventLower.includes('thunderstorm')) {
            return 'severe-thunderstorm-watch';
        } else if (eventLower.includes('flood')) {
            return 'flash-flood-warning';
        }
        
        return 'other';
    }

    /**
     * Determine severity level
     */
    getSeverity(eventType) {
        return eventType.includes('Warning') ? 'warning' : 'watch';
    }

    /**
     * Get alerts for specific area (by lat/lon)
     */
    async getAlertsForArea(lat, lng) {
        try {
            const response = await fetch(
                `${this.baseUrl}points/${lat.toFixed(4)},${lng.toFixed(4)}`
            );
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const pointData = await response.json();
            const alertsUrl = pointData.properties.forecastUrl;
            
            // Fetch alerts for this forecast area
            const alertsResponse = await fetch(alertsUrl);
            const alertsData = await alertsResponse.json();
            
            return this.parseAlerts(alertsData.features || []);
        } catch (error) {
            console.error('Error fetching area alerts:', error);
            return [];
        }
    }

    /**
     * Filter alerts by type
     */
    filterByType(alerts, type) {
        return alerts.filter(alert => alert.type === type);
    }

    /**
     * Filter alerts by severity
     */
    filterBySeverity(alerts, severity) {
        return alerts.filter(alert => alert.severity === severity);
    }

    /**
     * Get active warnings only
     */
    getActiveWarnings(alerts) {
        return this.filterBySeverity(alerts, 'warning');
    }

    /**
     * Get active watches only
     */
    getActiveWatches(alerts) {
        return this.filterBySeverity(alerts, 'watch');
    }
}