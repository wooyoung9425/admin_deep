import React, {Component, useEffect, useState} from 'react';
import styles from '../../Styles/Project.module.css'
import { Link } from 'react-router-dom';
import { Button, Input, Table } from 'antd';
import axios from "axios";
import Column from 'antd/lib/table/Column';
import { ProjectList , SearchList} from '../../Store/Type/type'
import moment from 'moment';
import { API_URL } from '../../Store/Global';
import { useRecoilState } from 'recoil';
import {project_info,projectId} from '../../Store/State/atom'


import config from '../../config';
// import { apiHelper } from '../../../src/Utility';
import { apiHelper } from '../../allutils';
import { ReturnValues } from '../../allmodels';


function Management() {
    const [ProjectInfo, SetProjectInfo] = useRecoilState(project_info)
    const [Pid, SetPid] = useRecoilState(projectId)

//token
    let token: string | null = localStorage.getItem("token") 
    useEffect(()=>{
        if (typeof window !== 'undefined' || "null") {
            // console.log('토큰성공');
            token = localStorage.getItem("token");
        } else {
            console.log('You are on the server');
            // 👉️ can't use localStorage1
        }
    })

// Project List 
    const ProjectList: ProjectList[] = [];
    const [PList, setPList] = useState<any | undefined>([]);
    const [isBind, setIsBind] = useState(false);
    const DataBind = () => {
        if (!isBind) {
            // localStorage.removeItem('project_Type')
            const response = axios({
                method: "get",
                url: API_URL + `/project/list`,
                headers : {"accept" : `application/json`, "access-token" : `${token}`},
                data: {orderColumn: "id", SortOrder: "desc", orderBy:0}  
            }).then((res) => {
                    // console.log(res) 
                    // console.log(token)
                    if (res.data.check === true) {
                        // console.log(res)
                        for (let i = 0; i < res.data.data.length; i++) {
                            // console.log(res.data.data[i].projectType)
                            ProjectList.push({
                                key: res.data.data[i].id,
                                no: i + 1,
                                project_Type : res.data.data[i].projectType,
                                // title: <a href='../Facility/Dashboard/ProjectDashboard'>{res.data.data[i].title}</a>,
                                title: <a>{res.data.data[i].title}</a>,
                                construct: res.data.data[i].constructType,
                                status: res.data.data[i].descriptor,
                                date : moment(res.data.data[i].createdAt).format('YYYY-MM-DD'),
                                delete : <a>delete</a>
                            })
                        }
                        // console.log(ProjectList)
                        setPList(ProjectList)
                        setIsBind(true);
                    } else {
                        console.log("실패");
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
      };
    useEffect(() => {
        DataBind();
        
    }, [isBind]);

    // useEffect(function () {
    //     CompanyList()
        
    //  }, []);


        // const CompanyList = () => {
        //     apiHelper.Get('/company/list', {}, (rst: ReturnValues<any[]>) => {
        //         if (rst.check === true) {
        //             // const tmpList: any = []
        //             // rst.data.map((item: any) => {
        //             //     tmpList.push({ value: item.id, label: item.name })
        //             // })
        //             console.log("성공")

        //         }
        //     })
        // }

    
// Search
    const { Search } = Input;
    let search = "";
    let searchId = 0;
    const SearchList: SearchList[] = [];
    const onSearch = (search: string) => {
        console.log(search,'$$$$', PList.some(isSearch))
        if (PList.some(isSearch) === true) {
            console.log("확인"+searchId)
            axios({
                method: 'get',
                url: API_URL + `/project/view/${searchId}`,
                headers: { "accept": `application/json`, "access-token": `${token}` },
            }).then((res) => {
                console.log(res)
                if (res.data.check === true) {
                    SearchList.push({
                            key: res.data.data.id,
                            title: res.data.data.title,
                            construct: res.data.data.constructType,
                            status: res.data.data.descriptor,
                            date : moment(res.data.data.createdAt).format('YYYY-MM-DD'),
                            delete : <a id={res.data.data.id}>delete</a>
                    })
                    console.log(SearchList)
                    setPList(SearchList)
                } 
            }).catch((err) => {
                console.log("####",err);
            });
        } else {
            alert("프로젝트 명을 입력해주세요.")
        }
        
    }
    
    function isSearch(element: any) {
        // if (element.title.inculdes(search)) {
        //     searchId=element.key
        //     return searchId;
        // }
        if (element.title ===search) {
            searchId=element.key
            return searchId;
        }
    }

    
    return (
    <div className={styles.maincontainer}>
        <br />
        <h1> 프로젝트 &nbsp;목록
            <Search
            placeholder="input search text"
            allowClear
            className={styles.SearchBar}
            onSearch={onSearch}
            />
            <Link to="/IndexPage" style={{ textDecoration: 'none' }}>
                <a>
                    <Button onClick={() => {localStorage.removeItem('project_Type'); localStorage.removeItem('project_id');}}> 새 프로젝트</Button>
                </a>
            </Link>
        </h1>
        <Table dataSource={PList}>
            <Column title = '번호' dataIndex="no" />
                <Column title='프로젝트 명' dataIndex="title" onCell={(record: any) => {
                    
                    return {
                        onClick: () => {
                            // console.log(record.key)
                            // console.log(record.project_Type)
                            localStorage.setItem('project_id', record.key)                      
                            localStorage.setItem('project_Type', record.project_Type)                      
                            axios({
                                method: 'get',
                                url: API_URL + `/project/view/${record.key}`,
                                headers : {"accept" : `application/json`, "access-token" : `${token}`},

                            }).then((res) => {
                                if (res.data.check === true) {
                                    SetPid(res.data.data.id)
                                    // console.log(localStorage.setItem('project_Type', res.data.data.projectType))
                                    // console.log(res.data.data.projectType)
                                    console.log('프로젝트 정보 atom 저장 성공', ProjectInfo)
                            
                                } else {
                                    console.log('프로젝트 정보 atom 저장 실패')
                                }
                        })
                        window.location.replace("../Facility/Dashboard/ProjectDashboard")
                        }
                    }
                }} />
            <Column title = '구조물' dataIndex="project_Type" />
            <Column title = '상태' dataIndex="status"  />
            <Column title = '날짜' dataIndex="date" />
                <Column title='삭제' dataIndex = "delete" onCell={(record : any) => {
                    return {
                        onClick: event => {
                            let projectId = record.key
                            axios({
                                method: 'post',
                                url: `${API_URL}/project/erase`,
                                headers : {"accept" : `application/json`, "access-token" : `${token}`},
                                data :{
                                    "id":projectId
                                }
                            }).then((res) => {
                                if (res.data.check === true) {
                                    console.log("성공")
                                } else {
                                    console.log("실패")
                                }
                            })
                        }
                    }
            }}/>
        </Table>
    </div>
    );
        
}

export default Management;