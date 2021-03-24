import * as chartjs from 'chart.js';
/**
 * These are options for chart.js
 */

export const getChartOptions = (valueFormatter: any): chartjs.ChartOptions => ({
  hover: {
    mode: 'label',
  },
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    enabled: false,
    mode: 'index',
    intersect: false,
    position: 'nearest',
    callbacks: {
      labelColor: (tooltipItem, chartInstance) => {
        if (tooltipItem.datasetIndex && tooltipItem.index) {
          const meta = chartInstance.getDatasetMeta(tooltipItem.datasetIndex);
          const activeElement = meta.data[tooltipItem.index];
          const view = activeElement._view; // eslint-disable-line
          return {
            borderColor: 'transparent',
            backgroundColor: view.backgroundColor,
          };
        }
        return {
          borderColor: 'transparent',
          backgroundColor: 'transparent',
        };
      },
    },
  },
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        stacked: false,
        gridLines: {
          zeroLineWidth: 1,
          zeroLineColor: 'rgba(128,128,128,0.1)',
          color: 'rgba(128,128,128,0.1)',
        },
        ticks: {
          beginAtZero: true,
          callback: valueFormatter,
          maxTicksLimit: 5,
          fontColor: '#9EA0A5',
        },
      },
    ],
    xAxes: [
      {
        stacked: false,
        gridLines: {
          color: 'transparent',
          zeroLineWidth: 2,
          drawBorder: false,
        },
        ticks: {
          fontColor: '#9EA0A5',
        },
        // barPercentage: 0.7,
        // maxBarThickness: 12,
      },
    ],
  },
});
