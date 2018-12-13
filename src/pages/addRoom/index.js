import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ScrollView,
    DeviceEventEmitter,
    AsyncStorage,
    Alert
} from 'react-native'
import Picker from 'react-native-picker'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Button from '../../components/Button'
import Loading from '../../common/loading/index'
import { addRoomSocket, getRoomCarInitDataSocket } from '../../request/api/socket'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import config from '../../request/config'
import SyncStorage from '../../util/syncStorage';
import { getArr } from "../../util/tool";
import { Icon } from '../../components/icon'

const windowWidth = Dimensions.get('window').width;
const windowH = Dimensions.get('window').height;
let numInit = null

export default class AddRoomPage extends Component {
    constructor(props) {
        super(props)
 
        this.state = {
            isFetching: false,  // 是否在请求接口
            roomAvatar: "",  //  房间头像 - 提交用的
            roomAvatarBase64: config.defaultRoomAvatarBase64,  // base64 展示用的图片
            roomLogoHas: false,
            priceList: [],  // 底金
            numList: [],    // 红包个数
            ruleList: [],   // 发包规则
            checkedPrice: '',   // 选中的底金
            checkedNum: '',     // 选中的红包个数
            checkedRule: '',    // 选中的发包规则
            checkedRuleNum: null,  // 选中的发包规则对应的数据库中的数字
            roomCard: null,   // 创建房间用的房卡的ID
            roomIntro: "", // 房间介绍
            systemCharges: "",  // 系统佣金
            packRuleOptions: [],  // 发包规则
            level: 0,   // 房卡级别
            hasPwd: true,  // 密码是否为空
            messageList: [
                {message: '5'},
            ],
            roomBasicData: [
                {
                    title: '名称',
                    value: '',
                    click: true,
                    url: 'RoomNameModifyPage'
                },
                {
                    title: '房间密码',
                    value: '',
                    click: true,
                    url: 'PasswordSetPage'
                },
                {
                    title: '人数上限',
                    value: '30',
                    click: false,
                    url: ''
                },
                {
                    title: '红包池金额比例',
                    value: '5%',
                    click: false,
                    url: ''
                },
                {
                    title: '房主返利',
                    value: '2.5%',
                    click: false,
                    url: ''
                },
            ], 
            amountRatio: "",        // 红包池金额比例 处理成加百分号的
            homeownerRebate: "",    // 房主返利 处理成加百分号的
        }
    }
   
