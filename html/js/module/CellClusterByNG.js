
const CellClusterByNG = {

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
    const ngStatus = ref('初始化中...');
    const ifShowExplain = ref(false);
    const cellSegPrefix = prefix + '-cellseg';

    /** 保存图层管理器的引用 */
    let imageLayerManager = null;
    /** cellSeg 图层管理器（专门用于轮廓） */
    let cellSegLayerManager = null;
    /** cluster 图层管理器（专门用于填充） */
    let clusterLayerManager = null;
    /**
     * function getClusterIndex(rawIndex) {
          const headIndex = rawIndex * 4 + 5;
          return [headIndex, headIndex + 1, headIndex + 2, headIndex + 3];
        };
     */


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

    /** 
     * 更新单个 cluster 的显示状态
     * 通过修改颜色来控制可见性：visible=true 时显示原色，visible=false 时设为黑色（shader会丢弃）
     */
    function updateStyle() {
      /** 更新 CellSeg 图层（轮廓）的各个 cluster 颜色 */
      if (cellSegLayerManager && cellSegLayerManager.setClusterColor) {
        formattedSeries.value.forEach((item, index) => {
          const clusterId = index + 1; /** cluster ID 从 1 开始 */
          const rgb = props.data.ngColorRgb[index];
          if (item.itemStyle.visible) {
            /* 显示：使用原始颜色*/
            cellSegLayerManager.setClusterColor(clusterId, [rgb[0], rgb[1], rgb[2]]);
          } else {
            /* 隐藏：设置为透明色（RGB=0会让shader丢弃）*/
            cellSegLayerManager.setClusterColor(clusterId, [0, 0, 0]);
          }
        });
        /* 触发重绘*/
        if (cellSegLayerManager.engineManager && cellSegLayerManager.engineManager.scheduleRedraw) {
          cellSegLayerManager.engineManager.scheduleRedraw();
        }
        console.log('✅ CellSeg 图层各 cluster 颜色已更新');
      }

      /** 更新 Cluster 图层（填充）的各个 cluster 颜色 */
      if (clusterLayerManager && clusterLayerManager.setClusterColor) {
        formattedSeries.value.forEach((item, index) => {
          const clusterId = index + 1; /* cluster ID 从 1 开始*/
          const rgb = props.data.ngColorRgb[index];
          if (item.itemStyle.visible) {
            /* 显示：使用原始颜色*/
            clusterLayerManager.setClusterColor(clusterId, [rgb[0], rgb[1], rgb[2]]);
          } else {
            /* 隐藏：设置为透明色（RGB=0会让shader丢弃）*/
            clusterLayerManager.setClusterColor(clusterId, [0, 0, 0]);
          }
        });
        /* 触发重绘*/
        if (clusterLayerManager.engineManager && clusterLayerManager.engineManager.scheduleRedraw) {
          clusterLayerManager.engineManager.scheduleRedraw();
        }
        console.log('✅ Cluster 图层各 cluster 颜色已更新');
      }
    };


    /** 
     * 更新 CellSeg（轮廓）图层的可见性
     */
    function updateCellSegLayerVisibility() {
      if (!cellSegLayerManager) {
        console.warn('⚠️ CellSeg 图层管理器未初始化');
        return;
      }

      const isVisible = imageStateObj.value.cellSeg.show;

      /**设置图层可见性 */
      if (cellSegLayerManager.setRenderLayerVisible) {
        cellSegLayerManager.setRenderLayerVisible(isVisible);
      } else if (cellSegLayerManager.managedUserLayer) {
        cellSegLayerManager.managedUserLayer.visible = isVisible;
      }

      console.log('✅ CellSeg（轮廓）图层可见性已更新:', isVisible);
    }

    /** 
     * 更新 Cluster（填充）图层的可见性
     */
    function updateClusterLayerVisibility() {
      if (!clusterLayerManager) {
        console.warn('⚠️ Cluster 图层管理器未初始化');
        return;
      }

      const isVisible = imageStateObj.value.cluster.show;

      /** 设置图层可见性 */
      if (clusterLayerManager.setRenderLayerVisible) {
        clusterLayerManager.setRenderLayerVisible(isVisible);
      } else if (clusterLayerManager.managedUserLayer) {
        clusterLayerManager.managedUserLayer.visible = isVisible;
      }

      console.log('✅ Cluster（填充）图层可见性已更新:', isVisible);
    }

    function changeShowState(imageType, domId = cellSegPrefix) {
      console.log('_changeShowState', domId, imageType, imageStateObj.value[imageType]);
      const targetImage = imageStateObj.value[imageType];
      let renderOpacity = targetImage.opacity;
      if (renderOpacity > 1) renderOpacity = 1;
      if (renderOpacity < 0) renderOpacity = 0;
      const isVisible = targetImage.show;

      switch (imageType) {
        case 'tissueSeg':
          /** 控制 Tissue 图层（图像图层/底图）- 完全独立 */
          if (imageLayerManager) {
            /** 设置可见性 */
            if (imageLayerManager.setRenderLayerVisible) {
              imageLayerManager.setRenderLayerVisible(isVisible);
            } else if (imageLayerManager.managedUserLayer) {
              imageLayerManager.managedUserLayer.visible = isVisible;
            }
            /** 设置透明度 */
            if (isVisible) {
              imageLayerManager.changeOpacity(renderOpacity);
            }
            console.log('✅ Tissue（底图）已更新 - 可见:', isVisible, '透明度:', renderOpacity);
          } else {
            console.warn('⚠️ 图像图层管理器未初始化');
          }
          break;

        case 'cellSeg':
          /** 控制 CellSeg（轮廓）图层 - 完全独立 */
          if (cellSegLayerManager) {
            /** 设置可见性 */
            updateCellSegLayerVisibility();
            /** 设置透明度 */
            if (isVisible) {
              cellSegLayerManager.changeOpacity(renderOpacity);
            }
            console.log('✅ CellSeg（轮廓）已更新 - 可见:', isVisible, '透明度:', renderOpacity);
          } else {
            console.warn('⚠️ CellSeg 图层管理器未初始化');
          }
          break;

        case 'cluster':
          /** 控制 Cluster（填充）图层 - 完全独立 */
          if (clusterLayerManager) {
            /** 设置可见性 */
            updateClusterLayerVisibility();
            /** 设置透明度 */
            if (isVisible) {
              clusterLayerManager.changeOpacity(renderOpacity);
            }
            console.log('✅ Cluster（填充）已更新 - 可见:', isVisible, '透明度:', renderOpacity);
          } else {
            console.warn('⚠️ Cluster 图层管理器未初始化');
          }
          break;
      }
    };
    let xSize, ySize, makerSize;


    async function initNGRenderer() {
      /** 导入 setMemoryData 函数*/
      let setMemoryData, getMemoryData;

      /** 等待 StereoV 加载完成后获取函数*/
      function getMemoryFunctions() {
        if (typeof StereoV !== 'undefined') {
          console.log('🔍 StereoV 可用方法:', Object.keys(StereoV));
          console.log('🔍 setMemoryData 存在:', typeof StereoV.setMemoryData);
          console.log('🔍 getMemoryData 存在:', typeof StereoV.getMemoryData);
        }

        if (typeof StereoV !== 'undefined' && StereoV.setMemoryData) {
          setMemoryData = StereoV.setMemoryData;
          getMemoryData = StereoV.getMemoryData;
          console.log('✅ 成功获取内存数据函数');
          return true;
        }
        console.log('❌ 无法获取内存数据函数');
        return false;
      }

      async function load135ImageData() {
        if (!getMemoryFunctions()) {
          console.warn('⚠️  setMemoryData 函数不可用');
          return;
        }
        try {
          /** 检查内联数据是否存在 */
          if (!props.data.ngImageData) {
            console.error('❌ ngImageData 内联数据未找到！');
            return;
          }

          const inlineData = JSON.parse(JSON.stringify(props.data.ngImageData));

          /** 1. 使用内联的 info 数据 */
          console.log('  📄 使用内联的 info 数据');
          const infoData = inlineData.info;
          if (setMemoryData) {
            setMemoryData('ssDNA/info', infoData);
            console.log('✅ info 数据已设置到内存');
          }
          console.log('  📄 info 文件信息:');
          console.log(`    - 类型: ${infoData['@type']}`);
          console.log(`    - 注释类型: ${infoData.annotation_type}`);

          let totalSize = 0;
          let loadedCount = 0;
          let imageIndex = [];

          for (const [scaleKey, chunks] of Object.entries(inlineData.ssDNA)) {
            for (const [chunkKey, base64Data] of Object.entries(chunks)) {
              console.log(`  Chunk: ${chunkKey}`);
              console.log(`    Base64长度: ${base64Data.length}`);

              if (base64Data) {
                /**  解码 base64 数据为 Uint8Array  */
                const binaryString = atob(base64Data);
                const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));

                const key = `ssDNA/${scaleKey}/${chunkKey}`;
                if (setMemoryData) {
                  setMemoryData(key, bytes);
                  imageIndex.push(`${scaleKey}/${chunkKey}`)
                }
                totalSize += bytes.byteLength;
                loadedCount++;
                console.log(`    ✅ ${scaleKey}/${chunkKey}: ${bytes.byteLength} 字节`);
              } else {
                console.log(`    - ${scaleKey}/${chunkKey}: 内联数据中未找到`);
              }
            }
          }
          console.log(`  ✅ Image 数据加载完成，总大小: ${totalSize} 字节`);
          return imageIndex
        } catch (error) {
          console.error('  ❌ 加载Image数据失败:', error);
        }
      }

      async function load135CellClusterData() {
        console.log('📁 开始加载 135_cellCluster 数据（内联模式）...');

        /** 检查是否有 setMemoryData 函数*/
        if (!getMemoryFunctions()) {
          console.warn('⚠️  setMemoryData 函数不可用，将使用模拟数据');
          return;
        };

        try {
          /** 检查内联数据是否存在*/
          if (!props.data.ngRenderData) {
            console.error('❌ props.data.ngRenderData 内联数据未找到！');
            return;
          };

          const inlineData = JSON.parse(JSON.stringify(props.data.ngRenderData));

          /** 1. 使用内联的 info 数据*/
          console.log('  📄 使用内联的 info 数据', inlineData.info);
          const infoData = inlineData.info;
          if (setMemoryData) {
            setMemoryData('135_cellCluster/info', infoData);
            console.log('✅ info 数据已设置到内存');
          };
          console.log('  📄 info 文件信息:');
          console.log(`    - 类型: ${infoData['@type']}`);
          console.log(`    - 注释类型: ${infoData.annotation_type}`);
          console.log(`    - 边界: [${infoData.lower_bound.join(', ')}] -> [${infoData.upper_bound.join(', ')}]`);
          console.log(`    - 属性数量: ${infoData.properties?.length || 0}`);
          console.log(`    - 空间层级: ${infoData.spatial?.length || 0}`);

          /** 2. 从内联数据中加载 L0 文件 */
          if (!inlineData.L0) {
            console.error('❌ L0 数据未找到！');
            return;
          };
          let totalSize = 0;
          let loadedCount = 0;

          console.log('  📦 从内联数据加载 L0 文件...');
          for (const file of props.data.ngL0Files) {
            try {
              /** 从内联数据中获取 base64 编码的数据 */
              const base64Data = inlineData.L0[file];
              if (base64Data) {
                /** 解码 base64 数据为 Uint8Array */
                const binaryString = atob(base64Data);
                const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));

                const key = `135_cellCluster/L0/${file}`;
                if (setMemoryData) {
                  setMemoryData(key, bytes);
                }
                totalSize += bytes.byteLength;
                loadedCount++;
                console.log(`    ✅ ${file}: ${bytes.byteLength} 字节`);
              } else {
                console.log(`    - ${file}: 内联数据中未找到`);
              }
            } catch (error) {
              console.error(`    ❌ ${file}: 加载失败 -`, error);
            }
          }

          console.log(`  ✅ L0 数据加载完成，共加载 ${loadedCount}/${props.data.ngL0Files.length} 个文件，总大小: ${totalSize} 字节`);

        } catch (error) {
          console.error('  ❌ 加载数据失败:', error);

          /** 创建模拟数据 
          const mockInfo = {
            '@type': 'neuroglancer/annotations',
            annotation_type: 'point',
            lower_bound: [0, 0, 0],
            upper_bound: [100, 100, 100],
            properties: [
              { id: 'id', type: 'uint32' },
              { id: 'geneCount', type: 'uint32' },
              { id: 'expCount', type: 'uint32' }
            ],
            spatial: [
              {
                key: 'L0',
                limit: 10000,
                chunk_size: [1000, 1000],
                grid_shape: [4, 4]
              }
            ]
          };
          if (setMemoryData) {
            setMemoryData('135_cellCluster/info', mockInfo);
          };*/
        };
      };

      const chunkWorkerContent = window.StereoVWorkerSources.chunkWorker;
      const asyncComputationWorkerContent = window.StereoVWorkerSources.asyncComputation;
      const filterWorkerContent = window.StereoVWorkerSources.filterWorker;

      function updateStatus(message) {
        ngStatus.value = '状态: ' + message;
        console.log('🛈 ' + ngStatus.value);
      };

      async function runAfterDOMloaded() {
        try {
          updateStatus('检查StereoV...');

          /** 等待一小段时间确保 StereoV 完全加载 */
          await new Promise(resolve => setTimeout(resolve, 100));

          /** 检查StereoV是否已加载 */
          if (typeof StereoV === 'undefined') {
            throw new Error('StereoV未正确加载');
          };

          updateStatus('StereoV已加载，检查方法...');

          /** 检查createEngineManager是否存在 */
          if (typeof StereoV.createEngineManager === 'undefined') {
            throw new Error('createEngineManager方法不存在');
          };

          updateStatus('方法检查通过，正在初始化...');

          /** 获取容器元素*/
          const container = document.getElementById(cellSegPrefix);
          if (!container) {
            throw new Error('找不到容器元素 #neuroglancer-container');
          };

          /** 加载数据到内存*/
          updateStatus('正在加载数据...');
          await load135CellClusterData();

          const imageIndex = await load135ImageData();
          /** 在创建引擎之前，将数据传递到 Worker 中*/
          updateStatus('正在准备 Worker 数据...');

          /** 收集所有内存数据 */
          const allMemoryData = new Map();

          /** 获取 info 数据*/
          const infoData = getMemoryData('135_cellCluster/info');
          if (infoData) {
            allMemoryData.set('135_cellCluster/info', infoData);
          };

          for (const file of props.data.ngL0Files) {
            const key = `135_cellCluster/L0/${file}`;
            const data = getMemoryData(key);
            if (data) {
              allMemoryData.set(key, data);
            }
          };

          /** 获取所有Image数据  */
          for (const imagekey of imageIndex) {
            const key = `ssDNA/${imagekey}`;
            const data = getMemoryData(key);
            if (data) {
              allMemoryData.set(key, data);
            }
          }

          console.log('📦 准备传递给 Worker 的数据数量:', allMemoryData.size);
          console.log('📦 数据键列表:', [...allMemoryData.keys()]);

          /** 检查每个数据项 */
          for (const [key, data] of allMemoryData) {
            console.log(`📦 数据项 ${key}:`, typeof data, data instanceof ArrayBuffer ? data.byteLength :
              data instanceof Uint8Array ? data.length :
                typeof data === 'object' ? JSON.stringify(data).length : 'unknown');
          };

          /** 创建引擎管理器*/
          updateStatus('正在创建引擎...');
          const engine = await StereoV.createEngineManager({
            bundleRoot: {
              chunkWorkerContent,
              asyncComputationWorkerContent,
              filterWorkerContent
            },
            /** bundleRoot: './dist/',
            /** 将数据传递给 Worker*/
            memoryData: allMemoryData
          }, container);

          if (!engine) {
            throw new Error('引擎创建失败，返回值为空');
          };


          /* 添加图像图层 */
          updateStatus('正在添加图像图层...');
          if (props.data.ngImageOptions) {
            const imgLayerPromise = engine.addImageLayer(props.data.ngImageOptions);
            if (imgLayerPromise && imgLayerPromise.then) {
              imgLayerPromise.then((manager) => {
                imageLayerManager = manager;
                console.log('✅ 图像图层管理器已保存');
                /** 应用初始透明度 */
                if (imageLayerManager && imageStateObj.value.tissueSeg) {
                  const initialOpacity = imageStateObj.value.tissueSeg.show ? imageStateObj.value.tissueSeg.opacity : 0;
                  imageLayerManager.changeOpacity(initialOpacity);
                }
              });
            } else {
              /** 同步返回的情况 */
              imageLayerManager = imgLayerPromise;
              console.log('✅ 图像图层管理器已保存（同步）');
            }
          }

          /** 添加 CellSeg 图层（仅轮廓 outline） */
          let cellSegLayerOptions = {
            name: 'CellSegLayer',
            url: 'precomputed://memory://135_cellCluster/',
            visible: imageStateObj.value.cellSeg.show,
            opacity: imageStateObj.value.cellSeg.opacity
          };
          engine.addCellBinClusterSpatialLayer(cellSegLayerOptions).then((layerManager) => {
            cellSegLayerManager = layerManager;
            console.log('✅ CellSeg（轮廓）图层管理器已保存');
            console.log('📋 CellSeg 图层管理器可用方法:', Object.keys(layerManager));

            /** 设置为仅轮廓模式 */
            if (layerManager.changeFillStrokeMode) {
              layerManager.changeFillStrokeMode('outline');
              console.log('✅ CellSeg 图层设置为 outline 模式');
            }

            /** 设置轮廓颜色（可以使用统一的颜色或聚类颜色） */
            for (let i = 0; i < props.data.ngColorRgb.length; i++) {
              layerManager.setClusterColor(
                i + 1,
                [props.data.ngColorRgb[i][0], props.data.ngColorRgb[i][1], props.data.ngColorRgb[i][2]]
              );
            }

            /** 应用初始透明度 */
            const initialCellSegOpacity = imageStateObj.value.cellSeg.opacity;
            layerManager.changeOpacity(initialCellSegOpacity);
            console.log('✅ CellSeg 图层初始化完成 - 透明度:', initialCellSegOpacity);
          });

          /** 添加 Cluster 图层（仅填充 fill） */
          let clusterLayerOptions = {
            name: 'ClusterLayer',
            url: 'precomputed://memory://135_cellCluster/',
            visible: imageStateObj.value.cluster.show,
            opacity: imageStateObj.value.cluster.opacity
          };
          engine.addCellBinClusterSpatialLayer(clusterLayerOptions).then((layerManager) => {
            clusterLayerManager = layerManager;
            console.log('✅ Cluster（填充）图层管理器已保存');
            console.log('📋 Cluster 图层管理器可用方法:', Object.keys(layerManager));

            /** 设置为仅填充模式 */
            if (layerManager.changeFillStrokeMode) {
              layerManager.changeFillStrokeMode('fill');
              console.log('✅ Cluster 图层设置为 fill 模式');
            }

            /** 设置聚类颜色 */
            for (let i = 0; i < props.data.ngColorRgb.length; i++) {
              layerManager.setClusterColor(
                i + 1,
                [props.data.ngColorRgb[i][0], props.data.ngColorRgb[i][1], props.data.ngColorRgb[i][2]]
              );
            }

            /** 应用初始透明度 */
            const initialClusterOpacity = imageStateObj.value.cluster.opacity;
            layerManager.changeOpacity(initialClusterOpacity);
            console.log('✅ Cluster 图层初始化完成 - 透明度:', initialClusterOpacity);
          })

        } catch (error) {
          updateStatus('错误: ' + error.message);
          console.error('错误详情:', error);
          console.error('错误堆栈:', error.stack);
        }
      }
      runAfterDOMloaded();
    };
    onMounted(async () => {
      console.log('CellClusterByNG Module mounted, props: ', props);
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
      await nextTick();
      initNGRenderer();



      /**
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
        }
      );
       */
    }
    );

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
