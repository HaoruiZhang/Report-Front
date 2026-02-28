
const DepthNormalization = {
  props: {
    moduleTitle: String,
    msg: Object,
    data: Array,
  },
  setup(props) {
    const { msg } = props;
    const ifShowExplain = ref(false);
    const colNum = Object.keys(props.data[0]).length - 1;
    const colWidth = ref(`${1046 / colNum}px`);
    const isCellbin = computed(() => {
      return props.data[0].meanCellArea > 0;
    });

    const getWidth = (key) => {
      const sliceList = props.data.map(item => String(item[key] || ''));
      const maxLength = Math.max(...sliceList.map(item => item.length), key.length);
      return maxLength * 10 + 40;
    };
    const sliceWidth = ref(getWidth('Slice'));
    const snWidth = ref(getWidth('SN'));
    onMounted(() => {
      console.log('Mount DepthNormalization: ', props, isCellbin.value);
    });

    return {
      props,
      isCellbin,
      sliceWidth,
      snWidth,
      ifShowExplain,
      colWidth,
      msg
    };
  },
  template: `
  <div class="module-box input-table" style="width: 1200px; ">
    <div class="module-title-box">
      <div class="title-box-left">
        <span class="title-label">{{props.moduleTitle}}</span>
      </div>
    </div>

  
    <div class="module-content-box" style="display: flex;justify-content: space-evenly;padding-bottom:20px;overflow-x:auto;">
      <el-table
        :table-layout="auto"
        :fit="false"
        :data="props.data"
        stripe
        style="min-width: 100%;"
        :header-cell-style="{'background-color': '#efefef', 'white-space': 'nowrap', 'word-break': 'normal'}"
        :cell-style="{'white-space': 'nowrap', 'word-break': 'normal'}"
      >
        <el-table-column prop="Slice" v-if="props.data[0].Slice" align="left" :width="sliceWidth" >
          <template #header>
            <div class="header">
              <span class="label">
                Slice
              </span>
              <!-- 
              <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.Slice" placement="right" :raw-content="true">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
              -->
            </div>
          </template>
          <template #default="scope">
            <div style="white-space: nowrap; word-break: keep-all;">{{ scope.row.Slice }}</div>
          </template>
        </el-table-column>
 
         
        <el-table-column prop="SN" v-if="props.data[0].SN" align="left" :width="snWidth">
          <template #header>
            <div class="header">
              <span class="label">
                SN
              </span>
              <!--
              <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.SN" placement="right" :raw-content="true">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
              -->
            </div>
            
          </template>
          <template #default="scope">
            <div style="white-space: nowrap; word-break: keep-all;">{{ scope.row.SN }}</div>
          </template>
        </el-table-column>





        <el-table-column align="center" >
          <template #header>
            <div class="header">
              <span class="label">
                Before Normalization
              </span>
            </div>
          </template>

          <el-table-column prop="mappedReadsBefore" align="right" width="180">
            <template #header>
              <div class="header">
                <span class="label second" style="width:120px;">
                  Number of Mapped Reads
                </span>
                <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.mappedReadsBefore" placement="right" :raw-content="true">
                  <div class="msg-icon-box">
                    <zhrWholeAsk />
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
 
          <el-table-column prop="meanMappedReadsBefore" align="right" width="180">
            <template #header>
              <div class="header">
                <span class="label second" style="width:120px;">
                  Mean Mapped Reads/Spots
                </span>
                <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.meanMappedReadsBefore" placement="right" :raw-content="true">
                  <div class="msg-icon-box">
                    <zhrWholeAsk />
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
 
        </el-table-column>

 




        <el-table-column align="center">
          <template #header>
            <div class="header">
              <span class="label">
                After Normalization
              </span>
            </div>
          </template>

          <el-table-column prop="mappedReadsAfter" align="right" width="180">
            <template #header>
              <div class="header">
                <span class="label second" style="width:120px;">
                  Number of Mapped Reads
                </span>
                <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.mappedReadsAfter" placement="right" :raw-content="true">
                  <div class="msg-icon-box">
                    <zhrWholeAsk />
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="meanMappedReadsAfter" align="right" width="180">
            <template #header>
              <div class="header">
                <span class="label second" style="width:120px;">
                  Mean Mapped Reads/Spots
                </span>
                <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.meanMappedReadsAfter" placement="right" :raw-content="true">
                  <div class="msg-icon-box">
                    <zhrWholeAsk />
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="readKeptFraction" align="right" width="180">
            <template #header>
              <div class="header">
                <span class="label second" style="width:110px;"> 
                  Fraction of Reads Kept  
                </span>
                <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.readKeptFraction" placement="right" :raw-content="true">
                  <div class="msg-icon-box">
                    <zhrWholeAsk />
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table-column>

 
         
        
         
        
      </el-table>
    </div>
  </div>
  `
};