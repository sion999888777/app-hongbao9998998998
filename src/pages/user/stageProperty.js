import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { getPropDataSocket } from '../../request/api/socket'
const windowWidth = Dimensions.get('window').width;

export default class StagePropertyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            listData: [],
            totalCount: "", // 持有道具总数
            avliableCount: "",  // 可用道具数
        }
    }
 
    onBackFn = ()=> {
        this.props.navigation.goBack()
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }

    componentDidMount(){
        this._getPropDataFn()
         // 创建完房间后 返回此页面 页面刷新 使用过的建房卡变为不可用
        DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
        if(dic.addRoom) {
            this._getPropDataFn()
        }})
    }

    // 获取道具数据
    _getPropDataFn() {
        this.setState({
            isFetching: true
        })
        getPropDataSocket()
        .then(res => {
            console.warn("我的道具", JSON.stringify(res))
            this.setState({
                isFetching: false
            })
            this.setState({
                listData: res.userPropInfoResultList,
                totalCount: res.totalCount,
                avliableCount: res.avliableCount
            })
        })
        .catch(err => {
            this.setState({
                isFetching: false
            })
            console.warn(JSON.stringify(err))
        })
    }

    // 进入建房页面
    addRoomFn(detailId, id){
        const {navigate} = this.props.navigation
        navigate('AddRoomPage', {detailId, id}) 
    }

    _renderItem(data) {
        let item = data.item
        console.warn(item)
        return (
            <View style={[styles.flexStart, styles.listWrap]}>
                <Image 
                    style={styles.left}
                    source={require("./imgs/default-avatar.jpg")} />
                <View style={[styles.spaceBetween, styles.listInfo]}>
                    <View>
                        <Text style={styles.name}>{item.propName}</Text>
                        <Text style={styles.rule}>{item.propDecription}</Text>
                    </View>
                    <View style={styles.flexStart}>
                        <Text style={styles.price}>
                            <Text>¥</Text> 
                            <Text>{item.propPrice}</Text>
                        </Text>
                        {
                            item.enable === "1" ? 
                            <Text style={[styles.useBtn, {backgroundColor: "#d9d9d9", borderColor: "#d0d0d6"}]}>已使用</Text>
                            :
                            <Text 
                                onPress={() => this.addRoomFn(item.detailId, item.id)}
                                style={styles.useBtn}>使用</Text>
                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {
        let navigationBar = <NavigationBar
            title = "我的道具"
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
                    <ScrollView>
                        <View style={[styles.content, styles.borderTopAndBottom]}>
                        <View style={[styles.flexStart, styles.des]}>
                            <Text>你拥有</Text>
                            <Text style={styles.totalNum}>{this.state.totalCount}</Text>
                            <Text>件道具 , </Text>
                            <Text style={styles.ableNum}>{this.state.avliableCount}</Text>
                            <Text>件可用.</Text>
                        </View>
                        <View>
                            <FlatList
                                data={this.state.listData}
                                renderItem={(data) => this._renderItem(data)}
                            />
                        </View>
                        </View>
                    </ScrollView>
                    <Loading isShow={this.state.isFetching}/>
                </View>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1eef5"
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    content: {
        backgroundColor: "#fff",
        marginTop: 19,
        paddingBottom: 36
    },
    des: {
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
        paddingTop: 16,
        paddingBottom: 10,
        paddingLeft: 14,
        fontSize: 12,
        color: "#888988"
    },
    listWrap: {
        paddingLeft: 15,
        paddingTop: 10
    },
    listInfo: {
        borderBottomWidth: 1,
        borderBottomColor: "#e9e9f0",
        width: windowWidth - 15 - 40 - 10,
        paddingRight: 15,
        paddingBottom: 7
    },
    left: {
        width: 40,
        height: 40,
        backgroundColor: "red",
        marginRight: 10,
        borderRadius: 3
    },
    name: {
        fontSize: 13,
        color: "#000000",
    },
    rule: {
        fontSize: 10,
        color: "#b1b5ba",
    },
    price: {
        fontSize: 10,
        color: "#ff9900",
        marginRight: 8
    },
    useBtn: {
        paddingTop: 6,
        paddingBottom: 6,
        width: 50,
        textAlign: 'center',
        fontSize: 11,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#42c246",
        backgroundColor: "#75d978",
        borderRadius: 3
    },
    totalNum: {
        paddingLeft: 4,
        paddingRight: 4
    },
    ableNum: {
        paddingLeft: 3,
        paddingRight: 5,
        color: "#75d978"
    }
})