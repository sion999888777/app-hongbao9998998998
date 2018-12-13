### 用法:
>>>>>>>>>> 两个按钮
 submitFn = ()=> {
    this.refs.dialog.hideFn();
  }
 let commit = <Text style={styles.footerText} onPress={this.submitFn}>
                    充值
                </Text>
 <Dialog
    text = "您当前的账户中金额不足以支付本金，暂时无法进入房间，请充值后再进入"
    cancelText = "返回"
    ref="dialog"
    commit = {commit}
/>

 footerText: {
    textAlign: 'center',
    width: (windowWidth - 100) / 2 - 0.5,
    fontSize: 16
  },

 >>>>>>>>>> 一个按钮
   submitFn = ()=> {
    this.refs.dialog.hideFn();
  }
 let commit = <Text style={styles.footerText} onPress={this.submitFn}>
                    充值
                </Text>
 <Dialog
    text = "您当前的账户中金额不足以支付本金，暂时无法进入房间，请充值后再进入"
    ref="dialog"
    commit = {commit}
/>

footerText: {
    textAlign: 'center',
    width: (windowWidth - 100),
    fontSize: 16,
    lineHeight: 40
}