export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  extensionsToTreatAsEsm: [".ts"], // Treat .ts files as ESM
  globals: {
    "ts-jest": {
      useESM: true, // Enable ESM support for ts-jest
    },
  },
};
