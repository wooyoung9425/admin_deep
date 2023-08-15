import React,{useEffect, useState} from 'react'
import styles from '../../../Styles/CrackDrawer_Estimator.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { Form, Radio, Button, Select,Tooltip, Dropdown, Menu, Row, Col  } from "antd";
import { UserOutlined, CheckCircleTwoTone, DownloadOutlined,DollarTwoTone } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import axios from 'axios';


// import DocViewer, { DocViewerRenderers }  from "react-doc-viewer";
const { Option } = Select;
export default function ReportDownload() {
    const [size, setSize] = useState<SizeType>('large');
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    let token: string | null = localStorage.getItem("token");
    const project_id = localStorage.getItem("project_id");
    const project_Type = localStorage.getItem("project_Type")

    const setting: any = localStorage.getItem("settings")
    let typeArr: any;
    project_Type==='Dam' ?  typeArr = JSON.parse(setting).dam_type: typeArr = JSON.parse(setting).bridge_type
    
    // 댐
    const [DamType, setDamType] = useState<string>("");
    const [dam_type_name, setDamTypeName] = useState<string>("")
    //교량
    const [BridgeType,setBridgeType] =useState<string>("")

    let docs: any;
    let a = "";
    useEffect(()=>{
       
        docs = [{uri : `${IMAGE_URL}/image?path=/project/${project_id}/stage9/demo.docx`, fileType:"docx"}]
        console.log(docs)
    })
    const download = (e : any) => {
        if (DamType === '' && project_Type==='Dam') {
            alert('댐구역을 선택해주세요')
        } else {
            if (e === "drawer") { //외관 조사망도
                console.log(e)

                let drawer_path: any;
                if (project_Type === 'Dam') {
                    // drawer_path = project_Type === 'Dam' ? `/project/${project_id}/stage8/${DamType}/` : `/project/${project_id}/stage8_CAD/`
                    drawer_path = `/project/${project_id}/stage8/${DamType}/`
                } else if (project_Type === 'Bridge') {
                    // drawer_path = `/project/${project_id}/stage8/`
                    if (BridgeType === 'Girder') {
                        drawer_path = `/project/${project_id}/stage8/${BridgeType}/`
                        
                    } else if (BridgeType === 'Pier') {
                        console.log(BridgeType)
                        drawer_path = `/project/${project_id}/stage8/${BridgeType}/`
                    }
                } else {
                    drawer_path =  `/project/${project_id}/stage8_CAD/`
                }
                console.log(drawer_path)
                axios({
                    method: "get",
                    url: API_URL + '/File/Files',
                    headers: { "accept": `application/json`, "access-token": `${token}` },
                    params: { path: drawer_path }
                }).then((res) => {
                    if (res.data.check === true) {
                        let file = ""
                        let down_file =""
                        for (file of res.data.data.files) {
                            if (file.includes('.dxf')) {
                                down_file = file
                                
                            }
                        }
                        console.log(down_file)
                        const link = document.createElement('a');
                        link.href = `${IMAGE_URL}/image?path=` + drawer_path + `${down_file}`;
                        link.setAttribute('download', 'file.dxf'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        
                    } else {
                        console.log("실패")
                    }
                })
            } else {
                let estimator_path: any;
                if (project_Type === 'Dam') {
                    // drawer_path = project_Type === 'Dam' ? `/project/${project_id}/stage8/${DamType}/` : `/project/${project_id}/stage8_CAD/`
                    estimator_path = `/project/${project_id}/stage9/${DamType}/`
                } else if (project_Type === 'Bridge') {
                        estimator_path = `/project/${project_id}/stage9/`
                } else {
                    estimator_path =  `/project/${project_id}/stage9/`
                }
                // const estimator_path=project_Type==='Dam'?`/project/${project_id}/stage9/${DamType}/`:`/project/${project_id}/stage9/`
                axios({
                    method: "get",
                    url: API_URL + '/File/Files',
                    headers: { "accept": `application/json`, "access-token": `${token}` },
                    params: { path: estimator_path }
                }).then((res) => {
                    if (res.data.check === true) {
                        let file = ""
                        let down_file = ""
                        for (file of res.data.data.files) {
                            if (file.includes('docx')) {
                                down_file=file
                            }
                        }
                        
                        const link = document.createElement('a');
                        link.href = `${IMAGE_URL}/image?path=`+estimator_path+`${down_file}`;
                        link.setAttribute('download', 'file.docx'); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        
                    } else {
                        console.log("실패")
                    }
                    
                })
            }
        }
    }
    const option_render=()=>{
        const arr: any[] = [];
        if (project_Type === 'Dam') {
            typeArr.map((type:any)=>{
                let name=''
                if(type==='Overflow'){
                    name='월류부'
                }else if(type==='DamFloor'){
                    name='댐마루'
                }else if (type === 'UpStream') {
                    name='상류면'
                } else if (type === 'DownStream') {
                    name ='비월류부'
                }
                arr.push(<Option value={type}> {name}</Option>)
            })
        } else if (project_Type === 'Bridge') {
            typeArr.map((type: any) => {
                let name = ''
                if (type === 'Girder') {
                    name = '거더 하면'
                } else if (type === 'Girder_Side') {
                    name = '거더 측면'
                } else if (type === 'Slab') {
                    name = '슬라브 하면'
                } else if (type === 'Slab_Side') {
                    name = '슬라브 측면'
                } else if (type === 'Pier') {
                    name = '교각'
                } else {
                    name ='교대'
                }
                arr.push(<Option value={type}> {name}</Option>)
            })
        }
        
        return arr;
    }
     const onChangeDamType = (e:any) => {
         console.log(e)
         if (project_Type === 'Dam') {
            if(e === "Overflow"){
                setDamType("Overflow")
                setDamTypeName("월류부")
            }else if(e === "DamFloor"){
                setDamType("DamFloor")
                setDamTypeName("댐마루")
            }else if(e === "DownStream"){
                setDamType("DownStream")
                setDamTypeName("비월류부")
            }else if(e === "UpStream"){
                setDamType("UpStream")
                setDamTypeName("상류면")
            }
         } else if (project_Type === 'Bridge') {
             if (e === 'Girder') {
                setBridgeType("Girder")
            } else if (e === 'Slab') {
                setBridgeType("Slab")
                // setBridgeTypeName("슬래브")
            } else if (e === 'UpSide') {
                setBridgeType("UpSide")
                // setBridgeTypeName("측면")
            } else if (e === 'Pier') {
                // setConfirmOption(false)
                setBridgeType("Pier")
                // setBridgeTypeName("교각")
            } else {
                setBridgeType("Abutment")
                // setBridgeTypeName("교대")
            }
        }
        
    }
    const menu1 = (
        <Menu>
            <Menu.Item style={{fontSize : "20px", fontWeight:"bold", textAlign:"center"}}>
                최종 요금
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone /> 사용 중인 요금제 : 베이직 요금제
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> 파노라마 이미지 수량 : 32장
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> 파노라마 이미지 용량 : 2.77GB
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> CPU 총 사용시간 : 1시간 3분
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> GPU 총 사용시간 : 5시간 29분
            </Menu.Item>
            <Menu.Item disabled style={{color:"black"}}>
                <CheckCircleTwoTone/> 예상 과금 : 1,056,720원
            </Menu.Item>            
        </Menu>
    )

  return (
      <div>
        <div className={styles.DivArea}>
        <div>

        <Row>
            <Col span={23}>
                <p className={styles.subOrder}>{t.csDrawerEstimator} &gt; {t.csDownload} </p> 
                <p className={styles.mainOrder}>{t.csDownload}</p>
            </Col>
            <Col span={1} style={{paddingLeft:"25px"}}>
                <Dropdown overlay={menu1}>
                    <DollarTwoTone style={{fontSize:"40px"}}/>
                </Dropdown>
            </Col>
        </Row>

        </div>  
              {project_Type === 'Dam' ?
                <div>
                    <div className={styles.DamTypeDiv}>
                        댐 구역 :
                        <Tooltip placement="right" color='#2db7f5' title="외관조사망도만 사용">
                            <Select placeholder="선택해주세요" onChange={onChangeDamType} className={styles.selectDiv}  >
                                {option_render()}
                            </Select>
                        </Tooltip>  
                    </div>
                </div>
                  : <div></div>}
               {project_Type === 'Bridge' ?
                <div>
                    <div className={styles.DamTypeDiv}>
                        교량 구역 :
                      
                        <Tooltip placement="right" color='#2db7f5' title="외관조사망도만 사용">
                            <Select placeholder="선택해주세요"  onChange={onChangeDamType} className={styles.selectDiv} >
                                {option_render()}
                            </Select>
                        </Tooltip>
                    </div>
                </div>
                : <div></div>}
        </div>
          {/* */}
        <div className={styles.downloadDiv}>
              
              <Form.Item name="radio-button"
                // label="보고서 Download"
                rules={[{ message: 'Please pick an item!', },]}
                labelCol={{ span: 7, }}
                style={{
                height: "1.5em",
                paddingLeft: "20vw"
            }}>
            <Radio.Group>
                <img src='/images/Drawer&Estimator/cadIcon2.png' style={{width:'50px', marginBottom:'10px'}} />          
                <Button type="primary" icon={<DownloadOutlined />} size={size}  onClick={()=>download("drawer")} className={styles.drawerdown}> 외관조사망도 다운로드 </Button>
                <img src='/images/Drawer&Estimator/wordIcon.png' style={{ width:'50px', marginRight:'10px', marginBottom:'10px'}} />          
                <Button type="primary" icon={<DownloadOutlined />} size={size} onClick={() => download("estimate")} > 상태평가보고서 다운로드 </Button>
                {/* <Button type="primary" icon={<FileWordOutlined />} size={size} onClick={ ()=>download("estimate")} > 상태평가보고서 다운로드 </Button> */}
            </Radio.Group>
            </Form.Item>
    </div>


          
    </div>
  )
}
