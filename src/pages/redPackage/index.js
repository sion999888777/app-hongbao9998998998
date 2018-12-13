import React, { Component } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Dimensions,
	BackHandler,
	Platform,
	Image,
	AsyncStorage,
	ImageBackground,
	DeviceInfo,
	Modal,
	Alert
} from 'react-native'
import Picker from 'react-native-picker'
import Toast from 'react-native-easy-toast'
import Sound from 'react-native-sound'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import RedPckModal from '../../components/redPckModal/RedPckModal'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import MarqueeText from '../../common/marquee'
import { Icon } from '../../components/icon'
import Dialog from '../../common/Dialog/index'
import RoomMessageItem from './renderItem'

import ChatInputBar from '../../common/emoji/chatInputBar'

const { width, height } = Dimensions.get('window')

// 加载音频文件
const redcoming = require('./wav/redcoming.wav')
const replymessage = require('./wav/replymessage.wav')
const redpckAudio = new Sound(redcoming, (err) => {})
const replyAudio = new Sound(replymessage, (err) => {})
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const footer_height = 45
const marquee_height = 32

import {
	getPacket,
	openPacket,
	initRoomDetail,
	sendSysMsg,
	exitRoom,
	getPacketDetail,
	sendChatEmoji,
	canExitRoom
} from '../../request/api/socket'
import ws from '../../request/socket'

export default class RoomDetailPage extends Component {
  constructor(props) {
    super(props)
	  
    this.state = {
    	listData: [],
			message: '',
			chatMsg: '', // 表情
			roomId: null,  // 房间ID,
			marqueeMessage: '',
			userId: '',
			roomOnlineNumbers: 0,
	    roomName: '',
			fixedContentConfigs: [],
			modalVisible: true,
			packId: '', // 红包ID,
			packetInfo: {
				title: '',
				avatar: '',
				nickname: ''
			},
	    iconColor: '#909090',
	    errData: {} // 抢红包出错
    }
    
    // 1 加入房间的消息
	  // 2 发出红包的消息
		// 3 点开红包的消息
		this.params = this.props.navigation.state.params
		this.gameRule = {}
	  this.backHandler = null
	}
	
	componentWillUnmount() {
		this.setState({
			modalVisible: false
		})
		
		Picker.hide()
		
		// this.backHandler.remove()
	}
	
