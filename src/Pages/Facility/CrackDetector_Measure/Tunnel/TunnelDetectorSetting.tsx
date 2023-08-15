import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { Button, Form, Select, Table, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { API_URL } from '../../../../Store/Global';

//Tabel에 보이는 이미지 목록 interface
interface ImgName {
  no : string
  name : string
}

//균열 검출 실행 tasks명
interface DetectorList {
  input_folder : string
  output_folder : string
  choice_weight : string
}

//Span을 나누기 위한 작업(stage6를 복사해서 stage6_2)
interface Copy {
  input_folder : string;
  output_folder : string;
}

export default function TunnelDetectorSetting() {
  const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let project_id : string | null = localStorage.getItem("project_id")
    let token : string | null = localStorage.getItem("token") 

    const ImgName : ImgName[] = [];  
    const DetectorList : DetectorList[] = [];
    const folder_copy : Copy [] = [];

    //균열 검출 후 Measure에 사용하기 위해 Span 분류를 위한 폴더 복사 tasks
    folder_copy.push({
        input_folder: "stage6",
        output_folder: "stage6_2"
    })                                   

    //useEffect에서 stage4의 파노라마 이미지를 불러와서 Table에 사용
    const [ImgList, setImgList] = useState<any | undefined>([]);    
    //ImgList에 불러온 목록이 카메라 개수 * 스팬 개수와 동일하면 true로 반환 후, true일 때 Table을 그림
    const [result, setResult] = useState<boolean>(false)

    //균열 검출을 실행하기 위한 tasks를 Weight가 변경될 때 함께 복사하여 변경하고 새롭게 세팅하기 위함
    const [NewDetectorList, setNewDetectorList] = useState<any[]>(DetectorList);
    //새롭게 할당할 Weight 파일명
    const [DetectorModel, setDetectorModel] = useState<string>("crack_detector_tf1");
    //현재 체크되어 있는 체크박스(Weight => 현재 옵션은 버튼으로 설정되어 있음(checkbox X))
    const [CheckBox, setCheckBox] = useState(1);

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




    //체크박스 값 변경될 때 호출되는 함수
    const onChange = (e: RadioChangeEvent) => {
        setCheckBox(Number(e.target.value));
        // console.log(e.target.value, typeof e.target.value);

        let copyArrDetectorList = [...NewDetectorList];

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
            if(e.target.value===1){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>dongtan_weight_0109</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 300</p>
                        <p>LR : 0.0005</p>
                        <p>batch_size : 1</p>
                        <p>optimizer : Adam</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrDetectorList[i] = { ...copyArrDetectorList[i], choice_weight : "Save_point/iteration_916.ckpt"};
        
                    setNewDetectorList(copyArrDetectorList)
                }
            }else if(e.target.value===2){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>hangil_weight_1221</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 300</p>
                        <p>LR : 0.0005</p>
                        <p>batch_size : 1</p>
                        <p>optimizer : Adam</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrDetectorList[i] = { ...copyArrDetectorList[i], choice_weight : "Save_point/iteration_4880.ckpt"};
        
                    setNewDetectorList(copyArrDetectorList)
                }
            }else if(e.target.value===5){
                        setWeightData(
                            <div>
                                <p style={{fontSize:"20px", fontWeight:"bold"}}>hwagok_weight_0222</p>
                                <p style={{fontSize:"25px"}}>Mask RCNN</p>
                                <p>Epoch : 300</p>
                                <p>LR : 0.0005</p>
                                <p>batch_size : 1</p>
                                <p>optimizer : Adam</p>
                            </div>
                        )
                        for(let i = 0; i < settings.spanCount; i++){
                            copyArrDetectorList[i] = { ...copyArrDetectorList[i], choice_weight : "Save_point/model_150"};
                
                            setNewDetectorList(copyArrDetectorList)
                        }
            }else if(e.target.value===6){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>hwagok_weight_0321</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 50</p>
                        <p>LR : 0.0001</p>
                        <p>batch_size : 1</p>
                        <p>optimizer : Adam</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrDetectorList[i] = { ...copyArrDetectorList[i], choice_weight : "Save_point/model_298"};
        
                    setNewDetectorList(copyArrDetectorList)
                }
            }
                
        }).catch((err) => {
            console.log(err);
        })
    };

    const [ModelData, setModelData] = useState<any | undefined>(
        <Radio.Group optionType="button">
            <Radio value={1} onChange={onChange}>dongtan</Radio>
            <Radio value={2} onChange={onChange}>hangil</Radio>
        </Radio.Group>
    ); 

    const [WeightData, setWeightData] = useState<any | undefined>(
        <div>
            <p style={{fontSize:"20px", fontWeight:"bold"}}>dongtan_weight_0109</p>
            <p style={{fontSize:"25px"}}>Mask RCNN</p>
            <p>Epoch : 300</p>
            <p>LR : 0.0005</p>
            <p>batch_size : 1</p>
            <p>optimizer : Adam</p>
        </div>
    );

    type ModelList = string;

    const { Column } = Table;

    useEffect(()=>{
        const response = axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
            console.log(settings.spanCount);
            // console.log(settings.cameraCount * settings.spanCount);
            
            for(let i = 1; i <= settings.spanCount; i++){
                DetectorList.push({
                    // input_folder : `stage4/S00${i}`,
                    input_folder : `stage4/S${String(i).padStart(3,"0")}`,
                    output_folder : "stage6",
                    choice_weight : "Save_point/iteration_916.ckpt"
                })
            }

            for(let i = 1; i <= settings.spanCount; i++){ //여기
            axios({
                method: 'get',
                url: API_URL+'/file/files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params: {
                        // path: `/project/${project_id}/stage4/S00${i}`
                        path: `/project/${project_id}/stage4/S${String(i).padStart(3,"0")}`
                    }
                }).then((res) => {    
                    for (let j = 0; j < res.data.data.files.length; j++) {
                        ImgName.push({
                            no : "Span" + i,
                            name : res.data.data.files[j]
                        })            
                }
                
                ImgName.sort((obj1, obj2) => {
                    if (obj1.no > obj2.no) {
                        return 1;
                    }
                    if (obj1.no < obj2.no) {
                        return -1;
                    }
                    return 0;
                    })
                setImgList(ImgName)
                console.log(ImgName)
                if(ImgName.length === settings.cameraCount * settings.spanCount){

                    setResult(true);
                }

                }).catch((err) => {

                    console.log(err)
                })
            }       
        }).catch((err) => {
            console.log(err);
        });   
        
        setNewDetectorList(DetectorList);
    },[])

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let resultCrackDetector :any;
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
                    console.log("성공")
                    if (res.data.data.status === "done") {
                        alert("균열 검출 작업이 끝났습니다.")
                        // setTask([])
                        clearInterval(resultCrackDetector)
                        window.location.href='../CrackDetector_Measure/CrackDetector'
                    } else if (res.data.data.status === "progress") {
                        // alert("이미지 추출중입니다.")
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
        console.log(DetectorModel);
        console.log(NewDetectorList);
        alert("균열 검출 작업 중입니다.")
        setTimeout(function() {
            alert("균열 검출 작업이 완료되었습니다.")
          }, 2000);
        // axios({
        //     method: "post",
        //     url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //     headers: {
        //       "accept": `application/json`,
        //       "access-token": `${token}`,
        //       "Content-Type": `application/json`
        //     },
        //     data: {
        //         project_id: project_id,
        //         task_name: DetectorModel,
        //         interactive: false,
        //         tasks: NewDetectorList
        //     }
        // }).then((res)=>{
        //     if (res.data.check === true) {
        //         console.log("성공")  
        //         alert("균열 검출 작업 시작")   
                
        //         axios({
        //         method: "post",
        //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //         headers: {
        //             "accept": `application/json`,
        //             "access-token": `${token}`,
        //             "Content-Type": `application/json`
        //         },
        //         data: {
        //             project_id: project_id,
        //             task_name: "copy_folder",
        //             interactive: false,
        //             tasks: folder_copy
        //         }
        //         }).then((res)=>{
        //             if (res.data.check === true) {
        //                 console.log("성공")    
        //                 job_id = res.data.data.job_id
        //                 /////30초마다 alert로 알려줌////////////
        //                 resultCrackDetector = setInterval(confirm, 30000)
        //                 // alert("lean_mean 작업")            
        //             } else {
        //                 console.log("실패")
        //             }
        //         }).catch((err) => {
        //             console.log(err);
        //         });
        //     } else {
        //         console.log("실패")
        //     }
        // }).catch((err) => {
        //     console.log(err);
        // });
    }

    const onChangeModel = (value: ModelList) => {
            if(value==="1"){
                setModelData(
                    <Radio.Group optionType="button">
                        <Radio value={1} onChange={onChange}>dongtan</Radio>
                        <Radio value={2} onChange={onChange}>hangil</Radio>
                    </Radio.Group>
                )
                setDetectorModel("crack_detector_tf1")
            }else{
                setModelData(
                    <Radio.Group optionType="button">
                        <Radio value={5} onChange={onChange}>hwagok1</Radio>
                        <Radio value={6} onChange={onChange}>hwagok2</Radio>
                    </Radio.Group>
                )
                setDetectorModel("crack_detector_tf2")
            }
    }

    return (
    <div>
        <div className={styles.DivArea}>
        <div>
            <p className={styles.subOrder}>{t.cnCrackDetectorMeasure} &gt; {t.cnDetectorSetting}</p>
            <p className={styles.mainOrder}>{t.cnDetectorSetting}</p>
        </div>

        <div style={{ width: "50em", margin: "0 auto" }}>
            <Form labelCol={{ span: 0, }} wrapperCol={{ span: 10, }} layout="horizontal">
            <Form.Item label={t.cnChoiceModel}>
                <Select defaultValue="1" onChange={onChangeModel}>
                    <Select.Option value="1">Crack Detecotr TF1.x</Select.Option>
                    <Select.Option value="2">Crack Detecotr TF2.x</Select.Option>
                </Select>
            </Form.Item>
            </Form>
            <div>
                {t.cnChoiceWeight} : {""} {ModelData}
            </div>
            <br/>
            <br/>
            <div>
                {WeightData}
            </div>
        </div>
        
        <br />
        <br />

            <div style={{ width: "50em", margin: "0 auto" }}>
            <p style={{fontSize:"20px", fontWeight:"bold"}}>{t.cnDetectorList}</p>
            {/* <Table dataSource={ImgList}> */}
            <Table dataSource={result === true ? ImgList:""}>
                <Column title="num" dataIndex="no" key="no" />
                <Column title="name" dataIndex="name" key="name" />
            </Table>
            </div>

            <div style={{ float: "right", marginRight: "10px" }}>
                <Button style={{ width: "150px" }} onClick={DetectStart}>{t.start}</Button>
            </div>
        </div>
    </div>
    )
}
