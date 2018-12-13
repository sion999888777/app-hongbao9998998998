import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import ItemPage from './account/list'

export default class AccountRecordPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
    }

    render() {
        let navigationBar = <NavigationBar
                    title = "账户记录"
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
                            onChangeTab={this.changeTabFn}
                        >
                            <ScrollView tabLabel='全部' style={styles.content}>
                                <ItemPage ref="ItemPage" name="all" />
                            </ScrollView>
                            <ScrollView tabLabel='红包' style={styles.content}>
                                <ItemPage ref="ItemPage" name="redPackage" />
                            </ScrollView>
                            <ScrollView tabLabel='房主佣金' style={styles.content}>
                                <ItemPage ref="ItemPage" name="commission" />
                            </ScrollView>
                            <ScrollView tabLabel='其他' style={styles.content}>
                                <ItemPage ref="ItemPage" name="other" />
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
    flexStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
  content: {
    backgroundColor: "#fff",
    height: 400
  },
 
});
