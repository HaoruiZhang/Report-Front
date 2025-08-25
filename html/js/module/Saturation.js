
const Saturation = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Array
  },
  setup(props) {
    const ifShowExplain = ref(false);
    const plotboxStyle = ref(props.data.length == 2 ? "width:564px;height:487px;display:flex;" : "width:365px;height:487px;display:flex");

    function formatter(value, gap = 0) {
      if (value == 0){
        return value;
      } else if (value > 0 && value <= 1) {
        return value.toFixed(2);
      } else if (value > 1 && value <= 1000) {
        return value.toFixed(gap);
      } else if (value > 1000 && value <= 1000000) {
        return (value / 1000).toFixed(gap) + 'K';
      } else if (value > 1000000 && value <= 1000000000) {
        return (value / 1000000).toFixed(gap) + 'M';
      } else if (value > 1000000000) {
        return (value / 1000000000).toFixed(gap) + 'G';
      };
    };

    const axisNameStyle = {
      color: '#45537A',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 22,
    };

    const axisLabelStyle = {
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 20,
      color: '#8c92a3'
    };

    function plotSaturation(domID, plotData) {
      const option = {
        grid: {
          left: 6,
          right: 6,
          bottom: 30,
          containLabel: true
        },
        tooltip: {
          show: true,
          position: 'top',
          padding: 0,
          borderColor: 'rgba(0,0,0,0.1)',
          backgroundColor: '#ffffff',
          axisPointer: {
            type: 'cross',
            label: {
              show: false,
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
            console.log(param);
            param.title = plotData.hoverTitle;
            param.hoverTemplate = plotData.hoverTemplate;
            return `
        <div style="border: none">

          <div style="color:white;background: ${param.color
              };padding: 6px 12px;height:24px;font-size:14px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px ">
            ${param.title}
          </div>

          <div style="padding:12px 16px;backgroundColor: #000000;display:flex;justify-content:center;">
            
            <div style=" color:#45537A;text-align: right;font-weight: 400;margin-right: 4px;font-size:12px;font-style: normal;">
              <div>Sampling Ratio :</div>
              <div>${param.hoverTemplate}&nbsp;:</div>
            </div>
            
            <div style=" color:#45537A;font-weight: 500;font-size:12px;font-style: normal;">
              <div>${param.dataIndex===0? 0.05: (param.dataIndex / 10).toFixed(2) }</div>
              <div>${param.data[1]}</div>
            </div>
          </div>
        </div>
        `;
          }
        },

        xAxis: {
          color: '#8c92a3',
          type: 'value',
          name: plotData.xTitle,
          nameLocation: 'center',
          nameGap: 40,
          min: -0.02,
          max: 1.054,
          nameTextStyle: axisNameStyle,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#EBECF0'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false,
            interval: 1,
            alignWithLabel: true
          },
          axisLabel: {
            ...axisLabelStyle,
            interval: 1,
            formatter: function (value, index) {
              return formatter(plotData.x[value * 10], 1);
            }
          }
        },

        yAxis: {
          type: 'value',
          color: '#8c92a3',
          /*
          name: plotData.yTitle,
          nameLocation: 'center',
          nameGap: 30,
          nameTextStyle: axisNameStyle, 
          */
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            ...axisLabelStyle,
            formatter: function (value, index) {
              return formatter(value);
            }
          }
        },
        series: [
          {
            data: plotData.y.map((y, index) => {
              return [index / 10, y]
            }),
            type: 'line',
            smooth: true,
            symbolSize: 6,
            name: plotData.hoverTemplate,
            areaStyle: {
              opacity: 0.2,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: plotData.color
                },
                {
                  offset: 1,
                  color: '#ffffff'
                }
              ])
            },
            lineStyle: {
              color: plotData.color,
              width: 2
            },
            itemStyle: {
              borderWidth: 10,
              borderColor: '#5f0085',
              color: plotData.color
            },
            emphasis: {
              scale: 1.7,
              itemStyle: {
                borderWidth: 2.5,
                borderColor: '#ffffff',
                color: plotData.color
              }
            }
          }
        ]
      };
      var chartDom = document.getElementById(domID);
      var myChart = echarts.init(chartDom);
      myChart.setOption(option);
    };

    function downloadEPlot() {
      const elementToDownload = document.getElementById('saturationContentBox');
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = props.moduleTitle + '.png';
        link.click();
      });
    };



    onMounted(() => {
      console.log('Mount Saturation: ', props);
      props.data.forEach((data, index) => {
        plotSaturation('saturation_' + index, data);
      });

      /*
      props.data.forEach((item, index) => {
        Plotly.newPlot(document.getElementById('saturation_' + index), [mergeObjects(deepCopy(trace), item.trace)], mergeObjects(deepCopy(layout), item.layout), mergeObjects(deepCopy(config), item.config));
      });
      */
    });

    return {
      props,
      ifShowExplain,
      plotboxStyle,
      downloadEPlot
    };
  },
  template: `
  <div id="saturationContentBox" class="module-box" style="width: 1200px;">
    <div class="module-title-box">
      <div class="title-box-left">
        <span class="title-label">{{props.moduleTitle}}</span>
        
      </div>
    </div>


    <div class="module-content-box" style="display: flex;justify-content: space-between;padding-bottom: 16px;position:relative;">
      <template v-for="(item, index) in props.data">
        <div :style="plotboxStyle"> 
          <div style="height:100%;width:22px;position:relative;">
            <div style="height:22px;width:280px;transform:rotate(270deg);display:flex;justify-comtent:center;align-items:center;position:absolute;bottom:60%;left:-130px;">
              <span style="display:inline-block;margin-right:4px;fontSize:14px;fontStyle:normal;fontWeight:400;lineHeight:22px;color:#45537A;">
                {{item.yTitle}}
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item.yMsg" placement="right">
                <div class="msg-icon-box marginL">
                    <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div> 
          </div>

          <div :id="'saturation_' + index" style='width:100%;height:100%'> 
          </div>
        </div>
        
      </template>
      <div class="custom-toolbox">
        <div class='toolboxBtn' @click="downloadEPlot">
          <el-icon size="16">
            <zhrDownload />
          </el-icon>
        </div>
      </div>
      
    </div>
  </div>
  `
};