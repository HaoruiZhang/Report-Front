
const CellCluster = {

  props: {
    msg: Array,
    data: Array,
    prefix: String,
    binSize: String,
    baseSrc: String,
    baseImageList: Array,
    cellSegSrc: Array
  },
  setup(props) {
    const { prefix, baseImageList } = props;
    const tissueSegShow = ref(true);
    const cellSegShow = ref(true);
    const legendShow = ref(true);
    const tissueSegOpacity = ref(0.8);
    const cellSegOpacity = ref(0.8);
    const legendOpacity = ref(0.8);
    const imageStateObj = ref({
      tissueSeg: { opacity: 0.8, show: true },
      cellSeg: { opacity: 0.8, show: true },
      legend: { opacity: 0.8, show: true }
    })

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

    function changeSpatialImageOpacity(prefix, opacity) {
      console.log('opacity', opacity);
      if (opacity > 1) opacity = 1;
      if (opacity < 0) opacity = 0;
      spatialOpacity.value = opacity;
      Plotly.restyle(prefix, {
        'marker.opacity': opacity * opacity,
      });
      /** 
      Plotly.relayout(prefix, {
        'images[0].opacity': 1 - opacity
      });*/
    };

    const formattedSeries = ref([]);
    function toggleDblClick(item, index) {
      console.log('_toggleDblClick', item);
      /**
       * 双击图例，如果目前是全部显示的，则只显示这个，否则，显示全部
       */

      const isShowAll = formattedSeries.value[index].every(item => item.itemStyle.visible);/**目前是否全部都显示的 */
      console.log('isShowAll', isShowAll);
      if (isShowAll) {
        formattedSeries.value[index].forEach(subItem => {
          subItem.itemStyle.visible = item.name === subItem.name ? true : false;
          subItem.itemStyle.opacity = item.name === subItem.name ? 0.8 : 0.1;
        });
      } else {
        formattedSeries.value[index].forEach(subItem => {
          subItem.itemStyle.visible = true;
          subItem.itemStyle.opacity = 0.8;
        });
      };
      updateStyle(index);
    };

    function toggleClick(item, index) {
      console.log('_toggleClick', item);
      formattedSeries.value[index].forEach(subItem => {
        if (subItem.name !== item.name) return;
        subItem.itemStyle.visible = !subItem.itemStyle.visible;
        subItem.itemStyle.opacity = subItem.itemStyle.visible ? 0.8 : 0.1;
      });
      updateStyle(index);
    };

    function updateStyle(index) {
      const visibleList = formattedSeries.value[index].map(item => item.itemStyle.visible);
      const indexList = formattedSeries.value[index].map(item => item.index);
      Plotly.restyle(index === 0 ? cellSegPrefix : '', {
        visible: visibleList,
      },
        indexList
      );
    };



    let xSize, ySize, makerSize;

    function initScale(graphDiv) {
      xSize = graphDiv.layout.xaxis.range[1] - graphDiv.layout.xaxis.range[0];
      ySize = graphDiv.layout.yaxis.range[0] - graphDiv.layout.yaxis.range[1];
      makerSize = graphDiv.data[0].marker.size;
      console.log('xSize', xSize, 'ySize', ySize, 'makerSize', makerSize)
    };

    function changeShowState(domId, val, imageType) {
      console.log('changeShowState', domId, val, imageType);
      const opacity = val ? imageStateObj.value[imageType].opacity : 0;
      if (imageType === 'tissueSeg') {
        Plotly.relayout(domId, {
          'images[0].opacity': opacity
        });
      } else if (imageType === 'cellSeg') {
        const imagesLength = props.cellSegSrc.data.cellSeg.length;
        const relayoutObj = {};
        for (let i = 1; i < imagesLength; i++) {
          relayoutObj[`images[${i}].opacity`] = opacity;
        }
        Plotly.relayout(domId, relayoutObj);
      }
    };
    function changeOpacityState(domId, val, imageType) {

    };

    onMounted(async () => {
      console.log('CellCluster Module mounted, props: ', props);
      formattedSeries.value[0] = props.data.spatial.map((item, index) => {
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
      formattedSeries.value[1] = props.data.umap.map((item, index) => {
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
      console.log('formattedSeries', formattedSeries.value);
      Plotly.newPlot(cellSegPrefix, [
        {
          "x": [6460,11500],
          "y": [6460,20000],
          "mode": "markers",
          "name": "Cluster 1",
          "type": "scattergl",
          "hovertemplate": "",
          "marker": {
            "size": 1.1155405806539271,
            "opacity": 1.0,
            "symbol": "circle",
            "color": "#292c5d"
          }
        }], { ...layout, images: [props.baseSrc, ...props.cellSegSrc.data.cellSeg] }, config);
      await nextTick();
      changeSpatialImageOpacity(cellSegPrefix, 0.8);

      const Size = props.data.spatial[0].marker.size;
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
            console.log(graphDiv.data[0].marker.size)
            Plotly.update(cellSegPrefix, update);
            xSize = eventdata['xaxis.range[1]'] - eventdata['xaxis.range[0]'];
            ySize = eventdata['yaxis.range[0]'] - eventdata['yaxis.range[1]'];
          }
        });
    });

    return {
      props,
      tissueSegShow,
      cellSegShow,
      spatialOpacity,
      prefix,
      cellSegPrefix,
      ifShowExplain,
      formattedSeries,
      imageStateObj,
      toggleDblClick,
      toggleClick,
      changeSpatialImageOpacity,
      changeShowState,
      changeOpacityState
    };
  },
  template: `
  <div class="cluster-area cellCluster-content" >
    <div class="module-content-box" style="height:600px;">

      <div class="main-area" style="position: relative;width:767px;padding:20px;display: flex;">
        <div :id="cellSegPrefix" style="width:0;flex:1;height:100%;"></div>
        <div style="width: 98px;height: 100%; overflow:auto; margin-left: 12px;;overscroll-behavior:contain">
          <div :id="cellSegPrefix + 'legend'">
            <template v-for="(item, index) in formattedSeries[0]">
              <div class="legend-item" @dblclick.stop.prevent="toggleDblClick(item,0)" @click.stop.prevent="toggleClick(item,0)"
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
          <p v-for="doc in props.cellSegSrc.msg">
              {{doc}}
            </p>
        </div>
        <div class="control-box">
          <div style="width: 100%; margin-top:8px;display:flex;align-items:center;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
              <el-switch
                v-model="imageStateObj.tissueSeg.show"
                size="small"
                @change="(val) => changeShowState(cellSegPrefix, val, 'tissueSeg')"
              ></el-switch>
              <span style="display: inline-block;min-width: 80px;margin-left:4px;">Tissue</span>
            </div>
            
            <el-slider v-model="imageStateObj.tissueSeg.opacity" width="200px" :min='-0.01' :max="1.01" step=0.01 @change="changeOpacityState(cellSegPrefix, 'tissueSeg')" :show-tooltip="false">
            </el-slider>
          </div>


          <div style="width: 100%; margin-top:8px;display:flex;align-items:center;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
              <el-switch
                v-model="imageStateObj.tissueSeg.show"
                size="small"
                @change="(val) => changeShowState(cellSegPrefix, val, 'tissueSeg')"
              ></el-switch>
              <span style="display: inline-block;min-width: 80px;margin-left:4px;">CellSeg</span>
            </div>
            
            <el-slider v-model="imageStateObj.tissueSeg.opacity" width="200px" :min='-0.01' :max="1.01" step=0.01 @change="changeOpacityState(cellSegPrefix, 'tissueSeg')" :show-tooltip="false">
            </el-slider>
          </div>


          <div style="width: 100%; margin-top:8px;display:flex;align-items:center;justify-content: space-between;">
            <div style="display: flex;align-items: center;">
              <el-switch
                v-model="imageStateObj.tissueSeg.show"
                size="small"
                @change="(val) => changeShowState(cellSegPrefix, val, 'tissueSeg')"
              ></el-switch>
              <span style="display: inline-block;min-width: 80px;margin-left:4px;">Clusters</span>
            </div>
            
            <el-slider v-model="imageStateObj.tissueSeg.opacity" width="200px" :min='-0.01' :max="1.01" step=0.01 @change="changeOpacityState(cellSegPrefix, 'tissueSeg')" :show-tooltip="false">
            </el-slider>
          </div>

          <div style="width: 100%; margin-top:8px;" v-if="false">
          <el-switch
              v-model="imageStateObj.cellSeg.show"
              size="small"
              @change="(val) => changeShowState(cellSegPrefix, val, 'cellSeg')"
            />  
          <span> CellSeg </span>
            <el-slider v-model="imageStateObj.cellSeg.opacity" width="80px" :min='-0.01' :max="1.01" step=0.01 @change="changeOpacityState(cellSegPrefix, 'cellSeg')" :show-tooltip="false">
            </el-slider>  
          </div>

          <div style="width: 100%; margin-top:8px;" v-if="false">
            <el-switch
              v-model="imageStateObj.legend.show"
              size="small"
              @change="(val) => changeShowState(cellSegPrefix, val, 'legend')"
            />
            <span> Clusters </span>
            <el-slider v-model="imageStateObj.cellSeg.opacity" width="80px" :min='-0.01' :max="1.01" step=0.01 @change="changeOpacityState(cellSegPrefix, 'legend')" :show-tooltip="false">
            </el-slider>  
          </div>

        </div>
        
      </div>

    </div>

      


  </div>
  `
};
