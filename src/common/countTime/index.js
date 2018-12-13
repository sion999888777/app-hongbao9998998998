import React, { Component } from 'react'
import {
	Text,
	StyleSheet,
	Alert,
	TouchableOpacity
} from 'react-native'

import { phoneReg } from '../../configs/regular'
const COUNT = 60 // 倒计时时间

export default class CountTimeComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            codeText: '获取验证码',
            code: "",
            codeNumber: '',
        }
        this.count = COUNT
    }

     // 获取短信验证码
	getCodeFn() {
		if (!phoneReg.test(String(this.props.phoneNum))) {
			Alert.alert(
				'提示', 
				'请输入正确的手机号!',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
			return
		}

		// 如果已经发送了 正在倒计时 return
		if (this.count < COUNT && this.count > 0) {
			return false
		}
		
		this.setState({codeNumber: ''})

		this.count = COUNT - 1
		this.countTime()
		// 发送验证码
		this.props.getSmsCodeFn()
    }
    
    // 获取短信倒计时 
	countTime() {
		let timer = setInterval(() => {
			this.count--
			
			// 倒计时结束后才可以重新发送短信
			if (this.count < 0) {
				clearInterval(timer)
				timer = null
				this.setState({codeText: '重新发送'})
				return false
			}
			
			this.setState({codeText: this.count + 's'})
		}, 1000)
	}

    render() {
        return (
			<TouchableOpacity style={styles.codeBtn} onPress={ () => this.getCodeFn() }>
				<Text style={{textAlign: 'center', fontSize: 10}}>{this.state.codeText}</Text>
			</TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    codeBtn: {
		backgroundColor: "#eeeeee",
		borderWidth: 1,
		borderColor: "#e1e1e1",
		borderRadius: 2,
		padding: 5,
		fontSize: 10,
		color: "#000000",
		marginRight: 10
	}
})