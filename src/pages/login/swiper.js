import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native'
import Swiper from 'react-native-swiper'
const { width, height } = Dimensions.get('window')


export default class SwiperPage extends Component {
  render () {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#ff0000"
            translucent={true}
            hidden={true}
            animated={true}/>
        {/* <Image
          source={require('./imgs/01.jpg')}
          style={styles.imgBackground}
        /> */}
        <Swiper style={styles.wrapper}
            // autoplay={true}
            dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            activeDot={<View style={{backgroundColor: '#fff', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            paginationStyle={{
                bottom: 70
            }}
          loop={false}>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require('./imgs/01.png')}
              resizeMode='cover'
            />
          </View>
          <View style={styles.slide}>
            <Image
              style={styles.image}
              source={require('./imgs/02.png')}
              resizeMode='cover'
            />
          </View>
          <View style={styles.slide}>
            <Image style={styles.image} source={require('./imgs/03.png')} />
            <Text 
              onPress={() => this.props.afterBooted() }
              style={{
                  position: 'absolute', bottom: 70, left: width*0.15, width: width*0.7, height: 43,
                  backgroundColor: "#fff", textAlign: "center", lineHeight: 43, borderRadius: 5, fontSize: 18}}>
              立即体验</Text>
          </View>
        </Swiper>
      </View>
    )
  }
}

const styles = {
    wrapper: {
      // backgroundColor: '#f00'
    },
  
    slide: {
      flex: 1,
      backgroundColor: 'transparent'
    },
    container: {
      flex: 1,
    },
  
    imgBackground: {
      width,
      height,
      backgroundColor: 'transparent',
      position: 'absolute'
    },
  
    image: {
      width,
      height,
    }
  }