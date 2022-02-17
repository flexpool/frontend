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

export const getRegionFromColor = (r: number, g: number, b: number) => {
  switch (true) {
    case isSimilarColor({ r, g, b }, { r: 93, g: 66, b: 245 }): {
      return 'au';
    }
    case isSimilarColor({ r, g, b }, { r: 2, g: 105, b: 255 }): {
      return 'na';
    }
    case isSimilarColor({ r, g, b }, { r: 23, g: 205, b: 114 }): {
      return 'eu';
    }
    case isSimilarColor({ r, g, b }, { r: 237, g: 79, b: 51 }): {
      return 'sa';
    }
    case isSimilarColor({ r, g, b }, { r: 237, g: 180, b: 50 }): {
      return 'ap';
    }
    case isSimilarColor({ r, g, b }, { r: 209, g: 219, b: 221 }): {
      return 'n/a';
    }
    default: {
      return null;
    }
  }
};
