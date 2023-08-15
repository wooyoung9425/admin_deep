import styles from '../../../Styles/Preprocess.module.css'
import styled from "styled-components";
import { Button, Form, Progress, Table} from 'antd';
import { useRecoilState, atom } from 'recoil';
import { useState } from 'react'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../../../Store/Global';
import { click } from '@testing-library/user-event/dist/click';

interface TableSet {
    key: any;
    no: any;
    firstCam:any;
    lastCam:any;
}
interface uploadProgress {
    id: string; // 파일들의 고유값 id
    status: any;
}


export default function BuildingSetting() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const [pName, setpName] = useState('');
    const [cNameKr, setcNameKr] = useState('');
    const [cNameEn, setcNameEn] = useState('');
    const [speed, setSpeed] = useState('10');
    const [fps, setFps] = useState('60');
    const [numSet, setnumSet] = useState('');
    const [numCam, setnumCam] = useState('');
    const [spanCount, setspanCount] = useState('');
    const [spanLen, setspanLen] = useState('');

    const list: any[] = [pName, cNameKr, cNameEn, speed, fps, numSet, numCam, spanCount, spanLen ]

    const plus = (event:any) => {
        console.log(list);
        alert(`설정값을 변경하였습니다`);
        window.location.replace("/Facility/Panorama/Dashboard")
    }

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")
    const [projectName, setProjectName] =useState(0); 
    const [korName, setKorName] =useState(0);
    const [enName, setEnName] = useState(0);
    const [upFloor, setUpFloor] = useState(0);
    const [downFloor, setDownFloor] = useState(0);
    const [sector, setSector] = useState(0);
    let TableSet : TableSet[] = [];
    const [filmSetResult, setfilmSetResult] = useState<boolean>(false);
    const [TableSetStauts, setTableSetStauts] = useState(TableSet);
    const { Column } = Table;

    const [buildingInfo, setBuildingInfo]=useState<any>([])
    const [imgConfirm, setImgConfirm] = useState<any[]>([])
    const [clickImage, setClickImage] = useState<uploadProgress[]>([])

    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);
  
    useEffect(() => {
        let getIdCompany = async () => {
          if (token !== null) {
            console.log("여기 들어옴?");
            console.log("프로젝트ID" + project_id);
            const response = await axios({
              method: "get",
              url: `${API_URL}/account/auth/check/${token}`,
            })
              .then(async (res) => {
                if (res.data.check === true) {
                  setUserId(res.data.data.id)
                  setCompanyId(res.data.data.companyId)
                  // localStorage.set("project_id", id);
                  console.log(
                    `아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`
                  );
                  return {
                    email: res.data.data.email,
                    name: res.data.data.name,
                    phone: res.data.data.phone,
                    avatar: res.data.data.avatar,
                    role: res.data.data.role,
                    id: res.data.data.id,
                    companyId: res.data.data.companyId,
                  };
                } else {
                  console.log("토큰 만료");
                  localStorage.removeItem("token");
                  alert("토큰이 만료었습니다 다시 로그인 해주세요");
                  window.location.replace("/Main");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        };
        getIdCompany();
      }, []);


    useEffect(() => {
        const response = axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
                // console.log(res.data.check) 
                const settings: any = JSON.parse(res.data.data.settings)
                // console.log("dlfmaaaaaaaaaaaaaaaa"+res.data.data.title)
                if (res.data.check === true) {
                    setProjectName(res.data.data.title)
                    setKorName(settings.building_kor)
                    setEnName(settings.building_eng)
                    setUpFloor(settings.building_UpFloor)
                    setDownFloor(settings.building_DownFloor)
                    setSector(settings.building_Sector)                
                    setBuildingInfo(settings.building_Info)
                    let confirm :any = [...imgConfirm]
                    for (let i = 0; i < Number(settings.building_UpFloor); i++){
                        confirm.push({...imgConfirm, id: i, name: '지상'+(i+1)+'층',confirm : false})
                    }
                    for (let i = 0; i < Number(settings.building_DownFloor); i++){
                        confirm.push({...imgConfirm, id:Number(settings.building_UpFloor)+i , name: '지하'+(i+1)+'층',confirm : false})
                    }
                    
                    setImgConfirm(confirm)
                    
                } else {
                    console.log("실패");
                }
            
                setTableSetStauts(TableSet);
                if(TableSetStauts.length > 0){
                    setfilmSetResult(true)
                }  
            }).catch((err) => {
                console.log(err);
                
            });
    }, []);
    const onImageUpload = ((e: any, file_name: string) => {
        let file = e.target.files[0]
        let click: uploadProgress[];
        axios({
            method: 'post',
            // url: API_URL + `/File/Upload/${project_id}/stage0_drawing/${file_name+file.name.substr(-4, 4)}`,
            url: API_URL + `/file/upload/${project_id}?path=stage0_drawing&filename=${file_name+file.name.substr(-4,4)}`,
            headers: { 
            "accept": `application/json`,
            "access-token": `${token}`,
            "Content-Type": `multipart/form-data`  },      
            data: { upload: file },
            onUploadProgress: (progressEvent: { loaded: any; total: any }) => {
                let a = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                click  = [...clickImage]
                click.push({ id: file_name, status: <Progress type="line" percent={a} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} /> })
                console.log(click)
                setClickImage(click)
                        
                },
        }).then((res) => {
            if (res.data.check === true) {
                console.log("업로드 성공")
                let tmp_confirm = [...imgConfirm]
                imgConfirm.map((item: any) => {
                    if (item.name === file_name) {
                        // console.log(imgConfirm[item.id])
                        tmp_confirm[item.id] = {...imgConfirm[item.id], confirm:true}
                    }
                })
                setImgConfirm(tmp_confirm)
                setTimeout(()=>console.log(imgConfirm),2000)
            } else {
                console.log("실패",res)
            }
        // job_id = res.data.data.job_id
        }).catch((err) => {
            console.log(err)
        })
    })
    
return (
    <div>
        <div className={styles.DivArea} >
            <div className={styles.CreateTitleDiv}>
                 <p className={styles.CreateTitleText}>{t.Setting}</p>
            </div>
            <div className={styles.Projectbody}>
                <div className={styles.Createtable}>
                    <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                        <Form.Item className={styles.FormItem}  label="프로젝트 명">
                            <div className={styles.inputbox}>
                                <span className={styles.suffix}>{projectName}</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.FormItem} label="빌딩 이름(한)">
                            <div className={styles.inputbox}>
                                <span className={styles.suffix}>{korName}</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.FormItem} label="빌딩 이름(영)">
                            <div className={styles.inputbox}>
                                <span className={styles.suffix}>{enName}</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.FormItem} label="지상 층 수">
                            <div className={styles.inputbox}>
                                <span className={styles.suffix}>{upFloor} 층</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.FormItem} label="지하 층 수">
                            <div className={styles.inputbox}>
                                <span className={styles.suffix}>{downFloor} 층</span>
                            </div>
                        </Form.Item>
                        <Form.Item className={styles.FormItem} label="구역">
                            <div className={styles.inputbox}>
                                <span className={styles.suffix}>{sector} 호</span>
                            </div>
                        </Form.Item>
                        <Form.Item label={'도면 업로드'} className={styles.ImageUploadFormItem} >
                        
                            {(() => {
                                let render:any=[]
                                console.log(imgConfirm)
                                for (let i = 0; i < Number(upFloor) + Number(downFloor); i++){
                                    render.push(
                                        <div className={styles.BuildingFormItem}>
                                            <label className={styles.BuildingImgUpload} htmlFor={"input-file" + i} >{imgConfirm[i].name} 도면</label>
                                            <input type='file' accept='image/*' name= {imgConfirm[i].name} onChange={(e: any) => onImageUpload(e, imgConfirm[i].name)} style={{ display: "none", float: "left" }} id={"input-file" + i} key={i} />
                                            {imgConfirm[i].confirm === true ?
                                                clickImage.filter((a: any) => a.id === imgConfirm[i].name)[0].status :
                                                <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />
                                            }
                                        </div>
                                        
                                    )
                                }
                                return render
                            })()}
                            </Form.Item>
                            {/* <div className={styles.BuildingFormItem}>
                                <label className={styles.BuildingImgUpload} htmlFor="input-file1" >도면</label>
                                <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, '0')} style={{ display: "none", float: "left" }} id="input-file1" key="1" />
                                {imgConfirm === true ?
                                    clickImage.filter((a: any) => a.id === "도면")[0].status :
                                    <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                                </div> */}
                             
                       
                    </Form>
                   
                </div>
            </div>
        </div>
    </div>
    )
}
