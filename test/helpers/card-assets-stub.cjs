/**
 * Intercepts `src/cards/robot/assets.ts` before ts-node can compile it, so
 * `import.meta.url` never runs under tsconfig.test.json (module: commonjs).
 */
const Module = require('node:module');

const _load = Module._load.bind(Module);
Module._load = function (request, parent, isMain) {
  if (parent?.filename?.includes('cards/robot') && request === './assets') {
    // Echo the args so tests can assert what the card passed through.
    return {
      resolveRobotImage: (model, serial, color) =>
        `img:${model ?? ''}|${serial ?? ''}|${color ?? ''}`,
    };
  }
  return _load(request, parent, isMain);
};
