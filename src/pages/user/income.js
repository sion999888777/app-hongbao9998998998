import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  DeviceEventEmitter
} from 'react-native';
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'
import ItemPage from './income/list'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'

export default class IncomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    _backFn = ()=>{
        this.props.navigation.goBack()
        this.refs.ItemPage.pickHide()
        DeviceEventEmitter.emit('ChangeUI', { update: true});
    }

    render() {
        let navigationBar = <NavigationBar
                    title = "我的营收"
                    statusBar={{
                        backgroundColor: '#212025'
                    }}
                    leftButton={WidgetView.getLeftButton(() => this._backFn())}
                />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                <View style={styles.container}>
                        {navigationBar}
                        <ScrollableTabView
                            tabBarBackgroundColor='#fff'
                            tabBarActiveTextColor='#000000'
                            tabBarInactiveTextColor='#999999'
                            tabBarUnderlineStyle={{backgroundColor: "#16b916", height: 1}}
                            initialPage={0}
                            renderTabBar={() => <ScrollableTabBar />}
                            // onChangeTab={this.tabFn}
                            // onChangeTab={(obj)=>this.tabFn(obj.i)}
                        >
                            <ScrollView tabLabel='游戏收入' style={styles.content}>
                                <ItemPage ref="ItemPage" name="game" />
                            </ScrollView>
                            <ScrollView tabLabel='房主收入' style={styles.content}>
                                <ItemPage ref="ItemPage" name="room" />
                            </ScrollView>
                        </ScrollableTabView>
                </View>
           </SafeAreaViewPlus>
        )
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    backgroundColor: "#fff",
    height: 400
  },
});

