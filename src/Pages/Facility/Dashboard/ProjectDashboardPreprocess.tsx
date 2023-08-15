import { Carousel, Slider, Table } from 'antd';
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState ,useRef} from 'react';
import { API_URL } from '../../../Store/Global';
import {ProjectMainDashboard} from '../../../Store/Type/type';
import axios from "axios";
import moment from 'moment';
import Column from 'antd/lib/table/Column';
import JtagComponent from '../Preprocess/JtagComponent';

function ProjectDashboardPreprocess() {


    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem('project_id')
    const project_Type = localStorage.getItem('project_Type')
    const [disabled, setDisabled] = useState(false);
    //token
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

    const [company_id, setCompanyId] = useState<number>(-1);

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
    
    
    const ProjectList: any =[];
    const [PJlist, setPJlist] = useState<any | undefined>([]);
    let task_name: any;    

    if (project_Type === 'Tunnel') {
        task_name = ["lean_mean", "copy_folder","j_detector", "joint_rename","span_move", "joint_edit", "joint_copy"]
    } else if (project_Type === 'Airport') {
        task_name = ["imageRotation_airport","gpstoxyz_airport"];
    } else if (project_Type === 'Dam') {
        task_name=['gpstoxyz']
    } else if (project_Type === 'Bridge') {
        task_name = ['gpstoxyz_total']
    }
    useEffect(() => {
        const response = axios({
            method: "post",
            url: API_URL + `/scheduler/job/list`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`, "Content-Type" : `application/json`},
            data: {
                "project_id": project_id,
                "company_id": company_id
              },
        }).then((res) => {
            if (res.data.check === true) {
                console.log("111성공")
                for (let i = 0; i < res.data.data.jobs.length; i++) {
                    const name = res.data.data.jobs[i].task_name;       
                    if (task_name.includes(name)===true) {
                        ProjectList.push({
                            key: res.data.data.jobs[i].job_id,
                            no: 'C'+String(i+1).padStart(2,'0') ,
                            task_name: <a>{res.data.data.jobs[i].task_name}</a>,
                            status: res.data.data.jobs[i].status,
                            created: moment(res.data.data.jobs[i].created).format('YYYY-MM-DD'),
                        })
                    }
                }
                setPJlist(ProjectList)
                console.log(ProjectList)

            } else {
                console.log("실패");
            }
        }).catch((err) => {
            console.log(err);
        });
}, []);
    

    return (
            <div>
                    <div>
                    <Table dataSource={PJlist} size="small" scroll={{ y: 200 }} pagination={false} >
                        <Column title = '번호' dataIndex="key"  />
                    <Column title='작업' dataIndex="task_name" onCell={(record: any) => {
                        return {
                            onClick: () => {
                                // console.log(record)
                            } 
                        }
                     }}/>
                        <Column title = '상태' dataIndex="status" />
                        <Column title = '시작 시간' dataIndex="created"  />
                        <Column title = '소요시간' dataIndex="time" />
                    </Table>
                    </div>
            </div> 

        )
}

export default ProjectDashboardPreprocess;

