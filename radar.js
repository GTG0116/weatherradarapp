/**
 * Radar Data Handler
 */

class RadarDataHandler {
    constructor() {
        this.baseUrl = 'https://mesonet.agron.iastate.edu/json/';
        this.radarCache = new Map();
    }

    /**
     * Fetch radar data for a specific station
     */
    async fetchRadarData(stationId, radarType, elevation) {
        const cacheKey = `${stationId}_${radarType}_${elevation}`;
        
        if (this.radarCache.has(cacheKey)) {
            return this.radarCache.get(cacheKey);
        }

        try {
            // In production, use actual NOAA API
            const response = await fetch(
                `${this.baseUrl}radarserver.py?station=${stationId}&type=${radarType}`
            );
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            this.radarCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching radar data:', error);
            return null;
        }
    }

    /**
     * Get reflectivity data (base reflectivity)
     */
    async getReflectivityData(stationId, elevation) {
        return this.fetchRadarData(stationId, 'reflectivity', elevation);
    }

    /**
     * Get velocity data (radial velocity)
     */
    async getVelocityData(stationId, elevation) {
        return this.fetchRadarData(stationId, 'velocity', elevation);
    }

    /**
     * Get spectrum width data
     */
    async getSpectrumWidthData(stationId, elevation) {
        return this.fetchRadarData(stationId, 'spectrum-width', elevation);
    }

    /**
     * Get differential reflectivity data
     */
    async getDifferentialReflectivityData(stationId, elevation) {
        return this.fetchRadarData(stationId, 'differential-reflectivity', elevation);
    }

    /**
     * Get correlation coefficient data
     */
    async getCorrelationCoefficientData(stationId, elevation) {
        return this.fetchRadarData(stationId, 'correlation-coefficient', elevation);
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.radarCache.clear();
    }
}