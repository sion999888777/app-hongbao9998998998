import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    Dimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native'
import SafeAreaViewPlus from '../ios-private/SafeAreaViewPlus'
 
import { Icon } from '../../components/icon'
import Dialog from '../Dialog/index'

import { 
    publicRoomSearchSocket, 
    privateRoomSearchSocket,
    entranceRoom
} from '../../request/api/socket'
import config from '../../request/config'

const windowWidth = Dimensions.get('window').width;
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;

export default class SearchPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: null,    // 1: 大厅包间   2: 红包包间
            searchText: "",
            dataNo: false,
            listData: [],
            dataNum: null,
            searchTextNo: false,   // 如果输入框中没有内容,则提示  搜索指定内容
            pwd: '',
            pwdError: '',
            pageSize: 12,   // 每页条数
            searchEnd: false
        }
    }
    componentDidMount() {
        this.setState({
            type: this.props.navigation.state.params.type
        })
    }
    backFn = ()=> {
        this.props.navigation.goBack()
    }
    searchFn(searchText) {
        if(searchText === "") {
            this.setState({
                searchText: searchText,
                searchTextNo: true
            })
        } else {
            this.setState({
                searchText: searchText,
                searchTextNo: false
            })
        }
     
        let data = {
            page: 1,
            pageSize: this.state.pageSize,
            keyword: searchText
        }


        if(this.state.type === 1){
            this._publicRoomDataFn(data)
        } else 
        if(this.state.type === 2){
            this._privateRoomSearchSocket(data)
        }
    }
    // 搜索大厅列表数据
    _publicRoomDataFn(data) {
        publicRoomSearchSocket(data)
            .then(res => {
                if(res.list && res.list.length > 0) {
                    this.setState({
                        listData: res.list,
                        dataNo: false,
                        dataNum: res.list.length > 0 ?  res.list.length : 0
                    })
                } else {
                    this.setState({
                        listData: res.list,
                        dataNo: true
                    })
                }
                this.setState({
                    searchEnd: true
                })
            })
            .catch(err => {
                console.warn(JSON.stringify(err))
            })
    }

    // 搜索包间列表数据
    _privateRoomSearchSocket(data){
        privateRoomSearchSocket(data)
        .then(res => {
            if(res.list && res.list.length > 0) {
                this.setState({
                    listData: res.list,
                    dataNo: false,
                    dataNum: res.list.length > 0 ?  res.list.length : 0
                })
            } else {
                this.setState({
                    listData: res.list,
                    dataNo: true
                })
            }
        })
        .catch(err => {
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

    // 进入房间
	_entranceRoom() {
		let data = {
			roomId: this.state.item.id,
			roomPwd: this.state.item.roomPwd
		}
		
		this.refs.dialog.hide()

		entranceRoom(data)
			.then(res => {
				const {navigate} = this.props.navigation
				
				navigate('RoomDetailPage', {item: this.state.item})
			})
			.catch(err => {
				Alert.alert(
					'提示', 
					err,
					[
						{text: '确定', onPress: () => { console.warn('确定')}}
					]
				)
			})
    }
    
    // 进入房间输入密码 确定按钮
	_dialogSubmitFn = () => {
		console.warn('this.state.item.roomPwd--->', this.state.item.roomPwd)
		if(this.state.pwd === this.state.item.roomPwd) {
			this._entranceRoom()
		} else {
			this.setState({pwdError: '密码错误'})
		}
	}

    // 有密码的详情
	detailFn(item) {
        console.warn('item=', item)
		this.setState({
			item
		}, () => {
			// 判断用户账户 余额
			if (item.roomPwd && item.isHouseOwner === '0') {
				this.setState({pwdError: '', pwd: ''})
				this.refs.dialog.show()
				return false
			} else if (item.isHouseOwner === '1' || !item.roomPwd) {
				this._entranceRoom()
			}
		})
  	}

    _renderItem(data) {
        let item = data.item
        return (
            <TouchableOpacity onPress={ () => { this.detailFn(item) }}>
                <View style={styles.content}>
                    <View style={styles.listWrap}>
                        {
                            item.roomLogo ?
                            <Image
                                resizeMode ='stretch'
                                style={styles.roomAvatar}
                                source={{uri: config.imgUrl+item.roomLogo}}
                            /> :
                            <Image
                                resizeMode ='stretch'
                                style={styles.roomAvatar}
                                source={require('./imgs/head.png')}
                            />
                        }
                        <View style={styles.listR}>
                            <View style={[styles.spaceBetween, {marginTop: 3}]}>
                                <Text style={styles.roomName}>{item.roomName}</Text>
                                <View style={styles.alignItemsCenter}>
                                    {	// 金币场和人民币场
										item.roomGaming === "1" && item.currencyType === '1'?
										<Icon name={'privateIcon|hongbao'} size={12} color={'#a9a9a9'}/> :
										item.roomGaming === "0" && item.currencyType === '1'?
										<Icon name={'privateIcon|hongbao'} size={12} color={'#fc5f4e'}/> :
										item.roomGaming === "1" && item.currencyType === '0'?
										<Icon name={'privateIcon|jinbi'} size={12} color={'#a9a9a9'}/> :
										item.roomGaming === "0" && item.currencyType === '0'?
										<Icon name={'privateIcon|hongbao'} size={12} color={'#fc5f4e'}/> : null
									}
									<Text style={styles.roomNum}>房: {item.roomNo}</Text>
                                </View>
                            </View>
                            
                            <View style={styles.spaceBetween}>
                                <Text style={[styles.roomRules]}>
                                    {item.intro ? (item.intro.length > 15 ? item.intro.substr(0, 15) + "..." : item.intro) : ""}
                                </Text>
                                <Text style={styles.peopleNum}>{`${item.roomOnlineNumbers}/${item.totalUser}`}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let statusBar = <View>
                <StatusBar  backgroundColor="#efeff4" barStyle="dark-content" />
            </View>
      
        let dialogContent = <View style={{alignItems: 'center'}}>
                <TextInput
                    maxLength={6}
                    ref="pwdInput"
                    placeholder="请输入密码"
                    onChangeText={(pwd) => this.setState({pwd, pwdError: false})}
                    value={this.state.pwd}
                    style={{width: '80%',height:35, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}}
                    />
                    
                    <Text style={styles.errText}>{this.state.pwdError}</Text>
        </View>

        return (
            <SafeAreaViewPlus  
                topColor={'#fff'}
                bottomInset={false}>
                <View style={styles.container}>
                    <View style={styles.headerWrap}>
                        {statusBar}
                        <View style={styles.headerContainer}>
                            <View style={styles.inputWrap}>
                                <View style={styles.flexStart}>
                                    <Text>
                                        <Icon name={'privateIcon|search'} size={12} color={'#a9a9a9'} />
                                    </Text>
                                    <TextInput 
                                        style={styles.input}
                                        onChangeText={searchText => { this.searchFn(searchText) }}
                                        value={this.state.searchText}
                                        autoFocus = {true}
                                    />
                                </View>
                                <Text onPress={() => {this.setState({searchText: ""})}}>
                                {
                                    this.state.searchText.length > 0 ?
                                        <Icon name={'privateIcon|clear'} size={12} color={'#a9a9a9'} /> :
                                        null
                                }
                                
                                </Text>
                            </View>
                            <Text style={styles.cancelText} onPress={ () => this.props.navigation.goBack() }>取消</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        {
                            this.state.searchTextNo ? 
                            <Text style={styles.resultNo}>请搜索指定内容</Text> :
                            (
                                this.state.dataNo ? 
                                <View>
                                    <Text style={styles.resultNo}>找不到相关搜索结果</Text>
                                </View> :
                                <ScrollView>
                                    {
                                        this.state.searchEnd ?
                                        <View style={styles.title}>
                                            <Text style={styles.titleText}>
                                                <Text>共找到</Text>
                                                <Text>结果</Text>
                                                <Text> {this.state.dataNum} </Text>
                                                <Text>个</Text>
                                            </Text>
                                        </View> : null
                                    }
                                    
                                    {/* <FlatList
                                        data={this.state.listData}
                                        renderItem={(data) => this._renderItem(data)}
                                    /> */}
        
                                    <FlatList
                                        data={this.state.listData}
                                        renderItem={(data) => this._renderItem(data)}
                                    />
        
        
                                </ScrollView>
                            )
                        }
                    </View>
	                <Dialog
		                title = "请输入密码!"
		                cancelText = "返回"
		                ref="dialog"
		                confirmCallBack = {this._dialogSubmitFn}
		                content = {dialogContent}
	                />
                </View>
         </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,  
    },
    resultNo: {
        width: windowWidth,
        textAlign: 'center',
        backgroundColor: '#fff',
        paddingTop: 37,
        paddingBottom: 37,
        borderBottomColor: '#ececec',
        borderBottomWidth: 1,
        fontSize: 14,
        color: '#a9a9a9'
    },
    flexStart: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        backgroundColor: '#efeff4',
        width: windowWidth,
        paddingLeft: 7,
        paddingRight: 9,
        borderBottomColor: '#ececec',
        borderBottomWidth: 1
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 3,
        width: windowWidth - 50,
        height: 32,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
       backgroundColor: '#fff',
       width: windowWidth - 50 - 50,
       paddingTop: 6,
       paddingBottom: 6
    },
    cancelText: {
        fontSize: 15,
        color: '#06bf04'
    },
    content: {
        width: windowWidth,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 16,
        backgroundColor: '#fff'
    },
    title: {
        paddingLeft: 15,
        paddingBottom: 5,
        marginTop: 16
    },
    titleText: {
        fontSize: 13,
        color: '#a9a9a9'
    },
    listWrap: {
        borderBottomWidth: 1,
        borderBottomColor: '#e9e9e9',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 8,
        paddingBottom: 8
    },
    roomAvatar: {
        width: 44,
        height: 44,
        marginRight: 10
    },
  errText: {
    color: "red",
    fontSize: 12,
    width: '80%',
    paddingTop: 5,
    paddingBottom: 5,
    overflow: 'hidden'
  },
    listR: {
        width: windowWidth - 30 - 44 - 10
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roomName: {
        fontSize: 15,
        color: '#1a1a1a'
    },
    alignItemsCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomNum: {
        fontSize: 13,
        color: '#333333',
        marginLeft: 5
    },
    roomRules: {
        fontSize: 12,
        color: '#a9a9a9',
        maxWidth: 250
    },
    peopleNum: {
        fontSize: 12,
        color: '#a9a9a9',
        textAlign:'center',
        width: 60
    },
    footerText: {
		textAlign: 'center',
		width: (windowWidth - 100) / 2 - 0.5,
		fontSize: 14
	}
})