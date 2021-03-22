let sampleData = {
  'WA': 11,
  'EP1': 13,
  'EP2': 14,
  'EP3': 16,
  'ACCEPT': 17
}

const pieColorMap = {
  'WA': {color: '#ed3f14'},
  'EP1': {color: '#ff9300'},
  'EP2': {color: '#f7de00'},
  'EP3': {color: '#2d8cf0'},
  'ACCEPT': {color: '#19be6b'}
}

function getItemColor (obj) {
  return pieColorMap[obj.name].color
}

const pie = {
  legend: {
    left: 'center',
    top: '10',
    orient: 'horizontal',
    data: ['WA', 'EP1', 'EP2', 'EP3', 'ACCEPT']
    // ['AC', 'WA']
  },
  series: [
    {
      name: 'Summary',
      type: 'pie',
      radius: '80%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: sampleData.WA, name: 'WA'},
        {value: sampleData.EP1, name: 'EP1'},
        {value: sampleData.EP2, name: 'EP2'},
        {value: sampleData.EP3, name: 'EP3'},
        {value: sampleData.ACCEPT, name: 'ACCEPT'}
      ],
      label: {
        normal: {
          position: 'inner',
          show: true,
          formatter: '{b}: {c}\n {d}%',
          textStyle: {
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
}

const largePie = {
  legend: {
    left: 'center',
    top:
      '10',
    orient:
      'horizontal',
    itemGap:
      20,
    data:
      // ['AC', 'RE', 'WA', 'TLE', 'PAC', 'MLEasdf']
      ['WA', 'EP1', 'EP2', 'EP3', 'ACCEPT']
  },
  series: [
    {
      name: 'Detail',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        /*
        {value: 0, name: 'RE'},
        {value: 0, name: 'WA'},
        {value: 0, name: 'TLE'},
        {value: 0, name: 'AC'},
        {value: 0, name: 'MLEasdf'},
        {value: 0, name: 'PAC'}
        */
        {value: sampleData.WA, name: 'WA'},
        {value: sampleData.EP1, name: 'EP1'},
        {value: sampleData.EP2, name: 'EP2'},
        {value: sampleData.EP3, name: 'EP3'},
        {value: sampleData.ACCEPT, name: 'ACCEPT'}

      ],
      label: {
        normal: {
          formatter: '{b}: {c}\n {d}%'
        }
      },
      labelLine: {
        normal: {}
      }
    },
    {
      name: 'Summary',
      type: 'pie',
      radius: '30%',
      center: ['50%', '55%'],
      itemStyle: {
        normal: {color: getItemColor}
      },
      data: [
        {value: sampleData.WA, name: 'WA'},
        {value: sampleData.EP1, name: 'EP1'},
        {value: sampleData.EP2, name: 'EP2'},
        {value: sampleData.EP3, name: 'EP3'},
        {value: sampleData.ACCEPT, name: 'ACCEPT', selected: true}
      ],
      label: {
        normal: {
          position: 'inner',
          formatter: '{b}: {c}\n {d}%'
        }
      }
    }
  ]
}

export { pie, largePie }
