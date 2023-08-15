import { Button, Form, Input, Radio, Select, Progress, } from "antd";
import styles from '../../../../Styles/CrackDrawer_Estimator.module.css';
import { API_URL } from '../../../../Store/Global';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const { Option } = Select;

export default function AirportDrawerSetting() {
  let token: string | null = localStorage.getItem("token");
  let job_id = 0;
  const project_id = localStorage.getItem("project_id");
  const [title, setTitle] = useState("");
  const [typeArr, setType] = useState([])
  const [DamType, setDamType] = useState<string>("Overflow");
  const [dam_type_name, setDamTypeName]=useState<string>("")
  const [state, setState] = useState({
        dam_type: 0,
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


    let settings: any;
    useEffect(() => {
        
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((result) => {
          if (result.data.check === true) {
            settings = JSON.parse(result.data.data.settings)
            setType(settings.dam_type)
            setTitle(result.data.data.title)
            setState({
            //   ...state, ['cam_no']: settings.cameraCount,
            //   ['span_no']: settings.spanCount,
            //   ['span_len']: settings.spanLength,
            //   ['maxwid']: settings.crackMaxWidth,
              ['dam_type']: settings.dam_type,
            //   ['camerashotwidth']: 0,
            //   ['tunnellength']: settings.constructLength,
            //   ['tunnelwidth']: settings.constructWidth,
            })
            }
        })
    },[])
    
    // form 설정 가져오기

    let progress: any;
    const submitClick1 = () => {
        console.log("프로젝트 id", project_id)
        console.log("프로젝트 title", title)


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
            task_name: "drawer_dam",
            interactive: true,
            tasks: [{
              input_csv_folder:`stage6/${DamType}`,
              output_folder: `stage8/${DamType}`,
              input_csv_file: `stage8/${DamType}/totalCSV.csv`,
              drawer_name: title + '.dxf',
              conf_name: "DBinfo.conf",
              conf_folder:`stage8/${DamType}`,
              conf_values: {
                dam_name: title    
              }
                
            }]
          },
            
        }).then((res) => {
          if (res.data.check === true) {
            job_id = res.data.data.job_id
            alert("외관조사망도가 진행중입니다.")
            progress = setInterval(confirm, 30000)
            console.log(res)
            
            
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
                  "company_id": companyid
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
                        params : {path : `project/${project_id}/stage8/${DamType}`}
                      }).then((res2) => {
                        console.log(res2.data.data.files.length)
                        alert("외관조사망도 step" + res2.data.data.files.length + " 가 끝났습니다.")
                      })
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
    return (
        
      <div>
        <Form labelCol={{ span: 7, }} wrapperCol={{ span: 9, }} layout="horizontal" className={styles.csForm} >
              <Form.Item label="댐 타입" className={styles.csFormItem} >
                <Select placeholder="선택해주세요" className={styles.selectDiv} onChange={onChangeDamType}>
                  {option_render()}
                </Select>
              </Form.Item>
              <Form.Item label="댐 명" className={styles.csFormItem}>
                <Input value={title} className={styles.csFormInput}></Input>
              </Form.Item>
                  
            <Form.Item className={styles.submitBtn}>
               
                <Button type="primary" htmlType='submit' onClick={submitClick1} style={{ width: '200px'}} > Submit</Button>
              </Form.Item>
        </Form></div>
        //  style={{float: "right"}}
  )
}
