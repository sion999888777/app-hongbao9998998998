import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'

import IndexPage      from '../pages/index'
import SwiperPage     from '../pages/login/swiper'
import Login          from '../pages/login/login.js'
import Register       from '../pages/login/register.js'
import PasswordFind   from '../pages/login/passwordFind.js'
import PasswordReset  from '../pages/login/passwordReset.js'
import SearchPage     from '../common/search/search' 

// 添加房间
import AddRoomPage            from '../pages/addRoom/index' 
import RoomDesPage            from '../pages/addRoom/roomDes' 
import PasswordSetPage        from '../pages/addRoom/passwordSet' 
import RoomNameModifyPage     from '../pages/addRoom/roomNameModify'
import RedPackageNumPage      from '../pages/addRoom/redPackageNum' 
import GiveRedPackageRulePage from '../pages/addRoom/giveRedPackageRule' 
import LowGoldPage            from '../pages/addRoom/lowGold' 

// 红包模块
import RoomDetailPage       from '../pages/redPackage/index' 
import UserInfoPage         from '../pages/redPackage/userInfo' 
// import ReceiveDetailPage    from '../pages/redPackage/receiveDetail' 
import SendPackagePage      from '../pages/redPackage/sendPackage'
import RedPackageDetailPage from '../pages/redPackage/redPackageDetail'

// 房间详情
import RoomMoreInfoPage   from '../pages/roomInfos/index' 
import RoomSharePage      from '../pages/roomInfos/roomShare' 
import RoomRecordPage     from '../pages/roomInfos/roomRecord' 
import MoreUserPage       from '../pages/roomInfos/moreUser'

// 包间列表
import RoomList from '../pages/room/roomList'
import UserAgreement from '../pages/userAgreement/index'

// 个人中心
import UserInfoPrivatePage            from '../pages/user/userInfo'
import UserInfo                       from '../pages/user/index'
import UserPasswordSetPage            from '../pages/user/userPasswordSet'
import UserNamePage                   from '../pages/user/userName'
import PhoneModifyPage                from '../pages/user/phoneModify'
import CurrentPhoneCodePage           from '../pages/user/currentPhoneCode'
import NewPhonePage                   from '../pages/user/newPhone'
import AccountPage                    from '../pages/user/account'
import AccountRecordPage              from '../pages/user/accountRecord'
import StagePropertyPage              from '../pages/user/stageProperty'
import LevelTaskPage                  from '../pages/user/levelTask'
import IncomePage                     from '../pages/user/income'
import GoldPage                       from '../pages/user/gold'
import GoldExchangePage               from '../pages/user/goldExchange'
import CustomerServicePage            from '../pages/user/customerService'
import WithdrawPage                   from '../pages/user/withdraw'
import WithdrawChangePage             from '../pages/user/withdrawChange'
import ModifyPasswordVerifyPage       from '../pages/user/modifyPasswordVerify'
import SettingPage                    from '../pages/user/setting'
import RechargePage                   from '../pages/user/pay/recharge'

// 公用 - 图片上传裁切
import UploadPicPage   from '../pages/common/uploadPic'


