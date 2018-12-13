import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import ItemPage from './record/list'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

export default class RoomRecordPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomId: this.props.navigation.state.params.roomId
        }
    }


    render() {
        let navigationBar = <NavigationBar
                    title = "房间记录"
                    statusBar={{
                        backgroundColor: '#212025'
                    }}
                    leftButton={WidgetView.getLeftButton(() => {
                        this.props.navigation.goBack()
                        this.refs.ItemPage.pickHide()
                    })}
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
                            <ScrollView tabLabel='全部' style={styles.content}>
                                <ItemPage ref="ItemPage" name="all" roomId={this.state.roomId} />
                            </ScrollView>
                            <ScrollView tabLabel='进出房间' style={styles.content}>
                                <ItemPage ref="ItemPage" name="comeAndGo" roomId={this.state.roomId} />
                            </ScrollView>
                            <ScrollView tabLabel='红包' style={styles.content}>
                                <ItemPage ref="ItemPage" name="redPackage" roomId={this.state.roomId} />
                            </ScrollView>
                            <ScrollView tabLabel='其他' style={styles.content}>
                                <ItemPage ref="ItemPage" name="other" roomId={this.state.roomId} />
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

