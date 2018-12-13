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
    DeviceEventEmitter,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import SyncStorage from '../../util/syncStorage';
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { modifyRoomInfoSocket } from '../../request/api/socket'

const windowWidth = Dimensions.get('window').width;
import { Icon } from '../../components/icon'
import { roomNameReg } from '../../configs/regular'

export default class RoomNameModifyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            name: '',
            type: null,  // add: 添加房间  modify: 修改房间信息
            roomId: null    // 如果是修改房间信息则需要传过来 id
        }
    }

    componentDidMount(){
        let type = this.props.navigation.state.params.type;
        let id = this.props.navigation.state.params.id;
        let val = this.props.navigation.state.params.val ? this.props.navigation.state.params.val : "";
        
        this.setState({
            type: type,
            roomId: id,
            name: val
        })
    }  

    submitFn = ()=> {
        if(this.state.name.replace(/\s+/g, "") === "") {
            Alert.alert(
				'提示', 
				'房间名字不能为空',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return
        }
        if(this.state.name.replace(/\s+/g, "") === "") {
            Alert.alert(
				'提示', 
				'房间名字不能为空',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return
        }
        if (!roomNameReg.test(String(this.state.name).replace(/\s+/, '')) || this.state.name.length > 10) {
            Alert.alert(
				'提示', 
				'房间名字只能输入中文、英文、数字，且不能大于10个字',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return
        }
        

        if(this.state.type === "add") {
            DeviceEventEmitter.emit('ChangeUI', { roomName: this.state.name });
            SyncStorage.setItem('roomName', this.state.name)
            this.props.navigation.goBack()
            return
        }
        if(this.state.type === "modify") {
            let data = {
                id: this.state.roomId,
                roomName: this.state.name
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
            title = "设置名称"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.props.navigation.goBack())}
            rightButton={rightButton}
        />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                {navigationBar}
                <View style={styles.inputWrap}>
                    <TextInput
                        maxLength={10}
                        style={styles.input}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                        autoFocus = {true}
                    />
                     <Text onPress={()=>{
                         this.setState({name: ''})
                     }} >
                        <Icon name={'privateIcon|clear'} size={14} color={'#cccccc'} />
                     </Text>
                </View>
                <Text style={styles.note}>房间名称只能输入中文、数字、字母,且不能大于10个</Text>
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
        backgroundColor: '#fff'
    },
    icon: {
        fontFamily: 'iconfont',
        color: '#cccccc',
        fontSize: 14
    },
    note: {
        paddingLeft: 15,
        fontSize: 12,
        marginTop: 6,
        color: "#999"
    }
})