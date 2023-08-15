import React, { Fragment, useEffect, useState } from 'react'
import styles from '../Styles/Footer.module.css'
import { useRecoilState, atom } from 'recoil';
import { langState } from '../Store/State/atom'
import { Menubar } from '../Store/Type/type';

export default function Footer() {

  const [language, setLang] = useRecoilState(langState); 

  return (
    <div className={styles.FooterDiv}>
      <div className={styles.Footer}>
        {
          language === "ko"
          ?
          <div className={styles.FooterTextDiv}>
            <p>(주)딥인스펙션 대표자 이철희 사업자등록번호 806-81-00125 팩스번호 070-4009-2284</p>
            <p>주소 [본사]대전광역시 유성구 가정로 218, 301-1호(가정동, 융합기술연구생산센터) [서울지사]서울특별시 송파구 법원로11길 25 H비지니스파크 A동 1314호, 1315호</p>
            <p>[기술연구소] 서울특별시 서초구 매현로 16, 양재R&D혁신허브(하이브랜드 빌딩) 1209호 이메일 tm@deepinspection.ai</p>
            <p>Copyright © 2022 DeepInspection. All rights reserved.</p>
          </div>
          :
          <div className={styles.FooterTextDiv}>
            <p>Cheol-hee Lee, CEO of Deep Inspection Co., Ltd. Business registration number 070-4009-228</p>
            <p>Address [Headquarters] Room 301-1, 218, Gajeong-ro, Yuseong-gu, Daejeon (Gajeong-dong, Convergence Technology Research and Production Center) [Seoul Branch] H Business Park #1314, #1315</p>
            <p>[Technology Research Center] Room 1209, Yangjae R&D Innovation Hub (High Brand Building), 16 Maehyeon-ro, Seocho-gu, Seoul E-mail tm@deepinspection.ai</p>
            <p>Copyright © 2022 DeepInspection. All rights reserved.</p>
          </div>
        }
        
      </div>
    </div>
  )
}
