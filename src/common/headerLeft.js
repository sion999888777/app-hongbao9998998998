import React, { Component } from 'react'
import { 
    TouchableOpacity,
    View,
    Text
 } from 'react-native'

 import { Icon } from '../components/icon'

 export default class WidgetView {
     static getLeftButton(callBack, iconColor) {
         return <TouchableOpacity
                    style={{padding: 8}}
                    onPress={callBack}
                    >
                   <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}}>
                        {
                            iconColor ?
                            <Icon name={'privateIcon|back'} size={14} color={iconColor}/> 
                            :
                            <Icon name={'privateIcon|back'} size={14} color={"#fff"}/> 
                        }
                   </View>
                </TouchableOpacity>
     }
 }  