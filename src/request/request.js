'use strict'
import queryString from 'query-string'
import _ from 'lodash'
import config from './config'
import SyncStorage from '../util/syncStorage'
import { AsyncStorage } from 'react-native'

export default class Request {
    // get(url, params = {}) {
    get(url, params) {
        url = config.base + url
        const token = SyncStorage.getItem('token')

        if(params && (typeof(params) === 'number' || typeof(params) === 'string')) {
            let u = '/' + params + '?' + queryString.stringify({token});
            url += u
        } else {
            url += '?' + queryString.stringify({...params, token});
        }

        return fetch(url, {headers: {token}})
            .then(res => {
               return JSON.parse(res._bodyText)
            })
            .catch(err => {
               console.warn(err)
            })
    }

    post(url, body = {}) {  // body: 表单
       
	    url = config.base + url
        const token = SyncStorage.getItem('token')
        
        let options = _.extend(config.header, {
            body: JSON.stringify({...body, token})
        })
       

      return fetch(url, options)
	      .then(res => {
           return JSON.parse(res._bodyText)
	      })
	      .catch(err => {
          console.warn('err', JSON.stringify(err))
	      })
    }

    /**
     * PUT 
     */
    put(url, body = {}) {  // body: 表单
	    url = config.base + url
	    const token = SyncStorage.getItem('token')
        let options = _.extend(config.headerPut, {
            body: JSON.stringify({...body, token})
        })

        return fetch(url, options)
	      .then(res => {
                return JSON.parse(res._bodyText)
	      })
	      .catch(err => {
		      console.warn(err)
	      })
    }

    /**
     * 图片上传到图片服务器 - md5 验证
     */
    uploadImgMd5 = async (url, body = {}) => { // body: 表单
        const token = await AsyncStorage.getItem('token').then()

        let headerUpdate = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authentication": token,
                "PN": "HB"
            }
          }

        url = config.uploadImgBase + url
	    
        let options = _.extend(headerUpdate, {
            body: JSON.stringify({...body, token})
        })

        console.warn("url", url)
        console.warn("options", JSON.stringify(options))
      return fetch(url, options)
	      .then(res => {
              console.warn("resres", JSON.stringify(res))
              return JSON.parse(res._bodyText)
	      })
	      .catch(err => {
            console.warn("errerrerr", JSON.stringify(err))
		      console.warn(err)
	      })
    }

    uploadImg = async (url, body = {}) => { // body: 表单
        const token = await AsyncStorage.getItem('token').then()

        let headerUpdate = {
            method: "POST",
            headers: {
                // 'Content-Type':'multipart/form-data',
                // "Content-Type": "application/x-www-form-urlencoded",
                "Authentication": token,
                "PN": "HB"
            }
          }

        url = config.uploadImgBase + url
	    
        let options = _.extend(headerUpdate, {
            // body: JSON.stringify({...body, token}),
            processData: false,
            contentType: false,
            body: {...body}
            // body: {...body}
        })

console.warn('到这了', options)
      return fetch(url, options)
	      .then(res => {
              console.warn('接口返回正确', JSON.stringify(res))
            //   return JSON.parse(res._bodyText)
	      })
	      .catch(err => {
            console.warn('接口返回错误', JSON.stringify(err))
		      console.warn(err)
	      })
    }
}