const AppNavigators = StackNavigator(
    {
      IndexPage: {
        screen: IndexPage,
        // screen: RoomList,
        // screen: SendPackagePage,
        // screen: RoomDetailPage,
        // 隐藏导航栏
        // navigationOptions: ({navigation}) => ({header: null, gesturesEnable: true})
	      // gesturesEnabled: true // 是否支持滑动返回手势，iOS默认支持，安卓默认关闭
      },
      SwiperPage: {
        screen: SwiperPage
      },
      SearchPage: {
        screen: SearchPage
      },
      Login: {
        screen: Login
      },
      Register: {
        screen: Register
      },
      PasswordFind: {
        screen: PasswordFind
      },
      PasswordReset: {
        screen: PasswordReset
      },
      // 添加房间
      AddRoomPage: {
        screen: AddRoomPage
      },
      // 修改房间简介
      RoomDesPage: {
        screen: RoomDesPage
      },
      RedPackageNumPage: {
        screen: RedPackageNumPage
      },
      LowGoldPage: {
        screen: LowGoldPage
      },
      GiveRedPackageRulePage: {
        screen: GiveRedPackageRulePage
      },
      RoomDetailPage: {
        screen: RoomDetailPage
      },
      RoomMoreInfoPage: {
        screen: RoomMoreInfoPage
      },
      RoomSharePage: {
        screen: RoomSharePage
      },
      UserInfoPage: {
        screen: UserInfoPage
      },
      PasswordSetPage: {
        screen: PasswordSetPage
      },
      RoomRecordPage: {
        screen: RoomRecordPage
      },
      MoreUserPage: {
        screen: MoreUserPage
      },
      // ReceiveDetailPage: {
      //   screen: ReceiveDetailPage
      // },
      SendPackagePage: {
        screen: SendPackagePage
      },
	    RoomList: {
		    screen: RoomList
      },
      RedPackageDetailPage: {
        screen: RedPackageDetailPage
      },

      RoomNameModifyPage: {
        screen: RoomNameModifyPage
      },

      // 用户条款
      UserAgreement: {
        screen: UserAgreement
      },

      // 个人中心 - 首页
      UserInfo: {
        screen: UserInfo
      },
      UserInfoPrivatePage: {
        screen: UserInfoPrivatePage
      },
      // 个人中心 -  修改密码
      UserPasswordSetPage: {
        screen: UserPasswordSetPage
      },
      // 个人中心 -  修改昵称
      UserNamePage: {
        screen: UserNamePage
      },
       // 个人中心 -  修改绑定手机号 步骤一
      PhoneModifyPage: {
        screen: PhoneModifyPage
      },
       // 个人中心 -  修改绑定手机号 步骤二
      CurrentPhoneCodePage: {
        screen: CurrentPhoneCodePage
      },
       // 个人中心 -  修改绑定手机号 步骤三
      NewPhonePage: {
        screen: NewPhonePage
      },
      // 个人中心 - 我的账户
      AccountPage: {
        screen: AccountPage
      },  
      // 个人中心 - 我的账户 - 账户记录
      AccountRecordPage: {
        screen: AccountRecordPage
      },  
       // 个人中心 - 我的道具
      StagePropertyPage: {
        screen: StagePropertyPage
      },
       // 个人中心 - 等级任务
      LevelTaskPage: {
        screen: LevelTaskPage
      },  
      // 个人中心 - 我的营收
      IncomePage: {
        screen: IncomePage
      }, 
      // 个人中心 - 我的金币
      GoldPage: {
        screen: GoldPage
      }, 
       // 个人中心 - 我的金币 - 金币兑换
      GoldExchangePage: {
        screen: GoldExchangePage
      },
      // 个人中心 - 有问题找客服
      CustomerServicePage: {
        screen: CustomerServicePage
      },
       // 个人中心 - 设置
       SettingPage: {
        screen: SettingPage
      },
      // 个人中心 - 设置提现密码
      WithdrawPage: {
         screen: WithdrawPage
      },
      // 个人中心 - 修改提现密码
      WithdrawChangePage: {
        screen: WithdrawChangePage
      },
       // 个人中心 - 修改密码 - 短信验证 
      ModifyPasswordVerifyPage: {
        screen: ModifyPasswordVerifyPage
      },
      // 个人中心 - 账户 - 充值
      RechargePage: {
        screen: RechargePage
      },
      // 公用 - 图片上传裁切
      UploadPicPage: {
        screen: UploadPicPage
      },
    },
    {
        initialRouteName: 'IndexPage',
        navigationOptions: {
            header: null
        },
        onTransitionStart: (router) => {
          // let routeName = router.navigation.state.routes[1].routeName
	        // console.warn('导航栏切换开始', router.navigation.state.routes)
        },
        onTransitionEnd: () => { }
    }
)

const defaultGetStateForAction = AppNavigators.router.getStateForAction


AppNavigators.router.getStateForAction = (action, state) => {
	// 页面是MeScreen并且 global.user.loginState = false || ''（未登录）
  // console.warn('action.routeName', action.routeName)

	return defaultGetStateForAction(action, state);
}

export default AppNavigators

















