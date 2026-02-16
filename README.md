# Makelar Apps

React Native app for Makelar. This repository uses the React Native CLI.

## Requirements

- Node.js >= 20
- Yarn (recommended)
- Android Studio / Xcode
- Ruby + Bundler (for iOS CocoaPods)

## Setup

```sh
yarn install
```

Environment files live in the root:

- `.env.development`
- `.env.production`
- `.env.default`

Set the active environment:

```sh
yarn env:dev
# or
yarn env:prod
```

## Run

Start Metro:

```sh
yarn start
```

Android:

```sh
yarn android:dev
# or
yarn android:prod
```

iOS (install pods first):

```sh
bundle install
bundle exec pod install --project-directory=ios
```

Then run:

```sh
yarn ios:dev
# or
yarn ios:prod
```

Optional device run:

```sh
IOS_DEVICE="iPhone 15 Pro" yarn ios:dev:d
```

## Scripts

Common commands:

- `yarn start:reset` reset Metro cache
- `yarn start:development` start Metro with dev env
- `yarn start:production` start Metro with prod env
- `yarn lint` run eslint
- `yarn test` run jest
- `yarn pretty` format js/ts/tsx
- `yarn build:apk:development` build Android APK (dev)
- `yarn build:apk:production` build Android APK (prod)

## Project structure

- `src/components` reusable UI components
- `src/scenes` screens and flows
- `src/store` Zustand stores
- `src/services` API clients
- `src/constants` app constants
- `src/styles` theme tokens
- `src/helpers` shared utilities

## Testing

```sh
yarn test
```

## Linting

```sh
yarn lint
```