  componentDidMount() {
  	this.setState({roomName: this.params.item.roomName})
  	
		this.initRoomDetail()
		// 接收房间系统消息
		ws.capture(356, (data) => {
		
			if (data.body.status === 200) {
				let result = data.body.result
				this._processingMessages(result)
			} else {
				Alert.alert(
					'提示', 
					data.body.msg,
					[
						{text: '确定', onPress: () => { this.props.navigation.goBack() }}
					],
					{ cancelable: false }
				)
			}
		})
	  
	  //如果当前是Android系统，则添加back键按下事件监听
	  
	  this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
//		  this.onBack()
		  this._exitRoom()
		  return true
	  })
  }
	
	// 初始化房间信息
	initRoomDetail() {
		let roomId = this.params.item.id;

		this.setState({roomId})

		// 初始化房间信息
		initRoomDetail()
			.then(res => {
				this.setState({
					marqueeMessage: res.roomRuleDesc,
					userId: res.userSimpleInfo.id,
					fixedContentConfigs: res.fixedContentConfigs
				})
				this.gameRule = res.gameRule
			})
			.catch(err => {
				console.log(err)
			})
	}

	// 处理系统返回消息
	_processingMessages = (item) => {

		if (!['J', 'C', 'M', 'E', 'G',12323, 12324, 12325, 12304, 12305, 12311, 12312, 12310].find(v => v == item.type)) return false
		
		// 红包语音
		if ([12323, 12324].indexOf(item.type) > -1) {
			this._playAudio('redpack')
		} else {
			this._playAudio('reply')
		}
		
		// 更新房间规则
		if (item.type === 'G') {
			this.setState({
				marqueeMessage: item.initRoomSuccess.roomRuleDesc,
				roomName: item.initRoomSuccess.roomName
			})
			this.gameRule = item.initRoomSuccess.gameRule
		}
		
		// 轮到自己发红包 按钮变色
		if (item.type === 12304) {
			this.setState({
				iconColor: '#d95940'
			})
		} else if ([12305, 12311, 12312, 12310, 12323, 12324].indexOf(item.type) > -1) {
			this.setState({
				iconColor: '#909090'
			})
		}
		
		let list = [...this.state.listData, item]
		
		this.setState({
			listData: list,
			roomOnlineNumbers: item.roomOnlineNumbers || this.state.roomOnlineNumbers
		})
		
		this._scrollToEnd()
	}
	
	// 点击红包回调
	_getPacket = (item) => {
		// 如果是自己查看自己发的红包
		if (item.userId === this.state.userId) {
			this._redpckDetail(item.packId, 2) // 1表示 显示抢得金额 // 2不显示
		} else {
			getPacket({roomId: item.roomId, packId: item.packId})
				.then(res => {
					let packId = res.packId
					
					if (res.type === 12289) { // 如果已经抢过了 直接跳转到详情页面
						this._redpckDetail(packId)
					} else {
						
						// 显示开红包页面
						this.refs.redPckModal && this.refs.redPckModal.show()
						
						this.setState({
							packId,
							packetInfo: {
								title: res.title,
								avatar: item.avatar,
								nickname: res.packSenderNickName
							},
							errData: {}
						})
					}
				})
				.catch(err => {
					// 显示红包页面 可以查看大家手气
					this.refs.redPckModal.show()
					const errData = {
						err,
						packId: item.packId
					}
					// 找出过期的红包
//					let list = this.state.listData.map(group => {
//						if (group.packId === item.packId) {
//							group.packetState = false
//						}
//						return item
//					})
					this.setState({errData, packetInfo: {}})
				})
		}
	}
	
	onBack = async () => {
		Picker && Picker.hide()
		// 先查询玩家有没有在游戏中, 没有在游戏中直接退出, 在游戏弹框确认后退出
		/*
		canExitRoom()
			.then((res) => {
				console.warn('res--->', res)
				exitRoom()
				this.props.navigation.goBack()
			})
			.catch((err) => {
				console.warn('退出异常警告', err)
				this.refs.dialog.showFn()
			})
			*/
		
		this.refs.dialog && this.refs.dialog.show()
	}

	// 滚动到底部
	_scrollToEnd = () => {
		setTimeout(() => {
			if (this.refs._flatList) {
				this.refs._flatList.scrollToEnd()
			}
		}, 20)
	}

	// 点击出现表情框
	_onBtnPress = () => {
		this.refs.chatInputBar.openInputBar()
	}
	
	// 接收表情 并发送
	_onSendMsg = (text) => {
		sendChatEmoji({emoji: text})
  }

	// 退出房间回调
	_exitRoom = () => {
		let data = {
			roomId: this.params.item.id
		}
		if (this.params.item.id) {
			exitRoom(data)
		}
		
		this.props.navigation.pop()
	}

	// 开红包
	openPacket = () => {
		let {packId, roomId} = this.state
		if (!packId) { return }
		this.refs.redPckModal.hide()
		
		openPacket({packId, roomId})
			.then(res => {
				this.setState({
					modalVisible: false
				})
				this.props.navigation.navigate('RedPackageDetailPage', res)
//				this._redpckDetail(packId)
			})
			.catch(err => this.refs.toast.show(err))
	}

	// 红包详情
	_redpckDetail = (packId) => {
		this.refs.redPckModal.hide()
		if (!packId) {
			return false
		}
		
		getPacketDetail({packId})
			.then(res => {
				this.props.navigation.navigate('RedPackageDetailPage', {...res})
			})
			.catch(err => this.refs.toast.show(err))
	}

	// 发红包 按钮
	_sendPck = () => {
		const { navigate } = this.props.navigation
		let roomId = this.params.item.id;
		
		this.setState({roomId})
		navigate('SendPackagePage', {...this.gameRule, roomId: this.state.roomId})
	}
	
	// 查看其它用户信息
	_lookOtherUser = (item) => {
		const { navigate } = this.props.navigation
		
		navigate('UserInfoPage', {id: item.id})
	}
	
	// 播放音频
	_playAudio = async (type) => {
	  let playAudio = await AsyncStorage.getItem('playAudio').then()

		if (playAudio === 'yes') return false
		
		let audio = null
		if (type === 'redpack') {
			audio = redpckAudio
		} else if (type === 'reply') {
			audio = replyAudio
		}
		
		audio.stop(() => audio.play((success) => {
			if (!success) {
				audio.reset()
			}
		}))
	}

  render() {
		const { navigate } = this.props.navigation
		// 初始化底部 聊天信息
		this.state.fixedContentConfigs.length > 0 ?
	  Picker.init({
			pickerData: this.state.fixedContentConfigs.map(item => item.fixedContent),
		  pickerConfirmBtnText: '确定',
		  pickerCancelBtnText: '取消',
		  pickerTitleText: '',
		  pickerBg: [255,255,255, 0.9],
		  pickerConfirmBtnColor: [27, 127, 25, 1],
		  pickerCancelBtnColor: [102,102,102,1],
		  pickerTextEllipsisLen: 20,
		  selectedValue: [],
		  onPickerConfirm: msg => {
				let message = msg[0]
				sendSysMsg(message)
					.then(res => {})
					.catch(err => {console.warn(err)})
		  },

		  onPickerSelect: data => {
			  // console.warn(data);
		  }
	  }) : null
	  
    let rightBtn = <TouchableOpacity onPress={() => {
    	    navigate('RoomMoreInfoPage', {roomId: this.state.roomId})
	        Picker.hide()
      }}>
						<View style={{margin: 10}}>
							<Icon name={'privateIcon|xiangqing'} size={14} color={'#fff'} />
						</View>
          </TouchableOpacity>
	  
			
		const dialogContent = <View style={{ alignItems: 'center', justifyContent: 'center'}}>
				<Text style={{width: 200, textAlign: 'center'}}>您确定要退出房间吗?</Text>
		</View>

    return (
		<SafeAreaViewPlus  
			topColor={'#212025'}
			bottomInset={false}>
      <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
        <NavigationBar
          title={`${this.state.roomName}(${ this.state.roomOnlineNumbers }/ ${ this.params.item.totalUser })`}
          statusBar={{backgroundColor: '#2196F3'}}
          leftButton={WidgetView.getLeftButton(() => this.onBack())}
          rightButton={rightBtn}
        />
	
	      <MarqueeText
		      text={this.state.marqueeMessage}
		      speed={0.4}
		      style={styles.marquee}
		      textStyle={styles.marqueeText}
	      />
				
		{/* <View style={{marginTop: 5, paddingRight:5, paddingLeft:5, height: height - 155}}> */}
		<View style={styles.hallContent}>
	        {/*<ScrollView>*/}
						
							<FlatList
								ref='_flatList'
								data={this.state.listData}
								itemStyle={{textAlign: 'center', width: 400}}
								keyExtractor={(item, index) => index}
								renderItem={ (data) => <RoomMessageItem
									lookOtherUser = { this._lookOtherUser }
									redpckDetail = { this._redpckDetail }
									userId={ this.state.userId }
									data={data}
									chai={ this._getPacket }/> }

								onEndReachedThreshold={0}
							/>
						
	        {/*</ScrollView>*/}
        </View>

				{/* 底部输入框 */}
				<View style={styles.textContainer}>
            <TouchableOpacity
              onPress={ this._onBtnPress }>
              <Image style={styles.emojiStyle} source={require('./imgs/ic_emoji.png')}/>
            </TouchableOpacity>

						<TouchableOpacity style={styles.inputBox} onPress={() => {
								Picker.show()
							}}>
							<Text style={[styles.inputStyle, {color: '#bababf'}]}>{'说点什么'}</Text>
						</TouchableOpacity>
					
					
						<TouchableOpacity onPress={ this._sendPck }>
							<Icon name={'privateIcon|fasong'} size={28} color={this.state.iconColor} />
						</TouchableOpacity>
          </View>
	      
				{/* 弹框 */}
				<Toast ref="toast" fadeInDuration={200} fadeOutDuration={2500}/>

	      {/*确认框*/}
				<Dialog
						ref="dialog"
						title="提示!"
						cancelText="取消"
						content = {dialogContent}
						confirmCallBack={ this._exitRoom }
					/>
	
				{/*红包弹框*/}
	      <RedPckModal
		      ref="redPckModal"
		      errData={ this.state.errData }
		      redpckDetail={ this._redpckDetail }
		      packetInfo={ this.state.packetInfo }
		      openPacket={this.openPacket}
	      />

				{/* 表情 */}
				<ChatInputBar ref="chatInputBar" isVisible={true} onSend={(text) => this._onSendMsg(text)}/>
      </View>
	  </SafeAreaViewPlus>
    )
  }
}

