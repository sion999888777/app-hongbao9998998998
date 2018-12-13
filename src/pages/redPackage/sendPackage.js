import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native'
import Toast from 'react-native-easy-toast'

import NavigationBar from '../../components/NavigationBar'
import WidgetView from "../../common/headerLeft"
import Button from '../../components/Button'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { sendPacket } from '../../request/api/socket'

export default class SendPackagePage extends Component {
    constructor(props) {
        super(props)
	    
	    this.state = {
		    leaveWord: '恭喜发财, 大吉大利'
        }
          
        this.params = this.props.navigation.state.params || {}
    }

    onBack() {
        this.props.navigation.goBack()
    }
  
    _sendPackage() {
        const data = {
            leastMoney: this.params.leastMoney,
            leaveMsg: this.state.leaveWord,
            packCount: this.params.packCount,
            roomId: this.params.roomId
        }

        sendPacket(data)
            .then(res => {
                this.onBack()
            })
            .catch(err => {
                this.refs.toast.show(err)
            })
    }

    render() {

        /*
        Picker.init({
			pickerData: this.state.fixedContentConfigs.map(item => item.fixedContent),
		  pickerConfirmBtnText: '确定',
		  pickerCancelBtnText: '取消',
		  pickerTitleText: '',
		  pickerTextEllipsisLen: 20,
		  selectedValue: [],
		  onPickerConfirm: msg => {
				let message = msg[0]
				sendSysMsg(message)
				.then(res => {})
				.catch(err => {console.warn(err)})
		  },
//		  onPickerCancel: data => {
//			  this.setState({message: ''})
//		  },
		  onPickerSelect: data => {
			  // console.warn(data);
		  }
	  })
*/

        return (
            <SafeAreaViewPlus  
                topColor={'#d95940'}
                bottomInset={false}>
                <NavigationBar
                    title={'发红包'}
//                    titleStyle={{color: '#feebb4'}}
                    titleStyle={{color: '#fff'}}
                    style={{backgroundColor: '#d95940'}}
                    statusBar={{
                        backgroundColor: '#823526'
                    }}
                    leftButton={WidgetView.getLeftButton(() => this.onBack())}
                />
                <View style={{padding: 18}}>
	                <View style={styles.infoList}>
		                <Text>总金额</Text>
		                <Text>{ this.params.leastMoney } 元</Text>
	                </View>
                  <Text style={styles.tipText}>每个人抽到的金额随机</Text>
                  
	                <View style={[styles.infoList, {marginBottom: 40}]}>
		                <Text>红包个数</Text>
		                <Text>{ this.params.packCount }个</Text>
	                </View>
	
	                <View style={styles.infoList}>
		                <Text>留言</Text>
                        <TextInput
								            maxLength={20}
                            placeholder="恭喜发财, 大吉大利"
                            multiline = {true}
                            style={{width: 200, textAlign: 'right', height: 35, fontSize: 12}}
                            onChangeText={leaveWord => { this.setState({leaveWord}) }}/>
	                </View>
                    <Text style={styles.tipText}>字数限制20字以内</Text>
                    <Text style={{fontSize: 20, color: '#000', textAlign: 'center', marginBottom:  30, fontWeight: "bold"}}>
                        ￥ {this.params.leastMoney.toFixed(2)}
                    </Text>

                    <Button 
                        buttonStyle={{backgroundColor: '#d95940'}} 
                        textStyle={{color: '#feebb4'}}
                        enable={true}
                        onPress={ () => { this._sendPackage() }}
                    text="塞钱进红包"/>
                </View>
                <Toast ref="toast" fadeInDuration={200} fadeOutDuration={2500}/>
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    itemWrap: {
        backgroundColor: '#fff',
        marginBottom: 10
    },
    infoList: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#000',
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tipText: {
    color: '#9b9b9b',
        fontSize: 14,
        paddingLeft: 10,
        paddingBottom: 20,
        lineHeight: 24
    },
    price: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})