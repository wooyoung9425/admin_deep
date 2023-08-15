import React, {useState, useRef, useEffect} from 'react';
import styles from '../../Styles/ContactUs.module.css'
import Footer from '../../Common/Footer';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../Store/State/atom'
import { Col, Row } from 'antd';
import { CheckSquareTwoTone } from '@ant-design/icons';

function ContactUs() {


  // 유저 입력 값을 넣을 변수
  const [checkItemContent, setCheckItemContent] = useState('');
  // 줄 수를 계산해서 저장할 변수
  const [textareaHeight, setTextareaHeight] = useState(0);
  const [language, setLang] = useRecoilState(langState); 
  const [text, setText] = useState<Array<string>>(()=>{
    if(language === "ko"){
      return ["문의", "업체명", "담당자 이름", "전화번호", "휴대폰 번호", "이메일", "제목", "상세내용", "첨부파일", "등록하기", "금액"]
    }else{
      return ["Contact Us", "Corp Name", "User", "Phone", "C.Phone", "Email", "Title", "Content", "File", "Regist", "Price"]
    }
  })

  useEffect(()=>{
    if(language === "ko"){
      setText(["문의", "업체명", "담당자 이름", "전화번호", "휴대폰 번호", "이메일", "제목", "상세내용", "첨부파일", "등록하기", "금액"])
    }else{
      setText(["Contact Us", "Corp Name", "User", "Phone", "C.Phone", "Email", "Title", "Content", "File", "Regist", "Price"])
    }
  }, [language])


  const checkItemChangeHandler = (event:any) => {
    setTextareaHeight(event.target.value.split('\n').length - 1);
    setCheckItemContent(event.target.value);
  }


  return (
    <div className={styles.DivArea}>
      <div  className={styles.ContentDiv}> 
        <div className={styles.TitleDiv}>
          <p className={styles.TitleText}>{text[10]}</p>
        </div> 

        <div className={styles.ContactInputDiv}>
          <form className={styles.formHorizontal}>
            <div className={styles.formGruoup}>
              <div style={{textAlign:"center", height:"600px"}}>
                <Row>
                  <Col span={8}>
                    <div style={{textAlign:"left"}}>
                      <label className={styles.formLabelPirce}>Basic</label>
                      <p>모든 기능을 제공합니다.</p>
                      <br/>
                      <p className={styles.pPrice}>100만원/1개월</p>
                      <div style={{fontSize:"18px"}}>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> 처리용량
                      <p className={styles.pPriceExp}>2TB/1개월</p>
                      <p className={styles.pPriceExp2}>프로젝트 전체 단계에 처리되는 데이터 용량</p>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> 처리속도
                      <p className={styles.pPriceExp}>48시간</p>
                      <p className={styles.pPriceExp2}>균열, 결함 검출 단계까지 포함(30,000장 기준)</p>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> A/S 및 지원 횟수
                      <p className={styles.pPriceExp}>2회/1개월</p>

                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{textAlign:"left"}}>
                      <label className={styles.formLabelPirce}>Premium</label>
                      <p >더 빠른 속도와 제한없는 용량을 제공합니다.</p>
                      <br/>
                      <p className={styles.pPrice}>200만원/1개월</p>
                      <div style={{fontSize:"18px"}}>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> 처리용량
                      <p className={styles.pPriceExp}>제한 없음</p>
                      <p className={styles.pPriceExp2}>프로젝트 전체 단계에 처리되는 데이터 용량</p>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> 처리속도
                      <p className={styles.pPriceExp}>24시간</p>
                      <p className={styles.pPriceExp2}>균열, 결함 검출 단계까지 포함(30,000장 기준)</p>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> A/S 및 지원 횟수
                      <p className={styles.pPriceExp}>4회/1개월</p>

                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{textAlign:"left"}}>
                      <label className={styles.formLabelPirce}>Package Solution</label>
                      <p>전체 서비스를 무제한 제공합니다.</p>
                      <br/>
                      <p className={styles.pPrice}>12,000만원</p>
                      <div style={{fontSize:"18px"}}>

                      <CheckSquareTwoTone twoToneColor="#52c41a" /> 사용조건
                      <p className={styles.pPriceExp}>Basic 요금제와 동일</p>

                      </div>
                    </div>
                  </Col>
                </Row>
                <br/>
                <br/>
                <Row>
                  <Col span={24}>
                    <div style={{textAlign:"left"}}>
                      <label className={styles.formLabelPirce}>공통사항</label>
                      <p>위 요금제 모두에게 적용되는 사항입니다.</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                  <div style={{fontSize:"18px", textAlign:"left"}}>
                    <CheckSquareTwoTone /> 추가요금
                    <p className={styles.pPriceExp}>20원/MB or 400원/이미지 수량</p>
                    <p className={styles.pPriceExp2}>계약 시 고객(기업)은 위 추가 요금 중 한 가지를 선택할 수 있습니다.</p>
                  </div>
                  </Col>
                  <Col span={8}>
                  <div style={{fontSize:"18px", textAlign:"left"}}>
                    <CheckSquareTwoTone /> 저장기간
                    <p className={styles.pPriceExp}>외관조사망도, 상태평가보고서 생성 후 1개월</p>
                    <p className={styles.pPriceExp2}>협의 가능</p>
                  </div>
                  </Col>
                  <Col span={8}>
                  <div style={{fontSize:"18px", textAlign:"left"}}>
                    <CheckSquareTwoTone /> 시설물 촬영 지원
                    <p className={styles.pPriceExp}>촬영 지원 비용 별도 발생</p>
                    <p className={styles.pPriceExp2}>협의 가능</p>
                  </div>
                  </Col>
                </Row>
              </div>
            </div>
          </form>
        </div>


        <div className={styles.TitleDiv}>
          <p className={styles.TitleText}>{text[0]}</p>
        </div>

        <div className={styles.ContactInputDiv}>
          <form className={styles.formHorizontal}>
            <div className={styles.formGruoup}>
              <label htmlFor="inputEmail" className={styles.formLabel}>{text[1]}</label>
              <div className={styles.inputDiv}>
                <input className={styles.Input} type="text" placeholder="업체명을 적어주세요"/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputUsername" className={styles.formLabel}>{text[2]}</label>
              <div className={styles.inputDiv}>
                <input type="text" className={styles.Input} placeholder=""/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputName" className={styles.formLabel}>{text[3]}</label>
              <div className={styles.inputDiv}>
                <input type="text" className={styles.Input} placeholder="02-xxxx-xxxx"/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputNumber" className={styles.formLabel}>{text[4]}</label>
              <div className={styles.inputDiv}>
                <input type="text" className={styles.Input} placeholder="010-xxxx-xxxx"/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputAddress" className={styles.formLabel}>{text[5]}</label>
              <div className={styles.inputDiv}>
                <input type="text" className={styles.Input} placeholder="email@email.com"/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputAddress" className={styles.formLabel}>{text[6]}</label>
              <div className={styles.inputDiv}>
                <input type="text" className={styles.Input} placeholder=""/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputAddress" className={styles.formLabel}>{text[7]}</label>
              <div className={styles.inputDiv}>
                <textarea onChange={checkItemChangeHandler} style={{height: ((textareaHeight + 1) * 27) + 'px'}} className={styles.InputLong} placeholder="상세내용"/>
              </div>
            </div>
            <div className={styles.formGruoup}>
              <label htmlFor="inputFile" className={styles.formLabel}>{text[8]}</label>
              <input type="file" className={styles.InputFile} multiple/>
            </div>
          </form>

          <button className={styles.RegistButton}>{text[9]}</button>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;