import { Button, Form, Input,Select} from "antd";
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css';
import { langState, projectType } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { useRecoilState, atom } from 'recoil';
import { API_URL,IMAGE_URL } from '../../../../Store/Global';
import axios from 'axios';
import React, { useEffect, useState, ChangeEvent } from 'react'
import {v4 as uuidv4} from "uuid"
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';


export default function BridgeDrawerSetting() {
    let token: string | null = localStorage.getItem("token");
    let job_id = 0;
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem("project_id");
    const [typeArr, setType] = useState([])
    const [BridgeType, setBridgeType] = useState("")
    const fileReader = new FileReader()

    const [state, setState] = useState({
            bridge_name: 0,
            girder_count: 0,
            span_length: 0,
            span_class_length: 0,
            pier_count: 0,
            girder_width:0,
            girderside_height: 0,
            slab_width: 0,
            max_width:0, //실제 최대 균열 폭
            user_max_width: 0,  // 사용자 최대 균열 폭 설정
            panorama_len:0,
            // filter_len:0,
            // filter_wid: 0,
            // layer: '',
            // color: 1,
            // table_color: 7,
            // draw_color: 7,
            // tunneltilewidth: 0,
            contype: 0,
            // camerashotwidth: 0,
            bridgelength: 0,
            // tunnelwidth: 0,
            // overlap:0
    });


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

    const [infoConfirm, setInfoConfirm]=useState<number>(1)
    const { Option } = Select;
    useEffect(() => {
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((result) => {
            if (result.data.check === true) {
                const settings = JSON.parse(result.data.data.settings)
                setType(settings.bridge_type)
                console.log(settings)
                setState({
                ...state, ['bridge_name']: settings.bridge_kor,
                ['girder_count']: settings.girder_count,
                ['span_length']: settings.span_length,
                ['span_class_length']: settings.span_class_length,
                ['contype']: result.data.data.projectType,
                // ['camerashotwidth']: 0,
                ['bridgelength']: settings.bridge_length,
                // ['tunnelwidth']: settings.constructWidth,
                ['pier_count']: settings.pier_count,
                ['girder_width']:settings.girder_width,
                ['girderside_height']: settings.girderside_height,
                ['slab_width']:settings.slab_width,
                })
            //   console.log(state)
                const span_no = settings.span_length / settings.span_class_length;
                console.log(span_no)
                for (let i = 1; i < span_no+1; i++){
                    
                }
            }
        })
    
    }, [])

    
    // form 설정 가져오기

    const handleChange = (e: any) => {
        console.log(e.target.name, typeof e.target.value)
        
        setState({
            ...state,
            [e.target.name]: Number( e.target.value)
        })
    }
    const handleMemberChange = (id: string, event: ChangeEvent<HTMLInputElement>,) => {
        const index=bridgeInfo.findIndex(m=>m.id===id)
        let _inviteMembers = [...bridgeInfo] as any
        _inviteMembers[index][event.target.name] = event.target.value
        setBridgeInfo(_inviteMembers)

    }

    const addMemberRow = () => {
        let row_cnt = ((state.span_length / state.span_class_length) * (state.pier_count))
        console.log(infoConfirm, row_cnt)
        if (infoConfirm === row_cnt) {
            
            alert("개수를 초과했습니다.")
        } else {
            setInfoConfirm(infoConfirm+1)
            let _bridgeInfo=[...bridgeInfo]
                _bridgeInfo.push({
                StructureType: '',
                Slab: 0,
                CB: 0,
                Girder: 0,
                Diaphragm:0,
                id:uuidv4()
            }) 
            setBridgeInfo(_bridgeInfo)
        }
    }

    const removeMemberRow = (id:string) => {
        let _inviteMembers=[...bridgeInfo]
        _inviteMembers = _inviteMembers.filter(member=>member.id!==id)
        setBridgeInfo(_inviteMembers)
    }

    const [bridgeInfo, setBridgeInfo] = useState([{
        StructureType: '',
        Slab: 0,
        CB: 0,
        Girder: 0,
        Diaphragm:0,
        id:uuidv4()
    }])

    const submitClick1 = () => {
        console.log("프로젝트 id", project_id)
        let row_cnt = ((state.span_length / state.span_class_length) * (state.pier_count))
        let input_data :any[] = []
        // let row_data = []
        bridgeInfo.map((item: any, index:number) => {
            input_data.push([item['Pier'], item['StructureType'], item['Slab'], item['CB'],item['Girder'],item['Span'],item['Diaphragm'],item['Cam']])
        })
        // console.log(JSON.stringify(input_data).replace(/\"/gi, "'"))
        axios({
            method: "post",
            url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
            headers: {
              "accept": `application/json`,
              "access-token": `${token}`,
              "Content-Type": `application/json`
            },
            data: {
                project_id: project_id,
                task_name: "drawer_bridge",
                interactive: true,
                tasks: [{
                    input_csv_crack: `stage7_Crack/${BridgeType}`,
                    input_csv_defect: `stage6_defect/${BridgeType}`,
                    input_info_csv: `stage8/${BridgeType}/BridgeInfo.csv`,
                    input_total_csv: `stage8/result/${BridgeType}_result.csv`,
                    sub_span: 0, // 필요없는 기능
                    bridge_type:BridgeType,
                    output_folder: `stage8/${BridgeType}`,
                    input_array: JSON.stringify(input_data).replace(/\"/gi, "'"),
                    conf_csvmerge_name: "csvMerge.conf",
                    conf_csvmerge_folder: "stage8",
                    conf_csvmerge_values: {
                        panorama_len:state.span_length
                    },
                    conf_dbinfo_name: "BridgeInfo.conf",
                    conf_dbinfo_folder: "stage8",
                    conf_dbinfo_values: {
                        bridge_name: state.bridge_name,
                        max_width: state.max_width,
                        user_max_width: state.user_max_width

                    }
                }]
            },
        }).then((res) => {
            console.log(res)
            // alert("외관조사망도 진행중입니다.")
            // result = setInterval(confirm, 20000); 
        }).catch((err) => {
          console.log(err)
        })
    
  };

    let result :any;
    const confirm = () => {
        console.log(job_id)
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
            }).then((res) => {
                console.log(res)
                if (res.data.check === true) {
                    console.log("성공",res.data.data.status)
                    if (res.data.data.status === "done") {
                        alert("외관조사망도가 끝났습니다.")
                        clearInterval(result)
                        window.location.href='../CrackDrawer_Estimator/ReportDownload'
                    } else if (res.data.data.status === "wait") {
                    //   axios({
                    //     method: "get",
                    //     url: API_URL + '/File/Files',
                    //     headers: { "accept": `application/json`, "access-token": `${token}` },
                    //     params : {path : `project/${project_id}//`}
                    //   }).then((res2) => {
                    //     console.log(res2.data.data.files.length)
                    //     alert("외관조사망도 step" + res2.data.data.files.length + " 가 끝났습니다.")
                    //   })
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }
    const option_render=()=>{
            const arr:any[]=[];
            typeArr.map((type:any)=>{
                let name=''
                if(type==='Girder'){
                    name='거더 하면'
                }else if(type==='GirderSide'){
                    name='거더 측면'
                }else if(type==='Slab'){
                    name='슬라브 하면'
                }else if (type === 'SlabSide') {
                    name='슬라브 측면'
                } else if (type === 'Pier') {
                    name ='교각'
                } else if (type === 'Abutment') {
                    name='교대'
                }
                arr.push(<Option value={type}> {name}</Option>)
            })
            return arr;
    }
    const onChangeBridgeType = (e:any) => {
        console.log(e)
        if(e === "Girder"){
            setBridgeType("Girder")
        }else if(e === "GirderSide"){
            setBridgeType("GirderSide")
        }else if(e === "Slab"){
            setBridgeType("Slab")
        } else if (e === "SlabSide") {
            setBridgeType("SlabSide")
        } else if(e === "Pier"){
            setBridgeType("Pier")
        } else if(e === "Abutment"){
            setBridgeType("Abutment")
        }

    }

    const selectByType = () => {
        const select_by_type:any = [];
        if (BridgeType === 'Girder') {
            select_by_type.push(
                <div>
                    <Form.Item label="거더 하면 - 폭" className={styles.csFormItem} >
                        <Input value={state.girder_width} className={styles.csFormInput} name="girder_width" suffix="m" onChange={handleChange}/>
                    </Form.Item>
                    <Form.Item label="거더 하면 - 서브 스팬의 길이" className={styles.csFormItem} >
                        <Input value={state.span_class_length} className={styles.csFormInput} name="panorama_len" suffix="m" onChange={handleChange}/>
                    </Form.Item>
                    <Form.Item label="균열 실제 최대 폭" className={styles.csFormItem} >
                        <Input className={styles.csFormInput} suffix="mm" name="max_width" onChange={handleChange}/>
                    </Form.Item>
                </div>
            )
        } else if (BridgeType === 'GirderSide') {
            select_by_type.push(
                <div>
                    <Form.Item label="거더 측면 - 높이" className={styles.csFormItem} >
                        <Input value={state.girderside_height} className={styles.csFormInput} suffix="m" name="girderside_height" onChange={handleChange}/>
                    </Form.Item>
                    <Form.Item label="거더 측면 - 서브 스팬의 길이" className={styles.csFormItem} >
                        <Input value={state.span_class_length} className={styles.csFormInput} name="panorama_len" suffix="m" onChange={handleChange}/>
                    </Form.Item>
                     <Form.Item label="균열 실제 최대 폭" className={styles.csFormItem} >
                        <Input value={state.max_width} className={styles.csFormInput} suffix="mm" name="max_width" onChange={handleChange}/>
                    </Form.Item>
                </div>
            )
        } else if (BridgeType === 'Slab') {
            select_by_type.push(
                <div>
                    <Form.Item label="슬라브 하면 - 폭" className={styles.csFormItem} >
                        <Input value={state.girderside_height} className={styles.csFormInput} suffix="m" name="girderside_height" onChange={handleChange}/>
                    </Form.Item>
                    <Form.Item label="슬라브 하면- 서브 스팬의 길이" className={styles.csFormItem} >
                        <Input value={state.span_class_length} className={styles.csFormInput} name="panorama_len" suffix="m" onChange={handleChange}/>
                    </Form.Item>
                     <Form.Item label="균열 실제 최대 폭" className={styles.csFormItem} >
                        <Input value={state.max_width} className={styles.csFormInput} suffix="mm" name="max_width" onChange={handleChange}/>
                    </Form.Item>
                </div>
            )
        }else if (BridgeType === 'Pier') {
            select_by_type.push(
                <div>
                    <Form.Item label="교각 - 높이" className={styles.csFormItem} >
                        <Input value={state.panorama_len} className={styles.csFormInput} name="panorama_len" suffix="m" onChange={handleChange}/>
                    </Form.Item>
                     <Form.Item label="균열 실제 최대 폭" className={styles.csFormItem} >
                        <Input value={state.max_width} className={styles.csFormInput} suffix="mm" name="max_width" onChange={handleChange}/>
                    </Form.Item>
                </div>
            )
        }
        
        return select_by_type
    }

    const onChangeMaxWidth = (e: any) => {
        console.log(e)
        setState({...state, ['user_max_width']: e})
    }
    return (
        
    <div><Form labelCol={{ span: 6, }}  wrapperCol={{ span: 11, }} layout="horizontal" className={styles.csForm} >
            <Form.Item label=" 교량 타입" className={styles.csFormItem} >
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeBridgeType}>
                  {option_render()}
                </Select>
              </Form.Item>
            <Form.Item label={t.ProjectCreateName} className={styles.csFormItem} >
                <Input value={state.contype} className={styles.csFormInput} />
            </Form.Item>
            <Form.Item label={t.ProjectCreateBridgeNameKo} className={styles.csFormItem}>
                <Input value={state.bridge_name} className={styles.csFormInput}></Input>
            </Form.Item>
            <Form.Item label="교량의 길이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" value={state.bridgelength} onChange={handleChange} name="bridge_length"/>
            </Form.Item>
            <Form.Item label="경간 길이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" value={state.span_length} onChange={handleChange} name="span_no"/>
            </Form.Item>
            <Form.Item label="경간 분류 길이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" value={ state.span_class_length} onChange={handleChange} name="span_len"/>
            </Form.Item>
            <Form.Item label="서브 스팬 수" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" value={ state.span_length/state.span_class_length} onChange={handleChange} name="span_len"/>
            </Form.Item>
            <Form.Item label="균열 최대 폭 설정" className={styles.csFormItem}>
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeMaxWidth}>
                    <Option value={'0.5'}> 0.5 mm</Option>
                    <Option value={'0.7'}> 0.7 mm</Option>
                    <Option value={'1.0'}> 1.0 mm</Option>
                </Select>
            </Form.Item>
            {
                selectByType()
            }
             <Form.Item className={styles.csFormItem} label="교량 정보" style={{margin:'0px'}}> 
                {bridgeInfo.map((member, index) => (
                    <div className="form-row" key={member.id} style={{display:"flex"}}>
                    <div className="input-group" style={{display:"flex", marginBottom: "10px"}}>
                            <label style={{ margin: "5px 10px", }}>{index + 1+')'}</label>
                        <Input name="Pier"
                        type="string"
                        placeholder="교각 번호"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "100px"}}
                        ></Input>           
                    </div>
                    <div className="input-group">
                        <Input name="StructureType"
                        type="string"
                        placeholder="부재"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "100px"}}
                        ></Input>           
                    </div>
                    <div className="input-group">
                        <Input name="Slab" 
                        type="number"
                        placeholder="Slab"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "80px"}}
                        ></Input>            
                    </div>
                    <div className="input-group">
                        <Input name="CB" 
                        type="number"
                        placeholder="CB"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "80px"}}
                        ></Input>            
                    </div>
                    <div className="input-group">
                        <Input name="Girder" 
                        type="number"
                        placeholder="Girder"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "80px"}}
                        ></Input>            
                        </div>
                    <div className="input-group">
                        <Input name="Span" 
                        type="number"
                        placeholder="서브 스팬 수"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "80px"}}
                        ></Input>            
                    </div>
                    <div className="input-group">
                        <Input name="Diaphragm" 
                        type="number"
                        placeholder="Diaphragm"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "100px"}}
                        ></Input>            
                    </div>
                    <div className="input-group">
                        <Input name="Cam" 
                        type="number"
                        placeholder="카메라 촬영횟수"
                        onChange={(e) => handleMemberChange(member.id, e)}
                        style={{marginRight: "8px", width: "100px"}}
                        ></Input>            
                    </div>    
                    {
                        bridgeInfo.length > 1 && (
                        <MinusCircleOutlined onClick={()=> {removeMemberRow(member.id)}} style={{marginTop: "10px"}}/>
                    )}

                    <PlusCircleOutlined onClick={() => {addMemberRow()}} style={{marginTop: "10px" , marginLeft: "10px"}}/>                
                </div>
                ))}
                </Form.Item>
                <Form.Item className={styles.submitBtn}>
                    <Button type="primary" htmlType='submit' onClick={submitClick1} className={styles.submitBtn2} > Submit</Button>
                </Form.Item>
        </Form>
            <Form>
                {/* <Form.Item className={styles.submitBtn}>
                    <Button type="primary" htmlType='submit' onClick={submitClick1} className={styles.submitBtn2} > Submit</Button>
                </Form.Item> */}
            </Form></div>
        //  style={{float: "right"}}
  )
}
