

option = {
  tooltip: {
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
    <div style="color:white;background: ${param.color};padding: 12px;height:24px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px ">
      ${param.name}
    </div>
    
    <div style=" color: #45537A;padding: 12px; font-family: "PingFang SC"; font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px; ">
      <span style="width: 50%;display:inline-block;text-align: right;margin-right: 12px;">Count: </span>
      <span  style="color:#45537A; font-family: "Helvetica Neue"; font-size: 12px; font-weight: 800; line-height: 18px; ">${param.value}</span>
    </div>
    
    <div style=" color: #45537A;padding: 12px 0; font-family: "PingFang SC"; 
    font-size: 12px; font-weight: 900;  line-height: 18px;">
      <span style="width: 50%; display:inline-block;text-align: right;margin-right: 12px;">Percentage: </span>
      <span style="color:#45537A; font-family: "Helvetica Neue"; font-size: 12px; font-weight: 800; line-height: 18px; ">${param.percent}%</span>
    </div>
  </div>
  `;
    }
  },
  color: [
    '#9d7ef0',
    '#05BADF',
    '#00C089',
    '#87C858',
    '#FCD72E',
    '#F59E39',
    '#FF552D',
    '#FF2C9C',
    '#FF24E2',
    '#C1C4C9'
  ],

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
          'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);min-width: 240px;border: none;borderRadius:20px',
        formatter: function (param) {
          return `
  <div>
    <div style="color:#ffffff;background: #45537A;padding: 12px;height:24px;text-align:center;border-top-right-radius: 8px;border-top-left-radius: 8px">
      ${param.name}
    </div>
    
    <div style="color: #45537A;padding: 12px; font-family: "PingFang SC"; font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px; ">
      <span style="width: 50%;display:inline-block;text-align: right;margin-right: 12px;">Count: </span>
      <span>${param.value}</span>
    </div>
    <div style="color: #45537A;padding: 12px 0; font-family: "PingFang SC"; 
    font-size: 12px; font-style: normal; font-weight: 600; line-height: 18px; ">
      <span style="width: 50%; display:inline-block;text-align: right;margin-right: 12px;">Percentage: </span>
      <span>${param.percent}%</span>
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
        formatter: '{b|Total counts}\n{b|Phylum}\n{sp|}\n{val|35.65K}',
        rich: {
          b: {
            height: 20,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 18,
            align: 'center',
            color: '#45537A',
            fontFamily: 'PingFang SC',
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
            fontFamily: 'Helvetica Neue',
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
      data: [{ value: 3565, name: 'Total counts Phylum' }]
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
              params.labelLinePoints[1][0] < 282 ? 130 : 440,
              params.labelLinePoints[1][1]
            ],
            [
              params.labelLinePoints[1][0] < 282 ? 32 : 532,
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
            fontFamily: 'PingFang SC',
            fontStyle: 'normal'
          }
        }
      },
      data: [
        { value: 1700, name: 'P_Proteobacteria' },
        { value: 800, name: 'p_Actinobacteria' },
        { value: 500, name: 'P_Artverviricota' },
        { value: 500, name: 'P_Planctomycetes' },
        { value: 250, name: 'P_Basidiomycota' },
        { value: 300, name: 'P_Ascomycota' },
        { value: 200, name: 'P_Cyanobacteria' },
        { value: 100, name: 'p_Firmicutes' },
        { value: 90, name: 'P_bacteroidetes' },
        { value: 100, name: 'Other' }
      ]
    }
  ]
}