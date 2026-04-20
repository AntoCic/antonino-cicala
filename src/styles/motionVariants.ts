export const springs = {
  default: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  bouncy:  { duration: 0.4,  ease: [0.34, 1.56, 0.64, 1] },
  stiff:   { duration: 0.2,  ease: [0.25, 0.1, 0.25, 1] },
  snappy:  { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 16 },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.95 },
};

export const staggerContainer = {
  hidden:  {},
  visible: { staggerChildren: 0.07, delayChildren: 0.1 },
};
