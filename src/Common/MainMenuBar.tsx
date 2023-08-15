import React, { Fragment, useEffect, useState } from 'react';
import styles from '../Styles/MainMenuBar.module.css'
import { BrowserRouter, Routes, Route, NavLink, useLocation  } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../Store/State/atom'
import { ko, en } from '../translations';
import { Menubar, WordSet, TransLang} from '../Store/Type/type';

function MainMenuBar() {

  const router = useLocation();
  const path = router.pathname

  const [language, setLang] = useRecoilState(langState); 
  const t = language === "ko" ? ko : en;

  const [langImg, setLangImg] = useState<string>("/images/en.png");

  const token = localStorage.getItem("token")
  console.log(token);


  /*const [text, setText] = useState<Menubar>(()=>{
    if(language === "ko"){
      return {first : "딥 인스펙터", second : "문의", third : "로그인", fourth : "회원가입", fifth : "내 정보", sixth : "프로젝트"}
    }else{
      return {first : "Deep Inspector", second : "Contact Us", third : "Sign In", fourth : "Sign Up", fifth : "My Info", sixth : "Project"}
    }
  })*/
  
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
          </div>
        </div>


        {
          token === null 
          ?
        <div className={styles.Gnbbar}>
          <div style={{backgroundColor: path === "/Main"?"#3196E4":""}} className={styles.TopbarItem}>
            <Link to="/Main" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langAboutUs}</a>
            </Link>
          </div>
          <div style={{backgroundColor: path === "/Main/contactUs"?"#3196E4":"black"}} className={styles.TopbarItem}>
            <Link to="/Main/contactUs" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langContactUs}</a>
            </Link>
          </div>
          <div style={{backgroundColor: path === "/Main/SignIn"?"#3196E4":"black"}} className={styles.TopbarItem}>
            <Link to="/Main/SignIn" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langLogin}</a>
            </Link>
          </div>
          <div style={{backgroundColor: path === "/Main/SignUp"?"#3196E4":"black"}} className={styles.TopbarItem}>
            <Link to="/Main/SignUp" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langRegister}</a>
            </Link>
          </div>
        </div> 
        :
        <div className={styles.Gnbbar}>
          <div style={{backgroundColor: path === "/Main"?"#3196E4":""}} className={styles.TopbarItem}>
            <Link to="/Main" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langAboutUs}</a>
            </Link>
          </div>
          <div style={{backgroundColor: path === "/Main/contactUs"?"#3196E4":"black"}} className={styles.TopbarItem}>
            <Link to="/Main/contactUs" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langContactUs}</a>
            </Link>
          </div>
          <div style={{backgroundColor: path === "/Main/MyInfo"?"#3196E4":"black"}} className={styles.TopbarItem}>
            <Link to="/Main/MyInfo" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langMyInfo}</a>
            </Link>
          </div>
          <div style={{backgroundColor: path === "/Project"?"#3196E4":"black"}} className={styles.TopbarItem}>
            <Link to="/Project" style={{ textDecoration: 'none' }}>
              <a className={styles.TopbarText}>{t.langProject}</a>
            </Link>
          </div>
        </div> 
      }

      </div>
    </div>
  );
}

export default MainMenuBar;








/*

function MainMenuBar() {
  return (
    <Fragment>
      <ul>
        <Link to="/Main">딥 인스펙터</Link>
        <Link to="/Main/contactUs">문의</Link>
        <Link to="/Main/signIn">로그인</Link>
        <Link to="/Main/signUp">회원가입</Link>
      </ul>
    </Fragment>
  );
}


*/