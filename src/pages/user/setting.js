import React, { Component } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    Text,
    Switch,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Button from '../../components/Button/index'
import { loginOutSocket } from "../../request/api/socket"
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'
import { modifyUserInfoSocket } from '../../request/api/socket'

const {width, height} = Dimensions.get('window');

export default class SettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchIsOn: false,  // 消息免打扰开关
        }
    }
    
    componentDidMount() {
          this.getVersion()
   
          let isMute = this.props.navigation.state.params.isMute 
          if(isMute === 0) {
              this.setState({
                switchIsOn: false
              })
          } else {
            this.setState({
                switchIsOn: true
            })
          }
    }
    
    getVersion = async () => {
      let version = await AsyncStorage.getItem('version').then()
      this.setState({version})
    }
    
    submitFn = () => {
        loginOutSocket()
        AsyncStorage.removeItem('token')
        .then(() => {
            this.props.navigation.navigate("Login")
        })
    }

    onBackFn = ()=> {
        this.props.navigation.goBack()
        if(this.state.switchIsOn === 0) {
            AsyncStorage.setItem('playAudio', "no")
        } else {
          AsyncStorage.setItem('playAudio', "yes")
        }
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }

      // 消息免打扰
    controlSoundFn = (value)=> {
        this.setState({switchIsOn: value})

        let isMute = null
        if(value) {
            isMute = 1
        } else {
            isMute = 0
        }

        let data = {
            isMute: isMute
        }
        this._modifyUserInfoSocket(data)
    }

    _modifyUserInfoSocket(data) {
        this.setState({
            isFetching: true
        })
        modifyUserInfoSocket(data)
        .then(res => {
            console.warn(JSON.stringify(res))
            // DeviceEventEmitter.emit('ChangeUI', { update: true});
            // this.props.navigation.goBack()
        })
        .catch(err => {
            console.warn(JSON.stringify(err))
        })
    }
  
    render() {
        let navigationBar = <NavigationBar
            title = "设置"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
        />
        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                <View style={styles.container}>
                    {navigationBar}
                    <View style={styles.header}>
                        <Image
                            style={styles.loginImg}
                            source={require('./imgs/crazy.png')}
                            resizeMode ='contain'
                        />
	                    <Text style={{textAlign: 'center', paddingBottom: 50}}>v{this.state.version}</Text>
                    </View>
                    <View 
                        onPress={() => navigate("SettingPage")}
                        style={[styles.flexBetween, styles.list]}>
                        <View style={styles.flexStart}> 
                            <Text style={styles.title}>消息免打扰</Text>
                        </View>
                        <Switch
                                onValueChange={(value) => this.setState({switchIsOn: value})}
                                onValueChange={(value) => this.controlSoundFn(value)}
                                style={{marginBottom:10,marginTop:10}}
                                trackColor='#4bd763'  //开关打开时的背景颜色
                                tintColor='#eaeaea' //关闭时背景颜色
                                value={this.state.switchIsOn} />
                    </View>
                    <Button
                        enable={true}
                        textStyle={styles.textStyle}
                        text='退出登录'
                        buttonStyle={styles.buttonStyle}
                        onPress={this.submitFn}/>
                </View>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1eef5",
    },
    header: {
        marginTop: 14, 
        marginBottom: 12, 
        backgroundColor: "#fff", 
        // height: height*0.26,
        borderTopWidth: 1,
        borderTopColor: "#e1e0e5",
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
    },
    loginImg: {
        width: width*0.22, 
        marginLeft: (width - width*0.22)/2,
    },
    buttonStyle: {
        width: width,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e1e0e5",
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
      },
      textStyle: {
        color: "#000000"
      },


      flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
      flexBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      list: {
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: "#fff",
        marginBottom: 10
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
})

