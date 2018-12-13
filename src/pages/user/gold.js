import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter 
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import Picker from 'react-native-picker';
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'

const windowWidth = Dimensions.get('window').width;

export default class GoldPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listData: [
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
                {name: '李铁蛋'},
               
            ]
        }
    }

    _showTimePicker() {
        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];
    
        for(let i=1;i<41;i++){
            years.push(i+1980);
        }
        for(let i=1;i<13;i++){
            months.push(i);
            hours.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days, ['am', 'pm'], hours, minutes];
        let date = new Date();
        let selectedValue = [
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate(),
            date.getHours() > 11 ? 'pm' : 'am',
            date.getHours() === 12 ? 12 : date.getHours()%12,
            date.getMinutes()
        ];
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerData,
            selectedValue,
            pickerTitleText: 'Select Date and Time',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
               
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;
                    
                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }

    _renderItem(data) {
        let item = data.item
        return (
            <View style={styles.listWrap}>
                <View>
                    <Text style={styles.name}>李铁蛋</Text>
                    <Text style={styles.time}>2018年10月10日13：59</Text>
                </View>
                <Text style={styles.state}>房主佣金</Text>
                <Text style={{color: "#ec6066", fontSize: 13}}>+50.60</Text>
            </View>
        )
    }

    onBackFn = ()=> {
        this.props.navigation.goBack()
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }

    render() {
        const { navigate } = this.props.navigation;
        let rightBtn = <TouchableOpacity onPress={() => this.showRoomPeoples()}>
                            <View style={{margin: 10}}>
                            <Text 
                                onPress={() => {navigate("GoldExchangePage")}}
                                style={{color: '#fff'}}>兑换</Text>
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
            title = "金币记录"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
            rightButton={rightBtn}
        />
        let content = <ScrollableTabView
                            tabBarBackgroundColor='#fff'
                            tabBarActiveTextColor='#000000'
                            tabBarInactiveTextColor='#999999'
                            tabBarUnderlineStyle={{backgroundColor: "#16b916", height: 1}}
                            initialPage={0}
                            renderTabBar={() => <ScrollableTabBar />}
                        >
                            <ScrollView tabLabel='全部' style={styles.content}>
                                <View style={styles.timePicker}>
                                    <Text>从</Text>
                                    <Text 
                                        onPress={this._showTimePicker.bind(this)}
                                        style={[styles.choose, {marginRight: 15}]}>2018年11月5日 21:17</Text>
                                    <Text>到</Text>
                                    <Text style={styles.choose}>查询结束时间</Text>
                                </View>
                                <View style={{paddingLeft: 15}}>
                                    <FlatList
                                        data={this.state.listData}
                                        renderItem={(data) => this._renderItem(data)}
                                    />
                                </View>
                                <View style={styles.pageWrap}>
                                    <Text style={styles.page}>上一页</Text>
                                    <Text style={styles.currentPage}>1/32</Text>
                                    <Text style={styles.page}>下一页</Text>
                                </View>
                            </ScrollView>
                            <View tabLabel='进出房间'></View>
                            <View tabLabel='红包'></View>
                            <View tabLabel='其他'></View>
                        </ScrollableTabView>
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    backgroundColor: "#fff",
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: windowWidth,
    paddingLeft: (windowWidth - 296 - 30) / 2,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#e2e2e2"
  },
  choose: {
    width: 140,
    height: 30,
    textAlign: "center",
    lineHeight: 30,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    borderRadius: 50,
    fontSize: 11,
    color: "#16b916",
    marginLeft: 4
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
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 5,
    marginRight: 5
  },
  name: {
      fontSize: 10,
      color: "#3f4246"
  },
  time: {
    fontSize: 8,
    color: "#999999"
  },
  state: {
    fontSize: 10,
    color: "#686f78"
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
  currentPage: {
      fontSize: 11,
      color: "#818181"
  }
});
