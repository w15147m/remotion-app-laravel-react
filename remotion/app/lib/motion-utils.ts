/**
 * Utility for calculating "Whole Number" physics for smooth video motion.
 * 
 * To avoid jitter, the pixels moved per frame must be a whole number (integer).
 */

export const DEFAULT_GAP = 20;
export const DEFAULT_PIXELS_PER_FRAME = 10;
export const DEFAULT_FPS = 60;

/**
 * Calculates the optimal animation speed (rotation duration) to ensure 
 * jitter-free movement based on card width and gap.
 * 
 * Formula: (Width + Gap) / (FPS * TargetPixelsPerFrame)
 */
export const calculateOptimalSpeed = (
  cardWidth: number,
  gap: number = DEFAULT_GAP,
  fps: number = DEFAULT_FPS,
  pixelsPerFrame: number = DEFAULT_PIXELS_PER_FRAME
): number => {
  const totalSpacing = cardWidth + gap;
  // duration in seconds = spacing / (fps * ppf)
  const duration = totalSpacing / (fps * pixelsPerFrame);
  return Number(duration.toFixed(3)); // Clean up floating point
};
