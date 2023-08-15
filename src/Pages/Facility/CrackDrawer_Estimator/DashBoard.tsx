import React from 'react'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/CrackDrawer_Estimator.module.css'
import { Carousel, Radio } from 'antd';
import CrackDrawerDashboard from './CrackDrawerDashboard';
import StateEstimateDashboard from './StateEstimateDashboard';
import DownloadDashboard from './DownloadDashboard';

export default function Dashboard() {
  const [language, setLang] = useRecoilState(langState); 
  const t = language === "ko" ? ko : en;
  return (
    <div>

        <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}></p>
                <p className={styles.mainOrder}>{t.DrawerEstimatorDashbord}</p>
            </div>


            <div className='content' style={{marginBottom: "10px"}}>
                <p className={styles.subDashbord}>{t.csCrackDrawer}</p>
                <CrackDrawerDashboard/>
            </div>


            <div className='PdPanorama' style={{marginBottom: "10px"}}>   
                <p className={styles.subDashbord}>{t.csStateEstimator}</p>
                <StateEstimateDashboard/>
            </div> 

            {/* <div className='PdDetectorMeasure' style={{marginBottom: "10px"}}>   
                  <p className={styles.subDashbord}>{t.download}</p>
                  <DownloadDashboard/>
            </div>  */}

            

        </div>
    </div>
  )
}
