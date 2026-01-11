import React from 'react';
import ReactECharts from 'echarts-for-react';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  height?: string;
  colors?: string[];
  showLegend?: boolean;
  donut?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title = '',
  height = '400px',
  colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  showLegend = true,
  donut = false
}) => {
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      textStyle: {
        color: '#333'
      },
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: showLegend ? {
      orient: 'vertical',
      left: 'left',
      data: data.map(item => item.name),
      textStyle: {
        color: '#666'
      }
    } : undefined,
    series: [
      {
        name: title,
        type: 'pie',
        radius: donut ? ['40%', '70%'] : '60%',
        center: showLegend ? ['60%', '50%'] : ['50%', '50%'],
        avoidLabelOverlap: false,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: colors[index % colors.length]
          }
        }))
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default PieChart;
