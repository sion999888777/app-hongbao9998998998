import Request from '../request'
const http = new Request()

// 上传图片 - 校验图片在数据库中是否存在
export const uploadImgMd5 = (data) => {
	return http.uploadImgMd5('/upload/image/chunkUpload/checkFile0', data)
}

// 上传图片 - 校验通过 上传到数据库
export const uploadImg = (data) => {
	console.warn('uploadImg')
	return http.uploadImg('/upload/image/chunkUpload/upload0', data)
}

