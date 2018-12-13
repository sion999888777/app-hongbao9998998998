import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import { Icon } from '../../components/icon'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

export default class LowGoldPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numArr: [
                {
                    num: '5',
                    checked: false
                },
                {
                    num: '10',
                    checked: false
                },
                {
                    num: '15',
                    checked: false
                },
                {
                    num: '20',
                    checked: false
                }
            ]
        }
    }
    onBackFn = ()=> {
        this.props.navigation.goBack()
    }
    checkedFn (item) {
        let items = [];
        items = items.concat(this.state.numArr);
        
        item.checked = !item.checked
        this.setState({  
            numArr: items  
        });  
    }
    _renderItem(data) {
        let item = data.item
        return (
            <TouchableOpacity onPress={() => this.checkedFn(item)}>
                <View style={styles.item}>
                    <Text>{item.num}元</Text>
                    {
                        item.checked ?
                        <Icon name={'privateIcon|gouxuan'} size={12} color={'#007aff'} />
                         :
                        null 
                    }
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let rightButton = <TouchableOpacity >
                            <View style={{margin: 10}}>
                                <Text style={{color: '#316834', fontSize: 15}}>完成</Text>
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
            title = "底金"
            statusBar={{
                backgroundColor: '#212025'
            }}
            leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
            rightButton={rightButton}
        />

        return (
            <SafeAreaViewPlus  
                topColor={'#212025'}
                bottomInset={false}>
                {navigationBar}
                <FlatList
                    style={styles.itemWrap}
                    data={this.state.numArr}
                    renderItem={(data) => this._renderItem(data)}
                />
            </SafeAreaViewPlus>
        )
    }
}

const styles = StyleSheet.create({
    itemWrap: {
        marginTop: 14
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 21,
        paddingRight: 18,
        backgroundColor: '#fff',
        borderBottomColor: '#ececec',
        borderBottomWidth: 1,
        fontSize: 20
    },
})