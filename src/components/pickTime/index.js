import React, { Component } from 'react'
import {
  Text,
  View,
  ViewPropTypes,
  StyleSheet,
  Dimensions
} from 'react-native';

import Picker from 'react-native-picker';

const windowWidth = Dimensions.get('window').width;

export default class PickTimeComponent extends Component {
    static propTypes = {
        type: ViewPropTypes.string, 
        chooseTime: ViewPropTypes.string,
        func: ViewPropTypes.func,
    }

    _showTimePicker() {
        let _This = this

        let years = [],
            months = [],
            days = [],
            hours = [],
            minutes = [];
    
        for(let i=1;i<41;i++){
            years.push(i+1980);
        }
        for(let i=1;i<13;i++){
            months.push(i);
            hours.push(i);
        }
        for(let i=1;i<32;i++){
            days.push(i);
        }
        for(let i=1;i<61;i++){
            minutes.push(i);
        }
        let pickerData = [years, months, days, ['上午', '下午'], hours, minutes];
        let date = new Date();
        let selectedValue = [
            date.getFullYear(),
            date.getMonth()+1,
            date.getDate(),
            date.getHours() > 11 ? '下午' : '上午',
            date.getHours() === 12 ? 12 : date.getHours()%12,
            date.getMinutes()
        ];
        Picker.init({
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            pickerData,
            selectedValue,
            pickerTitleText: 'Select Date and Time',
            wheelFlex: [2, 1, 1, 2, 1, 1],
            onPickerConfirm: pickedValue => {
                // _This._showTimeFn(pickedValue, type) 
                _This.props.func(pickedValue)
            },
            onPickerCancel: pickedValue => {
                console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                let targetValue = [...pickedValue];
                if(parseInt(targetValue[1]) === 2){
                    if(targetValue[0]%4 === 0 && targetValue[2] > 29){
                        targetValue[2] = 29;
                    }
                    else if(targetValue[0]%4 !== 0 && targetValue[2] > 28){
                        targetValue[2] = 28;
                    }
                }
                else if(targetValue[1] in {4:1, 6:1, 9:1, 11:1} && targetValue[2] > 30){
                    targetValue[2] = 30;
                    
                }
                // forbidden some value such as some 2.29, 4.31, 6.31...
                if(JSON.stringify(targetValue) !== JSON.stringify(pickedValue)){
                    // android will return String all the time，but we put Number into picker at first
                    // so we need to convert them to Number again
                    targetValue.map((v, k) => {
                        if(k !== 3){
                            targetValue[k] = parseInt(v);
                        }
                    });
                    Picker.select(targetValue);
                    pickedValue = targetValue;
                }
            }
        });
        Picker.show();
    }

    

    render() {
        return (
            <View>
                <Text 
                    onPress={() => this._showTimePicker()}
                    style={[styles.choose, {marginRight: 25}]}>{this.props.chooseTime}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    choose: {
        paddingTop: 10,
        paddingBottom: 6,
        paddingLeft: 14,
        paddingRight: 14,
        borderWidth: 1,
        borderColor: "#e9e9e9",
        borderRadius: 50,
        fontSize: 11,
        color: "#16b916",
        marginLeft: 4,
        width: windowWidth * 0.35
      },
})