    componentDidMount(){
        this._getRoomCarInitDataApi({
            id: this.props.navigation.state.params.detailId
        })
        this.setState({
            roomCard: this.props.navigation.state.params.id
        })
        
        console.warn('id', this.props.navigation.state.params.detailId)

        // 获取子级传过来的数据
        DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
            let dataInit = this.state.roomBasicData;
            let newData = [...dataInit];    

            if(dic.roomName) {
                newData[0].value = dic.roomName
                newData[1].value = SyncStorage.getItem('password')
                this.state.roomIntro = SyncStorage.getItem('roomDes')
                this.setState({roomBasicData: newData});
            } else 
            if(dic.password || dic.password === "") {
                newData[1].value = dic.password
                newData[0].value = SyncStorage.getItem('roomName')
                this.state.roomIntro = SyncStorage.getItem('roomDes')
                this.setState({roomBasicData: newData});
            }  else 
            if(dic.roomDes) {
                newData[0].value = SyncStorage.getItem('roomName')
                newData[1].value = SyncStorage.getItem('password')
                this.setState({
                    roomBasicData: newData,
                    roomIntro: dic.roomDes
                });
            }  else 
            if(dic.avatar) {
                let imgInit = this.state.images
                let newData = [...imgInit]

                newData = dic.avatar
                this.setState({images: newData});
            } else 
            if(dic.roomImg) {
                console.warn('roomImg', dic.imgBase64)
                this.setState({
                    roomAvatar: dic.roomImg,
                    roomLogoHas: true,
                    roomAvatarBase64: dic.imgBase64
                })
            }    
       });
  }

    backFn() {
        this._clearSync()
        this.props.navigation.goBack()
        Picker.hide()
    }

    // 清空缓存的用户名、密码
    _clearSync() {
        AsyncStorage.removeItem('roomName')
        AsyncStorage.removeItem('password')
        AsyncStorage.removeItem('roomDes')
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
                if(numInit === 0) {
                    _This.setState({
                        checkedPrice: data
                    })
                } else 
                if(numInit === 1) {
                    _This.setState({
                        checkedNum: data
                    })
                }  else 
                if(numInit === 2) {
                    _This.setState({
                        checkedRule: data
                    })
                    _This.state.packRuleOptions.forEach(item => {
                        if(item.itemKey == data) {
                            _This.state.checkedRuleNum = item.itemValue
                        }
                    })
                } 
            },
            onPickerSelect: data => {}
        })
    }

    // 获取房间初始数据
    _getRoomCarInitDataApi(data) {
        let _This = this
        // this.setState({
        //     isFetching: true
        // })
        getRoomCarInitDataSocket(data)
        .then(res => {
            console.warn('res', JSON.stringify(res))
            // this.setState({
            //     isFetching: false
            // })
            let data = res

            let dataInit = this.state.roomBasicData;
            let newData = [...dataInit];    

            newData[0].value = data.roomName
            newData[1].value = data.roomPwd  
            newData[2].value = data.membersNumber  
            newData[3].value = (parseFloat(data.systemCharges) + parseFloat(data.ownerCharges)) * 100 + "%"
            newData[4].value = data.ownerCharges * 100 + "%"

            _This.setState({
                roomBasicData: newData,
                systemCharges: data.systemCharges,
                level: data.levelType,
                roomIntro: data.intro,
                amountRatio: parseFloat(data.systemCharges) + parseFloat(data.ownerCharges),
                homeownerRebate: data.ownerCharges
            });

            SyncStorage.setItem('roomName', data.roomName)
            SyncStorage.setItem('password', data.roomPwd)
            SyncStorage.setItem('roomDes', data.intro)

            // 底金
            let priceListdataInit = this.state.priceList;
            let newPriceListData = [...priceListdataInit]; 
            newPriceListData = getArr(data.leastMoneyMin, data.leastMoneyMax, data.leastMoneyStep)
            _This.setState({
                priceList: newPriceListData,
                checkedPrice: newPriceListData[0].message,
            });

            // 发包个数
            let numListdataInit = this.state.numList;
            let newNumListData = [...numListdataInit]; 
            newNumListData = getArr(data.packCountMin, data.packCountMax, data.packCountStep)
            _This.setState({
                numList: newNumListData,
                checkedNum: newNumListData[0].message
            });

            // 发包规则
            let ruleListdataInit = this.state.ruleList;
            let newRuleListData = [...ruleListdataInit]; 

            let arr = new Array()
            data.packRuleOptions.forEach(item => {
                arr.push({message: item.itemKey})
            })
            newRuleListData = arr
            _This.setState({
                ruleList: newRuleListData,
                checkedRule: newRuleListData[0].message,
                packRuleOptions: data.packRuleOptions,
                checkedRuleNum: data.packRuleOptions[0].itemValue
            });
        })
        .catch(err => {
            // this.setState({
            //     isFetching: false
            // })
            console.warn(err)
        })
    }

 
    // 提交数据
    submitFn = ()=> { 
        let pwd = this.state.roomBasicData[1].value

        if(pwd === "") {
            this.setState({
                hasPwd: false
            })
        } else {
            this.setState({
                hasPwd: true
            })
        }

        let data = {
            "dragonRule": {  // 接龙规则
                "leastMoney": parseInt(this.state.checkedPrice),  // 底金 ,
                "ownerCharges": this.state.homeownerRebate,     // 房主佣金,
                "packCount": parseInt(this.state.checkedNum),       // 红包个数,
                "packStrategy": parseInt(this.state.checkedRuleNum),   // 发包规则 ,
                "systemCharges": this.state.systemCharges         // 系统佣金
            },
            "intro": this.state.roomIntro,    // 简介
            "levelType": this.state.level,    // 级别
            "roomName": this.state.roomBasicData[0].value,   // 房间名 ,
            "roomPwd": pwd,      // 房间密码 ,
            "ruleType": 0,  // 规则类型 0 接龙 1 踩雷
            "totalUser": this.state.roomBasicData[2].value,       // 总人数
            "hasPwd": this.state.hasPwd,     // 密码是否为空
            "roomLogo": this.state.roomAvatar,
            "roomCard": this.state.roomCard
        }

        this._addRoom(data)
    }

    _addRoom(data) {
        let _This = this
        this.setState({
            isFetching: true
        })
		addRoomSocket(data)
			.then(res => {
                Alert.alert(
                    '提示', 
                    '新增成功!',
                    [
                        {text: '确定', onPress: () => { 
                            DeviceEventEmitter.emit('ChangeUI', { addRoom: true});
                            _This.backFn()
                        }}
                    ]
                )
                this.setState({
                    isFetching: false
                })
            })
            .catch(err => {
                this.setState({
                    isFetching: false
                })
                console.warn(JSON.stringify(err))
            })
	}

    // 选择 底金、发包个数、发包规则
    pickerFn(state) {
        let dataInit = this.state.messageList;
        let newData = [...dataInit];  
        let _This = this  

        if(state === 'price') {
            newData = this.state.priceList
            numInit = 0
            this.setState({
                messageList: newData
            }, ()=> {
                _This.PickerInit()
                Picker.show();
            })
            return false
        }
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

    _renderItem(data) {
        const { navigate } = this.props.navigation;
        let item = data.item
        return (
            <View>
                {
                    item.click ? 
                    <TouchableOpacity onPress={() => { navigate(item.url, {type: "add", val: item.value})}}>
                        <View style={styles.inputList}>
                            <Text style={styles.title}>{item.title}</Text>
                            <View style={styles.flexStart}>
                                <Text style={styles.value}>{item.value}</Text>
                                <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                            </View>
                        </View>
                    </TouchableOpacity> : 
                     <View style={styles.inputList}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.flexStart}>
                            <Text style={styles.value}>{item.value}</Text>
                            <Icon name={'privateIcon|suo-checked'} size={11} color={'#a6a6a6'} />
                        </View>
                    </View>
                }
            </View>
        )
    }

    render() {
        const { navigate } = this.props.navigation;
        let rightButton = <TouchableOpacity
                                onPress={() => this.addRoomFn()}>
                            <View style={{margin: 10}}>
                                <Icon name={'privateIcon|gengduo'} size={24} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
            title = "创建房间"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.backFn())}
            rightButton={rightButton}
        />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                 {navigationBar}
                 <ScrollView>
                    <View style={styles.listWrap}>
                        <TouchableOpacity  onPress={() => { navigate('UploadPicPage', {type: "roomAdd", img: this.state.roomAvatarBase64})}} >
                            <View style={[styles.inputList, {paddingTop: 7,paddingBottom: 7}]}>
                                <Text style={styles.title}>房间头像</Text>
                                <View style={styles.flexStart}>
                                    <Image style={styles.roomAvatar} 
                                            source={{uri: this.state.roomAvatarBase64}}
                                        />
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <FlatList
                            data={this.state.roomBasicData}
                            renderItem={(data) => this._renderItem(data)}
                        />
                    </View>
                
                    <TouchableOpacity onPress={() => navigate("RoomDesPage", {type: "add"})} style={styles.introWrap}>
                        <Text style={[styles.title, styles.itemTitle]}>房间介绍</Text>
                        <View style={styles.flexBetween}>
                            <Text style={styles.roomInfoText}>
                                {this.state.roomIntro}
                            </Text>
                            <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                        </View>
                    </TouchableOpacity>
                
                    <View style={styles.ruleWrap}>
                        <Text style={[styles.title, styles.itemTitle]}>游戏规则</Text>
                        <TouchableOpacity onPress={ () => {this.pickerFn("price")} }>
                            <View style={styles.gameList}>
                                <Text style={styles.title}>底金</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.checkedPrice}元</Text>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => {this.pickerFn("num")} }>
                            <View style={styles.gameList}>
                                <Text style={styles.title}>发包个数</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.checkedNum}个</Text>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => {this.pickerFn("rule")} }>
                            <View style={styles.gameList}>
                                <Text style={styles.title}>发包规则</Text>
                                <View style={styles.flexStart}>
                                    <Text style={styles.value}>{this.state.checkedRule}</Text>
                                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#a6a6a6'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Button
                        text='确定'
                        enable={true}
                        textStyle={styles.textStyle}
                        buttonStyle={styles.buttonStyle}
                        onPress={this.submitFn}
                    />
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
    listWrap: {
        paddingLeft: 15,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    roomAvatar: {
        width: 67,
        height: 67,
        marginRight: 8
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
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 15
    },
    title: {
        fontSize: 16,
        color: '#1a1a1a'
    },
    itemTitle: {
        paddingTop: 7,
        paddingBottom: 4
    },
    value: {
        fontSize: 15,
        color: '#a6a6a6',
        marginRight: 8
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
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingBottom: 20
    },
    ruleWrap: {
        paddingLeft: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
        paddingBottom: 10
    },
    buttonStyle:{
        margin:20,
        backgroundColor:'#09bd04',
        borderColor:'red',
        borderRadius:5,
        borderWidth:0,
        marginBottom: windowH * 0.1
    },
    textStyle:{
        color:'#fff',
        fontSize: 18,
    }
})
