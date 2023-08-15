import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { RecoilRoot } from 'recoil';
import App from './App';
import Main from './Pages/Main';
import Project from './Pages/Project';
import NotFound from './Pages/NotFound';
import Payment from './Pages/Payment/Payment'
//----------------------------------------------
import DeepInspector from './Pages/Main/DeepInspector';
import ContactUs from './Pages/Main/ContactUs';
import SignIn from './Pages/Main/SignIn';
import SignUp from './Pages/Main/SignUp';
import MyInfo from './Pages/Main/MyInfo';
//-------------------------------------------------
import DashBoard  from './Pages/Project/DashBoard';
import Management from './Pages/Project/Management';
import Statistics from './Pages/Project/Statistics';
import IndexPage from './Pages/IndexPage';
// import Project from './Pages/Main/Project';
import Facility from './Pages/Facility'
import CreateProject from './Pages/Facility/Create/CreateProject';
import ProjectDashboard from './Pages/Facility/Dashboard/ProjectDashboard';
import PPDashboard from './Pages/Facility/Preprocess/Dashboard';
import PPSetting from './Pages/Facility/Preprocess/Setting';
import PNSetting from './Pages/Facility/Panorama/Setting';
import PNSettingBridge from './Pages/Facility/Panorama/SettingBridge';
import PNSettingAirport from './Pages/Facility/Panorama/SettingAirport';
import PNSettingDam from './Pages/Facility/Panorama/SettingDam';
import PNConfirm from './Pages/Facility/Panorama/PanoramaConfirm';
import PNVer from './Pages/Facility/Panorama/PanoramaVer';
import PNHorDam from './Pages/Facility/Panorama/PanoramaHorDam';
import PNHorBridge from './Pages/Facility/Panorama/PanoramaHorBridge';
import PNManualBridge from './Pages/Facility/Panorama/PanoramaManualBridge';
import PNVerDam from './Pages/Facility/Panorama/PanoramaVerDam';
import PNVerBridge from './Pages/Facility/Panorama/PanoramaVerBridge';
import PNEdit from './Pages/Facility/Panorama/ImageEdit';
import PNDashBoard from './Pages/Facility/Panorama/Dashboard';
import VideoEdit from './Pages/Facility/Preprocess/VideoEdit';
import ImageTask from './Pages/Facility/Preprocess/ImageTask';
import CNDetectorSetting from './Pages/Facility/CrackDetector_Measure/DetectorSetting';
import CNMeasureSetting from './Pages/Facility/CrackDetector_Measure/MeasureSetting';
import CrackDetector from './Pages/Facility/CrackDetector_Measure/Tunnel/CrackDetector';
//Viewer
import ViewerCrack from './Pages/ViewerCrack';
import ViewerDefect from './Pages/ViewerDefect';
import AirportCrackDetector from './Pages/Facility/CrackDetector_Measure/Airport/AirportCrackDetector';
import AirportDefectDetector from './Pages/Facility/CrackDetector_Measure/Airport/AirportDefectDetector';
import AirportFODDetector from './Pages/Facility/CrackDetector_Measure/Airport/AirportFODDetector';
import CrackMeasure from './Pages/Facility/CrackDetector_Measure/Tunnel/CrackMeasure';
import CSDashBoard from './Pages/Facility/CrackDrawer_Estimator/DashBoard'
import CSSetting from './Pages/Facility/CrackDrawer_Estimator/Setting';
import ReportDownload from './Pages/Facility/CrackDrawer_Estimator/ReportDownload';
import Jtag from './Pages/Facility/Preprocess/Jtag';
import JtagConfirm from './Pages/Facility/Preprocess/JtagConfirm';
import DMDashBoard from './Pages/Facility/CrackDetector_Measure/DashBoard';
import AirportConfirm from './Pages/Facility/Panorama/ImageConfirmAirport';

