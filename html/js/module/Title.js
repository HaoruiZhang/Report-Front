
const Title = {
  props: {
    moduleTitle: String,
    moduleName: String,

  },
  setup(props) {
    const ifShowExplain = ref(false);

    onMounted(() => {
      console.log('Mount Title : ', props);
    });

    return {
      props,
      ifShowExplain
    };
  },
  template: `
    <div class="module-title-box" >
      <div class="title-box-left">
        <span class="title-icon"></span>
        <span class="title-label">{{ props.moduleTitle }}</span>
        
        <div v-if="props.msg && props.msg.length" class="msg-icon-box size18">
          <zhrWholeAsk />
        </div>
      </div>
      <el-select v-model="selectedImage" clearable placeholder="Select" style="max-width: 170px;">
        <el-option v-for="item in baseImageList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>

    <div class="module-msg" v-if="ifShowExplain">
      {{ props.msg }}
    </div>
  `
};