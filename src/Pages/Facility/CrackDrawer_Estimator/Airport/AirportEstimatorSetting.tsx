import React, { useEffect, useState } from 'react'
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css'
import { Button, Form, Input, Radio, Checkbox } from "antd";
import { API_URL } from '../../../../Store/Global';
import axios from 'axios';
import { userState } from '../../../../Store/State/atom';

export default function AirportEstimatorSetting() {
  let token: string | null = localStorage.getItem("token");
  let settings: any = [];
  let job_id = 0;
  const project_id = localStorage.getItem("project_id");
  const [title, setTitle] = useState("");
  const [check, setCheck] = useState(false);
  const [state, setState] = useState({
    writer: "", //작성자
    name: "", //공항이름
    year1:"",  //안전진단 세부지침년도
    contractor:"", // 시공사
    location:"", //위치
    tunnel_width: 0, //공항 너비
    tunnel_length:0, //공항 길이
    lining_length:0, //라이닝 둘레 길이
    road:"",  // 차선수
    route_name:"",  // 노선명
    tile_length:"", //타일 길이
    span_length:0, // 스팬 길이
    plant1_length: 0, // 부대시설1- 연장
    plant1_height:0, //부대시설1-높이
    plant2_length:0, //부대시설2- 연장
    plant2_height:0, //부대시설2-높이
    pass_height:0, //통과 높이
    test:"", //내구성 시험
    management : "", //관리 주체
    form1:"", //갱문 형식
    form2:"", //배문 형식
    method:"", // 환기 방식
    year2:"", //준공년도
    period:0, //공용기간
    pre_period:"", // 사전조사기간
    post_period:"", //현장조사기간
    year3:"", // 기존 실행 년도
    result:"", // 부재별 관찰 결과
    year4:"" // 전차 과업 년도
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
            settings= JSON.parse(result.data.data.settings)
            console.log(settings)
            // console.log(settings.spanLength)
              axios({
                method: "get",
                url: API_URL + `/company/view/${result.data.data.companyId}`,
                headers: { "accept": `application/json`, "access-token": `${token}` },
              }).then((result2) => {
                console.log(result2.data.data)
                setState({
                  ...state,
                  ['writer']: result2.data.data.name,
                  ['name']: settings.airport_kor,
                  ['span_length']: settings.spanLength,
                  ['tunnel_width']: settings.constructWidth,
                  ['tunnel_length']:settings.constructLength
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
                        alert("상태평가보고서 step"+res2.data.data.files.length+" 가 끝났습니다.")
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
        task_name: "defect_estimator",
        interactive: false,
        tasks: [{
          input_folder: "stage9/input.csv",
          output_folder: "stage9",
          conf_name: "Airportreport.conf",
          conf_folder:"stage9",
            conf_values: {
              airportName: state.name
          }
        }]
      },
        
    }).then((res) => {
      job_id = res.data.data.job_id
      progress = setInterval(confirm, 20000)
      alert("상태평가보고서 진행중입니다.")
    }).catch((err) => {
      console.log(err)
    })



  };
  return (
    <div>
      <Form labelCol={{ span: 7, }} wrapperCol={{ span: 10, }} layout="horizontal" className={styles.csForm} >
              <Form.Item label="공항 타입" className={styles.csFormItem}>
               <Input value="NATM" className={styles.csFormInput} />
              </Form.Item>
              <Form.Item label="공항 이름" className={styles.csFormItem}>
                <Input value={state.name} className={styles.csFormInput} />
              </Form.Item>
              {/* <Form.Item label="CSV 선택" className={styles.csFormItem}>
                      <UploadCSV/>
                  </Form.Item> */}
              <Form.Item label="작성자" className={styles.csFormItem}>
                <Input value={state.writer} className={styles.csFormInput} />
              </Form.Item>
              {/* <Form.Item label="안전진단 세부지침 년도" className={styles.csFormItem}>
                <Input placeholder=" ex) 2018" name="year1" suffix="년" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="시공사" className={styles.csFormItem}>
                <Input placeholder=" ex) (주)xx건설"  name="contractor" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="위치" className={styles.csFormItem}>
                <Input className={styles.csFormInput} placeholder="ex) OO시 OO구 OO동"  name="location" onChange={handleChange}/>
              </Form.Item> */}
              <Form.Item label="활주로 너비" className={styles.csFormItem}>
              <Input className={styles.csFormInput} name="airport_width" value={state.tunnel_width} suffix="m" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="활주로 길이" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} name="airport_length" value={state.tunnel_length} suffix="m" onChange={handleChange} />
              </Form.Item>
              {/* <Form.Item label="라이닝 둘레 길이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="lining_length" suffix="m" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="차선수" className={styles.csFormItem}>
                <Input placeholder="ex) 편도 2차로" name="road" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="노선명" className={styles.csFormItem}>
                <Input placeholder="ex) 국지도57호" name="route_name" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="타일 길이" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} suffix="m" name="tile_length" onChange={handleChange}/>
              </Form.Item> */}
              <Form.Item label="스팬 길이" className={styles.csFormItem}>
                <Input value={ state.span_length} name="span_length" className={styles.csFormInput} suffix="m" onChange={handleChange}/>
              </Form.Item>
              {/* <Form.Item label="부대시설1-연장" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="plant1_length" onChange={handleChange}/>  
              </Form.Item>
              <Form.Item label="부대시설1-높이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="plant1_height" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부대시설2-연장" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="plant2_length" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부대시설2-높이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="plant2_height" onChange={handleChange}/>  
              </Form.Item>
              <Form.Item label="통과높이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" name="pass_height" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="내구성시험" className={styles.csFormItem}>
                <Input className={styles.csFormInput} name="test" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="관리주체" className={styles.csFormItem}>
                <Input placeholder="ex) 의왕시" name="management" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="갱문형식" className={styles.csFormItem}>
                <Input placeholder="ex) 원통절개형" name="form1" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="배문형식" className={styles.csFormItem}>
                <Input  className={styles.csFormInput} name="form2" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="환기방식" className={styles.csFormItem}>
                <Input placeholder="ex) 자연환기" name="method" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="준공년도" className={styles.csFormItem}>
                <Input placeholder="ex) 2019" name="year2" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="공용기간" className={styles.csFormItem}>
                <Input placeholder="ex) 1" name="period" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="사전조사기간" className={styles.csFormItem}>
                <Input placeholder="ex) 2020년 05월" name="pre_period" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="현장조사기간" className={styles.csFormItem}>
                <Input placeholder="ex) 2020년 06월" name="post_period" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="기존실행년도" className={styles.csFormItem}>
                <Input placeholder="ex) 2018" name="year3" suffix="년" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item> */}
              {/* <Form.Item label="부재별관찰결과" className={styles.csFormItem}>
                <Checkbox value="균열" onClick={onclick}>균열</Checkbox>
                <Checkbox value="백태" onClick={onclick}>백태</Checkbox>
                <Checkbox value="누수" onClick={onclick}>누수</Checkbox>
                <Checkbox value="파손"onClick={onclick}>파손</Checkbox>
                
              </Form.Item> */}
              {/* <Form.Item label="전차과업년도" className={styles.csFormItem}>
                <Input placeholder="ex) 2018년 하반기" name="year4" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item> */}
              <Form.Item className={styles.submitBtn}>
                <Button type="primary" htmlType='submit' onClick={submitClick2} className={styles.submitBtn2}> Submit</Button>
              </Form.Item>
            </Form>
    </div>
  )
}
