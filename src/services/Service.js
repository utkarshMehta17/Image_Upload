import {Platform } from 'react-native';
import axios from 'axios';
import CFG from '../constants/CFG';

const request = async ({url,method,params,headers}) => {

    try {
        const fullURL = CFG.baseurl + url;

        if (__DEV__) {
            console.log(`Platform    ==> ${Platform.OS}`);
            console.log('------------------------------------')
            console.log(`fullURL     ==> ${fullURL}`)
            console.log('------------------------------------')
            console.log(`method      ==> ${method}`)
            console.log('------------------------------------')
            console.log('headers     ==>', headers ? await headers : '{}');
            console.log('------------------------------------')
            console.log('params      ==>', params ? params : '{}');
            console.log('------------------------------------\n\n')
        }

        let modfiedHeaders = {
            'Content-Type': 'multipart/form-data',
            Authorization:`Bearer ${await headers}`
        };


        return new Promise((resolve, reject) => {

            axios({
                method: method,
                url: fullURL,
                headers: headers ? modfiedHeaders: '',
                data: params
            })
            .then((response) => {
                console.log('API Response Success====>',response);
                resolve(response)
            })
            .catch((error) => {    
                console.log('API Response Fail [Error]====>',error.response.data);    
                    reject({
                        error: error.response.data,
                    });
                })
        })

        
    } catch (error) {
        console.warn({ error });
    }


}

export default request;