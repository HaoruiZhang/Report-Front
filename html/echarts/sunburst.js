function download() {
    // var img = new Image();
    // img.src = myChart.getDataURL({
    //   pixelRatio: 2,
    //   backgroundColor: '#fff'
    // });
    const a = document.createElement('a');
    a.download = `Sunburst.png`;
    a.target = '_blank';
    a.href = myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    a.click();
}
function showLabel() {
    console.log('showLabel', myChart.getOption());
    myChart.setOption({
        series: {
            label: {
                show: !myChart.getOption().series[0].label.show
            }
        }
    });
}

var data = [
    {
        name: 'Total Reads',
        itemStyle: {
            color: '#fff'
        },
        tooltip: {
            padding: 0,
            position: [8888, 8888],
            backgroundColor: '#ffffff',
            textStyle: {
                fontSize: 14,
                fontWeight: 600,
                color: '#45537A',
                textAlign: 'center'
            },
            extraCssText:
                'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);width: 240px;border: none', // 自定义的 CSS 样式
            formatter: function (param) {
                console.log(param);
                return `
            <div>
              <div style="background: #e1e4e9;padding: 12px;height:24px;text-align:center ">
                ${param.name}
              </div>
              <div style="color: #45537A;padding: 12px;font-family: "PingFang SC"; font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px;">
                ${param.data.label.percentage} of ${param.treePathInfo[param.treePathInfo.length - 2].name
                    }
              </div>
            </div>
            `;
                // 自定义的 DOM 结构
            }
        },

        label: {
            rotate: '0',
            show: true,
            padding: [0, 0, 0, 60],
            color: '#45537A',
            percentage: '100%',
            fontWeight: 550,
            lineHeight: 24,
            fontSize: 14,
            formatter: '{b}\n325,558,079'
            
        },
        children: [
            {
                name: 'Valid CID Reads',
                itemStyle: {
                    color: '#9D7EF0'
                },
                value: 263145167,
                label: {
                    formatter: '{b} \n263,145,167(80.8%)',
                    percentage: '80.8%',
                    rotate: 'radial'
                },
                children: [
                    {
                        name: 'Clean Reads',
                        itemStyle: {
                            color: '#05badf'
                        },
                        value: 198290350,
                        label: {
                            formatter: '{b} \n198,290,350(75.4%)',
                            percentage: '75.4%'
                        },
                        children: [
                            {
                                name: 'Uniquely Mapped Reads',
                                value: 143547117,
                                label: {
                                    formatter: '{b} \n143,547,117(72.4%)',
                                    percentage: '72.4%'
                                },
                                itemStyle: {
                                    color: '#00c089'
                                },
                                children: [
                                    {
                                        name: 'Transcriptome',
                                        value: 109476156,
                                        label: {
                                            formatter: '{b} \n109,476,156(76.3%)',
                                            percentage: '73.6%'
                                        },
                                        itemStyle: {
                                            color: '#87c858'
                                        },
                                        children: [
                                            {
                                                name: 'Unique Reads',
                                                value: 79209637,
                                                itemStyle: {
                                                    color: '#f7dc43'
                                                },
                                                label: {
                                                    formatter: '{b} \n79,209,637(72.4%)',
                                                    percentage: '72.4%',
                                                    color: '#45537A'
                                                }
                                            },
                                            {
                                                name: 'Sequencing Saturation',
                                                value: 30266519,
                                                itemStyle: {
                                                    color: '#e4e5e9'
                                                },
                                                label: {
                                                    formatter: '{b} \n30,266,519(27.6%)',
                                                    percentage: '27.6%',
                                                    color: '#45537A'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        name: 'Unannotated Reads',
                                        value: 34070961,
                                        itemStyle: {
                                            color: '#c1c4c9'
                                        },
                                        label: {
                                            formatter: '{b} \n34,070,961(23.7%)',
                                            percentage: '23.7%',
                                            color: '#45537A'
                                        }
                                    }
                                ]
                            },
                            {
                                name: 'Multi-Mapped Reads',
                                value: 25605396,
                                itemStyle: {
                                    color: '#c1c4c9'
                                },
                                label: {
                                    formatter: '{b} \n25,605,396(12.9%)',
                                    percentage: '12.9%',
                                    color: '#45537A'
                                }
                            },
                            {
                                name: 'Unmapped Reads',
                                value: 29137837,
                                itemStyle: {
                                    color: '#e4e5e9'
                                },
                                label: {
                                    formatter: '{b} \n29,137,837(14.7%)',
                                    percentage: '14.7%',
                                    color: '#45537A'
                                }
                            }
                        ]
                    },
                    {
                        name: 'Non-Relevant Short Reads',
                        value: 57108002,
                        itemStyle: {
                            color: '#c1c4c9'
                        },

                        label: {
                            formatter: '{b} \n57,108,002(21.7%)',
                            percentage: '21.7%',
                            color: '#45537A',
                            // rotate: 'radial',
                    fontSize:8
                        }
                    },
                    {
                        name: 'Discarded MID Reads',
                        value: 7746815,
                        itemStyle: {
                            color: '#e4e5e9'
                        },
                        label: {
                            formatter: '{b} \n7,746,815(2.9%)',
                            percentage: '2.9%',
                            color: '#45537A',
                            rotate: 'radial',
                            fontSize:4,
                            lineHeight:5
                        }
                    }
                ]
            },

            {
                name: 'Invalid CID Reads',
                value: 62412912,
                itemStyle: {
                    color: '#c1c4c9'
                },
                label: {
                    formatter: '{b} \n263,145,167(19.2%)',
                    percentage: '19.2%',
                    color: '#45537A',
                    
                }
            }
        ]
    }
];

option = {
    // title: {
    //   text: 'WORLD COFFEE RESEARCH SENSORY LEXICON',
    //   subtext: 'Source: https://worldcoffeeresearch.org/work/sensory-lexicon/',
    //   textStyle: {
    //     fontSize: 14,
    //     align: 'center'
    //   },
    //   subtextStyle: {
    //     align: 'center'
    //   },
    //   sublink: 'https://worldcoffeeresearch.org/work/sensory-lexicon/'
    // },

    toolbox: {
        show: true,
        iconStyle: {
            color: 'none',
            borderWidth: 1
        },
        feature: {
            dataZoom: { show: false },
            dataView: { show: false },
            magicType: { show: false },
            restore: { show: false },
            saveAsImage: {
                icon: 'M640 906.666667H192c-53.333333 0-96-42.666667-96-96V170.666667c0-53.333333 42.666667-96 96-96h640c53.333333 0 96 42.666667 96 96v448c0 17.066667-14.933333 32-32 32s-32-14.933333-32-32V170.666667c0-17.066667-14.933333-32-32-32H192c-17.066667 0-32 14.933333-32 32v640c0 17.066667 14.933333 32 32 32h448c17.066667 0 32 14.933333 32 32s-14.933333 32-32 32z M128 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334-12.8-12.8-12.8-32 0-44.8l160-160c29.866667-29.866667 74.666667-36.266667 110.933334-17.066666l172.8 87.466666c12.8 6.4 27.733333 4.266667 36.266666-6.4L872.533333 277.333333c12.8-12.8 32-12.8 44.8 0s12.8 32 0 44.8L631.466667 608c-29.866667 29.866667-74.666667 36.266667-110.933334 17.066667l-172.8-87.466667c-12.8-6.4-27.733333-4.266667-36.266666 6.4L151.466667 704c-6.4 8.533333-14.933333 10.666667-23.466667 10.666667zM384 394.666667c-53.333333 0-96-42.666667-96-96s42.666667-96 96-96 96 42.666667 96 96-42.666667 96-96 96z m0-128c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32 32-14.933333 32-32-14.933333-32-32-32zM768 599.466667c17.066667 0 32 14.933333 32 32v192c0 17.066667-14.933333 32-32 32s-32-14.933333-32-32v-192c0-17.066667 14.933333-32 32-32z M640 727.466667c8.533333 0 14.933333 2.133333 21.333333 8.533333l106.666667 100.266667 106.666667-100.266667c12.8-12.8 34.133333-10.666667 44.8 2.133333 12.8 12.8 10.666667 34.133333-2.133334 44.8l-113.066666 104.533334c-8.533333 10.666667-23.466667 17.066667-38.4 17.066666s-27.733333-6.4-38.4-17.066666L618.666667 782.933333c-12.8-12.8-12.8-32-2.133334-44.8 6.4-6.4 14.933333-10.666667 23.466667-10.666666z'
            },
            myTool1: {
                show: true,
                title: 'heiheihei',
                zIndex: 999,
                icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
                onclick: function () {
                    // download();
                    showLabel();
                }
            }
        }
        // tooltip: {
        //   // 和 option.tooltip 的配置项相同
        //   show: true,
        //   position: 'bottom',
        //   formatter: function (param) {
        //     return '<div>' + param.title + '</div>'; // 自定义的 DOM 结构
        //   },
        //   backgroundColor: '#fff',
        //   textStyle: {
        //     fontSize: 12
        //   },
        //   extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // 自定义的 CSS 样式
        // }
    },

    tooltip: {
        // 和 option.tooltip 的配置项相同
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
            'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 240px;border: none;border-radius:8px', // 自定义的 CSS 样式
        formatter: function (param) {
            console.log(param);
            return `
            <div>
              <div style="color:${param.data.label.color};background: ${param.color
                };padding: 12px;height:24px;text-align:center ">
                ${param.name}
              </div>
              <div style="color: #45537A;padding: 12px;text-align:center; font-family: "PingFang SC"; font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px; ">
                ${param.data.label.percentage} of ${param.treePathInfo[param.treePathInfo.length - 2].name
                }
              </div>
            </div>
            `;
        }
    },

    series: {
        type: 'sunburst',
        startAngle: 0,
        clockwise: false,
        data: data,
        sort: undefined,
        nodeClick: false,
        // emphasis: {
        //   focus: 'ancestor'
        // },
        itemStyle: {
            borderWidth: 2
        },
        label: {
            show: true,
            rotate: 'tangential',
            // padding: [80, 0, 0, 0],
            align: 'center',
            color: '#fff',
            fontWeight: 550,
            lineHeight: 11,
            fontSize: 9,
            fontFamily: 'PingFang SC',
            textAlign: 'center',
            fontStyle: 'normal'
        },
        levels: [
            {},
            {
                radius: [0, 58]
            },
            {
                radius: [60, 93]
            },
            {
                radius: [95, 129]
            },
            {
                radius: [131, 164]
            },
            {
                radius: [165, 199]
            },
            {
                radius: [200, 234]
            }
        ]
    }
};
