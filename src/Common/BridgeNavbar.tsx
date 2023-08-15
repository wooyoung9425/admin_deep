import type { MenuProps } from "antd";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "../Styles/Navbar.module.css";
import { useRecoilState, atom } from "recoil";
import { langState } from "../Store/State/atom";
import { ko, en } from "../translations";

type MenuItem = Required<MenuProps>["items"][number];

export default function BridgeNavbar() {
  const [language, setLang] = useRecoilState(langState);
  const t = language === "ko" ? ko : en;

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      children,
      label,
      type,
    } as MenuItem;
  }

  const items: MenuItem[] = [
    getItem(
      <Link to="/Facility/Dashboard/ProjectDashboard">
        <a style={{ textDecoration: "none", color: "black" }}>{t.dashBoard}</a>
      </Link>,
      "1"
    ),

    getItem(
      <Link to="/Facility/Preprocess/Dashboard">
        <a style={{ textDecoration: "none", color: "black" }}>
          {t.ppPreprocessor}
        </a>
      </Link>,
      "sub1",
      [
        getItem(
          <Link to="/Facility/Preprocess/Setting">
          <a style={{ textDecoration: "none", color: "black" }}>
            {t.ppSetting}
          </a>,
          </Link>,
          "2"
        ),

        getItem(
          <Link to="/Facility/PreProcess/VideoEdit">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.ppImageUpload}
            </a>
          </Link>,
          "3"
        ),

        getItem(
          <Link to="/Facility/PreProcess/Filter">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.ppImageFilter}
            </a>
          </Link>,
          "4"
        ),

        getItem(
          <Link to="/Facility/PreProcess/SpanFolderBridge">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.ppDistFolder}
            </a>
          </Link>,
          "5"
        ),
      ]
    ),

    getItem(
      // <Link to="/Facility/Panorama/Dashboard">
      <a style={{ textDecoration: "none", color: "black" }}>{t.pnPanorama}</a>,
      // </Link>
      "sub2",
      [
        getItem(
          <Link to="/Facility/Panorama/SettingBridge">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.pnSetting}
            </a>
          </Link>,
          "6"
        ),
        getItem(
          <Link to="/Facility/Panorama/PanoramaHorBridge">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.pnVerticalPanorama}
            </a>
          </Link>,
          "7"
        ),        
        // getItem(
        //   <Link to="/Facility/Panorama/PanoramaManualBridge">
        //     <a style={{ textDecoration: "none", color: "black" }}>
        //       {t.pnmanualPanorama}
        //     </a>
        //   </Link>,
        //   "8"
        // ),
        getItem(
          <Link to="/Facility/Panorama/PanoramaVerBridge">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.pnHorizontalPanorama}
            </a>
          </Link>,
          "9"
        ),
      ]
    ),

    getItem(
      <Link to="/Facility/CrackDetector_Measure/Dashboard">
        <a style={{ textDecoration: "none", color: "black" }}>
          {t.dmDetectorMeasure}
        </a>
      </Link>,
      "sub3",
      [
        getItem(
          <Link to="/Facility/CrackDetector_Measure/DetectorSetting">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.dmDetectorSetting}
            </a>
          </Link>,
          "10"
        ),
        getItem(
          <Link to="/Facility/CrackDetector_Measure/BridgeCrackDetector">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.cnCrackDetector}
            </a>
          </Link>,
          "23"
        ),
        getItem(
          <Link to="/Facility/CrackDetector_Measure/BridgeDefectDetector">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.dmDefectDetector}
            </a>
          </Link>,
          "11"
        ),
        getItem(
          <Link to="/Facility/CrackDetector_Measure/MeasureSetting">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.dmMeasureSetting}
            </a>
          </Link>,
          "21"
        ),
        getItem(
          <Link to="/Facility/CrackDetector_Measure/BridgeCrackMeasure">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.cnMeasure}
            </a>
          </Link>,
          "24"
        ),
        getItem(
          <Link to="/Facility/CrackDetector_Measure/BridgeDefectMeasure">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.dmDefectMeasure}
            </a>
          </Link>,
          "22"
        )
      ]
    ),

    getItem(
      <Link to="/Facility/CrackDrawer_Estimator/DashBoard">
        <a style={{ textDecoration: "none", color: "black" }}>
          {t.csDrawerEstimator}
        </a>
      </Link>,
      "sub4",
      [
        getItem(
          <Link to="/Facility/CrackDrawer_Estimator/Setting">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.csSetting}
            </a>
          </Link>,
          "12"
        ),
        getItem(
          <Link to="/Facility/CrackDrawer_Estimator/ReportDownload">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.csDownload}
            </a>
          </Link>,
          "13"
        ),
      ]
    ),

    getItem(
      <Link to="/Facility/XAI/DashBoard">
        <a style={{ textDecoration: "none", color: "black" }}>{t.xai}</a>
      </Link>,
      "sub5",
      [
        getItem(
          <Link to="/Facility/XAI/Bridge_Heatmap">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.heatmap}
            </a>
          </Link>,
          "17"
        ),
        getItem(
          <Link to="/Facility/XAI/Bridge_Captioning">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.captioning}
            </a>
          </Link>,
          "18"
        ),
        getItem(
          <Link to="/Facility/XAI/Result_Heatmap">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.heatmap + " " + t.result}
            </a>
          </Link>,
          "19"
        ),
        getItem(
          <Link to="/Facility/XAI/Result_Captioning">
            <a style={{ textDecoration: "none", color: "black" }}>
              {t.captioning + " " + t.result}
            </a>
          </Link>,
          "20"
        ),
      ]
    ),
  ];

  const rootSubmenuKeys = ["1", "sub1", "sub2", "sub3", "sub4", "sub5"];

  const [openKeys, setOpenKeys] = useState(["1"]);

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
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
            <a style={{ textDecoration: "none", color: "black" }}>
              <img
                src="/images/ProjectLogo.png"
                alt="Project Logo Image"
                width={200}
                height={30}
              />
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
  );
}
