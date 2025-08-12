
const MicrobeMetrics = {
    props: {
        moduleTitle: String,
        data: Object,
    },
    setup(props) {
        const chartsArr = [];
        const ifShowLabel = ref(true);
        const colorSet = {
            0: {
                colorArr: [
                    '#9d7ef0',
                    '#C7C1D6',
                    '#00C089',
                    '#87C858',
                    '#FCD72E',
                    '#F59E39',
                    '#FF552D',
                    '#FF2C9C',
                    '#FF24E2',
                    '#C1C4C9'
                ],
                centerColor: '#45537A',
                centerBgColor: '#aed1c6'
            },
            1: {
                colorArr: [
                    '#05BADF',
                    '#39CFED',
                    '#6CD7ED',
                    '#B0cad6'
                ],
                centerColor: '#ffffff',
                centerBgColor: '#9D7EF0'
            }
        };
        async function downloadZip() {
            const zip = new JSZip();
            const elementToDownload = document.getElementById('microbeMetrics');
            const rawCanvas = await html2canvas(elementToDownload, {
              scale: 2
            });
            const newBlob = await new Promise(resolve => {
              rawCanvas.toBlob(resolve, 'image/png', 1.0);
            });
            zip.file(`${props.moduleTitle}.png`, newBlob);
            showLabel();
            setTimeout(async () => {
              const labelCanvas = await html2canvas(elementToDownload, {
                scale: 2
              });
              const labelBlob = await new Promise(resolve => {
                labelCanvas.toBlob(resolve, 'image/png', 1.0);
              });
              zip.file(`${props.moduleTitle}_withLabel.png`, labelBlob);
              const content = await zip.generateAsync({ type: 'blob' });
              saveAs(content, props.moduleTitle+'.zip');
              showLabel();
            }, 2000);
          };
        function downloadEPlot() {
            const elementToDownload = document.getElementById('microbeMetrics');
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

        function plotMetrics(inputData, containerId, colorIndex) {
            const newChart = echarts.init(document.getElementById(containerId));
            const microOption = {
                tooltip: {
                    show: true,
                    borderColor: 'rgba(0,0,0,0.1)',
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
                  <div style="color:white;font-size: 14px;background: ${param.color};height:36px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px;line-height: 36px;">
                    ${param.name}
                  </div>
                  
                  <div style=" color: #45537A;padding: 12px 0 4px 0;margin-bottom:4px; height:18px;font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px; ">
                    <span style="width: 50%;font-weight: 400;display:inline-block;text-align: right;margin-right: 12px;">Count : </span>
                    <span  style="color:#45537A;font-weight: 500; line-height: 18px; ">${param.value}</span>
                  </div>
                  
                  <div style=" color: #45537A;padding: 0 0 12px 0; height:18px;line-height: 18px;font-size:12px;">
                    <span style="width: 50%;font-weight: 400; display:inline-block;text-align: right;margin-right: 12px;">Percentage : </span>
                    <span style="color:#45537A;font-weight: 500; line-height: 18px; ">${param.percent}%</span>
                  </div>
                </div>
                `;
                    }
                },
                color: colorSet[colorIndex].colorArr,
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, 84],
                        itemStyle: {
                            color: '#ffffff'
                        },

                        tooltip: {
                            borderColor: 'rgba(0,0,0,0.1)',
                            show: true,
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
                                'box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);min-width: 240px;border: none;border-radius:8px',
                            formatter: function (param) {
                                return `
                
                  <div style="padding-left:16px;font-size: 14px;padding-right:16px;color:${colorSet[colorIndex].centerColor} ;background:${colorSet[colorIndex].centerBgColor};height:36px;line-height:36px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px">
                    ${param.name}
                  </div>
                  
                  <div style="color: #45537A;padding: 12px 0 4px 0;margin-bottom:4px; height:18px;font-size: 12px; font-style: normal;line-height: 18px;">
                    <span style="width: 50%;font-weight: 400;display:inline-block;text-align: right;margin-right: 12px;">Count: </span>
                    <span style="font-weight: 500;">${param.value}</span>
                  </div>
                  <div style="color: #45537A;padding: 0 0 12px 0; height:18px; font-style: normal;line-height: 18px;font-size: 12px;">
                    <span style="width: 50%; font-weight: 400;display:inline-block;text-align: right;margin-right: 12px;">Percentage: </span>
                    <span style="font-weight: 500;"> ${param.percent}%</span>
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
                            formatter: inputData.formatter,
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
                                    color: colorSet[colorIndex].centerColor,
                                    height: 20,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    lineHeight: '20',
                                    align: 'center',
                                    padding: [4, 8, 4, 8],
                                    verticalAlign: 'center',
                                    fontStyle: 'normal',
                                    backgroundColor: colorSet[colorIndex].centerBgColor,
                                    borderRadius: 24
                                }
                            }
                        },
                        labelLine: {
                            show: true
                        },
                        data: [{ value: inputData.value, name: inputData.label }]
                    },

                    {
                        name: 'Access From',
                        type: 'pie',
                        clockwise: false,
                        startAngle: 0,
                        radius: [84, 120],
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 2
                        },

                        labelLayout(params) {
                            if (!params.labelLinePoints) return;
                            return {
                                y: params.labelLinePoints[1][1] < 20 ? 20 : params.labelLinePoints[1][1] > 228 ? 228 : params.labelLinePoints[1][1],
                                labelLinePoints: [
                                    params.labelLinePoints[0],
                                    [
                                        params.labelLinePoints[1][0] < 282 ? 130 : 412,
                                        params.labelLinePoints[1][1] < 20 ? 20 : params.labelLinePoints[1][1] > 228 ? 228 : params.labelLinePoints[1][1]
                                    ],
                                    [
                                        params.labelLinePoints[1][0] < 282 ? 32 : 532,
                                        params.labelLinePoints[2][1] < 20 ? 20 : params.labelLinePoints[2][1] > 228 ? 228 : params.labelLinePoints[2][1]
                                    ]
                                ]
                            };
                        },

                        labelLine: {
                            length: 0,
                            length2: 5
                        },
                        label: {
                            alignTo: 'edge',
                            edgeDistance: '32',
                            formatter: '{b|{b}}\n{hr|}\n{per|{d}%}',
                            borderWidth: 1,
                            borderRadius: 4,
                            show: true,
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
                        data: inputData.children.map(item => {
                            return {
                                name: item.abbr ? item.abbr : item.label,
                                value: item.value
                            }
                        })
                    }
                ]
            };

            newChart.setOption(microOption);
            chartsArr.push(newChart);
        };
        function downloadMicro(e, id = 'microbe-metrics-content-box') {
            const toolbox = document.getElementById('toolbox');
            toolbox.style.opacity = 0;
            const elementToDownload = document.getElementById(id);
            html2canvas(elementToDownload, {
                scale: 2
            }).then(function (canvas) {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = id + '.png';
                link.click();
            });
            toolbox.style.opacity = 1;
        };

        function showLabel() {
            ifShowLabel.value = !ifShowLabel.value;
            chartsArr.forEach(chartItem => {
                chartItem.setOption({
                    series: [{},
                    {
                        label: {
                            show: ifShowLabel.value
                        },
                        labelLine: {
                            show: true
                        }
                    }]
                });
            })
        };
        function formatNumberWithCommas(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        onMounted(() => {
            console.log('Mount MicrobeMetrics: ', props);
            plotMetrics(props.data.unMappedReads, 'unMapped-plot', 0);
            plotMetrics(props.data.nonHostSourceReads, 'nonHost-plot', 1);
            showLabel();
        });

        return {
            props,
            ifShowLabel,
            downloadMicro,
            showLabel,
            formatNumberWithCommas,
            downloadEPlot,
            downloadZip
        };
    },
    template: `
    <div id="microbeMetrics" class="module-box microbe-keyMetrics" style="width: 1200px; ">
      <div class="module-title-box">
        <div class="title-box-left">
          <span class="title-label">{{ props.moduleTitle }}</span>
        </div>
      </div>
  
      <div class="module-content-box" id="microbe-metrics-content-box" style="display: flex;justify-content: space-between;position: relative;">
        <div class="custom-toolbox">
            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Download plot as a png" placement="top">
                <div class='toolboxBtn' @click="downloadZip">
                <el-icon size="16">
                    <zhrDownload />
                </el-icon>
                </div>
            </el-tooltip>
            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" content="Hide text" placement="top" v-if="ifShowLabel" >
                <div class='toolboxBtn' @click="showLabel" >
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
        
        <div class="module-content-left" style="width: 564px; padding: 32px 0;">
            <div id="unMapped-plot" style="width: 100%;height: 248px;margin-bottom: 32px;">
            </div>

            <a-collapse default-active-key="unMapped-reads" class="key-metrics-box" header="green">
                <a-collapse-item key="unMapped-reads">
                    <template #header>
                        <div class="custom-tree-node">
                            <div class="label-name">
                                <span class="label-icon" :style="{'background-color': '#aed1c6'}">  </span>
                                <span class="label-text">
                                {{ props.data.unMappedReads.label }}
                                </span>
                                <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="props.data.unMappedReads.msg" placement="right">
                                    <div class="msg-icon-box size14">
                                        <zhrWholeAsk />
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="value-box">
                                <span class="reads-num numbers">
                                {{formatNumberWithCommas(props.data.unMappedReads.value)}}
                                </span>
                            </div>
                        </div>
                    </template>
                    <a-collapse  >
                        <template v-for="item in props.data.unMappedReads.children">
                            <div class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                                <div class="arco-collapse-item-header-title">
                                    <div class="custom-tree-node">
                                        <div class="label-name">
                                            <span class="label-icon"
                                            :style="{'background-color': item.color}">
                                            </span>
                                            <span class="label-text">
                                            {{ item.label }}
                                            </span>
                                            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item.msg" placement="right">
                                                <div class="msg-icon-box size14">
                                                    <zhrWholeAsk />
                                                </div>
                                            </el-tooltip>
                                        </div>
                                        <div class="value-box">
                                            <span class="percentage numbers">
                                            {{item.percent}}
                                            </span>
                                            <span class="reads-num numbers">
                                            {{formatNumberWithCommas(item.value)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-collapse>
                </a-collapse-item>
            </a-collapse>
        </div>
  
        <div class="module-content-right" style="width: 564px;padding: 32px 0;">
            <div id="nonHost-plot" style="width: 100%;height: 248px;margin-bottom: 32px;">
            </div>

            <a-collapse default-active-key="nonHost-reads" class="key-metrics-box">
                <a-collapse-item key="nonHost-reads">
                    <template #header>
                        <div class="custom-tree-node">
                            <div class="label-name">
                                <span class="label-icon" :style="{'background-color': '#9D7EF0'}">  </span>
                                <span class="label-text">
                                {{ props.data.nonHostSourceReads.label }}
                                </span>
                                <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="props.data.nonHostSourceReads.msg" placement="right">
                                    <div class="msg-icon-box size14">
                                        <zhrWholeAsk />
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="value-box">
                                <span class="reads-num numbers">
                                {{formatNumberWithCommas(props.data.nonHostSourceReads.value)}}
                                </span>
                            </div>
                        </div>
                    </template>
                    <a-collapse  >
                        <template v-for="item in props.data.nonHostSourceReads.children">
                            <div class="arco-collapse-item-header arco-collapse-item-header-left stereo-collapse-item">
                                <div class="arco-collapse-item-header-title">
                                    <div class="custom-tree-node">
                                        <div class="label-name">
                                            <span class="label-icon"
                                            :style="{'background-color': item.color}">
                                            </span>
                                            <span class="label-text">
                                            {{ item.label }}
                                            </span>
                                            <el-tooltip :raw-content="true" offset="8" popper-class="hover-msg-box" :content="item.msg" placement="right">
                                                <div class="msg-icon-box size14">
                                                    <zhrWholeAsk />
                                                </div>
                                            </el-tooltip>
                                        </div>
                                        <div class="value-box">
                                            <span class="percentage numbers">
                                            {{item.percent}}
                                            </span>
                                            <span class="reads-num numbers">
                                            {{formatNumberWithCommas(item.value)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </a-collapse>
                </a-collapse-item>
            </a-collapse>
          
        </div>
      </div>
    </div>
    `
};