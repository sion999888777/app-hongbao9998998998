/** @format */

import { AppRegistry, AsyncStorage } from 'react-native';
// 启动APP将 本地存储数据 拷贝到缓存
import SyncStorage from './src/util/syncStorage';
SyncStorage.init()


SyncStorage.setItem('showHistory', 'yes')
// AsyncStorage.removeItem('token')
// AsyncStorage.removeItem('booted')
AsyncStorage.getItem('token')
  .then((res) => {
    console.warn('初始化token=', res)
  })
 import App from './App';
 import {name as appName} from './app.json';

 AppRegistry.registerComponent(appName, () => App)


//if (!AppRegistry.registerComponentOld) {
//  AppRegistry.registerComponentOld = AppRegistry.registerComponent
//}
//
//AppRegistry.registerComponent = function (appKey, componentProvider) {
//
//  class RootElement extends Component {
//    render() {
//      let Component = componentProvider()
//      return (
//        <RRCTopView>
//          <Component {...this.props} />
//        </RRCTopView>
//      )
//    }
//  }
//
//  return AppRegistry.registerComponentOld(appKey, () => RootElement)
//}
