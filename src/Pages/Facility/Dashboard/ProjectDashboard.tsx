import { Carousel, Slider, Table } from 'antd';
import styled from "styled-components";
// import { useState } from 'react'
import { useRecoilState, atom , useRecoilValue} from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../Store/Global';
import {ProjectMainDashboard} from '../../../Store/Type/type';
import axios from "axios";
import moment from 'moment';
import Column from 'antd/lib/table/Column';
import ProjectDashboardPreprocess from './ProjectDashboardPreprocess';
import ProjectDashboardPanorama from './ProjectDashboardPanorama';
import ProjectDashboardMeasure from './ProjectDashboardMeasure';
import ProjectDashboardEstimation from './ProjectDashboardEstimator';
import ProjectDashboardXAI from './ProjectDashBoardXAI';

import {project_info} from'../../../Store/State/atom'




function ProjectMain() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_id = localStorage.getItem('project_id')
    const ProjectInfo = useRecoilValue(project_info)
    const project_Type = localStorage.getItem('project_Type')
    // const [ProjectInfo,SetProjectInfo] = useRecoilState<any>(project_info)
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!",project_id)
    let token: string | null = localStorage.getItem("token") 
    // console.log(ProjectInfo,'sss')

    useEffect(()=>{
        const project_id = localStorage.getItem('project_id')
        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`},
        }).then((res) => {
            if (res.data.check === true) {
            // console.log(res.data)
                   localStorage.setItem('settings',res.data.data.settings)
                   // localStorage.removeItem('project_Type')
            localStorage.setItem('project_Type', res.data.data.projectType)
            // console.log('프로젝트 정보 atom 저장 성공', ProjectInfo)
            } else {
            // console.log('프로젝트 정보 atom 저장 실패')
            }
    })
    })

    return (
    <div>

        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}></p>
                <p className={styles.mainOrder}>{t.ProjectDashboard}</p>
            </div>


            <div className='content' style={{marginBottom: "10px"}}>
                <p className={styles.subDashbord}>{t.ppPreprocessor}</p>
                <ProjectDashboardPreprocess />
            </div>


            <div className='PdPanorama' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{t.PdPanorama}</p>
                <ProjectDashboardPanorama />
            </div> 

            <div className='PdDetectorMeasure' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{project_Type==='Tunnel'?t.PdDetectorMeasure:t.dmDetectorMeasure}</p>
                <ProjectDashboardMeasure />
            </div> 

            <div className='PdDrawerEstimator' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{t.PdDrawerEstimator}</p>
                <ProjectDashboardEstimation />
            </div> 

            <div className='PdXAI' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{t.xai}</p>
                <ProjectDashboardXAI />
            </div> 

        </div>
    </div>
        )
}

export default ProjectMain;

