
const Registration = {
  props: {
    containerId: String,
    moduleTitle: String,
    msg: String,
    data: Object,
  },
  setup(props) {
    const { containerId, moduleTitle, data } = props;
    let panzoomInstance;
    const imageIndex = ref(0);
    const currentRegisImageSrc = computed(() => {
      return data.thumbnailsArr[imageIndex.value];
    });
    const computedMaskStyle = computed(() => {
      const maskLeft = imageIndex.value * 84;
      return {
        'position': 'absolute',
        'left': maskLeft + 'px',
        'z-index': 30,
        'backdrop-filter':'blur(0.5px)',
        'border-radius': '4px'
      }
    });
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
        }
        return blob;
      });
      const results = await Promise.all(promises);
      if (results.filter(Boolean).length === 0) {
        throw new Error('没有可下载的有效图片');
      };
      return zip;
    };

    function reset() {
      panzoomInstance.reset();
    };

    async function downloadExp() {
      /*
      const elementToDownload = document.getElementById(containerId);
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = moduleTitle + '.png';
        link.click();
      });
      const images = Array.from(document.querySelector('.registration-module').querySelectorAll('img'));
      const validImages = images.filter(img => img.complete && img.naturalHeight !== 0);
      if (validImages.length !== images.length) {
        console.warn('部分图片尚未加载完成');
      };
      const imageUrls = images.map(img => img.src);
      */
      const imageUrls = [...data.thumbnailsArr, props.data.overviewArr[imageIndex.value]];
      const zip = await createZip(imageUrls);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, moduleTitle+".zip");
    };

    const changeImg = (index) => {
      console.log('changeImg', index);
      imageIndex.value = index;
    };

    const changeHeatmapLayer = () => {
      console.log('---- changeHeatmapLayer ');
    };
    function renderRegistration(eleId) {
      console.log('render Registration, id: ', eleId);
      panzoomInstance = Panzoom(document.getElementById(eleId), {
        minScale: 0.5,
        maxScale: 16,
      });
      document.getElementById(eleId).addEventListener('wheel', panzoomInstance.zoomWithWheel);
    };
    onMounted(() => {
      /*
      renderRegistration(containerId);
      */
    });

    return {
      props,
      containerId,
      computedMaskStyle,
      imageIndex,
      changeHeatmapLayer,
      reset,
      downloadExp,
      changeImg,
      currentRegisImageSrc,
    };
  },
  template: `
  <div class="module-box registration-module" style="width: 100%; ">
  
    <div class="module-title-box" >
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip :raw-content="true" offset="8" v-if="props.msg && props.msg.length && false" popper-class="hover-msg-box" :content="props.msg" placement="right">
          <div class="msg-icon-box size18">
              <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="module-content-box" >
  
      <div class="main-area">
        <div style="width: 100%; height: 100%; display: flex; justify-content:center;">
            <div class="panzoom-box" style="width: 600px; height: 100%; background-color: #000000;position: relative;border-radius: 5px;">
              
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Download plot as a png" placement="top">
                <div class="btn-box download" @click="downloadExp()" style="position: absolute; right: 16px;top:14px; ">
                  <el-icon :size="16"><zhrDownload /></el-icon>
                </div>
              </el-tooltip>
  
              <div :id="containerId" style="position: relative;width: 100%;height: 100%;border-radius:4px;">
                <img v-if="currentRegisImageSrc" :src="currentRegisImageSrc" alt="" style="border-radius:4px;width: 100%;height: 100%;position:absolute;object-fit: contain;">
              </div>
            </div>
        </div>
      </div>


      <div class="control-panel">
          <div class="msg-box">
            <p v-for="doc in props.data.docs">
              {{doc}}
            </p>
          </div>

          <div class="thumbnails-box">
            <svg :style="computedMaskStyle" xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none" >  
              <rect width="76" height="76" rx="4" fill="white" fill-opacity="0.45"/>
              <path d="M11.5434 5.77246H8.20162C6.85936 5.77246 5.77124 6.86058 5.77124 8.20284V11.5446" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
              <path d="M70.2275 11.5446L70.2275 8.20284C70.2275 6.86058 69.1394 5.77246 67.7972 5.77246L64.4554 5.77246" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
              <path d="M64.4554 70.2275L67.7972 70.2275C69.1394 70.2275 70.2275 69.1394 70.2275 67.7972L70.2275 64.4554" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
              <path d="M5.77124 64.4554L5.77124 67.7972C5.77124 69.1394 6.85936 70.2275 8.20162 70.2275L11.5434 70.2275" stroke="#5f0085" stroke-width="1.82278" stroke-linecap="round"/>
              <rect x="0.506329" y="0.506329" width="74.9873" height="74.9873" rx="4" stroke="#5F0085" stroke-width="1.01266"/>
            </svg>
            <template v-for="(imgSrc,index) in props.data.thumbnailsArr">
              <div class="imagebox" @click="changeImg(index)">
                <div class="order-box">
                  {{index+1}} 
                </div>
                <img :src="imgSrc" alt="" style="width: 100%;height:100%;object-fit: contain;border-radius: 4px;">
              </div>
            </template>
          </div>

          <div class="overview-box">
            <div class="title">
              <span class="content">
              Overview
              </span>
            </div>  

            <div style="height:180px;width:100%;background-color:#111111;">
                <img :src="props.data.overviewArr[imageIndex]" alt="" style="width: 100%;height:100%;object-fit: contain;">
            </div>
          </div>  
      </div>
    </div>
  </div>
  `
};