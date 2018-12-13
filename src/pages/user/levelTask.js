import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
    ScrollView,
    DeviceEventEmitter
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import Loading from '../../common/loading/index'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'
import config from '../../request/config'

import { getTaskDataSocket, getCompleteDataSocket } from '../../request/api/socket'

const {width, height} = Dimensions.get('window');

export default class LevelTaskPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // isFetching: false,  // 是否在请求接口
            nickName: "", // 用户昵称
            avatar: "", // 
            taskList: [],
            upgradeRedPackWinCount: "", // 级仍需抢得红包数
            upgradeBeInvitedCount: "",  // 升级仍需已邀请用户数
            userLevel: "",  // 当前用户等级
            invitationCode: "", // 当前用户邀请码
            completeList: [],
            redPackCount: "",  // 已抢红包数
            beInviteCount: "",  // 已邀请数 

            currentPage: 1,     // 完成进度 - 当前页数
            pageSize: 12,        // 每页条数
            completePages: 1,           // 总页数

            prevClickNo: false,   // 上一页 不能点击
            nextClickNo: false,   // 下一页 不能点击
            levelMast: false,   // 已升到最高级
        }
    }

    componentDidMount(){
        let nickName = this.props.navigation.state.params.nickName;     // 昵称
        let avatar = this.props.navigation.state.params.avatar;     // 昵称
        console.warn('avatar', avatar)

        this.setState({
            nickName: nickName,
            avatar: avatar
        })

        let completeParams = {
            page: this.state.currentPage,    // 当前页
            pageSize: this.state.pageSize    // 每页条数
        }

        this._getTaskDataFn()
        this._getCompleteDataFn(completeParams)

        if(this.state.completePages <= 1) {
            this.setState({
                prevClickNo: true,
                nextClickNo: true
            })
        } else {
            this.setState({
                prevClickNo: true,
                nextClickNo: false
            })
        }

        // 重连成功请求数据
        DeviceEventEmitter.addListener('ChangeUI',(dic)=>{
            // dic.auto  socket 里面认证成功
            if(dic.auto) {
              this._getTaskDataFn()
              this._getCompleteDataFn(completeParams)
            }})
    }
 
     
    // 获取任务列表数据
    _getTaskDataFn() {
        // this.setState({
        //     isFetching: true
        // })
        getTaskDataSocket()
        .then(res => {
            if(res.upgradeRedPackWinCount === undefined) {
                this.setState({
                    levelMast: true
                })
            } else {
                this.setState({
                    levelMast: false
                })
            }
            // this.setState({
            //     isFetching: false
            // })
            this.setState({
                taskList: res.levelList,
                userLevel: res.userLevel,
                upgradeRedPackWinCount: res.upgradeRedPackWinCount,
                upgradeBeInvitedCount: res.upgradeBeInvitedCount,
                invitationCode: res.invitationCode,
                redPackCount: res.redPackCount,
                beInviteCount: res.beInviteCount
            })
            console.warn(' res.userLevel',  JSON.stringify(res.userLevel))
        })
        .catch(err => {
            // this.setState({
            //     isFetching: false
            // })
            console.warn(JSON.stringify(err))
        })
    }

    // 获取完成进度数据
    _getCompleteDataFn(data) {
        getCompleteDataSocket(data)
        .then(res => {
            this.setState({
                completeList: res.list,
                completePages: res.pages,
                currentPage: res.pageNum
            })
        })
        .catch(err => {
            console.warn(JSON.stringify(err))
        })
    }

     // 上一页
     completePagePrevFn = ()=> {
        this.setState({
            prevClickNo: false,
            nextClickNo: false
        })

        if(this.state.currentPage === 2) {
            this.setState({
                prevClickNo: true,
                nextClickNo: false
            })
        }
        if(this.state.currentPage < 2) {
            return
        }
    
        let currentPage = this.state.currentPage - 1
        this.setState({
            currentPage: currentPage
        }, () => {
            let data = {
                page: this.state.currentPage,
                pageSize: this.state.pageSize
            }
          
            this._getCompleteDataFn(data)
        })
    }

    // 下一页
    completePageNextFn = ()=> {
        this.setState({
            prevClickNo: false,
            nextClickNo: false
        })

        if(this.state.currentPage === this.state.completePages-1) {
            this.setState({
                prevClickNo: false,
                nextClickNo: true
            })
        }

        if(this.state.currentPage > this.state.completePages-1) {
            return
        }

        let currentPage = this.state.currentPage + 1
        this.setState({
            currentPage: currentPage
        }, () => {
            let data = {
                page: this.state.currentPage,
                pageSize: this.state.pageSize
            }
          
            this._getCompleteDataFn(data)
        })
    }

    _renderCompleteItem(data) {
        let item = data.item
        // headIcon
        return (
            <View style={[styles.spaceBetween, styles.itemWrap]}>
                <View style={styles.flexStart}>
                <Image source={item.headIcon ? config.imgUrl + item.headIcon : require('./imgs/def.png')}
                    style={styles.listImg}/>

                    <Text style={styles.userName}>{item.nickName}</Text>
                </View>
                <Text style={styles.time}>{item.createDateStr}</Text>
            </View>
        )
    }

    _renderTaskItem(data) {
        let item = data.item
        return (
            <View>
                {
                    item.userLevel > 0 ? 
                    <View style={[styles.spaceBetween, styles.itemWrap, {alignItems: "center"}]}>
                        <View style={styles.flexStart}>
                            <View style={styles.taskListLeft}>
                                <Text style={styles.taskLevel}>LV{item.userLevel}</Text>
                            </View>
                            <View>
                                <Text style={styles.taskTitle}>抢到{item.packNumbers}个红包, 邀请{item.invitationNumbers}个新用户.</Text>
                                <Text style={styles.taskDes}>完成任务后, 可获得Lv{item.userLevel}建房卡.</Text>
                            </View>
                        </View>
                        {
                            item.userLevel > this.state.userLevel ?
                            <Text style={[styles.taskState, {backgroundColor: "#d9d9d9"}]}>未完成</Text>
                            :
                            <Text style={styles.taskState}>已完成</Text> 
                        }
                    </View> :null
                }
            </View>
        )
    }
    

    // 点击 tab
    changeTabFn = ()=> {
        if(this.state.completePages <= 1) {
            this.setState({
                prevClickNo: true,
                nextClickNo: true
            })
        } else {
            this.setState({
                prevClickNo: true,
                nextClickNo: false
            })
        }
    }

    _backFn() {
        this.props.navigation.goBack()
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }

    render() {
        let navigationBar = <NavigationBar
            title = "等级任务"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this._backFn())}
        />
      
       let taskList = <View style={{paddingLeft: 15}}>
             <FlatList
                data={this.state.taskList}
                renderItem={(data) => this._renderTaskItem(data)}
            />
       </View>
       let completeList = <View style={{backgroundColor: "#fff"}}>
                            <View style={[styles.spaceBetween, styles.desWrap]}>
                                <Text style={styles.flexStart}>
                                    <Text style={styles.des}>已邀请</Text>
                                    <Text style={styles.des}>{this.state.beInviteCount}</Text>
                                    <Text style={styles.des}>人 ,共抢到</Text>
                                    <Text style={styles.des}>{this.state.redPackCount}</Text>
                                    <Text style={styles.des}>个红包.</Text>
                                </Text>
                                <Text style={styles.codeWrap}>
                                     <Text style={styles.codeText}>邀请码:</Text>
                                     <Text style={[styles.codeText, {fontSize: 8, marginLeft: 2}]}>{this.state.invitationCode}</Text>
                                </Text>
                            </View>
                            <ScrollView style={{height: height}}>
                                <View style={{paddingLeft: 15}}>
                                    <FlatList
                                        data={this.state.completeList}
                                        renderItem={(data) => this._renderCompleteItem(data)}
                                    />
                                </View>
                                <View style={styles.pageWrap}>
                                    {
                                        this.state.prevClickNo ? 
                                        <Text style={styles.pageClickNo}>上一页</Text> :
                                        <Text style={styles.page} onPress={this.completePagePrevFn}>上一页</Text>
                                    }
                                    <Text style={styles.currentPage}>
                                        <Text>{this.state.currentPage}</Text>
                                        <Text>/</Text>
                                        <Text>{this.state.completePages}</Text>
                                    </Text>
                                    {
                                        this.state.nextClickNo ? 
                                        <Text style={styles.pageClickNo}>下一页</Text> :
                                        <Text style={styles.page} onPress={this.completePageNextFn}>下一页</Text>
                                    }
                                </View>
                            </ScrollView>
                        </View>
        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={true}>
                <View style={styles.container}>
                    {navigationBar}
                    <View>
                        <View style={[styles.flexStart, styles.borderTopAndBottom, styles.listWrap]}>
                                <Image
                                    resizeMode ='stretch'
                                    style={styles.avatarImg}
                                    source={{uri: this.state.avatar}}
                                /> 
                            <View>
                                <View style={styles.flexStart}>
                                    <Text style={styles.name}>{this.state.nickName}</Text>
                                    <Text style={styles.state}>LV{this.state.userLevel}</Text>
                                </View>
                                {
                                    !this.state.levelMast ?
                                    <Text style={styles.flexStart}>
                                        <Text style={styles.des}>离下一次升级还要抢</Text>
                                        <Text style={styles.des}>{this.state.upgradeRedPackWinCount}</Text>
                                        <Text style={styles.des}>个红包, 邀请</Text>
                                        <Text style={styles.des}>{this.state.upgradeBeInvitedCount}</Text>
                                        <Text style={styles.des}>新用户.</Text>
                                    </Text> : null
                                }
                            </View>
                        </View>
                    </View>
                    <ScrollableTabView
                        tabBarBackgroundColor='#fff'
                        tabBarActiveTextColor='#000000'
                        tabBarInactiveTextColor='#999999'
                        tabBarUnderlineStyle={{backgroundColor: "#16b916", height: 1}}
                        initialPage={0}
                        renderTabBar={() => <ScrollableTabBar />}
                        onChangeTab={this.changeTabFn}
                    >
                        <ScrollView tabLabel='任务列表' style={styles.content}>
                        {taskList}
                        </ScrollView>
                        <ScrollView tabLabel='完成进度'>
                            {completeList}
                        </ScrollView>
                        <View></View>
                        <View></View>
                    </ScrollableTabView>
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
    listWrap: {
        backgroundColor: "#fff",
        paddingTop: 16,
        paddingBottom: 14,
        marginTop: 19,
        marginBottom: 12,
        paddingLeft: 15
    },
    avatarImg: {
        width: 40,
        height: 40,
        borderRadius: 3,
        marginRight: 10
    },
    name: {
        fontSize: 13,
        color: "#000000"
    },
    state: {
        fontSize: 9,
        color: "#ffffff",
        width: 20,
        height: 11,
        textAlign: 'center',
        lineHeight: 11,
        backgroundColor: "#ff7814"
    },
    des: {
        fontSize: 11,
        color: "#888988"
    },
    content: {
        backgroundColor: "#fff",
      },
      pageWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 204,
        marginLeft: (width - 204) / 2,
        marginTop: 27,
        marginBottom: 27
      },
      page: {
          fontSize: 11,
          color: "#818181",
          borderWidth: 1,
          borderColor: "#dddddd",
          borderRadius: 3,
          paddingTop: 6,
          paddingBottom: 6,
          paddingLeft: 17,
          paddingRight: 17
      },
      pageClickNo: {
        fontSize: 11,
        color: "#ececec",
        borderWidth: 1,
        borderColor: "#f6f6f6",
        borderRadius: 3,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 17,
        paddingRight: 17
      },
      currentPage: {
          fontSize: 11,
          color: "#818181"
      },
      itemWrap: {
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
        paddingRight: 32
      },
      userName: {
        fontSize: 10,
        color: "#9e9e9e"
      },
      time: {
        fontSize: 10,
        color: "#9e9e9e"
      },
      listImg: {
          width: 20,
          height: 20,
          borderRadius: 3,
          marginRight: 6
      },
      desWrap: {
        paddingLeft: 16,
        paddingRight: 18,
        paddingTop: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
      },
      des: {
          fontSize: 10,
          color: "#888988",
          fontWeight: '600'
      },
      codeWrap: {
          width: 86,
          height: 17,
          textAlign: 'center',
          paddingTop: 2,
          borderWidth: 1,
          borderColor: "#ff7814",
          borderRadius: 2,
          paddingLeft: 3
      },
      codeText: {
        color: "#ff7814",
        fontSize: 10,
      },
      taskState: {
          width: 48,
          height: 19,
          textAlign: 'center',
          lineHeight: 19,
          backgroundColor: "#8fd291",
          fontSize: 11,
          color: "#fff",
          borderRadius: 2
      },
      taskTitle: {
          fontSize: 12,
          color: "#000000"
      },
      taskDes: {
        fontSize: 9,
        color: "#b1b5ba"
      },
      taskListLeft: {
          width: 33,
          height: 25,
          borderRightWidth: 1,
          borderRightColor: "#e9e9f0",
          marginRight: 10,
      },
      taskLevel: {
          width: 23,
          height: 13,
          textAlign: 'center',
          lineHeight: 13,
          backgroundColor: "#ffaf14",
          borderRadius: 2,
          fontSize: 9,
          color: "#fff",
          marginLeft: 3,
          marginTop: 4
      }
})