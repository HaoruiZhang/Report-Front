
const ClusterRatio = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Array
  },
  setup(props) {
    const { series, sliceList } = props.data;
    const formattedSeries = ref([]);
    const selectedNameList = ref([]);
    const rawNameList = [];
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
        return value == 0 ? 0 : value.toFixed(1);
      } else {
        return Math.round(value / 1000) + 'K';
      }
    };

    async function plotRatio(plotSeries) {
      await nextTick();
      const legendWidth = parseInt(getComputedStyle(document.getElementById('clusterRatio_legendBox')).getPropertyValue('width').split('px')[0]) + 16;
      const option = {
        dataZoom: sliceList.length > 16 ? [
          {
            show: true,
            borderRadius: 5,
            type: "slider",
            showDetail: false,
            startValue: 0,
            endValue: 16,
            filterMode: "empty",
            height: 0,
            bottom: 30,
            left: 30,
            right: legendWidth + 1,
            zoomLock: true,
            handleSize: 0,
            moveHandleSize: 5,
            showDataShadow: false,


            dataBackground: {
              lineStyle: {
                color: '#ffffff',
                opacity: 0
              },
              areaStyle: {
                opacity: 0
              }
            },

            fillerColor: "#fff",
            borderColor: "#fff",

            handleStyle: {
              opacity: 0
            },

            moveHandleStyle: {
              color: '#45537A',
              opacity: 0.24,
            },
            emphasis: {
              moveHandleStyle: {
                color: '#333'
              }
            }
          },
          {
            type: "inside",
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true,
          },
        ] : [],
        grid: {
          left: 32,
          bottom: 64,
          right: legendWidth,
          top: 8
        },
        label: {
          show: false,
        },
        xAxis: {
          data: sliceList,
          color: '#8c92a3',
          name: 'Slice',
          nameLocation: 'center',
          nameGap: 46,
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
          splitNumber: 5,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          color: '#8c92a3',
          nameLocation: 'center',
          nameGap: 20,
          nameTextStyle: axisNameStyle,
          axisLabel: {
            ...axisLabelStyle,
            margin: 8,
            formatter: function (value, index) {
              return formatter(value);
            }
          }
        },



        tooltip: {
          borderColor: 'rgba(0,0,0,0.1)',
          show: true,
          position: 'top',
          padding: 0,
          trigger: 'item',
          appendTo: function (chartContainer) {
            return document.body;
          },
          backgroundColor: '#ffffff',
          textStyle: {
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 22,
            color: '#ffffff',
            textAlign: 'center'
          },
          extraCssText:
            'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 96px; border-radius:4px;border: none;',

          formatter: function (param) {
            return `
            
          <div style="padding:8px 16px; display: flex; align-items: center;justify-content: flex-start;">
            <div style="width:8px;height:8px;border-radius:50%;background-color:${param.color};"></div>

            <div style="color:#45537a;font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 18px;margin-left:8px;">
              ${param.seriesName}&nbsp;:&nbsp;
            </div>
            <span style="font-size: 12px;color:#45537a;
font-style: normal;
font-weight: 500;
line-height: 18px;">
              ${Math.round(param.data * 10000) / 100 === 0 ? 0 + '%' : (Math.round(param.data * 10000) / 100).toFixed(2) + '%'}
            </span> 
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
          data: rawNameList,

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

        series: plotSeries,
      };

      myChart.setOption(option, { notMerge: true });
    };

    
    function resetPlot() {
      plotRatio(formattedSeries.value);
      selectedNameList.value = [...rawNameList];
    };


    function toggleDblClick(item) {
      console.log('toggleDblClick', item);
      if (selectedNameList.value.length === rawNameList.length) {
        selectedNameList.value = [item.name];
      } else {
        selectedNameList.value = [...rawNameList];
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
      console.log('_toggleSelect', itemsArr);
      const newSeries = [];
      formattedSeries.value.forEach((item, index) => {
        if (itemsArr.includes(item.name)) {
          newSeries.push({
            ...item
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
      plotRatio(newSeries);
    };
 
    async function downloadEPlot() {
      const zip = new JSZip();
       
      const mainPlot = document.getElementById('histogram_of_protein_counts');
      const mainCanvas = await html2canvas(mainPlot, {
        allowTaint: true,
        useCORS: true
      });
      const mainBlob = await new Promise(resolve =>
        mainCanvas.toBlob(resolve, 'image/png', 1)
      );
      zip.file(`${props.moduleTitle}.png`, mainBlob);

      const elementToDownload = document.getElementById('spatialCluster_legend');
      const canvas = await html2canvas(elementToDownload, {
        allowTaint: true,
        useCORS: true
      });
      const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, 'image/png', 1)
      );
      zip.file(`legend.png`, blob);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, props.moduleTitle + ".zip");
    };

    onMounted(() => {
      console.log('Mount Counts: ', props);
      var chartDom = document.getElementById('histogram_of_protein_counts');
      myChart = echarts.init(chartDom);


      series.forEach((item) => {
        formattedSeries.value.push({
          ...item,
          type: "bar",
          stack: "total",
          barWidth: "60%",
          barMinWidth: 40,
          barMaxWidth: 64,
          barCategoryGap: 90,
          emphasis: { focus: "series" },
        });
        selectedNameList.value.push(item.name);
        rawNameList.push(item.name);
      });
      plotRatio(formattedSeries.value);


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
  <div class="module-box ClusterRatio-box"  id="ClusterRatio" style="width: 1200px;padding-bottom: 20px">
    <div class="module-title-box">
      <div class="title-box-left">
         <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip offset="8" v-if="props.msg && props.msg.length" popper-class="hover-msg-box" :content="props.msg" placement="right" :raw-content="true">
          <div class="msg-icon-box size18">
            <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="module-content-box" style="padding-top: 52px;display: flex;justify-content: space-evenly;">
      <div id="histogram_of_protein_counts" style="position:relative;height: 400px;width: 1160px;"></div>
      <div style="max-width: 120px;height: 380px;position: absolute;right: 0;top: 52px;overflow:auto;overscroll-behavior:contain" >
        <div id="clusterRatio_legendBox" style="padding-left: 12px;">
          <template v-for="(item, index) in formattedSeries">
            <div class="legend-item" @dblclick.stop.prevent="toggleDblClick(item)" @click.stop.prevent="toggleClick(item)" 
            :style="'width: 100%;height: 20px;display:flex;align-items:center;justify-content: flex-start;opacity:'+ (selectedNameList.includes(item.name) ? 1 : 0.4)">
              <div :style="'width: 12px;height:12px;border-radius:50%;background-color:'+ item.itemStyle.color"></div>
              <span style="font-size: 12px;line-height:20px;margin-left: 8px;max-width:109px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{item.name}}</span>
            </div>
          </template>
        </div>
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