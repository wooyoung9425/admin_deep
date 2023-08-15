import { Carousel, } from 'antd';
// import { useState } from 'react'
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/Panorama.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import PanoramaDashboardImageEdit from './PanoramaDashboardImageEdit';
import PanoramaDashboardImageConfirm from './PanoramaDashboardImageConfirm';
import PanoramaDashboardVertical from './PanoramaDashboardVertical';



function PanoramaDashboard() {


    const project_Type = localStorage.getItem('project_Type')
    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;


    return (
    <div>

        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}></p>
                <p className={styles.mainOrder}>{t.PanoramaDashboard}</p>
            </div>
        {project_Type==='Tunnel'?
            <div className='content' style={{ marginBottom: "10px" }}>
                <p className={styles.subDashbord}>{t.pnImageEdit}</p>
                <PanoramaDashboardImageEdit />
            </div>
            :
            <div></div>        
        }

            <div className='PdPanorama' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{project_Type==='Tunnel' ? t.pnImageConfirm:t.pnVerticalPanorama}</p>
                <PanoramaDashboardImageConfirm />
            </div> 

            <div className='PdDetectorMeasure' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{t.pnHorizontalPanorama}</p>
                <PanoramaDashboardVertical />
            </div> 

        </div>
    </div>
        )
}

export default PanoramaDashboard