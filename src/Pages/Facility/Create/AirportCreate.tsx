import styles from '../../../Styles/CreateProject.module.css'
import { Button, Form, Select, Radio, Input } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../Store/Global';
import {v4 as uuidv4} from "uuid"

export default function AirportCreate() {

    const token = localStorage.getItem("token")
    const project_Type = localStorage.getItem("project_Type");
    const [id, setId] = useState<number>(-1);
    const [companyId, setCompanyId] = useState<number>(-1);
    const [title, setTitle] = useState<string>('');
    const [airport_kor, setAirport_kor] = useState<string>('');
    const [airport_eng, setAirport_eng] = useState<string>('');
    const [cameraCount, setCameraCount] = useState<number>(0);
    const [spanCount, setSpanCount] = useState<number>(0);
    const [airstripWidth, setAirstripWidth] = useState<number>(0);
    const [airstripLength, setAirstripLength] = useState<number>(0);
    const [spanLength, setSpanLength] = useState<number>(0);
    const [crackMaxWidth, setCrackMaxWidth] = useState<number>(0);
    const [cameraSensor, setCameraSensor] = useState<number>(0);
    const [cameraFocus, setCameraFocus] = useState<number>(0);
    const [droneAltitude, setDronAltitude] = useState<number>(0);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const [imageHeight, setImageHeight] = useState<number>(0);
    const [overlap, setOverlap] = useState<number>(0);

    const titleInput = (e:any) => {setTitle(e.target.value);}
    const airport_korInput = (e:any) => {setAirport_kor(e.target.value);}
    const airport_engInput = (e:any) => {setAirport_eng(e.target.value);}
    const cameraCountInput = (e:any) => {setCameraCount(Number(e.target.value));}
    const spanCountInput = (e:any) => {setSpanCount(Number(Math.ceil(airstripLength/spanLength)));}
    const airstripWidthInput = (e:any) => {setAirstripWidth(Number(e.target.value));}
    const airstripLengthInput = (e:any) => {setAirstripLength(Number(e.target.value));}
    const spanLengthInput = (e:any) => {setSpanLength(Number(e.target.value));}
    const crackMaxWidthInput = (e:any) => {setCrackMaxWidth(Number(e.target.value));}
    const cameraSensorInput = (e:any) => {setCameraSensor(Number(e.target.value));}
    const cameraFocusInput = (e:any) => {setCameraFocus(Number(e.target.value));}
    const droneAltitudeInput = (e:any) => {setDronAltitude(Number(e.target.value));}
    const imageWidthInput = (e:any) => {setImageWidth(Number(e.target.value));}
    const imageHeightInput = (e:any) => {setImageHeight(Number(e.target.value));}
    const overlapInput = (e:any) => {setOverlap(Number(e.target.value));}



    let settings = 
            {   "airport_kor" : airport_kor,
                "airport_eng" : airport_eng,
                "cameraCount" : cameraCount,
                "airstripWidth": airstripWidth,
                "airstripLength": airstripLength,
                "spanLength":  spanLength,
                "spanCount" : Math.ceil(airstripLength/spanLength) ,
                "crackMaxWidth": crackMaxWidth,
                "cameraSensor": cameraSensor,
                "cameraFocus": cameraFocus,
                "droneAltitude": droneAltitude,
                "imageWidth": imageWidth,
                "imageHeight": imageHeight,
                "overlap": overlap
            };

    useEffect(() => {
        let getIdCompany = async () => {
            if(token !== null){ 
                console.log("여기 들어옴?")
                const response = await axios({
                method : "get",
                url : `${API_URL}/account/auth/check/${token}`,                
                }).then(async(res)=>{
                    if(res.data.check === true){
                        setId(res.data.data.id)
                        setCompanyId(res.data.data.companyId)
                        return {email : res.data.data.email, name : res.data.data.name, phone : res.data.data.phone, avatar : res.data.data.avatar, role : res.data.data.role, id : res.data.data.id, companyId : res.data.data.companyId}
                    }else{
                        console.log("토큰 만료")
                        localStorage.removeItem('token')
                        alert("토큰이 만료었습니다 다시 로그인 해주세요")
                        window.location.replace("/Main")
                    }
                }).catch((err)=>{
                console.log(err)
                })
            }
        }
        getIdCompany()
    },[])

    

    const submit = async () => {
        console.log(`아이디는 다음과 같음 : ${id} / 회사는 다음과 같음 : ${companyId}`)
        const response = await axios ({
            method: "post",
            url: API_URL + `/project/regist`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`, "Content-Type": `application/json`},
            data: {"title": title,
            "projectType": project_Type,
            "ownerId": id,
            "companyId": companyId,
            "settings" : JSON.stringify(settings).replace(/\"/gi, '"'),
            "status": false
        }  
        }).then((res) => {
                console.log("들어오는 데이터는 다음과 같습니다 : ",res.data)
                console.log("시설물",project_Type )
                if (res.data.check === true) {
                    console.log("받은 데이터는 다음과 같음 : ",res.data.check)
                    localStorage.setItem('project_id', res.data.code)
                    localStorage.setItem('settings',  JSON.stringify(settings).replace(/\"/gi, '"'))
                    axios({
                        method: 'get',
                        url: API_URL + `/project/view/${res.data.code}`,
                        headers : {"accept" : `application/json`, "access-token" : `${token}`},

                    }).then((res) => {
                        if (res.data.check === true) {
                            localStorage.setItem('project_id', res.data.code)
                            setTimeout(()=>window.location.replace("/Facility/Dashboard/ProjectDashboard"),500)
                        } else {
                            console.log('프로젝트 정보 atom 저장 실패')
                        }
                        })
                    alert(`프로젝트를 생성하였습니다.`);  
                } else {
                    console.log("이미 있음")
                    console.log(res.data.check)
                }   
            }).catch((err) => {
                console.log("받은 에러는 다음과 같음",err)
            })  
        
        
    
        }



    return (
        <>
        <div className={styles.Projectbody} >
            <div className={styles.Createtable}>
                <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                    <Form.Item className={styles.FormItem}  label="프로젝트 명"><Input value={title} onChange={titleInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label="공항 이름(한)"><Input value={airport_kor} onChange={airport_korInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label="공항 이름(영)"><Input value={airport_eng} onChange={airport_engInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label="카메라 수"><Input value={cameraCount} onChange={cameraCountInput}  type={"number"} suffix="개" /></Form.Item>
                    <Form.Item className={styles.FormItem} label="활주로 너비"><Input value={airstripWidth} onChange={airstripWidthInput}  type={"number"} suffix="개" /></Form.Item>
                    <Form.Item className={styles.FormItem} label="활주로 길이"><Input value={airstripLength} onChange={airstripLengthInput} onKeyUp={spanCountInput}  type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="스팬길이"><Input value={spanLength} onChange={spanLengthInput} onKeyUp={spanCountInput}  type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="스팬수"><Input disabled value={spanCount} onChange={spanCountInput}  type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="실제 균열 최대 폭"><Input value={crackMaxWidth} onChange={crackMaxWidthInput}  type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="카메라 센서크기"><Input  value={cameraSensor} onChange={cameraSensorInput} type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="카메라 초점거리"><Input  value={cameraFocus} onChange={cameraFocusInput} type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="드론 촬영 고도"><Input  value={droneAltitude} onChange={droneAltitudeInput} type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="이미지 너비"><Input  value={imageWidth} onChange={imageWidthInput} type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="이미지 높이"><Input  value={imageHeight} onChange={imageHeightInput} type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="촬영시 겹침률"><Input  value={overlap} onChange={overlapInput} type={"number"} suffix="m"/></Form.Item>
                </Form>
            </div>
        </div>
        <div className={styles.CreateButton}>
            <Button onClick={submit}>확인</Button>
        </div>
        </>
    )
}
