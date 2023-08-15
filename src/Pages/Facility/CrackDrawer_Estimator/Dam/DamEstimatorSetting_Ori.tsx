import React, { useEffect, useState } from 'react'
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css'
import { Button, Form, Input, Select, Checkbox,Progress } from "antd";
import { API_URL } from '../../../../Store/Global';
import axios from 'axios';
import { userState } from '../../../../Store/State/atom';

interface uploadProgress {
    id: string; // 파일들의 고유값 id
    status: any;
}

const { Option } = Select;
export default function DamEstimatorSetting() {
  let token: string | null = localStorage.getItem("token");
  let settings: any = [];
  let job_id = 0;
  const project_id = localStorage.getItem("project_id");
  const [title, setTitle] = useState("");
  const [check, setCheck] = useState(false);
    
  const [typeArr, setType] = useState([])
  const [DamType, setDamType] = useState<string>("Overflow");
  const [dam_type_name, setDamTypeName] = useState<string>("")
  
  const [clickImage, setClickImage] = useState<uploadProgress[]>([])
  const [confirmUploadImg, setConfirmUploadImg] = useState({
            1: false,
            2: false,
            3: false,
            4: false
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

  const [state, setState] = useState({
    writer: "", //작성자
    DamName: "", //댐이름
    DamNumber:"",  //시설물 번호
    year: "", // 준공년월일
    managementNum:0,//관리 번호
    location: "", //위치
    management: "-", //관리 주체
    riverName: "",//하천명
    DamType:"",//댐 형식
    dam_height: 0, //댐 높이
    dam_length: 0, //댐 길이
    dam_width:0, //댐 체적image.png
    upstreamSlope: "",  // 상류면 경사
    downstreamSlope:"",  // 하류면 경사
    reservoir:0, //총저수지 량
    effectiveReservoir:0, // 유효 저수량
    deadWater: 0, // 사수량
    floodControl:0, //홍수 조절 용량
    damTop:0, //댐 정상 표고
    plannedFloodLevel:0, //계획 홍수위
    permanentFloodLevel:0, //상시 홍수위
    limitLevel:0, //제한수위
    lowWaterLevel:0, //저수위
    designFloodLevel:"-", //갱문 형식
    form1: "", //수문 형식
    form2:"",//수문 문수
    waterGateSize:"-", // 수문 크기
    capacity:"", //시설 용량
    fall:0, //유효 낙차
    quanityUsed: "", // 사용수량
    result:""//부재별관찰결과
  });
    
    useEffect(()=> {
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((result) => {
          //  console.log(result)
          if (result.data.check === true) {     
              settings = JSON.parse(result.data.data.settings)
              setType(settings.dam_type)
            // console.log(settings.spanLength)
              axios({
                method: "get",
                url: API_URL + `/company/view/${result.data.data.companyId}`,
                headers: { "accept": `application/json`, "access-token": `${token}` },
              }).then((result2) => {
                console.log(result2.data.data.name)
                setState({
                  ...state,
                  ['writer']: result2.data.data.name,
                  ['DamName']: settings.dam_kor,
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
    // console.log(arr)
    const result = arr.toString()
    // console.log(result)
    setState({
            ...state,
            ['result']: result
        })
    // console.log(state)
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
        task_name: "estimator_dam",
        interactive: false,
        tasks: [{
          input_csv_step1: `stage8/${DamType}/totalCSV.csv`,
          input_csv_step1_1: `stage9/${DamType}/step1.csv`,
          total_csv: "input.csv",
          input_csv_step2: `stage9/${DamType}/step1_1.csv`,
          input_csv_step3: `stage9/${DamType}/step2.csv`,
          input_csv_step4: `stage9/${DamType}/step3.csv`,
          output_folder: `stage9/${DamType}`,
          input_text_file: `stage9/${DamType}/step4.txt`,
          figure_path:`stage9/그림`,
          conf_name: "Setup_dam.conf",
          conf_folder:`stage9/${DamType}`,
          conf_values: state
        }]
      },
        
    }).then((res) => {
      job_id = res.data.data.job_id
      progress = setInterval(confirm, 30000)
      alert("상태평가보고서 진행중입니다.")
    }).catch((err) => {
      console.log(err)
    })



    };
    


     const option_render=()=>{
        const arr:any[]=[];
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
        return arr;
    }
     const onChangeDamType = (e:any) => {
        console.log(e)
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
  }
  const onImageUpload = ((e: any, file_name:string) => {
    let id = Number(e.target.id.substr(-1,1))
    let file = e.target.files[0]
    // setClickImage(file_name+file.name.substr(-4,4))
    console.log(file.name.substr(-4, 4))
    let click: uploadProgress[];
    axios({
      method: 'post',
      url: API_URL + `/file/upload/${project_id}?path=stage9_그림&filename=${file_name+file.name.substr(-4,4)}`,
      // url: API_URL + `/File/Upload/${project_id}/stage9_그림/${file_name+file.name.substr(-4,4)}`,
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
              {/* <Form.Item label="댐 타입" className={styles.csFormItem}>
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeDamType}>
                    {option_render()}
                </Select>
              </Form.Item> */}
              <Form.Item label="댐 이름" className={styles.csFormItem}>
                <Input value={state.DamName} className={styles.csFormInput} />
              </Form.Item>
              <Form.Item label="작성자" className={styles.csFormItem}>
                <Input value={state.writer} className={styles.csFormInput} />
              </Form.Item>
              <Form.Item label="시설물 번호" className={styles.csFormItem}>
                <Input placeholder="" name="DamNumber" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="준공년월일" className={styles.csFormItem}>
                <Input placeholder=" " name="year" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="관리번호" className={styles.csFormItem}>
                <Input placeholder=" ex)"  name="managementNum" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="위치" className={styles.csFormItem}>
                <Input className={styles.csFormInput} placeholder="ex) OO시 OO구 OO동"  name="location" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="관리주체" className={styles.csFormItem}>
                <Input placeholder="ex) 의왕시" name="management" defaultValue="-" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="하천명" className={styles.csFormItem}>
                <Input placeholder="ex) " name="reverName" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="댐 형식" className={styles.csFormItem}>
                <Input placeholder="ex) " name="DamType" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="댐 높이" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} name="dam_height" suffix="m" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="댐 길이" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} name="dam_length" suffix="m" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="댐 너비" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="dam_width" suffix={'천m\xB3'} onChange={handleChange}/>
              </Form.Item>
              
              <Form.Item label="상류면 경사" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="upstreamSlope" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="하류면 경사" className={styles.csFormItem}>
                <Input placeholder="" name="downstreamSlope" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="총 저수량" className={styles.csFormItem}>
                <Input placeholder="ex)" name="reservoir"  suffix={'백만m\xB3'} className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="유효 저수량" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} suffix={'백만m\xB3'} defaultValue="?"  name="effectiveReservoir" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="사수량" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix={'백만m\xB3'} name="deadWater" onChange={handleChange}/>  
              </Form.Item>
              <Form.Item label="홍수조절용량" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix={'백만m\xB3'}  name="floodControl" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="댐정상 표고" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m"  name="damTop" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="계획 홍수위" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="plannedFloorLevel" onChange={handleChange}/>  
              </Form.Item>
              <Form.Item label="상시 만수위" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="permanentFloodLevel" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="제한 수위" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="limitLevel" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="저수위" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="lowWaterLevel" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="설계홍수량" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="designFloodLevel" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="수문 형식" className={styles.csFormItem}>
                <Input placeholder="ex)" name="form1" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="수문 문수" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} name="form2" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="수문 크기" className={styles.csFormItem}>
                <Input placeholder="ex)" name="waterGateSize" suffix="m" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="시설 용량" className={styles.csFormItem}>
                <Input placeholder="ex)" name="capacity" suffix='천kW' className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="유효 낙차" className={styles.csFormItem}>
                <Input placeholder="ex)" name="fall" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="사용수량" className={styles.csFormItem}>
                <Input placeholder="ex)" name="pre_period" suffix={'m\xB3/sec'} className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부재별관찰결과" className={styles.csFormItem}>
                <Checkbox value="균열" onClick={onclick}>균열</Checkbox>
                <Checkbox value="백태" onClick={onclick}>백태</Checkbox>
                <Checkbox value="누수" onClick={onclick}>누수</Checkbox>
                <Checkbox value="파손"onClick={onclick}>파손</Checkbox>
              </Form.Item>
              
              <Form.Item label="사진 업로드" className={styles.ImageUploadFormItem} >
                {/* <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "하부전경1")} className={styles.EstimatorImgUpload}/> */}
                <div className={styles.BridgeFormItem}>
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file1">종평면도</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "그림2_2")} style={{ display: "none", float:"left"}} id="input-file1" key="1"/>
                  {confirmUploadImg[1] === true ?
                    clickImage.filter((a: any) => a.id === "그림2_2")[0].status :
                    <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                <div className={styles.BridgeFormItem}>
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file2">표준 단면도</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "그림2_3")} style={{ display: "none" }} id="input-file2" key="2"/>
                  {confirmUploadImg[2] === true ? clickImage.filter((a: any) => a.id === "그림2_3")[0].status :
                    <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file3">상부전경</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "표2_2")} style={{ display: "none" }} id="input-file3" key="5"/>
                  {confirmUploadImg[3] === true ? clickImage.filter((a: any) => a.id === "표2_2")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
                
                <div className={styles.BridgeFormItem}>    
                  <label className={styles.EstimatorImgUpload} htmlFor="input-file4">하부전경</label>
                  <input type='file' accept='image/*' name='file' onChange={(e: any) => onImageUpload(e, "표2_2_2")} style={{ display: "none" }} id="input-file4" key="7"/>
                  {confirmUploadImg[4] === true ? clickImage.filter((a: any) => a.id === "표2_2_2")[0].status :
                  <Progress type="line" percent={0} strokeWidth={10} strokeColor={'#96bcf5'} style={{ width: '50%', float: 'right' }} />}
                </div>
              </Form.Item>
              

              <Form.Item className={styles.submitBtn}>
                <Button type="primary" htmlType='submit' onClick={submitClick2} className={styles.submitBtn2}> Submit</Button>
              </Form.Item>
            </Form>
    </div>
  )
}
