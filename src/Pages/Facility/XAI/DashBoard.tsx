import { Carousel, } from 'antd';
// import { useState } from 'react'
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/Panorama.module.css'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import HeatmapDashBoard from './HeatmapDashBoard';
import Captioning from './CaptioningDashBoard';
import CaptioningDashBoard from './CaptioningDashBoard';


function Dashboard() {



    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;


    return (
    <div>

        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}></p>
                <p className={styles.mainOrder}>{t.xaiDashboard}</p>
            </div>

            <div className='content' style={{marginBottom: "10px"}}>
                    <p className={styles.subDashbord}>{t.heatmap}</p>
                    <HeatmapDashBoard/>
            </div>


            <div className='PdPanorama' style={{marginBottom: "10px"}}>   
                    <p className={styles.subDashbord}>{t.captioning}</p>
                    <CaptioningDashBoard/>
            </div> 

        </div>
    </div>
        )
}

export default Dashboard