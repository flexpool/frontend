import React, { PureComponent } from 'react';
import defaultsDeep from 'lodash.defaultsdeep';
import { defaults as chartjsDefaults } from 'react-chartjs-2';
import * as chartjs from 'chart.js';

import createCustomTooltip from './CustomTooltip';
import cls from './chartjs.module.scss';

import { getChartOptions } from './getDefaultOptions';
import { clx } from 'src/utils/clx';

chartjsDefaults.global.defaultFontFamily = 'Roboto';

const getChart = (chartType: string) => require('react-chartjs-2')[chartType]; // eslint-disable-line

export class Chart extends PureComponent<{
  minHeight?: number;
  maxHeight?: number;
  height?: number;
  width?: number;
  chartType: string;
  valueFormatter?: (e: any) => any;
  options?: chartjs.ChartOptions;
  data: chartjs.ChartData;
}> {
  static defaultProps = {
    options: {},
    valueFormatter: (e: any) => {},
    minHeight: 0,
    maxHeight: 400,
    height: null,
    width: null,
    tooltipRenderer: undefined,
    chartType: 'Line',
    className: null,
  };

  tooltipRef = React.createRef<HTMLDivElement>();
  canvasWrapperRef = React.createRef<HTMLDivElement>();

  state = {
    size: {
      width: null,
      height: null,
    },
  };

  componentDidMount() {
    this.setCanvasSize();
    if (window) {
      window.addEventListener('resize', this.setCanvasSize, true);
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.setCanvasSize, true);
    }
  }

  setCanvasSize = () => {
    // responsive
    const {
      canvasWrapperRef: { current: wrapperEl },
    } = this;

    const {
      minHeight = 500,
      maxHeight = 500,
      height: defaultHeight,
      width: defaultWidth,
    } = this.props;

    if (wrapperEl) {
      const width = defaultWidth || Math.min(wrapperEl.clientWidth, 4000);
      const height =
        defaultHeight ||
        Math.max(Math.min(wrapperEl.clientWidth / 2.3, maxHeight), minHeight);
      this.setState({
        size: {
          width,
          height,
        },
      });
    }
  };

  render() {
    const {
      data,
      options = {},
      valueFormatter,
      chartType = 'line',
    } = this.props;

    const Chart = getChart(chartType);

    const finalOptions: chartjs.ChartOptions = defaultsDeep(
      {},
      options,
      {
        tooltips: {
          custom: (tooltip: any) =>
            createCustomTooltip(
              this.tooltipRef.current,
              tooltip,
              valueFormatter
            ),
        },
      },
      getChartOptions(valueFormatter)
    );

    const {
      size: { width, height },
    } = this.state;

    const sizecls = {
      width,
      height,
    };

    return (
      <div className={clx(cls['duik-chart-js'])}>
        <div
          ref={this.canvasWrapperRef}
          className={cls['duik-chart-js-canvas-wrapper']}
        >
          <div
            className={cls['duik-chart-js-tooltip-wrapper']}
            style={{ height: 300 }}
          >
            <Chart data={data} options={finalOptions} redraw {...sizecls} />
            <div ref={this.tooltipRef} className={cls['duik-chart-js-tooltip']}>
              <div className="tooltip__content">
                <table />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chart;
