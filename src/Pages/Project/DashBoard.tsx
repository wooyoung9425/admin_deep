import React, { Fragment, useEffect, useState } from 'react';
import styles from '../Styles/MainMenuBar.module.css'
import { BrowserRouter, Routes, Route, NavLink, useLocation  } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../Store/State/atom'
import { PMenubar } from '../../Store/Type/type';
import ProjectInpormation from './ProjectInpormation';
import CreditStatus from './CreditStatus';
import ErrorNotification from './ErrorNotification';

function DashBoard() {

    const router = useLocation();
    const path = router.pathname
    const [language, setLang] = useRecoilState(langState); 
    const [text, setText] = useState<PMenubar>(()=>{
    if(language === "ko"){
        return {first : "딥 인스펙터", second : "문의", third : "로그인"}
    }else{
        return {first : "Deep Inspector", second : "Contact Us", third : "Sign In"}
    }
    })
    const token = localStorage.getItem("token")

    return (
    <div>
        <ProjectInpormation />
        <div style={{display: "flex"}}>
        <CreditStatus />
        <ErrorNotification />
        </div>
    </div>
    );
}

export default DashBoard;