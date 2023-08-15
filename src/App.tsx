import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import styles from './Styles/App.module.css'
import 'antd/dist/antd.css';

function App() {

  return (
    <div className={styles.DivArea}>
      <video className={styles.videoDiv} src="/videos/MainVideo.mp4" muted autoPlay loop></video>
      <div className={styles.textDiv}>
        <div className={styles.indexLogo}>
          <img src="/images/MainLogo.png" alt="Main Logo Image" />
        </div>

        <div className={styles.subTextDiv1}>
          <p className={styles.text1}>AI기술을 통한<br /> 안전 점검 프로그램의 새로운 기준</p>
        </div>

        <div className={styles.subTextDiv2}>
          <p className={styles.text2}>딥인스펙션은 웹 기반 안전점검 프로그램을 제공합니다.<br />프로그램을 통해 딥인스펙션의 혁신적인 AI기술력을 체험해보세요.</p>
        </div>

        <div className={styles.subTextDiv3}>
          <Link to="/Main" style={{ textDecoration: 'none' }}>
            <div className={styles.text3}>Start</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;





/*

import React from 'react';

function App() {
  return (
    <div className="App">
      <button>Start</button>
    </div>
  );
}

export default App;


*/