###
 <View>
    <Button
      text='Frist'
      enable={true}
      onPress={this.alertMsg}/>

    <Button
        enable={this.state.click}
        text='enable'/>

    <Button
        enable={true}
        textStyle={styles.textStyle}
        text='Sencond'
        buttonStyle={styles.container}
        onPress={this.changeState}/>
</View>