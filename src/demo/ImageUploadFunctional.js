import React,{useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, PermissionsAndroid, Platform, ImageBackground, ScrollView, ActivityIndicator } from 'react-native'
import Modal from "react-native-modal";
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import { requestUploadImage } from './src/services/ApiCall';

export default function ImageUploadFunctional() {
  const [modalVisible, setModalVisible] = useState(false)
  const [loader, setLoader] = useState(false)

  const [formValues, setFormValues] = useState({
    multiple_images:[]
  })

  const onImageUpload = () =>{
    setLoader(true)
    const formData = new FormData();
    formValues?.crop_images.map((data)=>{
      formData.append("Profile", data);
    })

    requestUploadImage(formData).then((response) => {
      console.log('Request Completed successful', response.data);
      alert('Request Completed')
      setLoader(false)

    }).catch((error) => {
      console.log('Request Completed -- error ', error)
      setLoader(false)
    })
  }
 
  const requestCameraPermission = async () => {
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
 
  const requestExternalWritePermission = async () => {
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


  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
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
              var crop_image_single = formValues?.crop_images
              ? formValues?.crop_images
              : [];
  
              crop_image_single.push(source);
              setFormValues({
                ...formValues,
                crop_images: crop_image_single,
              });
        }
        // console.log('base64 -> ', response.base64);
        // console.log('uri -> ', response.uri);
        // console.log('width -> ', response.width);
        // console.log('height -> ', response.height);
        // console.log('fileSize -> ', response.fileSize);
        // console.log('type -> ', response.type);
        // console.log('fileName -> ', response.fileName);
        // setFilePath(response);
      });
    }
  };
 
  const chooseFile = (type) => {
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
          name: `${ran}.jpg`,
          type: "image/jpeg",
        };
        var crop_image_single = formValues?.crop_images
        ? formValues?.crop_images
        : [];

        crop_image_single.push(source);
        setFormValues({
          ...formValues,
          crop_images: crop_image_single,
        });
  }
    });
  };

  const deleteCropImage = (cropItem) => {
    let tempformValues = {...formValues}
    let cropImages = tempformValues.crop_images
    let index = cropImages.indexOf(cropItem)
    if(index > -1){
      cropImages.splice(index, 1)
    }
    tempformValues['crop_images'] = cropImages

    console.log('tempformValues => ', tempformValues)

    setFormValues(tempformValues)
    console.log('cropImages==>',cropImages.indexOf(cropItem));
      console.log('cropItem==> delete',cropItem);
  }


  return (
    <View style={styles.container}>
          <ScrollView>
            {formValues.crop_images && formValues.crop_images.length > 0? 
                  formValues.crop_images.map((cropItem)=>
                     (
                    <ImageBackground
                    source={{ uri: cropItem.uri }}
                    style={styles.uploadedImageBG}
                    borderRadius={5}>
                  <TouchableOpacity
                    style={styles.deleteaiconTOuch}
                    onPress={() => deleteCropImage(cropItem)}
                  >
                    <Image
                      source={require('./src/assets/trash.png')}
                      style={styles.deleteIcon}
                    />
                  </TouchableOpacity>
                    </ImageBackground>)
                  )
                        : null
       }
       </ScrollView>


      {formValues?.crop_images?.length > 0 ? <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{onImageUpload()}}
          style={{backgroundColor:'#000', padding:20, borderRadius:10, marginBottom:15}}>
            {loader ? 
              <ActivityIndicator size="small" color="#fff" />
            :
               <Text style={{color:'#fff'}}>Upload Image</Text> }
       
    </TouchableOpacity> : null}

    <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{setModalVisible(true)}}
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

      <Modal isVisible={modalVisible} onBackdropPress={()=>{setModalVisible(false)}} useNativeDriver={true}>
        <View style={{backgroundColor:'white', elevation: 5, borderRadius:10, alignItems:'center', }} >
          <Text style={{padding:20, fontSize:18, fontWeight:'bold'}}>Upload Image from</Text>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{marginRight:20}} onPress={()=>{chooseFile('photo')}}> 
              <Image source={require('./src/assets/addGallaryImage.png')} style={{width:50, height:50}}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:20}} onPress={()=>{captureImage('photo')}}> 
              <Image source={require('./src/assets/addCameraImage.png')}  style={{width:50, height:50}}/>
            </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  )
}


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