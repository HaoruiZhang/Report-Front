
const SpatialClustering = {
  props: {
    moduleTitle: String,
    desc: String,
    data: Array,
  },
  setup(props) {
    const { moduleTitle, data } = props;
    const formattedSeries = ref([]);
    const layout = {
      yaxis: { autorange: 'reversed', scaleanchor: "x", scaleratio: 1, showgrid: false, showticklabels: false, zeroline: false },
      xaxis: { showgrid: false, showticklabels: false, zeroline: false },
      margin: { 'l': 0, 't': 0, 'r': 0, 'b': 0 },
      dragmode: false,
      showlegend: false,
      transitions: []
    };

    const config = {
      scrollZoom: false,
      displaylogo: false,
      displayModeBar: false,
    };
    /** 左侧控制面板参数 */
    const plotSet = ref(data.length === 2 ? [
      {
        visible: true,
        renderSn: data[0].sn,
        renderDataIndex: 0
      },
      {
        visible: true,
        renderSn: data[1].sn,
        renderDataIndex: 1
      }
    ] : [
      {
        visible: true,
        renderSn: data[0].sn,
        renderDataIndex: 0
      },
      {
        visible: true,
        renderSn: data[1].sn,
        renderDataIndex: 1
      },
      {
        visible: true,
        renderSn: data[2].sn,
        renderDataIndex: 2
      },
      {
        visible: data[3] ? true : false,
        renderSn: data[3] ? data[3].sn : '',
        renderDataIndex: 3
      }
    ]);
    /** 右侧控制面板参数 */
    const controlPanelList = ref(data.map((item, index) => ({
      sn: item.sn,
      rendered: index <= 3
    })));

    function getDisabled(dataIndex) {
      let isAllVisible = plotSet.value.every((item) => {
        return item.visible;
      });
      return !controlPanelList.value[dataIndex].rendered && isAllVisible;
    };

    const changeImg = (index) => {
      /**
       * 切换缩略图，切换主区域的图表
       */
      controlPanelList.value[index].rendered = !controlPanelList.value[index].rendered;
      if (controlPanelList.value[index].rendered) {
        for (let itemIndex = 0; itemIndex < plotSet.value.length; itemIndex++) {
          const item = plotSet.value[itemIndex];
          if (!item.visible) {
            item.visible = true;
            item.renderSn = data[index].sn;
            item.renderDataIndex = index;
            const plotData = props.data[item.renderDataIndex].data;
            Plotly.react('plotSpatialCluster_' + itemIndex, plotData, { ...layout }, config);
            updateStyle();
            break;
          }
        }
      } else {
        plotSet.value.forEach((item, itemIndex) => {
          if (item.renderDataIndex === index) {
            item.visible = false;
            item.renderDataIndex = -1;
            Plotly.purge('plotSpatialCluster_' + itemIndex);
          };
          return;
        });
      }
      console.log('plotSet.value', plotSet.value);
    };

    function plotMainArea() {
      console.log('_plotMainArea');
      /**
       * 绘制主区域的图表
       */
      plotSet.value.forEach((item, index) => {
        if (!item.visible) return;
        const plotId = 'plotSpatialCluster_' + index;

        const plotData = props.data[item.renderDataIndex].data.map((dataItem) => {
          return {
            ...dataItem,
            type: "scattergl",
          }
        });
        Plotly.newPlot(plotId, plotData, { ...layout }, config);
      });
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
      };
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
      const visibleList = formattedSeries.value.map(item => item.itemStyle.visible);
      const indexList = formattedSeries.value.map(item => item.index);
      const plotDom = document.querySelectorAll('.plotDom');
      console.log('plotDom', plotDom, plotDom.length);
      for (let i = 0; i < plotDom.length; i++) {
        if (!plotSet.value[i].visible) continue;
        console.log('plotDom', i, plotDom[i]);
        Plotly.restyle(plotDom[i], {
          visible: visibleList,
        },
          indexList
        );
      };
    };


    const fetchImage = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('网络响应异常');
        return await response.blob();
      } catch (error) {
        console.error('图片加载失败:', error);
        return null;
      }
    };

    const createZip = async (imageUrls) => {
      const zip = new JSZip();
      const imgFolder = zip.folder(moduleTitle);
      let loadedCount = 0;
      const updateProgress = () => {
        const percent = Math.round((loadedCount / imageUrls.length) * 100);
        console.log(`打包进度: ${percent}%`);
      };

      const promises = imageUrls.map(async (url, index) => {
        const blob = await fetchImage(url);
        if (blob) {
          imgFolder.file(`image_${index + 1}.jpg`, blob);
          loadedCount++;
          updateProgress();
        };
        return blob;
      });
      const results = await Promise.all(promises);
      if (results.filter(Boolean).length === 0) {
        throw new Error('没有可下载的有效图片');
      };
      return zip;
    };

    async function downloadExp() {
      const images = Array.from(document.querySelector('.spatialClustering-module').querySelectorAll('img'));
      const validImages = images.filter(img => img.complete && img.naturalHeight !== 0);
      if (validImages.length !== images.length) {
        console.warn('部分图片尚未加载完成');
      };
      const imageUrls = images.map(img => img.src);
      const zip = await createZip(imageUrls);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, moduleTitle + ".zip");
    };

    async function downloadEPlot() {
      const zip = new JSZip();
      const promises = plotSet.value.map((item, index) => {
        if (!item.visible) return Promise.resolve();
        const plotId = 'plotSpatialCluster_' + index;
        return new Promise((resolve) => {
          /**
          Plotly.toImage(plotId, { format: 'png', width: 600, height: 600 }).then((dataUrl) => {
            fetch(dataUrl)
              .then(response => response.blob())
              .then(blob => {
                zip.file(`${item.renderSn}.png`, blob);
                resolve();
              });
          });
           */
          html2canvas(document.getElementById(plotId), {
            allowTaint: true,
            useCORS: true
          }).then((canvas) => {
            canvas.toBlob((blob) => {
              zip.file(`${item.renderSn}.png`, blob);
              resolve();
            }, 'image/png', 1);
          });
        });
      });
      await Promise.all(promises);

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
      saveAs(content, moduleTitle + ".zip");
    };

    function adjustContainer(itemsNum) {
      const container = document.querySelector('#scThumbnailsBox');
      const gap = 6;
      const maxRows = 3;
      const rowCount = Math.ceil(itemsNum / 3);
      const totalHeight = Math.min(rowCount, maxRows) * (102 + gap) + (rowCount - 1) * gap;
      container.style.height = `${totalHeight}px`;
    };
    onMounted(async () => {
      /**
       * 绘制所有缩略图
        
      // props.data.forEach((item, index) => {
      //   const plotId = 'thumbnails_' + index;
      //   Plotly.newPlot(plotId, item.data, { ...layout }, {...config, staticPlot: true});
      // });
        */
      /**
       * 获得控制面板数据列表
       */


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

      /**
      const workerCode = `
        self.onmessage = function(e) {
          const data = JSON.parse(e.data);
          console.log('【【【Worker received data】】】:', data);
          self.postMessage('result from worker');
        };
      `;

      // 将代码字符串转为 Blob
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      // 生成 URL
      const workerUrl = URL.createObjectURL(blob);
      // 创建 Worker
      const worker = new Worker(workerUrl);
      // 发送数据到 Worker
      worker.postMessage(JSON.stringify(props.data));
      // 接收结果
      worker.onmessage = function (e) {
        console.log('【【Main received data】】', e.data);
      }; 
      */

      plotMainArea();
      await nextTick();
      adjustContainer(props.data.length);

    });

    return {
      props,
      formattedSeries,
      controlPanelList,
      downloadExp,
      changeImg,
      toggleDblClick,
      toggleClick,
      plotSet,
      getDisabled,
      downloadEPlot
    };
  },
  template: `
  <div class="module-box spatialClustering-module" style="width: 100%;">
  
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
        <div style="width: 0;flex:1; height: 560px; display: flex;flex-wrap: wrap;position: relative;justify-content: space-between;overflow: hidden;overflow-y: auto;gap:1px;">
          <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Download plot as a png" placement="top">
            <div class="btn-box download" @click="downloadEPlot()" style="position: absolute; right: 16px;top:14px; ">
              <el-icon :size="16"><zhrDownload /></el-icon>
            </div>
          </el-tooltip>
          
          <template v-for="(item, index) in plotSet" >
            <div :style="{width: 'calc(50% - 0.5px)', height:plotSet.length===2?'100%':'279.5px', position: 'relative','background-color': '#fff',display:'flex',justifyContent: 'center', alignItems: 'center'}">
              <div v-if="item.visible" class="order-box" style="display: flex;position: absolute;top: 8px;left: 8px;
                width:unset; height: 16px;padding: 0 4px;justify-content: center;align-items: flex-start;border-radius: 4px;border-radius: 4px;background: rgba(0, 0, 0, 0.36); z-index: 10;">
                  <span style="font-size: 10px;line-height: 16px;color: #FFF;font-family: BGI;font-size: 10px;font-style: normal;font-weight: 700;">{{item.renderSn}}</span>
              </div>
              <div :id="'plotSpatialCluster_' + index" class="plotDom" style="width: 100%;max-width:306px; height: 279.5px;">
              </div>
            </div>
          </template>
        </div>
        <div style="height: 100%; overflow:auto;overscroll-behavior:contain">
          <div id="spatialCluster_legend" style="padding-left: 12px;">
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
            <p v-for="doc in props.desc">
              {{doc}}
            </p>
          </div>

          <div id="scThumbnailsBox" class="thumbnails-box" style="overflow-y: auto; display: grid;
  grid-template-columns: repeat(3, 1fr); /* 每行3列 */
  gap: 6px;   overflow-y: auto; height: unset;">
         

              <template v-for="(item,index) in props.data">
                <div :class="{'imagebox':true, 'disabled': getDisabled(index)}" @click="!getDisabled(index)&&changeImg(index)" style="background-color: #fff;width: 102px;height: 102px;position: relative;box-sizing: border-box;">
                  
                  <img :src="'data:image/png;base64,' + item.thumbnail" alt="" style="width: 100%;height:100%;position: relative;object-fit: contain;border-radius: 4px; ">
                  
                  <svg v-if="controlPanelList[index].rendered" style="position:absolute;left:0;top:0;z-index:30;backdrop-filter: blur(0.5px);border-radius: 4px;" xmlns="http://www.w3.org/2000/svg" width="102" height="102" viewBox="0 0 76 76" fill="none" >  
                    <rect width="76" height="76" rx="4" fill="white" fill-opacity="0.45"/>
                    <path d="M11.5434 5.77246H8.20162C6.85936 5.77246 5.77124 6.86058 5.77124 8.20284V11.5446" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
                    <path d="M70.2275 11.5446L70.2275 8.20284C70.2275 6.86058 69.1394 5.77246 67.7972 5.77246L64.4554 5.77246" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
                    <path d="M64.4554 70.2275L67.7972 70.2275C69.1394 70.2275 70.2275 69.1394 70.2275 67.7972L70.2275 64.4554" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
                    <path d="M5.77124 64.4554L5.77124 67.7972C5.77124 69.1394 6.85936 70.2275 8.20162 70.2275L11.5434 70.2275" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
                    <rect x="0.506329" y="0.506329" width="74.9873" height="74.9873" rx="4" stroke="#5F0085" stroke-width="1.01266"/>
                  </svg>
                  <svg v-if="controlPanelList[index].rendered" style="position:absolute;top:calc(50% - 7px);left:calc(50% - 7px);z-index:40;" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM10.1879 4.82578L11.0364 5.6743L6.79375 9.91694L6.79187 9.91506L6.78998 9.91696L3.96155 7.08853L4.81008 6.24L6.79186 8.22178L10.1879 4.82578Z" fill="white"/>
                  </svg>
                  <div class="order-box" style="display: flex;
                  width:unset; height: 16px;padding: 0 4px;flex-direction: column;justify-content: center;align-items: flex-start;border-radius: 4px; z-index:40">
                    <span style="font-size: 10px;line-height: 16px;color: #FFF;font-family: BGI;font-size: 10px;font-style: normal;font-weight: 700;">{{item.sn}}</span>
                  </div>
                </div>
                
              </template>
             
          </div>

          
      </div>
    </div>
  </div>
  `
};