// CSV formats per claude/spec/dashboard-logic.md "Platform CSV Formats".

function escapeCsvField(value) {
  const str = String(value ?? '')
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toCsvRow(fields) {
  return fields.map(escapeCsvField).join(',')
}

export function buildAdobeCsv(rows) {
  const lines = [toCsvRow(['Filename', 'Title', 'Keywords', 'Category', 'Releases'])]
  rows.forEach((row) => {
    lines.push(toCsvRow([row.filename, row.title, row.keywords.join(', '), row.categoryNumber ?? '', '']))
  })
  return lines.join('\r\n') + '\r\n'
}

export function buildShutterstockCsv(rows) {
  const lines = [
    toCsvRow(['Filename', 'Description', 'Keywords', 'Categories', 'Illustration', 'Mature Content', 'Editorial']),
  ]
  rows.forEach((row) => {
    const categories = row.categoriesList ?? [row.category, row.category2].filter(Boolean)
    lines.push(
      toCsvRow([row.filename, row.description ?? '', row.keywords.join(', '), categories.join(', '), 'No', 'No', 'No'])
    )
  })
  return lines.join('\r\n') + '\r\n'
}

export function triggerDownload(filename, content, { bom = false, type = 'text/csv;charset=utf-8;' } = {}) {
  const parts = bom ? ['﻿', content] : [content]
  const blob = new Blob(parts, { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
