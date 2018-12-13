###
1、需要 link 的
react-native link react-native-picker
react-native link react-native-vector-icons     -> link 后如果报错，需要link后卸载再安装
react-native link react-native-update

link 某个插件后如果还报错 可以多link几遍 react-native-sound react-native-fs 亲测有效

2、react-native-image-crop-picker   图片上传、裁切插件
        android\app\src\main\AndroidManifest.xml  中加上
        <uses-permission-sdk-23 android:name="android.permission.CAMERA"/>
        <uses-permission-sdk-23 android:name="android.permission.WRITE_EXTERNAL_STORAGE"/> 
    
        android／build.gradle中添加
                allprojects {
                repositories {
                        mavenLocal()
                        jcenter()
                        maven {
                        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
                        url "$rootDir/../node_modules/react-native/android"
                        }
                        maven { url "https://jitpack.io" }
                }
                }

                subprojects {
                afterEvaluate {project ->
                        if (project.hasProperty("android")) {
                        android {
                                compileSdkVersion 27
                                buildToolsVersion '27.0.0'
                        }
                        }
                }
                }
        android／app／build.gradle中添加
                defaultConfig {
                        ...
                        vectorDrawables.useSupportLibrary = true
                        ...
                }

        然后 react-native link react-native-image-crop-picker

3、react-native-fs
        android/settings.gradle
                include ':react-native-fs'
                project(':react-native-fs').projectDir = new File(settingsDir, '../node_modules/react-native-fs/android')

        android/app/build.gradle
                dependencies {
                        ...
                        compile project(':react-native-fs')
                }

4、react-native-sound
        undefined is not an object (evaluating 'RNSound.IsAndroid')
        解决方案：不能全部 link ，遇到报错时link
        
5、react-native-picker  Picker._init 
         解决方案：不能全部 link ，遇到报错时link

6、undefined is not object (evaluating '_reactNativeImageCropPicker.default.openCamera')

7、RNFSManager.RNFSFileTypeRegular  
        react-native link react-native-fs

