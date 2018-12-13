import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Button from '../../components/Button/index'
import Loading from '../../common/loading/index'
import CountTimeComponent from '../../common/countTime'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { getSmsCode } from '../../request/api/loginApi'
import { modifyUserInfoSocket } from '../../request/api/socket'
const windowWidth = Dimensions.get('window').width;

export default class NewPhonePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isFetching: false,  // 是否在请求接口
        oldPhoneNum: "",
        newPhoneNum: "",
        code: "",
    }
  }

  componentDidMount() {
    let phone = this.props.navigation.state.params.phone;
    this.setState({
        oldPhoneNum: phone
    })
}

  onBackFn = ()=> {
    this.props.navigation.goBack()
  } 
  submitFn = ()=> {
      const { navigate } = this.props.navigation;
    let data = {
        phone: this.state.oldPhoneNum,
        newPhone: this.state.newPhoneNum,
        vertify: this.state.code
    }
 
    modifyUserInfoSocket(data)
        .then(res => {
            console.warn('reresress', JSON.stringify(res))
           if(res.status !== "0") {
               return 
           } 
           console.warn('here')
           DeviceEventEmitter.emit('ChangeUI', { update: true});
        //    _This.props.navigation("UserInfoPrivatePage")
            navigate("UserInfoPrivatePage")
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

  _getCodeFn = ()=> {
    let data = {
        phoneNum: this.state.newPhoneNum,
        isInternational: '1', // 0国际 1国内
        type: '4' // 1注册 2找回密码  3替换手机号 4替换手机号(新)
    }
    
    this.setState({
        isFetching: true
    })
    getSmsCode(data)
        .then(res => {
            console.warn(JSON.stringify(res))
            this.setState({
                isFetching: false
            })
        })
        .catch(err => {
            this.setState({
                isFetching: false
            })
            console.warn(err)
        })
  }

  render() {
    let navigationBar = <NavigationBar
        title = "新手机号绑定"
        statusBar={{
            backgroundColor: '#212025'
        }}
        leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
    />
    return (
        <SafeAreaViewPlus  
            topColor={'#212025'}
            bottomInset={false}>
         {navigationBar}
          <View style={[styles.itemWrap, styles.borderTopAndBottom]}>
                <View style={[styles.flexBetween, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                    <View style={[styles.flexStart]}>
                        <Text style={styles.title}>新手机</Text>
                        <TextInput
                            style={styles.value}
                            placeholder = "请填写新的手机号"
                            onChangeText={(newPhoneNum) => this.setState({newPhoneNum})}
                            value={this.state.newPhoneNum}
                        />
                    </View>

                    <CountTimeComponent
                        getSmsCodeFn={this._getCodeFn}
                        phoneNum={this.state.newPhoneNum}
                    />
                </View>
                <View style={[styles.flexStart, styles.list]}>
                    <Text style={styles.title}>短信验证</Text>
                    <TextInput
                        style={styles.value}
                        placeholder = "新手机号接收到的验证码"
                        onChangeText={(code) => this.setState({code})}
                        value={this.state.code}
                    />
                </View>
          </View>
          <Text style={styles.note}>确认修改后, 该账户将只能通过新手机号登录.</Text>
          <Button
                enable={true}
                textStyle={styles.textStyle}
                text='确认修改'
                buttonStyle={styles.buttonStyle}
                onPress={this.submitFn}/>
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
      paddingRight: 15
  },
  title: {
      fontSize: 15,
      color: "#000000",
      width: 85
  },
  value: {
    fontSize: 15,
    color: "#000000",
    paddingTop: 10,
    paddingBottom: 10
  },
  note: {
    fontSize: 11,
    color: "#525459",
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 20
  },
  buttonStyle: {
    width: windowWidth - 30,
    backgroundColor: "#a6cea5",
    marginLeft: 15,
    borderWidth: 1,
    borderColor: "#70b06e"
  },
  textStyle: {
    color: "#e8ede8"
  },
})