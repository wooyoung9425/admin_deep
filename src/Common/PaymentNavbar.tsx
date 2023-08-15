import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {  Link } from 'react-router-dom';
import { useState } from 'react'
import styles from '../Styles/Navbar.module.css'
import { useRecoilState, atom } from 'recoil';
import { langState } from '../Store/State/atom'
import { ko, en } from '../translations';

type MenuItem = Required<MenuProps>['items'][number];

export default function PaymentNavbar() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        children?: MenuItem[],
        type?: 'group',
        ): MenuItem {
        return {
            key,
            children,
            label,
            type,
        } as MenuItem;
        }

        const items: MenuItem[] = [
            getItem(<Link to="/Facility/Dashboard/ProjectDashboard">
                <a style={{ textDecoration: "none", color:"black" }}>
                    사용자 정보
                </a>
            </Link>
                , '1'),
            getItem(<Link to="/Payment">
                <a style={{ textDecoration: "none", color:"black" }}>
                    결제 관리
                </a>
            </Link>
                , '2'),
            getItem(<Link to="/Facility/Dashboard/ProjectDashboard">
                <a style={{ textDecoration: "none", color:"black" }}>
                    고객 문의
                </a>
            </Link>
                , '3'),
            
            
        ];

        const rootSubmenuKeys = ['1', 'sub1', 'sub2', 'sub3', 'sub4','sub5'];

        const [openKeys, setOpenKeys] = useState(['1']);

        const onOpenChange: MenuProps['onOpenChange'] = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
        };

    return (
        <>
        <div className={styles.NavbarDiv}>
            <div className={styles.NavbarLogo}>
                <Link to="/Project/Management">
                    <a style={{ textDecoration: "none", color:"black" }}>
                        <img src="/images/ProjectLogo.png" alt="Project Logo Image" width={200} height={30} />
                    </a>
                </Link>
            </div>
            <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                items={items}
                className={styles.Navbar}
            />

        </div>
    </>
    )
}
