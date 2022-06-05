module.exports = {
  webpack: (config, env) => {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
    });
    config.resolve.fallback = fallback;
    config.ignoreWarnings = [/Failed to parse source map/];  // gets rid of a billion source map warnings
    return config;
  },
};
