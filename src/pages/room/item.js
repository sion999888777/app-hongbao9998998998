export default class Item extends Component {

  shouldComponentUpdate(nextProps,nextState){
      return (this.props.item != nextProps.item || this.props.select != nextProps.select);
  }

  render() {
      // 这里我就把其他布局文件省略了
      console.log('item render ')// 从这里可以看到 每次改变item是，只刷新了指定item
      const { item } = this.props
      
          return (
            <TouchableOpacity onPress={() => this.detailFn(item)}>
            <View style={styles.content}>
              <View style={styles.listWrap}>
                {
                  item.roomLogo ?
                  <Image
                    resizeMode ='stretch'
                    style={styles.roomAvatar}
                    source={{uri: config.imgUrl+item.roomLogo}}
                  /> :
                  <Image
                    resizeMode ='stretch'
                    style={styles.roomAvatar}
                    source={require('./imgs/head.png')}
                  />
                }
                <View style={styles.listR}>
                  <View style={[styles.spaceBetween, {marginTop: 3}]}>
                    <Text style={styles.roomName}>{item.roomName}</Text>
                    <View style={styles.alignItemsCenter}>
                      {
                        item.roomPwd == "1" ?
                        <Icon name={'privateIcon|suo-checked'} size={12} color={'#a9a9a9'}/> : null
                      }
                      <Text style={styles.roomNum}>房号: {item.roomNo}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.spaceBetween}>
                    <Text style={styles.roomRules}>{item.intro}</Text>
                    <Text style={styles.peopleNum}>{`${item.roomOnlineNumbers}/${item.totalUser}`}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )
    }
}