import React, { useEffect, useState } from 'react'
import styles from '../../Styles/ProjectDashboard.module.css'
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Column from 'antd/lib/table/Column';
import { ProjectInpormationContents} from '../../Store/Type/type'
import { API_URL } from '../../Store/Global';
import axios from "axios";
import moment from 'moment';





function ProjectInpormation() {


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


    const ProjectList:  ProjectInpormationContents[] =[];
    const [PJlist, setPJlist] = useState<any | undefined>([]);

    useEffect(() => {
        const response = axios({
            method: "GET",
            url: API_URL + '/project/list/company/17',
            headers : {"accept" : `application/json`, "access-token" : `${token}`},
            // data: {orderColumn: "id", SortOrder: "desc", orderBy:0}  
        }).then((res) => {
                // console.log(res.data.check) 
                if (res.data.check === true) {
                    for (let i = 0; i < res.data.data.length; i++) {
                        // console.log(moment(res.data.data[i].createdAt).format('YYYY-HH-DD'))
                        // console.log(res.data.data[i].title)
                        ProjectList.push({
                            key: res.data.data[i].id,
                            no: i + 1,
                            title: <a>{res.data.data[i].title}</a>,
                            type: res.data.data[i].projectType,
                            status: res.data.data[i].descriptor,
                            date : moment(res.data.data[i].createdAt).format('YYYY-MM-DD'),
                        })
                    }
                    console.log(ProjectList)
                    setPJlist(ProjectList)
                } else {
                    console.log("실패");
                }
            }).catch((err) => {
                console.log(err);
            });
    }, []);


    return (
        <div className={styles.project_impormation}>
                    <div className={styles.project_impormation_title}>
                프로젝트 정보
            </div>
            <div className={styles.project_impormation_content}>
                
                <div className={styles.project_impormation_content_box}>
                

                <div>


                <Table dataSource={PJlist} size="small" scroll={{ y: 200 }} pagination={false}>
                    <Column title = '번호' dataIndex="no" />
                    <Column title='이름' dataIndex="title" />
                    <Column title = '구조물' dataIndex="type" />
                    <Column title = '상태' dataIndex="status"  />
                    <Column title = '생성일' dataIndex="date" />
                </Table>
                    
                    
                </div>

                </div>
            </div>


    </div>
    )
}

export default ProjectInpormation;