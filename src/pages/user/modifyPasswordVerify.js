import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Button from '../../components/Button/index'
import Loading from '../../common/loading/index'
import CountTimeComponent from '../../common/countTime'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { getSmsCode, verifyCodeHttp } from '../../request/api/loginApi'
const windowWidth = Dimensions.get('window').width;

export default class ModifyPasswordVerifyPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isFetching: false,  // 是否在请求接口
        phoneNum: "",
        phoneNum: "",
        code: "",
        type: null,
        codeToken: null,
    }
  }

  componentDidMount(){
      this.setState({
        phoneNum: this.props.navigation.state.params.phone ? this.props.navigation.state.params.phone : null,
        type: this.props.navigation.state.params.type ? this.props.navigation.state.params.type : null
      })
  }

  onBackFn = ()=> {
    this.props.navigation.goBack()
  } 
  submitFn = ()=> {
    const { navigate } = this.props.navigation;
    let phoneNum = this.state.phoneNum

    let data = {
        phoneNum,
        // type: '5', // 修改登录密码
        type: this.state.type === "loginPwd" ? '5' : '6', 
        vertifyCode: this.state.code
    }
    // this.setState({
    //     isFetching: true
    // })
    verifyCodeHttp(data)
        .then(res => {
            console.warn('resresres', JSON.stringify(res))
            this.setState({
                isFetching: false
            })
            if(res.status !== "200") {
                Alert.alert(
                    '提示', 
                    res.msg,
                    [
                        {text: '确定', onPress: () => { console.warn('确定')}}
                    ]
                )
                return
            }
            this.setState({
                codeToken: res.data
            })
            if(this.state.type === "loginPwd") {    // 修改登录密码
                navigate("UserPasswordSetPage", {modifyToken: this.state.codeToken})
            } else
            if(this.state.type === "withdrawPwd") { // 修改提现密码
                navigate("WithdrawChangePage", {modifyToken: this.state.codeToken})
            } else
            if(this.state.type === "withdrawPwdSet") { // 第一次设置 提现密码
                navigate("WithdrawPage", {modifyToken: this.state.codeToken})
            } 
        })
        .catch(err => {
            this.setState({
                isFetching: false
            })
            console.log("最终错误", err)
            console.warn(err)
        })
  }

  _getCodeFn = ()=> {
    let data = {
        phoneNum: this.state.phoneNum,
        isInternational: '1', // 0国际 1国内
        type: this.state.type === "loginPwd" ? '5' : '6', 
    }
    // this.setState({
    //     isFetching: true
    // })

    getSmsCode(data)
        .then(res => {
            console.warn(JSON.stringify(res))
            // this.setState({
            //     isFetching: false
            // })
        })
        .catch(err => {
            console.warn(err)
        })
  }

  render() {
    let navigationBar = <NavigationBar
        title = "短信验证"
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
                <View style={[styles.flexStart, styles.list]}>
                        <Text style={styles.title}>手机号</Text>
                        <TextInput
                            style={styles.value}
                            // placeholder = "请填写绑定的手机号"
                            editable={true}
                            value={this.state.phoneNum}
                        />
                    </View>

                    <CountTimeComponent
                        getSmsCodeFn={this._getCodeFn}
                        phoneNum={this.state.phoneNum}
                    />
                </View>
                <View style={[styles.flexStart, styles.list]}>
                    <Text style={styles.title}>短信验证</Text>
                    <TextInput
                        style={styles.value}
                        placeholder = "请输入短信验证码"
                        onChangeText={(code) => this.setState({code})}
                        value={this.state.code}
                    />
                </View>
          </View>
      
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
    marginTop: 14,
    marginBottom: 20
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
    paddingTop: 13,
    paddingBottom: 13
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