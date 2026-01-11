import React from 'react';
import ReactECharts from 'echarts-for-react';

interface BarChartProps {
  data: {
    xAxis: string[];
    series: Array<{
      name: string;
      data: number[];
      type: 'line' | 'bar' | 'pie';
    }>;
  };
  title?: string;
  height?: string;
  colors?: string[];
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title = '',
  height = '400px',
  colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
  horizontal = false
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
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      textStyle: {
        color: '#333'
      },
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: horizontal ? {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    } : {
      type: 'category',
      data: data.xAxis,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        rotate: data.xAxis.length > 10 ? 45 : 0
      }
    },
    yAxis: horizontal ? {
      type: 'category',
      data: data.xAxis,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      }
    } : {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: data.series.map((series, index) => ({
      ...series,
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        color: colors[index % colors.length],
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          color: colors[index % colors.length],
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      }
    }))
  };

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default BarChart;
