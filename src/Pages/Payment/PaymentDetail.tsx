import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequestPayParams, RequestPayResponse } from 'iamport-typings';
import { Table } from 'antd';
import Column from 'antd/lib/table/Column';
import './payment.css'

function PaymentDetail() {

  const [tab, setTab] = useState<string>('count');
  const [data, setData] = useState<RequestPayParams>();

  const list: any[] = [
    {
        "id": 1,
        "title":"화곡 터널",
        "count" : 506,
        "amount":3852.39,
        "count_value": 202400,
      "amount_value": 231143
    },
    {
      "id": 2,
      "title":"당인교",
      "count" : 1102,
      "amount":14012,
      "count_value": 11020000,
      "amount_value": 11209736
    },
    {
      "id": 3,
      "title":"보현산댐",
      "count" : 288,
      "amount":3791.6,
      "count_value": 6912000,
      "amount_value": 6824880
    },
  ]

  const onClickPayment = () => {
    console.log("결제 요청")
    if (!window.IMP) return;
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp19424728"); // 가맹점 식별코드

    /* 2. 결제 데이터 정의하기 */
    const data: RequestPayParams = {
      pg: "html5_inicis", // PG사 : https://portone.gitbook.io/docs/sdk/javascript-sdk/payrq#undefined-1 참고
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 6912000, // 결제금액
      name: "현대건설 3월 과금 청구(이미지 수)", // 주문명
      buyer_name: "김현주", // 구매자 이름
      buyer_tel: "01012341234", // 구매자 전화번호
      buyer_email: "hskim@deepinspection.ai", // 구매자 이메일
      buyer_addr: "신사동 661-16", // 구매자 주소
      buyer_postcode: "06018", // 구매자 우편번호
    };

    const data2: RequestPayParams = {
      pg: "html5_inicis", // PG사 : https://portone.gitbook.io/docs/sdk/javascript-sdk/payrq#undefined-1 참고
      pay_method: "card", // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 6824880, // 결제금액
      name: "현대건설 3월 과금 청구(용량)", // 주문명
      buyer_name: "김현주", // 구매자 이름
      buyer_tel: "01012341234", // 구매자 전화번호
      buyer_email: "hskim@deepinspection.ai", // 구매자 이메일
      buyer_addr: "신사동 661-16", // 구매자 주소
      buyer_postcode: "06018", // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    if(tab === 'count') {
      IMP.request_pay(data, callback);
    }
    else if(tab === 'amount') {
      IMP.request_pay(data2, callback);
    }
    else {
      alert("오류가 있습니다")
    }

    
    
  };

  /* 3. 콜백 함수 정의하기 */
  function callback(response: RequestPayResponse) {
    const { success, error_msg } = response;

    if (success) {
      alert("결제 성공");
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }

  return (
    <div className='payment-detail'>
      <div className='payment-layout'>
        <div className='payment-title'>
          결제 관리
        </div>
        <div className='payment-content'>
          <div className='subscribe'>
              <div className='subscribe-title'>
                구독 정보
              </div>
              <div className='subscribe-content'>
                <div className='sub-title'>
                  <span className="material-symbols-outlined">
                    card_membership
                  </span>
                    Premium
                </div>
                <div className='sub-content'>
                  <div className='sub-box'>
                    <div className='sub-name'>이용권 종류</div>
                    <div className='sub-value'>프리미엄 (Premium)</div>
                  </div>
                  <div className='sub-box'>
                    <div className='sub-name'>이용 기간</div>
                    <div className='sub-value'>2023.03.01 ~ 2023.03.31</div>
                  </div>
                  <div className='sub-box'>
                    <div className='sub-name'>이용 금액</div>
                    <div className='sub-value'>2,000,000 원</div>
                  </div>
                  <div className='sub-box'>
                    <div className='sub-name'>다음 결제 예정일</div>
                    <div className='sub-value'>2023.04.01</div>
                  </div>
                </div>
                <div className='termination-btn'>
                  해지 신청하기 &nbsp; &nbsp; &rsaquo;
                </div>
              </div>
          </div>
          <div className='billing'>
              <div className='billing-title'>
                과금 현황 <span>(2023.03.01 ~ 2023.03.31)</span>
              </div>
              <div className='billing-content'>
                <div className='billing-standard'>
                  <div className='standard-title'>과금 기준</div>
                  <div className='standard-content'>
                    <div className={`count-btn ${tab === 'count' ? 'active' : ''}`} onClick={() => setTab('count')}>
                      이미지 수
                    </div>
                    <div className={`amount-btn ${tab === 'amount' ? 'active' : ''}`} onClick={() => setTab('amount')}>
                      용량
                    </div>
                  </div>
                </div>
                <div className='billing-value'>
                  <div className='value-data'>
                    {tab==='count' ? "288 장" : "3791.6 MB"}
                  </div>
                  <div className='payment-data'>
                    {tab==='count' ? "6,912,000 원" : "6,824,880 원"}
                  </div>
                </div>
                <div className='payment-value'>
                  <div className='limit-date'>
                    과금 청구 예정일 : 2023.04.01
                  </div>
                  <div className='payment-btn' onClick={onClickPayment}>
                    과금 결제하기
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div className='payment-list'>
            <div className='used-title'>
                사용 내역 <span>(2023.03.01 ~ 2023.03.31)</span>
            </div>
            <div className='used-table'>
                <Table dataSource={list} size="small" scroll={{ y: 200 }} pagination={false} >
                    <Column title = 'No.' dataIndex="id"  />
                    <Column title = '프로젝트 명' dataIndex="title"  />
                    <Column title = '이미지 수' dataIndex="count" />
                    <Column title = '용량(MB)' dataIndex="amount"  />
                    <Column title = '과금(이미지)' dataIndex="count_value" />
                    <Column title = '과금(용량)' dataIndex="amount_value" />
                </Table>
            </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetail;
