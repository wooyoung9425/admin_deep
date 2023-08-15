import React, {useState, useEffect} from 'react';
import styles from '../../Styles/SignUp.module.css'
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { LogInCheck, SignUpCheck } from '../../Store/Type/type';
import { API_URL } from '../../Store/Global';

function SignUp() {


  const [id, setId] = useState("")
  const [pass, setPass] = useState("")
  const [passCheck, setPassCheck] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [errorMessage, setError] = useState("")
  const [rightAccount, setRightAcccount] = useState<SignUpCheck>({rightId : false , rightPass : false, rightPassCheck : false, rightName : false, rightPhone : false})
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
      setRightAcccount({rightId : false , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
    }else{
      if(e.target.value.includes("@") && e.target.value.includes(".")){
        setRightAcccount({rightId : true , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
      }else{
        setRightAcccount({rightId : false , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
      }
    }
  }

  const changePass = (e : any) => {
    setError("")                          // 에러메세지 초기화
    setPass(e.target.value)               // 비밀번호를 받아옴
    if(e.target.value.length < 4){        // 비밀번호의 길이가 4보다 적다면
      setRightAcccount({rightId : rightAccount.rightId , rightPass : false, rightPassCheck : rightAccount.rightPassCheck, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
    }else{
      if(e.target.value !== passCheck){
        setRightAcccount({rightId : rightAccount.rightId , rightPass : true, rightPassCheck : false, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
      }else{
        setRightAcccount({rightId : rightAccount.rightId , rightPass : true, rightPassCheck : true, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
      }
    }
  }

  const changePassCheck = (e : any) => {
    setError("")                           // 에러메세지 초기화
    setPassCheck(e.target.value)           // 비밀번호 체크를 받아옴 
    if(pass !== e.target.value){                // 비밀번호 === 비밀버호 체크가 같지 않다면 
      setRightAcccount({rightId : rightAccount.rightId , rightPass : rightAccount.rightPass, rightPassCheck : false, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
    }else{
      setRightAcccount({rightId : rightAccount.rightId , rightPass : rightAccount.rightPass, rightPassCheck : true, rightName : rightAccount.rightName, rightPhone : rightAccount.rightPhone})
    }
  }

  const changeName = (e : any) => {
    setError("")
    setName(e.target.value)
    if(e.target.value.length < 2){
      setRightAcccount({rightId : rightAccount.rightId , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : false, rightPhone : rightAccount.rightPhone})
    }else{
      setRightAcccount({rightId : rightAccount.rightId , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : true, rightPhone : rightAccount.rightPhone})
    }
  }

  const changePhone = (e: any) => {
    setError("")
    setPhone(e.target.value)
    console.log("들어오는 폰번 길이 : ", e.target.value)
    if(e.target.value.length === 11){
      setRightAcccount({rightId : rightAccount.rightId , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : rightAccount.rightName, rightPhone : true})
    }else{
      setRightAcccount({rightId : rightAccount.rightId , rightPass : rightAccount.rightPass, rightPassCheck : rightAccount.rightPassCheck, rightName : rightAccount.rightName, rightPhone : false})
    }
  }
  
  const signUpButton = async () => {
    console.log(rightAccount.rightId, rightAccount.rightPass, rightAccount.rightPassCheck, rightAccount.rightName, rightAccount.rightPhone)
    console.log(`받은 이메일 ${id} / 받은 비밀번호${pass} / 받은 비밀번호 확인${passCheck} / 받은 이름 ${name} / 받은 폰번 ${phone}`)
    console.log("!!!!!!!!!!!!!!!!!!!!!")
    // 아이디 패스워드 둘다 같은 값이 들어가야 된다.
    if(rightAccount.rightId && rightAccount.rightPass && rightAccount.rightPassCheck && rightAccount.rightName && rightAccount.rightPhone === true){
      console.log(`받은 이메일 ${id} / 받은 비밀번호${pass} / 받은 비밀번호 확인${passCheck} / 받은 이름 ${name} / 받은 폰번 ${phone}`)
      const response = await axios.post(
        `${API_URL}/account/member/regist`, {
        email : id, 
        password : pass, 
        name : name, 
        phone : phone, 
        // avatar : "", 
        // companyId : 1
      }).then((res)=>{
        console.log("여기 들어옴?")
        console.log(res.data)
        if(res.data.check === true){
          alert(`처음 만나서 반갑습니다 ${id}님!`)
          window.location.replace("/Main")
        }else{
          setResult(false)
          setError("서버장애로 회원가입에 실패했습니다 관리자에게 문의해주세요1111111")
        }
        //localStorage.setItem("token",res.data)
        //window.location.replace("/")
        //window.location.reload();
      }).catch((err)=>{
        console.log(err)
        setResult(false)
        setError("서버장애로 회원가입에 실패했습니다 관리자에게 문의해주세요")
      })
    }else{
      setResult(false)
      if(rightAccount.rightId === false){
        setError("올바른 아이디 형식을 입력해 주세요")
      }else if(rightAccount.rightPass === false){
        setError("비밀번호는 최소 4자리 이상 입력해주세요")
      }else if(rightAccount.rightPassCheck === false){
        setError("비밀번호와 비밀번호 확인이 맞지 않습니다")
      }else if(rightAccount.rightName === false){
        setError("이름은 최소 2자리 이상 입력해주세요")
      }else if(rightAccount.rightPhone === false){
        setError("전화번호는 휴대전화를 입력해주세요")
      }
      
    }
  }




  return (
    <div className={styles.signUpBlock}>
      <div className={styles.headerTextBox}>
        <h1 className={styles.headerText}>회원가입</h1>
      </div>
      <div className={styles.signUpBox}>
        <TextField onChange={changeId} className={styles.idInput} label="ID" placeholder="Ex) aaaa@aaaa.com" />
        <div className={styles.space}></div>
        <TextField onChange={changePass} className={styles.passInput} label="Password" type="password" placeholder="Ex) ****"/>
        <div className={styles.space}></div>
        <TextField onChange={changePassCheck} className={styles.passInput} label="Password Check" type="password" placeholder="Ex) ****"/>
        <div className={styles.space}></div>
        <TextField onChange={changeName} className={styles.nameInput} label="Name" placeholder="Ex) 바이든" />
        <div className={styles.space}></div>
        <TextField onChange={changePhone} className={styles.phoneInput} label="Phone" placeholder="Ex) 01099999999" />
        <div className={styles.space}></div>
        <button onClick={signUpButton} className={styles.signUpButton}>Sign In</button>
        <div className={styles.signUpFail}>{result === false ? errorMessage : ""}</div>
      </div>
    </div>
  );
}

export default SignUp;