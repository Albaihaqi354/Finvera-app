import { chartColorAt, EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from './colors'

const tooltipBase = {
  backgroundColor: '#fff',
  borderColor: '#fff',
  textStyle: { color: '#333' },
}

export function buildPieChartOption(items, { showPercent = true } = {}) {
  const data = items.map((item, index) => ({
    name: item.name,
    value: item.amount,
    itemStyle: { color: item.color || chartColorAt(index) },
  }))

  return {
    tooltip: {
      trigger: 'item',
      ...tooltipBase,
      formatter: (params) => {
        const value = Number(params.value || 0).toLocaleString('id-ID')
        const pct = params.percent != null ? ` (${params.percent.toFixed(1)}%)` : ''
        return `<strong>${params.name}</strong><br/>Rp ${value}${showPercent ? pct : ''}`
      },
    },
    legend: {
      orient: 'horizontal',
      type: 'scroll',
      top: 0,
      textStyle: { color: '#333' },
    },
    series: [
      {
        type: 'pie',
        radius: ['0%', '75%'],
        startAngle: -90,
        top: 50,
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        label: { color: '#333', formatter: '{b}' },
        animation: true,
      },
    ],
    media: [
      {
        query: { minWidth: 600 },
        option: {
          legend: { orient: 'vertical', left: 'left' },
          series: [{ top: 0 }],
        },
      },
    ],
  }
}

export function buildGroupedBarOption(categories, seriesList) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...tooltipBase,
    },
    legend: {
      orient: 'horizontal',
      type: 'scroll',
      top: 0,
      textStyle: { color: '#333' },
    },
    grid: { left: 56, right: 20, bottom: 40, top: 48 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: '#666' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#e1e6f2' } },
    },
    series: seriesList.map(s => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      itemStyle: { color: s.color },
      barMaxWidth: 28,
    })),
  }
}

export function buildTrendBarOption(months) {
  return buildGroupedBarOption(
    months.map(m => m.label),
    [
      { name: 'Income', data: months.map(m => m.income), color: EZ_INCOME_COLOR },
      { name: 'Expense', data: months.map(m => m.expense), color: EZ_EXPENSE_COLOR },
    ]
  )
}

export function buildHorizontalBarOption(items, color = EZ_EXPENSE_COLOR) {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...tooltipBase,
    },
    grid: { left: 120, right: 24, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#e1e6f2' } },
    },
    yAxis: {
      type: 'category',
      data: items.map(i => i.name).reverse(),
      axisLabel: { color: '#666', width: 100, overflow: 'truncate' },
    },
    series: [
      {
        type: 'bar',
        data: items.map(i => i.amount).reverse(),
        itemStyle: { color },
        barMaxWidth: 22,
      },
    ],
  }
}
