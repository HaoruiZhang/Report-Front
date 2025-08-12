
const Overview = {
  props: {
    data: Array
  },
  setup(props) {
    onMounted(() => {
      console.log('Mount: ', props);
    });
    return {
      props,
    };
  },
  template: `
  <div class="overview-box" style="box-sizing: border-box;width: 1200px; margin-bottom: 16px;">
    <template v-for="item in props.data">
      <div class="sub-box">
        <div class="box-main-content">
          <div class='main-content-title'>{{item.label}}</div>  
          <div class='main-content-value'>{{item.value}}</div>
        </div>
      </div>
    </template>
  </div>
  `
};