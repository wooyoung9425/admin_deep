import React, { Fragment, useEffect, useState } from 'react';
import styles from '../Styles/MainMenuBar.module.css'
import { BrowserRouter, Routes, Route, NavLink, useLocation  } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../Store/State/atom'
import { ko, en } from '../translations';

function ProjectMenuBar() {

    const router = useLocation();
    const path = router.pathname;

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    const [langImg, setLangImg] = useState<string>("/images/en.png");

    // const [text, setText] = useState<PMenubar>(()=>{
    // if(language === "ko"){
    //     return {first : "대시보드", second : "프로젝트 관리", third : "통계"}
    // }else{
    //     return {first : "Dash Board", second : "Management", third : "Statistics"}
    // }
    // })

    const token = localStorage.getItem("token")

    const onClickLang = () => {
        // console.log(t.CrackMeasure);
        switch (language) {
            case "ko":
                setLang("en");
                setLangImg("/images/ko.png")
                break;
            case "en":
                setLang("ko")
                setLangImg("/images/en.png")
                break;
        }
    }

    return (
    <div className={styles.TopbarComp}>
        <div className={styles.TopbarDiv}>
        <div className={styles.Topbar}>
            <div className={styles.TopbarLogo}>
            <img src="/images/MainLogo.png" alt="Main Logo Image" />
            </div>
            <div className={styles.TopbarTrans}>
            <img className={styles.LangButton} src={langImg} alt="Language" onClick={onClickLang}/>
            {/* : <img className={styles.LangButton} src="/images/ko.png" alt="Language_Ko" onClick={() => {setLang("ko"); setText({first : "대시보드", second : "프로젝트 관리", third : "통계"})}}/>           */}
            </div>
        </div>

        {
            <div className={styles.Gnbbar}>
            <div style={{backgroundColor: path === "/Project"?"#3196E4":""}} className={styles.TopbarItem}>
                <Link to="/Project" style={{ textDecoration: 'none' }}>
                <a className={styles.TopbarText}>{t.dashBoard}</a>
                </Link>
            </div>
            <div style={{backgroundColor: path === "/Project/Management"?"#3196E4":"black"}} className={styles.TopbarItem}>
                <Link to="/Project/Management" style={{ textDecoration: 'none' }}>
                    <a className={styles.TopbarText}>{t.management}</a>
                </Link>
            </div>
            <div style={{backgroundColor: path === "/Project/Statistics"?"#3196E4":"black"}} className={styles.TopbarItem}>
                <Link to="/Project/Statistics" style={{ textDecoration: 'none' }}>
                    <a className={styles.TopbarText}>{t.statistics}</a>
                </Link>
            </div>
            </div>
        }
        </div>
    </div>
    );
}

export default ProjectMenuBar;