module.exports = {
  webpack: (config, env) => {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      url: require.resolve("url"),
      fs: require.resolve("fs"),
      assert: require.resolve("assert"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      path: require.resolve("path-browserify"),
    });
    config.resolve.fallback = fallback;
    config.resolve.fallback.fs = false;
    config.ignoreWarnings = [/Failed to parse source map/]; // gets rid of a billion source map warnings
    return config;
  },
};
