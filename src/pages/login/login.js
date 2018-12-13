import React, { Component } from 'react'
import {
	View,
	Text,
	Image,
	TextInput,
	Dimensions,
	StyleSheet,
	AsyncStorage,
	TouchableOpacity,
	DeviceEventEmitter
} from 'react-native'

import Button from '../../components/Button/index'
import NavigationBar from '../../components/NavigationBar'
import { login } from '../../request/api/loginApi'
import { Icon } from '../../components/icon'

import ws from '../../request/socket'

import { phoneReg, pwdReg } from '../../configs/regular'
const { height } = Dimensions.get('window')

// 防止重复提交
let canClick = true

export default class Login extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			phoneNumber: '',
			password: '',
			showPwd: false,
			showErrorTip: ''
		}
	}

	componentDidMount() {
		// SyncStorage.setItem('firstCome', true)
	}
	
	
	submit() {
		if (!phoneReg.test(String(this.state.phoneNumber).replace(/\s+/, ''))) {
			setTimeout(() => this.setState({showErrorTip: '手机号码格式不正确'}), 10)
			return
		} else if (!pwdReg.test(String(this.state.password))) {
			setTimeout(() => this.setState({showErrorTip: '密码必须为6位以上数字和字母组合'}), 10)
			return
		} else {
			
			canClick = false
			this.setState({showErrorTip: ''})
			this._login()
		}
	}
	
	_login() {
		let data = {
			phoneNum: this.state.phoneNumber,
			password: this.state.password
		}

		login(data)
			.then(async res => {
				canClick = true

				if (res.status !== "200") {
					this.setState({showErrorTip: res.msg})
				} else {
					this.setState({showErrorTip: ''})

					if (this.props.afterlogin) {
						this.props.afterlogin(res.data)
					} else {
						// 这是处理非首次登录情况
						await AsyncStorage.setItem('token', res.data)
						
						ws.close()
						ws.init()

						setTimeout(async () => {
							let userInfo = await AsyncStorage.getItem('userInfo').then()
							this.props.navigation.navigate('IndexPage', {userInfo})
							DeviceEventEmitter.emit('ChangeUI', { loginUpdate: true})
							AsyncStorage.setItem("demo", true)
						}, 200)
					
					}
				}
			})
			.catch(err => { console.warn('login error=', err) })
	}
	
	changePwdType() {
		let flag = this.state.showPwd
		
		this.setState({
			showPwd: !flag
		})
	}
	
	onBack() {
		this.props.navigation.goBack()
	}
	
	render() {
		const { navigate } = this.props.navigation
		
		return (
			<View style={{backgroundColor: '#fff', height}}>
				{/*头部*/}
				<NavigationBar
					style={{backgroundColor: '#fff'}}
					title = "登录"
					statusBar={{
						backgroundColor: '#d7d7d7'
					}}
					titleStyle={{color: '#333'}}
					// leftButton={WidgetView.getLeftButton(() => this.onBack(), "#333")}
				/>
				
				<View style={styles.avator}>
					<Image style={{width: 80, height: 80}} source={require('./imgs/avatar.png')}></Image>
				</View>
				
				<View style={{paddingLeft: 15, paddingRight: 15}}>
					<View style={{marginTop: 50,marginBottom:10}}>
						<View style={styles.formGroup}>
							<Icon name={'privateIcon|shouji'} size={18} color={'#909090'} />
							<TextInput
								maxLength={16}
								placeholder="手机号"
								style={{marginLeft: 10, width: 300, paddingTop: 10, paddingBottom: 10}}
								onChangeText={phoneNumber => { this.setState({phoneNumber}) }}/>
						</View>
						
						<View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between'}]}>
							<View style={{flexDirection: 'row', alignItems:'center'}}>
								<Icon name={'privateIcon|mima'} size={9} color={'#909090'} />
								<TextInput
									placeholder="密码"
									secureTextEntry={ !this.state.showPwd }
									style={{marginLeft: 10, width: 240, paddingTop: 10, paddingBottom: 10}}
									onChangeText={(password) => this.setState({password})}/>
							</View>
							
							
							{
								this.state.showPwd ?
									<TouchableOpacity  onPress={() => this.changePwdType()} >
										<Icon name={'privateIcon|mimakejian'} size={12} color={'#54a45a'} />
									</TouchableOpacity>
									
									:
									
									<TouchableOpacity onPress={() => this.changePwdType()} >
										<Icon name={'privateIcon|mimayincang'} size={15} />
									</TouchableOpacity>
							}
							
						</View>
						
						<Text style={styles.tip}>{this.state.showErrorTip}</Text>
					</View>
					
					
					<View>
						<View style={styles.toRegister}>
							<Text style={styles.textGreen} onPress={() => navigate('Register')}>注册新账号</Text>
							<Text style={styles.textGreen} onPress={() => navigate('PasswordFind')}>忘记密码</Text>
						</View>
						<Button color="#fff"
						        buttonStyle={{
							        backgroundColor: "#0ba818",
							        height: 40,
							        borderRadius: 5,
							        marginTop: 5
						        }}
						        enable={ canClick }
						        onPress={() => this.submit()}
						        text="登录"/>
					</View>
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	avator: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 30
	},
	
	// 底部1px
	formGroup: {
		borderBottomColor: '#d7d7d7',
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	toRegister: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 5,
		paddingRight: 5,
	},
	tip: {
		color: '#ff3d3d',
		height: 40,
		lineHeight: 40
	},
	textGreen: {
		color: '#0ba818'
	}
})