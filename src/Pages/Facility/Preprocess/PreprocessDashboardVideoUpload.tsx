import { Carousel, Slider, Table } from 'antd';
import { useRecoilState, useRecoilValue, atom } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../Store/Global';
import {ProjectMainDashboard} from '../../../Store/Type/type';
import axios from "axios";
import Column from 'antd/lib/table/Column';
import Project from '../../Project';

function PreprocessDashboardVideoUpload() {


    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem('project_id')
    const [disabled, setDisabled] = useState(false);
    //token
    let token: string | null = localStorage.getItem("token") 
    // useEffect(()=>{
    //     if (typeof window !== 'undefined' || "null") {
    //         console.log('You are on the browser');
    //         token = localStorage.getItem("token");
    //         } else {
    //             console.log('You are on the server');
    //              // 👉️ can't use localStorage1
    //         }
    //     })
    
    
    // const ProjectList:  ProjectMainDashboard[] =[];
    const ProjectList:  ProjectMainDashboard[] =[];
    const [PJlist, setPJlist] = useState<any>([]);
    let [count, setCount] = useState<any|number>(0);
    useEffect(() => {
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
            }).then((res) => {
                const settings: any = JSON.parse(res.data.data.settings)
                setCount(settings.cameraCount)
               
            })
        
        for (let i = 1; i < count+1; i++){
            const cameraNo = String(i).padStart(2, '0')
            console.log(cameraNo)
            axios({
                method: 'get',
                url: API_URL + '/File/Files',
                headers: { "accept": `application/json`, "access-token": `${token}` },
                params : { path : `/project/${project_id}/stage0/C${cameraNo}`}
            }).then((res) => {
                
                let status = ''
                if (res.data.check === true) {
                    console.log('여긴 몇번?  C', cameraNo)
                    if (res.data.data.files.length !== 0 ? status = '완료':status = '진행중' )
                    ProjectList.push({
                        key: i,
                        no: i,
                        task: 'C' + cameraNo,
                        status: status,
                        start: '',
                        time: ''
                    })
                    
                } else {
                    console.log('false 여긴 몇번?  C', cameraNo)
                    ProjectList.push({
                        key: i,
                        no: i,
                        task: 'C' + cameraNo,
                        status: '영상이 없음',
                        start: '',
                        time: ''
                    })
                    
                }
                setPJlist(ProjectList)
                
            })
        }
        }, []);

    return (
            <div>
                    <div>
                    <Table dataSource={PJlist} size="small" scroll={{ y: 200 }} pagination={false}>
                    <Column title = '번호' dataIndex="no" />
                        <Column title='카메라 번호' dataIndex="task" />
                        <Column title = '상태' dataIndex="status" />
                        <Column title = '시작 시간' dataIndex="start"  />
                        <Column title = '소요시간' dataIndex="time" />
                    </Table>
                    </div>
            </div> 

        )
}

export default PreprocessDashboardVideoUpload;

