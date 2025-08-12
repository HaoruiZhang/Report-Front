
const CommonDoubleCol = {

  props: {
    withMarginRight: Boolean,
    moduleTitle: String,
    msg: String,
    data: Array
  },
  setup(props) {
    const ifShowExplain = ref(false);
    function splitArray(array) {
      const midpoint = Math.ceil(array.length / 2);
      const firstHalf = array.slice(0, midpoint);
      const secondHalf = array.slice(midpoint);
      return [firstHalf, secondHalf];
    };
    onMounted(() => {
      console.log('Common Module mounted, props: ', props);
    });

    return {
      props,
      ifShowExplain,
      splitArray
    };
  },
  template: `
  <div :class="{'module-box': true, 'with-margin-right': props.withMarginRight, 'common-table': true}" style="width: 100%;">
    <div class="module-title-box" >
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
      </div>
    </div>
    <div class="module-content-box" style="display:flex;justify-content:space-between; padding-bottom: 20px;">
      <el-table :data="splitArray(props.data)[0]" style="width: 48%;" :show-header=false>
        <el-table-column prop="label" width="235px" align="left">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-right: 4px">{{ scope.row.label }}</span>
              <el-tooltip :raw-content="true" offset="8" v-if="scope.row.msg"  popper-class="hover-msg-box" :content="scope.row.msg" placement="right">
                <div class="msg-icon-box size14">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        
        </el-table-column>
        <el-table-column prop="value" align="right" :show-overflow-tooltip="{placement: 'right', offset: 24}"></el-table-column>
      </el-table>

      <el-table :data="splitArray(props.data)[1]" style="width: 48%;" :show-header=false>
        <el-table-column prop="label" width="235px" align="left">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-right: 4px">{{ scope.row.label }}</span>
              <el-tooltip :raw-content="true" offset="8" v-if="scope.row.msg" popper-class="hover-msg-box" :content="scope.row.msg" placement="right">
                <div class="msg-icon-box size14">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="value" align="right" :show-overflow-tooltip="{placement: 'right', offset: 0}"></el-table-column>
      </el-table>
    </div>
  </div>
  `
};