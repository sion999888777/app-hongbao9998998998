import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import PickTimeComponent from '../../../common/pickTime'
import Loading from '../../../common/loading/index'

const windowWidth = Dimensions.get('window').width;
import { format, timeToTimestamp } from "../../../util/tool";
import { getGameIncomeDataSocket, getRoomIncomeDataSocket } from '../../../request/api/socket'


export default class ItemPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            startTimeNos: "",
            endTimeNos: "",
            startTime: "",
            endTime: "",
            amount: "",
            listData: [],
            prevClickNo: false,
            nextClickNo: false,

            currentPage: 1,
            pageSize: 12,
            pages: 1,
            tabName: "",
            dataNo: false,  // 无数据
        }
    }

    componentDidMount(){
        this.setState({
            tabName: this.props.name
        }, ()=> {
            this.initData()
        })
    }

    pickHide() { 
        this.refs.PickTimeComponent.hideFn()
    }

    initData() {
        let _This = this
        let currentTime = new Date().getTime()  // 当前时间 - 时间戳
        let currentDateTime = format(currentTime, 'yyyy-MM-dd hh:mm:ss')   // 当前时间 - 时间格式  yyyy-MM-dd hh:mm:ss

        let lastTime = currentTime-1000*60*60*24  // 24小时前的时间 - 时间戳
        let lastDateTime = format(lastTime, 'yyyy-MM-dd hh:mm:ss')   // 24小时前的时间 - 时间格式  yyyy-MM-dd hh:mm:ss

        this.setState({
            // startTime: lastDateTime + ":00",  
            // endTime: currentDateTime + ":00",   
            startTime: lastDateTime,  
            endTime: currentDateTime,  
            startTimeNos: lastDateTime.slice(0,-3),
            endTimeNos: currentDateTime.slice(0,-3),
        }, ()=>{
            _This._judgeTabFn()
        })
    }

     // 判断是哪个 tab 从而决定调哪个接口
     _judgeTabFn() {
        switch(this.state.tabName)
        {
            case "game":
                this._getGameIncomeDataSocket()
                break;
            case "room":
                this._getRoomIncomeDataSocket()
                break;
            default:
                return
        }
    }

    // 获取游戏收入数据
    _getGameIncomeDataSocket() {
        console.log("到这了")
        let data = {
            startDate: this.state.startTime,
            endDate: this.state.endTime,
            page: this.state.currentPage,
            pageSize: this.state.pageSize
        }

        // this.setState({
        //     isFetching: true
        // })
        console.warn('data', JSON.stringify(data))
        getGameIncomeDataSocket(data)
        .then(res => {
            console.warn('游戏收入', JSON.stringify(res))
            // this.setState({
            //     isFetching: false
            // })
            let sumAmount = res.sumAmount > 0 ? `+${res.sumAmount}` : res.sumAmount
        
            this.setState({
                listData: res.userRevenueParamList.list,
                amount: sumAmount,
                pages: res.userRevenueParamList.pages,
                dataNo: res.userRevenueParamList.list.length > 0 ? false : true
            })
        })
        .catch(err => {
            // this.setState({
            //     isFetching: false
            // })
            console.warn('err', JSON.stringify(err))
        })
    }

    // 获取房间收入数据
    _getRoomIncomeDataSocket() {
        let data = {
            startDate: this.state.startTime,
            endDate: this.state.endTime,
            page: this.state.currentPage,
            pageSize: this.state.pageSize
        }
        // this.setState({
        //     isFetching: true
        // })
        console.warn('参数', JSON.stringify(data))
        getRoomIncomeDataSocket(data)
        .then(res => {
            // this.setState({
            //     isFetching: false
            // })
            console.warn('营收数据局', JSON.stringify(res))
            let sumAmount = res.sumAmount > 0 ? `+${res.sumAmount}` : res.sumAmount
        
            this.setState({
                listData: res.userRevenueParamList.list,
                amount: sumAmount,
                pages: res.userRevenueParamList.pages,
                dataNo: res.userRevenueParamList.list.length > 0 ? false : true
            })
        })
        .catch(err => {
            // this.setState({
            //     isFetching: false
            // })
            console.warn(JSON.stringify(err))
        })
    }

    // 调用时间选择插件
    _showTimeFn = (pickedValue, type)=> {
        let _This = this
        let val = pickedValue

        let time = val[3] // am  or  pm
        let year = val[0]
        let mounth = val[1] < 10 ? 0+val[1] : val[1]
        let day = val[2] < 10 ? 0+val[2] : val[2]
        let hh = ""
        let mm = val[5] < 10 ? 0+val[5] : val[5]

        if(time === "上午") {
            hh = val[4] < 10 ? 0+val[4] : val[4]
        } else
        if(time === "下午") {
            hh = parseInt(val[4]) + 12
        } 

        let strNos =  year + "-" + mounth + "-" + day + " " + hh + ":" + mm
        let str = year + "-" + mounth + "-" + day + " " + hh + ":" + mm + ":00"
        
        if(type === 1) {    // 开始时间
            if(timeToTimestamp(strNos) > timeToTimestamp(this.state.endTimeNos)) {
                Alert.alert(
                    '提示', 
                    '结束时间不能小于开始时间!',
                    [
                        {text: '确定', onPress: () => { console.warn('确定')}}
                    ]
                )
                return
            }
            this.setState({
                startTime: str,
                startTimeNos: strNos,
                currentPage: 1
            }, ()=>{
                _This._judgeTabFn()
            })
        } else
        if(type === 2) {    // 结束时间
            if(timeToTimestamp(_This.state.startTimeNos) > timeToTimestamp(strNos)) {
                Alert.alert(
                    '提示', 
                    '结束时间不能小于开始时间!',
                    [
                        {text: '确定', onPress: () => { console.warn('确定')}}
                    ]
                )
                return
            }
            this.setState({
                endTime: str,
                endTimeNos: strNos,
                currentPage: 1
            }, () => {
                _This._judgeTabFn()
            })
        }
    }

    // 上一页
    prevPageFn = ()=> {
        let _This = this
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
        this.setState({
            currentPage: this.state.currentPage - 1
        }, () => {
            _This._judgeTabFn()
        })
    }

     // 下一页
    nextPageFn = ()=> {
        let _This = this
        this.setState({
            prevClickNo: false,
            nextClickNo: false
        })

        if(this.state.currentPage === this.state.pages-1) {
            this.setState({
                prevClickNo: false,
                nextClickNo: true
            })
        }

        if(this.state.currentPage > this.state.pages-1) {
            return
        }

        this.setState({
            currentPage: this.state.currentPage + 1
        }, () => {
            _This._judgeTabFn()
        })
    }

    _renderItem(data) {
        let item = data.item
       
        return (
            <View style={styles.listWrap}>
                <View style={styles.listLeft}>
                    <Image 
                        style={styles.avatar}
                        source={require("../imgs/default-avatar.jpg")} />
                    <View>
                        <Text style={styles.name}>{item.roomName}</Text>
                        <Text style={styles.time}>{item.operateTime}</Text>
                    </View>
                </View>
                {
                    item.operateAmount > 0 ?
                    <Text style={[styles.rightText, {color: '#ec6066'}]}>+{item.operateAmount}</Text> :
                    <Text style={[styles.rightText, {color: '#16b916'}]}>{item.operateAmount}</Text>
                }
            </View>
        )
    }

    render() {
        return (
            <View>
                <View style={styles.headerWrap}>
                    <View style={styles.timePicker}>
                        <Text>从</Text>
                        <PickTimeComponent
                            ref="PickTimeComponent"
                            type={1}
                            chooseTime= {this.state.startTimeNos}
                            getCheckedTime={this._showTimeFn}
                        />
                        <Text>到</Text>
                        <PickTimeComponent
                            ref="PickTimeComponent"
                            type={2}
                            chooseTime= {this.state.endTimeNos}
                            getCheckedTime={this._showTimeFn}
                        />
                    </View>
                    <Text style={[styles.flexStart, styles.headerText]}>
                        <Text>您赚了</Text>
                        {
                            this.state.amount > 0 ?
                            <Text style={{color: "#ec6066", marginLeft: 3, marginRight: 3}}> {this.state.amount} </Text> :
                            <Text style={{color: "#16b916", marginLeft: 3, marginRight: 3}}> {this.state.amount} </Text>
                        }
                        
                        <Text>元</Text>
                    </Text>
                </View>
                {
                     !this.state.dataNo ? 
                     <View>
                        <View style={{paddingLeft: 15}}>
                            <FlatList
                                data={this.state.listData}
                                renderItem={(data) => this._renderItem(data)}
                            />
                        </View>
                        <View style={styles.pageWrap}>
                            {
                                this.state.prevClickNo ? 
                                <Text style={styles.pageClickNo}>上一页</Text> :
                                <Text style={styles.page} onPress={this.prevPageFn}>上一页</Text>
                            }
                            <Text style={styles.currentPage}>
                                <Text>{this.state.currentPage}</Text>
                                <Text>/</Text>
                                <Text>{this.state.pages}</Text>
                            </Text>
                            {
                                this.state.nextClickNo ? 
                                <Text style={styles.pageClickNo}>下一页</Text> :
                                <Text style={styles.page} onPress={this.nextPageFn}>下一页</Text>
                            }
                        </View>
                    </View> :
                    <Text style={{textAlign: 'center', marginTop: 30, color: "#666"}}>暂无数据</Text>
                }
                <Loading isShow={this.state.isFetching}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        marginTop: 20
      },
  headerWrap: {
    width: windowWidth,
    paddingLeft: (windowWidth - 296 - 30) / 2,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2"
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#e9e9e9",
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 15
  },
  listLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 5,
    marginRight: 5
  },
  name: {
      fontSize: 14,
      color: "#000000"
  },
  time: {
    fontSize: 11,
    color: "#999999"
  },
  rightText: {
    fontSize: 13,
    color: "#ec6066"
  },
  pageWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 204,
    marginLeft: (windowWidth - 204) / 2,
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
  }
});

