import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    AsyncStorage,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
    Linking,
    Switch
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import px2dp from '../../util/screenAdaptation'
import { Icon } from '../../components/icon'
import { getUserInfoSocket } from '../../request/api/socket'
import Loading from '../../common/loading/index'
import config from '../../request/config'

export default class MyPage extends Component {
  constructor(props) {
    super(props)
	  
    this.state = {
      isFetching: false,  // 是否在请求接口
      isMute: null, //  消息免打扰字段
	    value: '',
      date: "",
      balance: "",            // 余额 
      createDate: "",         // 创建日期
      goldCoinBalance: "",    // 金币余额 
      headIcon: "",           // 头像地址 
      userLever: "",          // 用户等级
      loginPassword: "",      // 登录密码
      nickName: "",           // 昵称
      phone: "",              // 手机号 
      redPackWinCount: "",    // 抢得红包数 
      withdrawPassword: "",   // 提现密码
      userInfo: {
        headIcon: "",   // 个人中心 - 头像
        nickName: "",   // 昵称
        phone: "",    // 手机号 
        withdrawPassword: "",  //提现密码
        createDate: "", // 创建日期
        redPackWinCount: "",  //  抢得红包数 
      },
      invitationCode: "", // 邀请码
    }
  }

  componentDidMount() {
    this._getUserInfoFn()
     // 修改昵称、手机号 退回后 会更新
     DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
      // dic.auto  socket 里面认证成功
      if(dic.update || dic.loginUpdate || dic.auto) {
        this._getUserInfoFn()
      }

	  // DeviceEventEmitter.addListener('auth', (data) => {
    //   let res = JSON.parse(data)
		//   this.setState({
		// 	  balance: res.balance,  // 余额
		// 	  goldCoinBalance: res.goldCoinBalance,  // 金币余额
		// 	  headIcon: res.headIcon ? config.imgUrl+res.headIcon : config.defaultUserAvatarBase64,   // 头像地址
		// 	  nickName: res.nickName,   // 昵称
		// 	  phone: res.phone,    // 手机号
		// 	  invitationCode: res.invitationCode, // 邀请码
		// 	  userLever: res.userLevel, // 用户等级
		// 	  isMute: res.isMute, // 消息免打扰
		// 	  userInfo: {
		// 		  headIcon: res.headIcon ? config.imgUrl+res.headIcon : config.defaultUserAvatarBase64,   // 个人中心 - 头像
		// 		  nickName: res.nickName,   // 昵称
		// 		  phone: res.phone,    // 手机号
		// 		  withdrawPassword: res.withdrawPassword,  //提现密码
		// 		  createDate: res.createDate, // 创建日期
		// 		  redPackWinCount: res.redPackWinCount,  //  抢得红包数
		// 	  }
		//   })
    })
  }

  _getUserInfoFn() {
    getUserInfoSocket()
    .then(res => {
        if(res.isMute === 0) {
            AsyncStorage.setItem('playAudio', "no")
        } else {
          AsyncStorage.setItem('playAudio', "yes")
        }

        this.setState({
          balance: res.balance,  // 余额 
          goldCoinBalance: res.goldCoinBalance,  // 金币余额 
          headIcon: res.headIcon ? config.imgUrl+res.headIcon : config.defaultUserAvatarBase64,   // 头像地址 
          nickName: res.nickName,   // 昵称
          phone: res.phone,    // 手机号 
          invitationCode: res.invitationCode, // 邀请码
          userLever: res.userLevel, // 用户等级
          isMute: res.isMute, // 消息免打扰
          userInfo: {
            headIcon: res.headIcon ? config.imgUrl+res.headIcon : config.defaultUserAvatarBase64,   // 个人中心 - 头像
            nickName: res.nickName,   // 昵称
            phone: res.phone,    // 手机号 
            withdrawPassword: res.withdrawPassword,  //提现密码
            createDate: res.createDate, // 创建日期
            redPackWinCount: res.redPackWinCount,  //  抢得红包数 
          }
        }, ()=>{
          // console.error(this.state.headIcon)
        })
       
    })
    .catch(err => {
        this.setState({
          isFetching: false
        })
        console.warn(JSON.stringify(err))
    })
  }

  // 分享
  shareFn = ()=> {
    let url = config.shareUrl+"?invitationCode="+this.state.invitationCode;
    Linking.openURL(url) 
  }

  render() {
	  const { navigate } = this.props.navigation;
    return (
      <View>
        <NavigationBar
            title = "我的"
            statusBar={{
                backgroundColor: '#212025'
            }}
        />
        <ScrollView>
            <TouchableOpacity   
              onPress={() => navigate("UserInfoPrivatePage", {userInfo: this.state.userInfo})}
              style={[styles.flexBetween, styles.borderTopAndBottom, styles.userInfo]}>
                <View style={styles.flexStart}>
                    <Image
                        resizeMode ='stretch'
                        style={styles.avatar}
                        source={{uri: this.state.headIcon}}
                    /> 
                    
                    <View>
                      <View style={styles.flexStart}>
                          <Text style={styles.title}>{this.state.nickName}</Text>
                          <Text style={styles.grade}>LV{this.state.userLever}</Text>
                      </View>
                      <Text style={styles.phone}>手机号：{this.state.phone}</Text>
                    </View>
                </View>
                <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
            </TouchableOpacity>
            <View style={[styles.borderTopAndBottom, styles.itemWrap]}>
              <TouchableOpacity 
                    onPress={() => navigate("AccountPage")}
                    style={[styles.flexBetween, styles.list, styles.borderBottom]}>
                  <View style={styles.flexStart}>
                      <Image style={styles.icon} source={require("./imgs/001.png")} />
                      <Text style={styles.title}>账户</Text>
                  </View>
                  <View style={styles.flexStart}>
                      <View style={styles.flexStart}>
                          <Text style={styles.value}>{this.state.balance ? this.state.balance : 0}</Text>
                          <Text style={styles.unit}>元</Text>
                      </View>
                      <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
                  </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.borderTopAndBottom, styles.itemWrap]}>
              <TouchableOpacity 
                    onPress={() => navigate("IncomePage")}
                    style={[styles.flexBetween, styles.list, styles.borderBottom]}>
                    <View style={styles.flexStart}>
                        <Image style={styles.icon} source={require("./imgs/003.png")} />
                        <Text style={styles.title}>我的营收</Text>
                    </View>
                    <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigate("StagePropertyPage")}
                    style={[styles.flexBetween, styles.list, styles.borderBottom]}>
                    <View style={styles.flexStart}>
                        <Image style={styles.icon} source={require("./imgs/004.png")} />
                        <Text style={styles.title}>我的道具</Text>
                    </View>
                    <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigate("LevelTaskPage", {nickName: this.state.nickName, avatar: this.state.headIcon})}
                    style={[styles.flexBetween, styles.list]}>
                    <View style={styles.flexStart}>
                        <Image style={styles.icon} source={require("./imgs/005.png")} />
                        <Text style={styles.title}>等级任务</Text>
                    </View>
                    <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
                </TouchableOpacity>
            </View>
            <View style={[styles.borderTopAndBottom, styles.itemWrap]}>
              <TouchableOpacity 
                  onPress={() => navigate("CustomerServicePage")}
                  style={[styles.flexBetween, styles.list, styles.borderBottom]}>
                  <View style={styles.flexStart}>
                      <Image style={styles.icon} source={require("./imgs/006.png")} />
                      <Text style={styles.title}>有问题找客服</Text>
                  </View>
                  <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.shareFn}
                style={[styles.flexBetween, styles.list]}>
                  <View style={styles.flexStart}>
                      <Image style={styles.icon} source={require("./imgs/007.png")} />
                      <Text style={styles.title}>分享App当房主</Text>
                  </View>
                  <View style={styles.flexStart}>
                      <View style={[styles.flexStart, {alignItems: "center"}]}>
                          <Text style={styles.lastTitle}>邀请码:</Text>
                          <Text style={styles.lastValue}>{this.state.invitationCode}</Text>
                      </View>
                      <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
                  </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.borderTopAndBottom, styles.itemWrap]}>
              <TouchableOpacity 
                  onPress={() => navigate("SettingPage", {isMute: this.state.isMute})}
                  style={[styles.flexBetween, styles.list]}>
                  <View style={styles.flexStart}>
                      <Image style={styles.icon} source={require("./imgs/set.png")} />
                      <Text style={styles.title}>设置</Text>
                  </View>
                  <Icon name={'privateIcon|arrow-right'} size={12} color={'#bfbfc4'} />
              </TouchableOpacity>

            </View>
            <Loading isShow={this.state.isFetching}/>
        </ScrollView>
      </View>
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
  borderTopAndBottom: {
    borderTopWidth: 1,
    borderTopColor: "#e1e0e5",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e0e5",
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#e9e9e9",
  },
  userInfo: {
    backgroundColor: "#fff",
    paddingTop: 10,
    paddingRight: 22,
    paddingBottom: 10,
    paddingLeft: 15,
    marginTop: 14
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 4,
    marginRight: 9,
  },
  grade: {
    fontSize: 7,
    color: "#ffffff",
    backgroundColor: "#ffc701",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 3,
    paddingRight: 3,
    marginLeft: 3
  },
  phone: {
    fontSize: 12,
    color: "#000000",
    marginTop: 6
  },
  itemWrap: {
    backgroundColor: "#fff",
    paddingLeft: 15,
    marginTop: 14,
  },
  list: {
    paddingRight: 18,
    paddingTop: 10,
    paddingBottom: 10
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 15
  },
	title: {
    textAlign: 'center',
    fontSize: 15,
    color: "#000000"
  },
  value: {
    fontSize: 13,
    color: "#8a8a99"
  },
  unit: {
    fontSize: 6,
    color: "#8a8a99",
    marginTop: 3,
    marginRight: 7
  },
  lastTitle: {
    fontSize: 11,
    color: "#8a8a99"
  },
  lastValue: {
    fontSize: 13,
    color: "#8a8a99",
    marginRight: 7
  },
  btn: {
  	flex: 1,
	  color: '#0ba818',
	  padding: px2dp(10),
	  width: px2dp(120)
  }
})