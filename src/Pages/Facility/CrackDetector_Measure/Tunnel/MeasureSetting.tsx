import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { Button, Form, Select, Table, Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';
import { API_URL } from '../../../../Store/Global';

interface ImgName {
    no : Number
    name : string
}

interface MeasureListTF1 {
    input_folder : string
    crack_image_folder : string
    output_folder : string
}

interface MeasureListTF2 {
    input_folder : string
    crack_image_folder : string
    output_folder : string
    choice_weight : string
}


export default function MeasureSetting() {
    

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let project_id : string | null = localStorage.getItem("project_id")
    let token : string | null = localStorage.getItem("token") 

    // const [detectorTask, setDetectorTask] = useState<any>([])

    const MeasureListTF1 : MeasureListTF1[] = [];
    const MeasureListTF2 : MeasureListTF2[] = [];
    const SpanDist :any[] = [];

    const [NewMeasureListTF1, setNewMeasureListTF1] = useState<any[]>(MeasureListTF1);
    const [NewMeasureListTF2, setNewMeasureListTF2] = useState<any[]>(MeasureListTF2);

    SpanDist.push({
        input_folder : "stage6_2"
    })

    const ImgName : ImgName[] = [];                                          
    const [ImgList, setImgList] = useState<any | undefined>([]);    

    const [result, setResult] = useState<boolean>(false)
    const [choiceModel, setchoiceModel] = useState<string>("TF1")

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


    
    const onChange = (e: RadioChangeEvent) => {
        // console.log(e.target.value);
        setCheckBox(Number(e.target.value));

        let copyArrMeasureListTF1 = [...NewMeasureListTF1];
        let copyArrMeasureListTF2 = [...NewMeasureListTF2];

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
            if(e.target.value===1){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>dongtan</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 1000</p>
                        <p>LR : 0.0001</p>
                        <p>batch_size : 100</p>
                        <p>optimizer : Gradient Descent</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrMeasureListTF1[i] = { ...copyArrMeasureListTF1[i]};
        
                    setNewMeasureListTF1(copyArrMeasureListTF1)
                }
            }else if(e.target.value===2){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>hangil</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 1000</p>
                        <p>LR : 0.0001</p>
                        <p>batch_size : 100</p>
                        <p>optimizer : Gradient Descent</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrMeasureListTF1[i] = { ...copyArrMeasureListTF1[i]};
        
                    setNewMeasureListTF1(copyArrMeasureListTF1)
                }
            }else if(e.target.value===5){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>dongtan tf2</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 1000</p>
                        <p>LR : 0.0001</p>
                        <p>batch_size : 100</p>
                        <p>optimizer : Gradient Descent</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrMeasureListTF2[i] = { ...copyArrMeasureListTF2[i], choice_weight : "measure_model"};
        
                    setNewMeasureListTF2(copyArrMeasureListTF2)
                }
            }else if(e.target.value===6){
                setWeightData(
                    <div>
                        <p style={{fontSize:"20px", fontWeight:"bold"}}>hwagok_weight_0321</p>
                        <p style={{fontSize:"25px"}}>Mask RCNN</p>
                        <p>Epoch : 1000</p>
                        <p>LR : 0.0001</p>
                        <p>batch_size : 100</p>
                        <p>optimizer : Gradient Descent</p>
                    </div>
                )
                for(let i = 0; i < settings.spanCount; i++){
                    copyArrMeasureListTF2[i] = { ...copyArrMeasureListTF2[i], choice_weight : "test_measure_model"};
        
                    setNewMeasureListTF2(copyArrMeasureListTF2)
                }
            }     
        }).catch((err) => {
            console.log(err);
        })



    };

    const [ModelData, setModelData] = useState<any | undefined>(
        <Radio.Group optionType="button">
            <Radio value={1} onChange={onChange}>dongtan</Radio>
            <Radio value={2} disabled onChange={onChange}>hangil</Radio>
        </Radio.Group>
    ); 

    const [WeightData, setWeightData] = useState<any | undefined>(
        <div>
            <p style={{fontSize:"20px", fontWeight:"bold"}}>dongtan</p>
            <p style={{fontSize:"25px"}}>Mask RCNN</p>
            <p>Epoch : 1000</p>
            <p>LR : 0.0001</p>
            <p>batch_size : 100</p>
            <p>optimizer : Gradient Descent</p>
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
            // console.log(settings.spanCount)

            for(let i = 1; i < settings.spanCount + 1; i++){
                MeasureListTF1.push({
                    // input_folder : `stage4/S00${i}`,
                    // crack_image_folder : `stage6_2/S00${i}`,
                    input_folder : `stage4/S${String(i).padStart(3,"0")}`,
                    crack_image_folder : `stage6_2/S${String(i).padStart(3,"0")}`,
                    output_folder : "stage7"
                })

                MeasureListTF2.push({
                    // input_folder : `stage4/S00${i}`,
                    // crack_image_folder : `stage6_2/S00${i}`,
                    input_folder : `stage4/S${String(i).padStart(3,"0")}`,
                    crack_image_folder : `stage6_2/S${String(i).padStart(3,"0")}`,
                    output_folder : "stage7",
                    choice_weight : "measure_model"
                })
            }

            setNewMeasureListTF1(MeasureListTF1)
            setNewMeasureListTF2(MeasureListTF2)

            axios({
                method: 'get',
                url: API_URL+'/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params: {
                        path: `/project/${project_id}/stage6`
                    }
                }).then((res) => {    
                    
                    for (let j = 0; j < res.data.data.files.length; j++) {
                        ImgName.push({
                            no : j + 1,
                            name : res.data.data.files[j]
                        })            
                }
                setImgList(ImgName)
                if(ImgName.length > 0){
                    setResult(true);
                }

                }).catch((err) => {
                    console.log(err)
                })

        }).catch((err) => {
            console.log(err);
        });   
    },[])

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let resultCrackMeasure :any;
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
                if (res.data.check == true) {
                    console.log("성공")
                    if (res.data.data.status === "done") {
                        alert("균열 측정 작업이 끝났습니다.")
                        // setTask([])
                        clearInterval(resultCrackMeasure)
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


    const MeasureStart = () => {
        // console.log(choiceModel)
        // console.log(NewMeasureListTF1)
        // console.log(NewMeasureListTF2)
        alert("균열 측정 작업 중입니다.")
        setTimeout(function() {
            alert("균열 측정 작업이 완료되었습니다.")
          }, 2000);

        // if(choiceModel === "TF1"){
        //     console.log(NewMeasureListTF1)
        //     axios({
        //         method: "post",
        //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //         headers: {
        //           "accept": `application/json`,
        //           "access-token": `${token}`,
        //           "Content-Type": `application/json`
        //         },
        //             data: {
        //                 project_id: project_id,
        //                 task_name: "span_dist",
        //                 interactive: false,
        //                 tasks: SpanDist
        //             }
        //         }).then((res)=>{
        //             if (res.data.check === true) {
        //                 console.log("성공") 
        //                 alert("균열 검출 작업 시작")
                        
        //                     axios({
        //                         method: "post",
        //                         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                         headers: {
        //                           "accept": `application/json`,
        //                           "access-token": `${token}`,
        //                           "Content-Type": `application/json`
        //                         },
        //                         data: {
        //                             project_id: project_id,
        //                             task_name: "crack_measure",
        //                             interactive: false,
        //                             tasks: NewMeasureListTF1
        //                         }
        //                     }).then((res)=>{
        //                         if (res.data.check === true) {
        //                             console.log("성공")  
        //                             // console.log(NewMeasureListTF1, "1111111111111111111") 
        //                             job_id = res.data.data.job_id
        //                             /////30초마다 alert로 알려줌////////////
        //                             resultCrackMeasure = setInterval(confirm, 30000)             
        //                         } else {
        //                             console.log("실패")
        //                         }
        //                     }).catch((err) => {
        //                         console.log(err);
        //                     });


        //             } else {
        //                 console.log("실패")
        //             }
        //         }).catch((err) => {
        //             console.log(err);
        //         });
        // }else if(choiceModel === "TF2"){
        //     console.log(NewMeasureListTF2)
        //     axios({
        //         method: "post",
        //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //         headers: {
        //           "accept": `application/json`,
        //           "access-token": `${token}`,
        //           "Content-Type": `application/json`
        //         },
        //         data: {
        //             project_id: project_id,
        //             task_name: "span_dist",
        //             interactive: false,
        //             tasks: SpanDist
        //         }
        //     }).then((res)=>{
        //         if (res.data.check === true) {
        //             console.log("성공") 
                    
        //                 axios({
        //                     method: "post",
        //                     url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
        //                     headers: {
        //                       "accept": `application/json`,
        //                       "access-token": `${token}`,
        //                       "Content-Type": `application/json`
        //                     },
        //                     data: {
        //                         project_id: project_id,
        //                         task_name: "crack_measure_tf2",
        //                         interactive: false,
        //                         tasks: NewMeasureListTF2
        //                     }
        //                 }).then((res)=>{
        //                     if (res.data.check === true) {
        //                         console.log("성공")  
        //                         // console.log(NewMeasureListTF2, "22222222222222222222")              
        //                         job_id = res.data.data.job_id
        //                         /////30초마다 alert로 알려줌////////////
        //                         resultCrackMeasure = setInterval(confirm, 30000)
        //                     } else {
        //                         console.log("실패")
        //                     }
        //                 }).catch((err) => {
        //                     console.log(err);
        //                 });


        //         } else {
        //             console.log("실패")
        //         }
        //     }).catch((err) => {
        //         console.log(err);
        //     });
        // }
    }

    const onChangeModel = (value: ModelList) => {
            if(value==="1"){
                setModelData(
                    <Radio.Group optionType="button">
                        <Radio value={1} onChange={onChange}>dongtan</Radio>
                        <Radio value={2} disabled onChange={onChange}>hangil</Radio>
                    </Radio.Group>
                )
                setchoiceModel("TF1")
            }else if(value==="2"){
                setModelData(
                    <Radio.Group optionType="button">
                        <Radio value={5} onChange={onChange}>dongtan</Radio>
                        <Radio value={6} onChange={onChange}>hwagok</Radio>
                    </Radio.Group>
                )
                setchoiceModel("TF2")
            }
    }

    return (
    <div>
        <div className={styles.DivArea}>
        <div>
            <p className={styles.subOrder}>{t.cnCrackDetectorMeasure} &gt; {t.cnMeasureSetting}</p>
            <p className={styles.mainOrder}>{t.cnMeasureSetting}</p>
        </div>
        <div style={{ width: "50em", margin: "0 auto" }}>
            <Form labelCol={{ span: 0, }} wrapperCol={{ span: 10, }} layout="horizontal">
            <Form.Item label={t.cnChoiceModel}>
                <Select defaultValue="1" onChange={onChangeModel}>
                    <Select.Option value="1">Crack Measure TF1.x</Select.Option>
                    <Select.Option value="2">Crack Measure TF2.x</Select.Option>
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
            <p style={{fontSize:"20px", fontWeight:"bold"}}>{t.cnMeasureSetting}</p>
            {/* <Table dataSource={ImgList}> */}
            <Table dataSource={result === true ? ImgList:""}>
                <Column title="num" dataIndex="no" key="no" />
                <Column title="name" dataIndex="name" key="name" />
            </Table>
            </div>

            <div style={{ float: "right", marginRight: "10px" }}>
                <Button style={{ width: "150px" }} onClick={MeasureStart}>{t.start}</Button>
            </div>
        </div>
    </div>
    )
}
