import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import { modifyUserInfoSocket } from '../../request/api/socket'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

const windowWidth = Dimensions.get('window').width;
import { Icon } from '../../components/icon'
import { nameReg } from '../../configs/regular'

export default class UserNamePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            name: ''
        }
    }

    componentDidMount() {
        let nickName = this.props.navigation.state.params.nickName;
        this.setState({
            name: nickName
        })
    }

    onBackFn = ()=> {
        this.props.navigation.goBack()
    }
    clearFn = ()=> {
        this.setState({
            name: ''
        })
    }
    submitFn = ()=> {
        if(this.state.name.replace(/\s+/g, "") === "") {
            Alert.alert(
				'提示', 
				'昵称不能为空!',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return
        }
        if (!nameReg.test(String(this.state.name).replace(/\s+/, '')) || this.state.name.length > 10) {
            Alert.alert(
				'提示', 
				'房间名字只能输入中文、英文、数字，且不能大于8个字',
				[
					{text: '确定', onPress: () => { console.warn('确定')}}
				]
			)
            return
        }

        let data = {
            nickName: this.state.name
        }
        this._modifyUserInfoSocket(data)
    }

    _modifyUserInfoSocket(data) {
        this.setState({
            isFetching: true
        })
        modifyUserInfoSocket(data)
        .then(res => {
            this.setState({
                isFetching: false
              })
            DeviceEventEmitter.emit('ChangeUI', { update: true}); 
            this.props.navigation.goBack()
        })
        .catch(err => {
            this.setState({
                isFetching: false
              })
            console.warn(JSON.stringify(err))
        })
    }

    render() {
        let rightButton = <TouchableOpacity onPress={this.submitFn}>
                            <View style={{margin: 10}}>
                                <Text style={{color: '#316834', fontSize: 15}}>完成</Text>
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
            title = "设置昵称"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
            rightButton={rightButton}
        />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                <View style={styles.container}>
                    {navigationBar}
                    <View style={styles.inputWrap}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            autoFocus = {true}
                            maxLength={8}
                        />
                        <Text onPress={this.clearFn} >
                            <Icon name={'privateIcon|clear'} size={14} color={'#cccccc'} />
                        </Text>
                    </View>
                    <Text style={styles.note}>昵称只能输入中文、英文、数字，且不能大于8个字</Text>
                    <Loading isShow={this.state.isFetching}/>
                </View>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: windowWidth,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15
    },
    input: {
        width: windowWidth - 30 - 20,
        backgroundColor: '#fff',
        paddingTop: 13,
        paddingBottom: 13
    },
    icon: {
        fontFamily: 'iconfont',
        color: '#cccccc',
        fontSize: 14
    },
    note: {
        fontSize: 11,
        color: "#525459",
        marginLeft: 20,
        marginTop: 8,
        marginBottom: 20
    },
})