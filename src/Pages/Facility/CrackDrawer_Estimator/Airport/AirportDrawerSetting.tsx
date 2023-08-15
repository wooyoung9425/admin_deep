import { Button, Form, Input, Radio, Select, Progress, } from "antd";
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css';
import { API_URL } from '../../../../Store/Global';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function AirportDrawerSetting() {
  let token: string | null = localStorage.getItem("token");
  let job_id = 0;
  const project_id = localStorage.getItem("project_id");
  const [title, setTitle] = useState("");
  const [state, setState] = useState({
        cam_no: 0,
        span_no: 0,
        span_len: 0,
        maxwid: 0,
        filter_len:0,
        filter_wid: 0,
        layer: '',
        color: 1,
        table_color: 7,
        draw_color: 7,
        tunneltilewidth: 0,
        contype: 0,
        camerashotwidth: 0,
        tunnellength: 0,
        tunnelwidth: 0,
        overlap:0
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
          if (result.data.check === true) {
            const settings = JSON.parse(result.data.data.settings)
            console.log(settings)
              setTitle(result.data.data.title)
            setState({
              ...state, ['cam_no']: settings.cameraCount,
              ['span_no']: settings.spanCount,
              ['span_len']: settings.spanLength,
              ['maxwid']: settings.crackMaxWidth,
              ['contype']: result.data.data.projectType,
              ['camerashotwidth']: 0,
              ['tunnellength']: settings.constructLength,
              ['tunnelwidth']: settings.constructWidth,
            })
              console.log(state)
              
            }
            console.log(title)
        })
    },[])
    
    // form 설정 가져오기

    const handleChange = (e: any) => {
        console.log(e.target.name, typeof e.target.value)
        
        setState({
            ...state,
            [e.target.name]: Number( e.target.value)
        })
    }
    const colorChange1 = (e: any) => {
        setState({
            ...state, ['draw_color']: e
        })       
    }
    const colorChange2 = (e: any) => {
        setState({
            ...state, ['table_color']:e
        })       
    }

    const onclick = (e: any) => {
        // console.log(e.target,'PPP')
        if (e.target.id === 'layer') {
            if (e.target.value === '0') {
                setState({
                    ...state,
                    ['layer']:'width'
                })
            } else {
                setState({
                    ...state,
                    ['layer']:'length'
                })
            }
        } else if (e.target.id === 'color') { // 외관조사망도 흑백 or 컬러 
            setState({
                ...state, ['color']: Number(e.target.value)
            })
        }
    }
    const submitClick1 = () => {
        console.log("프로젝트 id", project_id)
        console.log("프로젝트 title", title)

        console.log(state)

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
            task_name: "crack_drawer_step1",
            interactive: true,
            tasks: [{
              input_folder:"stage6_crack",
              output_folder: "stage8_crack"
                
            }, {
              input_folder:"stage6_defect",
              output_folder: "stage8_defect"
            }]
            },
            
        }).then((res) => {
          if (res.data.check === true) {
            job_id = res.data.data.job_id
            console.log(res)
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
                task_name: "crack_defect_merge",
                interactive: true,
                tasks: [{
                  input_folder_crack: "stage8_crack",
                  input_folder_defect: "stage8_defect",
                  output_folder: "stage8_CAD"
                }]
              },
            }).then((res2) => {
              if (res2.data.check === true) {
                setTimeout(() => axios({
                  method: "post",
                  url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
                  headers: {
                    "accept": `application/json`,
                    "access-token": `${token}`,
                    "Content-Type": `application/json`
                  },
                        data: {
                    project_id: project_id,
                    task_name: "defect_drawer",
                    interactive: true,
                    tasks: [{
                      input_folder: "stage8_CAD/totalSheet.csv",
                      output_folder: "stage8_CAD",
                      conf_name: "AirportInfo.conf",
                      conf_folder: "stage8_CAD",
                      conf_values: {
                        airportName: title
                      }
                    }]
                  },
                }).then((res3) => { result = setInterval(confirm, 20000); alert("외관조사망도 진행중입니다.")}), 10000)
              }
            })
          }
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
                  "company_id": 1
              }
          }).then((res) => {
                console.log(res)
                if (res.data.check == true) {
                    console.log("성공",res.data.data.status)
                    if (res.data.data.status === "done") {
                        alert("외관조사망도가 끝났습니다.")
                        clearInterval(result)
                        window.location.href='../CrackDrawer_Estimator/ReportDownload'
                    } else if (res.data.data.status === "wait") {
                      axios({
                        method: "get",
                        url: API_URL + '/File/Files',
                        headers: { "accept": `application/json`, "access-token": `${token}` },
                        params : {path : `project/${project_id}/stage8_csv/`}
                      }).then((res2) => {
                        console.log(res2.data.data.files.length)
                        alert("외관조사망도 step" + res2.data.data.files.length + " 가 끝났습니다.")
                        // if (res2.data.data.files.length === 4) {
                        //   clearInterval(result)
                        // }
                      })
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }


    return (
        
    <div><Form labelCol={{ span: 7, }}  wrapperCol={{ span: 9, }} layout="horizontal" className={styles.csForm} >
              <Form.Item label="타입" className={styles.csFormItem} >
                <Input value={state.contype} className={styles.csFormInput} />
                  </Form.Item>
                  <Form.Item label="공항명" className={styles.csFormItem}>
                    <Input value={title} className={styles.csFormInput}></Input>
                  </Form.Item>
                  {/* <Form.Item label="외관조사망도 색상"  rules={[{ message: 'Please pick an item!', },]} className={styles.csFormItem}>
                    <Radio.Group>
                      <Radio.Button className={styles.csFromRadio} value="0" id="color" onClick={onclick}>흑백</Radio.Button>
                      <Radio.Button className={styles.csFromRadio} value="1" id="color" onClick={onclick}>컬러</Radio.Button>
                    </Radio.Group>
                </Form.Item> */}
                {/* <Form.Item label="도면 번호 색상" className={styles.csFormItem}>
                  <Select defaultValue="White"  id ='draw_color' onChange={colorChange1}>
                    <Select.Option value="1"> red</Select.Option>
                    <Select.Option value="2">yellow</Select.Option>
                    <Select.Option value="3">green</Select.Option>
                    <Select.Option value="4">light blue</Select.Option>
                    <Select.Option value="5">blue</Select.Option>
                    <Select.Option value="6">pink</Select.Option>
                    <Select.Option value="7">white</Select.Option>
                    <Select.Option value="8">gray</Select.Option>
                    <Select.Option value="9">light gray</Select.Option>
                    <Select.Option value="10">black</Select.Option>
                  </Select>
                </Form.Item> */}
              {/* <Form.Item label="손상물량표 글자 색상" className={styles.csFormItem}>
                  <Select defaultValue="White" id ='table_color' onChange={colorChange2}>
                    <Select.Option value="1"> red</Select.Option>
                    <Select.Option value="2">yellow</Select.Option>
                    <Select.Option value="3">green</Select.Option>
                    <Select.Option value="4">light blue</Select.Option>
                    <Select.Option value="5">blue</Select.Option>
                    <Select.Option value="6">pink</Select.Option>
                    <Select.Option value="7">white</Select.Option>
                    <Select.Option value="8">gray</Select.Option>
                    <Select.Option value="9">light gray</Select.Option>
                    <Select.Option value="10">black</Select.Option>
                  </Select>
              </Form.Item> */}
              {/* <Form.Item label="응집률" className={styles.csFormItem}>
                 <Input type="number" placeholder="0" suffix="%" className={styles.csFormInput} />
              </Form.Item> */}
              {/* <Form.Item label="공항 길이" className={styles.csFormItem} >
                <Input type="number" className={styles.csFormInput}  value={ state.tunnellength} suffix="m" onChange={handleChange} name="maxwid"/>
              </Form.Item>
              <Form.Item label="터널 너비" className={styles.csFormItem} >
                <Input type="number" className={styles.csFormInput}  value={ state.tunnelwidth} suffix="m" onChange={handleChange} name="maxwid"/>
              </Form.Item> */}
              <Form.Item label="카메라 수" className={styles.csFormItem}>
                 <Input className={styles.csFormInput} suffix="개" value={state.cam_no} onChange={handleChange} name="cam_no"/> {/*value="32"  */}
              </Form.Item>
              <Form.Item label="스팬 수" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="개" value={state.span_no} onChange={handleChange} name="span_no"/>
              </Form.Item>
              <Form.Item label="스팬길이" className={styles.csFormItem}>
                <Input className={styles.csFormInput} suffix="m" value={ state.span_len} onChange={handleChange} name="span_len"/>
              </Form.Item>
              <Form.Item label="실제 균열 최대 폭" className={styles.csFormItem} >
                <Input type="number" className={styles.csFormInput}  value={ state.maxwid} suffix="mm" onChange={handleChange} name="maxwid"/>
              </Form.Item>
              <Form.Item label="실제 균열 최소 폭" className={styles.csFormItem} >
                <Input type="number" className={styles.csFormInput}  value={ state.maxwid} suffix="mm" onChange={handleChange} name="minwid"/>
              </Form.Item>
        
              {/* <Form.Item label="터널 타일 너비" className={styles.csFormItem} >
                <Input type="number" className={styles.csFormInput}  value={ state.tunneltilewidth} suffix="m" onChange={handleChange} name="tilewid"/>
              </Form.Item> */}
              {/* <Form.Item label="카메라간격?" className={styles.csFormItem} >
                <Input type="number" className={styles.csFormInput}  value={ state.camerashotwidth} suffix="m" onChange={handleChange} name="maxwid"/>
              </Form.Item> */}
              {/* <Form.Item label="필터링" className={styles.csFormItem}>
                <Input addonBefore='균열의 길이' addonAfter="m" className={styles.csInputNumber} onChange={handleChange} name="filter_len"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Input addonBefore='균열의 폭' addonAfter='mm' className={styles.csInputNumber} onChange={handleChange} name="filter_wid"/>
              </Form.Item> */}
              
              {/* <Form.Item label="Layer" className={styles.csFormItem}>
                    <Radio.Group>
                      <Radio.Button className={styles.csFromRadio} value="length" onClick={onclick} id="layer" >균열의 길이 Layer 분할</Radio.Button>
                      <Radio.Button className={styles.csFromRadio} value="width" onClick={onclick} id="layer" >균열의 폭 Layer 분할</Radio.Button>
                    </Radio.Group>
            </Form.Item> */}
            <Form.Item className={styles.progress}>
                {/* <Progress strokeColor={{ '0%': '#108ee9', '100%': '#87d068', }} percent={50} /> */}
                
            </Form.Item>
            <Form.Item className={styles.submitBtn}>
               
                <Button type="primary" htmlType='submit' onClick={submitClick1} style={{ width: '200px'}} > Submit</Button>
              </Form.Item>
        </Form></div>
        //  style={{float: "right"}}
  )
}
