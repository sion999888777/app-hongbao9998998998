// 入口: 个人中心 - 个人头像

import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Modal, 
    DeviceEventEmitter,
    AsyncStorage,
    Alert
} from 'react-native'
import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
// import md5 from 'js-md5'     // md5 加密
import md5 from "react-native-md5"

import { Icon } from '../../components/icon'
import Loading from '../../common/loading/index'
import ImageViewer from 'react-native-image-zoom-viewer';
import ImagePicker from 'react-native-image-crop-picker';

import { uploadImgMd5, uploadImg } from '../../request/api/uploadImg'
import { modifyUserInfoSocket } from '../../request/api/socket'
import { modifyRoomInfoSocket } from '../../request/api/socket'
import config from '../../request/config'

const windowWidth = Dimensions.get('window').width;

export default class UploadPicPage extends Component {
    state = {
        index: 0,
        modalVisible: true
      };
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,  // 是否在请求接口
            type: null,
            roomId: null,
            footShow: true,
            imgUrlBack: "", // 后台返回的图片地址
            imgBase64: "",  // base64 创建房间时展示用的
            images: [
                {
                  url: this.props.navigation.state.params.img,
                  freeHeight: true
                }
            ]
        }
    }

    componentDidMount() {
        let type = this.props.navigation.state.params.type ? this.props.navigation.state.params.type : null;
        let roomId = this.props.navigation.state.params.roomId ? this.props.navigation.state.params.roomId : null

        this.setState({
            type: type,
            roomId: roomId
        })
    }
 
    onBackFn = ()=> {
        this.setState({
            footShow: false
        })
        if(this.state.type === "user") {
            DeviceEventEmitter.emit('ChangeUI', { update: true });
        } else 
        if(this.state.type === "roomModify") {
            DeviceEventEmitter.emit('ChangeUI', { update: true });
        } else 
        if(this.state.type === "roomAdd") {
            DeviceEventEmitter.emit('ChangeUI', { roomImg: this.state.imgUrlBack, imgBase64: this.state.imgBase64 });
        }
      
        this.props.navigation.goBack()
    }

    // 调出 拍照 照片选择入口
    picGetFn = ()=> {
        let show = !this.state.footShow
        this.setState({
            footShow: show
        })
    }
    hideFn = ()=> {
        this.setState({
            footShow: false
        })
    }
   
    headerFn = ()=> {
        let rightButton = <TouchableOpacity onPress={this.picGetFn}>
                            <View style={{margin: 10}}>
                                <Icon name={'privateIcon|gengduo'} size={24} color={'#fff'} />
                            </View>
                        </TouchableOpacity>
        let navigationBar = <NavigationBar
                                title = "上传头像"
                                statusBar={{
                                    backgroundColor: '#212025'
                                }}
                                leftButton={WidgetView.getLeftButton(() => this.onBackFn())}
                                rightButton={rightButton}
                            />

        return <View>
            {navigationBar}
        </View>
    }

    _modifyFn(url){
        console.warn("到这了")
        let _This = this
        let dataUser = {
            headIcon: url
        }

        let dataRoomModify = {
            id: this.state.roomId,
            roomLogo: url
        }
        console.warn('this.state.type', this.state.type)
        if(this.state.type === "user") {
            console.warn('9999999999999999')
            let images = [
                {
                  url: this.state.imgBase64.toString(),
                  freeHeight: true
                }
            ]
            this.setState({
                images: images
            }, ()=>{
                _This._modifyUserAvatarFn(dataUser)
            })
        } else 
        if(this.state.type === "roomModify") {
            this._roomModifyFn(dataRoomModify)
        } else 
        if(this.state.type === "roomAdd") {
            // this.setState({
            //     imgUrlBack: url
            // })
            let images = [
                {
                  url: this.state.imgBase64.toString(),
                  freeHeight: true
                }
            ]
            this.setState({
                images: images,
                imgUrlBack: url
            })
        }
    }

    // 修改个人信息 - 头像
    _modifyUserAvatarFn(data) {
        console.warn("修改个人信息 - 头像")
        let _This = this
        this.setState({
            isFetching: true
        })
        modifyUserInfoSocket(data)
        .then(res => {
            if(res.status === "0") {
                let images = [
                    {
                      url: this.state.imgBase64.toString(),
                      freeHeight: true
                    }
                ]
                _This.setState({
                    images: images
                }, ()=>{
                    Alert.alert(
                        '提示', 
                        '头像修改成功',
                        [
                            {text: '确定', onPress: () => { console.warn('确定')}}
                        ]
                    )
                })
            }
        })
        .catch(err => {
            this.setState({
                isFetching: false
            })
            console.warn(JSON.stringify(err))
        })
    }

    // 修改房间信息 - 修改房间头像
    _roomModifyFn(data) {
        let _This = this
        // this.setState({
        //     isFetching: true
        // })
        modifyRoomInfoSocket(data)
        .then(res => {
            // console.warn('房间头像修改成功', JSON.stringify(res))
            // this.setState({
            //     isFetching: false
            // })
            // DeviceEventEmitter.emit('ChangeUI', { update: true });
            // this.props.navigation.goBack()
            let images = [
                {
                  url: this.state.imgBase64.toString(),
                  freeHeight: true
                }
            ]
            _This.setState({
                images: images
            }, ()=>{
                Alert.alert(
                    '提示', 
                    '房间头像修改成功',
                    [
                        {text: '确定', onPress: () => { console.warn('确定')}}
                    ]
                )
            })
        })
        .catch(err => {
            this.setState({
                isFetching: false
            })
            console.warn(JSON.stringify(err))
        })
    }
   

    pickSingleWithCamera(cropping) {
        let _This = this
        this.setState({
            footShow: false
        })

        ImagePicker.openCamera({
            cropping: cropping,
            width: 500,
            height: 500,
            includeExif: true,
            includeBase64: true
        }).then(image => {
            _This.updateImgFn(image)
        }).catch(e => console.warn(e));
    }

    pickSingle(cropit, circular=false) {
        let _This = this
        this.setState({
            footShow: false
        })

        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: cropit,
          cropperCircleOverlay: circular,
          compressImageMaxWidth: 640,
          compressImageMaxHeight: 480,
          compressImageQuality: 0.5,
          compressVideoPreset: 'MediumQuality',
          includeExif: true,
          includeBase64: true
        }).then(image => {
            _This.updateImgFn(image)
        }).catch(e => {
          console.log(e);
        });
      }

    updateImgFn(image){
        let _This = this
        let nameInit = image.path.split("/")
        let name = nameInit[nameInit.length-1]

          // base64 图片 - 用于选择照片后展示用
        let base64Header = "data:image/jpg;base64,"
        let imageData = JSON.stringify(image.data)
        let base64Img = base64Header.concat(imageData.substring(1,imageData.length - 1))

        let formData = new FormData(); 
        let file = {
            uri: image.path, 
            type: 'multipart/form-data', 
            name: name
        }; 
        formData.append("file", file);  
        formData.append("name", name);  
        formData.append("size", image.size);  
        formData.append("fileMd5",md5.hex_md5(image.path));  

        let data = {
            fileMd5:  md5.hex_md5(image.path)
        }

        console.warn("到这了")
        uploadImgMd5(data)
            .then(async (res) => {
                console.warn("resres", JSON.stringify(res))
                if(res.code !== "200") {
                    return
                } 
                if(res.viewPath !== undefined) {
                    alert("数据库中已有此图片")
                    return
                } 
              
                let url = config.uploadImg
                const token = await AsyncStorage.getItem('token').then()
    
                console.warn('formData', formData)
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        // 'Accept': 'application/json',
                        // 'Content-Type': 'multipart/form-data',
                        "Authentication": token,
                        "PN": "HB"
                    },
                    // processData: false,
                    // contentType: false,
                    body: formData
                }).then(function (response) {
                    let data = JSON.parse(response._bodyInit)
                    console.warn('这次对不', data.data)
                    _This.setState({
                        imgBase64: base64Img
                    })
                    _This._modifyFn(data.data)
                }).catch(err => {
                    console.warn('这次错的', err)
                })
    
            })
            .catch(err => {
                console.warn('md5验证错误', JSON.stringify(err))
            })
    }

    footerFn = ()=> {
        return (
            <View style={{height: 210}}>
                <View style={{backgroundColor: 'rgba(255,255,255,.9)', width: windowWidth, height: 104,}}>
                    <Text 
                        onPress={() => this.pickSingleWithCamera(true)}
                        style={{color: '#000', width: windowWidth, textAlign: 'center', paddingTop: 16, paddingBottom: 16, borderBottomColor: '#8a8a8a', borderBottomWidth: 1}}>
                        拍照
                    </Text>
                    <Text  onPress={() => this.pickSingle(true)} 
                        style={{color: '#000', width: windowWidth, textAlign: 'center', paddingTop: 16, paddingBottom: 16, borderBottomColor: '#8a8a8a', borderBottomWidth: 1}}>
                        从手机相册选择
                        </Text>
                    {/* <Text 
                        style={{color: '#000', width: windowWidth, textAlign: 'center', paddingTop: 16, paddingBottom: 16}}>
                        保存图片
                        </Text> */}
                
                </View>
                <View style={{backgroundColor: 'rgba(255,255,255,.9)', width: windowWidth, height: 50, marginTop: 6}}>
                    <Text 
                        onPress={this.hideFn}
                        style={{color: '#000', width: windowWidth, textAlign: 'center', paddingTop: 16, paddingBottom: 16}}>取消</Text>
                </View>
            </View>
        )
    }
   
    render() {
        return (
            <View>
                <View>
                    <Modal
                        transparent={true}
                        onRequestClose={() => this.setState({ modalVisible: false })}
                    >
                    {
                        this.state.footShow ? 
                        <ImageViewer
                            renderHeader = {this.headerFn}
                            renderFooter = {this.footerFn}
                            imageUrls={this.state.images}
                            index={this.state.index}
                            onSwipeDown={() => {
                            console.log('onSwipeDown');
                            }}
                            enableSwipeDown={true}
                        /> : 
                        <ImageViewer
                            renderHeader = {this.headerFn}
                            imageUrls={this.state.images}
                            index={this.state.index}
                            onSwipeDown={() => {
                            console.log('onSwipeDown');
                            }}
                            enableSwipeDown={true}
                        /> 
                    }
                    </Modal>
                </View>
                <Loading isShow={this.state.isFetching}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})