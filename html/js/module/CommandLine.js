
const CommandLine = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Array
  },
  setup(props) {
    const ifExpand = ref(false);
    const computedStyle = ref({
      height: 0,
      padding: '0 20px',
      overflow: 'hidden',
      display: 'flex',
      'justify-content': 'space-evenly',
    });
    function expandCode() {
      ifExpand.value = !ifExpand.value;
      computedStyle.value.height = ifExpand.value ? 'auto' : 0;
      computedStyle.value.padding = ifExpand.value ? '12px 20px 12px 20px' : '0 20px';
    };
    onMounted(() => {
      console.log('Mount CommandLine: ', props);
    });

    return {
      props,
      ifExpand,
      computedStyle,
      expandCode
    };
  },
  template: `
  <div class="module-box" style="width: 1200px;padding: 8px 0;">
    <div class="module-title-box commandline" style="padding:12px 20px;">
      <div class="title-box-left " @click="expandCode()">
        <span class="title-label">{{props.moduleTitle}}</span>
          <div style="height: 20px;width:40px;padding:5px 0;">
            <el-tooltip offset="8" v-if="ifExpand" popper-class="hover-msg-box" content="Hide all commands" placement="top" :raw-content="true">
              <el-icon :size="20"><zhrCodeExpand /></el-icon>
            </el-tooltip>
            <el-tooltip offset="8" v-else popper-class="hover-msg-box" content="Show all commands" placement="top" :raw-content="true">
              <el-icon :size="20"><zhrCode /></el-icon>
            </el-tooltip>
          </div> 
      </div>
    </div>
    <div class="module-content-box" :style="computedStyle">
      <div class="command_content_box" style="padding: 16px 24px;border-radius:4px;background:#F2F4FA;color: var(--Light-05--B2-, #45537A);font-size: 14px;font-style: normal;font-weight: 400;line-height: 24px;">
        {{ props.data }}
      </div>
    </div>
  </div>
  `
};