// import DMDashBoard from './Pages/'
// Airport ----------------------------------------------------------------
import Filter from './Pages/Facility/Preprocess/Filter';
import SpanFolder from './Pages/Facility/Preprocess/SpanFolder';
//DAM -----------------------------------------------------------------------
import SpanFolderDam from './Pages/Facility/Preprocess/SpanFolderDam'
//Bridge -----------------------------------------------------------------------
import SpanFolderBridge from './Pages/Facility/Preprocess/SpanFolderBridge'
//Building ----------------------------------------------------------------------
import PPBSetting from './Pages/Facility/Preprocess/BuildingSetting';
//XAI------------------------------------------------------------------
import XAIDashBoard from './Pages/Facility/XAI/DashBoard';
import Heatmap from './Pages/Facility/XAI/Heatmap';
import Dam_Heatmap from './Pages/Facility/XAI/Dam_Heatmap';
import Captioning from './Pages/Facility/XAI/Captioning';
import Dam_Captioning from './Pages/Facility/XAI/Dam_Captioning';
import Result_Heatmap from './Pages/Facility/XAI/Result_Heatmap';
import Result_Captioning from './Pages/Facility/XAI/Result_Captioning'
import MetaLearning from './Pages/Facility/CrackDetector_Measure/Airport/MetaLearning';
import MetaLearningResult from './Pages/Facility/CrackDetector_Measure/Airport/MetaLearningResult';
import DamDefectDetector from './Pages/Facility/CrackDetector_Measure/Dam/DefectDetector';
import BridgeCrackDetector from './Pages/Facility/CrackDetector_Measure/Bridge/BridgeCrackDetector';
import BridgeDefectDetector from './Pages/Facility/CrackDetector_Measure/Bridge/BridgeDefectDetector';
import BridgeCrackMeasure from './Pages/Facility/CrackDetector_Measure/Bridge/BridgeCrackMeasure';
import BridgeDefectMeasure from './Pages/Facility/CrackDetector_Measure/Bridge/BridgeDefectMeasure';
import Bridge_Heatmap from './Pages/Facility/XAI/Bridge_Heatmap'
import Bridge_Captioning from './Pages/Facility/XAI/Bridge_Captioning'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Main" element={<Main />} >
          <Route path="/Main" element={<DeepInspector />} />
          <Route path="/Main/ContactUs/" element={<ContactUs />} />
          <Route path="/Main/SignIn/" element={<SignIn />} />
          <Route path="/Main/SignUp/" element={<SignUp />} />
          <Route path="/Main/MyInfo/" element={<MyInfo />} />
          
          
          {/* <Route path="/Main/project/" element={<Project />} /> */}
        </Route>
        <Route path="/Project" element={<Project />} >
          <Route path="/Project" element={<DashBoard />} />
          <Route path="/Project/Management" element={<Management />} />
          <Route path="/Project/Statistics" element={<Statistics />} />
        </Route>
        <Route path="/IndexPage" element={<IndexPage />} />
        <Route path="/Payment" element={<Payment/>}/>
        <Route path="/Facility" element={<Facility />} >
          <Route path="/Facility" element={<CreateProject />} />
          <Route path="/Facility/Dashboard/ProjectDashboard" element={<ProjectDashboard />} />
          <Route path="/Facility/Preprocess/Dashboard" element={<PPDashboard />} />
          <Route path="/Facility/Preprocess/Setting" element={<PPSetting />} />
          <Route path="/Facility/Preprocess/VideoEdit" element={<VideoEdit/>}/>
          <Route path="/Facility/Preprocess/ImageTask" element={<ImageTask />} />
          <Route path="/Facility/Preprocess/Jtag" element={<Jtag />} />
          <Route path="/Facility/PreProcess/JTagConfirm" element={<JtagConfirm />} />
          <Route path="/Facility/Panorama/Setting" element={<PNSetting />} />
          <Route path="/Facility/Panorama/SettingBridge" element={<PNSettingBridge />} />
          <Route path="/Facility/Panorama/SettingAirport" element={<PNSettingAirport />} />
          <Route path="/Facility/Panorama/SettingDam" element={<PNSettingDam />} />
          <Route path="/Facility/Panorama/Dashboard" element={<PNDashBoard />} />
          <Route path="/Facility/Panorama/PanoramaConfirm" element={<PNConfirm />} />
          <Route path="/Facility/Panorama/ImageConfirmAirport" element={<AirportConfirm />} />
          <Route path="/Facility/Panorama/PanoramaHorDam" element={<PNHorDam />} />
          <Route path="/Facility/Panorama/PanoramaHorBridge" element={<PNHorBridge />} />
          <Route path="/Facility/Panorama/PanoramaManualBridge" element={<PNManualBridge />} />
          <Route path="/Facility/Panorama/PanoramaVerDam" element={<PNVerDam />} />
          <Route path="/Facility/Panorama/PanoramaVerBridge" element={<PNVerBridge />} />
          <Route path="/Facility/Panorama/ImageEdit" element={<PNEdit />} />
          <Route path="/Facility/Panorama/PanoramaVer" element={<PNVer />} />
          <Route path="/Facility/CrackDetector_Measure/DashBoard" element={<DMDashBoard />} />
          <Route path="/Facility/CrackDetector_Measure/CrackDetector" element={<CrackDetector />} />          
          <Route path="/Facility/CrackDetector_Measure/AirportCrackDetector" element={<AirportCrackDetector />} />
          <Route path="/Facility/CrackDetector_Measure/AirportDefectDetector" element={<AirportDefectDetector />} />
          <Route path="/Facility/CrackDetector_Measure/AirportFODDetector" element={<AirportFODDetector />} />
          <Route path="/Facility/CrackDetector_Measure/CrackMeasure" element={<CrackMeasure />} />
          <Route path="/Facility/CrackDetector_Measure/DetectorSetting" element={<CNDetectorSetting />} />
          <Route path="/Facility/CrackDetector_Measure/DamDefectDetector" element={<DamDefectDetector />} />
          <Route path="/Facility/CrackDetector_Measure/BridgeCrackDetector" element={<BridgeCrackDetector />} />
          <Route path="/Facility/CrackDetector_Measure/BridgeDefectDetector" element={<BridgeDefectDetector />} />
          <Route path="/Facility/CrackDetector_Measure/BridgeCrackMeasure" element={<BridgeCrackMeasure />} />
          <Route path="/Facility/CrackDetector_Measure/BridgeDefectMeasure" element={<BridgeDefectMeasure />} />
          <Route path="/Facility/CrackDetector_Measure/MeasureSetting" element={<CNMeasureSetting />} />
          <Route path="/Facility/CrackDetector_Measure/MetaLearning" element={<MetaLearning/>} />
          <Route path="/Facility/CrackDetector_Measure/MetaLearningResult" element={<MetaLearningResult/>} />
          <Route path="/Facility/CrackDrawer_Estimator/DashBoard" element={<CSDashBoard/>}/>
          <Route path="/Facility/CrackDrawer_Estimator/Setting" element={<CSSetting />} />
          <Route path="/Facility/CrackDrawer_Estimator/ReportDownload" element={<ReportDownload />} />
          <Route path="/Facility/XAI/DashBoard" element={<XAIDashBoard />} />
          <Route path="/Facility/XAI/Heatmap" element={<Heatmap />} />
          <Route path="/Facility/XAI/Dam_Heatmap" element={<Dam_Heatmap />} />
          <Route path="/Facility/XAI/Bridge_Heatmap" element={<Bridge_Heatmap/>}/>
          <Route path="/Facility/XAI/Captioning" element={<Captioning />} />
          <Route path="/Facility/XAI/Dam_Captioning" element={<Dam_Captioning />} />
          <Route path="/Facility/XAI/Bridge_Captioning" element={<Bridge_Captioning />} />
          <Route path="/Facility/XAI/Result_Heatmap" element={<Result_Heatmap />} />
          <Route path="/Facility/XAI/Result_Captioning" element={<Result_Captioning />} />

          {/* Airport */}
          <Route path="/Facility/Preprocess/Filter" element={<Filter />} />
          <Route path="/Facility/Preprocess/SpanFolder" element={<SpanFolder/>}/>

          {/* Dam */}
          <Route path="/Facility/Preprocess/SpanFolderDam" element={<SpanFolderDam />}/>

          {/* Bridge */}
          <Route path="/Facility/Preprocess/SpanFolderBridge" element={<SpanFolderBridge />} />
          {/* Building */}
          <Route path="/Facility/Preprocess/BuildingSetting" element={<PPBSetting />} />

        </Route>
        {/* Viewer */}
        <Route path="/ViewerCrack" element={<ViewerCrack />} />
        <Route path="/ViewerDefect" element={<ViewerDefect />} />
        
        {/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
);
