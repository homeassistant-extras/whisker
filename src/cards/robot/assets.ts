import { DEFAULT_COLOR, type RobotColor } from '@type/config';
import { DEFAULT_MODEL, detectModelKey, type ModelKey } from './detect-model';

/**
 * Bundled robot artwork keyed by `${family}-${color}`.
 *
 * Each `new URL(...)` MUST take a string literal as its first argument: Parcel
 * statically detects only literal `new URL('…', import.meta.url)` calls to emit
 * and rewrite the asset. A variable path (e.g. via a helper) is left as a
 * runtime-relative URL and the image is never copied to `dist/`.
 *
 * The test build stubs this whole module (test/helpers/card-assets-stub.cjs),
 * so the CommonJS test tsconfig never evaluates `import.meta` — hence the
 * per-line `@ts-ignore` (the ESNext main build type-checks `import.meta` fine).
 */
/* eslint-disable @typescript-eslint/ban-ts-comment -- Parcel/ESNext; test tsconfig is CommonJS (card-assets-stub.cjs) */
const ROBOT_IMAGES: Record<`${ModelKey}-${RobotColor}`, string> = {
  // @ts-ignore
  'lr4-white': new URL('../../assets/lr4-white.avif', import.meta.url).href,
  // @ts-ignore
  'lr4-black': new URL('../../assets/lr4-black.avif', import.meta.url).href,
  // @ts-ignore
  'lr5-white': new URL('../../assets/lr5-white.avif', import.meta.url).href,
  // @ts-ignore
  'lr5-black': new URL('../../assets/lr5-black.avif', import.meta.url).href,
  // @ts-ignore
  'lr5-pro-white': new URL('../../assets/lr5-pro-white.avif', import.meta.url)
    .href,
  // @ts-ignore
  'lr5-pro-black': new URL('../../assets/lr5-pro-black.avif', import.meta.url)
    .href,
  // @ts-ignore
  'lre-white': new URL('../../assets/lre-white.avif', import.meta.url).href,
  // @ts-ignore
  'lre-black': new URL('../../assets/lre-black.avif', import.meta.url).href,
};
/* eslint-enable @typescript-eslint/ban-ts-comment */

/**
 * Resolves the robot image URL for a device's model/serial and the configured
 * color, falling back to {@link DEFAULT_MODEL} and white.
 */
export const resolveRobotImage = (
  model: string | null | undefined,
  serial: string | null | undefined,
  color: RobotColor = DEFAULT_COLOR,
): string =>
  ROBOT_IMAGES[`${detectModelKey(model, serial)}-${color}`] ??
  ROBOT_IMAGES[`${DEFAULT_MODEL}-${DEFAULT_COLOR}`];
