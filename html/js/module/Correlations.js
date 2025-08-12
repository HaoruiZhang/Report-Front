
const Correlations = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Object,
    yAxisTitle: String,
  },
  setup(props) {


    function plotCorrelation(domID) {
      const data = [];
      const xData = props.data.trace.x;
      const yData = props.data.trace.y;
      const zData = props.data.trace.z;
      const geneMap = {};
      let isGeneProteinMap = Boolean(props.data.trace.customdata?.length);

      yData.forEach((y, yIndex) => {
        xData.forEach((x, xIndex) => {
          data.push([x, y, zData[xIndex][yIndex]]);
          if (props.data.trace.customdata) {
            geneMap[y] = props.data.trace.customdata[yIndex];
          };
        });
      });
      
      const option = {
        animation: false,
        animationDuration: 0,
        animationEasing: 'cubicInOut',

        grid: {
          top: '0',
          bottom: '80',
          right: '100px'
        },
        dataZoom: [
          {
            bottom: '25px',
            type: 'slider',
            xAxisIndex: 0,
            minSpan: 25,
            filterMode: 'none',
            fillerColor: 'rgba(69, 83, 122, 0.1)',
            borderColor: 'rgba(69, 83, 122,  0.1)',
            brushStyle: {
              color: 'rgba(69, 83, 122, 0.15)'
            },
            handleStyle: {
              color: '#ffffff'
            },
            moveHandleSize: 8,
            moveHandleStyle: {
              color: 'rgba(69, 83, 122, 0.3)'
            },
            textStyle: {
              color: 'rgba(69, 83, 122, 0.8)'
            },
            emphasis: {
              moveHandleStyle: {
                color: 'rgba(69, 83, 122, 0.4)'
              },
              handleStyle: {
                color: 'rgba(69, 83, 122, 0.3)',
                borderColor: 'rgba(69, 83, 122, 0.3)'
              }
            },
            height: 24
          },
          {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none',
            right: '70',
            minSpan: 25,
            fillerColor: 'rgba(69, 83, 122, 0.1)',
            borderColor: 'rgba(69, 83, 122,  0.1)',
            brushStyle: {
              color: 'rgba(69, 83, 122, 0.15)'
            },
            handleStyle: {
              color: '#ffffff'
            },
            moveHandleSize: 8,
            moveHandleStyle: {
              color: 'rgba(69, 83, 122, 0.3)'
            },
            textStyle: {
              color: 'rgba(69, 83, 122, 0.8)'
            },
            emphasis: {
              moveHandleStyle: {
                color: 'rgba(69, 83, 122, 0.4)'
              },
              handleStyle: {
                color: 'rgba(69, 83, 122, 0.3)',
                borderColor: 'rgba(69, 83, 122, 0.3)'
              }
            },
            width: 24
          },
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none'
          },
          {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none'
          }
        ],
        xAxis: {
          type: 'category',
          data: xData,
          splitArea: {
            show: true
          },
          axisLabel: {
            fontSize: 14,
            align: 'center'
          }
        },
        yAxis: {
          type: 'category',
          data: yData,
          splitArea: {
            show: true
          },
          axisLabel: {
            fontSize: 14
          }
        },
        visualMap: {
          min: -1,
          max: 1,
          calculable: true,
          precision: 1,
          itemWidth: 16,
          itemHeight: 307,
          orient: 'vertical',
          right: '0',
          bottom: '70px',
          align: 'left',
          inRange: {
            color: ['#16518B', '#7DB6D6', '#ffffff', '#F2A851', '#9D4D09']
          },
          text: ['Corr']
        },

        tooltip: {
          show: true,
          position: 'top',
          padding: 0,
          borderColor: 'rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          appendTo: function (chartContainer) {
            return document.body;
          },
          axisPointer: {
            type: 'cross',
            label: {
              show: true,
              backgroundColor: '#c1c4c9'
            },
            animationThreshold: 1000,
            animationDurationUpdate: 20,
            animationDelay: 20,
            animation: false
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
            return `
      <div style="border: none;">

        <div style="color:rgba(69, 83, 122, 1);background: rgba(235, 236, 240, 1);padding: 6px 12px;height:24px;font-size:14px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px ">
          ${isGeneProteinMap ? 'Gene:' : ''}Protein Correlations
        </div>
        <div style="padding:12px 16px;display:flex;justify-content:center;">
            <div style=" color:#45537A;text-align: right;font-weight: 400;margin-right: 4px;font-size:12px;font-style: normal;">
              <div>${isGeneProteinMap ? 'Gene' : 'Protein_X'}&nbsp;:</div>
              <div style="${isGeneProteinMap ? '' : 'display: none'}">Gene ID&nbsp;:</div>
              <div>${isGeneProteinMap ? 'Protein' : 'Protein_Y'}&nbsp;:</div>
              <div>Correlations&nbsp;:</div>
            </div>
            
            <div style=" color:#45537A;font-weight: 500;font-size:12px;font-style: normal;">
              <div>${param.data[isGeneProteinMap ? 1 : 0].split('*')[0]}</div>
              <div style="${isGeneProteinMap ? '' : 'display: none'}">${geneMap[param.data[1]]}</div>
              <div>${param.data[isGeneProteinMap ? 0 : 1]}</div>
              <div>${param.data[2].toFixed(4)}</div>
            </div>  
        </div>     
      </div>
      `;
          }
        },
        series: [
          {
            name: 'Punch Card',
            type: 'heatmap',
            data: data,
            progressiveThreshold: 1000000,
            emphasis: {
              itemStyle: {
                shadowBlur: 1,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
      const elementToDownload = document.getElementById(props.moduleTitle);
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
      console.log('Mount Correlation: ', props);
      plotCorrelation(props.yAxisTitle + '_protein_correlation');
    });

    return {
      props,
      downloadEPlot
    };
  },
  template: `
  <div :id="props.moduleTitle" class="module-box" style="width: 1200px; ">
    <div class="module-title-box">
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip :raw-content="true" offset="8" v-if="props.msg && props.msg.length" popper-class="hover-msg-box" :content="props.msg" placement="right">
          <div class="msg-icon-box size18">
            <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="module-content-box" style="display: flex;justify-content: space-evenly;position: relative;">
      <div class="custom-toolbox" style="top: 0px; right: 0px;">
        <el-tooltip offset="8" popper-class="hover-msg-box" content="Download plot as a png" placement="top">
          <div class="toolboxBtn" @click="downloadEPlot" style="position: absolute; right: 0px;top:0px; ">
            <el-icon :size="16"><zhrDownload /></el-icon>
          </div>
        </el-tooltip>
      </div>
      <div :id="props.yAxisTitle + '_protein_correlation'" style="overflow:auto;height: 680px;width: 1160px;"></div>
    </div>
  </div>
  `
};