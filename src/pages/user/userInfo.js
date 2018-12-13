import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import { getUserInfoSocket } from '../../request/api/socket'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import config from '../../request/config'
import { Icon } from '../../components/icon'
 
export default class UserInfoPrivatePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isFetching: false,  // 是否在请求接口
        headIcon: "",   // 个人中心 - 头像
        nickName: "",   // 昵称
        phone: "",    // 手机号 
        withdrawPassword: "",  //提现密码
        createDate: "", // 创建日期
        redPackWinCount: "",  //  抢得红包数 
        createTime: null
    }
  }

  componentDidMount() {
    this._getUserInfoFn()
     
    // 获取子级传过来的数据
    DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
        if(dic.update) {
            this._getUserInfoFn()
        }   
   });
  }

  _getUserInfoFn() {
    // this.setState({
    //     isFetching: true
    // })
    getUserInfoSocket()
    .then(res => {
        console.warn(JSON.stringify(res.headIcon))
        // this.setState({
        //     isFetching: false
        //   })
      
        this.setState({
            headIcon: res.headIcon ? config.imgUrl+res.headIcon : config.defaultUserAvatarBase64,   // 个人中心 - 头像
            nickName: res.nickName,   // 昵称
            phone: res.phone,    // 手机号 
            withdrawPassword: res.withdrawPassword,  //提现密码
            createDate: res.createDate, // 创建日期
            redPackWinCount: res.redPackWinCount,  //  抢得红包数 
            createTime: res.createDate
        })
    })
    .catch(err => {
        // this.setState({
        //     isFetching: false
        //   })
        console.warn(JSON.stringify(err))
    })
  }

    backFn = ()=> {
        DeviceEventEmitter.emit('ChangeUI', { update: true});
        this.props.navigation.goBack()
    }

  render() {
	  const { navigate } = this.props.navigation;
    
    let navigationBar = <NavigationBar
        title = "个人信息"
        statusBar={{
            backgroundColor: '#212025'
        }}
        leftButton={WidgetView.getLeftButton(this.backFn)}
    />
    return (
        <SafeAreaViewPlus  
            topColor={'#212025'}
            bottomInset={false}>
         {navigationBar}
          <View style={[styles.borderTopAndBottom, styles.itemWrap]}>
            <TouchableOpacity  
                onPress={() => navigate("UploadPicPage", {type: "user", img: this.state.headIcon})} 
                style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9", paddingTop: 8,paddingBottom: 8}]}>
                <Text style={styles.title}>头像</Text>
                <View style={styles.flexStart}>
                    <Image
                        resizeMode ='stretch'
                        style={styles.avatar}
                        source={{uri: this.state.headIcon}}
                    />
                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#bfbfc4'} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => navigate("UserNamePage", {nickName: this.state.nickName})} 
                style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                <Text style={styles.title}>昵称</Text>
                <View style={styles.flexStart}>
                    <Text style={styles.valueR}>{this.state.nickName}</Text>
                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#bfbfc4'} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => navigate("PhoneModifyPage", {phone: this.state.phone})} 
                style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                <Text style={styles.title}>手机号</Text>
                <View style={styles.flexStart}>
                    <View style={styles.lock}>
                        <Icon name={'privateIcon|wo-shouji'} size={7} color={'#fff'} />
                    </View>
                    <Text style={styles.valueR}>{this.state.phone}</Text>
                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#bfbfc4'} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("ModifyPasswordVerifyPage", {phone: this.state.phone, type: "loginPwd"})} 
              style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                <Text style={styles.title}>登录密码</Text>
                <View style={styles.flexStart}>
                    <Text style={styles.valueR}>******</Text>
                    <Icon name={'privateIcon|arrow-right'} size={11} color={'#bfbfc4'} />
                </View>
            </TouchableOpacity>
            {
                this.state.withdrawPassword === "true" ? 
                <TouchableOpacity 
                    onPress={() => navigate("ModifyPasswordVerifyPage", {phone: this.state.phone, type: "withdrawPwd"})} 
                    style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                    <Text style={styles.title}>提现密码</Text>
                    <View style={styles.flexStart}>
                        <Text style={styles.valueR}>******</Text> 
                        <Icon name={'privateIcon|arrow-right'} size={11} color={'#bfbfc4'} />
                    </View>
                </TouchableOpacity> :
                <TouchableOpacity 
                    onPress={() => navigate("ModifyPasswordVerifyPage", {phone: this.state.phone, type: "withdrawPwdSet"})}  
                    style={[styles.flexBetween, styles.list]}>
                    <Text style={styles.title}>提现密码</Text>
                    <View style={styles.flexStart}>
                        <Text style={styles.valueR}>未设置</Text>
                        <Icon name={'privateIcon|arrow-right'} size={11} color={'#bfbfc4'} />
                    </View>
                </TouchableOpacity>
            }
          </View>
          <View style={[styles.borderTopAndBottom, styles.itemWrap]}>
            <View style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                <Text style={styles.title}>注册时间</Text>
                <Text style={styles.value}>{this.state.createTime}</Text>
            </View>
            <View style={[styles.flexBetween, styles.list]}>
                <Text style={styles.title}>战绩</Text>
                <Text style={styles.value}>共获得{this.state.redPackWinCount}个红包</Text>
            </View>
          </View>
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
  borderTopAndBottom: {
    borderTopWidth: 1,
    borderTopColor: "#e1e0e5",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e0e5",
  },
  itemWrap: {
    backgroundColor: "#fff",
    paddingLeft: 15,
    marginTop: 14
  },
  list: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingRight: 15
  },
  title: {
    fontSize: 15,
    color: "#000000"
  },
  value: {
    fontSize: 13,
    color: "#888888"
  },
  valueR: {
    fontSize: 13,
    color: "#888888",
    marginRight: 6
  },
  avatar: {
    width: 67,
    height: 67,
    marginRight: 6
  },
  lock: {
      width: 15,
      height: 15,
      borderRadius: 15,
      backgroundColor: "#45c01a",
      flexDirection: 'row',
      justifyContent: "center",
      alignItems: 'center',
      marginRight: 5
  }
})