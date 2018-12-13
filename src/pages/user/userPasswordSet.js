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
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

const windowWidth = Dimensions.get('window').width;
import { pwdReg } from '../../configs/regular'
import { modifyUserInfoSocket } from '../../request/api/socket'

export default class UserPasswordSetPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
        isFetching: false,  // 是否在请求接口
        loginPassword: '',  // 旧密码
        newLoginPassword: '',   // 新密码
        newPwdRepeat: '',
        modifyToken: ""
    }
  }

  componentDidMount() {
      this.setState({
        modifyToken: this.props.navigation.state.params.modifyToken ? this.props.navigation.state.params.modifyToken : null
      })
  }

  onBackFn = ()=> {
    this.props.navigation.goBack()
  } 
  submitFn = ()=> {
    const pwd = pwdReg.test(this.state.newLoginPassword)

    if(this.state.loginPassword.replace(/\s+/g, "") === "") {
        Alert.alert(
            '提示', 
            '请输入原密码!',
            [
                {text: '确定', onPress: () => { console.warn('确定')}}
            ]
        )
        return
    }

    if(this.state.newPwdRepeat !== this.state.newLoginPassword) {
        Alert.alert(
            '提示', 
            '两次密码输入不一致!',
            [
                {text: '确定', onPress: () => { console.warn('确定')}}
            ]
        )
        return
    }

    if (!pwd) {
        Alert.alert(
            '提示', 
            '密码必须为6位以上数字加字母组合!',
            [
                {text: '确定', onPress: () => { console.warn('确定')}}
            ]
        )
        return
    }

    let data = {
        loginPassword: this.state.loginPassword,
        newLoginPassword: this.state.newLoginPassword,
        modifyToken: this.state.modifyToken 
    }
    this._modifyPwdFn(data)
  }

  _modifyPwdFn(data) {
    modifyUserInfoSocket(data)
    .then(res => {
        console.warn('res', JSON.stringify(res))
        if(res.status !== "0"){
            return
        }
        this.props.navigation.navigate("UserInfoPrivatePage")
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

  render() {
    let navigationBar = <NavigationBar
        title = "修改密码"
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
          <View style={styles.itemWrap}>
                <View style={[styles.flexStart, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                    <Text style={styles.title}>原密码</Text>
                    <TextInput
                        style={styles.value}
                        placeholder = "请填写旧密码"
                        onChangeText={loginPassword => { this.setState({loginPassword}) }}
                    />
                </View>
                <View style={[styles.flexStart, styles.list, {borderBottomWidth: 1, borderBottomColor: "#e9e9e9"}]}>
                    <Text style={styles.title}>新密码</Text>
                    <TextInput
                        style={styles.value}
                        // secureTextEntry
                        placeholder = "请输入新的密码"
                        onChangeText={newLoginPassword => { this.setState({newLoginPassword}) }}
                    />
                </View>
                <View style={[styles.flexStart, styles.list]}>
                    <Text style={styles.title}>再次确认</Text>
                    <TextInput
                        style={styles.value}
                        // secureTextEntry
                        placeholder = "请再次输入新密码"
                        onChangeText={newPwdRepeat => { this.setState({newPwdRepeat}) }}
                    />
                </View>
          </View>
          <Text style={styles.note}>密码必须至少8个字符,而且同时包含字母和数字</Text>
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
  }
})