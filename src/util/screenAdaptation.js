import { Dimensions, PixelRatio } from 'react-native'

const { width } = Dimensions.get('window')
const dpr =  Math.max(2, Math.min(2.2, PixelRatio.get()))

// UI设计稿尺寸
const uiWidthPx = 750
const ratio = (width * dpr) / uiWidthPx


const px2dp = (elementPx) => {
	let elSize = elementPx / 2 * ratio
	return elSize
}

export default px2dp

