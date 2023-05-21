export function isObject(
  value: unknown
): value is Record<PropertyKey, unknown> {
  return Boolean(value && !Array.isArray(value) && typeof value === 'object');
}

export function getContrastColor(color: string) {
  const light_color = '#ffffff';
  const dark_color = '#000000';

  const color_without_hex = color.substring(1, 7);
  const r = parseInt(color_without_hex.substring(0, 2), 16); // hexToR
  const g = parseInt(color_without_hex.substring(2, 4), 16); // hexToG
  const b = parseInt(color_without_hex.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  // L Threshold should be 0.179 according to the guidelines, but meh
  return L > 0.28 ? dark_color : light_color;
}

export function createSafeUrl(url: string) {
  try {
    return new URL(url);
  } catch (ex) {
    return null;
  }
}

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray
    .map((b) => ('00' + b.toString(16)).slice(-2))
    .join('');
  return hashHex;
}
