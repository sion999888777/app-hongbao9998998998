import React, { Component } from "react";
import {
	Modal,
	Text,
	TouchableHighlight,
	View,
	Dimensions,
	StyleSheet,
	TouchableOpacity,
	ImageBackground,
	Image
} from "react-native"

import {Icon} from "../icon"
import config from "../../request/config"

const {width, height} = Dimensions.get('window')

export default class RedPckModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalVisible: false
		}
	}
	
	hide = () => {
		this.setState({modalVisible: false})
	}
	
	show = () => {
		this.setState({modalVisible: true})
	}
	
	render() {
		return (
			<Modal
				presentationStyle="overFullScreen"
				hardwareAccelerated={true}
				style={{opacity: 0.3, backgroundColor: '#000'}}
				animationType="fade"
				visible={this.state.modalVisible}
				transparent={ true }
				onRequestClose={() => {
					this.setState({modalVisible: false})
				}}>
				<TouchableHighlight style={styles.back} onPress={this.hide}>
					<View></View>
				</TouchableHighlight>
				<ImageBackground  style={styles.ModalBox} source={require('./imgs/tanchu.png')} resizeMode='cover'>
						<View style={{height: '100%'}}>
								<TouchableOpacity onPress={this.hide} style={styles.exitIcon}>
										<Icon name={'privateIcon|delete'} size={16} color={'#909090'} />
								</TouchableOpacity>
							
							{
								this.props.errData.err ? <View style={{height: '100%'}}>
										<Text style={styles.errText}>{ this.props.errData.err }</Text>
										<TouchableOpacity style={{position: 'absolute', bottom: 10, width: '100%'}} onPress={ () => { this.props.redpckDetail(this.props.errData.packId)}}>
											<Text style={{color: '#fce8bc', fontSize: 14, textAlign: 'center'}}>查看大家手气>></Text>
										</TouchableOpacity>
									</View> : <View style={{height: '100%'}}>
									<View style={[center, {marginTop: 60}]}>
										<Image source={this.props.packetInfo.avatar? {uri: config.imgUrl + this.props.packetInfo.avatar} : require('./imgs/def.png')}
										       style={styles.avatar} resizeMode='cover'>
										</Image>
									</View>
									
									<View>
										<Text style={{color: '#fff', textAlign: 'center', marginTop: 18, marginBottom: 10}}>{ this.props.packetInfo.nickname || '菠萝吹雪'}</Text>
										<Text style={{color: '#fce8bc', textAlign: 'center'}}>发了一个红包</Text>
										<Text style={{color: '#fce8bc', textAlign: 'center', marginTop: 30, fontSize: 20}}>{ this.props.packetInfo.title || '大吉大利,恭喜发财'}</Text>
									</View>
									
									<TouchableOpacity onPress={ () => { this.props.openPacket() }} style={[center, openLeft]}>
										<Image source={require('./imgs/open.png')} style={styles.redPackAvatar} resizeMode='cover'></Image>
									</TouchableOpacity>
								</View>
							}
							
						</View>
				</ImageBackground>
			</Modal>
		)
	}
}


const center = {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
}

const openLeft = {
	position: 'absolute',
	left: '50%',
	marginLeft: -40,
	bottom: (width*0.8*1.4)*0.18
}

const styles = StyleSheet.create({
	back: {
		position: 'absolute',
		top: 0, left: 0, bottom: 0, right: 0,
		backgroundColor: 'rgba(0, 0, 0, .1)',
		width,
		height
	},
	ModalBox: {
		width: width*0.8,
		height: width*0.8*1.4, // 图片宽高比
		position: 'absolute',
		top: height*0.2,
		left: width*0.1,
		borderRadius: 10,
		overflow: 'hidden'
	},
	exitIcon: {
		position: 'absolute',
		right: 10,
		top: 10
	},
	
	avatar: {
		width: 70,
		height: 70,
		borderRadius: 40,
		marginTop: -10
	},
	
	redPackAvatar: {
		width: 80,
		height: 80
	},
	
	errText: {
		textAlign: 'center',
		color: '#fce8bc',
		width: '100%',
		top: '35%',
		position: 'absolute',
		fontSize: 25
	}
})
