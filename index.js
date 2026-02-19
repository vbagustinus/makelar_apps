/**
 * React Native Android bundling (Gradle) still resolves `index.js` by default.
 * Keep this tiny bridge so runtime entry stays in TypeScript.
 */
import './index.ts';
