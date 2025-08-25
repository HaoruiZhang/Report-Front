const Distribution = {
  props: {
    prefix: String,
    data: Array
  },
  setup(props) {
    const { prefix } = props;
    const ifShowExplain = ref(false);
    const toolTip = document.getElementById('distribution-content');
    const computedStyle = computed(() => {
      const imgNum = props.data.length;
      switch (imgNum) {
        case 1:
          return { width: '1160px', position: 'relative',display: 'flex' };
        case 2:
          return { width: '564px', position: 'relative' ,display: 'flex' };
        case 3:
          return { width: '365.3px', position: 'relative' ,display: 'flex' };
      }
    });
    const computedPaddingLeft = computed(() => {
      const imgNum = props.data.length;
      switch (imgNum) {
        case 1:
          return '5px';
        case 2:
          return '6.5px';
        case 3:
          return '2%';
      }
    });
    onMounted(() => {
      console.log('Mount Distribution: ', props);
    });

    function downloadDistribution(index = 0) {
      const elementToDownload = document.getElementById(prefix + '-img-' + index);
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'Distribution-' + prefix + '-' + index + '.png';
        link.click();
      });
    };
    function showTip(event, info, buttonId) {
      toolTip.innerHTML = `
    <div> <span class="left_label">Max :</span> <span class="right_label">${info.max}</span></div>
    <div> <span class="left_label">Q1 :</span> <span class="right_label">${info.q1}</span></div>
    <div> <span class="left_label">Q2 :</span> <span class="right_label">${info.q2}</span></div>
    <div> <span class="left_label">Q3 :</span> <span class="right_label">${info.q3}</span></div>
    <div> <span class="left_label">Min :</span> <span class="right_label">${info.min}</span></div>
    `;
    };
    return {
      props,
      prefix,
      ifShowExplain,
      computedStyle,
      computedPaddingLeft,
      showTip,
      downloadDistribution
    };
  },
  template: `
    <div class="module-content-box" style="display: flex;justify-content: space-between;">
      <template v-for="(item, index) in props.data">
        <div :style="computedStyle" class="panzoom-box"> 
        
          <div style="height:100%;width:22px;position:relative;">
            <div style="height:22px;width:280px;transform:rotate(270deg);display:flex;justify-comtent:center;align-items:center;position:absolute;bottom:60%;left:-130px;">
              <span style="display:inline-block;margin-right:4px;fontSize:14px;fontStyle:normal;fontWeight:400;lineHeight:22px;color:#45537A;">
                {{item.yTitle || 'Count'}}
              </span>
            </div> 
          </div>
          <div style="height:22px;width:100%;position:relative;position:absolute;bottom:0px;left:0;text-align:center;margin-left:22px;">
            <span style="fontSize:14px;fontStyle:normal;fontWeight:400;lineHeight:22px;color:#45537A;">{{item.xTitle || 'X' }}</span>
          </div>
          <img :id="'distribution-'+prefix + '-img-' + index" style="width:calc(100% - 22px);height:calc(100% - 22px);" :src="item.src" @mousemove="e => showTip(e, item.info, prefix + index)"/>
        </div>
      </template>
    </div>
`,
};