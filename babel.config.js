module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      ["module:@react-native/babel-preset", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
       [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env', 
      },
    ],
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};