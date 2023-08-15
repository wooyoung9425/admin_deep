import styles from '../../../Styles/CreateProject.module.css'
import { Button, Form, Select, Tooltip, Input, Checkbox,Radio } from 'antd';
import { useRecoilState } from 'recoil';
import { ko, en } from '../../../translations';
import { langState } from '../../../Store/State/atom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../Store/Global';



export default function BuildingCreate() {
    
    const token = localStorage.getItem("token")
    const project_Type = localStorage.getItem("project_Type");
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const [id, setId] = useState<number>(-1);
    const [companyId, setCompanyId] = useState<number>(-1);
    const [ListArr, setListArr] = useState<any>([]);

    const [title, setTitle] = useState<string>('');
    const [building_kor, setBuilding_kor] = useState<string>('');
    const [building_eng, setBuilding_eng] = useState<string>('');
    const [building_type, setBuilding_type] = useState([])
    const [building_UpFloor,setBuilding_UpFloor]=useState<string>('')
    const [building_DownFloor, setBuilding_DownFloor] = useState<number>(0);
    const [building_Sector, setBuilding_Sector] = useState<number>(0)
    
    const { Option } = Select;
    const titleInput = (e:any) => {setTitle(e.target.value);}
    const building_korInput = (e:any) => {setBuilding_kor(e.target.value);}
    const building_engInput = (e: any) => { setBuilding_eng(e.target.value); }
    const building_UpFloorInput = (e: any) => {setBuilding_UpFloor(e.target.value);}
    const building_DownFloorInput = (e:any) => {setBuilding_DownFloor(e.target.value)}
    const building_SectorInput = (e:any) => {setBuilding_Sector(e.target.value)}
    
    let settings = 
            {   "building_kor" : building_kor,
                "building_eng" : building_eng,
                "building_type": building_type,
                "building_UpFloor": building_UpFloor,
                "building_DownFloor": building_DownFloor,
                "building_Sector": building_Sector,
                "building_Info": [{}]
                
            };

    useEffect(() => {
        let getIdCompany = async () => {
            if(token !== null){ 
                // console.log("여기 들어옴?")
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
        console.log(settings)
        for (let i = 0; i < Number(settings.building_UpFloor); i++){
            for (let j = 0; j < Number(settings.building_Sector); j++){
                settings.building_Info.push({ id: (i+1)+"-"+(j+1),floor: "지상" + (i + 1) + "층", sector: (j+1)+"호"})
            }
        }
        for (let i = 0; i < Number(settings.building_DownFloor); i++){
            settings.building_Info.push({id:"-"+(i+1), floor:"지하"+(i+1)+"층", sector:""})
        }
        // setTimeout(()=>console.log(settings.building_Info),2000)
    
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

        

    const onclick = (e: any) => {
        if (e.target.value === 'in') {
            console.log("실내")
        }else{
            console.log("실외")
        }
    }
    
   

    const onChangeBridgekind = (e:any) => {
        
    }
    
    return (
        <>
        <div className={styles.Projectbody} >
            <div className={styles.Createtable}>
                <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                <Form.Item className={styles.FormItem} label={t.ProjectCreateName}><Input value={title} onChange={titleInput} /></Form.Item>
                <Form.Item label="선택"  rules={[{ message: 'Please pick an item!', },]} className={styles.csFormItem}>
                    <Radio.Group>
                      <Radio.Button className={styles.csFromRadio} value="in" id="building" onClick={onclick}>실내</Radio.Button>
                      <Radio.Button className={styles.csFromRadio} value="out" id="building" onClick={onclick}>실외</Radio.Button>
                    </Radio.Group>
                </Form.Item>        
                <Form.Item className={styles.FormItem} label={t.buildingKind}>
                    <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeBridgekind}>
                        <Option value="Aparment">아파트</Option>
                        <Option value="House" >단독주택</Option>
                            <Option value="Villa">빌라</Option>
                    </Select>    
                </Form.Item>
                <Form.Item className={styles.FormItem} label={t.ProjectCreateBuildingNameKo}><Input value={building_kor} onChange={building_korInput} /></Form.Item>
                <Form.Item className={styles.FormItem} label={t.ProjectCreateBuildingNameEn}><Input value={building_eng} onChange={building_engInput} /></Form.Item>
                <Form.Item className={styles.FormItem} label={t.buildingUpFloor}><Input value={building_UpFloor} onChange={building_UpFloorInput} suffix="층"/></Form.Item>
                <Form.Item className={styles.FormItem} label={t.buildingDownFloor}><Input value={building_DownFloor} onChange={building_DownFloorInput} suffix="층"/></Form.Item>
                <Form.Item className={styles.FormItem} label={t.buildingSector}><Input value={building_Sector} onChange={building_SectorInput} suffix="개"/></Form.Item>
                 
                </Form>
            </div>
        </div>
        <div className={styles.CreateButton}>
            <Button onClick={submit}>확인</Button>
        </div>
        </>
    )
}
