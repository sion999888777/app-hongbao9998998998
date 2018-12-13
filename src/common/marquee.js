import React, { Component } from 'react';
import { Text, View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SPACE = '\t\t\t\t\t\t';

export default class MarqueeText extends Component {
	mLeft: number = 0;
	constructor (props) {
		super(props);
		
		this.text = ''
		this.layoutText = ''
	}
	
	componentDidMount () {}
	
	componentWillUnmount () {
		this.inteval && clearInterval(this.inteval)
	}
	
	startAnima () {
		if (this.inteval) {
			return
		}
		
		this.inteval = setInterval(() => {
			this.mLeft = this.mLeft - this.props.speed
			if (Math.abs(this.mLeft) >= this.textWidth) {
				this.mLeft = 0
			}
			
			this.refText.setNativeProps({style: {left: this.mLeft}});
		}, 10);
	}
	
	refView = (ref) => {
		this.refText = ref;
	};
	
	refLayoutView(ref) {
		if (!ref) {
			return
		}
		ref.setNativeProps({style: {height: 0}})
	}
	
	onContainerLayout = (e) => {
		this.containerWidth = e.nativeEvent.layout.width
		// 1.文字太短的不滚动
		if (this.textWidth - this.spaceWidth <= this.containerWidth) {
			this.text = this.props.text
			this.forceUpdate()
			return
		}
		// 2.文字达到滚动标准的，要重新设置一下滚动view的宽度
		this.refText.setNativeProps({style: {width: this.textWidth * 2}});
		this.startAnima()
	};
	
	onTextLayout = (e) => {
		this.textWidth = e.nativeEvent.layout.width;
	}
	
	onSpaceLayout = (e) => {
		this.spaceWidth = e.nativeEvent.layout.width
	}
	
	render () {
		if (this.textWidth - this.spaceWidth <= this.containerWidth) {
			this.text = this.props.text
		} else {
			this.text = this.props.text + SPACE + this.props.text
		}
		
		this.layoutText = this.props.text + SPACE
		
		return (
			<View onLayout={this.onContainerLayout} style={this.props.style} overflow="hidden">
				<View style={{width: SCREEN_WIDTH * 2, flexDirection: 'row'}}>
					<Text ref={this.refLayoutView} style={[this.props.textStyle, {height: 1}]} onLayout={this.onSpaceLayout}>{SPACE}</Text>
					<Text ref={this.refLayoutView} style={[this.props.textStyle, {height: 1}]} onLayout={this.onTextLayout}>{this.layoutText}</Text>
				</View>
				<Text ref={this.refView} style={[this.props.textStyle, {width: SCREEN_WIDTH + 50, left: 0}]} numberOfLines={1}>{this.text}</Text>
			</View>
		);
	}
}

MarqueeText.defaultProps = {
	speed: 0.5
};

MarqueeText.propTypes = {
	/**
	 * 以10ms为单位的速度
	 */
	speed: PropTypes.number,
	/**
	 * 定义本组件的style
	 */
	style: PropTypes.object,
	textStyle: PropTypes.object
};