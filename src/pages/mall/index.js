import React, { Component } from 'react'
import {
    View,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
const {width, height} = Dimensions.get('window');

export default class MallPage extends Component {
    constructor(props) {
        super(props);
    }
 
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
					style={{backgroundColor: '#212025'}}
					title = "商城"
					statusBar={{
						backgroundColor: '#212025'
					}}
					titleStyle={{color: '#fff'}}
				/>
                 <Image
                    style={styles.backImg}
                    resizeMode ='contain'
                    source={require('./imgs/back.jpg')}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    backImg: {
        width: width*0.85, 
        height: height*0.53, 
        marginLeft: (width - width*0.85)/2,
        marginTop: height*0.123
    }
})
