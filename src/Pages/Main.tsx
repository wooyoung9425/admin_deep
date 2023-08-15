import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink  } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import DeepInspector from './Main/DeepInspector';
import ContactUs from './Main/ContactUs';
import SignIn from './Main/SignIn';
import SignUp from './Main/SignUp';
import WrongAction from './WrongAction';
import MainMenuBar from '../Common/MainMenuBar';
import Footer from '../Common/Footer';
import styles from '../Styles/Main.module.css'
import axios from 'axios';
import { useRecoilState, atom } from 'recoil';
import { userState } from '../Store/State/atom'
import { API_URL } from '../Store/Global';

function Main() {

  const token = localStorage.getItem('token')
  const [userInfo, setUserInfo] = useRecoilState(userState); 
  const [tokenTest, setTokenTest] = useState(async()=>{
    console.log(token)
    if(token !== null){ 
      console.log("여기 들어옴?")
      const response = await axios({
        method : "get",
        url : `${API_URL}/account/auth/check/${token}`, 
      }).then(async(res)=>{
        if(res.data.check === true){
          console.log(res.data.data)
          setUserInfo({email : res.data.data.email, name : res.data.data.name, phone : res.data.data.phone, avatar : res.data.data.avatar, role : res.data.data.role, id : res.data.data.id, companyId : res.data.data.companyId})
          return {email : res.data.data.email, name : res.data.data.name, phone : res.data.data.phone, avatar : res.data.data.avatar, role : res.data.data.role, id : res.data.data.id, companyId : res.data.data.companyId}
        }else{
          console.log("토큰 만료")
          localStorage.removeItem('token')
          alert("토큰이 만료었습니다 다시 로그인 해주세요")
          window.location.replace("/Main")
        }
      }).catch((err)=>{
        console.log(err)
      })
    }
  })


  return (
    <Fragment>
      <MainMenuBar/>
      <Outlet/>
      <Footer/>
    </Fragment>
  );
}

export default Main;


/*
  정말 정말 정말 중요한 사항!!!!!!!!!!!!!!!!!!!!!!!!
  <Outlet />이 있어야 해당 라우팅에 따른 결과가 나온다
  이거 찾느라고 5시간 해맸네....
*/