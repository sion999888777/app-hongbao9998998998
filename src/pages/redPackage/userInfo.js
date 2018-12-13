import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import { getUserInfoSocket } from '../../request/api/socket'
import config from '../../request/config'

export default class UserInfoPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: {
                url: "https://avatars2.githubusercontent.com/u/7970947?v=3&s=460",
            },
            userId: "",   // 上个页面带过来的用户信息
            userInfo: {}
        }
    }
    backFn = ()=> {
        this.props.navigation.goBack()
    }
 
    componentDidMount() {
        this.setState({
            userId: this.props.navigation.state.params.id
        }, ()=>{
            this._getUserInfoFn({
                id: this.state.userId
            })
        })
    }

    _getUserInfoFn(data) {
        getUserInfoSocket(data)
        .then(res => {
            console.warn(JSON.stringify(res))
            this.setState({
                userInfo: res
            })
        })
        .catch(err => {
            console.warn('errerrerrerrerr', JSON.stringify(err))
        })
      }

    render() {
        let navigationBar = <NavigationBar
                    title = "用户信息"
                    statusBar={{
                        backgroundColor: '#212025'
                    }}
                    leftButton={WidgetView.getLeftButton(() => this.backFn())}
                />

        return (
            <View>
                  {navigationBar}
                    <View>
                        <View style={styles.header}>
                            {
                                this.state.userInfo.headIcon ? 
                                <Image 
                                    resizeMode ='stretch'
                                    style={styles.avatar} 
                                    source={{uri: config.imgUrl+this.state.userInfo.headIcon }} /> :
                                <Image style={styles.avatar} source={require('./imgs/def.png')} />
                            }
                            <View style={styles.textWrap}>  
                                <Text style={styles.name}>{this.state.userInfo.nickName}</Text>
                                <Text style={styles.grade}>
                                    <Text>LV</Text>
                                    <Text>{this.state.userInfo.userLevel}</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemWrap}>
                            <View style={styles.infoList}>
                                <Text style={styles.name}>注册时间</Text>
                                <Text style={styles.time}>{this.state.userInfo.createDate}</Text>
                            </View>
                            <View style={[styles.infoList, {borderBottomWidth: 0}]}>
                                <Text style={styles.name}>战绩</Text>
                                <Text style={styles.value}>
                                    <Text>共获得</Text>
                                    <Text>{this.state.userInfo.redPackWinCount}</Text>
                                    <Text>个红包</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.itemWrap1}>
                            <View style={[styles.infoList, {borderBottomWidth: 0}]}>
                                <Text style={styles.name}>账户金额</Text>
                                <Text style={styles.value}>
                                    <Text>{this.state.userInfo.balance}</Text>
                                    <Text>元</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                   
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemWrap1: {
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderTopWidth: 1,
        borderTopColor: '#e1e0e5',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e0e5',
    },
    header: {
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 14,
        marginBottom: 17,
        backgroundColor: "#fff",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: '#e1e0e5',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e0e5',
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 6
    },
    textWrap: {
        marginTop: 11,
        marginLeft: 9,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    name: {
        fontSize: 15,
        color: "#000000",
    },
    value: {
        fontSize: 15,
        color: "#a6a6a6",
    },
    grade: {
        fontSize: 7,
        color: "#ffffff",
        backgroundColor: "#fd942c",
        width: 21,
        height: 9,
        marginLeft: 3,
        marginTop: 5,
        textAlign: 'center',
    },
    itemWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
        marginBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#e1e0e5',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e0e5',
    },  
    infoList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e9e9e9"
    }
})