import { random, sampleSize } from 'lodash-es'
/** @description: 生成随机颜色 */
export const randomColor = (min = 0, max = 255) => {
  // 生成三个介于 0 到 255 之间的随机数作为 RGB 的值
  const r = random(min, max)
  const g = random(min, max)
  const b = random(min, max)
  return `rgb(${r},${g},${b})`
}

/** @description: 验证码字符 */
export const codeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * @param {number} size 随机获取几张图片数组，默认获取随机一张图片
 * @description: 获取 /assets/img 路径下随机图片
 */
export const getRandomImg = (size = 1) => {
  const requireContext = require.context('@/assets/img', false, /\.jpg$/)
  // 匹配该目录下所有的图片
  const images = []
  for (let i = 1; i <= 20; i += 1) {
    const imgPath = `./${i}.jpg`
    const img = requireContext(imgPath).default || requireContext(imgPath) // 尝试两种方式
    if (img) {
      images.push(img)
    }
  }
  // 获取图片集合
  const result = sampleSize(images, size)
  return result.length === 1 ? result[0] : result
}

/**
 * @param {number} count
 * @description: 生成随机的汉字数组
 */
export const generateRandomHanziArray = (count = 1) => {
  const minCode = 0x4e00 // 汉字 Unicode 范围的最小值
  const maxCode = 0x9fff // 汉字 Unicode 范围的最大值

  const hanziArray = []
  for (let i = 0; i < count; i += 1) {
    const randomCode = random(minCode, maxCode)
    hanziArray.push(String.fromCodePoint(randomCode))
  }

  return hanziArray
}
