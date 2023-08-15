import { Carousel, Slider, Table } from 'antd';
import styled from "styled-components";
// import { useState } from 'react'
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../Store/Global';
import {ProjectMainDashboard} from '../../../Store/Type/type';
import axios from "axios";
import moment from 'moment';
import Column from 'antd/lib/table/Column';
import { margin } from '@mui/system';





function PreprocessDashboardJtag() {

    let token: string | null = localStorage.getItem("token") 
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem('project_id')
    const ProjectList: any =[];
    const [PJlist, setPJlist] = useState<any | undefined>([]);

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

    
    useEffect(() => {
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
        const list  = ["j_detector"];
        if (res.data.check === true) {
            for (let i = 0; i < res.data.data.jobs.length; i++) {
                // console.log(res.data.data.jobs[i].task_name,list.includes(res.data.data.jobs[i].task_name ) )
                if (list.includes(res.data.data.jobs[i].task_name ) ===true) {
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
                            // console.log( res2.data.data.tasks)
                            Object.values(res2.data.data.tasks).map((ttt, index) => {
                                // console.log('%%%',Object(ttt), i ,res.data.data.jobs[i].task_name)
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
                            console.log(ProjectList)
                                
                        } else {
                            console.log("job/Query 실패")
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }
        } else {
            console.log('실패')
        }
    }).catch((err) => {
        console.log(err)
    })
 },[])




    return (
            <div>
                    <div>
                    <Table dataSource={PJlist} size="small" scroll={{ y: 200 }} pagination={false}>
                    <Column title = '카메라 번호' dataIndex="no" />
                        <Column title='작업' dataIndex="task" />
                        <Column title = '상태' dataIndex="status" />
                        <Column title = '시작 시간' dataIndex="start"  />
                        <Column title = '소요시간' dataIndex="time" />
                    </Table>
                    </div>
            </div> 

        )
}

export default PreprocessDashboardJtag;

