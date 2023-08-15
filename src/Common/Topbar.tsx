import styles from '../Styles/Navbar.module.css'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useRecoilState, atom } from 'recoil';
import { langState } from '../Store/State/atom'
import { ko, en } from '../translations';

export default function Topbar() {

  const [langImg, setLangImg] = useState<string>("/images/en.png");
  const [language, setLang] = useRecoilState(langState); 
  const t = language === "ko" ? ko : en;

  const onClickLang = () => {
    // console.log(t.CrackMeasure);
    switch (language) {
        case "ko":
            setLang("en");
            setLangImg("/images/ko.png")
            break;
        case "en":
            setLang("ko")
            setLangImg("/images/en.png")
            break;
    }
}

  return (
    <div className={styles.TopbarDiv}>
        <div className={styles.Topbar}>
            <div className={styles.TopbarItem}>
                <img  src={langImg} alt="Language" width="40px" height="40px" onClick={onClickLang}/>
            </div>
            <div className={styles.TopbarItem}>
                <Link to="/Payment">
                    <Avatar icon={<UserOutlined />} size={40} />
                </Link>
                
            </div>            
        </div>
    </div>
  )
}
