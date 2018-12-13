import React, { Component } from "react"

import AppNavigators from './src/navigators/AppNavigators'

export default class App extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			needUpdate: false
		}
	}
	
	componentDidMount() {
		console.warn('新包测试测试!有没有问题')
	}
  
 
	render() {
		return <AppNavigators />
	}
}
