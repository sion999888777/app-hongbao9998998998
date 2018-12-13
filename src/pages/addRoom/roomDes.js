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

const windowWidth = Dimensions.get('window').width;
import { modifyRoomInfoSocket } from '../../request/api/socket'

export default class RoomDesPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            des: "",
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
            des: val,
            height_comments: 1,  // 输入框的高度
        })
    }  
    onBackFn = ()=> {
        this.props.navigation.goBack()
    }

    submitFn = ()=> {
        if(this.state.des.replace(/\s+/g, "") === "") {
            Alert.alert(
				'提示', 
				'房间介绍不能为空',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return
        }

        if(this.state.type === "add") {
            DeviceEventEmitter.emit('ChangeUI', { roomDes: this.state.des });
            SyncStorage.setItem('roomDes', this.state.des)
            this.props.navigation.goBack()
            return
        }
        if(this.state.type === "modify") {
            let data = {
                id: this.state.roomId,
                intro: this.state.des
             }

             this._modifyRoomInfo(data)
        }
    }

    _modifyRoomInfo(data) {
        let _This = this
        this.setState({
            isFetching: true
        })
        modifyRoomInfoSocket(data)
			.then(res => {
                this.setState({
                    isFetching: false
                })
                Alert.alert(
                    '提示', 
                    '修改房间简介成功',
                    [
                        {text: '确定', onPress: () => { 
                            DeviceEventEmitter.emit('ChangeUI', { update: true });
                            _This.props.navigation.goBack()
                        }}
                    ]
                )
                
            })
            .catch(err => {
                this.setState({
                    isFetching: false
                })
                console.warn('errerrerrerr', JSON.stringify(err))
            })
    }

    onContentSizeChange(event) {
        this.setState({
            height_comments: event.nativeEvent.contentSize.height,
        });
    }
   
    render() {
        let rightButton = <TouchableOpacity onPress={this.submitFn}>
                            <View style={{margin: 10}}>
                                <Text style={{color: '#316834', fontSize: 15}}>完成</Text>
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
            title = "房间介绍"
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
                        maxLength={50}
                        multiline={true}
                        onContentSizeChange = {this.onContentSizeChange.bind(this)}
                        style={[styles.input, {height: Math.max(30,this.state.height_comments)}]}
                        onChangeText={(des) => this.setState({des})}
                        value={this.state.des}
                        autoFocus = {true}
                    />
                </View>
                <Text style={styles.note}>房间介绍不能大于50个汉字</Text>
                <Loading isShow={this.state.isFetching}/>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    inputWrap: {
        width: windowWidth,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 14
    },
    input: {
        width: windowWidth - 30,
        backgroundColor: '#fff',
    },
    note: {
        paddingLeft: 15,
        fontSize: 12,
        marginTop: 6,
        color: "#999"
    }
})