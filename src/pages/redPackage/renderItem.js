import React, { Component } from 'react'
import {
	View,
	Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native'

import RichTextWrapper from '../../common/emoji/richTextWrapper'
import config from '../../request/config'

const { width } = Dimensions.get('window')

export default class RoomMessageItem extends Component{
  constructor(props) {
    super(props)

    this.state = {
      timeout: 60
    }

    this.timer = null
  }
  
  componentDidMount() {}

  shouldComponentUpdate() {
    return true
  }

  // 表情聊天消息
  emojiMessage(item) {
    // return <RichTextWrapper textContent={item.tips}/>
    let userId = this.props.userId

   return <View style={[{flexDirection: 'row'},
     item.userSimpleInfo.id === userId ? {justifyContent: 'flex-end'} : {}]}>
	   <TouchableOpacity opacity={0.7} onPress={ () => { this.props.lookOtherUser(item.userSimpleInfo)}}>
	     {
	       // item.headerImg
	       item.userSimpleInfo.id !== userId ?
		     <Image source={item.userSimpleInfo.headerImg? {uri: config.imgUrl + item.userSimpleInfo.headerImg} : require('./imgs/def.png')} style={[styles.avatar]}/> :
		     null
	     }
	   </TouchableOpacity>
     <View>
       {/*昵称 是自己不显示*/}
       {
         item.userSimpleInfo.id !== userId ? <Text style={styles.nickname}>{item.userSimpleInfo.nickName}</Text> : null
       }
       
       <View style={[styles.containerBox, {backgroundColor: item.userSimpleInfo.id === userId ? '#a0e75a' : '#fff'}]}>
         <View style={{fontSize: 14, padding: 10}}>
          <RichTextWrapper textContent={item.tips}/>
         </View>
         {/*小三角*/}
         <Text style={[
           styles.triangle,
           {borderRightColor: item.userSimpleInfo.id === this.props.userId ? '#a0e75a' : '#fff'},
           item.userSimpleInfo.id === userId ? styles.rightTriangle : styles.leftTriangle,
           item.userSimpleInfo.id === userId ? {borderLeftColor: '#a0e75a'} : {borderRightColor: '#fff'}
         ]}/>
       </View>
     </View>
     
     {/*自己的头像靠右边*/}
	   <TouchableOpacity opacity={0.7} onPress={ () => { this.props.lookOtherUser(item.userSimpleInfo)}}>
     {
       item.userSimpleInfo.id === userId ?
	     <Image source={item.userSimpleInfo.headerImg? {uri: config.imgUrl + item.userSimpleInfo.headerImg} : require('./imgs/def.png')} style={[styles.avatar]}/> :
	     null
     }
	   </TouchableOpacity>
   </View>
  }

  // 红包结果
  redPacketResult(item) {
	  
    return <View style={[flexCenter, {padding: 10}]}>
    <View style={{width: width*0.8, backgroundColor: '#d5d5d5', borderRadius: 3, padding: 5}}>
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
        <Image style={{width: 14, height: 14}} source={require('./imgs/weilingqu.png')}></Image>
        <Text style={{color: '#eb6836', fontSize: 14}}>红包结果</Text>
      </View>
      
      <Text style={[{marginBottom: 5}, styles.resultText]}>发包人:&nbsp; {item.packSenderNickName}</Text>
      <View>
        { // 红包未抢完
          item.type == '12305' ? <View>
              <Text style={styles.resultText}>
                {item.packStrategy === '0' ? '手气最佳': '手气最差'}: {item.nextSenderNickName}&nbsp;<Text style={{color: 'red'}}>{item.nextSenderGrabAmount}</Text>元
              </Text>
	          
		          <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
			          <Text style={styles.resultText}>红包没有抢完，剩余的红包归还发包人</Text>
			          <TouchableOpacity onPress={ () => this.props.redpckDetail(item.packId)}>
				          <Text style={{fontSize: 12, color: '#005aa0'}}>详细> </Text>
			          </TouchableOpacity>
		          </View>
          </View> :
	         
	        // 人数不足 自动结算
	        item.type == '12312' ? <Text style={styles.resultText}>当前房间人数小于红包份数, 根据游戏规则, 玩家所抢红包归还发包人, 本轮红包游戏结束</Text> :
	         
          // 一个都么抢
          item.type == '12311' ? <Text style={styles.resultText}>红包一个都没有被抢，全额归还发包人</Text> : 

          // 正常结算
          item.type == '12310' ? <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
            <Text style={styles.resultText}>
              {item.packStrategy === '0' ? '手气最佳': '手气最差'}: {item.nextSenderNickName}&nbsp;<Text style={{color: 'red'}}>{item.nextSenderGrabAmount}</Text>元
            </Text>
            <TouchableOpacity onPress={ () => this.props.redpckDetail(item.packId)}>
              <Text style={{fontSize: 12, color: '#005aa0'}}>详细> </Text>
            </TouchableOpacity>
          </View> : null
        }
      </View>
    </View>
    </View>
 }
 
  // 玩家进出房间 消息推送
  playerState(item) {
    return <View style={flexCenter}>
      <View style={[{backgroundColor: '#d5d5d5',paddingTop:7, paddingBottom:7, borderRadius: 4}]}>
        <Text style={{paddingLeft: 15, paddingRight: 15, lineHeight: 20}}>
          { item.tips }
        </Text>
      </View>
    </View>
  }

  // 房间规则修改 消息推送
  changeRoomRule = (item) => {
    return <View style={flexCenter}>
    <View style={[{backgroundColor: '#d5d5d5', borderRadius: 4}]}>
      <Text style={{paddingLeft: 15, paddingRight: 15, lineHeight: 20, color: '#F56C6C'}}>
        { item.tips }
      </Text>
    </View>
  </View>
  }
	
	// 玩家手气最差或最佳 发包
	sendPckMessage(item) {
		
		return <View style={flexCenter}>
			<View style={[{backgroundColor: '#d5d5d5',paddingTop:7, paddingBottom:7, borderRadius: 4}]}>
				<Text style={{paddingLeft: 15, paddingRight: 15, fontSize: 14,}}>
					本局游戏 <Text style={{color: '#005aa0'}}>你的</Text>
					{item.packStrategy === '0' ? '手气最佳' : '手气最差'} 请于{ item.timeout }s内发放红包
				</Text>
			</View>
		</View>
	}

  // 获取红包 消息推送
  getRedpackMessage(item) {
  
    return <View style={flexCenter}>
      <View style={[{backgroundColor: '#d5d5d5',paddingTop:7, paddingBottom:7, borderRadius: 4}]}>
        <Text style={{paddingLeft: 15, paddingRight: 15, lineHeight: 20}}>
          { `${item.userId === this.props.userId ? '你' : item.curUserNickName} 领取了 ${item.packSender === this.props.userId ? '你' : item.packSenderNickName}的红包` }
        </Text>
      </View>
    </View>
  }
 

 // 系统扣发消息
 koufa = (item) => {
  return <View style={flexCenter}>
      <View style={[{backgroundColor: '#d5d5d5',paddingTop:7, paddingBottom:7, borderRadius: 4}]}>
        <Text style={{paddingLeft: 15, paddingRight: 15, lineHeight: 20}}>
          <Text style={{color: '#005aa0'}}>{ item.packSenderNickName }</Text>发红包超时, 系统自动扣发
        </Text>
      </View>
    </View>
 }
 
 // 自己发送的消息排列在右边并且不显示昵称 别人的消息显示在左边
 textMessage(item) {
   let userId = this.props.userId
//	 console.warn('消息=', item)
   return <View style={[{flexDirection: 'row'},
     item.userSimpleInfo.id === userId ? {justifyContent: 'flex-end'} : {}]}>
	   <TouchableOpacity opacity={0.7} onPress={ () => { this.props.lookOtherUser(item.userSimpleInfo)}}>
	     {
	       // item.headerImg
	       item.userSimpleInfo.id !== userId ?
		     <Image source={item.userSimpleInfo.headerImg? {uri: config.imgUrl + item.userSimpleInfo.headerImg} : require('./imgs/def.png')} style={[styles.avatar]}/> :
		     null
	     }
	   </TouchableOpacity>
     <View>
       {/*昵称 是自己不显示*/}
       {
         item.userSimpleInfo.id !== userId ? <Text style={styles.nickname}>{item.userSimpleInfo.nickName}</Text> : null
       }
       
       <View style={[styles.containerBox, {backgroundColor: item.userSimpleInfo.id === userId ? '#a0e75a' : '#fff'}]}>
         <Text style={{fontSize: 14, padding: 10}}>{item.tips.trim()}</Text>
         
         {/*小三角*/}
         <Text style={[
           styles.triangle,
           {borderRightColor: item.userSimpleInfo.id === this.props.userId ? '#a0e75a' : '#fff'},
           item.userSimpleInfo.id === userId ? styles.rightTriangle : styles.leftTriangle,
           item.userSimpleInfo.id === userId ? {borderLeftColor: '#a0e75a'} : {borderRightColor: '#fff'}
         ]}/>
       </View>
     </View>
     
     {/*自己的头像靠右边*/}
	   <TouchableOpacity opacity={0.7} onPress={ () => { this.props.lookOtherUser(item.userSimpleInfo)}}>
	     {
	       item.userSimpleInfo.id === userId ?
	       <Image source={item.userSimpleInfo.headerImg? {uri: config.imgUrl + item.userSimpleInfo.headerImg} : require('./imgs/def.png')} style={[styles.avatar]}/> :
	       null
	     }
	   </TouchableOpacity>
   </View>
 }
 
 // 发放红包
 // 1 自己发的靠右边, 其他玩家发的 靠左边
 // 2 红包已抢完 颜色变浅 没抢完颜色深色
 PacketOver = (item) => {
   let userId = this.props.userId
	 const id = item.userId
   return <View
   style={[{flexDirection: 'row'}, item.userId === userId ? {justifyContent: 'flex-end'} : {}]}>
     
     {/*头像默认放左边*/}
	   <TouchableOpacity opacity={0.7} onPress={ () => { this.props.lookOtherUser({id})}}>
	     {
	       item.userId !== userId ?
	       <Image source={item.avatar? {uri: config.imgUrl + item.avatar} : require('./imgs/def.png')} style={[styles.avatar]}/> :
	       null
	     }
	   </TouchableOpacity>
     
     <View>
       {/*昵称*/}
       {
         item.userId !== userId ? <Text style={{fontSize: 12, marginRight: 10, marginLeft: 10}}>{item.packSenderNickName}</Text> : null
       }
       
       <TouchableOpacity onPress={ () => this.props.chai(item) } activeOpacity={0.8}
	       style={[styles.containerBox,{width: 190, paddingTop: 5}, {backgroundColor: item.state === 1? '#ffcf9b' : '#ffa433'}]}>
         <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 5}}>
           {/*红包的个数没了,表示已抢完*/}
           {
             item.total === 0 ?
               <Image style={styles.redPacket} source={require('./imgs/dakai.png')}/> :
               <Image style={styles.redPacket} source={require('./imgs/weilingqu.png')}/>
           }
           <View>
             <Text style={{fontSize: 14, color: '#fff'}}>{item.type === 12323 ? item.leaveMsg : '系统扣发'}</Text>
             <Text style={{fontSize: 12, color: '#fff'}}>{item.state !== 1 ? '领取红包' : '查看详情'}</Text>
           </View>
         </View>
         
         {/*小三角*/}
         {/* #ffa433  */}
         {/* #ffcf9b */}
         <Text style={[
           styles.triangle,
           // 如果红包以抢完 并且 不是自己发的红包(红包靠左边)
           (item.state !== 1 && item.userId !== userId) ? Object.assign({borderRightColor: '#ffa433'}, styles.leftTriangle) : {},
           // 如果红包没抢完 并且 是自己发的红包(红包靠右边)
           (item.state === 1 && item.userId === userId) ? Object.assign({borderLeftColor: '#ffa433'}, styles.rightTriangle) : {},
           // 如果红包没抢完 并且 不是自己发的红包(红包靠左边)
           (item.state === 1 && item.userId !== userId) ? Object.assign({borderRightColor: '#ffa433'}, styles.leftTriangle) : {},
           // 如果红包以抢完 并且 是自己发的红包(红包靠右边)
           (item.state !== 1 && item.userId == userId) ? Object.assign({borderLeftColor: '#ffa433'}, styles.rightTriangle) : {}
         ]}/>
         
         <View style={styles.bottomTextBox}>
           <Text style={[styles.bottomText]}>{item.pickType === 1 ? '踩雷红包' : '接龙红包'}</Text>
           <Text style={[styles.bottomText]}>{item.timeout + '秒'}</Text>
         </View>
       </TouchableOpacity>
     </View>
   
     {/*如果是自己 头像放右边*/}
	   <TouchableOpacity opacity={0.7} onPress={ () => { this.props.lookOtherUser({id: userId})}}>
	     {
	       item.userId === userId ?
	       <Image source={item.avatar? {uri: config.imgUrl + item.avatar} : require('./imgs/def.png')} style={[styles.avatar]}/> :
	       null
	     }
	   </TouchableOpacity>
   </View>
 }
 
 // 消息渲染
 _renderItem(data) {
   let item = data.item
   let index = data.index
   let itemView = {}
	 
   // 根据不同的消息类型 返回不同的UI
   switch(String(item.type)) {
      // 固定语言聊天消息
      case 'M':
        itemView = this.textMessage(item)
        break
      // 表情聊天
      case 'E':
        itemView = this.emojiMessage(item)
        break  
      // 房间规则
      case 'G':
        itemView = this.changeRoomRule(item)
        break
      
      // 玩家进出房间消息
      case 'J':
	      itemView = this.playerState(item)
	      break
      case 'C':
	      itemView = null
	      break
	    case '12304':
        itemView = this.sendPckMessage(item)
        break
      case '12323': // 正常 发红包
      case '12324': // 系统扣发 红包
        itemView = this.PacketOver(item)
        break 
      // 系统消息
      case '12325':
          itemView = this.getRedpackMessage(item)
          break
      // 红包异常情况 结算
      case '12305': // 最少被抢了一个，但是没有抢完 结果
      case '12311': // 一个没被抢 游戏结果
	    case '12310': // 正常被枪完游戏结果
	    case '12312':
          itemView = this.redPacketResult(item)
          break
   }
   return <View style={{marginBottom: 20}} key={index}>{ itemView }</View>
 }

 render() {
   return this._renderItem(this.props.data)
 }
}