const center = {
	flexDirection: 'row', 
	alignItems: 'center', 
	justifyContent: 'center'
}

const styles = StyleSheet.create({
	hallContent: {
		marginTop: 5, 
		paddingRight:5, 
		paddingLeft:5, 
		height:  DeviceInfo.isIPhoneX_deprecated ? height - 190 : height - 155
	},
	marquee: {
    borderBottomWidth: 1,
    borderBottomColor: '#d7d7d7',
		padding: 5,
		height: marquee_height,
		backgroundColor: '#fff'
  },
	marqueeText: {
	  color: '#333'
  },

	back: {
		position: 'absolute',
		top: 0, 
		left: 0,
		backgroundColor: 'rgba(0,0,0,.2)',
		width, 
		height
	},

	footerText: {
		textAlign: 'center',
		width: '50%',
		fontSize: 14
	},
	
	bottomContainer: {
		height: 45,
		backgroundColor: '#fff',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10
	},

	textContainer: {
		width:'100%',
		height: 48,
		flexDirection:'row',
		backgroundColor:'#fff',
		alignItems:'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	emojiStyle: {
		height:28,
    width:28
	},
	
	sendBtnTextStyle:{
    fontSize:14,
    color:'#bbbbbb'
  },

  sendBtnStyle:{
	  height:32,
	  width:62,
	  justifyContent:'center',
	  alignItems:'center',
	  marginRight:10,
	  borderRadius:14,
	  backgroundColor:'#f5f5f5'
  },
	
	inputBox: {
		flex:1,
		height:32,
		marginLeft:10,
		marginRight:10
	},
	inputStyle:{
		flex:1,
		paddingTop:8,
		paddingBottom:8,
		paddingLeft:10,
		paddingRight:10,
		height:32,
		marginLeft:10,
		marginRight:10,
		backgroundColor:'#f5f5f5',
		borderWidth:0,
		borderRadius:20,
		fontSize:14
	},
})