import { Carousel, Slider } from 'antd';
// import { useState } from 'react'
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/Preprocess.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useEffect, useState } from 'react';
import PreprocessDashboardVideoUpload from './PreprocessDashboardVideoUpload';
import PreprocessDashboardVideoEdit from './PreprocessDashboardVideoEdit';
import PreprocessDashboardImagetask from './PreprocessDashboardImagetask';
import PreprocessDashboardJtag from './PreprocessDashboardJtag';
import PreprocessDashboardJtagConfirm from './PreprocessDashboardJtagConfirm';
import { ppid } from 'process';

function PreprocessorDashboard() {


    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const project_Type = localStorage.getItem("project_Type")
    
    return (
    <div>

        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}></p>
                <p className={styles.mainOrder}>{t.PreprocessorDashboard  }</p>
            </div>

            {/* <div className='content' style={{marginBottom: "10px"}}>
                <p className={styles.subDashbord}>{t.ppVideoUpload}</p>
                <PreprocessDashboardVideoUpload />
            </div> */}


            <div className='PdPanorama' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{project_Type==='Tunnel'?t.ppVideoEdit:t.ppImageUpload}</p>
                <PreprocessDashboardVideoEdit />
                
            </div> 

            <div className='PdDetectorMeasure' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{project_Type==='Tunnel'?t.ppImageTask:t.ppImageFilter}</p>
                <PreprocessDashboardImagetask />
            </div> 

            <div className='PdDrawerEstimator' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{project_Type==='Tunnel'?t.ppJTag:t.ppDistFolder}</p>
                <PreprocessDashboardJtag />
            </div> 
            
        {project_Type === 'Tunnel' ?
            <div className='PdDrawerEstimator' style={{ marginBottom: "10px" }}>
                <p className={styles.subDashbord}>{t.ppJTagConfirm}</p>
                <PreprocessDashboardJtagConfirm />
            </div> 
            : <div></div>        
        }
        </div>
    </div>
        )
}

export default PreprocessorDashboard;

