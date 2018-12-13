import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  Alert,
  Image
} from 'react-native';
import PickTimeComponent from '../../../common/pickTime'
import Loading from '../../../common/loading/index'
const windowWidth = Dimensions.get('window').width;
import { format, timeToTimestamp } from "../../../util/tool";
import { roomRecordDataSocket } from '../../../request/api/socket'


export default class ItemPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            startTimeNos: "",
            endTimeNos: "",
            startTime: "",
            endTime: "",
            listData: [],
            prevClickNo: false,
            nextClickNo: false,
 
            currentPage: 1,
            pageSize: 12,
            pages: 1,
            tabName: "",
            dataNo: false,  // 无数据
            roomId: "", // 房间id
        }
    }

    componentDidMount(){
        this.setState({
            tabName: this.props.name,
            roomId: this.props.roomId
        }, ()=>{
            this.initData()
        })
    }

    initData() {
        let _This = this
        let currentTime = new Date().getTime()  // 当前时间 - 时间戳
        let currentDateTime = format(currentTime, 'yyyy-MM-dd hh:mm:ss')   // 当前时间 - 时间格式  yyyy-MM-dd hh:mm:ss

        let lastTime = currentTime-1000*60*60*24  // 24小时前的时间 - 时间戳
        let lastDateTime = format(lastTime, 'yyyy-MM-dd hh:mm:ss')   // 24小时前的时间 - 时间格式  yyyy-MM-dd hh:mm:ss

        this.setState({
            startTime: lastDateTime + ":00",  
            endTime: currentDateTime + ":00",   
            startTimeNos: lastDateTime.slice(0,-3),
            endTimeNos: currentDateTime.slice(0,-3),
        }, ()=>{
            _This._getRecordDataFn()
        })
    }

    // 隐藏时间选择插件
    pickHide() {
        this.refs.PickTimeComponent.hideFn()
    }

    // 获取全部账户记录数据
    _getRecordDataFn() {
        let resource = null
        let _This = this

        switch(this.state.tabName)
        {
            case "all":
                resource = "1"
                break;
            case "comeAndGo":
                resource = "2"
                break;
            case "redPackage":
                resource = "3"
                break;
            case "other":
                resource = "4"
                break;
            default:
                return
        }

        let data = {
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            pageSize: this.state.pageSize,
            page: this.state.currentPage,
            resource: resource,
            roomId: this.state.roomId 
        }
 
        roomRecordDataSocket(data)
        .then(res => {
            console.warn(JSON.stringify(res))
            _This.setState({
                listData: res.list,
                pages: res.pages,
                dataNo: res.list.length > 0 ? false : true
            })
        })
        .catch(err => {
            console.warn(JSON.stringify(err))
        })
    }


    // 调用时间选择插件
    _showTimeFn = (pickedValue, type)=> {
        let _This = this
        let val = pickedValue

        let time = val[3] // am  or  pm
        let year = val[0]
        let mounth = val[1]
        let day = val[2]
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
                _This._getRecordDataFn()
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
                _This._getRecordDataFn()
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
            _This._getRecordDataFn()
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
            _This._getRecordDataFn()
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
                        <Text style={styles.name}>{item.userNickName}</Text>
                        <Text style={styles.time}>{item.operateTimeStr}</Text>
                    </View>
                </View>
                <Text style={styles.rightText}>{item.typeValue}</Text>
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
    flexBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
      },
      list: {
        paddingTop: 9,
        paddingBottom: 9,
        borderBottomWidth: 1,
        borderBottomColor: "#e9e9e9",
        paddingRight: 15
      },
  headerWrap: {
    width: windowWidth,
    paddingLeft: (windowWidth - 296 - 30) / 2,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
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
    color: "#666666"
    },
  state: {
    fontSize: 10,
    color: "#686f78"
  },
  num: {
    fontSize: 13,
    color: "#686f78",
    width: 70,
    textAlign: 'right'
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

