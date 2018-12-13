import React, { Component } from 'react'
import {
	View,
	StyleSheet,
	BackHandler,
	AsyncStorage,
    NativeModules,
	DeviceEventEmitter,
    Alert
} from 'react-native'
const {RNUpdateApp} = NativeModules
import TabNavigator from 'react-native-tab-navigator'
import RoomPage from './room/index'
import ActivityPage from './activity/index'
import MallPage from './mall/index'
import MyPage from './user/index'
import SafeAreaViewPlus from '../common/ios-private/SafeAreaViewPlus'

import Login from './login/login'
import SwiperPage     from '../pages/login/swiper'

import { Icon } from '../components/icon'
import SyncStorage from '../util/syncStorage'
import ws from '../request/socket'

import { updateApp } from '../request/api/updateApp'
import RNUpdate from '../common/uploadApp'
import { getUserInfoSocket } from '../request/api/socket'

export default class IndexPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'RoomPage',
            loginIs: false,
            logined: false,
            booted: false,
	          needUpdate: false
        }
        this.token = SyncStorage.getItem('token')
    }
    
    // 变更更新状态
    _updateState = (state) => {
        console.warn('state===', state)
        this.setState({needUpdate: state})
    }

    componentDidMount() {

        DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
            console.warn("loginUpdate", dic)
            if(dic.loginUpdate) {
              console.warn("触发了这里")
            //   this._getUserInfoFn()
                this.setState({
                    selectedTab: "RoomPage"
                })
            }
          })

	    DeviceEventEmitter.addListener('login', () => {
		    this.setState({logined: true})
		    ws.close()
		    ws.init()
	    })
	    DeviceEventEmitter.addListener('tokenPastDue', (msg) => {
		    Alert.alert(
			    '提示',
			    msg,
			    [
				    {text: '确定', onPress: () => { this.setState({logined: false}) }}
			    ]
		    )
	    })
	    
	    updateApp()
		    .then(res => {
		    	AsyncStorage.setItem('version', res.data.version)
			    let oldVersion = parseInt(RNUpdateApp.appVersion.replace(/\./g, ''))
			    let newVersion = parseInt(res.data.version.replace(/\./g, ''))
			    
			    console.warn('oldVersion=', oldVersion)
			    console.warn('newVersion=', newVersion)
			    if (oldVersion < newVersion) {
				    this.setState({needUpdate: true}, () => {
					    console.warn('需要更新aaa')
				    })
			    }
		    })

        this._asyncAppStatus()
    }
	
    onBeforeStart = async () => {
        let result = await updateApp().then()
        const { version } = result.data
    
	      console.warn('版本=', version)
        return {
            version,
            filename: 'app-release.apk',
            url: 'http://27.255.94.211:8887/app-release.apk',
            desc: ['修复了部分BUG', '优化用户体验!']
        }
    }
	
    _asyncAppStatus = async () => {
        let token = await AsyncStorage.getItem('token').then()
        let booted = await AsyncStorage.getItem('booted').then()
        let newState = {}
        // 如果token存在并没有过期
        
        
        // let res = await ws.regAuthToken().then()

        if (token) {
	        newState.logined = true
        }
        
        if (booted === 'booted') {
	        newState.booted = true
        }
        
        this.setState(newState)
    }
    
    _afterLogin = (token) => {
        console.warn('登录token=', token)
	    AsyncStorage.setItem('token', token)
		    .then(() => {
          ws.close()
          ws.init()

          setTimeout(() => {
              this.setState({logined: true})
          }, 300)
		    })
    }
    
    _afterBooted = () => {
	    AsyncStorage.setItem('booted', 'booted')
		    .then(() => {
			    this.setState({booted: true})

//			    const { navigate } = this.props.navigation
//			    navigate("IndexPage")
		    })
    }
    

 //双击返回键退出程序
    //添加BackHandler，ToastAndroid的注册
    componentWillMount (){
        //执行一次，在初始化render之前执行
        // BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
	
	    this._asyncAppStatus()
    }
    componentWillUnmount() {//当组件要被从界面上移除的时候，就会调用componentWillUnmount(),在这个函数中，可以做一些组件相关的清理工作，例如取消计时器、网络请求等
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    
    onBackAndroid = () => {
        //这里的路由信息是你自己项目中的，通过这个原理，我们还是可以提示一些其他信息，比如表单没填写完整等等
        // if(this.props.navigation.state.routeName=="Chat"){//写入当前页面的路由信息
        //     if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {//按第二次的时候，记录的时间+2000 >= 当前时间就可以退出
        //         //最近2秒内按过back键，可以退出应用。
        //         BackHandler.exitApp() //退出整个应用
        //         return false
        //     }
        //     this.lastBackPressed = Date.now();//按第一次的时候，记录时间
        //     ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);//显示提示信息
        //     return true
        // }else{
        //     return true
        // }
    }

    userPageFn = ()=> {
        this.setState({ selectedTab: 'MyPage' })
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }
    
    render() {
	    // 判断是否需要更新APP
	    if (this.state.needUpdate) {
		    return (
			    <View>
				    <RNUpdate
					    onBeforeStart={this.onBeforeStart}
					    updateState={this._updateState}
					    progressBarColor="#f50"
					    updateBoxWidth={250}      // 选填，升级框的宽度
					    updateBoxHeight={250}      // 选填，升级框的高度
					    updateBtnHeight={38}       // 选填，升级按钮的高度
              //bannerImage={require('./imgs/a.png')}  // 选填，换升级弹框图片
				    />
			    </View>
		    )
	    }
     
	    if(!this.state.booted) {
		    return <SwiperPage {...this.props} afterBooted={this._afterBooted}/>
	    }
	    
	    if(!this.state.logined) {
		    return <Login {...this.props} afterlogin={this._afterLogin}/>
      }
  
      const Root=<SafeAreaViewPlus
                topColor={'#212025'}
                bottomInset={false}>
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'RoomPage'}
                        title="房间"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() =>   <Icon name={'privateIcon|fangjian1'} size={20} color={'#75767a'} /> }
                        renderSelectedIcon={() => <Icon name={'privateIcon|fangjian-on1'} size={20} color={'#1bac19'}/> }
                        onPress={() => this.setState({ selectedTab: 'RoomPage' })}>
                        <RoomPage {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'ActivityPage'}
                        title="活动"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() =>   <Icon name={'privateIcon|huodong'} size={20} color={'#75767a'} /> }
                        renderSelectedIcon={() => <Icon name={'privateIcon|huodong-on'} size={20} color={'#1bac19'}/> }
                        onPress={() => this.setState({ selectedTab: 'ActivityPage' })}
                    >
                        <ActivityPage {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'MallPage'}
                        title="商城"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() =>   <Icon name={'privateIcon|shangdian'} size={20} color={'#75767a'} /> }
                        renderSelectedIcon={() => <Icon name={'privateIcon|shangdian-on'} size={20} color={'#1bac19'}/> }
                        onPress={() => this.setState({ selectedTab: 'MallPage' })}
                    >
                        <MallPage {...this.props}/>
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'MyPage'}
                        title="我的"
                        titleStyle={styles.tabText}
                        selectedTitleStyle={styles.selectedTabText}
                        renderIcon={() => <Icon name={'privateIcon|wo'} size={20} color={'#75767a'} /> }
                        renderSelectedIcon={() => <Icon name={'privateIcon|wo-on'} size={20} color={'#1bac19'}/> }
                        // onPress={() => {
	                    //     this.setState({ selectedTab: 'MyPage' })
                        // }}
                        onPress={this.userPageFn}
                    >
                        <MyPage {...this.props}/>
                    </TabNavigator.Item>
                </TabNavigator>
            </SafeAreaViewPlus>

	    return Root
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    page1: {
        flex: 1,
        backgroundColor: 'red'
    },
    page2: {
        flex: 1,
        backgroundColor: 'yellow'
    },
    tabText: {
        color: '#75767a'
    },
    selectedTabText: {
        color: '#1bac19'
    },
    icon: {
		textAlign: 'center',
        fontSize: 20,
	}
})