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

export function buildPieChartOption(items, { showPercent = true, formatValue = null } = {}) {
  const theme = getChartTheme()
  const data = items.map((item, index) => ({
    name: item.name,
    value: item.amount,
    itemStyle: { color: item.color || chartColorAt(index) },
  }))

  const fmt = formatValue || ((v) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`)

  return {
    tooltip: {
      trigger: 'item',
      ...tooltipBase(theme),
      formatter: (params) => {
        const pct = params.percent != null ? ` (${params.percent.toFixed(1)}%)` : ''
        return `<strong>${params.name}</strong><br/>${fmt(params.value)}${showPercent ? pct : ''}`
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

export function buildGroupedBarOption(categories, seriesList, { formatValue = null } = {}) {
  const theme = getChartTheme()
  const fmt = formatValue || ((v) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`)

  // Compact formatter for axis labels — avoids long strings on the Y axis
  const fmtAxis = (v) => {
    const n = Number(v) || 0
    if (Math.abs(n) >= 1_000_000_000) return fmt(n / 1_000_000_000).replace(/(\d+(?:[.,]\d+)?)/, '$1B')
    if (Math.abs(n) >= 1_000_000)     return fmt(n / 1_000_000).replace(/(\d+(?:[.,]\d+)?)/, '$1M')
    if (Math.abs(n) >= 1_000)         return fmt(n / 1_000).replace(/(\d+(?:[.,]\d+)?)/, '$1K')
    return fmt(n)
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...tooltipBase(theme),
      formatter: (params) => {
        const label = params[0]?.axisValue || ''
        let lines = params.map(p => `${p.marker}${p.seriesName}: <strong>${fmt(p.value)}</strong>`)
        
        if (params.length === 2 && params.some(p => p.seriesName === 'Income') && params.some(p => p.seriesName === 'Expense')) {
            const income = params.find(p => p.seriesName === 'Income').value || 0;
            const expense = params.find(p => p.seriesName === 'Expense').value || 0;
            const net = income - expense;
            const netColor = net >= 0 ? '#10b981' : '#f43f5e';
            const netLabel = net >= 0 ? 'Surplus' : 'Deficit';
            lines.push(`<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid ${theme.gridLine};">Net Flow: <strong style="color: ${netColor}">${fmt(Math.abs(net))}</strong> <span style="font-size: 10px; color: ${theme.muted}">(${netLabel})</span></div>`);
        }
        
        return `<strong>${label}</strong><br/>${lines.join('<br/>')}`
      },
    },
    legend: {
      orient: 'horizontal',
      type: 'scroll',
      top: 0,
      textStyle: { color: theme.text },
    },
    grid: { left: 72, right: 20, bottom: 40, top: 48 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: theme.muted },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: theme.muted,
        formatter: fmtAxis,
      },
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

export function buildTrendBarOption(months, { formatValue = null } = {}) {
  return buildGroupedBarOption(
    months.map(m => m.label),
    [
      { name: 'Income', data: months.map(m => m.income), color: EZ_INCOME_COLOR },
      { name: 'Expense', data: months.map(m => m.expense), color: EZ_EXPENSE_COLOR },
    ],
    { formatValue }
  )
}

export function buildHorizontalBarOption(items, color = EZ_EXPENSE_COLOR, { formatValue = null } = {}) {
  const theme = getChartTheme()
  const fmt = formatValue || ((v) => `Rp ${Number(v || 0).toLocaleString('id-ID')}`)

  const fmtAxis = (v) => {
    const n = Number(v) || 0
    if (Math.abs(n) >= 1_000_000_000) return fmt(n / 1_000_000_000).replace(/(\d+(?:[.,]\d+)?)/, '$1B')
    if (Math.abs(n) >= 1_000_000)     return fmt(n / 1_000_000).replace(/(\d+(?:[.,]\d+)?)/, '$1M')
    if (Math.abs(n) >= 1_000)         return fmt(n / 1_000).replace(/(\d+(?:[.,]\d+)?)/, '$1K')
    return fmt(n)
  }

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      ...tooltipBase(theme),
      formatter: (params) => {
        const p = params[0]
        if (!p) return ''
        return `${p.name}: <strong>${fmt(p.value)}</strong>`
      },
    },
    grid: { left: 120, right: 24, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: theme.muted,
        formatter: fmtAxis,
      },
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
