export async function generateFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#059669'
    ctx.fillText('notethera-fp', 2, 2)
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${window.devicePixelRatio}`,
    new Date().getTimezoneOffset().toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas.toDataURL(),
  ].join('|||')

  const buffer = new TextEncoder().encode(components)
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
