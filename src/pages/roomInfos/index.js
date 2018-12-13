/**
 * 房间详情页 
 * 房主可以修改部分信息、成员不可修改
 * 底金 不可修改
 * 12月版本用
 */

import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    DeviceEventEmitter,
    Switch,
    Alert,
    AsyncStorage
} from 'react-native'
import Picker from 'react-native-picker'
import Loading from '../../common/loading/index'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { getRoomInfoSocket, modifyRoomInfoSocket } from '../../request/api/socket'
import config from '../../request/config'

import { Icon } from '../../components/icon'
import { getArr } from "../../util/tool"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let numInit = null

export default class RoomMoreInfoPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            // switchIsOn: false,  // 消息免打扰开关
            roomId: null,       // 房间ID
            dragonRuleId: null,  // 接龙规则 ID
            hostIs: null,       // 判断是否是房主

            messageList: [
                {message: '5'},
            ],  // 选择弹框数据
            userSimpleInfos: [],     // 房间成员信息（昵称、头像） 前20个
            userSimpleAllInfos: [],     // 房间成员信息（昵称、头像） 全部
            numList: [],        // 可选红包数组
            ruleList: [],       // 发包规则 可选数据
            packRuleOptions: [],  // 发包规则   文案+id  数据库中的
            userShowLen: 20, // 用户超过2个显示查看更多

            roomAvatar: "",         // 房间头像
            roomName: "",           // 房间名称
            roomNum: "",            // 房号
            roomPwd: "",            // 房间密码
            peopleMax: "",          // 人数上限
            amountRatio: "",        // 红包池金额比例
            homeownerRebate: "",    // 房主返利

            roomDes: "",            // 房间介绍

            leastMoney: "",     // 低金
            packCount: "",      // 发包个数 
            ruleTypeValue: "",  // 发包规则 
        }
    }
   
    componentDidMount(){    
        let roomId = this.props.navigation.state.params.roomId;
        this._getRoomInfoSocket({id: roomId})

        DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
            if(dic.update) {
                this._getRoomInfoSocket({id: roomId})
            } 
       });
    }

    // 初始化选择框
    PickerInit() {
        _This = this
        Picker.init({
            pickerData: this.state.messageList.map(item => item.message),
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnColor: [27, 127, 25, 1],
            pickerCancelBtnColor: [102,102,102,1],
            pickerBg: [255,255,255,1],
            pickerTitleText: '',
            pickerTextEllipsisLen: 20,
            selectedValue: ['催催催, 催啥催!'],
            onPickerConfirm: data => {
                // _This.setState({
                //     packCount: data
                // }, ()=> {
                //     let data = {
                //         id: _This.state.roomId,
                //         dragonRule: {
                //             id: _This.state.dragonRuleId,
                //             packCount: parseInt(_This.state.packCount),
                //         }
                //     }
                //     _This._modifyNum(data)
                // })
                

                // 
                if(numInit === 1) {
                    _This.setState({
                        packCount: data
                    }, ()=> {
                        let data = {
                            id: _This.state.roomId,
                            dragonRule: {
                                id: _This.state.dragonRuleId,
                                packCount: parseInt(_This.state.packCount),
                            }
                        }
                        _This._modifyNum(data)
                    })
                }  
                else 
                if(numInit === 2) {
                    _This.setState({
                        checkedRule: data
                    })
                    _This.state.packRuleOptions.forEach(item => {
                        if(item.itemKey == data) {
                            let checkedRuleNum = item.itemValue     // 选中的发包规则对应的数据库中的数字
                            let data = {
                                id: _This.state.roomId,
                                dragonRule: {
                                    id: _This.state.dragonRuleId,
                                    packStrategy: parseInt(checkedRuleNum),
                                }
                            }
                            _This._modifyNum(data)
                        }
                    })
                } 
            },
            onPickerSelect: data => {}
        })
    }

    // 修改红包个数
    _modifyNum(data) {
        let _This = this
        // this.setState({
        //     isFetching: true
        // })
        console.warn('参数', JSON.stringify(data))
        modifyRoomInfoSocket(data)
			.then(res => {
                console.warn('修改红包个数', JSON.stringify(res))
                // this.setState({
                //     isFetching: false
                // })
                Alert.alert(
                    '提示', 
                    '修改成功!',
                    [
                        {text: '确定', onPress: () => { 
                            DeviceEventEmitter.emit('ChangeUI', { update: true });
                            _This.props.navigation.goBack()
                        }}
                    ]
                )
                
            })
            .catch(err => {
                // this.setState({
                //     isFetching: false
                // })
                console.warn('err', JSON.stringify(err))
            })
    }

    // 获取房间信息
    _getRoomInfoSocket(data) {
        let _This = this
        this.setState({
            isFetching: true
        })
        getRoomInfoSocket(data)
			.then(res => {
                
                this.setState({
                    isFetching: false
                })
                let data = res
                let dragonRule  = data.dragonRule
                let roomCard    = data.roomCard
               
                let numListdataInit = this.state.numList;
                let newNumListData  = [...numListdataInit]; 
                newNumListData      = getArr(roomCard.packCountMin, roomCard.packCountMax, roomCard.packCountStep)

                // 发包规则
                let ruleListdataInit = this.state.ruleList;
                let newRuleListData = [...ruleListdataInit]; 

                let arr = new Array()
                data.packRuleOptions.forEach(item => {
                    arr.push({message: item.itemKey})
                })
                newRuleListData = arr
                
                _This.setState({
                    packRuleOptions: data.packRuleOptions,  // 发包规则 数据库中的 文案+ID
                    roomId: data.id,    // 房间ID
                    dragonRuleId: dragonRule.id,// 接龙规则 ID
                    hostIs: data.roomOwnerIs,   // 是否是房主
                    numList: newNumListData,    // 发包个数 可选数据
                    ruleList: newRuleListData,  // 发包规则 可选数据
                    userSimpleAllInfos: data.userSimpleInfos,

                    roomAvatar: data.roomLogo ? config.imgUrl+data.roomLogo : config.defaultRoomAvatarBase64,    // 房间头像
                    roomName: data.roomName,                    // 房间名称
                    roomNum: data.roomNo,                        // 房号
                    roomPwd: data.roomPwd,                      // 房间密码
                    peopleMax: data.totalUser ,                 // 人数上限
                    amountRatio: (parseFloat(dragonRule.systemCharges) + parseFloat(dragonRule.ownerCharges)) * 100 + "%",   // 红包池金额比例
                    homeownerRebate: dragonRule.ownerCharges * 100 + "%",    // 房主返利
                    roomDes: data.intro, // 房间介绍
                    leastMoney: dragonRule.leastMoney,  // 底金
                    packCount: dragonRule.packCount,    // 发包个数 - 选中的
                    checkedRule: '',    // 发包规则 - 选中的
                    ruleTypeValue: dragonRule.ruleTypeValue,    // 发包规则
                }); 
                console.warn("data.userSimpleInfos", data.userSimpleInfos)
            })
            .catch(err => {
                this.setState({
                    isFetching: false
                })
                console.warn(JSON.stringify(err))
            })
    }

    shareFn = ()=> {
        const { navigate } = this.props.navigation;
        navigate("RoomSharePage")
    }

    recordFn = ()=> {
        const { navigate } = this.props.navigation;
        navigate("RoomRecordPage", {roomId: this.state.roomId})
    }
  
    pickerFn(state) {
        // this.PickerInit()
        // Picker.show();
        let dataInit = this.state.messageList;
        let newData = [...dataInit];  
        let _This = this  

        if(state === 'num') {
            newData = this.state.numList
            numInit = 1
            this.setState({
                messageList: newData
            }, ()=> {
                _This.PickerInit()
                Picker.show();
            })
            return false
        }
        if(state === 'rule') {
            newData = this.state.ruleList
            numInit = 2
            this.setState({
                messageList: newData
            }, ()=> {
                _This.PickerInit()
                Picker.show();
            })
            return false
        }
    }

    controlSoundFn(value) {
        console.warn('value', value)
        // this.setState({switchIsOn: value})
        // if(value) {
        //     AsyncStorage.setItem('playAudio', 'yes')
        // } else {
        //     AsyncStorage.setItem('playAudio', '')
        // }
    }

    render() {
        const { navigate } = this.props.navigation;
        let navigationBar = <NavigationBar
            title = "房间信息"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => {
                this.props.navigation.goBack()
                Picker.hide()
            })}
        />

        let userSimpleInfos = this.state.userSimpleAllInfos;
        let listData = [...userSimpleInfos]; 
        let newListData = listData.length < this.state.userShowLen ? listData : listData.splice(0,this.state.userShowLen)

        // 群成员
        let userContent = (
            <View style={{backgroundColor: "#fff", marginBottom: 10, borderBottomColor: '#e1e0e5',borderBottomWidth: 1,}}>
                     {
                        newListData ? 
                        <View style={styles.header}>
                            <View style={styles.avatarWrap}>
                                {
                                    newListData.map((item)=> {
                                        return (
                                            <TouchableOpacity 
                                                onPress={() => {
                                                    this.props.navigation.navigate("UserInfoPage", {id: item.id})
                                                }}
                                                style={styles.avatarBox}>
                                                {
                                                    item.headerImg ? 
                                                    <Image 
                                                        resizeMode ='stretch'
                                                        style={styles.avatar} 
                                                        source={{uri: config.imgUrl+item.headerImg }} /> :
                                                    <Image
                                                        resizeMode ='stretch'
                                                        style={styles.avatar}
                                                        source={require('./imgs/def.png')}
                                                    />
                                                }
                                                {
                                                    item.nickName ? 
                                                    <Text style={styles.avatarText}>
                                                            {item.nickName ? (item.nickName.length > 3 ? item.nickName.substr(0, 3) + "..." : item.nickName) : ""}
                                                    </Text> :
                                                    <Text style={styles.avatarText}>昵称</Text>
                                                }
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View> : null
                        }
                       
                        {
                            this.state.userSimpleAllInfos && this.state.userSimpleAllInfos.length > this.state.userShowLen ?
                            <View style={styles.headerText}>
                                <Text 
                                    onPress={() => navigate("MoreUserPage", {userData: this.state.userSimpleAllInfos})}
                                    style={styles.moreText}>查看更多群成员</Text>
                                <Icon name={'privateIcon|arrow-right'} size={11} color={'#c6c5ca'} />
                            </View> : null
                        }
                     </View>
        )

        // 房主
        let hostIsContent = (
            <View>
                <View style={styles.listWrap}>
                    <TouchableOpacity activeOpacity={1}  onPress={() => { 
                        navigate('UploadPicPage', {type: "roomModify", roomId: this.state.roomId, img: this.state.roomAvatar})
                        Picker.hide()
                        }} >
                        <View style={[styles.inputList, {paddingTop: 7,paddingBottom: 7}]}>
                            <Text style={styles.title}>房间头像</Text>
                            <View style={[styles.flexStart]}>
                                <Image style={styles.roomAvatar} 
                                    source={{uri: this.state.roomAvatar}}
                                />
                                <Text style={styles.iconWrap}>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { 
                        navigate("RoomNameModifyPage", {type: "modify", id: this.state.roomId, val: this.state.roomName})
                        Picker.hide()
                    }}>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>房间名称</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.roomName}</Text>
                                <Text style={styles.iconWrap}>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>房号</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.roomNum}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { 
                        navigate("PasswordSetPage", {type: "modify", id: this.state.roomId, val: this.state.roomPwd})
                        Picker.hide()
                    }}>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>房间密码</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.roomPwd}</Text>
                                <Text style={styles.iconWrap}>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>人数上限</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.peopleMax}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>红包池金额比例</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.amountRatio}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputList, styles.borderBottomNo]}>
                            <Text style={styles.title}>房主返利</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.homeownerRebate}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* 房间介绍 */}
                <TouchableOpacity 
                    onPress={() => navigate("RoomDesPage", {type: "modify", val: this.state.roomDes, id: this.state.roomId})} 
                    style={[styles.introWrap, styles.listWrap]}>
                    <Text style={[styles.title, styles.itemTitle]}>房间介绍</Text>
                    <View style={styles.flexBetween}>
                        <Text style={styles.roomInfoText}>
                            {this.state.roomDes}
                        </Text>
                        <Text style={styles.iconWrap}>
                            <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                        </Text>
                    </View>
                </TouchableOpacity>
                {/* 游戏规则 */}
                <View style={[styles.listWrap]}>
                    <Text style={[styles.title, styles.itemTitle]}>游戏规则</Text>
                    <View>
                        <View>  
                            <View style={styles.gameList}>
                                <Text style={styles.title}>底金</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.leastMoney}元</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={ () => {this.pickerFn("num")} }>
                            <View style={styles.gameList}>
                                <Text style={styles.title}>发包个数</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.packCount}个</Text>
                                    <Text style={styles.iconWrap}>
                                        <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => {this.pickerFn("rule")} } style={[styles.gameList, styles.borderBottomNo]}>
                            <Text style={styles.title}>发包规则</Text>
                            <View style={styles.flexStart}>
                                <Text style={styles.value}>{this.state.ruleTypeValue}</Text>
                                <Text style={styles.iconWrap}>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

        // 非房主
        let hostNoContent = (
            <View>
                <View style={[styles.listWrap]}>
                    <View style={[styles.inputList, {paddingTop: 7,paddingBottom: 7}]}>
                        <Text style={styles.title}>房间头像</Text>
                        <View style={[styles.flexStart]}>
                            <Image style={styles.roomAvatar} 
                                source={{uri: this.state.roomAvatar}}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>房间名称</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.roomName}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>房号</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.roomNum}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        this.state.roomPwd ?
                        <View>
                            <View style={[styles.inputList]}>
                                <Text style={styles.title}>房间密码</Text>
                                <View style={[styles.flexStart]}>
                                    <Text style={styles.value}>{this.state.roomPwd}</Text>
                                </View>
                            </View>
                        </View> : null
                    }
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>人数上限</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.peopleMax}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputList]}>
                            <Text style={styles.title}>红包池金额比例</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.amountRatio}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.inputList, styles.borderBottomNo]}>
                            <Text style={styles.title}>房主返利</Text>
                            <View style={[styles.flexStart]}>
                                <Text style={styles.value}>{this.state.homeownerRebate}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                 {/* 房间介绍 */}
                <View style={[styles.introWrap, styles.listWrap]}>
                    <Text style={[styles.title, styles.itemTitle]}>房间介绍</Text>
                    <View style={styles.flexBetween}>
                        <Text style={styles.roomInfoText}>
                            {this.state.roomDes}
                        </Text>
                    </View>
                </View>
                {/* 游戏规则 */}
                <View style={[styles.listWrap]}>
                    <Text style={[styles.title, styles.itemTitle]}>游戏规则</Text>
                    <View>
                        <View>  
                            <View style={styles.gameList}>
                                <Text style={styles.title}>底金</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.leastMoney}元</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={styles.gameList}>
                                <Text style={styles.title}>发包个数</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.packCount}个</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.gameList, styles.borderBottomNo]}>
                            <Text style={styles.title}>发包规则</Text>
                            <View style={styles.flexStart}>
                                <Text style={styles.value}>{this.state.ruleTypeValue}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                 {navigationBar}
                 <ScrollView>
                    {userContent}
                    {
                        this.state.hostIs ? 
                        hostIsContent :
                        hostNoContent
                    }
                    <View style={[styles.listWrap, {marginBottom: windowHeight * 0.1}]}>
                        {/* <TouchableOpacity onPress={this.shareFn} >
                            <View style={styles.gameList}>
                                <Text style={styles.title}>房间分享</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>房间分享</Text>
                                    <Text style={styles.iconWrap}>
                                        <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={this.recordFn} >
                            <View style={[styles.gameList]}>
                                <Text style={styles.title}>房间记录</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>详情</Text>
                                    <Text style={styles.iconWrap}>
                                        <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        {/* <View style={styles.gameList}>
                            <Text style={styles.title}>消息免打扰</Text>
                            <Switch
                                // onValueChange={(value) => this.setState({switchIsOn: value})}
                                onValueChange={(value) => this.controlSoundFn(value)}
                                style={{marginBottom:10,marginTop:10}}
                                trackColor='#4bd763'  //开关打开时的背景颜色
                                tintColor='#eaeaea' //关闭时背景颜色
                                value={this.state.switchIsOn} />
                        </View> */}
                    </View>
                </ScrollView>
                <Loading isShow={this.state.isFetching}/>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    flexBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    borderBottomNo: {
        borderBottomWidth: 0
    },
    marginRightNo: {
        marginRight: 0
    },
    header: {
        backgroundColor: '#fff',
        paddingBottom: 20
    },
    headerText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        width: 110,
        marginLeft: (windowWidth - 110) / 2,
    },
    moreText: {
        fontSize: 14,
        color: "#808080",
        marginRight: 5,
    },
    avatarWrap: {
        flexDirection:'row',
        flexWrap:'wrap',
        paddingLeft: 4,
        paddingRight: 4,
    },
    avatarBox: {
        marginTop: 16
    },
    avatar: {
        width: 46,
        height: 46,
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 5
    },
    avatarText: {
        textAlign: 'center',
        fontSize: 11,
        color: '#454545',
    },  
    listWrap: {
        backgroundColor: '#fff',
        borderTopColor: '#e1e0e5',  
        borderTopWidth: 1,
        borderBottomColor: '#e1e0e5',
        borderBottomWidth: 1,
        marginBottom: 10, 
        paddingLeft: 15
    },
    roomAvatar: {
        width: 67,
        height: 67
    },
    inputList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15
    },
    gameList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 10
    },
    title: {
        fontSize: 16,
        color: '#1a1a1a'
    },
    itemTitle: {
        paddingTop: 7,
        paddingBottom: 4
    },
    iconWrap: {
        marginLeft: 8
    },
    value: {
        fontSize: 15,
        color: '#a6a6a6'
    },
    roomInfoText: {
        width: windowWidth - 30 - 60,
        fontSize: 15,
        color: '#a6a6a6'
    },
    ruleList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    introWrap: {
        paddingRight: 15,
        paddingBottom: 20,
    },
    buttonStyle:{
        margin:20,
        backgroundColor:'#09bd04',
        borderColor:'red',
        borderRadius:5,
        borderWidth:0,
    },
    textStyle:{
        color:'#fff',
        fontSize: 18,
    },
})