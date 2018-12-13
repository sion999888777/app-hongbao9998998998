import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Linking
} from 'react-native';

import NavigationBar from '../../../components/NavigationBar'
import WidgetView from '../../../common/headerLeft'
import Button from '../../../components/Button/index'
import { getPaymentChannelSocket, getPaymentMerchantSocket, getPaymentAddressSocket } from '../../../request/api/socket'

const windowWidth = Dimensions.get('window').width;

export default class RechargePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: "",
            amountHas: false,   // 可选金额有值
            getAmount: false,   // 获取支付商户信息
            minAmount: "",      // 可以输入的最小金额
            maxAmount: "",      // 可以输入的最大金额
            payMethodDataLen: null,   // 充值方式有多少个
            amount: "",     // 支付金额
            payid: "",      // 商户ID
            channel: "",     // 渠道
            payMethodData: [
                {
                    icon: require("./imgs/pay01.png"),
                    title: "支付宝",
                    checked: true
                }
            ],
            amountData: [
                {
                    value: "10",
                    checked: false
                }
            ]
        }
    }

    componentDidMount(){
        this._getPaymentChannelFn()
    }

    // 获取支付渠道
     _getPaymentChannelFn() {
        let _This = this
        getPaymentChannelSocket()
        .then(res => {
            let dataList = res.array
            let len = dataList.length
            let newArr = []

            if(len === 1) {
                let item = dataList[0]
                let type = item.channel.split("_")

                if(type[0] === "alipay") {
                    item = Object.assign(item, {
                        icon: require("./imgs/pay01.png"),
                        title: "支付宝",
                        checked: true,
                        channel: item.channel
                    })
                } else
                if(type[0] === "wechat") {
                    item = Object.assign(item, {
                        icon: require("./imgs/pay02.png"),
                        title: "微信",
                        checked: true,
                        channel: item.channel
                    })
                } 
                newArr.push(item)
                _This.setState({
                    payMethodData: newArr,
                    getAmount: true,
                    payMethodDataLen: len
                }, ()=>{
                    let data = {
                        payChannel: item.channel
                    }
                    _This._getPaymentMerchantFn(data)
                })
                
            } else 
            if(len > 1) {
                dataList.forEach(item => {
                    let val = item.channel.split("_")
                    if(val[0] === "alipay") {
                        item = Object.assign(item, {
                            icon: require("./imgs/pay01.png"),
                            title: "支付宝",
                            checked: false,
                            channel: item.channel
                        })
                    } else
                    if(type[0] === "wechat") {
                        item = Object.assign(item, {
                            icon: require("./imgs/pay02.png"),
                            title: "微信",
                            checked: true,
                            channel: item.channel
                        })
                    } 
                    newArr.push(item)
                });
            } else {
                return
            }

            this.setState({
                payMethodData: newArr,
                payMethodDataLen: len
            }, ()=>{
                console.warn("payMethodData", _This.state.payMethodData)
            })
        })
        .catch(err => {
            console.warn(JSON.stringify(err))
        })
    }

    // 获取支付渠道对应的可选金额
    _getPaymentMerchantFn(data){
        getPaymentMerchantSocket(data)
        .then(res => {
            console.warn('resresresres', JSON.stringify(res))
       
            if(res.amountvalues === "" || !res.amountvalues) {
                this.setState({
                    amountHas: false,
                    minAmount: res.minamount,
                    maxAmount: res.maxamount,
                    amount: res.channel,     // 支付金额
                    payid: res.payid,      // 商户ID
                    channel: res.channel,     // 渠道
                })
            } else {
                this.setState({
                    amountHas: true
                })
            }
        })
        .catch(err => {
            console.warn('errerrerr', JSON.stringify(err))
        })
    }


    // 获取支付地址
    _getPaymentAddressFn(data) {
        getPaymentAddressSocket(data)
        .then(res => {
            console.warn('获取支付地址成功', JSON.stringify(res))
            let url = res.finalUrl
            console.error('url', url)
           
        //    if(url) {
        //     Linking.openURL(url) 
        //    }
        })
        .catch(err => {
            console.warn('获取支付地址失败', JSON.stringify(err))
        })
    }
 
    onBackFn() {
        this.props.navigation.goBack()
    }

    rechargeFn = ()=>{
        let data = {
            amount: "100",     // 支付金额
            payid: this.state.payid,      // 商户ID
            channel: this.state.channel     // 渠道
        }

        console.warn("data", JSON.stringify(data))
        this._getPaymentAddressFn(data)
    }

    checkedPayFn = (item, keyChecked)=> {
        let newArr = []
            this.state.payMethodData.map((list, key) => {
                if(key === keyChecked) {
                    list.checked = !item.checked
                } else {
                    list.checked = false
                }
                newArr.push(list)
                return newArr
            })
            this.setState({
                payMethodData: newArr,
                getAmount: true
            })
    
            if(item.checked) {
                let data = {
                    payChannel: item.channel
                }
                this._getPaymentMerchantFn(data)
            } else {
                this.setState({
                    getAmount: false
                })
            }
    }

    checkedAmountFn = (item, keyChecked)=> {
        let newArr = []
        this.state.amountData.map((list, key) => {
            if(key === keyChecked) {
                list.checked = !item.checked
            } else {
                list.checked = false
            }
            newArr.push(list)
            return newArr
        })
        this.setState({
            amountData: newArr
        })
    }

    render() {
        let navigationBar = <NavigationBar
            title = "充值中心"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
        />
       
        return (
            <View style={styles.container}>
                {navigationBar}
                <View style={styles.wrapList}>
                    <Text style={styles.chooseTitle}>请选择充值方式</Text>
                    {
                        this.state.payMethodDataLen === 1 ?
                        <View style={styles.spaceBetween}>
                             <View 
                                style={[styles.payList, {borderColor: "#15cd1b"}]}>
                                <Image style={styles.payIcon} source={this.state.payMethodData[0].icon} />
                                <Text>{this.state.payMethodData[0].title}</Text>
                            </View>
                        </View> :
                        <View style={styles.spaceBetween}>
                            {
                                this.state.payMethodData.map((item, key)=> {
                                    return <TouchableOpacity 
                                                onPress={() => this.checkedPayFn(item,key)}
                                                style={[styles.payList, item.checked ? {borderColor: "#15cd1b"} : null]}>
                                                <Image style={styles.payIcon} source={item.icon} />
                                                <Text>{item.title}</Text>
                                            </TouchableOpacity>
                                })
                            }
                        </View>
                    }
                    <Text style={styles.note}>温馨提示：充值成功后到账时间为2小时内，请耐心等待.</Text>
                </View>
                <View style={styles.line}></View>
                <View style={styles.amountContainer}>
                        {
                            this.state.getAmount ? 
                            <View>
                                {
                                    this.state.amountHas ?
                                    <View>
                                        <Text style={styles.chooseMoneyTitle}>选择金额</Text>
                                        <View style={[styles.amountWrap]}>
                                            {
                                                this.state.amountData.map((item, key)=> {
                                                    return <TouchableOpacity 
                                                                onPress={() => this.checkedAmountFn(item,key)}
                                                                style={[styles.amountList, item.checked ? {borderColor: "#15cd1b"} : null]}>
                                                                <Text style={{ textAlign: 'center', width: windowWidth*0.27}}>{item.value}元</Text>
                                                            </TouchableOpacity>
                                                })
                                            }
                                        </View>
                                    </View> :
                                    <View>
                                        <View style={[styles.flexStart, styles.customAmount]}>
                                            <Text>填写金额</Text>
                                            <TextInput
                                                style={styles.value}
                                                placeholder = "请输入您想充值的金额"
                                                onChangeText={amount => { this.setState({amount}) }}
                                            />
                                        </View>
                                        <Text style={[styles.note, {paddingLeft: windowWidth*0.035, paddingTop: 5}]}>
                                            请输入{this.state.minAmount}元到{this.state.maxAmount}元以内的金额
                                        </Text>
                                    </View>
                                }
                            </View> : null
                        }
                </View>
                <View style={{paddingTop: 23, paddingBottom: 18}}>
                    <Button
                        enable={true}
                        textStyle={styles.textStyle}
                        text='充值'
                        buttonStyle={styles.buttonStyle}
                        onPress={this.rechargeFn}/>
                </View>
                <View style={styles.wrapList}>
                    <Text style={styles.des}>充值说明</Text>
                    <Text style={styles.des}>1. 充值成功后到账时间为2小时内</Text>
                    <Text style={styles.des}>2. 如果长时间未到账，请联系客服小姐姐</Text>
                    <Text style={styles.des}>3. 如对充值和提现环节有疑问，请咨询客服小姐姐</Text>
                </View>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    wrapList: {
        paddingLeft: windowWidth*0.04,
        paddingRight: windowWidth*0.04
    },
    line: {
        width: windowWidth,
        height: 5,
        backgroundColor: "#ececec",
        borderTopColor: "#ececec",
        borderTopWidth: 1,
        borderBottomColor: "#ececec",
        borderBottomWidth: 1
    },
    chooseTitle: {
        fontSize: 14,
        color: "#000000",
        paddingTop: 23,
        paddingBottom: 17,
    },
    payList: {
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderRadius: 2,
        width: windowWidth*0.3,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    payListSecond: {
        marginLeft: windowWidth*0.02/2,
        marginRight: windowWidth*0.02/2
    },
    payIcon: {
        width: 21,
        height: 21,
        marginRight: 10,
        marginLeft: 12
    },
    note: {
        fontSize: 11,
        color: "#f2666c",
        paddingTop: 17,
        paddingBottom: 20
    },
    chooseMoneyTitle: {
        fontSize: 14,
        color: "#000000",
        paddingTop: 13,
        paddingBottom: 19,
        paddingLeft: windowWidth*0.035
    },
    customAmount: {
        borderBottomWidth: 1,
        borderBottomColor: "#a9a9a9",
        paddingTop: 2,
        paddingBottom: 2,
        marginLeft: windowWidth*0.035,
        marginRight: windowWidth*0.035
    },
    textStyle: {
        fontSize: 18,
        color: "#e8ede8"
    },
    buttonStyle: {
        width: windowWidth - 30,
        backgroundColor: "#a6cea5",
        marginLeft: 15,
        borderWidth: 1,
        borderColor: "#70b06e"
    },
    des: {
        fontSize: 10,
        color: "#ababab",
        marginTop: 5
    },
    amountContainer: {
        paddingLeft: windowWidth*0.005,
        paddingRight: windowWidth*0.005
    },
    amountWrap: {
        flexDirection:'row',
        flexWrap:'wrap',
    },
    amountList: {
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderRadius: 2,
        width: windowWidth*0.27,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: windowWidth*0.03,
        marginLeft: windowWidth*0.03
    },
});
