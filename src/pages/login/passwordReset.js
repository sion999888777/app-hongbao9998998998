import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	AsyncStorage,
	StyleSheet, 
	TextInput, 
	Dimensions
} from 'react-native'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import NavigationBar from '../../components/NavigationBar'
import WidgetView from "../../common/headerLeft"

import { resetPassword } from '../../request/api/loginApi';
import SyncStorage from '../../util/syncStorage';

import { Icon } from '../../components/icon'

const height = Dimensions.get('window').height;

import { pwdReg } from '../../configs/regular'

export default class PasswordReset extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			showErrorTip: '',
			newPwd: '',
			confirmPwd: '',
			showConfirmPwd: false,
			showPwd: false
		}
	}
	
	componentWillMount() {
		let token = SyncStorage.getItem('token')
		
		// 如果没有登录 则返回上一页
		if (!token) {
			this.onBack()
		}
	}

	componentWillUnmount() {
		AsyncStorage.removeItem('token')
	}
	
	
	onBack() {
		this.props.navigation.goBack()
	}
	
	confirmResetPwd() {
		let pwd = pwdReg.test(this.state.newPwd)
		let rePwd = new RegExp(this.state.newPwd).test(this.state.confirmPwd)
		if (!pwd) {
			setTimeout(() => this.setState({showErrorTip: '密码必须为6位以上数字和字母组合'}))
			return
		} else if (!rePwd) {
			setTimeout(() => this.setState({showErrorTip: '密码输入不一致'}))
			return
		}
		
		setTimeout(() => this.setState({showErrorTip: ''}))
		
		// 发送密码重置接口
		this._resetPassword()
	}
	
	_resetPassword = async () => {
		let data = {
			phone: await AsyncStorage.getItem('token').then() || '', // 非必须
			newPassword: this.state.newPwd
		}
		
		resetPassword(data)
			.then(res => {
				if (res.status !== '200') {
					setTimeout(() => this.setState({showErrorTip: res.msg}), 10)
				} else {
					// 弹框提示密码重置成功!
					this.props.navigation.navigate('IndexPage')
				}
			})
	}
	
	
	render() {
		return (
			<SafeAreaViewPlus  
				topColor={'#fff'}
				bottomInset={false}>
				<NavigationBar
					style={{backgroundColor: '#fff',borderBottomColor: '#d7d7d7', borderBottomWidth: 1}}
					title = "重置密码"
					titleStyle={{color: '#333'}}
					statusBar={{
						backgroundColor: '#fff'
					}}
					leftButton={WidgetView.getLeftButton(() => this.onBack(), '#333')}
				/>
				
				<View style={styles.container}>
					
					<View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
						<View style={{flexDirection: 'row', alignItems:'center'}}>
							<Icon name={'privateIcon|suo'} size={18} color={'#909090'} />
							<TextInput
								style={{marginLeft: 10}}
								placeholder="请输入您的新密码"
								secureTextEntry={ !this.state.showPwd }
								onChangeText={(newPwd) => this.setState({newPwd})}/>
						</View>
						
						<Text style={{marginRight: 10,fontFamily: 'iconfont', fontSize: 12}}
							onPress={() => this.setState({showPwd: !this.state.showPwd})}>
							{ 
								this.state.showPwd ? 
								<Icon name={'privateIcon|mimakejian'} color={'#54a45a'} /> :
								<Icon name={'privateIcon|mimayincang'} />
							}
						</Text >
					</View>
					
					<View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
						<View style={{flexDirection: 'row', alignItems:'center'}}>
							<Icon name={'privateIcon|suo'} size={18} color={'#909090'} />
							<TextInput
								style={{marginLeft: 10}}
								placeholder="请再次输入密码"
								secureTextEntry={ !this.state.showConfirmPwd }
								onChangeText={(confirmPwd) => this.setState({confirmPwd})}/>
						</View>
						
						<Text style={{marginRight: 10,fontFamily: 'iconfont', fontSize: 12}}
							onPress={() => this.setState({showConfirmPwd: !this.state.showConfirmPwd})}>
							{
								 this.state.showConfirmPwd ? 
								 <Icon name={'privateIcon|mimakejian'} color={'#54a45a'} /> : 
								 <Icon name={'privateIcon|mimayincang'} />
							}
						</Text >
					</View>
					
					<Text style={styles.tip}>{this.state.showErrorTip}</Text>
					
					<TouchableOpacity
						style={styles.confirmBtn}
						onPress={() => this.confirmResetPwd()}>
						<Text style={{color: "#fff", textAlign: 'center', lineHeight: 40}}>确 认</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaViewPlus>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		height,
		backgroundColor: '#fff',
		padding: 30
	},
	formGroup: {
		borderBottomColor: '#d7d7d7',
		borderBottomWidth: 1,
		height: 40,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	confirmBtn: {
		backgroundColor: "#0ba818",
		height: 40,
		lineHeight: 40,
		borderRadius: 5,
		marginTop: 50,
	},
	
	tip: {
		color: '#ff3d3d',
		height: 40,
		lineHeight: 40
	}
})