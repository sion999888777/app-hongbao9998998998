import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    CameraRoll,
    Clipboard,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import { captureScreen } from "react-native-view-shot";
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Icon } from '../../components/icon'

export default class RoomSharePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: {
                url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
            },
        }
    }
    backFn = ()=> {
        this.props.navigation.goBack()
    }
    screenFn = ()=> {
        captureScreen({
            format: "jpg",
            quality: 1
          })
          .then(
            uri => {
                CameraRoll.saveToCameraRoll(uri).then(result => {
                    Alert.alert(
                        '提示', 
                        '保存成功!',
                        [
                            {text: '确定', onPress: () => { console.warn('确定')}}
                        ]
                    )
                }).catch(error => {
                    console.warn(error)
                })
                
                },
            error => console.error("Oops, snapshot failed", error)
          );
    }
    async copy(){
        Clipboard.setString(this.state.text);
        let  str = await Clipboard.getString();
        console.log(str)//我是文本
    }

    render() {
        let navigationBar = <NavigationBar
                    title = "房间分享"
                    statusBar={{
                        backgroundColor: '#212025'
                    }}
                    leftButton={WidgetView.getLeftButton(() => this.backFn())}
                />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                  {navigationBar}
                   <ScrollView>
                        <View style={styles.itemWrap}>
                            <View style={styles.infoList}>
                                <Text style={styles.name}>房间名称</Text>
                                <Text style={styles.value}>红包发发发</Text>
                            </View>
                            <View style={styles.infoList}>
                                <Text style={styles.name}>房号</Text>
                                <Text style={styles.value}>888</Text>
                            </View>
                            <View style={styles.infoList}>
                                <Text style={styles.name}>房间密码</Text>
                                <Text style={styles.value}>fa4s51km</Text>
                            </View>
                            <View style={styles.infoList}>
                                <Text style={styles.name}>注册邀请码</Text>
                                <Text style={styles.value}>zzyxzz</Text>
                            </View>
                            <View style={styles.roomInfo}>
                                <Text style={styles.name}>房间介绍</Text>
                                <Text style={styles.value}>
                                    底金固定为50元，共10份，5%为红包池基金 每天晚上8点，房主会发红包 下载app  进入 房间 立即抢红包！
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemWrap}>
                            <Text style={[styles.name, {marginTop: 10}]}>疯狂红包App二维码</Text>
                            <Image
                                style={styles.code}
                                source={require('./imgs/code.jpg')}
                            />
                        </View>
                        
                        <TouchableOpacity onPress={this.copy.bind(this)}>
                            <View>
                                <Text>点击复制到剪贴板</Text>
                            </View>
                        </TouchableOpacity>


                        <View style={styles.footer}>
                            <TouchableOpacity 
                                onPress={this.screenFn}
                                style={styles.screenWrap} >
                                <Icon name={'privateIcon|jietu'} size={14} color={'#fff'} />
                                <Text style={[styles.footerText, {marginLeft: 23}]}>屏幕截图</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={this._setClipboardContent}
                                style={styles.codeWrap}>
                                <Icon name={'privateIcon|lianjie'} size={14} color={'#fff'} />
                                <Text style={[styles.footerText, {marginLeft: 10}]}>复制URL链接</Text>
                            </TouchableOpacity>
                        </View>
                   </ScrollView>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    itemWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#e1e0e5',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e0e5',
        marginTop: 18
    },  
    infoList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e9e9e9"
    },
    roomInfo: {
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e9e9e9"
    },
    name: {
        fontSize: 16,
        color: "#1a1a1a"
    },
    value: {
        fontSize: 15,
        color: "#a6a6a6"
    },
    code: {
        width: 115,
        height: 115,
        marginLeft: (windowWidth - 115 - 30) / 2,
        marginTop: 15,
        marginBottom: 25
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: (windowWidth - 155 - 155 - 18) / 2,
        marginBottom: windowHeight * 0.1,
        marginTop: 18
    },
    screenWrap: {
        backgroundColor: "#6682ff",
        width: 155,
        marginRight: 18,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
    },
    codeWrap: {
        backgroundColor: "#27c92d",
        width: 155,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16
    },
    footerText: {
        fontSize: 16,
        color: "#fff",
    }
})