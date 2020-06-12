enum experimentTypes {
  hil = 'Human In the Loop',
  automated = 'Automated'
}

// Functional Component for Chart Rendering
const criteriaChartDesign = {
  chart: {
    type: 'line',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'zoom'
    }
  },
  stroke: {
    width: 2,
    curve: 'straight',
    dashArray: [9]
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 3
  },
  title: {
    text: '',
    align: 'left'
  },
  yaxis: {
    labels: {
      formatter: function(val) {
        return (val / 1000000).toFixed(0)
      }
    }
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: "MMM 'yy",
        day: 'dd MMM',
        hour: 'HH:mm'
      }
    }
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function(val) {
        return (val / 1000000).toFixed(0)
      }
    }
  }
}

export { experimentTypes, criteriaChartDesign }