const flexCenter = {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center'
}


const styles = StyleSheet.create({
	marquee: {
    borderBottomWidth: 1,
    borderBottomColor: '#d7d7d7',
		padding: 5,
		backgroundColor: '#fff'
  },
  resultText: {
    color: '#fff',
    fontSize: 12
  },
	marqueeText: {
	  color: '#333'
  },
	content: {
		color: '#333'
	},
	avatar: {
		width: 40,
		height: 40
	},
	containerBox: {
		borderRadius: 3,
//		paddingTop: 10,
    maxWidth: width - 110,
		marginLeft: 10,
		marginRight: 10,
		position: 'relative',
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	
	redPacket: {
		width: 35,
		height: 40,
		marginLeft: 10,
		marginRight: 5,
	},
	
	nickname: {
		fontSize: 12,
		marginLeft: 10
	},
	
	// 小三角
	triangle: {
		width: 0,
		height: 0,
		borderTopWidth: 8,
		borderTopColor: 'transparent',
		borderRightWidth: 8,
		borderLeftWidth: 8,
		borderBottomWidth: 8,
		borderBottomColor: 'transparent',
		position: 'absolute',
		top: 10
	},
	
	leftTriangle: {
		borderLeftColor: 'transparent',
		left : -10-2
	},
	
	rightTriangle: {
		borderRightColor: 'transparent',
		right: -10-2
	},
	
	bottomTextBox: {
		backgroundColor: '#fff',
		paddingLeft: 5,
		paddingRight: 5,
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	
	bottomText: {
		lineHeight: 25,
		height: 25,
		color: '#ccc',fontSize: 10
	}
})