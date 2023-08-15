import React, { useEffect, useState } from 'react'
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css'
import { Button, Form, Input, Select, Checkbox, Progress } from "antd";
import { API_URL } from '../../../../Store/Global';
import axios from 'axios';


interface uploadProgress {
    id: string; // 파일들의 고유값 id
    status: any;
}



const { Option } = Select;
export default function BridgeEstimatorSetting() {
  let token: string | null = localStorage.getItem("token");
  let settings: any = [];
  let job_id = 0;
  const project_id = localStorage.getItem("project_id");
  const [title, setTitle] = useState("");
  const [check, setCheck] = useState(false);
    
  const [typeArr, setType] = useState([])
  const [BridgeType, setBridgeType] = useState<string>("Girder");
  const [bridge_type_name, setBridgeTypeName] = useState<string>("")
  const [clickImage, setClickImage] = useState<uploadProgress[]>([])
  const [confirmUploadImg, setConfirmUploadImg] = useState({
            1: false,
            2: false,
            3: false,
            4: false,
            5:false,
            6:false,
            7: false,
            8: false,
            9: false
  });
  
  const [max_width, setMax_width] = useState(0)
  const [gradeConf, setGradeConf] = useState({
    max_width: 0,
    slab_area: "",
    girder_area: "",
    pier_area: "",
    bridgeType:""
  })
  const [state, setState] = useState({
    BridgeType:BridgeType,    
    writer: "", //작성자
    BridgeName: "", //교량이름
    year1:"",  //안전진단 세부지침년도
    location:"", //위치
    bridge_width: false, //교량 너비
    bridge_length:0, //교량 길이
    road:"",  // 차선수
    route_name:"",  // 노선명
    span_length:0, // 스팬 길이
    pass_height:0, //통과 높이
    year2:"", //준공년도
    result:"-", // 부재별 관찰 결과
    //추가
    Structure_number: 0, //시설물 번호
    Management_number: 0,//관리 번호
    form_up: "",//구조형식-상부
    form_down: "", //구조형식-하부
    basic_form_abutment: "",//기초 형식 - 교대
    basic_form_pier: "",//기초형식 -교각
    bridge_support: "", //교량 받침
    exp_joint: "",//신축이음
    cross_facility: "",//교차 시설물
    context: "", //부착시설 내용
    design_weight:""
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
    
    useEffect(()=> {
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((result) => {
          //  console.log(result)
          if (result.data.check === true) {     
              settings = JSON.parse(result.data.data.settings)
              setType(settings.bridge_type)
            console.log(settings.pier_height * settings.pier_radius*2*Math.PI, settings.pier_height,settings.pier_radius*2*Math.PI)
            setGradeConf({
              ...gradeConf,
              ['girder_area']: (settings.span_length * (settings.girder_width+settings.girderside_height)).toFixed(2),
              ['slab_area']: (settings.span_length * settings.slab_width).toFixed(2),
              ['pier_area']:(settings.pier_height * settings.pier_radius*2*Math.PI).toFixed(2)
              })
              axios({
                method: "get",
                url: API_URL + `/company/view/${result.data.data.companyId}`,
                headers: { "accept": `application/json`, "access-token": `${token}` },
              }).then((result2) => {
                console.log(result2.data.data.name)
                setState({
                  ...state,
                  ['writer']: result2.data.data.name,
                  ['BridgeName']: settings.bridge_kor,
                  ['span_length']: settings.span_length,
                  ['bridge_length']:settings.bridge_length

                })
                

              })
            }
            console.log(state)
        })
    },[])
    const handleChange = (e: any) => {
        console.log(e)
        setState({
            ...state,
            [e.target.name]:  e.target.value
        })
  }

  let arr:String[] = [];
  const onclick = (e: any) => {
    console.log(e.target.value, e)
    if (e.target.checked === true) {
      if (arr.includes(e.target.value) === false) {
        arr.push(e.target.value)
      } 
    } else {
      arr = arr.filter((a) => a !== e.target.value)
    }
    console.log(arr)
  }
   
  //30초마다 확인하는 코드
  let progress: any;
  const confirm = () => {
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
          console.log("성공",res.data.data.status)
          if (res.data.data.status === "done") {
            alert("상태평가보고서가 끝났습니다.")
            clearInterval(progress)
            window.location.href='../CrackDrawer_Estimator/ReportDownload'
          } else if (res.data.data.status === "wait") {
            axios({
              method: "get",
              url: API_URL + '/File/Files',
              headers: { "accept": `application/json`, "access-token": `${token}` },
              params : {path : `project/${project_id}/stage9/`}
            }).then((res2) => {
              console.log(res2.data.data.files.length)
            })
          } else if(res.data.data.status === "error"){
            alert("해당 파일이 없습니다.")
          }
        } else {
          console.log("실패")
        }
    })
  }

  const submitClick2 = () => {
    const result = arr.toString()
    setState({
            ...state,
            ['result']: result
        })
    // console.log(state)
    // console.log(gradeConf)
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
        task_name: "countcsv",
        interactive: false,
        tasks: [{
          input_folder: "stage8/result",
          output_folder: "stage9"
        }]
      }
    }).then((res) => {
      // console.log(res)
      if (res.data.check === true) {
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
              task_name: "estimator_bridge",
              interactive: false,
              tasks: [{
                input_folder: "stage8/result",
                input_total_csv: "stage9/TotalGrade.csv",
                input_span_csv:"stage9/SpanGrade.csv",
                input_count_csv:"stage9/countDefect.csv",
                output_folder: "stage9",
                figure_path: "stage9/figure",
                config_grade_name: "grade.conf",
                config_grade_folder: "stage9",
                config_grade_values: gradeConf,
                conf_setup_name: "Setup_bridge.conf",
                conf_setup_folder:"stage9",
                conf_setup_values:state
              }]
            },
              
          }).then((res) => {
            if (res.data.check === true) {
              console.log(res)
              // job_id = res.data.data.job_id
              // progress = setInterval(confirm, 30000)
              alert("상태평가보고서 진행중입니다.")
            } else {
              console.log("실패2")
            }
          }).catch((err) => {
            console.log(err)
          })
      } else {
        console.log("실패1")
      }
    }).catch((err) => {
      console.log('1.', "err")
    })

  };
  const onChangeType = (e:any) => {
        console.log(e)
        setGradeConf({ ...gradeConf, ['bridgeType']: e })
  }
  
  
  const onImageUpload = ((e: any, file_name:string) => {
    let id = Number(e.target.id.substr(-1,1))
    let file = e.target.files[0]
    // setClickImage(file_name+file.name.substr(-4,4))
    console.log(file.name.substr(-4, 4))
    let click: uploadProgress[];
    axios({
      method: 'post',
      url: API_URL + `/file/upload/${project_id}?path=stage9_figure&filename=${file_name+file.name.substr(-4,4)}`,
      headers: { 
      "accept": `application/json`,
      "access-token": `${token}`,
      "Content-Type": `multipart/form-data`  },
      data: { upload: file },
      onUploadProgress: (progressEvent: { loaded: any; total: any }) => {
        let a = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        click  = [...clickImage]
        click.push({ id: file_name, status: <Progress type="line" percent={a} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} /> })
        // click.push({ id: file_name, status: a+'%'})
        console.log(click)
        setClickImage(click)
                   
        },
    }).then((res) => {
      if (res.data.check === true) {
        console.log("업로드 성공")
        setConfirmUploadImg({...confirmUploadImg, [id]:true})
      } else {
        console.log("실패",res)
      }
      // job_id = res.data.data.job_id
    }).catch((err) => {
      console.log(err)
    })
  })
  return (
      <div>
      <Form labelCol={{ span: 7, }} wrapperCol={{ span: 10, }} layout="horizontal" className={styles.csForm} >
              <Form.Item label="교량 이름" className={styles.csFormItem}>
                <Input value={state.BridgeName} className={styles.csFormInput} />
              </Form.Item>
              <Form.Item label="작성자" className={styles.csFormItem}>
                <Input value={state.writer} className={styles.csFormInput} />
              </Form.Item>
              <Form.Item label="시설물 번호" className={styles.csFormItem}>
                <Input name="Structure_number"className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="관리 번호" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="Management_number" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="안전진단 세부지침 년도" className={styles.csFormItem}>
                <Input placeholder=" ex) 2018" name="year1" suffix="년" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="위치" className={styles.csFormItem}>
                <Input className={styles.csFormInput} placeholder="ex) OO시 OO구 OO동"  name="location" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="설계 하중" className={styles.csFormItem}>
                <Input className={styles.csFormInput} placeholder="ex) DP-24"  name="design_weight" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="교량 너비" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="bridge_width" suffix="m" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="교량 길이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="bridge_length" suffix="m" onChange={handleChange} value={state.bridge_length} />
              </Form.Item>
              <Form.Item label="차선수" className={styles.csFormItem}>
                <Input placeholder="ex) 편도 2차로" name="road" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="노선명" className={styles.csFormItem}>
                <Input placeholder="ex) 국지도57호" name="route_name" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="경간 길이" className={styles.csFormItem}>
                <Input value={state.span_length} name="span_length" className={styles.csFormInput} suffix="m" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="통과높이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="pass_height" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="준공년월일" className={styles.csFormItem}>
                <Input placeholder="ex) 2019년 11월 4일" name="year2" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부재별관찰결과" className={styles.csFormItem}>
                <Checkbox value="균열" onClick={onclick}>균열</Checkbox>
                <Checkbox value="백태" onClick={onclick}>백태</Checkbox>
                <Checkbox value="누수" onClick={onclick}>누수</Checkbox>
                <Checkbox value="파손"onClick={onclick}>파손</Checkbox>
              </Form.Item>
              <Form.Item label="구조형식- 상부" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="form_up" onChange={handleChange}  placeholder=" ex) 프리플렉스형"/>
             </Form.Item>
             <Form.Item label="구조형식- 하부" className={styles.csFormItem}>
                <Input  className={styles.csFormInput}  name="form_down" onChange={handleChange} placeholder=" ex) 라멘식"/> 
              </Form.Item>
              <Form.Item label="기초 형식 -교대 " className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="basic_form_abutment" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="기초 형식 -교각 " className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="basic_form_pier" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="교량 받침" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="bridge_support" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="신축이음" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="exp_joint" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="교차 시설물" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="cross_facility" onChange={handleChange} placeholder=" ex) 도로, 철도, 하천"/>  
              </Form.Item>
              <Form.Item label="부착시설 내용" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="context" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="균열 실제 최대 폭" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="max_width" onChange={(e: any) => { setGradeConf({ ...gradeConf, ['max_width']: e.target.value }) }} suffix='mm'/>
              </Form.Item>  
              <Form.Item label="교량의 형태" className={styles.csFormItem}>
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeType}>
                    <Option value='GirderBridge'> 거더교</Option>
                    <Option value='SlabBridge'> 슬라브교</Option>
                    <Option value='RamenBridge'> 라멘교</Option>
                </Select>
              </Form.Item>
              <Form.Item label="사진 업로드" className={styles.ImageUploadFormItem} >
                  {/* <img src='/images/Drawer&Estimator/uploadImg.png' style={{width:'25px', marginRight:'15px',float:'left'}}/>   */}
                <div className={styles.BridgeFormItem}>
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file1" >종평면도</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "종평면도")} style={{ display: "none", float:"left"}} id="input-file1" key="1" />
                  {confirmUploadImg[1] === true ?
                    clickImage.filter((a: any) => a.id === "종평면도")[0].status :
                    <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file2">과업구간전체위치</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "과업구간전체위치")} style={{ display: "none" }} id="input-file2" key="2"/>
                  {confirmUploadImg[2] === true ? clickImage.filter((a: any) => a.id === "과업구간전체위치")[0].status :
                    <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file3">교량위치</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "교량위치")} style={{ display: "none" }} id="input-file3" key="3" />
                    {confirmUploadImg[3] === true ? clickImage.filter((a: any) => a.id === "교량위치")[0].status :
                      <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file4">와이어캠</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "와이어캠")} style={{ display: "none" }} id="input-file4" key="4"/>
                  {confirmUploadImg[4] === true ? clickImage.filter((a: any) => a.id === "와이어캠")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file5">상부전경1</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "상부전경1")} style={{ display: "none" }} id="input-file5" key="5"/>
                  {confirmUploadImg[5] === true ? clickImage.filter((a: any) => a.id === "상부전경1")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file6">상부전경2</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "상부전경2")} style={{ display: "none" }} id="input-file6" key="6"/>
                  {confirmUploadImg[6] === true ? clickImage.filter((a: any) => a.id === "상부전경2")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file7">하부전경1</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "하부전경1")} style={{ display: "none" }} id="input-file7" key="7"/>
                  {confirmUploadImg[7] === true ? clickImage.filter((a: any) => a.id === "하부전경1")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file8">하부전경2</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "하부전경2")} style={{ display: "none" }} id="input-file8" key="8"/>
                  {confirmUploadImg[8] === true ? clickImage.filter((a: any) => a.id === "하부전경2")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file9">결함도 점수 범위에 따른 기준</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "결함도 점수 범위에 따른 기준")} style={{ display: "none" }} id="input-file9" key="9"/>
                  {confirmUploadImg[9] === true ? clickImage.filter((a: any) => a.id === "결함도 점수 범위에 따른 기준")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>      
              </Form.Item>
        
                  

              <Form.Item className={styles.submitBtn}>
                <Button type="primary" htmlType='submit' onClick={submitClick2} className={styles.submitBtn2}> Submit</Button>
              </Form.Item>
          </Form>
      {/* <Button type="primary" htmlType='submit' onClick={submitClick2} className={styles.submitBtn}> Submit</Button> */}
    </div>
  )
}
