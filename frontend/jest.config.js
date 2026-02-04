export default { 
    testEnvironment: "jest-environment-jsdom", 
    transform: { 
        "^.+\\.[jt]sx?$": "babel-jest", 
    }, 
    moduleNameMapper: { 
        "^@/(.*)$": "<rootDir>/src/$1", 
        "\\.(css|less|sass|scss)$": "identity-obj-proxy", 
        "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/fileMock.js", 
    }, 
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], 
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"], 
    collectCoverage: true, 
    coverageDirectory: "coverage",
    coverageProvider: "v8", 
};