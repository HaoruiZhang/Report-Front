
const CellClusterByPng = {

  props: {
    msg: Array,
    data: Array,
    prefix: String,
    moduleTitle: String,
    baseSrc: String,
  },
  setup(props) {
    const { prefix } = props;
    const imageStateObj = ref({
      tissueSeg: { opacity: 0.8, show: true, indexStart: 0, length: 1 },
      cellSeg: { opacity: 0.8, show: true, indexStart: 1, length: 1 },
      cluster: { opacity: 0.8, show: true, indexStart: 5, length: 1 }
    });

    const spatialOpacity = ref(0.8);
    const ifShowExplain = ref(false);
    const cellSegPrefix = prefix + '-spatial-cell';
    const layout = {
      yaxis: { autorange: 'reversed', scaleanchor: "x", scaleratio: 1, showgrid: false, showticklabels: false, zeroline: false },
      xaxis: { showgrid: false, showticklabels: false, zeroline: false },
      margin: { 'l': 0, 't': 0, 'r': 0, 'b': 0 },
      dragmode: 'pan',
      showlegend: false,
      legend: {
        itemsizing: 'constant',
        itemwidth: 10,
        x: 1
      }
    };

    const config = {
      scrollZoom: true,
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

    function getClusterIndex(rawIndex) {
      const headIndex = rawIndex * 4 + 5;
      return [headIndex, headIndex + 1, headIndex + 2, headIndex + 3];
    };

    const formattedSeries = ref([]);
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
          subItem.itemStyle.opacity = item.name === subItem.name ? 0.8 : 0.1;
        });
      } else {
        formattedSeries.value.forEach(subItem => {
          subItem.itemStyle.visible = true;
          subItem.itemStyle.opacity = 0.8;
        });
      };
      updateStyle();
    };

    function toggleClick(item) {
      console.log('_toggleClick', item);
      formattedSeries.value.forEach(subItem => {
        if (subItem.name !== item.name) return;
        subItem.itemStyle.visible = !subItem.itemStyle.visible;
        subItem.itemStyle.opacity = subItem.itemStyle.visible ? 0.8 : 0.1;
      });
      updateStyle();
    };

    function updateStyle() {
      formattedSeries.value.forEach((item, index) => {
        const clusterIndex = getClusterIndex(index);
        console.log('updateStyle', item, clusterIndex);
        const renderOpacity = imageStateObj.value.cluster.show ? imageStateObj.value.cluster.opacity : 0;
        clusterIndex.forEach(i => {
          Plotly.relayout(cellSegPrefix, {
            [`images[${i}].opacity`]: item.itemStyle.visible ? renderOpacity : 0
          });
        });
      });
    };


    function changeShowState(imageType, domId = cellSegPrefix) {
      console.log('changeShowState', domId, imageType, imageStateObj.value[imageType]);
      const targetImage = imageStateObj.value[imageType];
      let renderOpacity = targetImage.show ? targetImage.opacity : 0;
      if (renderOpacity > 1) renderOpacity = 1;
      if (renderOpacity < 0) renderOpacity = 0;
      switch (imageType) {
        case 'tissueSeg':
          Plotly.relayout(domId, {
            'images[0].opacity': renderOpacity
          });
          break;
        case 'cellSeg':
          var relayoutObj = {};
          for (let i = targetImage.indexStart; i < targetImage.indexStart + targetImage.length * 4; i++) {
            relayoutObj[`images[${i}].opacity`] = renderOpacity;
          }
          Plotly.relayout(domId, relayoutObj);
          break;
        case 'cluster':
          var relayoutObj = {};
          for (let i = 0; i < targetImage.length; i++) {
            for (let j = 0; j < 4; j++) {
              relayoutObj[`images[${i * 4 + j + 5}].opacity`] = formattedSeries.value[i].itemStyle.visible ? renderOpacity : 0;
            }
          };
          console.log(relayoutObj);
          Plotly.relayout(domId, relayoutObj);
          break;
      }
    };
    function changeOpacityState(imageType, domId = cellSegPrefix) {
      console.log('changeOpacityState', domId, imageType, imageStateObj.value[imageType]);
      const targetImage = imageStateObj.value[imageType];
      const renderOpacity = targetImage.opacity;
      switch (imageType) {
        case 'tissueSeg':
          Plotly.relayout(domId, {
            'images[0].opacity': renderOpacity
          });
          break;
        case 'cellSeg':
          var relayoutObj = {};
          for (let i = targetImage.indexStart; i < targetImage.indexStart + targetImage.length * 4; i++) {
            relayoutObj[`images[${i}].opacity`] = renderOpacity;
          }
          Plotly.relayout(domId, relayoutObj);
          break;
        case 'cluster':
          var relayoutObj = {};
          for (let i = 0; i < targetImage.length; i++) {
            for (let j = 0; j < 4; j++) {
              relayoutObj[`images[${i * 4 + j + 5}].opacity`] = formattedSeries.value[i].itemStyle.visible ? renderOpacity : 0;
            };
          };
          console.log(relayoutObj);
          Plotly.relayout(domId, relayoutObj);
          break;
      }
    };

    onMounted(async () => {
      console.log('CellClusterByPng Module mounted, props: ', props);
      imageStateObj.value.cluster.length = props.data.clusters.length;
      formattedSeries.value = props.data.colorSet.map((item, index) => {
        return {
          index: index,
          name: `Cluster ${index + 1}`,
          itemStyle: {
            color: item,
            opacity: 0.8,
            visible: true
          }
        }
      });

      const workerCode = `
        self.onmessage = function(e) {
          const data = JSON.parse(e.data);
          const images = [...data.cellseg, ...data.clusters.flat(1)];
          /*const images = [...data.cellseg, ...data.clusters[0], ...data.clusters[1], ...data.clusters[2]];*/
          self.postMessage(JSON.stringify(images));
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      worker.postMessage(JSON.stringify(props.data));
      worker.onmessage = function (e) {
        const flattenImages = JSON.parse(e.data);
        console.log('【【Main received data】】', flattenImages);
        Plotly.newPlot(cellSegPrefix, [
          {
            "x": [6460, 11500],
            "y": [6460, 20000],
            "mode": "markers",
            "name": "Cluster 1",
            "type": "scattergl",
            "hovertemplate": "",
            "marker": {
              "opacity": 0,
              "symbol": "circle",
            }
          }], { ...layout, images: [props.baseSrc, ...flattenImages] }, config);
      };
    });

    return {
      props,
      spatialOpacity,
      prefix,
      cellSegPrefix,
      ifShowExplain,
      formattedSeries,
      imageStateObj,
      toggleDblClick,
      toggleClick,
      changeShowState,
      changeOpacityState
    };
  },
  template: `
  <div class="module-box cellSeg-module" style="width: 100%;">
  
    <div class="module-title-box" >
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip :raw-content="true" offset="8" v-if="props.msg && props.msg.length" popper-class="hover-msg-box" :content="props.msg" placement="right">
          <div class="msg-icon-box size18">
              <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="module-content-box" style="height:600px;">

      <div class="main-area" style="position: relative;width:767px;padding:20px;display: flex;">
        <div :id="cellSegPrefix" style="width:0;flex:1;height:100%;"></div>
        <div style="width: 98px;height: 100%; overflow:auto; margin-left: 12px;;overscroll-behavior:contain">
          <div :id="cellSegPrefix + 'legend'">
            <template v-for="(item, index) in formattedSeries">
              <div class="legend-item" @dblclick.stop.prevent="toggleDblClick(item)" @click.stop.prevent="toggleClick(item)"
              :style="'height: 26px;display:flex;align-items:center;justify-content: flex-start;opacity:'+ item.itemStyle.opacity + ';cursor: pointer;'">
                <div :style="'width: 12px;height:12px;border-radius:50%;background-color:'+ item.itemStyle.color"></div>
                <span style="font-size: 14px;line-height:14px;margin-left:8px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;color:#45537A">{{item.name}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>


      <div class="control-panel">
        <div class="msg-box">
          <p v-for="doc in props.msg">
              {{doc}}
            </p>
        </div>
        <div class="control-box">
          <div style="width: 100%; margin-top:8px;display:flex;align-items:center;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
              <el-switch
                v-model="imageStateObj.tissueSeg.show"
                size="small"
                @change="() => changeShowState('tissueSeg')"
              ></el-switch>
              <span style="display: inline-block;min-width: 80px;margin-left:4px;">Tissue</span>
            </div>
            
            <el-slider v-model="imageStateObj.tissueSeg.opacity" width="200px" :min='-0.01' :max="1.01" step=0.01 @change="changeShowState('tissueSeg')" :show-tooltip="false">
            </el-slider>
          </div>

          <!-- tissue -->
          <div style="width: 100%; margin-top:8px;display:flex;align-items:center;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
              <el-switch
                v-model="imageStateObj.cellSeg.show"
                size="small"
                @change="() => changeShowState('cellSeg')"
              ></el-switch>
              <span style="display: inline-block;min-width: 80px;margin-left:4px;">CellSeg</span>
            </div>
            
            <el-slider v-model="imageStateObj.cellSeg.opacity" width="200px" :min='-0.01' :max="1.01" step=0.01 @change="changeShowState('cellSeg')" :show-tooltip="false">
            </el-slider>
          </div>


          <div style="width: 100%; margin-top:8px;display:flex;align-items:center;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
              <el-switch
                v-model="imageStateObj.cluster.show"
                size="small"
                @change="() => changeShowState('cluster')"
              ></el-switch>
              <span style="display: inline-block;min-width: 80px;margin-left:4px;">Clusters</span>
            </div>
            
            <el-slider v-model="imageStateObj.cluster.opacity" width="200px" :min='-0.01' :max="1.01" step=0.01 @change="changeShowState('cluster')" :show-tooltip="false">
            </el-slider>
          </div>
 

        </div>
      </div>
    </div>
  </div>
  `
};
