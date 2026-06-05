/** Palette from ezBookkeeping DEFAULT_CHART_COLORS */
export const EZ_CHART_COLORS = [
  '#cc4a66',
  '#e3564a',
  '#fc892c',
  '#ffc349',
  '#4dd291',
  '#24ceb3',
  '#2ab4d0',
  '#065786',
  '#713670',
  '#8e1d51',
]

/** Default income / expense series colors (ezBookkeeping-style) */
export const EZ_INCOME_COLOR = '#e3564a'
export const EZ_EXPENSE_COLOR = '#009688'

export function chartColorAt(index) {
  return EZ_CHART_COLORS[index % EZ_CHART_COLORS.length]
}
