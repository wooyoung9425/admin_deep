import React, { useEffect, useState } from 'react'
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css'
import { Button, Form, Input, Radio, Checkbox } from "antd";
import { API_URL } from '../../../../Store/Global';
import axios from 'axios';
import { userState } from '../../../../Store/State/atom';

export default function EsimatorSetting() {
  let token: string | null = localStorage.getItem("token");
  let settings: any = [];
  let job_id = 0;
  const project_id = localStorage.getItem("project_id");
  const [title, setTitle] = useState("");
  const [check, setCheck] = useState(false);
  const [state, setState] = useState({
    writer: "현대건설", //작성자
    tunnel_name: "화곡", //터널이름
    year1:"2019",  //안전진단 세부지침년도
    contractor:"세대건설산업", // 시공사
    location:"서울특별시 강서구 화곡동", //위치
    tunnel_width: 9.96, //터널 너비
    tunnel_length:442, //터널 길이
    lining_length:10, //라이닝 둘레 길이
    road:"편도 2차로",  // 차선수
    route_name:"국지도 57호",  // 노선명
    tile_length:"", //타일 길이
    span_length:100, // 스팬 길이
    plant1_length: 10, // 부대시설1- 연장
    plant1_height:10, //부대시설1-높이
    plant2_length:10, //부대시설2- 연장
    plant2_height:10, //부대시설2-높이
    pass_height:10, //통과 높이
    test:"123", //내구성 시험
    management : "서울시", //관리 주체
    form1:"", //갱문 형식
    form2:"", //배문 형식
    method:"", // 환기 방식
    year2:"1983", //준공년도
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
                url: API_URL + `/project/view/${result.data.data.companyId}`,
                headers: { "accept": `application/json`, "access-token": `${token}` },
              }).then((result2) => {
                console.log(result2.data.data.name)
                setState({
                  ...state,
                  ['writer']: result2.data.data.name,
                  ['tunnel_name']: settings.tunnel_kor,
                  ['span_length'] : settings.spanLength

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

        alert("상태평가보고서 생성 작업이 진행중입니다.")
        setTimeout(function() {
          alert("상태평가보고서가 생성되었습니다.")
        }, 1000);
    // console.log(state)
    // axios({
    //   method: "post",
    //   url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
    //   headers: {
    //     "accept": `application/json`,
    //     "access-token": `${token}`,
    //     "Content-Type": `application/json`
    //   },
    //   data: {
    //     project_id: project_id,
    //     task_name: "estimator",
    //     interactive: false,
    //     tasks: [{
    //       input_folder: "stage8_csv/total.csv",
    //       output_folder: "stage9",
    //       conf_name: "StateEstimateSetup.conf",
    //       conf_folder:"stage9",
    //       conf_values: state
    //     }]
    //   },
        
    // }).then((res) => {
    //   job_id = res.data.data.job_id
    //   progress = setInterval(confirm, 3000)
    //   alert("상태평가보고서 진행중입니다.")
    // }).catch((err) => {
    //   console.log(err)
    // })



  };
  return (
    <div>
      <Form labelCol={{ span: 7, }} wrapperCol={{ span: 10, }} layout="horizontal" className={styles.csForm} >
              <Form.Item label="터널 타입" className={styles.csFormItem}>
               <Input value="NATM" className={styles.csFormInput} />
              </Form.Item>
              <Form.Item label="터널 이름" className={styles.csFormItem}>
                <Input value={state.tunnel_name} name="name" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              {/* <Form.Item label="CSV 선택" className={styles.csFormItem}>
                      <UploadCSV/>
                  </Form.Item> */}
              <Form.Item label="작성자" className={styles.csFormItem}>
                <Input value={state.writer} name="manager" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="안전진단 세부지침 년도" className={styles.csFormItem}>
                <Input value={state.year1} name="year1" suffix="년" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="시공사" className={styles.csFormItem}>
                <Input value={state.contractor}  name="contractor" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="위치" className={styles.csFormItem}>
                <Input className={styles.csFormInput} value={state.location}  name="location" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="터널 너비" className={styles.csFormItem}>
          <Input value={state.tunnel_width} name="tunnel_width" suffix="m" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="터널 길이" className={styles.csFormItem}>
                <Input  value={state.tunnel_length} name="tunnel_length" suffix="m" onChange={handleChange} />
              </Form.Item>
              <Form.Item label="라이닝 둘레 길이" className={styles.csFormItem}>
                <Input value={state.lining_length} name="lining_length" suffix="m" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="차선수" className={styles.csFormItem}>
                <Input value={state.road} name="road" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="노선명" className={styles.csFormItem}>
                <Input value={state.route_name} name="route_name" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="타일 길이" className={styles.csFormItem}>
                <Input  value="없음" suffix="m" name="tile_length" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="스팬 길이" className={styles.csFormItem}>
                <Input value={ state.span_length} name="span_length" className={styles.csFormInput} suffix="m" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부대시설1-연장" className={styles.csFormItem}>
                <Input value={state.plant1_length} className={styles.csFormInput} suffix="m" name="plant1_length" onChange={handleChange}/>  
              </Form.Item>
              <Form.Item label="부대시설1-높이" className={styles.csFormItem}>
                <Input value={state.plant1_height} className={styles.csFormInput} suffix="m" name="plant1_height" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부대시설2-연장" className={styles.csFormItem}>
                <Input value={state.plant2_length} className={styles.csFormInput} suffix="m" name="plant2_length" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부대시설2-높이" className={styles.csFormItem}>
                <Input value={state.plant2_height} className={styles.csFormInput} suffix="m" name="plant2_height" onChange={handleChange}/>  
              </Form.Item>
              <Form.Item label="통과높이" className={styles.csFormItem}>
                <Input value={state.pass_height} className={styles.csFormInput} suffix="m" name="pass_height" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="내구성시험" className={styles.csFormItem}>
                <Input value={state.test} className={styles.csFormInput} name="test" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="관리주체" className={styles.csFormItem}>
                <Input value={state.management} name="management" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="갱문형식" className={styles.csFormItem}>
                <Input value="원통절개형" name="form1" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="배문형식" className={styles.csFormItem}>
                <Input  value="원통절개형" name="form2" onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="환기방식" className={styles.csFormItem}>
                <Input value="자연환기" name="method" className={styles.csFormInput} onChange={handleChange} />
              </Form.Item>
              <Form.Item label="준공년도" className={styles.csFormItem}>
                <Input value={state.year2} name="year2" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="공용기간" className={styles.csFormItem}>
                <Input value="1" name="period" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="사전조사기간" className={styles.csFormItem}>
                <Input value="2020년 05월" name="pre_period" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="현장조사기간" className={styles.csFormItem}>
                <Input value="2020년 06월" name="post_period" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="기존실행년도" className={styles.csFormItem}>
                <Input value="2018" name="year3" suffix="년" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item label="부재별관찰결과" className={styles.csFormItem}>
                <Checkbox value="균열" onClick={onclick}>균열</Checkbox>
                <Checkbox value="백태" onClick={onclick}>백태</Checkbox>
                <Checkbox value="누수" onClick={onclick}>누수</Checkbox>
                <Checkbox value="파손"onClick={onclick}>파손</Checkbox>
                
              </Form.Item>
              <Form.Item label="전차과업년도" className={styles.csFormItem}>
                <Input value="2018년 하반기" name="year4" className={styles.csFormInput} onChange={handleChange}/>
              </Form.Item>
              <Form.Item className={styles.submitBtn}>
                <Button type="primary" htmlType='submit' onClick={submitClick2} className={styles.submitBtn2}> Submit</Button>
              </Form.Item>
            </Form>
    </div>
  )
}
