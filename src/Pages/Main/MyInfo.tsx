import React, {useState, useEffect} from 'react';
import styles from '../../Styles/MyInfo.module.css'
import { useRecoilState, atom } from 'recoil';
import { userState } from '../../Store/State/atom'
import axios from 'axios';
import { langState } from '../../Store/State/atom'
import { API_URL } from '../../Store/Global'
import { resolveAny } from 'dns';
import { Form, Row, Col, Button } from 'antd';
import {Gauge} from '@ant-design/plots';

function MyInfo() {
  
  const token = localStorage.getItem("token")
  const [userInfo, setUserInfo] = useRecoilState(userState); 
  const [EditInfoConfirm,setEditInfoConfirm]=useState<boolean>(false)

  let logout = async() => {

    localStorage.removeItem("token")
    window.location.replace("/Main/SignIn")

    // const response = await axios({
    //   method : "get",
    //   url : `${API_URL}/Auth/Logout`,
    //   headers : { "access-token" : `${token}` }
    // }).then(async(res)=>{
    //   if(res.data.check === true){
    //     setUserInfo({email : "", name : "", phone : "", avatar : "", role : "", id : -1, companyId : -1})
    //     localStorage.removeItem("token")
    //     alert("안녕히가세요 :)")
    //     window.location.replace("/Main")
    //   }else{
    //     console.log(res.data)
    //   }
    // }).catch((err)=>{
    //   console.log("err : ",err)
    // })
  }

  const EditInfo = async (e: any) => {
    if(EditInfoConfirm === false) { //정보수정페이지
      setEditInfoConfirm(true)
    } else { // 내정보 
      
      // 정보 수정
      await axios({
        method: 'post',
        url:API_URL+`/account/member/edit/${userInfo.id}`,
        headers: { "accept" : `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
        // params: { 'userId': userInfo.id},
        data: {
          // email: userInfo.email,
          name: userInfo.name,
          phone: userInfo.phone,
          role: userInfo.role,
          // avatar: userInfo.avatar,
          // companyId: userInfo.companyId
        }
      }).then((res) => {
        if (res.data.check === true) {
          alert("지금 정보로 수정 하시겠습니까?")
          console.log("개인정보수정 완료")
          setEditInfoConfirm(false)
        } else {
          console.log("개인정보수정 실패")
          alert("수정 실패")
        }
      }).catch((err) => {console.log(err) })
    }
    console.log(userInfo)
   
  }

  const onchange = (e: any) => {
    console.log(e.target.id)
    setUserInfo({
      ...userInfo,
      [e.target.id]:e.target.value
    })
    
  }

  const DemoGaugeGPU = () => {
    const config : any = {
      percent: 0.7,
      range: {
        color: "l(0) 0:#B8E1FF 1:#3D76DD"
      },
      startAngle: Math.PI,
      endAngle: 2 * Math.PI,
      indicator: null,
      statistic: {
        title: {
          offsetY: 0,
          style: {
            fontSize: "40px",
            marginTop:"-70px",
            color: "#4B535E"
          },
          formatter: () => "70%"
        },
        content: {
          style: {
            fontSize: "24px",
            color: "#4B535E"
          },
          formatter: () => "GPU"
        }
      }
    };
    return <Gauge {...config} />;
  };

  const DemoGaugeCPU = () => {
    const config : any = {
      percent: 0.5,
      range: {
        color: "l(0) 0:#B8E1FF 1:#3D76DD"
      },
      startAngle: Math.PI,
      endAngle: 2 * Math.PI,
      indicator: null,
      statistic: {
        title: {
          offsetY: 0,
          style: {
            fontSize: "40px",
            marginTop:"-70px",
            color: "#4B535E"
          },
          formatter: () => "50%"
        },
        content: {
          style: {
            fontSize: "24px",
            color: "#4B535E"
          },
          formatter: () => "CPU"
        }
      }
    };
    return <Gauge {...config} />;
  };

  const DemoGaugeStorage = () => {
    const config : any = {
      percent: 0.8,
      range: {
        color: "l(0) 0:#B8E1FF 1:#3D76DD"
      },
      startAngle: Math.PI,
      endAngle: 2 * Math.PI,
      indicator: null,
      statistic: {
        title: {
          offsetY: 0,
          style: {
            fontSize: "40px",
            marginTop:"-70px",
            color: "#4B535E"
          },
          formatter: () => "80%"
        },
        content: {
          style: {
            fontSize: "24px",
            color: "#4B535E"
          },
          formatter: () => "Storage"
        }
      }
    };
    return <Gauge {...config} />;
  };
  
  return (
    <div className={styles.DivArea}>
      <div  className={styles.ContentDiv}>
      <div className={styles.userInfo}>
        {EditInfoConfirm === false ?
          <>
              <div className={styles.userDiv}>
                <h1>내 정보</h1>
              </div>
              <div className={styles.userInfoBox}>
                  <p>이메일 : {userInfo.email}</p>
                  <p>이름 : {userInfo.name}</p>
                  <p>전화번호 : {userInfo.phone}</p>
                  <p>직책 : {userInfo.role}</p>
              </div>
              
          </> :
          <>
            <div className={styles.userDiv}>
              <h1>내 정보 수정</h1>
            </div>
            <div className={styles.userInfoBox}>
              <Form className={styles.userinfoForm}>
                <Form.Item label='이메일 ' className={styles.userinfoFormItem}>
                  <input type="text" placeholder={String(userInfo.email)} onChange={onchange} id="email" className={styles.userinfoInput} />
                </Form.Item>
                <Form.Item label='이름 ' className={styles.userinfoFormItem}>
                  <input type="text" placeholder={String(userInfo.name)} onChange={onchange} id="name" className={styles.userinfoInput} />
                </Form.Item>
                <Form.Item label='전화번호 ' className={styles.userinfoFormItem}>
                  <input type="text" placeholder={String(userInfo.phone)} onChange={onchange} id="phone" className={styles.userinfoInput}/>
                </Form.Item>
                <Form.Item label='직책 ' className={styles.userinfoFormItem}>
                  <input type="text" placeholder={String(userInfo.role)} onChange={onchange} id="role" className={styles.userinfoInput}/>
                </Form.Item>
              </Form>
            </div>
          </>
        }
          <div> 
          <Button onClick={EditInfo} style={{marginRight:"10px"}}>{EditInfoConfirm ===false? "정보 수정":"저장"}</Button>
          <Button onClick={logout} style={{marginLeft:"10px"}}>로그아웃</Button>
          {/* <button onClick={EditInfo} className={styles.userInfoButton} >{EditInfoConfirm ===false? "정보 수정":"저장"}</button>
          <button onClick={logout} className={styles.userInfoButton}>로그아웃</button> */}
        </div>

        <br/>
        <br/>

        {/* 데이터 요금 청구 내역 */}
        <div className={styles.userDiv}>
          <h1 style={{marginBottom:"-50px"}}>데이터 사용량 및 부과 요금</h1>
        </div>
        <div style={{width:"60%", height:"300px"}}>
          <Row>
            <Col span={7}>
              <DemoGaugeGPU/>
            </Col>
            <Col span={1}/>
            <Col span={7}>
              <DemoGaugeCPU/>
            </Col>
            <Col span={1}/>
            <Col span={7}>
              <DemoGaugeStorage/>
            </Col>
          </Row>
        </div>
        <br/>
        <br/>
        <div style={{width:"60%"}}>
          <Row>
            <Col span={6}/>
            <Col span={6} className={styles.pPrice}>
            3월 청구 예정 금액 :
            </Col>
            <Col span={6} className={styles.pPriceExp2}>
            2,503,200원
            </Col>
            <Col span={6}/>
          </Row>
        </div>
      </div>
      </div>
    </div>
  );
}

export default MyInfo;