import { Fragment, useState } from 'react';
import {  Outlet } from 'react-router-dom';
import ProjectMenuBar from '../Common/ProjectMenuBar';
import Footer from '../Common/Footer';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { userState } from '../Store/State/atom'
import { API_URL } from '../Store/Global';

function Project() {

  const token = localStorage.getItem('token')
  const [userInfo, setUserInfo] = useRecoilState(userState); 
  const [tokenTest, setTokenTest] = useState(async()=>{
    console.log(token)
    if(token !== null){ 
      console.log("토큰확인")
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
      <ProjectMenuBar/>
      <Outlet/>
      <Footer/>
    </Fragment>
  );
}

export default Project;


/*
  정말 정말 정말 중요한 사항!!!!!!!!!!!!!!!!!!!!!!!!
  <Outlet />이 있어야 해당 라우팅에 따른 결과가 나온다
  이거 찾느라고 5시간 해맸네....
*/