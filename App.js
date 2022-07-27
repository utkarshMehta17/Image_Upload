import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, PermissionsAndroid, Platform, ImageBackground, ScrollView, ActivityIndicator } from 'react-native'
import Modal from "react-native-modal";
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { requestUploadImage } from './src/services/ApiCall';


export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      multiple_images:[]
    }
  }


  onImageUpload = () =>{
    const formData = new FormData();

      formData.append("Profile", this.state.multiple_images);

    requestUploadImage(formData).then((response) => {
      console.log('Request Completed successful', response.data);
      if (response.data.IsSuccess == true) {
        alert('Request Completed')
      }
      else if(response.data.IsSuccess == false){
        alert('Request not Completed!!')
      }
    }).catch((error) => {
      console.log('Request Completed -- error ', error)
    })
  }


   requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };
 
   requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

   captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };

    let isCameraPermitted = await this.requestCameraPermission();
    let isStoragePermitted = await this.requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response.assets[0]);
 
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        else{
              let ran = response.assets[0].fileName
              let res = response.assets[0];
              var source = {
                uri:
                  Platform.OS === "ios" ? res?.uri?.replace("file://", "") : res.uri,
                name: `${ran}.jpg`,
                type: "image/jpeg",
              };

              this.setState({multiple_images: source})

        }
      });
    }
  };
 
   chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response.assets[0]);
 
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      else{
        let ran = response.assets[0].fileName
        let res = response.assets[0];
        var source = {
          uri:
            Platform.OS === "ios" ? res?.uri?.replace("file://", "") : res.uri,
          name: ran,
          type: "image/jpeg",
        };
        this.setState({multiple_images: source})
  }
    });
  };




  render() {
    return (
      <View style={styles.container}>
        <Text>App</Text>
        <View style={{flex: 1}}>
        {this.state.multiple_images? 
        <Image  source={{ uri: this.state.multiple_images.uri }}
        style={styles.uploadedImageBG}/>
                        : null
       }
       </View>

{this.state.multiple_images ? <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{this.onImageUpload()}}
          style={{backgroundColor:'#000', padding:20, borderRadius:10, marginBottom:15}}>

               <Text style={{color:'#fff'}}>Upload Image</Text> 
       
    </TouchableOpacity> : null}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{this.setState({modalVisible: true})}}
          style={styles.touchableOpacityStyle}>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
            }}
            //source={require('./images/float-add-icon.png')}
            style={styles.floatingButtonStyle}
          />
    </TouchableOpacity>

        <Modal isVisible={this.state.modalVisible} onBackdropPress={()=>{this.setState({modalVisible: false})}} useNativeDriver={true}>
        <View style={{backgroundColor:'white', elevation: 5, borderRadius:10, alignItems:'center', }} >
          <Text style={{padding:20, fontSize:18, fontWeight:'bold'}}>Upload Image from</Text>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{marginRight:20}} onPress={()=>{this.chooseFile('photo')}}> 
              <Image source={require('./src/assets/addGallaryImage.png')} style={{width:50, height:50}}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:20}} onPress={()=>{this.captureImage('photo')}}> 
              <Image source={require('./src/assets/addCameraImage.png')}  style={{width:50, height:50}}/>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>
      </View>
    )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex:1,
     backgroundColor: 'white',
     alignItems:'center'
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
  uploadedImageBG:{
    height:200,
    width:200,
    marginTop: 20
  },
  deleteIcon:{
    width:50,
    height:50,
     alignSelf:'flex-end'
  },
  uploadBtnStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    Left: 0,
    bottom: 30,
  },
});