
const SquareTable = {
  props: {
    moduleTitle: String,
    msg: Object,
    data: Array,
    moduleType: String
  },
  setup(props) {
    const { msg } = props;
    const ifShowExplain = ref(false);
    const unitNum = {
      geneSquareBin: 5 + 2 * 1.2,
      geneCellBin: 3 + 4 * 1.2,
      proteinSquareBin: 5,
      proteinCellBin: 3 + 2 * 1.2
    };

    const unitColWidth = ref(`${1160 / unitNum[props.moduleType]}`);
    console.log(unitColWidth);
    const isCellbin = computed(() => {
      return props.data[0].meanCellArea > 0;
    });
    onMounted(() => {
      console.log('Mount SquareTable: ', props, isCellbin.value);
    });

    return {
      props,
      isCellbin,
      unitColWidth,
      ifShowExplain,
      msg
    };
  },
  template: `
  <div class="module-box square-table" style="width: 1200px; ">
    <div class="module-title-box">
      <div class="title-box-left">
        <span class="title-label">{{props.moduleTitle}}</span>
      </div>
    </div>

  
    <div class="module-content-box" style="display: flex;justify-content: space-evenly;padding-bottom:20px;">
      <el-table :data="props.data" stripe style="width: 100%" :header-cell-style="{'background-color': '#efefef'}">
        <el-table-column prop="binSize" v-if="props.data[0].binSize" :width="unitColWidth" align="right">
          <template #header>
            <div class="header">
              <span class="label withMarginLeft">
                Bin Size
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.binSize" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="cellCount" v-if="props.data[0].cellCount" :width="unitColWidth" align="right">
          <template #header>
            <div class="header">
              <span class="label">
                Cell Count
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.cellCount" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="meanReads" v-if="props.data[0].meanReads" :width="unitColWidth" align="right">
          <template #header>
            <div class="header">
              <span class="label withMarginLeft">
                Mean Reads
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.meanReads" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
            
          </template>
        </el-table-column>
        <el-table-column prop="medianReads" v-if="props.data[0].medianReads" :width="unitColWidth" align="right">
          <template #header>
            <div class="header">
              <span class="label withMarginLeft">
                Median Reads
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.medianReads" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="meanCellArea" v-if="props.data[0].meanCellArea" :width="unitColWidth*1.2" align="right">
          <template #header>
            <div class="header">
              <span class="label">
                Mean Cell Area
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.meanCellArea" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="medianCellArea" v-if="props.data[0].medianCellArea" :width="unitColWidth*1.2" align="right">
          <template #header>
            <div class="header">
              <span class="label">
                Median Cell Area
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.medianCellArea" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="meanGeneType" v-if="props.data[0].meanGeneType" :width="unitColWidth*1.2" align="right">
          <template #header>
            <div class="header">
              <span class="label">
                Mean Gene Type
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.meanGeneType" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>


        </el-table-column>
        <el-table-column prop="medianGeneType" v-if="props.data[0].medianGeneType" :width="unitColWidth*1.2" align="right">
          <template #header>
            <div class="header">
              <span class="label">
                Median Gene Type
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.medianGeneType" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="meanMID" v-if="props.data[0].meanMID" :width="unitColWidth" align="right">
          <template #header>
            <div class="header">
              <span class="label withMarginLeft">
                Mean MID
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.meanMID" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="medianMID" v-if="props.data[0].medianMID" :width="unitColWidth" align="right">
          <template #header>
            <div class="header">
              <span class="label withMarginLeft">
                Median MID
              </span>
              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="msg.medianMID" placement="right">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  `
};