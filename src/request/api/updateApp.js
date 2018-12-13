import Request from '../request'
const http = new Request()


export const updateApp = async () => {
	const data = {
		type: 0
	}
	
	return http.get('/business/getLatestAppVersion', data)
}