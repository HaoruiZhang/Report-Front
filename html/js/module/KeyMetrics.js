
const KeyMetrics = {
  props: {
    moduleTitle: String,
    data: Array,
    plotDomId: Array,
  },
  setup(props) {
    const { plotDomId, data } = props;
    const computedStyle = ref(data.length > 1 ? {
      tableStyle: {
        'display': 'flex',
        'justify-content': 'space-between',
        'width': '100%',
      },
      plotStyle: {
        'display': 'flex',
        'justify-content': 'space-between',
        'width': '100%',
        'height': '392px',
      }
    } : {
      tableStyle: {
        'display': 'flex',
        'justify-content': 'space-between',
      },
      plotStyle: {
        'display': 'flex',
        'justify-content': 'space-between',
        'height': '392px',
        'float': 'right'
      }
    });
    const ifShowLabel = ref(false);
    let chartArr = [];
    const firstLabel = {
      show: false,
      position: 'middle',
      fontSize: 24,
      color: '#45537A',
      percent: '100%',
      fontWeight: 550,
      lineHeight: 36,
      rotate: 0,
      rich: {
        b: {
          height: 20,
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 18,
          align: 'center',
          color: '#45537A',
          fontStyle: 'normal'
        },
        sp: {
          lineHeight: 4
        },
        val: {
          color: '#45537A',
          backgroundColor: '#EBECF0',
          height: 20,
          fontSize: 16,
          fontWeight: 700,
          lineHeight: '20',
          align: 'center',
          padding: [4, 8, 2, 8],
          verticalAlign: 'center',
          fontStyle: 'normal',
          borderRadius: 24
        }
      }
    };
    const tooltip = {
      show: true,
      position: 'top',
      padding: 0,
      backgroundColor: '#ffffff',
      borderColor: 'rgba(0,0,0,0.1)',
      textStyle: {
        fontSize: 16,
        fontWeight: 500,
        color: '#ffffff',
        textAlign: 'center'
      },

      extraCssText:
        'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 240px;border: none;border-radius:8px',
      formatter: function (param) {
        console.log(param);
        return `
        <div>
                <div style="color:${param.data.label.color};background: ${param.color
          };padding: 6px 12px;height:24px;font-size:14px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px">
                  ${param.name}
                </div>

                <div style="color: #45537A;padding: 12px 16px;height: 18px;text-align:center;  font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px; ">
                  ${param.data.label.percent}&nbsp;of ${param.treePathInfo[param.treePathInfo.length - 2].name
          }
                </div>
        </div>
              `;
      }
    };
    const levels = {
      2: [
        {},
        {
          radius: [50, 90]
        },
        {
          radius: [90, 125]
        },
        {
          radius: [126, 160]
        }
      ],
      3: [
        {},
        {
          radius: [50, 90]
        },
        {
          radius: [90, 125]
        },
        {
          radius: [126, 160]
        }
      ],
      4: [
        {},
        {
          radius: [30, 53]
        },
        {
          radius: [54, 89]
        },
        {
          radius: [90, 125]
        },
        {
          radius: [126, 160]
        },
      ]
    };
    const commonSeries = {
      type: 'sunburst',
      startAngle: 0,
      clockwise: false,
      sort: undefined,
      emphasis: {
        focus: 'none',
        label: {
          show: true
        }
      },
      label: {
        show: false,
        rotate: 'tangential',
        align: 'center',
        color: '#fff',
        fontWeight: 550,
        lineHeight: 11,
        fontSize: 9,
        textAlign: 'center',
        fontStyle: 'normal'
      },

    };
    function countChildrenLevels(obj) {
      if (!obj) {
        return 0;
      }
      if (!obj.children) {
        return 1;
      }
      let maxLevels = 0;
      for (let i = 0; i < obj.children.length; i++) {
        let childLevels = countChildrenLevels(obj.children[i]);
        maxLevels = Math.max(maxLevels, childLevels);
      }
      return maxLevels + 1;
    };

    function showLabel() {
      ifShowLabel.value = !ifShowLabel.value;
      chartArr.forEach(chartItem => {
        chartItem.setOption({
          series: {
            label: {
              show: ifShowLabel.value
            }
          }
        });
      })
    };

    async function downloadZip() {
      const zip = new JSZip();
      const elementToDownload = document.getElementById('moduleContentBox');
      const rawCanvas = await html2canvas(elementToDownload, {
        scale: 2
      });
      const newBlob = await new Promise(resolve => {
        rawCanvas.toBlob(resolve, 'image/png', 1.0);
      });
      zip.file(`${props.moduleTitle}${ifShowLabel.value ? '_withLabel': ''}.png`, newBlob);
      showLabel();
      setTimeout(async () => {
        const labelCanvas = await html2canvas(elementToDownload, {
          scale: 2
        });
        const labelBlob = await new Promise(resolve => {
          labelCanvas.toBlob(resolve, 'image/png', 1.0);
        });
        zip.file(`${props.moduleTitle}${ifShowLabel.value ? '_withLabel': ''}.png`, labelBlob);
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, props.moduleTitle+'.zip');
        showLabel();
      }, 2000);
    };

    function downloadEPlot() {
      const elementToDownload = document.getElementById('moduleContentBox');
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = props.moduleTitle + '.png';
        link.click();
      });

      showLabel();
      setTimeout(() => {
        html2canvas(elementToDownload, {
          scale: 2
        }).then(function (canvas) {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = props.moduleTitle + '_withLabel.png';
          link.click();
        });
        showLabel();
      }, 2000);
    };

    function plotSunburst(domID, data) {
      const renderData = JSON.parse(JSON.stringify(data));
      const myChart = echarts.init(document.getElementById(domID));
      renderData[0].label = {
        ...firstLabel,
        ...renderData[0].label
      };
      if (['Clean Reads', 'Non-Host Source Reads'].includes(renderData[0].name)) {
        renderData[0].label.rich.val.color = '#ffffff';
        renderData[0].label.rich.val.backgroundColor = '#05badf';
        renderData[0].itemStyle.color = '#ffffff';
      };
      const series = {
        ...commonSeries,
        levels: levels[countChildrenLevels(renderData[0])]
      };

      const renderOption = {
        tooltip: { ...tooltip },
        series: { ...series },
      };

      renderOption.series.data = renderData;
      myChart.setOption(renderOption);
      chartArr.push(myChart);
    };
    function formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    onMounted(() => {
      console.log('Mount KeyMetrics: ', props);
      data.forEach((item, index) => {
        plotSunburst(plotDomId[index], item);
      });
    });

    return {
      props,
      plotDomId,
      computedStyle,
      ifShowLabel,
      downloadEPlot,
      downloadZip,
      showLabel,
      formatNumberWithCommas
    };
  },
  template: `
  <div id="moduleContentBox" class="module-box keyMetrics-container" style="width: 1200px; ">
    <div class="module-title-box">
      <div class="title-box-left">
        <span class="title-label">{{props.moduleTitle}}</span>
      </div>
    </div>

    <div class="module-content-box" style="padding-bottom: 20px;position: relative;">
      <div class="plot-area" :style="computedStyle.plotStyle">
        <div v-if="props.data[0]" style="width:564px;height:100%;position:relative;">
          <div :class="props.data.length === 1? 'center-label protein-label' : 'center-label'" >
              <div>Total Reads
              </div>
              <div>({{props.moduleTitle.split(' ')[0]}})
              </div>
              <div class="value-box total-gene">
                {{props.data[0][0].label.formatter.replace(/}/g, '').split('val|').pop()}}
              </div>
          </div>
          <div :id="plotDomId[0]" class="sunburst-plot-area" >
          </div>
        </div>
        <div v-if="props.data[1]" style="width:564px;height:100%;position:relative;">
          <div class="center-label" >
              <div>Clean Reads
              </div>
              <div class="value-box clean-reads">
              {{props.data[1][0].label.formatter.replace(/}/g, '').split('val|').pop()}}
              </div>
          </div>
          <div :id="plotDomId[1]" class="sunburst-plot-area" >
          </div>

        </div>
      </div>

      <div class="table-area" :style="computedStyle.tableStyle">
        <div id="left-table" v-if="props.data[0]" style="width:564px;height:100%;">
          <a-collapse :default-active-key="props.data[0].map(item=>item.id)"
            class="key-metrics-box">
            <template v-for="item in props.data[0]">
              <a-collapse-item v-if="item.children && item.children.length" :key="item.id">
                <template #header>
                  <div class="custom-tree-node">
                    <div class="label-name">
                      
                      <span class="label-text bold">
                        {{ item.name }}
                      </span>
                      <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item.msg" placement="right">
                        <div class="msg-icon-box size14">
                          <zhrWholeAsk />
                        </div>
                      </el-tooltip>
                    </div>
                    <div class="value-box">
                      <span class="reads-num numbers">
                        {{formatNumberWithCommas(item.value)}}
                      </span>
                    </div>
                  </div>
                </template>
                <a-collapse :default-active-key="item.children.map(item=>item.id)">
                  <template v-for="item1 in item.children">
                    <a-collapse-item v-if="item1.children && item1.children.length" :key="item1.id">
                      <template #header>
                        <div class="custom-tree-node">
                          <div class="label-name">
                            <span class="label-icon" :style="{'background-color': item1.itemStyle.color}">
                            </span>
                            <span class="label-text">
                              {{ item1.name }}
                            </span>
                            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1.msg" placement="right">
                              <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                            </el-tooltip>

                          </div>
                          <div class="value-box">
                            <span class="percentage numbers">
                              {{item1.label.percent}}
                            </span>
                            <span class="reads-num numbers">
                              {{formatNumberWithCommas(item1.value)}}
                            </span>
                          </div>
                        </div>
                      </template>
                      <a-collapse :default-active-key="item1.children.map(item=>item.id)">
                        <template v-for="item11 in item1.children">
                          <a-collapse-item v-if="item11.children && item11.children.length" :key="item11.id">
                            <template #header>
                              <div class="custom-tree-node">
                                <div class="label-name">
                                  <span class="label-icon" :style="{'background-color': item11.itemStyle.color}">
                                  </span>
                                  <span class="label-text">
                                    {{ item11.name }}
                                  </span>
                                  <el-tooltip :raw-content="true" offset="8" :content="item11.msg" popper-class="hover-msg-box" placement="right">
                                    <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                  </el-tooltip>

                                </div>
                                <div class="value-box">
                                  <span class="percentage numbers">
                                    {{item11.label.percent}}
                                  </span>
                                  <span class="reads-num numbers">
                                    {{formatNumberWithCommas(item11.value)}}
                                  </span>
                                </div>
                              </div>
                            </template>
                            <a-collapse :default-active-key="item11.children.map(item=>item.id)">
                              <template v-for="item111 in item11.children">
                                <a-collapse-item v-if="item111.children && item111.children.length" :key="item111.id">
                                  <template #header>
                                    <div class="custom-tree-node">
                                      <div class="label-name">
                                        <span class="label-icon" :style="{'background-color': item111.itemStyle.color }">
                                        </span>
                                        <span class="label-text">
                                          {{ item111.name }}
                                        </span>
                                        <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item111.msg" placement="right">
                                          <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                        </el-tooltip>

                                      </div>
                                      <div class="value-box">
                                        <span class="percentage numbers">
                                          {{item111.label.percent}}
                                        </span>
                                        <span class="reads-num numbers">
                                          {{formatNumberWithCommas(item111.value)}}
                                        </span>
                                      </div>
                                    </div>
                                  </template>
                                  <a-collapse :default-active-key="item111.children.map(item=>item.id)">
                                    <template v-for="item1111 in item111.children">
                                      <a-collapse-item v-if="item1111.children && item1111.children.length"
                                        :key="item1111.id">
                                        <template #header>
                                          <div class="custom-tree-node">
                                            <div class="label-name">
                                              <span class="label-icon" :style="{'background-color': item1111.itemStyle.color}">
                                              </span>
                                              <span class="label-text">
                                                {{ item1111.name }}
                                              </span>
                                              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1111.msg" placement="right">
                                                <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                              </el-tooltip>
                                            </div>
                                            <div class="value-box">
                                              <span class="percentage numbers">
                                                {{item1111.label.percent}}
                                              </span>
                                              <span class="reads-num numbers">
                                                {{formatNumberWithCommas(item1111.value)}}
                                              </span>
                                            </div>
                                          </div>
                                        </template>
                                        <!-- start -->
                                        <a-collapse :default-active-key="item1111.children.map(item=>item.id)">
                                          <template v-for="item11111 in item1111.children">
                                            <a-collapse-item v-if="item11111.children && item11111.children.length"
                                              :key="item11111.id">
                                              <template #header>
                                                <div class="custom-tree-node">
                                                  <div class="label-name">
                                                    <span class="label-icon"
                                                      :style="{'background-color': item11111.itemStyle.color}">
                                                    </span>
                                                    <span class="label-text">
                                                      {{ item11111.name }}
                                                    </span>
                                                    <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1111.msg" placement="right">
                                                      <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                                    </el-tooltip>
                                                  </div>
                                                  <div class="value-box">

                                                    <span class="percentage numbers">
                                                      {{item11111.label.percent}}
                                                    </span>
                                                    <span class="reads-num numbers">
                                                      {{formatNumberWithCommas(item11111.value)}}
                                                    </span>
                                                  </div>
                                                </div>
                                              </template>
                                              <!-- next level -->
                                            </a-collapse-item>
                                            <div v-else class=" arco-collapse-item-header arco-collapse-item-header-left
                                                      stereo-collapse-item">
                                              <div class="arco-collapse-item-header-title">
                                                <div class="custom-tree-node">
                                                  <div class="label-name">
                                                    <span class="label-icon"
                                                      :style="{'background-color': item11111.itemStyle.color}">
                                                    </span>
                                                    <span class="label-text">
                                                      {{ item11111.name }}
                                                    </span>
                                                    <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item11111.msg" placement="right">
                                                      <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                                    </el-tooltip>
                                                  </div>
                                                  <div class="value-box">

                                                    <span class="percentage numbers">
                                                      {{item11111.label.percent}}
                                                    </span>
                                                    <span class="reads-num numbers">
                                                      {{formatNumberWithCommas(item11111.value)}}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                          </template>
                                        </a-collapse>
                                        <!-- end -->
                                      </a-collapse-item>
                                      <div v-else
                                        class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                                        <div class="arco-collapse-item-header-title">
                                          <div class="custom-tree-node">
                                            <div class="label-name">
                                              <span class="label-icon" :style="{'background-color': item1111.itemStyle.color}">
                                              </span>
                                              <span class="label-text">
                                                {{ item1111.name }}
                                              </span>
                                              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1111.msg" placement="right">
                                                <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                              </el-tooltip>
                                            </div>
                                            <div class="value-box">

                                              <span class="percentage numbers">
                                                {{item1111.label.percent}}
                                              </span>
                                              <span class="reads-num numbers">
                                                {{formatNumberWithCommas(item1111.value)}}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </template>
                                  </a-collapse>
                                </a-collapse-item>
                                <div v-else
                                  class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                                  <div class="arco-collapse-item-header-title">
                                    <div class="custom-tree-node">
                                      <div class="label-name">
                                        <span class="label-icon" :style="{'background-color': item111.itemStyle.color}">
                                        </span>
                                        <span class="label-text">
                                          {{ item111.name }}
                                        </span>
                                        <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item111.msg" placement="right">
                                          <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                        </el-tooltip>
                                      </div>
                                      <div class="value-box">

                                        <span class="percentage numbers">
                                          {{item111.label.percent}}
                                        </span>
                                        <span class="reads-num numbers">
                                          {{formatNumberWithCommas(item111.value)}}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </a-collapse>
                          </a-collapse-item>
                          <div v-else
                            class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                            <div class="arco-collapse-item-header-title">
                              <div class="custom-tree-node">
                                <div class="label-name">
                                  <span class="label-icon" :style="{'background-color': item11.itemStyle.color}">
                                  </span>
                                  <span class="label-text">
                                    {{ item11.name }}
                                  </span>
                                  <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item11.msg" placement="right">
                                    <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                  </el-tooltip>
                                </div>
                                <div class="value-box">
                                  <span class="percentage numbers">
                                    {{item11.label.percent}}
                                  </span>
                                  <span class="reads-num numbers">
                                    {{formatNumberWithCommas(item11.value)}}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </a-collapse>
                    </a-collapse-item>
                    <div v-else class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                      <div class="arco-collapse-item-header-title">
                        <div class="custom-tree-node">
                          <div class="label-name">
                            <span class="label-icon" :style="{'background-color': item1.itemStyle.color}">
                            </span>
                            <span class="label-text">
                              {{ item1.name }}
                            </span>
                            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1.msg" placement="right">
                              <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                            </el-tooltip>
                          </div>
                          <div class="value-box">
                            <span class="percentage numbers">
                              {{item1.label.percent}}
                            </span>
                            <span class="reads-num numbers">
                              {{formatNumberWithCommas(item1.value)}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-collapse>
              </a-collapse-item>
              <a-collapse-item v-else :key="item.id">
                <div>{{item.name}} 33</div>
              </a-collapse-item>
            </template>
          </a-collapse>
        
        </div>
        <div id="right-table" v-if="props.data[1]" style="width:564px;height:100%;">
          <a-collapse :default-active-key="props.data[1].map(item=>item.id)"
            class="key-metrics-box">
            <template v-for="item in props.data[1]">
              <a-collapse-item v-if="item.children && item.children.length" :key="item.id">
                <template #header>
                  <div class="custom-tree-node">
                    <div class="label-name">
                      <span v-if="item.itemStyle.color" class="label-icon" :style="{'background-color': item.itemStyle.color}">
                      </span>
                      <span class="label-text bold">
                        {{ item.name }}
                      </span>
                      <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item.msg" placement="right">
                        <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                      </el-tooltip>
                    </div>
                    <div class="value-box">
                      <span class="reads-num numbers">
                        {{formatNumberWithCommas(item.value)}}
                      </span>
                    </div>
                  </div>
                </template>
                <a-collapse :default-active-key="item.children.map(item=>item.id)">
                  <template v-for="item1 in item.children">
                    <a-collapse-item v-if="item1.children && item1.children.length" :key="item1.id">
                      <template #header>
                        <div class="custom-tree-node">
                          <div class="label-name">
                            <span class="label-icon" :style="{'background-color': item1.itemStyle.color}">
                            </span>
                            <span class="label-text">
                              {{ item1.name }}
                            </span>
                            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1.msg" placement="right">
                              <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                            </el-tooltip>

                          </div>
                          <div class="value-box">
                            <span class="percentage numbers">
                              {{item1.label.percent}}
                            </span>
                            <span class="reads-num numbers">
                              {{formatNumberWithCommas(item1.value)}}
                            </span>
                          </div>
                        </div>
                      </template>
                      <a-collapse :default-active-key="item1.children.map(item=>item.id)">
                        <template v-for="item11 in item1.children">
                          <a-collapse-item v-if="item11.children && item11.children.length" :key="item11.id">
                            <template #header>
                              <div class="custom-tree-node">
                                <div class="label-name">
                                  <span class="label-icon" :style="{'background-color': item11.itemStyle.color}">
                                  </span>
                                  <span class="label-text">
                                    {{ item11.name }}
                                  </span>
                                  <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item11.msg" placement="right">
                                    <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                  </el-tooltip>

                                </div>
                                <div class="value-box">
                                  <span class="percentage numbers">
                                    {{item11.label.percent}}
                                  </span>
                                  <span class="reads-num numbers">
                                    {{formatNumberWithCommas(item11.value)}}
                                  </span>
                                </div>
                              </div>
                            </template>
                            <a-collapse :default-active-key="item11.children.map(item=>item.id)">
                              <template v-for="item111 in item11.children">
                                <a-collapse-item v-if="item111.children && item111.children.length" :key="item111.id">
                                  <template #header>
                                    <div class="custom-tree-node">
                                      <div class="label-name">
                                        <span class="label-icon" :style="{'background-color': item111.itemStyle.color }">
                                        </span>
                                        <span class="label-text">
                                          {{ item111.name }}
                                        </span>
                                        <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item111.msg" placement="right">
                                          <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                        </el-tooltip>

                                      </div>
                                      <div class="value-box">
                                        <span class="percentage numbers">
                                          {{item111.label.percent}}
                                        </span>
                                        <span class="reads-num numbers">
                                          {{formatNumberWithCommas(item111.value)}}
                                        </span>
                                      </div>
                                    </div>
                                  </template>
                                  <a-collapse :default-active-key="item111.children.map(item=>item.id)">
                                    <template v-for="item1111 in item111.children">
                                      <a-collapse-item v-if="item1111.children && item1111.children.length"
                                        :key="item1111.id">
                                        <template #header>
                                          <div class="custom-tree-node">
                                            <div class="label-name">
                                              <span class="label-icon" :style="{'background-color': item1111.itemStyle.color}">
                                              </span>
                                              <span class="label-text">
                                                {{ item1111.name }}
                                              </span>
                                              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1111.msg" placement="right">
                                                <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                              </el-tooltip>
                                            </div>
                                            <div class="value-box">
                                              <span class="percentage numbers">
                                                {{item1111.label.percent}}
                                              </span>
                                              <span class="reads-num numbers">
                                                {{formatNumberWithCommas(item1111.value)}}
                                              </span>
                                            </div>
                                          </div>
                                        </template>
                                        <!-- start -->
                                        <a-collapse :default-active-key="item1111.children.map(item=>item.id)">
                                          <template v-for="item11111 in item1111.children">
                                            <a-collapse-item v-if="item11111.children && item11111.children.length"
                                              :key="item11111.id">
                                              <template #header>
                                                <div class="custom-tree-node">
                                                  <div class="label-name">
                                                    <span class="label-icon"
                                                      :style="{'background-color': item11111.itemStyle.color}">
                                                    </span>
                                                    <span class="label-text">
                                                      {{ item11111.name }}
                                                    </span>
                                                    <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1111.msg" placement="right">
                                                      <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                                    </el-tooltip>
                                                  </div>
                                                  <div class="value-box">

                                                    <span class="percentage numbers">
                                                      {{item11111.label.percent}}
                                                    </span>
                                                    <span class="reads-num numbers">
                                                      {{formatNumberWithCommas(item11111.value)}}
                                                    </span>
                                                  </div>
                                                </div>
                                              </template>
                                              <!-- next level -->
                                            </a-collapse-item>
                                            <div v-else class=" arco-collapse-item-header arco-collapse-item-header-left
                                                      stereo-collapse-item">
                                              <div class="arco-collapse-item-header-title">
                                                <div class="custom-tree-node">
                                                  <div class="label-name">
                                                    <span class="label-icon"
                                                      :style="{'background-color': item11111.itemStyle.color}">
                                                    </span>
                                                    <span class="label-text">
                                                      {{ item11111.name }}
                                                    </span>
                                                    <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item11111.msg" placement="right">
                                                      <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                                    </el-tooltip>
                                                  </div>
                                                  <div class="value-box">

                                                    <span class="percentage numbers">
                                                      {{item11111.label.percent}}
                                                    </span>
                                                    <span class="reads-num numbers">
                                                      {{formatNumberWithCommas(item11111.value)}}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                          </template>
                                        </a-collapse>
                                        <!-- end -->
                                      </a-collapse-item>
                                      <div v-else
                                        class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                                        <div class="arco-collapse-item-header-title">
                                          <div class="custom-tree-node">
                                            <div class="label-name">
                                              <span class="label-icon" :style="{'background-color': item1111.itemStyle.color}">
                                              </span>
                                              <span class="label-text">
                                                {{ item1111.name }}
                                              </span>
                                              <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1111.msg" placement="right">
                                                <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                              </el-tooltip>
                                            </div>
                                            <div class="value-box">

                                              <span class="percentage numbers">
                                                {{item1111.label.percent}}
                                              </span>
                                              <span class="reads-num numbers">
                                                {{formatNumberWithCommas(item1111.value)}}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </template>
                                  </a-collapse>
                                </a-collapse-item>
                                <div v-else
                                  class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                                  <div class="arco-collapse-item-header-title">
                                    <div class="custom-tree-node">
                                      <div class="label-name">
                                        <span class="label-icon" :style="{'background-color': item111.itemStyle.color}">
                                        </span>
                                        <span class="label-text">
                                          {{ item111.name }}
                                        </span>
                                        <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item111.msg" placement="right">
                                          <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                        </el-tooltip>
                                      </div>
                                      <div class="value-box">

                                        <span class="percentage numbers">
                                          {{item111.label.percent}}
                                        </span>
                                        <span class="reads-num numbers">
                                          {{formatNumberWithCommas(item111.value)}}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </a-collapse>
                          </a-collapse-item>
                          <div v-else
                            class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                            <div class="arco-collapse-item-header-title">
                              <div class="custom-tree-node">
                                <div class="label-name">
                                  <span class="label-icon" :style="{'background-color': item11.itemStyle.color}">
                                  </span>
                                  <span class="label-text">
                                    {{ item11.name }}
                                  </span>
                                  <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item11.msg" placement="right">
                                    <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                                  </el-tooltip>
                                </div>
                                <div class="value-box">
                                  <span class="percentage numbers">
                                    {{item11.label.percent}}
                                  </span>
                                  <span class="reads-num numbers">
                                    {{formatNumberWithCommas(item11.value)}}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </a-collapse>
                    </a-collapse-item>
                    <div v-else class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                      <div class="arco-collapse-item-header-title">
                        <div class="custom-tree-node">
                          <div class="label-name">
                            <span class="label-icon" :style="{'background-color': item1.itemStyle.color}">
                            </span>
                            <span class="label-text">
                              {{ item1.name }}
                            </span>
                            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item1.msg" placement="right">
                              <div class="msg-icon-box size14"><zhrWholeAsk /></div>
                            </el-tooltip>
                          </div>
                          <div class="value-box">
                            <span class="percentage numbers">
                              {{item1.label.percent}}
                            </span>
                            <span class="reads-num numbers">
                              {{formatNumberWithCommas(item1.value)}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </a-collapse>
              </a-collapse-item>
              <a-collapse-item v-else :key="item.id">
                <div>{{item.name}} 33</div>
              </a-collapse-item>
            </template>
          </a-collapse>
        
        
        </div>
      </div>



      <div class="custom-toolbox">
          <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Download plot as a png" placement="top">
            <div class='toolboxBtn' @click="downloadZip">
              <el-icon size="16">
                <zhrDownload />
              </el-icon>
            </div>
          </el-tooltip>
          <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Hide text" placement="top" v-if="ifShowLabel" >
            <div class='toolboxBtn is-active' @click="showLabel" >
              <el-icon size="18">
                <zhrShowLabel />
              </el-icon>
            </div>
          </el-tooltip>
          <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Show text" placement="top"  v-else>
            <div class='toolboxBtn' @click="showLabel">
              <el-icon size="20">
                <zhrHideLabel />
              </el-icon>
            </div>
          </el-tooltip>
        </div>
      </div>

    </div>
  </div>
  `
};