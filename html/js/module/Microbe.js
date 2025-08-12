
const Microbe = {
  props: {
    moduleTitle: String,
    msg: Array,
    data: Array,
    header: String,
  },
  setup(props) {
    /*
    function downloadEPlot() {
      const a = document.createElement('a');
      a.download = `Microbes Proportion(${props.header}).png`;
      a.target = '_blank';
      a.href = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      a.click();
    };*/
    function downloadEPlot() {
      const elementToDownload = document.getElementById(props.header + '-content');
      html2canvas(elementToDownload, {
        scale: 2
      }).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = props.moduleTitle + '.png';
        link.click();
      });
    };
    function plotMicrobe(domID, data) {
      const myChart = echarts.init(document.getElementById(domID));

      const microOption = {
        tooltip: {
          borderColor: 'rgba(0,0,0,0.1)',
          show: true,
          position: 'top',
          padding: 0,
          backgroundColor: '#ffffff',
          textStyle: {
            fontSize: 16,
            color: '#ffffff',
            textAlign: 'center'
          },
          extraCssText:
            'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 240px; border-radius:8px;border: none;',
          formatter: function (param) {
            return `
        <div style="border: none">
          <div style="color:${param.dataIndex>2? '#45537a': 'white'};background: ${param.color};height:36px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px;font-size:14px;line-height:36px;">
            ${param.name}
          </div>
          
          <div style=" color: #45537A;padding: 12px 0 4px 0; font-size: 12px; font-style: normal;line-height: 20px; ">
            <span style="width: 50%;display:inline-block;text-align: right;margin-right: 12px;">Count : </span>
            <span style="color:#45537A;  font-size: 12px; font-weight: 500; line-height: 20px; ">${param.value}</span>
          </div>
          
          <div style=" color: #45537A;padding: 0 0 12px 0; font-size: 12px;line-height: 20px;">
            <span style="width: 50%; display:inline-block;text-align: right;margin-right: 12px;">Percentage : </span>
            <span style="color:#45537A;  font-size: 12px; font-weight: 500; line-height: 20px; ">${param.percent}%</span>
          </div>
        </div>
        `;
          }
        },
        color: data.children.map(item => item.color),

        series: [
          {
            name: 'Access From',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, 100],
            itemStyle: {
              color: '#ffffff'
            },

            tooltip: {
              show: true,
              borderColor: 'rgba(0,0,0,0.1)',
              position: 'top',
              padding: 0,
              backgroundColor: '#ffffff',
              textStyle: {
                fontSize: 16,
                fontWeight: 500,
                color: '#ffffff',
                textAlign: 'center'
              },
              extraCssText:
                'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 240px;border: none;border-radius:8px;',
              formatter: function (param) {
                return `
        <div>
          <div style="color:#45537A;background: #ebecf0;height:36px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px;font-size:14px;line-height:36px;">
            ${param.name}
          </div>
          
          <div style="color: #45537A;padding: 12px 0 4px 0; font-size: 12px; font-style: normal;line-height: 20px;">
            <span style="width:50%;display:inline-block;text-align: right;margin-right: 12px;">Count : </span>
            <span style="font-weight: 500;line-height: 20px;">${param.value}</span>
          </div>
          <div style="color: #45537A;padding: 0 0 12px 0; font-size: 12px; font-style: normal;line-height: 20px;">
            <span style="width: 50%; display:inline-block;text-align: right;margin-right: 12px;">Percentage : </span>
            <span style="font-weight: 500;line-height: 20px;">${param.percent}%</span>
          </div>
        </div>
        `;
              }
            },

            label: {
              position: 'center',
              fontSize: 24,
              color: '#45537A',
              percentage: '100%',
              fontWeight: 550,
              lineHeight: 36,
              formatter: data.formatter,
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
                  lineHeight: 12
                },
                val: {
                  color: '#45537A',
                  height: 20,
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: '20',
                  align: 'center',
                  padding: [6, 8, 4, 8],
                  verticalAlign: 'center',
                  fontStyle: 'normal',
                  backgroundColor: '#EBECF0',
                  borderRadius: 24
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [{ value: data.value, name: data.label }]
          },

          {
            name: 'Access From',
            type: 'pie',
            clockwise: false,
            startAngle: 0,
            radius: [100, 140],
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },

            labelLayout(params) {
              return {
                y: params.labelLinePoints[1][1],
                labelLinePoints: [
                  params.labelLinePoints[0],
                  [
                    params.labelLinePoints[1][0] < 282 ? 146 : 440,
                    params.labelLinePoints[1][1]
                  ],
                  [
                    params.labelLinePoints[1][0] < 282 ? 32 : 548,
                    params.labelLinePoints[2][1]
                  ]
                ]
              };
            },

            labelLine: {
              length: 0,
              length2: 10
            },
            label: {
              alignTo: 'edge',
              edgeDistance: '32',
              formatter: '{b|{b}}\n{hr|}\n{per|{d}%}',
              borderWidth: 1,
              borderRadius: 4,

              minMargin: 20,
              rich: {
                b: {
                  height: 20,
                  color: '#8C92A3',
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 20,
                  align: 'right'
                },
                hr: {
                  borderColor: 'rgba(157, 126, 240, 0.6)',
                  width: '100%',
                  borderWidth: 1,
                  height: 0,
                  opacity: 0
                },

                per: {
                  color: '#45537A',
                  height: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  lineHeight: 20,
                  align: 'right',
                  fontStyle: 'normal'
                }
              }
            },
            data: data.children.map(item => {
              return {
                value: item.value,
                name: item.label
              }
            })
          }
        ]
      };

      myChart.setOption(microOption);
    }

    onMounted(() => {
      console.log('Mount Microbe: ', props);
      plotMicrobe(props.header, props.data);

    });
    /*function downloadMicro(id) {
      const elementToDownload = document.getElementById(id);
      html2canvas(elementToDownload).then(function (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = id + '.png';
        link.click();
      });
    };*/
    function formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return {
      props,
      downloadEPlot,
      formatNumberWithCommas
    };
  },
  template: `
  <div :id="props.header+'-content'" class="module-box microbe" style="width: 1200px; ">
    <div class="module-title-box">
      <div class="title-box-left">
        <span class="title-label">{{ props.moduleTitle }}</span>
        <el-tooltip :raw-content="true" offset="8" v-if="props.msg && props.msg.length" popper-class="hover-msg-box" :content="props.msg" placement="right">
          <div class="msg-icon-box size18">
            <zhrWholeAsk />
          </div>
        </el-tooltip>
      </div>
    </div>

    <div class="module-content-box" style="display: flex;justify-content: space-between;">
      <div class="custom-toolbox">
        <div class='toolboxBtn' @click="downloadEPlot">
            <el-icon size="16">
                <zhrDownload />
            </el-icon>
        </div>
        
      </div>
      <div class="module-content-left" style="padding-bottom:20px;width: 564px">
        <el-table :data="props.data.children" style="width: 100%;" :header-cell-style="{'text-align': 'center', 'color': '#45537A','font-size': '16px', 'font-style': 'normal', 'font-weight': 600, 'line-height': '24px'}">
          
        <el-table-column prop="label" :label="props.header" width="250px" align="left" label-class-name="microbe-label" class-name="microbe-content-label">
            <template #default="scope">
              <span class="label-icon" :style="{'background-color': scope.row.color}"></span>
              {{scope.row.label}}
            </template>
          </el-table-column>

          <el-table-column label="Percentage" align="right" label-class-name="microbe-label" class-name="microbe-content-value">
            <template #header>
              Proportion
            </template>
            <template #default="scope">
              <span class="numbers">
                {{scope.row.percentage}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="MID Count" align="right" label-class-name="microbe-label" class-name="microbe-content-value">
            <template #default="scope">
              <span class="numbers">
                {{formatNumberWithCommas(scope.row.value)}}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="module-content-right panzoom-box" style="width: 580px;height: 488px;margin-top:38px;display: flex;justify-content: center;align-items: center;border-radius: 5px; position: relative;">
        
        <div :id="props.header" style="width: 100%;height: 100%;">
        </div>
      </div>
    </div>
  </div>
  `
};