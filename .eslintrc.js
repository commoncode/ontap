module.exports = {
    "env": {
      "node": true,
      "mocha": true,
      "browser": true,
    },
    "extends": "airbnb",
    "plugins": [
        "react",
        "import"
    ],
    "parser": "babel-eslint", // support for decorators etc
    "rules": {
      // disable these two until the resolver is configured
      // so it understands paths relative to __dirname
      "import/no-extraneous-dependencies": 0,
      "import/no-unresolved": 0,

      "react/jsx-filename-extension": 0, // todo - get this enabled
      "jsx-a11y/no-static-element-interactions": 0,
      "react/no-unescaped-entities": 0
    }
};
