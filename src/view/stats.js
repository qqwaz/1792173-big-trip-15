import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { calcMoney, formatMoney, calcType, formatType, calcTime, formatTime } from '../utils/stats.js';
import { STAT_TYPES } from '../const.js';

const BAR_HEIGHT = 30;
const calcChartHeigth = (bars) => BAR_HEIGHT * bars;

const getConfiguration = (labels, values, formatter, title) => ({
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels,
    datasets: [{
      data: values,
      backgroundColor: '#ffffff',
      hoverBackgroundColor: '#ffffff',
      anchor: 'start',
      barThickness: 30,
      minBarLength: 100,
    }],
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 13,
        },
        color: '#000000',
        anchor: 'end',
        align: 'start',
        formatter,
      },
    },
    title: {
      display: true,
      text: title,
      fontColor: '#000000',
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: '#000000',
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
  },
});

const renderMoneyChart = (ctx, data) => {
  ctx.height = calcChartHeigth(data.size);
  return new Chart(ctx, getConfiguration([...data.keys()], [...data.values()], formatMoney, 'MONEY'));
};

const renderTypeChart = (ctx, data) => {
  ctx.height = calcChartHeigth(data.size);
  return new Chart(ctx, getConfiguration([...data.keys()], [...data.values()], formatType, 'TYPE'));
};

const renderTimeChart = (ctx, data) => {
  ctx.height = calcChartHeigth(data.size);
  return new Chart(ctx, getConfiguration([...data.keys()], [...data.values()], formatTime, 'TIME-SPEND'));
};

const template = () => {
  const statListElement = STAT_TYPES.map(((type) => `
    <div class="statistics__item">
      <canvas class="statistics__chart" id="${type}" width="900"></canvas>
    </div>`
  ))
    .join('');

  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
      ${statListElement}
    </section>`);
};

export default class Stats extends SmartView {
  constructor(points) {
    super();
    this._data = {
      money: calcMoney(points),
      type: calcType(points),
      time: calcTime(points),
    };
    this._setCharts();
  }

  getTemplate() {
    return template();
  }

  _removeCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }
  }

  removeElement() {
    super.removeElement();
    this._removeCharts();
  }

  _setCharts() {
    this._removeCharts();

    const moneyCtx = this.getElement('#money');
    const typeCtx = this.getElement('#type');
    const timeCtx = this.getElement('#time-spend');

    this._moneyChart = renderMoneyChart(moneyCtx, this._data.money);
    this._typeChart = renderTypeChart(typeCtx, this._data.type);
    this._timeChart = renderTimeChart(timeCtx, this._data.time);
  }
}
