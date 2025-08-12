
const InputTable = {
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
    onMounted(() => {
      console.log('Mount InputTable: ', props, isCellbin.value);
    });

    return {
      props,
      isCellbin,
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

        <el-table-column prop="groupName" v-if="props.data[0].groupName" align="left" width="160">
          <template #header>
            <div class="header">
              <span class="label">
                Group Name
              </span>
              <el-tooltip offset="8" popper-class="hover-msg-box" :content="msg.groupName" placement="right" :raw-content="true">
                <div class="msg-icon-box">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
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