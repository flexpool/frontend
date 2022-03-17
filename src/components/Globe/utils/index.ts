export const degree2Radian = (degree: number) => {
  return degree * (Math.PI / 180);
};

export const radian2Degree = (radian: number) => {
  return (radian * 180) / Math.PI;
};

// Convert latitude and longitude to canvas coordinates
export const geo2CanvasXY = (
  lat: number,
  lon: number,
  height: number,
  width: number
) => {
  var y = (lat + 90) * (height / 180);
  var x = (lon + 180) * (width / 360);

  return { x: x, y: y };
};

export function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

export const isSimilarColor = ({ r, g, b }, { r: r2, g: g2, b: b2 }) => {
  return (
    Math.abs(r - r2) <= 20 && Math.abs(g - g2) <= 20 && Math.abs(b - b2) <= 20
  );
};

// Compensating colors are added due to image resolution
const regionColors = {
  na: [
    { r: 89, g: 100, b: 209 },
    { r: 112, g: 96, b: 195 },
    { r: 2, g: 105, b: 255 },
  ],
  eu: [
    { r: 23, g: 205, b: 114 },
    { r: 118, g: 199, b: 103 },
    { r: 56, g: 204, b: 122 },
  ],
  sa: [
    { r: 237, g: 79, b: 51 },
    { r: 94, g: 101, b: 235 },
    { r: 153, g: 95, b: 202 },
    { r: 183, g: 91, b: 173 },
    { r: 228, g: 81, b: 83 },
    { r: 67, g: 103, b: 245 },
    { r: 191, g: 89, b: 162 },
  ],
  au: [{ r: 93, g: 66, b: 245 }],
  ap: [{ r: 237, g: 180, b: 50 }],
  af: [{ r: 118, g: 42, b: 131 }],
  ru: [{ r: 185, g: 160, b: 135 }],
  me: [
    {
      r: 247,
      g: 129,
      b: 191,
    },
  ],
};

export const getRegionFromColor = (r: number, g: number, b: number) => {
  switch (true) {
    case regionColors.na.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'na';
    }
    case regionColors.eu.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'eu';
    }
    case regionColors.sa.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'sa';
    }
    case regionColors.af.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'af';
    }
    case regionColors.ru.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'ru';
    }
    case regionColors.ap.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'ap';
    }
    case regionColors.au.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'au';
    }
    case regionColors.me.some((color) => isSimilarColor({ r, g, b }, color)): {
      return 'me';
    }
    default: {
      return null;
    }
  }
};
