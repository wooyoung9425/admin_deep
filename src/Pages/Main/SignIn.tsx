import React, {Component, useEffect, useState} from 'react';
import styles from '../../Styles/SignIn.module.css'
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { LogInCheck } from '../../Store/Type/type';
import { API_URL } from '../../Store/Global';

function SignIn() {

  const [id, setId] = useState("")
  const [pass, setPass] = useState("")
  const [errorMessage, setError] = useState("")
  const [rightAccount, setRightAcccount] = useState<LogInCheck>({rightId : false , rightPass : false})
  const [result, setResult] = useState<string | boolean>("") 
  const token = localStorage.getItem("token")
  
  useEffect(()=>{
    if(token !== null){
      window.location.replace("/Main")
    }  
  }, [])

  const changeId = (e : any) => {
    setError("")                        // 에러메세지 초기화
    setId(e.target.value)               // 입력된 아이디를 받아옴
    if(e.target.value.length < 4){      // 입력받은 아이디의 길이가 4보다 작다면
      setRightAcccount({rightId : false , rightPass : rightAccount.rightPass})
    }else{
      setRightAcccount({rightId : true , rightPass : rightAccount.rightPass})
    }
  }


  const changePass = (e : any) => {
    setError("")                          // 에러메세지 초기화
    setPass(e.target.value)               // 비밀번호를 받아옴
    if(e.target.value.length < 4){        // 비밀번호의 길이가 6보다 적다면
      setRightAcccount({rightId : rightAccount.rightId , rightPass : false})
    }else{
      setRightAcccount({rightId : rightAccount.rightId , rightPass : true})
    }
  }
  

  const signInButton = async () => {
    console.log(rightAccount.rightId, rightAccount.rightPass)
    // 아이디 패스워드 둘다 같은 값이 들어가야 된다.
    if(rightAccount.rightId && rightAccount.rightPass === true){
      console.log(`받은 이메일 ${id} 받은 비밀번호${pass}`)
      const response = await axios.post(
        `${API_URL}/account/member/login`, 
        {
          email: id,
          password: pass
        }
      ).then((res)=>{
        console.log("여기 들어옴?")
        console.log(res.data)
        if(res.data.check === true){
          localStorage.setItem("token",res.data.value)
          localStorage.setItem("code", res.data.code)
          alert(`환영합니다 ${id}님!`)
          window.location.replace("/Main/MyInfo")
        }else{
          setResult(false)
          setError("일치하는 아이디/비밀번호가 없습니다")
        }
        //localStorage.setItem("token",res.data)
        //window.location.replace("/")
        //window.location.reload();
      }).catch((err)=>{
        console.log(err)
      })
    }else{
      setResult(false)
      setError("올바른 아이디 또는 비밀번호를 입력해 주세요!")
    }
  }


  return (
    <div className={styles.loginBlock}>
      <div className={styles.headerTextBox}>
        <h1 className={styles.headerText}>로그인</h1>
      </div>
      <div className={styles.signInBox}>
        <TextField onChange={changeId} className={styles.idInput} label="ID" placeholder="Ex) aaaa@aaaa.com" />
        <div className={styles.space}></div>
        <TextField onChange={changePass} className={styles.passInput} label="Password" type="password" placeholder="Ex) ****"/>
        <div className={styles.space}></div>
        <button onClick={signInButton} className={styles.signInButton}>Sign In</button>
        <div className={styles.loginFail}>{result === false ? errorMessage : ""}</div>
      </div>
    </div>
  );
}

export default SignIn;