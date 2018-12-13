import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Loading from '../../common/loading/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { getContactDataSocket } from '../../request/api/socket'

export default class CustomerServicePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            qq: "",
            wx: "",
            time: ""
        }
    }

    onBackFn = ()=> {
        this.props.navigation.goBack()
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }

    componentDidMount() {
        this._getContactDataFn()
    }

    _getContactDataFn() {
        // this.setState({
        //     isFetching: true
        // })
        getContactDataSocket()
        .then(res => {
            this.setState({
                isFetching: false
            })
            this.setState({
                qq: res.qq,
                wx: res.wx,
                time: res.time
            })
        })
        .catch(err => {
            // this.setState({
            //     isFetching: false
            // })
            console.warn(JSON.stringify(err))
        })
    }

    render() {
        let navigationBar = <NavigationBar
            title = "客服"
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
                    <View>
                        <Image
                            style={styles.backImg}
                            resizeMode ='stretch'
                            source={require('./imgs/service-back.png')}
                        />
                        <View style={styles.contactWrap}>
                            <View style={styles.listWrap}>
                                <View style={styles.flexStart}>
                                    <Text style={styles.contactTitle}>微信:</Text>
                                    <Text style={styles.contactValue}>{this.state.wx}</Text>
                                </View>
                                <View style={[styles.flexStart, {marginTop: 5, marginBottom: 5}]}>
                                    <Text style={styles.contactTitle}>Q  Q:</Text>
                                    <Text style={styles.contactValue}>{this.state.qq}</Text>
                                </View>
                                <View style={styles.flexStart}>
                                    <Text style={styles.contactTitle}>时间:</Text>
                                    <Text style={styles.contactValue}>{this.state.time}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Loading isShow={this.state.isFetching}/>
                </View>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexStart: {
     flexDirection: 'row',
     justifyContent: 'flex-start',
     alignItems: 'center',
  },
  contactWrap: {
      width: windowWidth * 0.8,
      marginLeft: windowWidth * 0.1,
      backgroundColor: "#fbec48",
      borderRadius: 5,
      paddingTop: 20,
      paddingBottom: 20,
      position: 'absolute',
      top: windowHeight * 0.7,
      left: 0,
      flexDirection: 'row',
      justifyContent: 'center',
  },
  listWrap: {
    width: 150
  },
  contactTitle: {
      marginRight: 40,
      fontSize: 14,
      color: "#000000"
  },
  contactValue: {
    fontSize: 14,
    color: "#000000"
  },
  backImg: {
    width: windowWidth, 
    height: windowHeight, top: 0
  }
});
