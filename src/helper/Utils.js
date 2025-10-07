export const generateFluxId = id => {
  if (!id) return 'UNKNOWN';

  // Take last 6 characters ignoring colons
  const cleaned = id.replace(/:/g, ''); // remove :
  const last6 = cleaned.slice(-6).toUpperCase(); // get last 6 chars

  return `flux_${last6}`;
};
