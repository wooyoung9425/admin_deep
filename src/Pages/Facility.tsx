import { Fragment, useState, useEffect } from 'react';
import { API_URL } from '../Store/Global';
import {  Outlet } from 'react-router-dom';
import Footer from '../Common/Footer';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { userState , videoURL, projectType} from '../Store/State/atom'
import TunnelNavbar from '../Common/TunnelNavbar';
import Topbar from '../Common/Topbar';
import AirportNavbar from '../Common/AirportNavbar';
import DamNavbar from '../Common/DamNavbar';
import BridgeNavbar from '../Common/BridgeNavbar';
import BuildingNavbar from '../Common/BuildingNavbar';


function Facility() {
  // const video_url = useRecoilState(videoURL);
  const token = localStorage.getItem('token')
  const projectType = localStorage.getItem('project_Type')
  const [userInfo, setUserInfo] = useRecoilState(userState); 
  const [tokenTest, setTokenTest] = useState(async()=>{
    // console.log(token)
    // console.log(ProjectType)
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

  const rendering = () => {
    const result = [];
    if(projectType === "Tunnel"){
      result.push(
        <TunnelNavbar/>
      )
    }else if(projectType === "Airport"){
      result.push(
        <AirportNavbar />
      )
    }else if(projectType === "Dam"){
      result.push(
        <DamNavbar />
      )
    } else if (projectType === "Bridge") {
      result.push(
        <BridgeNavbar/>
      )
    } else if (projectType === "Building") {
      result.push(
        <BuildingNavbar/>
      )
    }
    return result;
  }

  return (
    <>
      { rendering() }
      <Topbar/>
      <Outlet/>
    </>
  );
}

export default Facility;


/*
  정말 정말 정말 중요한 사항!!!!!!!!!!!!!!!!!!!!!!!!
  <Outlet />이 있어야 해당 라우팅에 따른 결과가 나온다
  이거 찾느라고 5시간 해맸네....
*/