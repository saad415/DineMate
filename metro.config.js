// metro.config.js
// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind }   = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  // points to your global Tailwind CSS file:
  input:     "./global.css",
  configPath:"./tailwind.config.js",
});
