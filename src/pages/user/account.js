import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    FlatList,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { Icon } from '../../components/icon'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { getAccountDataSocket } from '../../request/api/socket'

export default class AccountPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,  // 是否在请求接口
      listData: [],
      amount: "",
      chargeType: ""
    }
  }

  componentDidMount() {
    this._getAccountDataFn()
  }

  _getAccountDataFn() {
    let data = {
      type: ""
    }
    // this.setState({
    //   isFetching: true
    // })
    getAccountDataSocket(data)
    .then(res => {
      console.warn("resresresresresres", JSON.stringify(res))
        // this.setState({
        //   isFetching: false
        // })
        this.setState({
          listData: res.capitalFlowParamPage.list,
          amount: res.amount
        })
    })
    .catch(err => {
        // this.setState({
        //   isFetching: false
        // })
        console.warn(JSON.stringify(err))
    })
  }

  onBackFn = ()=> {
    this.props.navigation.goBack()
    DeviceEventEmitter.emit('ChangeUI', { update: true});
  } 

  moreDataFn = ()=> {
    const { navigate } = this.props.navigation;
    navigate("AccountRecordPage")
  }

  _renderItem = (data)=> {
    let item = data.item
 
    return (
      <View style={[styles.flexBetween, styles.list]}>
        <View style={{width: windowWidth*0.4}}>
          <Text style={styles.name}>{item.detail}</Text>
          <Text style={styles.time}>{item.createDateStr}</Text>
        </View>
        <Text style={styles.state}>{item.chargeType}</Text>
        {
          item.amount < 0 ?
          <Text style={[styles.num, {color: "#16b916"}]}>{item.amount}</Text> :
          <Text style={[styles.num, {color: "#ec6066"}]}>+{item.amount}</Text>
        }
      </View>
    )
  }
 
  render() {
	  const { navigate } = this.props.navigation;
    
    let navigationBar = <NavigationBar
        title = "账户"
        statusBar={{
            backgroundColor: '#212025'
        }}
        leftButton={WidgetView.getLeftButton(() => {
          this.onBackFn()
        })}
    />
    return (
      <SafeAreaViewPlus  
          topColor={'#212025'}
          bottomInset={false}>
         {navigationBar}
          <View>
              <View style={[styles.header, styles.flexBetweenStart]}>
                    <TouchableOpacity 
                        onPress={()=>{
                          navigate("RechargePage")
                        }}
                        style={styles.second}>
                        <Image style={styles.headerImg} source={require('./imgs/account01.png')} />
                        <Text style={styles.title}>充值</Text>
                    </TouchableOpacity>
                    <View style={styles.second}>
                        <Image style={styles.headerImg} source={require('./imgs/account02.png')} />
                        <Text style={styles.title}>余额</Text>
                        <Text style={styles.amount}>
                          <Text>¥</Text>
                          <Text>{this.state.amount}</Text>
                        </Text>
                    </View>
                    <View style={styles.second}>
                        <Image style={styles.headerImg} source={require('./imgs/account03.png')} />
                        <Text style={styles.title}>提现</Text>
                    </View>
              </View>
              <View>
                <View style={[styles.flexBetween, styles.listHeader]}>
                    <Text>最近的账户记录</Text>
                    <View style={styles.flexStart}>
                        <Text onPress={this.moreDataFn} style={styles.more}>更多</Text>
                        <Icon name={'privateIcon|arrow-right'} size={10} color={'#bfbfc4'} />
                    </View>
                </View>
                <ScrollView style={[styles.content, styles.borderTopAndBottom]}>
                     <FlatList
                          data={this.state.listData}
                          renderItem={(data) => this._renderItem(data)}
                      />
                      <View style={[styles.flexStart, styles.moreWrap]}>
                        <Text onPress={this.moreDataFn} style={styles.moreText}>查看更多记录</Text>
                        <Icon name={'privateIcon|arrow-right'} size={8} color={'#bfbfc4'} />
                      </View>
                </ScrollView>
              </View>
          </View>
          <Loading isShow={this.state.isFetching}/>
      </SafeAreaViewPlus>
    )
  }
}

const styles = StyleSheet.create({
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "center"
  },
  flexBetweenStart: {
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
  header: {
    backgroundColor: "#686f78",
    paddingTop: 31,
    paddingBottom: 22,
    paddingLeft: 90 * windowWidth / 750,
    paddingRight: 90 * windowWidth / 750, 
  },
  headerImg: {
    width: 40,
    height: 40
  },
  title: {
      fontSize: 15,
      color: "#ffffff",
      marginTop: 8,
      marginBottom: 3,
  },
  amount: {
    fontSize: 12,
    color: "#b1b5ba",
  },
  second: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    backgroundColor: "#fff",
    paddingLeft: 15,
    height: windowHeight * 0.6
  },
  listHeader: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 14,
    paddingBottom: 8
  },
  list: {
    paddingTop: 9,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#e9e9e9",
    paddingRight: 15
  },
  name: {
    fontSize: 10,
    color: "#3f4246"
  },
  time: {
    fontSize: 8,
    color: "#999999",
    marginTop: 3
  },
  state: {
    fontSize: 10,
    color: "#686f78"
  },
  more: {
    fontSize: 11,
    color: "#a1a1a4"
  },
  num: {
    fontSize: 13,
    color: "#686f78",
    width: 70,
    textAlign: 'right'
  },
  moreWrap: {
    width: 96,
    marginLeft: (windowWidth - 15 - 86) / 2,
    marginTop: 20,
    marginBottom: 26
  },
  moreText: {
    fontSize: 10,
    color: "#10aeff"
  }
})