
const ModuleHeader = {
    props: {
        moduleTitle: String,
        msg: String,
    },
    setup(props) {
        onMounted(() => {
            console.log(123, props);
        });

        return {
            props
        };
    },
    template: `
      <div class="module-title-box" >
        <div class="title-box-left">
          <span class="title-label">{{ props.moduleTitle }}</span>
          <el-tooltip :raw-content="true" offset="8" v-if="props.msg && props.msg.length" popper-class="hover-msg-box" :content="props.msg" placement="right">
            <div class="msg-icon-box size18">
                <zhrWholeAsk />
            </div>
          </el-tooltip>
        </div>
      </div>
  
       
    `
};