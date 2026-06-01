const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for platform-specific extensions
config.resolver.sourceExts = ['web.js', 'native.js', ...config.resolver.sourceExts];

module.exports = config;
