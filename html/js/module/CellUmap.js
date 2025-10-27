
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
    const isBlackBg = computed(() => {
      return baseImageList.some(item => {
        return ['ssdna', 'dapi'].includes(item.value.toLowerCase())
      });
    });
    const spatialOpacity = ref(0.8);
    const ifShowExplain = ref(false);
    const spatialPrefix = prefix + '-spatial-cell';
    const umapPrefix = prefix + '-umap-cell';
    const layout = {
      yaxis: { autorange: 'reversed', scaleanchor: "x", scaleratio: 1, showgrid: false, showticklabels: false, zeroline: false },
      xaxis: { showgrid: false, showticklabels: false, zeroline: false },
      margin: { 'l': 0, 't': 0, 'r': 0, 'b': 0 },
      dragmode: false,
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
      Plotly.restyle(index === 0 ? spatialPrefix : umapPrefix, {
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
      Plotly.newPlot(spatialPrefix, props.data.spatial, { ...layout, images: [props.baseSrc, ...props.cellSegSrc] }, config);
      Plotly.newPlot(umapPrefix, props.data.umap, layout, config);
      await nextTick();
      changeSpatialImageOpacity(spatialPrefix, 0.8);

      const Size = props.data.spatial[0].marker.size;
      const graphDiv = document.getElementById(spatialPrefix);
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
            Plotly.update(spatialPrefix, update);
            xSize = eventdata['xaxis.range[1]'] - eventdata['xaxis.range[0]'];
            ySize = eventdata['yaxis.range[0]'] - eventdata['yaxis.range[1]'];
          }
        });
    });

    return {
      props,
      spatialOpacity,
      prefix,
      spatialPrefix,
      umapPrefix,
      ifShowExplain,
      formattedSeries,
      toggleDblClick,
      toggleClick,
      changeSpatialImageOpacity
    };
  },
  template: `
  <div class="cluster-area">
    <div style="width: 564px;border-radius: 5px;">
      <div class="cluster-container"> 
        <div :id="spatialPrefix" style="width:458px;height:100%;"></div>

        <div style="width: 98px;height: 100%; overflow:auto; margin-left: 12px;;overscroll-behavior:contain">
          <div :id="spatialPrefix + 'legend'">
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
      <div class="title" style="display:flex;justify-content:center;align-items:center;margin-top:8px;">
        <span >
          Tissue Plot with Spots ({{props.binSize}})
        </span>
        <el-tooltip offset="8" :raw-content="true" :content="props.msg[0]" popper-class="hover-msg-box" placement="top" v-if="props.msg && props.msg.length">
          <div class="msg-icon-box  size14 marginL" >
            <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
      <div style="width: 456px; margin-top:8px;">
        <el-slider v-model="spatialOpacity" width="80px" :min='-0.01' :max="1.01" step=0.01 @change="changeSpatialImageOpacity(spatialPrefix, spatialOpacity)" :show-tooltip="false">
        </el-slider>
        <div class="buttons" style="margin-top: 4px;">
          <el-button height="36px" class="tissue-btn" @click="changeSpatialImageOpacity(spatialPrefix, 0)">Image</el-button>
          <el-button class="tissue-btn" @click="changeSpatialImageOpacity(spatialPrefix,1)">CellCluster</el-button>
        </div>
      </div>
    </div>




    <div style="width: 564px; border-radius: 5px;">
      <div class="cluster-container">
        <div :id="umapPrefix" style="width:458px;height:100%;"></div>
        <div style="width: 98px;height: 100%; overflow:auto; margin-left: 12px;;overscroll-behavior:contain">
          <div :id="prefix + '-legend'">
            <template v-for="(item, index) in formattedSeries[1]">
              <div class="legend-item" @dblclick.stop.prevent="toggleDblClick(item,1)" @click.stop.prevent="toggleClick(item,1)"
              :style="'height: 26px;display:flex;align-items:center;justify-content: flex-start;opacity:'+ item.itemStyle.opacity + ';cursor: pointer;'">
                <div :style="'width: 12px;height:12px;border-radius:50%;background-color:'+ item.itemStyle.color"></div>
                <span style="font-size: 14px;line-height:14px;margin-left:8px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;color:#45537A">{{item.name}}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="title" style="display:flex;justify-content:center;align-items:center;margin-top:8px;">
        <span>
          UMAP Projection of Spots ({{props.binSize}})
        </span>
        <el-tooltip :raw-content="true" offset="8" :content="props.msg[1]" popper-class="hover-msg-box" placement="top" v-if="props.msg && props.msg.length">
          <div class="msg-icon-box size14 marginL">
            <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
         
  `
};
