import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    ScrollView,
    Dimensions
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { format } from '../../util/tool'

const { width, height} = Dimensions.get('window')

export default class RedPackageDetailPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            recordList: []
        }
    }

    componentDidMount() {
        let params = this.props.navigation.state.params || {}
        console.warn('-------------->>>>>>>>', params)
        this.setState({ ...params })
    }

    onBack() {
        this.props.navigation.goBack()
    }
  

    _renderItem = (data) => {
        let item = data.item
        
        console.warn('传递到红包详情的参数------->', JSON.stringify(item))
        console.warn('this.state------->', JSON.stringify(this.state))
		return (
			<View style={[styles.spaceBetween, styles.listWrap]}>
				<View style={styles.flexStart}>
                    <Image style={styles.avatarImg} source={require("../../components/redPckModal/imgs/default-avatar.jpg")} />
                    <View style={{width: width*0.8, paddingRight: 10}}>
                        <View style={styles.spaceBetween}>
                            <Text style={styles.name}>{ item.operateNickName }</Text>
                            <View style={styles.flexEnd}>
                                <Text style={[styles.num]}>{ item.operateAmount }</Text>
                                <Text style={styles.num}>元</Text>
                            </View>
                        </View>
                        <View style={styles.spaceBetween}>
                            {/* <Text style={styles.time}>{ format(item.operateTime, 'MM月dd日 hh:mm:ss') }</Text> */}
                            <Text style={styles.time}>{ item.operateTime2 }</Text>
                            <View style={[styles.alignItemsEnd, {marginTop: 3}]}>
                                <View style={styles.state}>
                                    {
                                        item.strategy === '1' ?
                                        <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', width: 80}}>
                                            <Image style={{width: 17, height: 17}}  resizeMode ='contain' source={require("./imgs/worst.png")}/>
                                            <Text style={{color: '#ffbe23', fontSize: 12}}>手气最差</Text>
                                        </View>
                                        
                                      : item.strategy === '0' ?
                                        <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', width: 80}}>
                                            <Image style={{width: 17, height: 17}}  resizeMode ='contain' source={require("./imgs/best.png")}/>
                                            <Text style={{color: '#ffbe23', fontSize: 12}}>手气最佳</Text>
                                        </View>

                                      : null
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
			</View>
		)
	}

    render() {
        let navigationBar = <NavigationBar
				title="红包详情"
				statusBar={{
					backgroundColor: '#d95940'
                }}
                style={{backgroundColor: '#d95940'}}
				leftButton={WidgetView.getLeftButton(() => this.onBack())}
			/>

        return (
            <SafeAreaViewPlus  
                topColor={'#d95940'}
                bottomInset={false}>
                <View style={styles.container}>
                    {navigationBar}
                    <View style={{height: 250}}>
                        <Image 
                            style={styles.backImg}
                            resizeMode ='stretch'
                            source={require("./imgs/t1.png")} />
                        <View style={styles.basicInfo}>
                            <Image style={styles.avatarBigImg} source={require("../../components/redPckModal/imgs/default-avatar.jpg")} />
                            <Text style={styles.userName}>{ this.state.packSenderNickName }</Text>
                            <Text style={styles.redPackageText}>{ this.state.leaveMsg }</Text>

                            {
                                this.state.grabAmount ? <View>
                                <View style={{ marginTop: 20, textAlign: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 40, color: "#201d18"}}>
                                        { this.state.grabAmount } <Text style={{fontSize: 15, color: "#201d18", marginTop: 16}}>元</Text>
                                    </Text>
                                    </View>
                                    <Text style={styles.moneyNote}>已存入账户,可用于发红包</Text>
                                </View> : null
                                // : this.state.packSender === this.state.userId ? 
                                // <View>
                                /* <View style={{ marginTop: 20, textAlign: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 40, color: "#201d18"}}>
                                        { this.state.totalAmount.toFixed(2) } <Text style={{fontSize: 15, color: "#201d18", marginTop: 16}}>元</Text>
                                    </Text>
                                    </View>
                                </View> : null */    
                            }
                            
                        </View>
                    </View>
                    
                    <View style={[styles.flexStart, styles.redPackageStateWrap]}>
                        {/* {
                            this.state.dragonStatus === '0' ? null :
                            <Text style={styles.redPackageState}>
                                {this.state.packCount}个红包{this.state.wastetime2 + '秒被抢光'}
                            </Text>
                        } */}
                        <Text style={styles.redPackageState}> {this.state.recordHead} </Text>
                    </View>
                
                    
                    <ScrollView style={{paddingLeft: 9}}>
                    {
                        this.state.recordList.length > 0 ? <FlatList
                            data={this.state.recordList}
                            renderItem={(data) => this._renderItem(data)}
                        /> : <Text style={{textAlign: 'center', margin: 20}}>暂无玩家领取红包!</Text>
                    }
                        

                        <Text style={[{textAlign: 'center', marginTop: 20}]}>
                            {   
                                this.state.systemCharges ? <Text style={styles.note}>
                                    本次红包游戏, 共有
                                    <Text style={{color: "#d95940"}}>{ this.state.systemCharges }</Text>
                                    元进入奖金池.
                                </Text> : null
                            }
                        </Text>
                    </ScrollView>
                </View>
            </SafeAreaViewPlus>
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
        alignItems: 'center',
    },
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    flexEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    alignItemsEnd: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    backImg: {
        width: width, 
        height: width * 0.1653,
    },
    redPackageStateWrap: {
        paddingTop: 12,
        paddingBottom: 9,
        paddingLeft: 20,
        backgroundColor: "#f5f5f5"
    },
    basicInfo: {
        width: width, position: 'absolute', top: 25
    },
    moneyNote: {
        fontSize: 11,
        color: "#1fc71f", 
        textAlign: 'center', 
        paddingBottom: 20,
    },
    userName: {
        fontSize: 13,
        color: "#000000",
        textAlign: 'center', 
        marginTop: 6, 
        marginBottom: 8
    },
    redPackageText: {
        fontSize: 15,
        color: "#a7a7a7",
        textAlign: 'center'
    },
    redPackageState: {
        fontSize: 10,
        color: "#a3a3a3"
    },
    listWrap: {
        borderBottomWidth: 1,
        borderBottomColor: "#ebebeb",
        paddingTop: 12,
        paddingBottom: 8,
        paddingRight: 11,
        padding: 7,
    },
    avatarImg: {
        width: 40,
        height: 40,
        borderRadius: 50,
        marginRight: 10
    },
    name: {
        fontSize: 13,
        color: "#000000"
    },
    time: {
        fontSize: 11,
        color: "#bfbfbf"
    },
    num: {
        fontSize: 13,
        color: "#000000"
    },
    state: {
        fontSize: 11,
        color: "#ffbe23"
    },
    note: {
        fontSize: 11,
        color: "#9ca5b6"
    },
    avatarBigImg: {
        width: 65,
        height: 65,
        borderRadius: 50,
        marginLeft: (width - 65)/2
    },
    lastContent: {
        width: 300, 
        marginLeft: (width - 300)/2,
        marginTop: 22,
        paddingBottom: 20
    }
})