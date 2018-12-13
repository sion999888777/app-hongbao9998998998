import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  StyleSheet,
	TouchableOpacity
} from "react-native";

const {width, height} = Dimensions.get('window')

export default class Dialog extends Component {
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
            animationType="fade"
            hardwareAccelerated={true}
            visible={this.state.modalVisible}
            transparent={true}
            onRequestClose={() => {
                alert("Modal has been closed.");
            }}>
            <TouchableHighlight style={styles.back} onPress={this.hide}>
                <View></View>
            </TouchableHighlight>
          
            <View style={styles.dialog}>
              {/*头部*/}
	            {
		            this.props.title ?
		            <Text style={styles.dialogHeader}>{this.props.title}</Text> :
		            null
	            }
               
               
               {/*主体*/}
               <View style={styles.content}>
                 { this.props.content }
               </View>
               
              {
                this.props.cancelText ? <View style={styles.footer}>
	                <TouchableOpacity style={styles.cancelBtn} onPress={() => {this.setState({modalVisible: false})}}>
		                <Text style={{textAlign: 'center'}}>取消</Text>
	                </TouchableOpacity>
	                <TouchableOpacity style={styles.confirmBtn} onPress={() => {
		                this.props.confirmCallBack && this.props.confirmCallBack()
                  }}>
		                <Text style={{textAlign: 'center'}}>确定</Text>
	                </TouchableOpacity>
                </View> : <View style={styles.footer}>
	                <TouchableOpacity style={styles.confirmBtn1} onPress={() => {
		                this.props.confirmCallBack && this.props.confirmCallBack()
                  }}>
		                <Text style={{textAlign: 'center'}}>确定</Text>
	                </TouchableOpacity>
                </View>
              }
            </View>
        </Modal>
    )
  }
}

const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        top: 0, 
        left: 0,
        backgroundColor: 'rgba(0,0,0,.1)',
        width: width,
        height: height
    },
    dialog: {
        width: width * 0.7,
        borderRadius: 7,
        backgroundColor: '#fff',
        position: 'absolute', 
        left: width * 0.15,
        overflow: 'hidden',
        top: (height - 150)/ 2,
    },
    dialogHeader: {
        paddingBottom: 7,
        paddingTop: 13,
	      fontSize: 14,
        textAlign: 'center',
        
    },
	  content: {
        paddingTop: 10,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
		    borderBottomWidth: 1,
		    borderBottomColor: '#d7d7d7'
    },
  
    footer: {
        flexDirection: 'row',
    },
	  cancelBtn: {
      width: width * 0.35,
      borderRightColor: '#d7d7d7',
      borderRightWidth: 1,
		  paddingTop: 10,
		  paddingBottom: 10,
    },
	  confirmBtn: {
      width: width * 0.35,
		  paddingTop: 10,
		  paddingBottom: 10,
    },
	  confirmBtn1: {
		  width: width * 0.6,
		  paddingTop: 10,
		  paddingBottom: 10,
    }
})




















