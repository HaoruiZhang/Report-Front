
const CellClusterByPoint = {

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
      tissueSeg: { opacity: 1, show: true, indexStart: 0, length: 1 },
      cellSeg: { opacity: 1, show: true, indexStart: 1, length: 1 },
      cluster: { opacity: 0.5, show: true, indexStart: 5, length: 1 }
    });

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
      const visibleList = formattedSeries.value.map(item => item.itemStyle.visible);
      const indexList = formattedSeries.value.map(item => item.index);
      Plotly.restyle(cellSegPrefix, {
        visible: visibleList,
      },
        indexList
      );
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
          Plotly.restyle(domId, {
            'marker.opacity': renderOpacity * renderOpacity,
          });
          break;
      }
    };
    let xSize, ySize, makerSize;
    function initScale(graphDiv) {
      xSize = graphDiv.layout.xaxis.range[1] - graphDiv.layout.xaxis.range[0];
      ySize = graphDiv.layout.yaxis.range[0] - graphDiv.layout.yaxis.range[1];
      makerSize = graphDiv.data[0].marker.size;
      console.log('xSize', xSize, 'ySize', ySize, 'makerSize', makerSize);
    };

    onMounted(async () => {
      console.log('CellClusterByPoint Module mounted, props: ', props);
      formattedSeries.value = props.data.spatial.map((item, index) => {
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

      Plotly.newPlot(cellSegPrefix, props.data.spatial,
        { ...layout, images: [props.baseSrc, ...props.data.cellseg] },
        config
      );

      await nextTick();
      changeShowState('cluster');
      const graphDiv = document.getElementById(cellSegPrefix);
      initScale(graphDiv);
      graphDiv.on('plotly_relayout',
        function (eventdata) {
          var xChange = 1;
          var yChange = 1;
          if (ySize && eventdata['yaxis.range[0]'] && eventdata['yaxis.range[1]']) {
            xSize1 = eventdata['xaxis.range[1]'] - eventdata['xaxis.range[0]'];
            ySize1 = eventdata['yaxis.range[0]'] - eventdata['yaxis.range[1]'];
            xChange = xSize / xSize1;
            yChange = ySize1 / ySize;
            makerSize = makerSize / yChange;
            var update = { 'marker.size': makerSize };
            console.log(graphDiv.data[0].marker.size);
            Plotly.update(cellSegPrefix, update);
            xSize = eventdata['xaxis.range[1]'] - eventdata['xaxis.range[0]'];
            ySize = eventdata['yaxis.range[0]'] - eventdata['yaxis.range[1]'];
          };
        });
    });

    return {
      props,
      prefix,
      cellSegPrefix,
      ifShowExplain,
      formattedSeries,
      imageStateObj,
      toggleDblClick,
      toggleClick,
      changeShowState,

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
