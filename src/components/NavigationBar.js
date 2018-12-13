import React, { Component } from 'react'
import { 
    View,
    Text,
    StyleSheet,
    ViewPropTypes,
    Platform,
    DeviceInfo,
    StatusBar 
 } from 'react-native'
import PropTypes from 'prop-types';

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 0 : 20;
const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default',]),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string,
};

export default class NavigationBar extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        hide: PropTypes.bool,
        rightButton:  PropTypes.element,
        leftButton: PropTypes.element,
        statusBar: PropTypes.shape(StatusBarShape),
        titleStyle: ViewPropTypes.titleStyle
    }
    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false,
        },
    } 
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hide: false
        }
    }

    render() {
        let statusBar = <View style={styles.statusBar}>
            <StatusBar {...this.props.statusBar} />
        </View>
        let titleView = this.props.titleView ? 
                        this.props.titleView : 
                        <Text style={[styles.title, this.props.titleStyle || {}]}>{this.props.title}</Text>
        let content = <View style={styles.navBar}>
            {this.props.leftButton}
            <View style={styles.navBarTitleContainer}>
                {titleView}
            </View>
            {this.props.rightButton}
        </View>

        return (
            <View style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#212025',
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        top: 0,
        right: 40,
        bottom: 0,
    },
    title: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    navBarButton: {
        alignItems: 'center',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    },
})
