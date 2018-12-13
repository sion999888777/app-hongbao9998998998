/**
 * 此页面有两个入口：
 * 1、新建房间
 * 2、修改房间信息
 * 修改房间信息入口需要请求接口提交数据
 * 根据 this.state.type 判断是哪个入口
 */

import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

const pwdReg = /^\d{6}$/
import { modifyUserInfoSocket } from '../../request/api/socket'

const windowWidth = Dimensions.get('window').width;
import { Icon } from '../../components/icon'

export default class WithdrawPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            password: '',
            modifyToken: ""
        }
    }
    componentDidMount() {
        this.setState({
          modifyToken: this.props.navigation.state.params.modifyToken ? this.props.navigation.state.params.modifyToken : null
        })
    }
    onBackFn = ()=> {
        this.props.navigation.goBack()
    }
   
    submitFn = ()=> {
        let pwd = this.state.password
        if (!pwdReg.test(parseInt(pwd))) {
            Alert.alert(
				'提示', 
				'密码必须是6位数字!',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return 
        } 
        let data = {
            withdrawPassword: "",
            newWithdrawPassword: pwd,
            modifyToken: this.state.modifyToken ? this.state.modifyToken : ""
        }

        console.warn(JSON.stringify(data))
        this._setWithdrawPwdFn(data)
    }
 
    _setWithdrawPwdFn(data) {
        let _This = this
        this.setState({
            isFetching: true
        })
        modifyUserInfoSocket(data)
        .then(res => {
            this.setState({
                isFetching: false
            })
           
            Alert.alert(
				'提示', 
				'提现密码设置成功!',
				[
					{text: '确定', onPress: () => {
                        DeviceEventEmitter.emit('ChangeUI', { update: true});
                        _This.props.navigation.navigate("UserInfoPrivatePage")
                    }}
				]
			)
            
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
            console.warn(JSON.stringify(err))
        })
    }

    render() {
        let rightButton = <TouchableOpacity onPress={this.submitFn}>
                            <View style={{margin: 10}}>
                                <Text style={{color: '#316834', fontSize: 15}}>完成</Text>
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
            title = "设置提现密码"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
            rightButton={rightButton}
        />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                {navigationBar}
                <View style={styles.inputWrap}>
                    <TextInput
                        maxLength={6}
                        autoFocus = {true}
                        keyboardType="default"
                        style={styles.input}
                        secureTextEntry
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                    />
                    <Text onPress={()=>{
                         this.setState({password: ''})
                     }} >
                        <Icon name={'privateIcon|clear'} size={14} color={'#cccccc'} />
                     </Text>
                </View>
                <Text style={styles.note}>密码必须是6位数字</Text>
                <Loading isShow={this.state.isFetching}/>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: windowWidth,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15
    },
    input: {
        width: windowWidth - 30 - 20,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10
    },
    note: {
        fontSize: 11,
        color: "#525459",
        marginLeft: 20,
        marginTop: 8,
        marginBottom: 20
    },
})