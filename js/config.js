/**
 * Configuration management utility
 * Handles loading and caching of application configuration
 */

class ConfigManager {
  constructor() {
    this.config = null;
    this.loadPromise = null;
  }

  /**
   * Load configuration from config.json
   * @returns {Promise<Object>} Configuration object
   */
  async loadConfig() {
    // Return cached config if already loaded
    if (this.config) {
      return this.config;
    }

    // Return existing promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Load configuration
    this.loadPromise = this._fetchConfig();

    try {
      this.config = await this.loadPromise;
      return this.config;
    } catch (error) {
      this.loadPromise = null; // Reset promise on error
      throw error;
    }
  }

  /**
   * Fetch configuration from server
   * @returns {Promise<Object>} Configuration object
   */
  async _fetchConfig() {
    const response = await fetch("/config.json");

    if (!response.ok) {
      throw new Error(
        `Failed to load configuration: ${response.status} ${response.statusText}`
      );
    }

    const config = await response.json();

    // Validate required configuration
    this._validateConfig(config);

    return config;
  }

  /**
   * Validate configuration structure
   * @param {Object} config - Configuration object to validate
   */
  _validateConfig(config) {
    if (!config.emailjs || !config.emailjs.publicKey) {
      throw new Error("EmailJS public key is required in configuration");
    }
  }

  /**
   * Get EmailJS public key
   * @returns {Promise<string>} EmailJS public key
   */
  async getEmailJSPublicKey() {
    const config = await this.loadConfig();
    return config.emailjs.publicKey;
  }

  /**
   * Get contact information
   * @returns {Promise<Object>} Contact information
   */
  async getContactInfo() {
    const config = await this.loadConfig();
    return config.contact || {};
  }

  /**
   * Get social media links
   * @returns {Promise<Object>} Social media links
   */
  async getSocialLinks() {
    const config = await this.loadConfig();
    return config.social || {};
  }

  /**
   * Clear cached configuration (useful for testing or reloading)
   */
  clearCache() {
    this.config = null;
    this.loadPromise = null;
  }
}

// Create global instance
window.configManager = new ConfigManager();

// Export for module systems if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = ConfigManager;
}
