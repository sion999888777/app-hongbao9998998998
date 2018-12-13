import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import { getUserInfoSocket } from '../../request/api/socket'
import config from '../../request/config'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

export default class MoreUserPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userSimpleInfos: this.props.navigation.state.params.userData ? this.props.navigation.state.params.userData : []
        }
    }

    backFn = ()=> {
        this.props.navigation.goBack()
    }

    render() {
        const {navigate} = this.props.navigation
        let navigationBar = <NavigationBar
                    title = "群成员"
                    statusBar={{
                        backgroundColor: '#212025'
                    }}
                    leftButton={WidgetView.getLeftButton(() => this.backFn())}
                />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                <View style={styles.container}>
                    {navigationBar}
                    <View style={styles.header}>
                        <View style={styles.avatarWrap}>
                            {
                                this.state.userSimpleInfos.map((item)=> {
                                    return (
                                        <TouchableOpacity 
                                            onPress={() => {
                                                navigate("UserInfoPage", {id: item.id})
                                            }}
                                            style={styles.avatarBox}>
                                            {
                                                item.headerImg ? 
                                                <Image 
                                                    resizeMode ='stretch'
                                                    style={styles.avatar} 
                                                    source={{uri: config.imgUrl+item.headerImg }} /> :
                                                <Image
                                                    resizeMode ='stretch'
                                                    style={styles.avatar}
                                                    source={require('./imgs/def.png')}
                                                />
                                            }
                                            {
                                                item.nickName ? 
                                                <Text style={styles.avatarText}>
                                                    {item.nickName ? (item.nickName.length > 3 ? item.nickName.substr(0, 3) + "..." : item.nickName) : ""}
                                                </Text> :
                                                <Text style={styles.avatarText}>昵称</Text>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </View>
                    </View>
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
    header: {
        backgroundColor: '#fff',
        paddingBottom: 20,
        flex: 1,
    },
    avatarWrap: {
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap',
        paddingLeft: 4,
        paddingRight: 4,
        backgroundColor: '#fff',
    },
    avatarBox: {
        marginTop: 16,
    },
    avatar: {
        width: 46,
        height: 46,
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 5
    },
    avatarText: {
        textAlign: 'center',
        fontSize: 11,
        color: '#454545',
    },  
})