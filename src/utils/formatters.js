export function formatCurrency(amount = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value) {
  if (!value) return 'Not scheduled'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function truncateText(value = '', length = 110) {
  if (value.length <= length) return value
  return `${value.slice(0, length).trim()}...`
}
