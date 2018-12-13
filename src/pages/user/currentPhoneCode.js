import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Button from '../../components/Button/index'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import CountTimeComponent from '../../common/countTime'

const windowWidth = Dimensions.get('window').width;
import { getSmsCode, verifyCodeHttp } from '../../request/api/loginApi'

export default class CurrentPhoneCodePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            code: "",
            phoneNum: "",
        }
    }

    componentDidMount() {
        let _This = this
        let phone = this.props.navigation.state.params.phone;
     
        this.setState({
            phoneNum: phone
        }, ()=> {
            _This.refs.countTime.getCodeFn();
        })
    }

    // 获取短信验证码
    _getSmsCodeFn = ()=> {
        let phoneNum = this.state.phoneNum
		
		let data = {
			phoneNum,
			isInternational: '1', // 0国际 1国内
			type: '3' // 1注册 2找回密码  3替换手机号
		}
		this.setState({
            isFetching: true
        })
        getSmsCode(data)
            .then(res => {
                console.warn(JSON.stringify(res))
                this.setState({
                    isFetching: false
                })
            })
            .catch(err => {
                this.setState({
                    isFetching: false
                })
                Alert.alert(
                    '提示', 
                    JSON.stringify(err),
                    [
                        {text: '确定', onPress: () => { console.warn('确定')}}
                    ]
                )
                console.warn(err)
            }) 
    }

    nextFn = ()=> {
        let _This = this
        let phoneNum = this.state.phoneNum

        let data = {
			phoneNum,
            type: '3', // 1注册 2找回密码  3替换手机号
            vertifyCode: this.state.code
        }
        this.setState({
            isFetching: true
        })
        verifyCodeHttp(data)
            .then(res => {
                console.warn('res', JSON.stringify(res))
                this.setState({
                    isFetching: false
                })
                if(res.status !== "200") {
                    Alert.alert(
                        '提示', 
                        JSON.stringify(res.msg).replace("\"","").replace("\"",""),  // 去掉两端的双引号
                        [
                            {text: '确定', onPress: () => { console.warn('确定')}}
                        ]
                    )
                    return
                }
                const { navigate } = this.props.navigation;
                navigate("NewPhonePage", {phone: _This.state.phoneNum})
            })
            .catch(err => {
                console.warn(err)
            })
    }

    render() {
        let navigationBar = <NavigationBar
            title = "账户安全认证"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.props.navigation.goBack())}
        />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={true}>
                <View style={styles.container}>
                    {navigationBar}
                    <View>
                        <View style={[styles.spaceBetween, , styles.borderTopAndBottom, styles.inputWrap]}>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.title}>验证码</Text>
                                <TextInput
                                    placeholder="请输入绑定手机收到的验证码"
                                    style={styles.input}
                                    onChangeText={(code) => this.setState({code})}
                                    value={this.state.code}
                                />
                            </View>
                            <CountTimeComponent
                                ref="countTime"
                                getSmsCodeFn={this._getSmsCodeFn}
                                phoneNum={this.state.phoneNum}
                            />
                        </View>

                        <Text style={styles.note}>为确保账户安全,我们需要对账户操作人进行认证.</Text>
                        <Button
                            enable={true}
                            textStyle={styles.textStyle}
                            text='提交'
                            buttonStyle={styles.buttonStyle}
                            onPress={this.nextFn}/>
                    </View>
                    <Loading isShow={this.state.isFetching}/>
                </View>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1eef5"
    },
    borderTopAndBottom: {
        borderTopWidth: 1,
        borderTopColor: "#e1e0e5",
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
    },
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputWrap: {
        backgroundColor: "#fff",
        marginTop: 29,
    },
    input: {
        paddingTop: 10,
        paddingBottom: 10
    },
    title: {
        marginLeft: 19,
        fontSize: 15,
        color: "#000000",
        width: 70,
    },
    note: {
        fontSize: 11,
        color: "#525459",
        marginLeft: 20,
        marginTop: 13,
        marginBottom: 46
    },
    buttonStyle: {
        width: windowWidth - 30,
        backgroundColor: "#a6cea5",
        marginLeft: 15,
        borderWidth: 1,
        borderColor: "#70b06e"
    },
    textStyle: {
        fontSize: 18,
        color: "#e8ede8"
    },
})