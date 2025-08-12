
const Expression = {
  props: {
    containerId: String,
    moduleTitle: String,
    msg: String,
    heatmapImageObj: Object,
    imageOffsetObj: Object,
    baseImageList: Array
  },
  setup(props) {
    const { heatmapImageObj, baseImageList, containerId, moduleTitle, imageOffsetObj } = props;
    const ifShowTissueBinsLayer = ref(true);
    const heatmapImageRef = ref();
    const imageRef = ref();
    const ifShowExplain = ref(false);
    const heatmapOpacity = ref(80);
    const ifEnhanceImage = ref(false);
    const heatmapLayer = ref('tissuebins');
    const isBlackBg = ref(false);
    let panzoomInstance;
    let imageOpacity = 0.2;
    const selectedImage = ref(baseImageList[0].value);
    const currentColorBar = ref(heatmapImageObj.tissueBinsColorBar);
    const currentHeatmapImageSrc = ref(heatmapImageObj.tissueBins);
    const currentBaseImageSrc = ref(baseImageList[0]?.src?.source || '');


    function renderSummaryProteinExpression(eleId = 'summary-gene-expression-imagebox') {
      console.log('render expression, id: ', eleId);
      panzoomInstance = Panzoom(document.getElementById(eleId), {
        minScale: 0.5,
        maxScale: 16,
        startX: imageOffsetObj.startX,
        startY: imageOffsetObj.startY,
        startScale: imageOffsetObj.startScale * 0.95,
      });
      document.getElementById(eleId).addEventListener('wheel', panzoomInstance.zoomWithWheel);
    };

    function reset() {
      panzoomInstance.reset();
    };

    function downloadExp() {
      const elementToDownload = document.getElementById("expression-download-dom");
      html2canvas(elementToDownload, {
        scale: 2,
        width: 808
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = moduleTitle + '.png';
        link.click();
      });
    };


    watch(() => ifShowTissueBinsLayer.value, (nv, ov) => {
      if (nv) {
        currentHeatmapImageSrc.value = heatmapImageObj.tissueBins;
        currentColorBar.value = heatmapImageObj.tissueBinsColorBar;
      } else {
        currentHeatmapImageSrc.value = heatmapImageObj.allBins;
        currentColorBar.value = heatmapImageObj.allBinsColorBar;
      };
    });

    const changeHeatmapOpacity = (val) => {
      console.log(val);
      if (val < 0) {
        val = 0;
        heatmapOpacity.value = 0;
      };
      if (val > 100) {
        val = 100;
        heatmapOpacity.value = 100;
      };
      if (val == 0 || val == 100) {
        heatmapOpacity.value = val;
      };
      heatmapImageRef.value.style.opacity = heatmapOpacity.value / 100;
      imageOpacity = 1 - heatmapOpacity.value / 100;
      if (imageRef.value?.style?.opacity) imageRef.value.style.opacity = imageOpacity;
    };

    const changeHeatmapLayer = () => {
      console.log('---- heatmapLayer', heatmapLayer.value);
      if (heatmapLayer.value === 'allbins') {
        currentHeatmapImageSrc.value = heatmapImageObj.allBins;
        currentColorBar.value = heatmapImageObj.allBinsColorBar;
      } else {
        currentHeatmapImageSrc.value = heatmapImageObj.tissueBins;
        currentColorBar.value = heatmapImageObj.tissueBinsColorBar;
      }
    };
    const changeBaseImageSrc = async (newValue) => {
      console.log('changeBaseImageSrc: ', newValue);
      baseImageList.forEach(item => {
        if (item.value === newValue) {
          currentBaseImageSrc.value = item.src.source;
        };
      });
      await nextTick();
      if (imageRef.value?.style?.opacity) imageRef.value.style.opacity = imageOpacity;
    };
    onMounted(() => {
      console.log(123, props);
      renderSummaryProteinExpression(containerId);
      isBlackBg.value = baseImageList.some(item => {
        return ['ssdna', 'dapi'].includes(item.value.toLowerCase())
      })
    });

    return {
      props,
      containerId,
      isBlackBg,
      ifShowTissueBinsLayer,
      changeHeatmapLayer,
      heatmapLayer,
      selectedImage,
      heatmapImageRef,
      imageRef,
      changeHeatmapOpacity,
      reset,
      ifEnhanceImage,
      downloadExp,
      changeBaseImageSrc,
      heatmapOpacity,
      ifShowExplain,
      baseImageList,
      currentHeatmapImageSrc,
      currentBaseImageSrc,
      currentColorBar
    };
  },
  template: `
  <div id="expression-download-dom" class="module-box expression-module" style="width: 100%; ">
  
    <div class="module-title-box" >
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" v-if="props.msg && props.msg.length" :content="props.msg"  placement="right">
          <div class="msg-icon-box">
            <zhrWholeAsk />
          </div>
        </el-tooltip>
        
        
        
      </div>
      
    </div>

    <div class="module-content-box" style="width: 100%;height: 634px;display: flex;justify-content: space-between;margin-bottom: 20px;">
  
      <div id="expression-download-dom" style="width: 767px;height: 100%;border-radius:4px;background: var(--Light-B8-, #F4F5F6);padding: 20px 0;box-sizing: border-box;">
        <div style="width: 100%; height: 560px; display: flex; justify-content:center;margin-bottom: 12px;align-items:flex-end;">
            <div :class="{'panzoom-box':true, 'blackBackground': isBlackBg}" style="width: 560px; height: 100%; position: relative;border-radius: 4px;margin-right: 0;">

              
              <el-tooltip offset="8" popper-class="hover-msg-box" content="Autoscale" placement="top" :raw-content="true">
                <div class="btn-box reset" @click="reset()" style="position: absolute; right: 56px;top:10px; ">
                  <el-icon :size="24"><zhrPos /></el-icon>
                </div>
              </el-tooltip> 

              <el-tooltip offset="8" popper-class="hover-msg-box" content="Download plot as a png" placement="top" :raw-content="true">
                <div class="btn-box download" @click="downloadExp()" style="position: absolute; right: 16px;top:10px; ">
                  <el-icon :size="16"><zhrDownload /></el-icon>
                </div>
              </el-tooltip>

              <div :id="containerId" style="position: relative;width: 100%;height: 100%; " :class="{'blackBackground': isBlackBg}" ref="summary-gene-expression-imagebox">
                <img v-if="currentBaseImageSrc" ref="imageRef" :src="currentBaseImageSrc" style="width: auto;height: 100%;position:absolute;opacity: 0.2;object-fit: contain;top:50%;left:50%;transform:translate(-50%, -50%);">
                <img v-if="currentHeatmapImageSrc" ref="heatmapImageRef" :src="currentHeatmapImageSrc" style="object-fit: contain;width: auto;height: 100%;position:absolute;opacity: 0.8;top:50%;left:50%;transform:translate(-50%, -50%);">
              </div>
            </div>
          
            <div style="position: relative;display: flex;flex-direction: column;justify-content: flex-end;bottom: -35px;transform:scale(0.75)">
              <img id="summary-rna-colorbar" style="width: 100%; object-fit: contain;" :src="currentColorBar" alt="">
            </div>
        </div>
        <div style="width:100%;height: 22px;text-align: center;color: var(--Light-B2-, #45537A);
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 22px; " >
          <span>
            Plot with Spot Colored by MID Count
          </span>
        </div>
      </div>


      <div style="width: 368px;height: 100%;background: var(--Light-B8-, #F4F5F6);padding: 20px;box-sizing: border-box; border-radius: 4px; color: rgba(69, 83, 122, 1);">
         
          <el-radio-group v-model="heatmapLayer" class="heatmap-btns-group" size="small" @change="changeHeatmapLayer">
            <el-radio-button label="All Bins" value="allbins" />
            <el-radio-button label="Bins Under Tissue" value="tissuebins" />
          </el-radio-group>
         

         
          <el-select v-model="selectedImage" offset="4" popper-class="expression-select-option" :show-arrow="false" placeholder="Select" style="height: 36px;width: 100%;margin-bottom: 16px;" @change="changeBaseImageSrc">

            <el-option v-for="item in baseImageList" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span v-if="selectedImage==item.value" style="float: right; color: var(--el-text-color-secondary); font-size: 13px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12" fill="none"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1297 1.95285L5.69385 11.1233L0.871094 5.51935L2.08383 4.47567L5.73366 8.71672L12.9521 0.869629L14.1297 1.95285Z" fill="#5F0085"/></svg>
              </span>
            </el-option>
          </el-select>

         <el-slider v-model="heatmapOpacity" :show-tooltip="false" :min='-2' :max=102 @input="value=>changeHeatmapOpacity(value)">
         </el-slider>

          <div style="display: flex;width: 100%; justify-content: space-between;">
            <el-button class="tissue-btn" @click="changeHeatmapOpacity(0)"  >Image</el-button>
            
            <el-button class="tissue-btn" @click="changeHeatmapOpacity(100)"  >Expression</el-button>
          </div>
        
        
      </div>



    </div>

    

  </div>
  `
};