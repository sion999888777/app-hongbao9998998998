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
    DeviceEventEmitter,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Loading from '../../common/loading/index'
import { Icon } from '../../components/icon'
import SyncStorage from '../../util/syncStorage';
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { modifyRoomInfoSocket } from '../../request/api/socket'
const pwdReg = /^\d{4}$/

const {width, height} = Dimensions.get('window');

export default class PasswordSetPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            password: '',
            type: null,  // add: 添加房间  modify: 修改房间信息
            roomId: null    // 如果是修改房间信息则需要传过来 id
        }
    }
    onBackFn = ()=> {
        this.props.navigation.goBack()
    }
    componentDidMount(){
        let type = this.props.navigation.state.params.type;
        let id = this.props.navigation.state.params.id;
        let val = this.props.navigation.state.params.val ? this.props.navigation.state.params.val : ""; 
      
        this.setState({
            type: type,
            roomId: id,
            password: val
        })
    }  
    submitFn = ()=> {
        let pwd = this.state.password
        if(pwd !== "") {
            if (!pwdReg.test(parseInt(pwd))) {
                Alert.alert(
                    '提示', 
                    '密码必须是4位数字',
                    [
                        {text: '确定', onPress: () => { console.warn('确定')}}
                    ]
                )
                return
            } 
        }

        if(pwd.replace(/\s+/g, "") === "") {
            Alert.alert(
				'提示', 
				'密码为空的房间将会移至红包大厅',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
        }
 
        if(this.state.type === "add") {
            DeviceEventEmitter.emit('ChangeUI', { password: pwd });
            SyncStorage.setItem('password', pwd)
            this.props.navigation.goBack()
            return
        }
        if(this.state.type === "modify") {
            let hasPwd = pwd.replace(/\s+/g, "") !== "" ? true : false
            let data = {
                id: this.state.roomId,
                roomPwd: this.state.password,
                hasPwd: hasPwd
             }

             this._modifyRoomInfo(data)
        }

    }

    _modifyRoomInfo(data) {
        this.setState({
            isFetching: true
        })
        modifyRoomInfoSocket(data)
			.then(res => {
                this.setState({
                    isFetching: false
                })
                if(this.state.password.replace(/\s+/g, "") === "") {
                    Alert.alert(
                        '提示', 
                        '密码为空的房间将会移至红包大厅',
                        [
                            {text: '确定', onPress: () => { console.warn('确定')}}
                        ]
                    )
                } else {
                    
                }
                DeviceEventEmitter.emit('ChangeUI', { update: true });
                this.props.navigation.goBack()
            })
            .catch(err => {
                this.setState({
                    isFetching: false
                })
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
            title = "房间密码"
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
                <View style={styles.container}>
                    <View style={styles.inputWrap}>
                        <TextInput
                            maxLength={4}
                            keyboardType="default"
                            style={styles.input}
                            // secureTextEntry
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            autoFocus = {true}
                        />
                        <Text onPress={()=>{
                            this.setState({password: ''})
                        }} >
                            <Icon name={'privateIcon|clear'} size={14} color={'#cccccc'} />
                        </Text>
                    </View>
                </View>
                <Loading isShow={this.state.isFetching}/>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: height
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: width,
        paddingLeft: 15,
        paddingRight: 15
    },
    input: {
        width: width - 30 - 20,
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10
    },
})