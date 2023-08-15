// import React, {useState, useEffect} from 'react'
import styles from '../../../Styles/Preprocess.module.css'
import { langState, projectType } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { Row } from 'antd';
import VideoUpload from './VideoUpload';
import VideoController from './VideoController';
import ImageUpload from './ImageUpload';
import ImageUploadBuilding from './ImageUploadBuilding'

export default function VideoEdit() {
  const [language, setLang] = useRecoilState(langState); 
  const t = language === "ko" ? ko : en;
  const type = localStorage.getItem("project_Type")
  console.log(type)
  
  const  selectType :any[]= [];
  const rendering = () => {
    if (type === "Tunnel") {
      selectType.push(
        <>
        <div>
            <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppVideoEdit}</p>
          <p className={styles.mainOrder}>{t.ppVideoEdit}</p>
        </div> 
        <div>
          <VideoUpload />
          <Row>
              <div className={styles.player_wrapper}>
                <VideoController />
              </div>
          </Row>
          </div>
          </>
      )
    } else if (type === "Building") {
      selectType.push(
        <div>
           <div>
            <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppImageUpload}</p>
            <p className={styles.mainOrder}>{t.ppImageUpload}</p>
          </div> 
          <ImageUploadBuilding/>
        </div>
      )
    } else {
      selectType.push(
        <div>
           <div>
            <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppImageUpload}</p>
            <p className={styles.mainOrder}>{t.ppImageUpload}</p>
          </div> 
          <ImageUpload/>
        </div>
      )
    }
    return selectType
  }
  return (
    <div>
        <div className={styles.DivArea}>
         
        { rendering()}
              
        </div>
    </div>
  )
}
