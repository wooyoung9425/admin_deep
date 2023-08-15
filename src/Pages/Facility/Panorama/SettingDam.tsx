import { Button, Form, Input, Radio,Select, Tooltip} from 'antd';
import styles from '../../../Styles/Panorama.module.css'
import { useRecoilState, atom } from 'recoil';
import { useState } from 'react'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect } from 'react';
import { API_URL } from '../../../Store/Global';



export default function SettingDam() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    
    const [horTrans, setHorTrans] = useState<string>('0');
    const [horYFix, setHorYFix] = useState<string>('0');
    const [horX, setHorX] = useState<string>('0.5');
    const [horY, setHorY] = useState<string>('0.1');
    const [horRotation, setHorRotation] = useState<string>('1');
    const [horScale, setHorScale] = useState<string>('0.01');
    const [confFlag, setConfFlag] = useState<string>('0');
    const [verX, setVerX] = useState<string>('0.1');
    const [verY, setVerY] = useState<string>('0.8');
    const [verRotation, setVerRotation] = useState<string>('0.1');
    const [verScale, setVerScale] = useState<string>('0.5');
    const [verForced, setVerForced] = useState<string>('0.2');
    const [verMax, setVerMax] = useState<string>('7');
    const [verForcedStitching, setVerForcedStitching] = useState<string>('0');
    const [forFs, setForFs] = useState<string>('0');
    const [verCount, setVerCount] = useState<string>('0');
    const [shearingAngle, setShearingAngle] = useState<string>('0');
    const [overlapRatios, setOverlapRatios] = useState<string>('0');
    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);
  

    const HorTransInput = (e:any) => {setHorTrans(e.target.value);}
    const horYFixInput = (e:any) => {setHorYFix(e.target.value);}
    const horXInput = (e:any) => {setHorX(e.target.value);}
    const horYInput = (e:any) => {setHorY(e.target.value);}
    const horRotationInput = (e:any) => {setHorRotation(e.target.value);}
    const horScaleInput = (e:any) => {setHorScale(e.target.value);}
    const confFlagInput = (e:any) => {setConfFlag(e.target.value);}
    const verXInput = (e:any) => {setVerX(e.target.value);}
    const verYInput = (e:any) => {setVerY(e.target.value);}
    const verRotationInput = (e:any) => {setVerRotation(e.target.value);}
    const verScaleInput = (e:any) => {setVerScale(e.target.value);}
    const verForcedInput = (e:any) => {setVerForced(e.target.value);}
    const verMaxInput = (e:any) => {setVerMax(e.target.value);}
    const verForcedStitchingInput = (e:any) => {setVerForcedStitching(e.target.value);}
    const forFsInput = (e:any) => {setForFs(e.target.value);}
    const verCountInput = (e:any) => {setVerCount(e.target.value);}
    const shearingAngleInput = (e:any) => {setShearingAngle(e.target.value);}
  





        useEffect(() => {
            let getIdCompany = async () => {
                if(token !== null){ 
                    console.log("여기 들어옴?")
                    console.log("프로젝트ID"+project_id)
                    const response = await axios({
                    method : "get",
                    url : `${API_URL}/account/auth/check/${token}`,                
                    }).then(async(res)=>{
                    if(res.data.check === true){
                        setUserId(res.data.data.id)
                        setCompanyId(res.data.data.companyId)
          
                        // localStorage.set("project_id", id);
                        console.log(`아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`)
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

        const [cameraNo, setCamraNo] =useState(1); 
        const [spanNo, setSpanNo] =useState(1); 
        const [projectName, setProjectName] = useState<string>('');
        const [damName, setDamName] = useState<string>('');
        const [damtype, setDamtype] = useState<string>('');
        const [folderName, setFolderName] = useState<string>('');
    
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
                        for (let i = 0; i < 1; i++) {
                            // console.log(`터널이름${settings.airport_eng}` )
                            console.log(`방향${settings.dam_type}` )
                            setDamName(settings.dam_eng)
                            setDamtype(settings.dam_type)
                            setProjectName(settings.airport_eng)
                            setCamraNo(settings.cameraCount)
                            setSpanNo(settings.spanCount)
                    }

                }
                }).catch((err) => {
                    console.log(err);
                });
        }, []);


        let token : string | null = localStorage.getItem("token") 
        let project_id : string | null = localStorage.getItem("project_id")
        // let Horstitch:any[] = [];
        let Spandist:any[] = [];
        let Createcsv:any[] = [];
        // let list: any[] = [horTrans, horYFix, horX, horY, horRotation, horScale, confFlag, verX, verY, verRotation, verScale, verForced, verMax, verForcedStitching, forFs, verCount, shearingAngle ]


        
        // for(let i = 1; i <cameraNo+1; i++)
        //     for(let k = 1; k <spanNo+1; k++){
        //         Horstitch.push({
        //             input_folder: `stage2/${projectName}_${directName}/C0${i}/Span00${k}`,
        //             output_folder: "stage4",
        //             yml_output_folder: "stage4_YML",
        //             cam_no: 4,
        //             conf_name: "config.cfg",
        //             conf_folder: "stage4_config",
        //             conf_values: {
        //                 "horTrans": horTrans,
        //                 "horYFix": horYFix,
        //                 "horX": horX,
        //                 "horY": horY,
        //                 "horRotation": horRotation,
        //                 "horScale": horScale,
        //                 "confFlag": confFlag,
        //                 "verX": verX,
        //                 "verY": verY,
        //                 "verRotation": verRotation,
        //                 "verScale": verScale,
        //                 "verForced": verForced,
        //                 "verMax": verMax,
        //                 "verForcedStitching": verForcedStitching,
        //                 "forFs": forFs,
        //                 "verCount": verCount,
        //                 "shearingAngle": shearingAngle
        //         }
        //         }
        //         )            
        //     };

            
            // console.log(Horstitch[0].input_folder)
        
        for(let i = 1; i <cameraNo; i++){
            Spandist.push({
                input_folder: "stage4"
            })
        }


        const onClickPonirama = (e:any) => {
            // console.log(arr);
            // console.log(Horstitch);

        // for(let i = 1; i <2; i++)           
        //     axios({                
        //         method: "post",
        //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //         headers: {
        //           "accept": `application/json`,
        //           "access-token": `${token}`,
        //           "Content-Type": `application/json`
        //         },
        //               data: {
        //             project_id: project_id,
        //             task_name: "horpanorama_airport",
        //             interactive: false,
        //             tasks: [
        //                 {
        //                     input_folder: `stage2/${damtype}/${damName}/BO-P01-U07/C36/S001`,
        //                     output_folder: `stage4/${damtype}`,
        //                     yml_output_folder: "stage4_YML"
        //                 }
        //             ]
        //         }
        //     }).then((res)=>{
        //         if (res.data.check === true) {
        //             console.log("파노라마 성공")
        //             console.log("성공"+res.data.check);
        //             axios({                
        //                 method: "post",
        //                 url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                 headers: {
        //                   "accept": `application/json`,
        //                   "access-token": `${token}`,
        //                   "Content-Type": `application/json`
        //                 },
        //                         data: {
        //                     project_id: project_id,
        //                     task_name: "horpanorama_airport",
        //                     interactive: false,
        //                     tasks: [
        //                         {
        //                             input_folder: `stage2/${damtype}/${damName}/BO-P01-U08/C36/S001`,
        //                             output_folder: `stage4/${damtype}`,
        //                             yml_output_folder: "stage4_YML"
        //                         }
        //                     ]
        //                 }
        //             }).then((res)=>{
        //                 if (res.data.check === true) {
        //                     console.log("Resize 성공")
        //                     console.log("성공"+res.data.check);
        //                     axios({                
        //                         method: "post",
        //                         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                         headers: {
        //                           "accept": `application/json`,
        //                           "access-token": `${token}`,
        //                           "Content-Type": `application/json`
        //                         },
        //                                         data: {
        //                             project_id: project_id,
        //                             task_name: "horpanorama_airport",
        //                             interactive: false,
        //                             tasks: [
        //                                 {
        //                                     input_folder: `stage2/${damtype}/${damName}/BO-P01-U09/C36/S001`,
        //                                     output_folder: `stage4/${damtype}`,
        //                                     yml_output_folder: "stage4_YML"
        //                                 }
        //                             ]
        //                         }
        //                     }).then((res)=>{
        //                         if (res.data.check === true) {
        //                             console.log("Resize 성공")
        //                             console.log("성공"+res.data.check);
        //                             axios({                
        //                                 method: "post",
        //                                 url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                                 headers: {
        //                                   "accept": `application/json`,
        //                                   "access-token": `${token}`,
        //                                   "Content-Type": `application/json`
        //                                 },
        //                                                         data: {
        //                                     project_id: project_id,
        //                                     task_name: "horpanorama_airport",
        //                                     interactive: false,
        //                                     tasks: [
        //                                         {
        //                                             input_folder: `stage2/${damtype}/${damName}/BO-P01-U13/C30/S001`,
        //                                             output_folder: `stage4/${damtype}`,
        //                                             yml_output_folder: "stage4_YML"
        //                                         }
        //                                     ]
        //                                 }
        //                             }).then((res)=>{
        //                                 if (res.data.check === true) {
        //                                     console.log("Resize 성공")
        //                                     console.log("성공"+res.data.check);
        //                                     axios({                
        //                                         method: "post",
        //                                         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                                         headers: {
        //                                           "accept": `application/json`,
        //                                           "access-token": `${token}`,
        //                                           "Content-Type": `application/json`
        //                                         },
        //                                                                         data: {
        //                                             project_id: project_id,
        //                                             task_name: "horpanorama_airport",
        //                                             interactive: false,
        //                                             tasks: [
        //                                                 {
        //                                                     input_folder: `stage2/${damtype}/${damName}/BO-P01-U14/C30/S001`,
        //                                                     output_folder: `stage4/${damtype}`,
        //                                                     yml_output_folder: "stage4_YML"
        //                                                 }
        //                                             ]
        //                                         }
        //                                     }).then((res)=>{
        //                                         if (res.data.check === true) {
        //                                             console.log("Resize 성공")
        //                                             console.log("성공"+res.data.check);
        //                                             axios({                
        //                                                 method: "post",
        //                                                 url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                                                 headers: {
        //                                                   "accept": `application/json`,
        //                                                   "access-token": `${token}`,
        //                                                   "Content-Type": `application/json`
        //                                                 },
        //                                                 data: {
        //                                                     project_id: project_id,
        //                                                     task_name: "horpanorama_airport",
        //                                                     interactive: false,
        //                                                     tasks: [
        //                                                         {
        //                                                             input_folder: `stage2/${damtype}/${damName}/BO-P01-U15/C30/S001`,
        //                                                             output_folder: `stage4/${damtype}`,
        //                                                             yml_output_folder: "stage4_YML"
        //                                                         }
        //                                                     ]
        //                                                 }
        //                                             })
        //                                         } 
        //                                     })
        //                                 } 
        //                             })
        //                         } //2
        //                     })
        //                 } //1
        //             })
        //         } else {
        //             console.log("파노라마 실패")
        //             console.log("실패"+res.data.check);
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     });
        alert("수평 파노라마 작업을 시작합니다.")
        setTimeout(()=> alert("수평 파노라마 작업이 완료되었습니다."),5000)
        }


    return (
    <div>

            <div className={styles.DivArea} >
                <div className={styles.CreateTitleDiv}>
                    <div className={styles.CreateTitleText}>
                        <p>{t.Setting}</p>
                        <Tooltip placement="right" color="#108ee9" title="수평 파노라마 설정값을 입력합니다. 입력하지 않으면 기본값으로 작업이 진행됩니다.">
                        <p className={styles.setting}><QuestionCircleOutlined /></p>
                        </Tooltip>
                        
                        </div>
                    
                </div>

                <div className={styles.Projectbody}>
                    <div className={styles.Createtable}>
                    <div className='half1'>
                            <Form className={styles.Forms} labelCol={{ span: 14, }} wrapperCol={{ span: 8 }} layout="horizontal">
                            <Form.Item className={styles.FormItem}  label="HORIZONTAL_JUST_TRANSLATION"><Input disabled value={horTrans} onChange={HorTransInput} type={"number"} /></Form.Item>

                            <Form.Item className={styles.FormItem} label="HORIZONTAL_Y_FIX"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 100"><Input value={horYFix} onChange={horYFixInput} suffix="pix"  /></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="HORIZONTAL_X_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={horX} onChange={horXInput} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="HORIZONTAL_Y_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={horY} onChange={horYInput} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="HORIZONTAL_ROTATION_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={horRotation} onChange={horRotationInput} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="HORIZONTAL_SCALE_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={horScale} onChange={horScaleInput} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="CONF_FLAG"><Input disabled value={confFlag} onChange={confFlagInput} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_FORCED_STITCHING"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 100"><Input disabled value={verForcedStitching} onChange={verForcedStitchingInput} suffix="%" type={"number"} /></Tooltip></Form.Item>
                            </Form>
                            </div>
                            <div className='half2'>
                            <Form className={styles.Forms} labelCol={{ span: 6, }} wrapperCol={{ span: 8 }} layout="horizontal">
                            <Form.Item className={styles.FormItem} label="VERTICAL_X_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={verX} onChange={verXInput} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_Y_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={verY} onChange={verYInput} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_ROTATION_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={verRotation} onChange={verRotationInput}type={"number"} suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_SCALE_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={verScale} onChange={verScaleInput}  type={"number"}  suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_FORCED_LIMIT"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 1.00"><Input value={verForced} onChange={verForcedInput}  type={"number"}  suffix="%"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_MAX_IN"><Tooltip placement="right" color='#2db7f5' title="입력범위 : 0 ~ 99"><Input value={verMax} onChange={verMaxInput}  type={"number"} suffix="pix"/></Tooltip></Form.Item>
                            <Form.Item className={styles.FormItem} label="FOR_FS"><Input disabled value={forFs} onChange={forFsInput}  type={"number"} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="VERTICAL_COUNT"><Input disabled value={verCount} onChange={verCountInput}  type={"number"} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="SHEARING_ANGLE"><Input disabled value={shearingAngle} onChange={shearingAngleInput}  type={"number"} /></Form.Item>
                            </Form>

                            </div>
                            </div>

                <div className={styles.CreateButton}>
                    <Button onClick={onClickPonirama} block>생성</Button>
                    {/* <Button onClick={plus} block>확인</Button> */}
                    {/* <Button onClick={te} block>테스트</Button> */}
                </div>        



                    </div>


            

                

            </div>


        </div>


    )
}