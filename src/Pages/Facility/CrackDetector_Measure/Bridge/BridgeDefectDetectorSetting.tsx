import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { API_URL } from '../../../../Store/Global';
import { Button, Form, Select, Table, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

const { Option } = Select;

//Tabel에 보이는 이미지 목록 interface
interface ImgName {
    no : number
    name : string
}

//균열 검출 실행 tasks명
interface DetectorList {
    input_folder : string
    output_folder : string
    choice_weight : string
}

export default function BridgeDefectDetectorSetting() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let project_id : string | null = localStorage.getItem("project_id")
    let token : string | null = localStorage.getItem("token") 

    type ModelList = string;

    const { Column } = Table;

    const ImgName : ImgName[] = [];  
    const DefectDetectorList : DetectorList[] = [];

    const [ImgList, setImgList] = useState<any | undefined>([]);  

    const [NewDefectDetectorList, setNewDefectDetectorList] = useState<any[]>(DefectDetectorList);

    const [CheckBox, setCheckBox] = useState(1);

    const [typeArr, setType]=useState([])

    const [result, setResult] = useState<boolean>(false)

    const [BridgeType, setBridgeType]=useState<string>();

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

    useEffect(()=> {
        setResult(false)

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`},
        }).then((res) => {
            const settings : any = JSON.parse(res.data.data.settings)
            setType(settings.bridge_type)

                //결함 검출 코드
                if(BridgeType === "Pier" ){
                    for(let i = 0; i < settings.pier_count; i++){
                        DefectDetectorList.push({
                            input_folder : `stage4/${BridgeType}/P${settings.pier_number_list[i].num.length === 2 ? settings.pier_number_list[i].num : "0"+settings.pier_number_list[i].num}`,
                            output_folder: `stage6_defect/${BridgeType}`,
                            choice_weight : "./Metadata/009_0122.h5"
                        })

                    axios({
                        method: 'get',
                        url: API_URL+'/file/files',
                        headers: { "accept": `application/json`, "access-token": `${token}` },
                        params: {
                                // path: `/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`
                                path: `/project/${project_id}/stage4/${BridgeType}/P${settings.pier_number_list[i].num.length === 2 ? settings.pier_number_list[i].num : "0"+settings.pier_number_list[i].num}`
                            }
                        }).then((res) => {
                            
                            for (let y = 0; y < res.data.data.files.length; y++) {
                                ImgName.push({
                                    no : ImgName.length,
                                    name : res.data.data.files[y]
                                })            
                            }

                            ImgName.sort((obj1, obj2) => {
                                if (obj1.name > obj2.name) {
                                    return 1;
                                }
                                if (obj1.name < obj2.name) {
                                    return -1;
                                }
                                return 0;
                            })                                

                            let copyArrImgList = [...ImgName];
                            
                            if(BridgeType === "Pier"){
                                if(ImgName.length === settings.pier_count * settings.pier_film_count){
                                    setResult(true);

                                    for(let j = 0; j < ImgName.length; j++){
                                        copyArrImgList[j] = { ...copyArrImgList[j], no : j+1};
                                    }
                                }
                            }
                            setImgList(copyArrImgList)
                        })
                    }
                }    
                if(BridgeType === "Girder" || BridgeType === "Slab" || BridgeType === "GirderSide"){
                    for(let i = 0; i < settings.span_count; i++){
                        for(let k = 0; k < settings.span_length/settings.span_class_length; k++){
                            DefectDetectorList.push({
                                input_folder : `stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`,
                                output_folder: `stage6_defect/${BridgeType}`,
                                choice_weight : "./Metadata/009_0122.h5"
                            })

                            // DefectMeasure.push({
                            //     input_folder : `stage6_defect/${BridgeType}`,
                            //     output_folder: `stage6_defect/${BridgeType}`,
                            // })

                        // console.log(`/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`)

                        axios({
                            method: 'get',
                            url: API_URL+'/file/files',
                            headers: { "accept": `application/json`, "access-token": `${token}` },
                            params: {
                                    path: `/project/${project_id}/stage4/${BridgeType}/S${settings.span_number_list[i].num.length === 2 ? settings.span_number_list[i].num+"0"+(k+1) : "0"+settings.span_number_list[i].num+"0"+(k+1)}`
                                }
                            }).then((res) => { 
                                for (let y = 0; y < res.data.data.files.length; y++) {

                                    // console.log(res.data.data.files)

                                    ImgName.push({
                                        no : ImgName.length,
                                        name : res.data.data.files[y]
                                    })            
                                }

                                ImgName.sort((obj1, obj2) => {
                                    if (obj1.name > obj2.name) {
                                        return 1;
                                    }
                                    if (obj1.name < obj2.name) {
                                        return -1;
                                    }
                                    return 0;
                                })                                

                                let copyArrImgList = [...ImgName];

                                if(BridgeType === "Girder"){
                                    if(ImgName.length === settings.girder_count * settings.span_length/settings.span_class_length * settings.span_count * settings.girder_camera_count){
                                        setResult(true);

                                        for(let j = 0; j < ImgName.length; j++){
                                            copyArrImgList[j] = { ...copyArrImgList[j], no : j+1};
                                        }
                                    }
                                }else if(BridgeType === "Slab"){
                                    if(ImgName.length === settings.slab_count * settings.span_length/settings.span_class_length * settings.span_count){
                                        setResult(true);

                                        for(let j = 0; j < ImgName.length; j++){
                                            copyArrImgList[j] = { ...copyArrImgList[j], no : j+1};
                                        }
                                    }
                                }else if(BridgeType === "GirderSide"){
                                    if(ImgName.length === settings.span_length / settings.span_class_length * settings.span_count){
                                        setResult(true);

                                    for(let j = 0; j < ImgName.length; j++){
                                        copyArrImgList[j] = { ...copyArrImgList[j], no : j+1};
                                    }
                                    }
                                }
                                setImgList(copyArrImgList)
                            })
                        }
                    }
                }             
        }).catch((err) => {
            console.log(err);
        });
        setNewDefectDetectorList(DefectDetectorList);
    }, [BridgeType])

        //체크박스 값 변경될 때 호출되는 함수
    const onChange = (e: RadioChangeEvent) => {
        setCheckBox(Number(e.target.value));
    
        let copyArrDetectorList = [...NewDefectDetectorList];
    
    
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
    
            if(e.target.value===1){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>교량 1</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 300</p>
                        <p>LR : 0.0005</p>
                        <p>......</p>
                    </div>
                )
    
                for(let i = 0; i < 2 * settings.girder_count * settings.span_length/settings.span_class_length; i++){
                    copyArrDetectorList[i] = { ...copyArrDetectorList[i], choice_weight : "./Metadata/009_0122.h5"};
                    setNewDefectDetectorList(copyArrDetectorList)
                }
            }
        }).catch((err) => {
            console.log(err);
        })
    };

    const [ModelData, setModelData] = useState<any | undefined>(
        <Radio.Group optionType="button">
            <Radio value={1} onChange={onChange}>교량 1</Radio>
            <Radio value={2} onChange={onChange} disabled>교량 2</Radio>
        </Radio.Group>
    ); 

    const [WeightData, setWeightData] = useState<any | undefined>(
        <div>
            <p style={{fontSize:"20px", fontWeight:"bold"}}>교량 1</p>
            <p style={{fontSize:"25px"}}>Mask RCNN</p>
            <p>Epoch : 300</p>
            <p>LR : 0.0005</p>
            <p>......</p>
        </div>
    );

    const onChangeModel = (value: ModelList) => {
        if(value==="1"){
            setModelData(
                <Radio.Group optionType="button">
                <Radio value={1} onChange={onChange}>교량 1</Radio>
                <Radio value={2} onChange={onChange} disabled>교량 2</Radio>
            </Radio.Group>
            )
        }
    }

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let resultDefectDetector :any;
    const Defectconfirm = () => {
        axios({
            method: "post",
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }
                  }).then((res) => {
                // console.log(res)
                if (res.data.check === true) {
                    console.log("성공")
                    if (res.data.data.status === "done") {
                        alert("결함 검출 작업이 끝났습니다.")
                        clearInterval(resultDefectDetector)
                    } else if (res.data.data.status === "progress") {
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                } else {
                    console.log("실패")
                }
            })
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////

    const DetectStart = () => {
        alert("교량 결함 검출 작업이 시작되었습니다. 잠시만 기다려주세요.")
        setTimeout(function() {
            alert("결함 검출이 완료되었습니다.")
        }, 2000);
    }

    const onChangeBridgeType = (e:any) => {
        console.log(e)
        if(e === "Girder"){
            setBridgeType("Girder")
        }else if(e === 'GirderSide'){
            setBridgeType("GirderSide")
        }else if(e === "Slab"){
            setBridgeType("Slab")
        }else if(e === "Slab_Side"){
            setBridgeType("Slab_Side")
        }else if(e === "Pier"){
            setBridgeType("Pier")
        }else if(e === "Abutment"){
            setBridgeType("Abutment")
        }
    }

    const option_render=()=>{
        const arr: any[] = [];
        typeArr.map((type:any)=>{
                let name=''
            if (type === 'Girder') {
                name = '거더 하면'
            } else if(type==='GirderSide'){
                    name='거더 측면'
            }else if(type==='Slab'){
                name='슬라브 하면'
            } else if (type === 'Slab_Side') {
                name = '슬라브 측면'
            } else if (type === 'Pier') {
                name ='교각'
            } else if (type === 'Abutment') {
                name = '교대'
            }
                arr.push(<Option value={type}> {name}</Option>)
            })
        return arr;
    }

    return (
        <div>
            <div style={{ width: "50em", margin: "0 auto" }}>
                <br/>        
                <p style={{fontSize:"25px"}}>{t.dmDefectDetector}</p>
                <br/>
                <Form labelCol={{ span: 0, }} wrapperCol={{ span: 10, }} layout="horizontal">
                    <Form.Item label={t.cnChoiceModel}>
                        <Select defaultValue="1" onChange={onChangeModel}>
                            <Select.Option value="1">Defect Detector TF1.x</Select.Option>
                            <Select.Option value="2" disabled>Defect Detector TF1.x</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
                <div>
                    {t.cnChoiceWeight} : {""} {ModelData}
                </div>
                <br/>
                <br/>
                <div> {WeightData} </div>
            </div>
                <br />
                <br />
            <div style={{ width: "50em", margin: "0 auto" }}>
                <p style={{color:"red"}}>교량의 부재별로 검출 시작 버튼을 각각 눌러야합니다.</p>
                <p style={{fontSize:"20px", fontWeight:"bold"}}>{t.dmDetectorList}</p>
                <div>
                    <Select className={styles.BridgeDiv} onChange={onChangeBridgeType} placeholder="선택해주세요">
                        {option_render()}
                    </Select>
                </div> 
                <Table dataSource={result === true ? ImgList:""}>
                    <Column title="num" dataIndex="no" key="no" />
                    <Column title="name" dataIndex="name" key="name" />
                </Table>
            </div>

            <div style={{ float: "right", marginRight: "10px" }}>
                <Button style={{ width: "150px" }} onClick={DetectStart}>{t.start}</Button>
            </div>
        </div>
    )
}
