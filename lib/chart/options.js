import { chartColorAt, EZ_EXPENSE_COLOR, EZ_INCOME_COLOR } from './colors'

export function getChartTheme() {
  if (typeof document === 'undefined') {
    return {
      tooltipBg: '#ffffff',
      text: '#333333',
      muted: '#666666',
      gridLine: '#e1e6f2',
    }
  }

  const style = getComputedStyle(document.documentElement)
  return {
    tooltipBg: style.getPropertyValue('--chart-tooltip-bg').trim() || '#ffffff',
    text: style.getPropertyValue('--chart-text').trim() || '#333333',
    muted: style.getPropertyValue('--chart-text-muted').trim() || '#666666',
    gridLine: style.getPropertyValue('--chart-grid-line').trim() || '#e1e6f2',
  }
}

function tooltipBase(theme) {
  return {
    backgroundColor: theme.tooltipBg,
    borderColor: theme.tooltipBg,
    textStyle: { color: theme.text },
  }
}

export function buildPieChartOption(items, { showPercent = true } = {}) {
  const theme = getChartTheme()
  const data = items.map((item, index) => ({
    name: item.name,
    value: item.amount,
    itemStyle: { color: item.color || chartColorAt(index) },
  }))

  return {
    tooltip: {
      trigger: 'item',
      ...tooltipBase(theme),
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
      textStyle: { color: theme.text },
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
        label: { color: theme.text, formatter: '{b}' },
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
  const theme = getChartTheme()

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...tooltipBase(theme),
    },
    legend: {
      orient: 'horizontal',
      type: 'scroll',
      top: 0,
      textStyle: { color: theme.text },
    },
    grid: { left: 56, right: 20, bottom: 40, top: 48 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: theme.muted },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: theme.muted },
      splitLine: { lineStyle: { color: theme.gridLine } },
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
  const theme = getChartTheme()

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...tooltipBase(theme),
    },
    grid: { left: 120, right: 24, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLabel: { color: theme.muted },
      splitLine: { lineStyle: { color: theme.gridLine } },
    },
    yAxis: {
      type: 'category',
      data: items.map(i => i.name).reverse(),
      axisLabel: { color: theme.muted, width: 100, overflow: 'truncate' },
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
