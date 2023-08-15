import React from 'react'
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import styles from '../../../Styles/CrackDrawer_Estimator.module.css';
import DetectorDashBoard from './DetectorDashBoard'
import MeasureDashBoard from './MeasureDashBoard'
import DefectDashBoard from './DefectDashBoard'
import MetalearningDashBoard from './MetalearningDashBoard'

function DashBoard() {
  const [language, setLang] = useRecoilState(langState); 
  const project_Type = localStorage.getItem("project_Type")
  const t = language === "ko" ? ko : en;

  const list1 = ['Tunnel']
  const list2 = ['Airport', 'Dam']

  return (
    <div>

        <div className={styles.DivArea}>
          <div>
              <p className={styles.subOrder}></p>
              <p className={styles.mainOrder}>{t.cnCrackDetectorMeasure}</p>
          </div>

        {project_Type === 'Tunnel' ?
          <div>
            <div className='content' style={{marginBottom: "10px"}}>
              <p className={styles.subDashbord}>{t.CrackDetector}</p>
              <DetectorDashBoard/>
            </div>

            <div className='' style={{ marginBottom: "10px" }}>
              <p className={styles.subDashbord}>{t.CrackMeasure}</p>
              <MeasureDashBoard />
            </div>
          </div> 
          : <div></div>
        }
        {project_Type === 'Airport' ?
          <div>
            <div className='content' style={{marginBottom: "10px"}}>
              <p className={styles.subDashbord}>{t.cnCrackDetectorMeasureResult}</p>
              <DetectorDashBoard/>
            </div>
            <div className='' style={{ marginBottom: "10px" }}>
              <p className={styles.subDashbord}>{t.dmDetectorMeasureResult}</p>
              <DefectDashBoard />
            </div>
            <div className='' style={{ marginBottom: "10px" }}>
              <p className={styles.subDashbord}>{t.dmMetaLearning}</p>
              <MetalearningDashBoard />
            </div>

          </div>
          : <div></div>
        
        }
        {project_Type === 'Dam' ?
          <div>
            <div className='content' style={{ marginBottom: "10px" }}>
              <p className={styles.subDashbord}>{t.dmDefectDetector}</p>
              <DetectorDashBoard />
            </div>
            <div className='' style={{ marginBottom: "10px" }}>
              <p className={styles.subDashbord}>{t.dmDefectMeasure}</p>
              <DefectDashBoard />
            </div>
          </div>
        
          : <div></div>
        }
       </div>
     </div>
  )
}
export default DashBoard;