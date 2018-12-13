import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    Platform
} from 'react-native'
import px2dp from '../../util/screenAdaptation'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'

import { Icon } from '../../components/icon'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const STATUS_BAR_HEIGHT = 20;

export default class RoomPage extends Component {
    constructor(props) {
        super(props)
    }

	
    entranceRoom = (data)=> {
        const { navigate } = this.props.navigation;
        navigate('RoomList', data)
    }
    
    
    render() { 
        const PrivateRoom = {
	        title: '接龙包间',
	        type: 2
        }
        
        const LobbyRoom = {
	        title: '接龙大厅',
	        type: 1
        }
       

        let statusBar = <View style={styles.statusBar}>
            <StatusBar 
                hidde={true}
                backgroundColor="#d95940" barStyle="light-content" />
        
        </View> 
        return (
            <View style={styles.container}>
                {statusBar}
                <View>
                    <Image
                        style={{width: windowWidth, height: windowHeight}}
                        source={require('./imgs/back.png')}
                    />
                    <View style={styles.content}>
                        <Text style={styles.headerTitle}>接龙红包</Text>
                        <Text style={styles.headerInfo}>
                            房间中，抢到手气最佳或手气最差红包的玩家，继续发送红包
                        </Text>
                        <TouchableOpacity style={[styles.spaceBetween, styles.item]} onPress={() => this.entranceRoom(LobbyRoom)}>
                            <View style={styles.flexStart}>
                                <Image style={styles.redPackage} source={require('./imgs/red.png')} />
                                <View>
                                    <Text style={styles.title}>接龙大厅</Text>
                                    <Text style={styles.info}>自由房间，玩家可在此畅游红包海洋</Text>
                                </View>
                            </View>
                            <View style={styles.flexStart}>
                                <Image style={styles.icon} source={require('./imgs/open.png')} />
                                <Icon name={'privateIcon|arrow-right'} size={px2dp(10)} color={'#ca9e51'} />
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.spaceBetween, styles.item]} onPress={() => this.entranceRoom(PrivateRoom)}>
                            <View style={styles.flexStart}>
                                <Image style={styles.redPackage} source={require('./imgs/red.png')} />
                                <View>
                                    <Text style={styles.title}>接龙包间</Text>
                                    <Text style={styles.info}>凭密码进入，可以与亲朋好友们一起抢红包</Text>
                                </View>
                            </View>
                            <View style={styles.flexStart}>
                                <Image style={styles.icon} source={require('./imgs/grab.png')} />
                                <Icon name={'privateIcon|arrow-right'} size={px2dp(10)} color={'#ca9e51'} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.step}>
                            <Text style={styles.stepTitle}>踩雷红包</Text>
                            <Text style={styles.stepInfo}>即将上线 敬请期待!</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#d95940'
    },  
    item: {
        backgroundColor: '#ecd6ae',
        width: windowWidth - px2dp(180),
        marginLeft: px2dp(90),
        paddingTop: px2dp(24),
        paddingBottom: px2dp(24),
        paddingLeft: px2dp(24),
        paddingRight: px2dp(18),
        borderRadius: px2dp(12),
        marginBottom: windowHeight * 40 / 1334
    },
    redPackage: {
        width: px2dp(50),
        height: px2dp(56),
        marginRight: px2dp(14)
    },
    icon: {
        width: px2dp(40),
        height: px2dp(40),
        marginRight: px2dp(6)
    },
    title: {
        fontSize: px2dp(26),
        color: '#e25438',
    },
    info: {
        fontSize: px2dp(18),
        color: '#ca9e51'    
    },
    buttonStyle:{
        margin:px2dp(40),
        backgroundColor:'white',
        borderColor:'red',
        borderRadius:px2dp(10),
        borderWidth:2,
    },
    textStyle:{
        color:'red',
        fontSize:px2dp(40),
    },
    content: {
        position: 'absolute',
        width: windowWidth
    },
    headerTitle: {
        fontSize: px2dp(40),
        fontWeight: '600',
        color: "#fff",
        textAlign: 'center',
        marginTop: windowHeight * 100 / 1334
    },
    headerInfo: {
        fontSize: px2dp(20),
        color: "#fff",
        textAlign: 'center',
        marginTop: windowHeight * 26 / 1334,
        marginBottom: windowHeight * 100 / 1334
    },
    step: {
        marginTop: windowHeight * 140 / 1334,
    },
    stepTitle: {
        fontSize: px2dp(42),
        color: "#575656",
        textAlign: 'center',
        fontWeight: '600'
    },
    stepInfo: {
        fontSize: px2dp(20),
        color: "#1bac19",
        textAlign: 'center'
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    },
})