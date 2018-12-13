import React, { Component } from 'react'
import {
  View,
	Text,
	TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
	FlatList,
  Modal,
	TouchableHighlight,
	AsyncStorage
} from 'react-native'
import config from '../../request/config'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import RefreshListView, { RefreshState } from './listView'


import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Dialog from '../../common/Dialog/index'

// import List, { State }from '../../components/list/list'

import { Icon } from '../../components/icon'
import { 
	getRoomList, 
	entranceRoom,
	getRoomCardSocket,
	getContactDataSocket,
	getUserHistoryRoom
} from '../../request/api/socket'
import ws from '../../request/socket'

const {width, height} = Dimensions.get('window')

export default class RoomList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			listData: [], // 列表数据
			modalVisible: false,    // 弹框是否显示
			roomCard: [], // 房卡
			transparent: true,  //是否透明显示
			currentRoomPwd: null, 	// 当前点击的房间的密码
			currentRoomId: '', // 当前房间ID
			pwd: null,		// 弹框中输入的房间密码
			pwdError: false, 
			item: null,
			userHistoryRoom: {},
			refreshState: RefreshState.Idle,
			totalRoom: 0
		}
		// 当前页码
		this.currentPage = 1
		// 总页码
		this.totalPage = 1

		this.params = this.props.navigation ? this.props.navigation.state.params : {}

	}
	
	componentDidMount() {
		this.onHeaderRefresh()

		this._getUserHistoryRoom()

		ws.capture(0x11a, (data) => {	
			let result = data.body.result
			
			let list = this.state.listData
			list = list.map(room => {

				if (room.id == result.id) {
					room.roomOnlineNumbers = result.roomOnlineNumbers
					room.roomGaming = result.roomGaming			
				}
				return room
			})
			
			this.setState({listData: this.listSort(list)})
		})
	}

	componentWillUnmount() {
		ws.send({}, 0x118)
	}

	// 获取用户进入房间历史记录
	_getUserHistoryRoom = async () => {
		let showHistory = await AsyncStorage.getItem('showHistory').then()
		if (showHistory === 'no') {
			this.setState({userHistoryRoom: {}})
			return
		}

		getUserHistoryRoom()
		.then(res => {
			this.setState({
				userHistoryRoom: res
			})
		})
	}
	
	// 排序
	listSort(list = []) {
			list.sort((a, b) => b.createTime - a.createTime)
			list.sort((a, b) => a.roomGaming - b.roomGaming)
			return list
	}

	// 下拉刷新
	onHeaderRefresh = () => {
		this._getUserHistoryRoom()

		this.currentPage = 1
		this.setState({refreshState: RefreshState.HeaderRefreshing})
		
		getRoomList(this.currentPage, this.params.type)
			.then(res => {
				let arr = this.listSort(res.list)
				
				let list = this.banner(arr)
				this.totalPage = res.lastPage

				this.setState({
					refreshState: RefreshState.Idle,
					listData: list,
					totalRoom: res.list.length
				})
			})
			.catch(err => {
				console.warn('加载错误', err)
				this.setState({refreshState: RefreshState.Failure})
			})
	}
	
	// 每隔5个 加一个广告位
	banner(list = []) {
		let newList = []
		
		if (list.length >= 5) {
			list.forEach((item, index) => {
				newList.push(item)
				if ((index+1) % 5 === 0 && index !== 0) {
					newList.push({
						type: 'banner'
					})
				}
				return newList
			}, [])
		} else {
			newList = list
		}
		
		return newList
	}

	// 上拉加载
	onFooterRefresh = () => {
		if (this.currentPage >= this.totalPage) {
			return
		}
		
		this.currentPage++
		this.setState({refreshState: RefreshState.FooterRefreshing})

		getRoomList(this.currentPage, type = this.params.type)
			.then(res => {
				let list = this.banner(res.list)
				
				if (list.length >= 5) {
					list = list.reduce((newList, item, index) => {
						if (index % 5 === 0) {
							newList.push({type: 'banner'})
						}
						
						newList.push(item)
						return newList
					}, [])
				}
				
				if (res.lastPage <= this.currentPage) { // 最后一页
					this.setState({refreshState: RefreshState.EmptyData})
					this.currentPage--
				} else {
					this.setState({refreshState: RefreshState.Idle})
				}

				this.setState({listData: [...this.state.listData ,...list], totalRoom: res.list.length})
			})
			.catch(err => {
				this.setState({refreshState: RefreshState.Failure})
			})
	}

	// 房卡列表
	_getRoomCardSocket() {
		let _This = this
		getRoomCardSocket({
			id: 1
		})
		.then(res => {
			let dataList = res.userPropInfoResults
			let len = dataList.length
			if(len < 1) {
				Alert.alert(
					'提示', 
					'您目前没有可用的建房卡!',
					[
						{text: '确定', onPress: () => { console.warn('确定')}}
					]
				)
			} else {
				_This.setState({modalVisible: true}) 
			}
			Object.assign(dataList[len - 1], {last: true})
			_This.setState({
				roomCard: dataList,
				roomCardLen: len
			})
			
		})
		.catch(err => {
			console.warn('err', JSON.stringify(err))
		})
	}
	
	subStr(str) {
		str = String(str).replace(/^\s|\s*|\s$/g, '')
		
		if (str.length >= 20) {
			str = str.slice(0, 20) + '...'
		}
		
		return str
	}

	// 加入房间
	addRoomFn(detailId, id) {
		this.setState({modalVisible: false})
		const {navigate} = this.props.navigation
		navigate('AddRoomPage', {detailId, id})
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

	// 有密码的详情
	detailFn(item) {
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
	
	onBackFn = () => {
		this.props.navigation.goBack()
	}
	
	// 渲染大厅列表 item
	_renderItem(data) {
		let item = data.item
		
		// 如果是广告位
		if (item.type === 'banner') {
			return (
				<View style={[{flexDirection: 'row',alignItems: 'center', padding: 5}, styles.content]} >
					<Image source={require('./imgs/app_06.png')} style={styles.roomAvatar}/>
					<View style={{flex: 1}}>
						<Text>踩雷模式2月2日即将上线</Text>
						<Text>玩法更刺激,敬请期待</Text>
					</View>
				</View>
			)
		}
		
		return (
			
			<TouchableOpacity onPress={() => this.detailFn(item)}>
				<View style={styles.content}>
					<Image source={/(.jpg|.png)/g.test(item.roomLogo) ? {uri: config.imgUrl + item.roomLogo} : require('./imgs/qun.png')}  style={styles.roomAvatar}/>
					
					<View style={{flex: 1, paddingRight: 10}}>
						<Text style={styles.roomName}>{item.roomName}</Text>
						<Text style={styles.roomRules}>{ this.subStr(item.intro) }</Text>
					</View>
					
					<View>
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
						
						<Text style={styles.peopleNum}>{`${item.roomOnlineNumbers}/${item.totalUser}`}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	// 清除上次进入游戏房间历史
	clearHistory = () => {
		AsyncStorage.setItem('showHistory', 'no')

		this.setState({userHistoryRoom: {}})
	} 
	
	
	// 渲染房卡列表
	_roomCardItem = (data) => {
		let item = data.item
		let last = parseInt(data.index) === parseInt(this.state.roomCardLen - 1)
	
		return (
			<View style={[styles.roomCardList, styles.spaceBetween, last ? null : styles.borderBottom]}>
				<View style={{width: width - 160}}>
					<Text style={styles.roomCardName}>{item.propName}</Text>
					<Text style={styles.roomCardDes}>{item.propDecription}</Text>
				</View>
				<View style={[styles.flexStart, {alignItems: "center", marginRight: 8}]}>
					{
						item.propPrice ?
							<Text style={{fontSize: 8, color: "#ff9900"}}>¥ {item.propPrice}</Text> :
							null
					}
					<TouchableOpacity onPress={() => this.addRoomFn(item.detailId, item.id)}>
						<Text style={styles.useBtn}>使用</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	

	render() {
		let dialogHeight = 
			this.state.roomCardLen === 1 ? 
			{height: 120,top: (height - 120)/ 2} : 
			(
				this.state.roomCardLen === 2 ? 
				{height: 156,top: (height - 156)/ 2} :
				{height: 206,top: (height - 206)/ 2}
			)
		let dialogContentHeight = 
			this.state.roomCardLen === 1 ? 
			{height: 120-54} : 
			(
				this.state.roomCardLen === 2 ? 
				{height: 156-54} :
				{height: 206-54}
			)
		
		let rightButton = this.params.type === 2 ? <TouchableOpacity
			onPress={()=>{this._getRoomCardSocket()}}>
			<View style={{margin: 10}}>
				<Icon name={'privateIcon|add'} size={14} color={'#fff'}/>
			</View>
		</TouchableOpacity> : <Text/>
		let navigationBar = <NavigationBar
			title={this.params.title}
			statusBar={{
				backgroundColor: '#212025'
			}}
			leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
			rightButton={rightButton}
		/>
		
		let dialogContent = <View style={{alignItems: 'center', marginTop: 7}}>
				<TextInput
					maxLength={6}
					ref="pwdInput"
					placeholder="请输入房间密码"
					onChangeText={(pwd) => this.setState({pwd, pwdError: false})}
					value={this.state.pwd}
					style={{width: '50%',height: 35, paddingBottom: -5, borderBottomWidth: 1, borderColor: "#e9e9e9"}}
					/>
				<Text style={styles.errText}>{this.state.pwdError}</Text>
		</View>
		return (
		<SafeAreaViewPlus  
			topColor={'#212025'}
			bottomInset={false}>
			<View style={styles.container}>
				{navigationBar}
				<View>
					{
						this.state.userHistoryRoom.roomName ?
						<View style={[styles.prevRoom]}>				
								<TouchableOpacity onPress = { () => {this.detailFn(this.state.userHistoryRoom)}}>
									<View style={[styles.prevRoomL]}>
										<Icon name={'privateIcon|time'} size={14} color={'#75767a'}/>
										<Text style={styles.prevRoomName}>
											{this.state.userHistoryRoom.roomName}
										</Text>
										<Text style={styles.prevRoomPeoNum}>({`${this.state.userHistoryRoom.roomOnlineNumbers}/${this.state.userHistoryRoom.totalUser}`})</Text>
									</View>
								</TouchableOpacity>
							<TouchableOpacity onPress = { this.clearHistory }>
								<Icon name={'privateIcon|guanbi'} size={12} color={'#b2b2b2'}/>
							</TouchableOpacity>
						</View> : null
					}
					
					<TouchableOpacity onPress={() => { this.props.navigation.navigate('SearchPage', {type: this.params.type}) }}>
						<View style={styles.searchWrap}>
							<Icon name={'privateIcon|sousuofangjian'} size={14} color={'#1bac19'}/>
							<Text style={styles.searchInput}>房间号/房间名</Text>
						</View>
					</TouchableOpacity>
					
					<View style={styles.independent}>
						<View style={[styles.title, {marginBottom: 10}]}>
							<Text style={styles.titleText}> {this.params.type === 1 ? '接龙大厅' : '接龙包间'}({this.state.totalRoom})</Text>
						</View>
						
						<View style={{backgroundColor: '#fff', height: height -200}}>
								<RefreshListView
								data={this.state.listData}
								keyExtractor={(item) => item.id}
								renderItem={this._renderItem.bind(this)}
								
								refreshState={this.state.refreshState}
								onHeaderRefresh={this.onHeaderRefresh}
								onFooterRefresh={this.onFooterRefresh}
								/>
						</View>
					</View>
				</View>
				
				<Modal
					animationType="fade"
					transparent={this.state.transparent}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						alert("Modal has been closed.")
					}}>
					<TouchableHighlight style={styles.back} onPress={() => {this.setState({modalVisible: false})}}>
						<View></View>
					</TouchableHighlight>
					<View style={[styles.dialog,dialogHeight]}>
						<View style={styles.dialogHeader}>
							<Text>请选择一张建房卡</Text>
							<TouchableHighlight style={styles.deleteIcon} onPress={() => { this.setState({modalVisible: false})}}>
								<Icon name={'privateIcon|delete'} size={11} color={'#b6b6b6'}/>
							</TouchableHighlight>
						</View>
						<View style={[styles.dialogContent, dialogContentHeight]}>
							<FlatList
								data={this.state.roomCard}
								renderItem={(data) => this._roomCardItem(data)}
							/>
						</View>
					</View>
				</Modal>
				
				<Dialog
					title="请输入密码"
					cancelText = "取消"
					ref="dialog"
					confirmCallBack={this._dialogSubmitFn}
					content = {dialogContent}
				/>
				</View>
			</SafeAreaViewPlus>
		)
	}
}

const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0, .2)',
        width: width, 
        height: height,
    },
		independent: {
    	backgroundColor: 'transparent'
		},
    dialog: {
        width: width - 30,
        borderRadius: 4,
        backgroundColor: '#fff',
        position: 'absolute', 
		left: 15,
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    prevRoom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        alignItems: 'center',
    },
    prevRoomL: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
		alignItems: 'center',
		width: 220
    },
    prevRoomName: {
        fontSize: 13,
        color: '#1bac19',
        marginLeft: 9
    },
    prevRoomPeoNum: {
        fontSize: 13,
        color: '#666666'
    },
    title: {
        paddingLeft: 15,
    },
    titleText: {
        fontSize: 13,
        color: '#a9a9a9'
    },
    alignItemsCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
	      alignItems: 'center',
        backgroundColor: '#fff',
	      height: 60,
				paddingLeft: 10,
	      paddingRight: 10
    },
    roomAvatar: {
        width: 44,
        height: 44,
        marginRight: 10
    },
    listWrap: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingTop: 8,
        paddingBottom: 8
    },
    listR: {
        width: width - 30 - 44 - 10
    },
    roomName: {
        fontSize: 15,
        color: '#1a1a1a'
    },
    roomNum: {
        fontSize: 12,
        color: '#333333',
        marginLeft: 5
    },
    roomRules: {
        fontSize: 12,
				color: '#a9a9a9'
    },
    peopleNum: {
      fontSize: 12,
			color: '#a9a9a9',
			width: 60,
			textAlign: 'right',
	    marginTop: 5
    },
    searchWrap: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingBottom: 13,
        paddingLeft: 25,
    },
    searchInput: {
        width: width - 25 - 18,
        borderWidth: 0,
        backgroundColor: '#fff',
        color: '#c7c6cc',
        fontSize: 14,
        marginLeft: 18,
    },

    dialogHeader: {
        paddingTop: 18,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 15,
        color: "#000000"
    },
    deleteIcon: {
        position: 'absolute',
        left: 10,
        top: 10,
        padding: 4,
    },
    dialogContent: {
		paddingLeft: 14,
		overflow: 'hidden',
	},
	borderBottom: {
		borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
	},
	roomCardList: {
      paddingTop: 10,
      paddingBottom: 10,
			paddingRight: 17,
			width: width - 30,
    },
  roomCardName: {
      fontSize: 13,
      color: "#1f1f1f"
  },
  roomCardDes: {
    	fontSize: 9,
			color: "#b1b5ba",
			width: 260
    },
	errText: {
    	color: "red",
			fontSize: 12,
			marginLeft: 10,
			paddingTop: 5,
			paddingBottom: 5,
			overflow: 'hidden',
			textAlign: 'left',
			width: '50%'
		},
  useBtn: {
    paddingTop: 6,
    paddingBottom: 6,
    // paddingLeft: 15,
    // paddingRight: 15,
		backgroundColor: "#75d978",
		width: 50,
		textAlign: 'center',
    fontSize: 11,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "#42c246",
    borderRadius: 3,
		marginLeft: 6,
	},
	footerText: {
		textAlign: 'center',
		width: (width - 100) / 2 - 0.5,
		fontSize: 14
	}
})