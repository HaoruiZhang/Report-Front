function formatter(value) {
  if (value < 1000) {
    return value;
  } else {
    return Math.round(value / 1000) + 'K';
  }
}

const axisNameStyle = {
  color: '#45537A',
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 22,
  fontFamily: 'PingFang SC'
};

const axisLabelStyle = {
  fontSize: 12,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 20,
  fontFamily: 'PingFang SC',
  color: '#8c92a3'
};

option = {
  tooltip: {
    show: true,
    position: 'top',
    padding: 0,
    appendTo: function (chartContainer) {
      console.log(chartContainer, 123, document.body)
      return document.getElementById('main')
    },
    backgroundColor: '#ffffff',
    // trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        show: true,
        backgroundColor: '#c1c4c9'
      }
    },
    textStyle: {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 22,
      color: '#ffffff',
      textAlign: 'center'
    },
    extraCssText:
      'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 200px; border-radius:8px;border: none;',
    formatter: function (param) {
      return `
  <div style="border: none">
    <div style="color:white;background: ${param.color
        };padding: 12px;height:24px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px ">
      Median genes per bin
    </div>
    
    
    
    
    
    
    <div style="padding:12px 16px;backgroundColor: #000000; display:flex;justify-content:center;">
    
      <div style=" color:#45537A;text-align: right;font-weight: 400;margin-right: 12px;font-family:'PingFang SC';font-size:12px;font-style: normal;">
        <div>Sampling ratio:</div>
        <div>Median genes per bin:</div>
      </div>
      
      <div style=" color:#45537A;font-weight: 500;font-family:'Helvetica Neue';font-size:12px;font-style: normal;">
        <div>${param.dataIndex / 10}</div>
        <div>${param.data}</div>
      </div>
      
    </div>
  </div>
  `;
    }
  },

  xAxis: {
    color: '#8c92a3',
    type: 'category',
    name: 'Total reads number',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: axisNameStyle,
    data: [
      16277904, 32555809, 65111618, 97667433, 130223236, 162779045, 195334866,
      227890663, 260446472, 293002281, 325558079
    ],
    axisLine: {
      lineStyle: {
        color: '#EBECF0'
      }
    },
    axisTick: {
      show: false,
      interval: 1,
      alignWithLabel: true
      // customValues: [0, 0.5, 1, 1.5, 2, 8, 9]
    },
    axisLabel: {
      ...axisLabelStyle,
      interval: 1,
      formatter: function (value, index) {
        return index / 10;
      }
    }
  },

  yAxis: {
    type: 'value',
    color: '#8c92a3',
    name: 'Unique reads number bin 50',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: axisNameStyle,
    axisLabel: {
      ...axisLabelStyle,
      formatter: function (value, index) {
        return formatter(value);
      }
    }
  },
  series: [
    {
      data: [480, 870, 1507, 2150, 2702, 3230, 3670, 4060, 4510, 4850, 5250],
      type: 'line',
      smooth: true,
      symbolSize: 14,
      areaStyle: {
        opacity: 0.2,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#9D7EF0'
          },
          {
            offset: 1,
            color: '#ffffff'
          }
        ])
      },
      lineStyle: {
        color: '#9D7EF0',
        width: 5
      },
      itemStyle: {
        borderWidth: 15,
        borderColor: '#000000',
        color: '#9D7EF0'
      },
      emphasis: {
        itemStyle: {
          borderWidth: 3,
          borderColor: '#ffffff',
          color: '#9D7EF0'
        }
      }
    }
  ]
};
