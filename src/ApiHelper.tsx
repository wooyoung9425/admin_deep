import axios from 'axios';
import Utility from './Utility';
import config from './config';
import { API_URL } from '../src/Store/Global';

//로그인을 제외하고 모든 api호출은 로그인 키값을 header에 포함시켜 전송합니다.




const header = {
    "accept" : 'application/json',
    // ""access-token"" : Utility.getCookie(config.key)
    "access-token" : Utility.getCookie(config.key)
};



//API를 호출하기 위한 axios를 래핑하는 함수, axios는 여기를 제외하고는 그 어떤 페이지에서도 선언하지 않습니다.
const ApiHelper = {
    Post : (url:string, jsonData?:any, callback?:Function):void => {
        let result:any = null;

        try {
            axios.post(`${config.host()}${url}`, jsonData, { headers: header }).then((res) => {
                if (res.status === 200) {
                    result = res.data;
                } else {
                    result = { code : -1, message : 'Api Send Fail', value : '', check : false };
                }
                if (callback !== null && callback !== undefined) callback(result);
            });
        } catch (e:any) {
            result = { code : -1, message : e.message, value : '', check : false };
            if (callback !== null && callback !== undefined) callback(result);
        }
    },
    
    Get : (url:string, jsonData?:any, callback?:Function):void => {
        let result:any = null;

        try {
            axios.get(`${config.host()}${url}`, { params : jsonData, headers : header }).then((res) => {
                // console.log(header);
                if (res.status === 200) {
                    result = res.data;
                } else {
                    result = { code : -1, message : 'Api Send Fail', value : '', check : false };
                }
                if (callback !== null && callback !== undefined) callback(result);
            });
        } catch (e:any) {
            result = { code : -1, message : e.message, value : '', check : false };
            if (callback !== null && callback !== undefined) callback(result);
        }
    }
};

export default ApiHelper;