
const Counts = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Array
  },
  setup(props) {
    const { dataSet, colorList, nameList } = props.data;
    const formattedSeries = ref([]);
    const selectedNameList = ref([...nameList]);
    let myChart;


    function formatData() {
      /*const { data } = props;
      const traces = data.traces;
      const newDataSet = [];
      const newSeries = [];
      const nameList = [];
      const colorList = [];

      traces.forEach((item, index) => {
        newSeries.push(
          {
            name: item.name,
            color: item.marker.color,
          }
        );
        nameList.push(item.name);
        colorList.push(item.marker.color);
        newDataSet.push({
          source: [[...item.x], [...item.y]]
        })
      });
 */

    };

    const itemStyle = {
      seriesLayoutBy: 'row',
      type: 'bar',
      itemStyle: {
        opacity: 0.7
      }
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
    function formatter(value) {
      if (value < 1000) {
        return value;
      } else {
        return Math.round(value / 1000) + 'K';
      }
    }

    function plotCounts(series) {



      const option = {
        grid: {
          left: 56,
          bottom: 50,
          right: 144,
        },

        xAxis: {
          color: '#8c92a3',
          name: 'Log10 (1+Count)',
          nameLocation: 'center',
          nameGap: 30,
          nameTextStyle: axisNameStyle,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#8C92A3'
            }
          },
          axisLabel: {
            ...axisLabelStyle
          }
        },
        yAxis: {
          type: 'value',
          splitNumber: 8,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          color: '#8c92a3',
          name: 'Number of Spots',
          nameLocation: 'center',
          nameGap: 36,
          nameTextStyle: axisNameStyle,
          axisLabel: {
            ...axisLabelStyle,
            margin: 12,
            formatter: function (value, index) {
              return formatter(value);
            }
          }
        },

        barMinWidth: 3,
        barGap: '-100%',
        emphasis: { focus: 'series' },
        tooltip: {
          borderColor: 'rgba(0,0,0,0.1)',
          show: true,
          position: 'top',
          padding: 0,
          appendTo: function (chartContainer) {
            return document.body;
          },
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
            'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 96px; border-radius:8px;border: none;',
          formatter: function (param) {
            return `
          <div style="border: none">
            <div style="color:white;background: ${param.color
              };padding: 6px 12px;height:24px;font-size:14px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px ">
              ${param.seriesName}
            </div>
            <div style="padding:12px 16px;backgroundColor: #000000;">
              <div style="color:#45537A;padding:0; ;font-size:12px;text-align:center">
                <span style="width:100px;display:inline-block;text-align: right;font-weight: 400;margin-right: 12px;">Log10(1+Count)&nbsp;: </span>
                <span style="color:#45537A;  font-weight: 500; line-height: 18px; ">${param.data[0].toFixed(
                6
              )}</span>
              </div>
              
              <div style="color:#45537A;padding:0;font-size:12px;">
                <span style="width:100px; display:inline-block;text-align: right;font-weight: 400;margin-right: 12px;">Number of Spots&nbsp;: </span>
                <span style="color:#45537A;  font-weight: 500; line-height: 18px; ">${param.data[1]
              }</span>
              </div>
            </div>
          </div>
          `;
          }
        },

        legend: {
          type: 'scroll',
          show: false,
          itemHeight: 12,
          itemGap: 12,
          itemStyle: {},
          icon: 'circle',
          textStyle: {
            width: 100,
            overflow: 'truncate'
          },
          data: nameList,

          selector: [
            {
              type: 'all',
              title: 'All'
            },
            {
              type: 'inverse',
              title: 'Inverse'
            }
          ],
          right: 0,
          top: 0,
          height: 466,
          width: 520,
          orient: 'vertical',
          pageIconSize: 8,
          pageIconColor: '#45537A',
          pageTextStyle: {
            fontSize: 10
          },
          pageButtonGap: 4,
        },

        series,
        dataset: dataSet
      };

      myChart.setOption(option, { notMerge: true });
    };

    function downloadEPlot() {
      const elementToDownload = document.getElementById('proteinCounts');
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = props.moduleTitle + '.png';
        link.click();
      });
    };
    function resetPlot() {
      plotCounts(formattedSeries.value);
      selectedNameList.value = [...nameList];
    };


    function toggleDblClick(item) {
      console.log('toggleDblClick', item);
      if (selectedNameList.value.length === props.data.nameList.length) {
        selectedNameList.value = [item.name];
      } else {
        selectedNameList.value = [...props.data.nameList];
      };
      toggleSelect(selectedNameList.value);
    };

    function toggleClick(item) {
      console.log('toggleClick', item);
      if (selectedNameList.value.includes(item.name)) {
        selectedNameList.value = selectedNameList.value.filter(name => name !== item.name);
      } else {
        selectedNameList.value.push(item.name);
      };
      toggleSelect(selectedNameList.value);
    };

    function toggleSelect(itemsArr) {
      console.log('toggleSelect', itemsArr);
      const newSeries = [];
      formattedSeries.value.forEach((item, index) => {
        if (itemsArr.includes(item.name)) {
          newSeries.push({
            ...item,
            itemStyle: {
              opacity: 0.7
            }
          });
        }/* else {
          newSeries.push({
            ...item,
            itemStyle: {
              opacity: 0.05
            }
          });
        }*/
      });
      plotCounts(newSeries);
    };
    onMounted(() => {
      console.log('Mount Counts: ', props);
      var chartDom = document.getElementById('histogram_of_protein_counts');
      myChart = echarts.init(chartDom);
      formattedSeries.value = nameList.map((item, index) => {
        return {
          datasetIndex: index,
          name: item,
          color: colorList[index],
          ...itemStyle,
        }
      });
      plotCounts(formattedSeries.value);
    });

    return {
      props,
      formattedSeries,
      selectedNameList,
      toggleDblClick,
      downloadEPlot,
      resetPlot,
      toggleClick
    };
  },
  template: `
  <div class="module-box Counts-box" style="width: 1200px;padding-bottom: 20px">
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

    <div class="module-content-box" id="proteinCounts" style="padding-top: 38px;display: flex;justify-content: space-evenly;">
      <div id="histogram_of_protein_counts" style="position:relative;height: 500px;width: 1160px;"></div>
      <div id="legend_box" style="width: 128px;height: 470px;position: absolute;right: 0;top: 40px;overflow:scroll;overscroll-behavior:contain">
        <template v-for="(item, index) in formattedSeries">
          <div class="legend-item" @dblclick.stop.prevent="toggleDblClick(item)" @click.stop.prevent="toggleClick(item)" 
          :style="'width: 100%;height: 20px;display:flex;align-items:center;justify-content: flex-start;opacity:'+ (selectedNameList.includes(item.name) ? 1 : 0.4)">
            <div :style="'width: 12px;height:12px;border-radius:50%;background-color:'+ item.color"></div>
            <span style="font-size: 12px;line-height:20px;margin-left: 8px;max-width:109px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{item.name}}</span>
          </div>
        </template>
      </div>
      <div class="custom-toolbox">
        <div class='toolboxBtn' @click="downloadEPlot">
          <el-icon size="16">
            <zhrDownload />
          </el-icon>
        </div>
        <div class='toolboxBtn' @click="resetPlot">
          <el-icon size="20">
            <zhrReset />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
  `
};