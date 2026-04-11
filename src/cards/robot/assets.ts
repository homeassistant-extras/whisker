/**
 * Returns the source URL for the robot image.
 * This is used to display the robot image in the card.
 * It is a URL object that is created using the import.meta.url and the path to the robot image.
 * The path is relative to the current file, so it is resolved to the root of the project.
 * The URL object is then converted to a string using the href property.
 * This string is then used as the source URL for the robot image in the card.
 */
export const robotImageSrc = new URL(
  '../../assets/lr5-white.avif',
  import.meta.url,
).href;
