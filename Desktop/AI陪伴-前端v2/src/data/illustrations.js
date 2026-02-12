/**
 * 插画文件列表：请将插画图片放入 public/illustrations/ 目录，
 * 命名为 1.jpg, 2.jpg, … 或 1.png, 2.png, …，并保持本列表与文件名一致。
 * 打开卡片时从中随机选一张，尽量不重复。
 */
const BASE = '/illustrations'
// 若你已有图片，可改为实际文件名，例如：['1.jpg', '2.png', '3.jpg', ...]
export const ILLUSTRATION_FILES = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
]

export function illustrationSrc(filename) {
  return `${BASE}/${filename}`
}

let usedIndices = []

/**
 * 随机选一张插画，尽量不重复；用完后重置再选。
 */
export function pickRandomIllustration() {
  if (ILLUSTRATION_FILES.length === 0) return null
  let pool = ILLUSTRATION_FILES.map((_, i) => i)
  if (usedIndices.length >= ILLUSTRATION_FILES.length) {
    usedIndices = []
  }
  const available = pool.filter((i) => !usedIndices.includes(i))
  const idx = available[Math.floor(Math.random() * available.length)]
  usedIndices.push(idx)
  return ILLUSTRATION_FILES[idx]
}
