export {};

declare global {
  var RNFBDebug: boolean | undefined;
  var RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean | undefined;
  var showImagePreview: ((images: Array<{ url: string }>) => void) | undefined;
  var hideImagePreview: (() => void) | undefined;
}
