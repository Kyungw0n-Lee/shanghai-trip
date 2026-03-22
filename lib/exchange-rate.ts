export function cnyToKrw(amountCny: number, rate: number): number {
  return Math.round(amountCny * rate)
}

export function formatKrw(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

export function formatCny(amount: number): string {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

export async function fetchCnyKrwRate(): Promise<number> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/pair/CNY/KRW`
  )
  const data = await res.json()
  return data.conversion_rate as number
}
