import styles from '../../../Styles/CreateProject.module.css'
import { Button, Form, Select, Radio, Input } from 'antd';
import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {v4 as uuidv4} from "uuid"
import { API_URL } from '../../../Store/Global';
import { projectType } from '../../../Store/State/atom';
// import { useRecoilValue, useRecoilState } from 'recoil';
import {project_info} from'../../../Store/State/atom'

export default function TunnelCreate() {

    let project_Type = localStorage.getItem("project_Type");
    
    // const [ProjectInfo, SetProjectInfo]= useRecoilState<any>(project_info)

    const token = localStorage.getItem("token")
    const [id, setId] = useState<number>(-1);
    const [companyId, setCompanyId] = useState<number>(-1);
    const [title, setTitle] = useState<string>('');
    const [tunnel_kor, setTunnel_kor] = useState<string>('');
    const [tunnel_eng, setTunnel_eng] = useState<string>('');
    const [scanSpeed, setScanSpeed] = useState<number>(10);
    const [fps, setFps] = useState<number>(60);
    const [direction, setDirection] = useState<any>("P01");
    const [cameraCount, setCameraCount] = useState<number>(0);
    const [spanCount, setspanCount] = useState<number>(0);
    const [spanLength, setSpanLength] = useState<number>(0);
    const [constructType, setConstructType] = useState<string>('');
    const [constructWidth, setConstructWidth] = useState<number>(0);
    const [constructLength, setConstructLength] = useState<number>(0);
    const [crackMaxWidth, setCrackMaxWidth] = useState<number>(0);
    const [offsetPersent, setOffsetPersent] = useState<number>(0);

    const titleInput = (e:any) => {setTitle(e.target.value);}
    const tunnel_korInput = (e:any) => {setTunnel_kor(e.target.value);}
    const tunnel_engInput = (e:any) => {setTunnel_eng(e.target.value);}
    const cameraCountInput = (e:any) => {setCameraCount(Number(e.target.value));}
    const spanCountInput = (e:any) => {setspanCount(Number(e.target.value));}
    const spanLengthInput = (e:any) => {setSpanLength(Number(e.target.value));}
    const constructTypeInput = (e:any) => {setConstructType(e.target.value);}
    const constructWidthInput = (e:any) => {setConstructWidth(Number(e.target.value));}
    const constructLengthInput = (e:any) => {setConstructLength(Number(e.target.value));}
    const crackMaxWidthInput = (e:any) => {setCrackMaxWidth(Number(e.target.value));}
    const offsetPersentInput = (e:any) => {setOffsetPersent(Number(e.target.value));}
    const scanSpeedInput = (value: number) => {
        if(value === 1){setScanSpeed(10)}
        if(value === 2){setScanSpeed(20)}
        if(value === 3){setScanSpeed(30)}
        }
    const fpsChange = (value: number) => {
        if(value === 60){setFps(60)}
        if(value === 30){setFps(30)}
        }    

        const radioChangeHandler = (e: any) => {
            setDirection({
                value: e.target.value
            });
            if(e.target.value === 1){setDirection('P01')}
            if(e.target.value === 2){setDirection('P02')}
            };

            const [filmSetCount, setFilmSetCount] = useState([{
                FirstCamera: '',
                LastCamera:'',
                id:uuidv4(),
            }])
    
        const check = (e : any) => {
            console.log(settings)                    
        }

            let settings = 
            {   "tunnel_kor" : tunnel_kor,
                "tunnel_eng" : tunnel_eng,
                "scanSpeed" : scanSpeed,
                "fps": fps,
                "direction": direction,
                "filmSetCount":  String(JSON.stringify(filmSetCount)).replace(/\"/gi, '"'),
                "cameraCount": cameraCount,
                "spanCount": spanCount,
                "spanLength": spanLength,
                "constructType": constructType,
                "constructWidth": constructWidth,
                "constructLength": constructLength,
                "crackMaxWidth": crackMaxWidth,
                "offsetPersent": offsetPersent,
                "ownerId": id,
                "companyId": companyId
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
                    // localStorage.set("project_id", id);
                    console.log(`아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`)
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


    // eslint-disable-next-line @typescript-eslint/no-use-before-define

    const submit = async () => {
        console.log(`아이디는 다음과 같음 : ${id} / 회사는 다음과 같음 : ${companyId}`)
        const response = await axios({

            method: "post",
            url: API_URL + `/project/regist`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`, "Content-Type": `application/json`},
            data: {"title": title,
            "projectType": project_Type,
            "ownerId": id,
            "companyId": companyId,
            "settings" : JSON.stringify(settings).replace(/\"/gi, '"'),
            "status" : false
        }  ,
            // `${API_URL}/Project/Set?projectId=-1&title=${title}&projectType=${project_Type}`,
            // { "settings" : JSON.stringify(settings).replace(/\"/gi, '"') },
            // {headers : {"Content-Type": `application/json`, access_token : `${token}` }}       
        }).then((res) => {
                console.log("들어오는 데이터는 다음과 같습니다 : ",res.data)
                console.log("시설물",project_Type )
                if (res.data.check === true) {
                    console.log("받은 데이터는 다음과 같음 : ",res.data.check)

                    // console.log(res.data.code)

                    localStorage.setItem('project_id', res.data.code)
                    localStorage.setItem('settings',  JSON.stringify(settings).replace(/\"/gi, '"'))
                    
                    axios({
                        method: 'get',
                        url: API_URL + `/project/view/${res.data.code}`,
                        headers : {"accept" : `application/json`, "access-token" : `${token}`},

                    }).then((res) => {
                        if (res.data.check === true) {
                            // SetProjectInfo(res.data.data.settings)
                            localStorage.setItem('project_id', res.data.code)
                            setTimeout(()=>window.location.replace("/Facility/Dashboard/ProjectDashboard"),500)
                            
                        } else {
                            console.log('프로젝트 정보 atom 저장 실패')
                        }
                        })
                    alert(`프로젝트를 생성하였습니다.`);  
                    console.log(check)
                    // router.push('./PreProcessor/Dashboard')
                } else {
                    console.log("이미 있음")
                    console.log(res.data.check)
                }   
            }).catch((err) => {
                console.log("받은 에러는 다음과 같음",err)
            })  
        
        
    
        }

            





    const plus = (event:any):void => {
        console.log(check);
        // alert(`프로젝트를 생성하였습니다.`);
        // window.location.replace("/Tunnel/Dashboard/ProjectDashboard")
    }

    const click = (e:any) => {
        console.log(e.target.index)
    }



        const addMemberRow = () => {
            let _filmSetCount=[...filmSetCount]
                _filmSetCount.push({
                FirstCamera:'',
                LastCamera:'',
                id:uuidv4(),
            })
            setFilmSetCount(_filmSetCount)
        }

        const removeMemberRow = (id:string) => {
            let _inviteMembers=[...filmSetCount]
            _inviteMembers = _inviteMembers.filter(member=>member.id!==id)
            setFilmSetCount(_inviteMembers)
        }

            const handleMemberChange = (id:string, event:ChangeEvent<HTMLInputElement>,
                ) => {
                    const index=filmSetCount.findIndex(m=>m.id===id)
                let _inviteMembers =[...filmSetCount] as any
                _inviteMembers[index][event.target.name]= event.target.value
                setFilmSetCount(_inviteMembers)
            }

            const handleInvitation = () => {
                console.log(filmSetCount)
            }



  return (
    <>
        <div className={styles.Projectbody} >
                    <div className={styles.Createtable}>
                        <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                            <Form.Item className={styles.FormItem}  label="프로젝트 명"><Input value={title} onChange={titleInput} onClick={click} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 이름(한)"><Input value={tunnel_kor} onChange={tunnel_korInput} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 이름(영)"><Input value={tunnel_eng} onChange={tunnel_engInput} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 스캐너 이동 속도(km/h)">
                                <Select defaultValue={1} onChange={scanSpeedInput} >
                                    <Select.Option value={1} >10</Select.Option>
                                    <Select.Option value={2}>20</Select.Option>
                                    <Select.Option value={3}>30</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item className={styles.FormItem} label="영상 FPS">
                                <Select defaultValue={60} onChange={fpsChange}>
                                    <Select.Option value={60}>60</Select.Option>
                                    <Select.Option value={30}>30</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item className={styles.FormItem} name="radio-button" label="진행 방향">
                                <Radio.Group style={{display: "flex"}} defaultValue={1} onChange={radioChangeHandler} >
                                    <Radio.Button className={styles.RadioButton} value={1}>상행</Radio.Button>
                                    <Radio.Button className={styles.RadioButton} value={2}>하행</Radio.Button>
                                </Radio.Group>
                            </Form.Item>


                            <Form.Item className={styles.FormItem} label="촬영 set 수" style={{margin:'0px'}}>
                                    {filmSetCount.map((member, index) => (
                                        <div className="form-row" key={member.id} style={{display:"flex"}}>
                                        <div className="input-group" style={{display:"flex", marginBottom: "10px"}}>
                                            <label style={{margin: "5px 10px", }}>{`set${index+1}`}</label>
                                            <Input name="FirstCamera" 
                                            key=""
                                            type="number"
                                            placeholder="First Camera"
                                            onChange={(e) => handleMemberChange(member.id, e)}
                                            style={{marginRight: "10px", width: "200px"}}
                                            ></Input>                                   
                                        </div>
                                        <div className="input-group">
                                            <Input name="LastCamera" 
                                            type="number"
                                            placeholder="Last Camera"
                                            onChange={(e) => handleMemberChange(member.id, e)}
                                            style={{marginRight: "10px", width: "200px"}}
                                            ></Input>                                    
                                        </div>
                                        {
                                            filmSetCount.length > 1 && (
                                                <MinusCircleOutlined onClick={()=> {
                                                    removeMemberRow(member.id)}}
                                            style={{marginTop: "10px"}}
                                            />
                                        )}

                                        <PlusCircleOutlined onClick={() => {addMemberRow()}} 
                                        style={{marginTop: "10px" , marginLeft: "10px"}}
                                        />                                        
                                    </div>
                                    ))}
                        
                            </Form.Item>


                            <Form.Item className={styles.FormItem} label="카메라 수"><Input value={cameraCount} onChange={cameraCountInput}  type={"number"} suffix="개" /></Form.Item>
                            <Form.Item className={styles.FormItem} label="스팬 수"><Input value={spanCount} onChange={spanCountInput}  type={"number"} suffix="개" /></Form.Item>
                            <Form.Item className={styles.FormItem} label="스팬 길이"><Input value={spanLength} onChange={spanLengthInput}  type={"number"} suffix="m"/></Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 종류"><Input value={constructType} onChange={constructTypeInput}  type={"string"} /></Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 너비"><Input value={constructWidth} onChange={constructWidthInput}  type={"number"} suffix="m"/></Form.Item>
                            <Form.Item className={styles.FormItem} label="터널 길이"><Input  value={constructLength} onChange={constructLengthInput} type={"number"} suffix="m"/></Form.Item>
                            <Form.Item className={styles.FormItem} label="실제 균열 최대 폭"><Input value={crackMaxWidth} onChange={crackMaxWidthInput}  type={"number"} suffix="m"/></Form.Item>
                            <Form.Item className={styles.FormItem} label="겹침률"><Input value={offsetPersent} onChange={offsetPersentInput} type={"number"} suffix="%" /></Form.Item>
                        </Form>
                    </div>

                                    <div>          
                        
                        
                    </div>
                </div>

                <div className={styles.CreateButton}>


                    {/* <Button onClick={submit}>확인</Button> */}
                    <Button onClick={submit}>확인</Button>
                </div>
    </>
  )
}
