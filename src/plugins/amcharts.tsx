/**
 * Here we import and export only the parts that are necessary throughout the app
 * main reason here is to reduce the bundle size
 */

import am4themes_animated from '@amcharts/amcharts4/themes/animated';
export const amChartTheme = am4themes_animated;

// rename so lint won't think it is a react hook (use prefix)
export { useTheme as setTheme } from '@amcharts/amcharts4/core';

export {
  AxisRendererY,
  Chart,
  Legend,
  XYChart,
  XYCursor,
  XYChartScrollbar,
  ValueAxis,
  DateAxis,
  ColumnSeries,
  CategoryAxis,
  LineSeries,
  PieChart,
  PieSeries,
} from '@amcharts/amcharts4/charts';

export {
  Container,
  color,
  NumberFormatter,
  create,
} from '@amcharts/amcharts4/core';
