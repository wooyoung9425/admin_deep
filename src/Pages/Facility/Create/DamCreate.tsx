import styles from '../../../Styles/CreateProject.module.css'
import { Button, Form, Select, Radio, Input, Checkbox } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../Store/Global';
import {v4 as uuidv4} from "uuid"

export default function DamCreate() {
    
    const token = localStorage.getItem("token")
    const project_Type = localStorage.getItem("project_Type");
    const [id, setId] = useState<number>(-1);
    const [companyId, setCompanyId] = useState<number>(-1);
    const [title, setTitle] = useState<string>('');
    const [dam_kor, setDam_kor] = useState<string>('');
    const [dam_eng, setDam_eng] = useState<string>('');
    const[dam_type, setDam_Type] = useState([])
    const [dam_latitude_start, setDam_latitude_start] = useState<number>(36.12693);
    const [dam_latitude_end, setDam_latitude_end] = useState<number>(36.12537);
    const [dam_longitude_start, setDam_longitude_start] = useState<number>(128.9484);
    const [dam_longitude_end, setDam_longitude_end] = useState<number>(128.9461);
    const [dam_height_start, setDam_height_start] = useState<number>(220);
    const [dam_height_end, setDam_height_end] = useState<number>(280);
    const [dam_width_area, setDam_width_area] = useState<number>(9);
    const [dam_height_area, setDam_height_area] = useState<number>(4);


    const titleInput = (e:any) => {setTitle(e.target.value);}
    const dam_korInput = (e:any) => {setDam_kor(e.target.value);}
    const dam_engInput = (e:any) => {setDam_eng(e.target.value);}
    // const dam_typeInput = (e:any) => {setDam_type(e.target.value);}
    const dam_latitude_startInput = (e:any) => {setDam_latitude_start(Number(e.target.value));}
    const dam_latitude_endInput = (e:any) => {setDam_latitude_end(Number(e.target.value));}
    const dam_longitude_startInput = (e:any) => {setDam_longitude_start(Number(e.target.value));}
    const dam_longitude_endInput = (e:any) => {setDam_longitude_end(Number(e.target.value));}
    const dam_height_startInput = (e:any) => {setDam_height_start(Number(e.target.value));}
    const dam_height_endInput = (e:any) => {setDam_height_end(Number(e.target.value));}
    const dam_width_areaInput = (e:any) => {setDam_width_area(Number(e.target.value));}
    const dam_height_areaInput = (e:any) => {setDam_height_area(Number(e.target.value));}




    let settings = 
            {   "dam_kor" : dam_kor,
                "dam_eng" : dam_eng,
                "dam_type" : dam_type,
                "dam_latitude_start": dam_latitude_start,
                "dam_latitude_end": dam_latitude_end,
                "dam_longitude_start":  dam_longitude_start,
                "dam_longitude_end" : dam_longitude_end,
                "dam_height_start": dam_height_start,
                "dam_height_end": dam_height_end,
                "dam_width_area": dam_width_area,
                "dam_height_area": dam_height_area
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
            // `${API_URL}/Project/Set?projectId=-1&title=${title}&projectType=${project_Type}`,
            // { "settings" : JSON.stringify(settings).replace(/\"/gi, '"') },
            // {headers : {"accept": `application/json`, "access-token" : `${token}` }}
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
                            // console.log("성ㅇㅇㅇㅇㅇㅇㅇㅇㅇ공")
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

        const { Option } = Select;

        const handleChange = (value: string) => {
            console.log(`selected ${value}`);
    };

    const onclick = (e: any) => {
        let arr: any = [...dam_type];
        console.log(e.target.value, e)
        if (e.target.checked === true) {
            if (arr.includes(e.target.value) === false) {
                arr.push(e.target.value)
            } 
        } else {
            arr = arr.filter((a:string) => a !== e.target.value)
        }
        setDam_Type(arr)
        console.log(dam_type)
    }
    

    return (
        <>
        <div className={styles.Projectbody} >
            <div className={styles.Createtable}>
                <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                    <Form.Item className={styles.FormItem}  label="프로젝트 명"><Input value={title} onChange={titleInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 이름(한글)"><Input value={dam_kor} onChange={dam_korInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 이름(영어)"><Input value={dam_eng} onChange={dam_engInput} /></Form.Item>
                    <Form.Item label="댐 구역" className={styles.csFormItem}>
                        <Checkbox value="UpStream" onClick={onclick}>상류</Checkbox>
                        <Checkbox value="DamFloor" onClick={onclick}>댐마루</Checkbox>
                        <Checkbox value="Overflow" onClick={onclick}>하류(월류부)</Checkbox>
                        <Checkbox value="DownStream" onClick={onclick}>하류(비월류부)</Checkbox>
                        
                    </Form.Item>
                    {/* <Form.Item className={styles.FormItem} label="댐 구역">
                        <Select   defaultValue="1"  onChange={handleChange}>
                                <Option value="1">월류부</Option>
                                <Option value="2" disabled>마루</Option>
                                <Option value="3" disabled>기초</Option>
                                </Select>
                        </Form.Item> */}
                    <Form.Item className={styles.FormItem} label="댐 시작 위도"><Input disabled value={dam_latitude_start} onChange={dam_latitude_startInput}  type={"number"} suffix="°" /></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 끝 위도"><Input disabled value={dam_latitude_end} onChange={dam_latitude_endInput}   type={"number"} suffix="°"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 시작 경도"><Input disabled value={dam_longitude_start} onChange={dam_longitude_startInput}   type={"number"} suffix="°"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 끝 경도"><Input  disabled value={dam_longitude_end} onChange={dam_longitude_endInput}  type={"number"} suffix="°"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 높이 시작지점"><Input disabled value={dam_height_start} onChange={dam_height_startInput}  type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 높이 끝지점"><Input disabled value={dam_height_end} onChange={dam_height_endInput} type={"number"} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 가로 영역 갯수"><Input disabled  value={dam_width_area} onChange={dam_width_areaInput} type={"number"} suffix="개"/></Form.Item>
                    <Form.Item className={styles.FormItem} label="댐 높이 영역 갯수"><Input disabled  value={dam_height_area} onChange={dam_height_areaInput} type={"number"} suffix="개"/></Form.Item>
                </Form>
            </div>
        </div>
        <div className={styles.CreateButton}>
            <Button onClick={submit}>확인</Button>
        </div>
        </>
    )
}
