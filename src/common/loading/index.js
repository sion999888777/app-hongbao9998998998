/**
 * Created by ljunb on 16/6/2.
 */
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions
} from 'react-native'
import PropTypes from 'prop-types';
const { width, height } = Dimensions.get('window')

export default class Loading extends Component {
    static propTypes = {
        isShow: PropTypes.bool
    }

    render() {
        if (!this.props.isShow) return null;

        return (
            <View style={styles.container}>
                <View style={styles.loading}>
                    <ActivityIndicator color="black"/>
                    <Text style={styles.loadingTitle}>加载中……</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,.1)",
        height: height,
        width: width
    },
    loading: {
        height: 80,
        width: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingTitle: {
        marginTop: 10,
        fontSize: 14,
        color: '#666'
    }
})