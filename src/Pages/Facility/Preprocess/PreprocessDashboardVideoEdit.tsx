import { Carousel, Slider, Table } from 'antd';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../Store/Global';
import axios from "axios";
import moment from 'moment';
import Column from 'antd/lib/table/Column';





function PreprocessDashboardVideoEdit() {


    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem('project_id')
    const project_Type=localStorage.getItem("project_Type")
    const ProjectList: any =[];
    const [PJlist, setPJlist] = useState<any | undefined>([]);


    let token: string | null = localStorage.getItem("token") 
    useEffect(()=>{
        if (typeof window !== 'undefined' || "null") {
            console.log('You are on the browser');
                    token = localStorage.getItem("token");
        } else {
            console.log('You are on the server');
            // 👉️ can't use localStorage1
        }
    })

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
                  // localStorage.set("project_id", id);
                  console.log(
                    `아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`);
                    // setId(res.data.data.id)
                    setUserId(res.data.data.id)
                    setCompanyId(res.data.data.companyId)

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


    
    useEffect(() => {
    // let token: string | null = localStorage.getItem("token") 

    
    
    const response1 = axios({
        method: "post",
        url: API_URL + `/scheduler/job/list`,
        headers : {"accept" : `application/json`, "access-token" : `${token}`, "Content-Type" : `application/json`},
        data: {
            "project_id": project_id,
            "company_id": companyid
          },
}).then((res) => {
        // console.log(res.data)
        if (res.data.check === true) {
            console.log("tjdddddddddddddddddddddddd"+ res.data)
            const task_name = ['imageRotation_airport','video_cut_frame']
            for (let i = 0; i < res.data.data.jobs.length; i++) {
                if (res.data.data.jobs[i].task_name === 'video_cut_frame') {
                if (task_name.includes(res.data.data.jobs[i].task_name )===true) {
                    axios({
                        method: "post",
                        url: API_URL + '/scheduler/job/query',
                        headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                            data: {
                                "job_id": res.data.data.jobs[i].job_id ,
                                "company_id": companyid
                            }
                    }).then((res2) => {
                        
                        if (res2.data.check === true) {
                            console.log("job/Query 성공")
                            console.log( res2.data.data.tasks)
                            Object.values(res2.data.data.tasks).map((ttt, index) => {
                                console.log('%%%',Object(ttt))
                                ProjectList.push({
                                    key: Object(ttt).task_id,
                                    no: 'C'+ String(index + 1).padStart(2, '0'),
                                    task: res.data.data.jobs[i].task_name,
                                    status: Object(ttt).status,
                                    start: moment(res.data.data.jobs[i].created).format('YYYY-MM-DD'),
                                    time: Object(ttt).time_sec
                                })
                            })
                            setPJlist(ProjectList)
                            
                        } else {
                            console.log("job/Query 실패")
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }}
            }
        } 
        else {
            console.log('실패')
        }
    }).catch((err) => {
        console.log(err)
    })
 },[])



    return (
            <div>
                    <div>
                    <Table dataSource={PJlist} size="small" scroll={{ y: 200 }} pagination={false} >
                    {project_Type === 'Tunnel' ? <Column title='카메라 번호' dataIndex="no" /> : <Column title='번호' dataIndex="key" />}
                        <Column title='작업' dataIndex="task" />
                        <Column title = '상태' dataIndex="status" />
                        <Column title = '시작 시간' dataIndex="start"  />
                        <Column title = '소요시간' dataIndex="time" />
                    </Table>
                    </div>
            </div> 

        )
}

export default PreprocessDashboardVideoEdit;

