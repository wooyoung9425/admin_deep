import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {  Link } from 'react-router-dom';
import { useState } from 'react'
import styles from '../Styles/Navbar.module.css'
import { useRecoilState, atom } from 'recoil';
import { langState } from '../Store/State/atom'
import { ko, en } from '../translations';

type MenuItem = Required<MenuProps>['items'][number];

export default function TunnelNavbar() {

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
                    {t.dashBoard}
                </a>
            </Link>
                , '1'),
            getItem(
                <Link to="/Facility/Preprocess/Dashboard">
                    <a style={{ textDecoration: "none", color:"black" }}>
                        {t.ppPreprocessor}
                    </a>
                </Link>
                , 'sub1',
                [
                    getItem(
                        <Link to="/Facility/Preprocess/Setting">
                            <a style={{ textDecoration: "none", color:"black" }}>
                                {t.ppSetting}
                            </a>
                        </Link>
                        , '2'),
                    
                    getItem(
                        <Link to="/Facility/PreProcess/VideoEdit">
                            <a style={{ textDecoration: "none", color:"black" }}>
                                {t.ppVideoEdit}
                            </a>
                        </Link>
                        , '3'),
                    getItem(
                        <Link to="/Facility/Preprocess/ImageTask">
                            <a style={{ textDecoration: "none", color:"black" }}>
                                {t.ppImageTask}
                            </a>
                        </Link>
                        , '4'),
                    getItem(
                        <Link to="/Facility/PreProcess/JTag">
                            <a style={{ textDecoration: "none", color:"black" }}>
                                {t.ppJTag}
                            </a>
                        </Link>
                        , '5'),
                    getItem(
                        <Link to="/Facility/PreProcess/JTagConfirm">
                            <a style={{ textDecoration: "none", color:"black" }}>
                                {t.ppJTagConfirm}
                            </a>
                        </Link>
                        , '6'),
                ]),
            getItem(<Link to="/Facility/Panorama/Dashboard">
                <a style={{ textDecoration: "none", color:"black" }}>
                    {t.pnPanorama}
                </a>
            </Link>, 'sub2', [
                getItem(<Link to="/Facility/Panorama/Setting">
                    <a style={{ textDecoration: "none", color:"black" }}>
                        {t.pnSetting}
                    </a>
                </Link>, '7'),
                getItem(<Link to="/Facility/Panorama/ImageEdit">
                    <a style={{ textDecoration: "none", color:"black" }}>
                        {t.pnImageEdit}
                    </a>
                </Link>, '8'),
                getItem(
                    <Link to="/Facility/Panorama/PanoramaConfirm">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.pnImageConfirm}
                        </a>
                    </Link>, '9'),
                getItem(
                <Link to="/Facility/Panorama/PanoramaVer">
                    <a style={{ textDecoration: "none", color:"black" }}>
                    {t.pnHorizontalPanorama}
                </a>
            </Link>,'10')
            ]),
            getItem(<Link to="/Facility/CrackDetector_Measure/Dashboard">
                <a style={{ textDecoration: "none", color:"black" }}>
                    {t.cnCrackDetectorMeasure}
                </a>
            </Link>
                , 'sub3', [
                getItem(
                    <Link to="/Facility/CrackDetector_Measure/DetectorSetting">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.cnDetectorSetting}
                        </a>
                    </Link>
                    , '11'),
                getItem(
                    <Link to="/Facility/CrackDetector_Measure/CrackDetector">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.CrackDetector}
                        </a>
                    </Link>, '12'),
                getItem(
                    <Link to="/Facility/CrackDetector_Measure/MeasureSetting">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.cnMeasureSetting}
                        </a>
                    </Link>, '13'),
                getItem(
                    <Link to="/Facility/CrackDetector_Measure/CrackMeasure">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.CrackMeasure}
                        </a>
                    </Link>, '14'),
            ]),
            getItem(<Link to="/Facility/CrackDrawer_Estimator/DashBoard">
                <a style={{ textDecoration: "none", color:"black" }}>
                    {t.csDrawerEstimator}
                </a>
            </Link>
                , 'sub4', [
                getItem(
                    <Link to="/Facility/CrackDrawer_Estimator/Setting">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.csSetting}
                        </a>
                    </Link>
                    , '15'),
                getItem(
                    <Link to="/Facility/CrackDrawer_Estimator/ReportDownload">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.csDownload}
                        </a>
                    </Link>
                    , '16'),
            ]),
            
            getItem(<Link to="/Facility/XAI/DashBoard">
                <a style={{ textDecoration: "none", color:"black" }}>
                    {t.xai}
                </a>
            </Link>
                , 'sub5', [
                getItem(
                    <Link to="/Facility/XAI/Heatmap">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.heatmap}
                        </a>
                    </Link>
                    , '17'),
                getItem(
                    <Link to="/Facility/XAI/Captioning">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.captioning}
                        </a>
                    </Link>
                    , '18'),
                 getItem(
                    <Link to="/Facility/XAI/Result_Heatmap">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.heatmap + ' '+t.result}
                        </a>
                    </Link>
                     , '19'),
                  getItem(
                    <Link to="/Facility/XAI/Result_Captioning">
                        <a style={{ textDecoration: "none", color:"black" }}>
                            {t.captioning + ' ' + t.result}
                        </a>
                    </Link>
                    , '20'),
            ]),
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
