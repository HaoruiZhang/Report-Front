
const BatchCorrection = {

  props: {
    moduleTitle: String,
    data: Array,
  },
  setup(props) {
    const formattedSeries = ref([]);
    const spatialOpacity = ref(0.8);
    const layout = {
      yaxis: { autorange: 'reversed', scaleanchor: "x", scaleratio: 1, showgrid: false, showticklabels: false, zeroline: false },
      xaxis: { showgrid: false, showticklabels: false, zeroline: false },
      margin: { 'l': 0, 't': 0, 'r': 0, 'b': 0 },
      dragmode: false,
      showlegend: false,
      plot_bgcolor: '#fafafa',

    };

    const config = {
      scrollZoom: false,
      displaylogo: false,
      displayModeBar: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'cluster_image',
        height: 500,
        width: 500,
        scale: 5
      },

      modeBarButtonsToRemove: ["hoverClosestCartesian", "hoverCompareCartesian", "toggleSpikelines", "autoScale2d", "lasso2d", "select2d", 'zoomout', 'zoomin', 'pan', 'zoom', 'resetAxes', 'resetScale2d'],
    };

    function toggleDblClick(item) {
      console.log('_toggleDblClick', item);
      /**
       * 双击图例，如果目前是全部显示的，则只显示这个，否则，显示全部
       */

      const isShowAll = formattedSeries.value.every(item => item.itemStyle.visible);/**目前是否全部都显示的 */
      console.log('isShowAll', isShowAll);
      if (isShowAll) {
        formattedSeries.value.forEach(subItem => {
          subItem.itemStyle.visible = item.name === subItem.name ? true : false;
          subItem.itemStyle.opacity = item.name === subItem.name ? 0.8 : 0.4;
        });
      } else {
        formattedSeries.value.forEach(subItem => {
          subItem.itemStyle.visible = true;
          subItem.itemStyle.opacity = 0.8;
        });
      }
      updateStyle();
    };

    function toggleClick(item) {
      console.log('_toggleClick', item);
      formattedSeries.value.forEach(subItem => {
        if (subItem.name !== item.name) return;
        subItem.itemStyle.visible = !subItem.itemStyle.visible;
        subItem.itemStyle.opacity = subItem.itemStyle.visible ? 0.8 : 0.4;
      });
      updateStyle();
    };

    function updateStyle() {
      const dataLength = props.data.length;
      const visibleList = formattedSeries.value.map(item => item.itemStyle.visible);
      const indexList = formattedSeries.value.map(item => item.index);

      for (let i = 0; i < dataLength; i++) {
        Plotly.restyle(`plot-${i}`, {
          visible: visibleList,
        },
          indexList
        );
      }
    }

    onMounted(() => {
      console.log('BatchCorrection Module mounted, props: ', props);
      props.data.forEach((item, index) => {
        const plotId = 'plot-' + index;
        const plotData = item.data.map((dataItem) => {
          return {
            ...dataItem,
            marker: {
              ...dataItem.marker,
              opacity: spatialOpacity.value,
            }
          };
        });
        Plotly.newPlot(plotId, plotData, { ...layout }, config);
      });
      formattedSeries.value = props.data[0].data.map((item, index) => {
        return {
          index: index,
          name: item.name,
          itemStyle: {
            color: item.marker.color,
            opacity: 0.8,
            visible: true
          }
        }
      });
    });
    function downloadEPlot() {
      const elementToDownload = document.getElementById('batchCorrectionClusterArea');
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = props.moduleTitle + '.png';
        link.click();
      });
    };


    return {
      props,
      toggleDblClick,
      toggleClick,
      formattedSeries,
      downloadEPlot
    };
  },
  template: `
    
  <div class="module-box batchCorrection-module" id="batchCorrectionClusterArea"  style="width: 1200px;padding-bottom: 20px">
    <div class="module-title-box">
      <div class="title-box-left">
         <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip offset="8" v-if="props.msg && props.msg.length" popper-class="hover-msg-box" :raw-content="true" :content="props.msg" placement="right">
          <div class="msg-icon-box size18">
            <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="module-content-box" id="proteinCounts" style="padding-top: 32px;display: flex;justify-content: space-evenly;">
      <div class="custom-toolbox">
        <div class='toolboxBtn' @click="downloadEPlot">
          <el-icon size="16">
            <zhrDownload />
          </el-icon>
        </div>
      </div>
      <div class="cluster-area" >
        <div style="width:1046px;display: flex;justify-content: space-between;align-items: center;">
          <template v-for="(item, index) in props.data">
            <div :style="(props.data.length===1? 'width:1160px;' : 'width:507px;') + 'border-radius: 5px;'">
              <div class="cluster-container" style="width:100%;height:456px;position:relative;"> 
                <div :id="'plot-'+index" style="width:100%;height:456px;"></div>
              </div>
              <div class="title" style="width:100%;margin-top:16px;display:flex;justify-content:center;align-items:center;">
                <span style="color: var(--Light-05--B2-, #45537A);text-align: center; font-size: 16px;font-style: normal;font-weight: 400;line-height: 16px; ">
                  {{item.title}}
                </span>
                <el-tooltip offset="8" :content="item.msg" :raw-content="true" popper-class="hover-msg-box" placement="top" v-if="item.msg && item.msg.length">
                  <div class="msg-icon-box size14 marginL" >
                    <zhrWholeAsk />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </div>
        <div style="height: 470px; overflow:auto; overscroll-behavior:contain">
          <div id="batchCorrection_legendBox" style="padding-left: 12px;">
            <template v-for="(item, index) in formattedSeries">
              <div class="legend-item" @dblclick.stop.prevent="toggleDblClick(item)" @click.stop.prevent="toggleClick(item)" 
              :style="'width: 100%;height: 26px;display:flex;align-items:center;justify-content: flex-start;opacity:'+ item.itemStyle.opacity + ';cursor: pointer;'">
                <div :style="'width: 12px;height:12px;border-radius:50%;background-color:'+ item.itemStyle.color"></div>
                <span style="font-size: 14px;line-height:14px;margin-left: 8px; white-space:nowrap;text-overflow:ellipsis; color:#45537A">{{item.name}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div> 
  `
};
