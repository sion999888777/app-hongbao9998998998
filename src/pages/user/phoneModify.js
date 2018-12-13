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
import Button from '../../components/Button/index'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

const windowWidth = Dimensions.get('window').width;

export default class PhoneModifyPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phoneNum: ""
        }
    }

    componentDidMount() {
        let phone = this.props.navigation.state.params.phone;
      
        this.setState({
            phoneNum: phone
        })
    }

    onBackFn = ()=> {
        this.props.navigation.goBack()
    }
    nextFn = ()=> {
        const { navigate } = this.props.navigation;
        navigate("CurrentPhoneCodePage", {phone: this.state.phoneNum})
    }

    render() {
        let navigationBar = <NavigationBar
            title = "手机号"
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
                        <Image style={styles.phoneAvatar} source={require("./imgs/phone.png")} />
                        <Text style={styles.phoneNum}>
                            <Text>你的手机号: </Text>
                            <Text>{this.state.phoneNum}</Text>
                        </Text>
                        <Button
                            enable={true}
                            textStyle={styles.textStyle}
                            text='更换手机号'
                            buttonStyle={styles.buttonStyle}
                            onPress={this.nextFn}/>
                    </View>
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
    phoneAvatar: {
        width: 110 * windowWidth / 750,
        height: 198 * windowWidth / 750,
        marginLeft: (windowWidth -  110 * windowWidth / 750) / 2,
        marginTop: 37
    },
    phoneNum: {
        fontSize: 16,
        color: "#010101",
        textAlign: "center",
        marginTop: 25,
        marginBottom: 21
    },
    buttonStyle: {
        width: windowWidth - 30,
        backgroundColor: "#fff",
        marginLeft: 15,
        borderWidth: 1,
        borderColor: "#e4e4e4"
      },
      textStyle: {
        fontSize: 18,
        color: "#777777"
      }
})