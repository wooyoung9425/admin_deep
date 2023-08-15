import React from 'react';
import { BrowserRouter, Routes, Route, Link  } from 'react-router-dom';
import styles from '../../Styles/DeepInspection.module.css'



function DeepInspector() {


  

  return (
    <div className={styles.DivArea}>
      <div className={styles.ContentDiv2}>
        <div className={styles.TitleDiv}>
          <p className={styles.TitleText}>프로그램 소개</p>
        </div>
        
        <div>
          <div className={styles.DeepInspectorItem1}>
            <div data-aos="fade-up" data-aos-duration="1000">
              <div className={styles.DeepInspectorItemDiv}>
                <p className={styles.DeepInspectorText1}>AI기반 SW개발</p>
                <p className={styles.DeepInspectorText2}>AI기반 SW개발</p>
                <p className={styles.DeepInspectorText3}>AI기반의 딥러닝 알고리즘 &quot;Crack Detector&quot;, <br /> &quot;Defect Detector&quot;를 개발, 해당 기술을 사용하기 위한<br/> 서비스를 지원하고 있습니다.</p>
                <a href="http://deepinspection.ai/bbs/content.php?co_id=0101">
                  <button>Read More</button>
                </a>
              </div>
                    
              <div className={styles.DeepInspectorImg} data-aos="fade-up" data-aos-duration="1000">
                <img src="/images/main/main1.png" alt="" width={500} height={340}></img>
              </div>
            </div>
          </div>

          <div className={styles.DeepInspectorItem2}>
            <div data-aos="fade-up" data-aos-duration="1000">
              <div className={styles.DeepInspectorItemDiv}>
                <p className={styles.DeepInspectorText1}>터널 스캐너</p>
                <p className={styles.DeepInspectorText2}>Deep Scanner</p>
                <p className={styles.DeepInspectorText3}>터널의 2D 영상데이터 수집을 위해 <br /> 4K 카메라 10대와 20대의 LED 조명을 장착한<br/> 2.5톤 차량을 개발하여 지원하고 있습니다.</p>
                <a href="http://deepinspection.ai/bbs/content.php?co_id=0102">
                  <button>Read More</button>
                </a>
              </div>
              <div className={styles.DeepInspectorImg} data-aos="fade-up" data-aos-duration="1000">
                <img src="/images/main/main2.png" alt="" width={500} height={340}></img>
              </div>
            </div>
          </div>

          <div className={styles.DeepInspectorItem1}>
            <div data-aos="fade-up" data-aos-duration="1000">
              <div className={styles.DeepInspectorItemDiv}>
                <p className={styles.DeepInspectorText1}>HPC Performance Computing</p>
                <p className={styles.DeepInspectorText2}>HPC System</p>
                <p className={styles.DeepInspectorText3}>Infiniband 네트워크를 활용한 대규모 딥러닝 <br /> 고속 분산학습 기술 , 컴퓨팅 파워를 이용하여 복잡한 작업을<br/> 더욱 빠르고 효율적으로 수행.</p>
                <a href="http://deepinspection.ai/bbs/content.php?co_id=0104">
                  <button>Read More</button>
                </a>
              </div>
              <div className={styles.DeepInspectorImg} data-aos="fade-up" data-aos-duration="1000">
                <img src="/images/main/main3.png" alt="" width={500} height={340}></img>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DeepInspector;