
const Common = {

  props: {
    withMarginRight: Boolean,
    moduleTitle: String,
    msg: String,
    data: Array
  },
  setup(props) {
    const ifShowExplain = ref(false);
    const computedWidth = computed(()=>{
      const hasTips =  props.data.some(item=>{
        return item.msg;
      });
      return hasTips?'200px': '320px'
    }); /** 为true时，宽度为320px */
    onMounted(() => {
      console.log('Common Module mounted, props: ', props);
     });

    function calculateSpanWidth(text) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const defaultFonts = {
        win: 'Microsoft Yahei',
        mac: 'Helvetica Neue',
        linux: 'Liberation Sans'
      };
      const osFont = navigator.platform.includes('Win') ? defaultFonts.win :
        navigator.platform.includes('Mac') ? defaultFonts.mac :
          defaultFonts.linux;
      ctx.font = `400 16px ${osFont}, sans-serif`;
      const metrics = ctx.measureText(text);
      return  metrics.width;
    };
    function getStyle(text){
      const spanWidth = calculateSpanWidth(text);
      if (spanWidth <200) {
        return 'display:inline-block;margin-right: 4px;word-break:normal;';
      } else {
        return 'display:inline-block;margin-right: 4px;word-break:normal;width:min-content;min-width:147px;';
      };
    };

    return {
      props,
      ifShowExplain,
      computedWidth,
      getStyle
    };
  },
  template: `
  <div :class="{'module-box': true, 'with-margin-right': props.withMarginRight, 'common-table': true}" style="width: 588px;">
    <div class="module-title-box" >
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
        
      </div>
    </div>

    <div class="module-content-box" style="padding-bottom: 20px;">
      <el-table :data="props.data" style="width: 100%;" :show-header=false>
        <el-table-column prop="label" align="left">
          <template #default="scope">
            <div style="display: flex; align-items: center;justify-content: flex-start;">
              <span>{{ scope.row.label }}</span>
              <el-tooltip :raw-content="true" offset="8" v-if="scope.row.msg" popper-class="hover-msg-box" :content="scope.row.msg" placement="right">
                <div class="msg-icon-box size14 marginL">
                  <zhrWholeAsk />
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <!-- 原来的
        <el-table-column prop="value" align="right" :show-overflow-tooltip="{placement: 'right', offset: 24}"></el-table-column>
        -->

        <el-table-column align="right" :show-overflow-tooltip="{placement: 'right', offset: 0}" :width="computedWidth">
          <template #default="scope">
            <span :class="{'QCvalue':scope.row.label ==='QC Pass', 'warning': scope.row.value === 'Warning', 'success': scope.row.value === 'Success'|| scope.row.value === 'Pass', 'error': scope.row.value === 'Error', 'numbers': true}" >{{scope.row.value}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  `
};