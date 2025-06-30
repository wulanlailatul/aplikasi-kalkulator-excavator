const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const { withNativeWind } = require("nativewind/metro");

const configDefault = (() => {
	const config = mergeConfig(getDefaultConfig(__dirname));
	const { transformer, resolver } = config;
	config.transformer.minifierPath = require.resolve("metro-minify-esbuild");
	config.transformer.minifierConfig = {
		compress: {
			drop_console: true,
		},
	};

	config.transformer = {
		...transformer,
		babelTransformerPath: require.resolve("react-native-svg-transformer"),
	};
	config.resolver = {
		...resolver,
		assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
		sourceExts: [...resolver.sourceExts, "svg"],
	};

	return config;
})();

module.exports = withNativeWind(configDefault, { input: "./global.css" });
