import styles from '../../../Styles/CreateProject.module.css'
import { Button, Form, Select, Tooltip, Input, Checkbox } from 'antd';
import { useRecoilState } from 'recoil';
import { ko, en } from '../../../translations';
import { langState } from '../../../Store/State/atom'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../Store/Global';
import FormItem from 'antd/lib/form/FormItem';
import { isConstructorDeclaration } from 'typescript';



export default function BridgeCreate() {
    
    const token = localStorage.getItem("token")
    const project_Type = localStorage.getItem("project_Type");
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const [id, setId] = useState<number>(-1);
    const [companyId, setCompanyId] = useState<number>(-1);
    const [ListArr, setListArr] = useState<any>([]);

    const [title, setTitle] = useState<string>('');
    const [bridge_kor, setBridge_kor] = useState<string>('');
    const [bridge_eng, setBridge_eng] = useState<string>('');
    const [bridge_type, setBridge_type] = useState([])
    const [bridge_length,setBirdge_length]=useState<string>('')
    const [girder_count, setGirderCount] = useState<number>(0);
    const [girder_camera_count, setGirder_camera_count] = useState<number>(0)
    const [girder_width, setGirder_width] = useState<number>(0);
    const [girderside_height, setGirderSide_height] = useState<number>(0);
    const [pier_count, setPierCount] = useState<number>(0);
    const [pier_film_count, setPierFilmCount] = useState<number>(0);
    const [pier_height, setPier_Height] = useState<number>(0);
    const [pier_radius, setPier_Radius] = useState<number>(0);
    const [slab_count, setSlabCount] = useState<number>(0);
    const [slab_width, setSlab_width] = useState<number>(0);
    const [span_length, setSpan_length] = useState<number>(0);
    const [span_class_length, setSpan_class_length] = useState<number>(0);
    const [span_count, setSpan_count] = useState<number>(0);
    const [pierConfirm, setPierConfirm] = useState<boolean>(false)
    const [span_number_list, setSpan_number_list] = useState([])
    const [pier_number_list, setPier_number_list] = useState([])

    let span_list: any = []
    let pier_list : any = []

    const titleInput = (e:any) => {setTitle(e.target.value);}
    const bridge_korInput = (e:any) => {setBridge_kor(e.target.value);}
    const bridge_engInput = (e: any) => { setBridge_eng(e.target.value); }
    const bridge_lengthInput = (e: any) => { setBirdge_length(e.target.value); }
    const girder_countInput = (e: any) => { setGirderCount(Number(e.target.value)); }
    const girder_camera_countInput = (e: any) => { setGirder_camera_count(e.target.value) }
    const girder_widthInput = (e:any)=>{setGirder_width(Number(e.target.value))}
    const girderside_heightInput = (e:any)=>{setGirderSide_height(Number(e.target.value))}
    const pier_film_countInput = (e: any) => { setPierFilmCount(Number(e.target.value)); console.log(pier_number_render) }
    const span_lengthInput = (e: any) => { setSpan_length(Number(e.target.value)); }
    const span_class_lengthInput = (e: any) => { setSpan_class_length(Number(e.target.value)); }
    const slab_countInput = (e: any) => { setSlabCount(Number(e.target.value)) };
    const slab_widthInput = (e: any) => { setSlab_width(Number(e.target.value)) };
    const pier_heightInput = (e: any) => { setPier_Height(Number(e.target.value)) }
    const pier_radiusInput = (e: any) => { setPier_Radius(Number(e.target.value)) }

    const [span_number_render, setSpan_number_render] = useState<any>([])
    const [pier_number_render,setPier_number_render]=useState<any>([])
    const pier_countInput = (e: any) => {
        setPierCount(Number(e.target.value));
        
        let pier_number=[]
        for (let i = 0; i < Number(e.target.value); i++){
            
            pier_number.push(
                <Input type={"number"} id={String((i))} defaultValue={0} onChange={pier_number_add} suffix="번"  />
            )
            console.log(pier_number)
        }
        setPier_number_render(pier_number)
    }
    const span_countInput = (e: any) => {
        setSpan_count(Number(e.target.value));
        let span_number = []
        for (let i = 0; i < Number(e.target.value); i++){
            span_number.push(
                <Input type={"number"} id={String((i))} defaultValue={0} onChange={span_number_add} suffix="번"  />
            )
        }
        setSpan_number_render(span_number)
            
    }

    let settings = 
            {   "bridge_kor" : bridge_kor,
                "bridge_eng" : bridge_eng,
                "bridge_type": bridge_type,
                "bridge_length": bridge_length,
                "span_count": span_count,
                "span_number_list":span_number_list,
                "girder_count": girder_count,
                "girder_camera_count": girder_camera_count,
                "girder_width":girder_width,
                "girderside_height":girderside_height,
                "slab_count": slab_count,
                "slab_width": slab_width,
                "pier_count": pier_count,
                "pier_film_count": pier_film_count,
                "pier_height": pier_height,
                "pier_radius": pier_radius,
                "pier_number_list":pier_number_list,
                "span_length": span_length,
                "span_class_length":span_class_length
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

        const { Option } = Select;

        const handleChange = (value: string) => {
            console.log(`selected ${value}`);
    };

    const onclick = (e: any) => {
        let arr: any = [...bridge_type];
        let list: any = [...ListArr];
        // console.log(e.target.value, e)
        if (e.target.checked === true) {
            if (arr.includes(e.target.value) === false) {
                arr.push(e.target.value)
            } 
        } else {
            arr = arr.filter((a:string) => a !== e.target.value)
        }
        setBridge_type(arr)

        if (e.target.checked === true) {
            if (e.target.value === 'Girder') {
                list.push(
                    <div key={e.target.value}>
                        <Form.Item label="거더 개수" className={styles.FormItem} key="Girder_count">
                            <Input type={"number"} defaultValue={girder_count} onChange={girder_countInput} suffix="개" />
                        </Form.Item>
                        <Form.Item label="거더 촬영 횟수" className={styles.FormItem} key="Girder_camera_count">
                            <Input type={"number"} defaultValue={girder_camera_count} onChange={girder_camera_countInput} suffix="개" />
                        </Form.Item>
                        <Form.Item label="거더 하면- 폭" className={styles.FormItem} key="Girder_width">
                            <Input type={"number"} defaultValue={girder_width} onChange={girder_widthInput} suffix="m" />
                        </Form.Item>
                    </div>
                )
            } else if (e.target.value === 'GirderSide') {
                list.push(<div key={e.target.value}> 
                        <Form.Item label="거더 측면 - 높이" className={styles.FormItem} key="Girder_height">
                            <Input type={"number"} defaultValue={girderside_height} onChange={girderside_heightInput} suffix="m"  />
                        </Form.Item>  
                    </div>)
            } else if (e.target.value === 'Pier') {
                setPierConfirm(true)
                list.push(
                    <div key="Pier">
                        <Form.Item label="교각 개수" className={styles.FormItem} key="Pier_count">
                            <Input type={"number"} defaultValue={pier_count} onChange={pier_countInput} suffix="개"  />
                        </Form.Item>
                        <Form.Item label="교각 촬영 횟수" className={styles.FormItem} key="Pier_film_count">
                            <Input type={"number"} defaultValue={pier_film_count} onChange={pier_film_countInput} suffix="개"  />
                        </Form.Item>
                        <Form.Item label="교각 높이" className={styles.FormItem} key="pier_height">
                            <Input type={"number"} defaultValue={pier_height} onChange={pier_heightInput} suffix="개"  />
                        </Form.Item>
                         <Form.Item label="교각 반지름" className={styles.FormItem} key="pier_radius">
                            <Input type={"number"} defaultValue={pier_radius} onChange={pier_radiusInput} suffix="m"  />
                        </Form.Item>
                    </div>
                )
            } else if (e.target.value === 'Slab') {
                list.push(
                    <div key='Slab'>
                        <Form.Item label="슬라브 개수" className={styles.FormItem} key="Slab_count">
                            <Input type={"number"} defaultValue={slab_count} onChange={slab_countInput} suffix="개"/>
                        </Form.Item>
                        <Form.Item label="슬라브 폭" className={styles.FormItem} key="Slab_width">
                            <Input type={"number"} defaultValue={slab_width} onChange={slab_widthInput} suffix="m"/>
                        </Form.Item>
                    </div>
                )
            }
            // setListArr(list)
        } else {
            console.log(list)
            const val: string = e.target.value
            list=list.filter((a: any) => a.key!==val)
        }
        setListArr(list)
        
    }
    
    const span_number_add = (e: any) => {
        const index = span_list.findIndex((item: any) => Number(item.key) === Number(e.target.id) + 1)
        if (index === -1) {
            span_list.push({key: Number(e.target.id) + 1, num: e.target.value })
        } else {
            span_list[index] = { ...span_list[index], num:e.target.value}
        }
        setSpan_number_list(span_list)
    }
    const pier_number_add = (e: any) => {
        const index = pier_list.findIndex((item: any) => Number(item.key) === Number(e.target.id) + 1)
        if (index === -1) {
            pier_list.push({key: Number(e.target.id) + 1, num: e.target.value })
        } else {
            pier_list[index] = { ...pier_list[index], num:e.target.value}
        }
        setPier_number_list(pier_list)
    }

    const onChangeBridgekind = (e:any) => {
        
    }
    return (
        <>
        <div className={styles.Projectbody} >
            <div className={styles.Createtable}>
                <Form className={styles.Forms} labelCol={{ span: 8, }} wrapperCol={{ span: 8 }} layout="horizontal">
                    <Form.Item className={styles.FormItem} label={t.ProjectCreateName}><Input value={title} onChange={titleInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label={t.bridgeKind}>
                        <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeBridgekind}>
                                <Option value="Steel">스틸박스거더교</Option>
                                <Option value="Beem" >PSC빔교</Option>
                                <Option value="concrete">콘크리트박스거더교</Option>
                        </Select>    
                    </Form.Item>
                    <Form.Item className={styles.FormItem} label={t.ProjectCreateBridgeNameKo}><Input value={bridge_kor} onChange={bridge_korInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label={t.ProjectCreateBridgeNameEn}><Input value={bridge_eng} onChange={bridge_engInput} /></Form.Item>
                    <Form.Item className={styles.FormItem} label={t.bridgeLength}><Input value={bridge_length} onChange={bridge_lengthInput} suffix="m"/></Form.Item>
                    <Form.Item className={styles.FormItem} label={t.spanCount}><Input value={span_count} onChange={span_countInput} suffix="개"/></Form.Item>
                    <Form.Item className={styles.FormItem} label={t.spanNumber}>{ span_number_render}</Form.Item>
                    <Form.Item label={t.bridgeArea} className={styles.csFormItem}>
                        <Checkbox value="Girder" onClick={onclick}>{t.girder}</Checkbox>
                        <Checkbox value="GirderSide" onClick={onclick}>{t.girder_side}</Checkbox>    
                        <Checkbox value="Slab" onClick={onclick}>{t.slab}</Checkbox>
                        <Checkbox value="SlabSide" onClick={onclick}>{t.slab_side}</Checkbox>
                        <Checkbox value="Pier" onClick={onclick}>{t.pier}</Checkbox>
                        <Checkbox value="Abutment" onClick={onclick} disabled>{t.abutment}</Checkbox>    
                    </Form.Item>
                    {ListArr}
                    {pierConfirm === true ?
                        <Form.Item label="교각 번호" className={styles.FormItem} key="Pier_number">
                            {pier_number_render}     
                        </Form.Item> : <div></div>
                    }
                    <Form.Item className={styles.FormItem} label={t.spanLength}>
                        <Input value={span_length} onChange={span_lengthInput} suffix="m"/>
                    </Form.Item>
                    <Form.Item className={styles.FormItem} label={t.spanClassLength}>
                        <Tooltip placement="right" color='#2db7f5' title="파노라마 실행할 때 사용되는 기준">
                            <Input value={span_class_length} onChange={span_class_lengthInput} suffix="m"/>
                        </Tooltip>
                    </Form.Item>    
                        
                </Form>
            </div>
        </div>
        <div className={styles.CreateButton}>
            <Button onClick={submit}>확인</Button>
        </div>
        </>
    )
}
