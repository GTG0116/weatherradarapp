/**
 * Radar Playback Handler
 */

class PlaybackManager {
    constructor() {
        this.frames = [];
        this.currentFrame = 0;
        this.isPlaying = false;
        this.playbackSpeed = 1;
        this.frameInterval = null;
        this.maxFrames = 144; // 12 hours at 5-minute intervals
    }

    /**
     * Initialize playback with historical data
     */
    async initializePlayback(stationId, radarType, elevation) {
        try {
            // Fetch last 12 hours of radar data (144 frames at 5-min intervals)
            this.frames = await this.fetchHistoricalData(
                stationId,
                radarType,
                elevation,
                this.maxFrames
            );
            
            return this.frames.length > 0;
        } catch (error) {
            console.error('Error initializing playback:', error);
            return false;
        }
    }

    /**
     * Fetch historical radar data
     */
    async fetchHistoricalData(stationId, radarType, elevation, frameCount) {
        const frames = [];
        const now = new Date();

        for (let i = frameCount - 1; i >= 0; i--) {
            const frameTime = new Date(now.getTime() - i * 5 * 60 * 1000);
            
            try {
                const frameData = await this.fetchRadarFrame(
                    stationId,
                    radarType,
                    elevation,
                    frameTime
                );
                
                if (frameData) {
                    frames.push({
                        time: frameTime,
                        data: frameData,
                        url: this.buildRadarUrl(stationId, radarType, elevation, frameTime)
                    });
                }
            } catch (error) {
                console.error(`Error fetching frame at ${frameTime}:`, error);
            }
        }

        return frames;
    }

    /**
     * Fetch a single radar frame
     */
    async fetchRadarFrame(stationId, radarType, elevation, timestamp) {
        // In production, use actual NOAA Nexrad archive
        // https://www.ncei.noaa.gov/products/weather-radar-data-nexrad-level-2
        
        const mockData = {
            timestamp: timestamp.toISOString(),
            station: stationId,
            type: radarType,
            elevation: elevation,
            available: Math.random() > 0.1 // 90% availability
        };

        return new Promise(resolve => {
            // Simulate network delay
            setTimeout(() => resolve(mockData), 50);
        });
    }

    /**
     * Build radar tile URL for specific timestamp
     */
    buildRadarUrl(stationId, radarType, elevation, timestamp) {
        // Example: Iowa Mesonet WMS endpoint with time parameter
        const baseUrl = 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/';
        const productMap = {
            'reflectivity': 'n0q',
            'velocity': 'n0u',
            'spectrum-width': 'n0s',
            'differential-reflectivity': 'n0z',
            'correlation-coefficient': 'n0c'
        };

        const product = productMap[radarType] || 'n0q';
        const timeParam = timestamp.toISOString().replace(/[:-]/g, '').slice(0, -5);

        return `${baseUrl}${product}.py?ts=${timeParam}&station=${stationId}`;
    }

    /**
     * Start playback
     */
    play(callback) {
        if (this.isPlaying || this.frames.length === 0) return;

        this.isPlaying = true;

        const playFrame = () => {
            if (!this.isPlaying) return;

            if (this.currentFrame >= this.frames.length) {
                this.currentFrame = 0;
            }

            const frame = this.frames[this.currentFrame];
            callback(frame, this.currentFrame, this.frames.length);

            this.currentFrame++;

            // Calculate delay based on playback speed
            const baseDelay = 200; // 200ms per frame
            const delay = baseDelay / this.playbackSpeed;

            this.frameInterval = setTimeout(playFrame, delay);
        };

        playFrame();
    }

    /**
     * Pause playback
     */
    pause() {
        this.isPlaying = false;
        if (this.frameInterval) {
            clearTimeout(this.frameInterval);
        }
    }

    /**
     * Stop playback and reset
     */
    stop() {
        this.pause();
        this.currentFrame = 0;
    }

    /**
     * Set playback speed
     */
    setSpeed(speed) {
        this.playbackSpeed = speed;
    }

    /**
     * Jump to specific frame
     */
    jumpToFrame(frameIndex) {
        if (frameIndex >= 0 && frameIndex < this.frames.length) {
            this.currentFrame = frameIndex;
            return this.frames[frameIndex];
        }
        return null;
    }

    /**
     * Get current frame
     */
    getCurrentFrame() {
        return this.frames[this.currentFrame] || null;
    }

    /**
     * Get total number of frames
     */
    getFrameCount() {
        return this.frames.length;
    }
}