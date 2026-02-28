
const InputTable = {
  props: {
    moduleTitle: String,
    msg: Object,
    data: Array,
    customKey: String
  },
  setup(props) {
    const { msg } = props;
    const ifShowExplain = ref(false);
    const colNum = Object.keys(props.data[0]).length - 1;
    const colWidth = ref(`${1046 / colNum}px`);
    const isCellbin = computed(() => {
      return props.data[0].meanCellArea > 0;
    });
    const customKeyWidth = computed(() => {
      return Math.min(props.customKey.length * 10 + 40, 240);
    });
    onMounted(() => {
      console.log('Mount InputTable: ', props, isCellbin.value);
    });

    return {
      props,
      isCellbin,
      ifShowExplain,
      colWidth,
      customKeyWidth,
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

  
    <div class="module-content-box" style="display: flex;justify-content: space-evenly;padding-bottom:20px;">
      <el-table :table-layout="auto" :data="props.data" stripe style="width: 100%" :header-cell-style="{'background-color': '#efefef'}">
        <el-table-column prop="Slice" v-if="props.data[0].Slice" align="left" width="160">
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
        </el-table-column>

         
        <el-table-column prop="SN" v-if="props.data[0].SN" align="left" width="160">
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
        </el-table-column>

        <el-table-column prop="custom" v-if="props.data[0].custom" align="left" :width="customKeyWidth">
          <template #header>
            <div class="header">
              <el-tooltip :content="props.customKey" placement="top" :show-after="300">
                <span class="label" style="max-width: 240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  {{ props.customKey }}
                </span>
              </el-tooltip>
              <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.custom" placement="right" :raw-content="true">
                <div class="msg-icon-box" style="flex-shrink:0;">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
          <template #default="scope">
            <el-tooltip :content="scope.row.custom ? String(scope.row.custom) : ''" placement="top" :show-after="300">
              <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; word-break: break-all;">
                {{ scope.row.custom }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
         
        <el-table-column prop="inputFile" v-if="props.data[0].inputFile"  align="left">
          <template #header>
            <div class="header" align="center">
              <span class="label">
                Input File
              </span>
              <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.inputFile" placement="right" :raw-content="true">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>

          <template #default="scope">
            <div v-for="item in scope.row.inputFile" style="width: 100%;">
              <span>{{item}} </span>
            </div>
          </template>

        </el-table-column>
         
        
      </el-table>
    </div>
  </div>
  `
};