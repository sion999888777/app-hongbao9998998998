import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'

const windowWidth = Dimensions.get('window').width;
import Button from '../../components/Button'

export default class GoldExchangePage extends Component {
    constructor(props) {
        super(props)
    }
 
    onBackFn = ()=> {
        this.props.navigation.goBack()
    }
 
    render() {
        let navigationBar = <NavigationBar
            title = "金币兑换"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
        />

        return (
            <View style={styles.container}>
                {navigationBar}
                <View>
                    <View style={[styles.justifyContentCenter, styles.headerWrap]}>
                        <Image style={styles.coinImg} source={require("./imgs/coin.png")} />
                        <Text style={[styles.flexStart, styles.headerText, {marginTop: 14, marginBottom: 7}]}>
                            <Text style={{fontSize: 14, color: "#000000"}}>金币: </Text>
                            <Text style={{fontSize: 14, color: "#ffae00"}}>5620.36</Text>
                            <Text style={{fontSize: 10, color: "#bcbcd1"}}>(个)</Text>
                        </Text>
                        <Text style={[styles.flexStart, styles.headerText]}>
                            <Text style={{fontSize: 9, color: "#bcbcd1"}}>账户余额</Text>
                            <Text style={{fontSize: 9, color: "#bcbcd1"}}>34,000.27</Text>
                            <Text style={{fontSize: 9, color: "#bcbcd1"}}>元</Text>
                        </Text>
                    </View>
                    <View style={[styles.flexStart, styles.listWrap, styles.borderTopAndBottom]}>
                        <Text>兑换数量</Text>
                    </View>
                    <View style={[styles.flexStart, styles.exchangeRule]}>
                        <Text style={styles.exchangeRuleText}>*每</Text>
                        <Text style={styles.num}>5000</Text>
                        <Text style={styles.exchangeRuleText}>金币可换成</Text>
                        <Text style={styles.num}>5</Text>
                        <Text style={styles.exchangeRuleText}>元人民币.</Text>
                    </View>
                    <Button
                        text='兑换'
                        enable={true}
                        textStyle={styles.textStyle}
                        buttonStyle={styles.buttonStyle}
                        onPress={this.submitFn}
                    />
                    <View style={styles.desWrap}>
                        <Text style={styles.desText}>兑换说明：</Text>
                        <Text style={styles.desText}>1.请保证当前账号金币数额大于5000; </Text>
                        <Text style={styles.desText}>2.金币兑换成人民币后，不可撤销操作;</Text>
                        <Text style={styles.desText}>3.一旦发现玩家通过作弊手段恶意</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f1eef5"
    },
    justifyContentCenter: {
        // flexDirection: 'column',
        // justifyContent: 'center',
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
    headerWrap: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e1e0e5",
        marginBottom: 15,
        paddingTop: 20,
        paddingBottom: 22
    },
    coinImg: {
        width: 50,
        height: 50,
        marginLeft: (windowWidth - 50) / 2
    },
    headerText: {
        textAlign: 'center',
         width: windowWidth
    },
    listWrap: {
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 16,
        paddingRight: 18
    },
    exchangeRule: {
        paddingLeft: 18,
        paddingTop: 5
    },
    exchangeRuleText: {
        fontSize: 10,
        color: "#a8a8b7"
    },
    num: {
        fontSize: 10,
        color: "#e1ba67",
        paddingLeft: 3,
        paddingRight: 3
    },
    buttonStyle:{
        margin:20,
        backgroundColor:'#8fc491',
        borderColor:'#72ae74',
        borderRadius: 3,
        borderWidth:0,
        marginBottom: windowWidth * 0.1,
        width: windowWidth - 30,
        marginLeft: 15
    },
    textStyle:{
        color:'#fff',
        fontSize: 18,
    },
    desWrap: {
        paddingLeft: 16
    },
    desText: {
        fontSize: 9,
        color: "#95959b"
    }
})