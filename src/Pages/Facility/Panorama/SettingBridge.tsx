import { Button, Form, Input, Radio, Select, Tooltip } from "antd";
import styles from "../../../Styles/Panorama.module.css";
import { useRecoilState, atom } from "recoil";
import { useState } from "react";
import { langState } from "../../../Store/State/atom";
import { ko, en } from "../../../translations";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect } from "react";
import { API_URL } from "../../../Store/Global";
import SettingBrigeInput from "./SettingBridgeInput";

export default function SettingBrige() {
  const [language, setLang] = useRecoilState(langState);
  const t = language === "ko" ? ko : en;

  const [horTrans, setHorTrans] = useState<string>("0");
  const [horYFix, setHorYFix] = useState<string>("0");
  const [horX, setHorX] = useState<string>("0.5");
  const [horY, setHorY] = useState<string>("0.1");
  const [horRotation, setHorRotation] = useState<string>("1");
  const [horScale, setHorScale] = useState<string>("0.01");
  const [confFlag, setConfFlag] = useState<string>("0");
  const [verX, setVerX] = useState<string>("0.1");
  const [verY, setVerY] = useState<string>("0.8");
  const [verRotation, setVerRotation] = useState<string>("0.1");
  const [verScale, setVerScale] = useState<string>("0.5");
  const [verForced, setVerForced] = useState<string>("0.2");
  const [verMax, setVerMax] = useState<string>("7");
  const [verForcedStitching, setVerForcedStitching] = useState<string>("0");
  const [forFs, setForFs] = useState<string>("0");
  const [verCount, setVerCount] = useState<string>("0");
  const [shearingAngle, setShearingAngle] = useState<string>("0");
  const [overlapRatios, setOverlapRatios] = useState<string>("0");

  const [userid, setId] = useState<number>(-1);
  const [companyid, setCompanyId] = useState<number>(-1);

  // const HorTransInput = (e: any) => {
  //   setHorTrans(e.target.value);
  // };
  // const horYFixInput = (e: any) => {
  //   setHorYFix(e.target.value);
  // };
  // const horXInput = (e: any) => {
  //   setHorX(e.target.value);
  // };
  // const horYInput = (e: any) => {
  //   setHorY(e.target.value);
  // };
  // const horRotationInput = (e: any) => {
  //   setHorRotation(e.target.value);
  // };
  // const horScaleInput = (e: any) => {
  //   setHorScale(e.target.value);
  // };
  // const confFlagInput = (e: any) => {
  //   setConfFlag(e.target.value);
  // };
  // const verXInput = (e: any) => {
  //   setVerX(e.target.value);
  // };
  // const verYInput = (e: any) => {
  //   setVerY(e.target.value);
  // };
  // const verRotationInput = (e: any) => {
  //   setVerRotation(e.target.value);
  // };
  // const verScaleInput = (e: any) => {
  //   setVerScale(e.target.value);
  // };
  // const verForcedInput = (e: any) => {
  //   setVerForced(e.target.value);
  // };
  // const verMaxInput = (e: any) => {
  //   setVerMax(e.target.value);
  // };
  // const verForcedStitchingInput = (e: any) => {
  //   setVerForcedStitching(e.target.value);
  // };
  // const forFsInput = (e: any) => {
  //   setForFs(e.target.value);
  // };
  // const verCountInput = (e: any) => {
  //   setVerCount(e.target.value);
  // };
  // const shearingAngleInput = (e: any) => {
  //   setShearingAngle(e.target.value);
  // };

  useEffect(() => {
    let getIdCompany = async () => {
      if (token !== null) {
        console.log("여기 들어옴?");
        console.log("프로젝트ID" + project_id);
        const response = await axios({
          method: "get",
          url: `${API_URL}/account/auth/check/${token}`,
        })
          .then(async (res) => {
            if (res.data.check === true) {
              // localStorage.set("project_id", id);
              console.log(
                `아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`);
                setId(res.data.data.id)
                setCompanyId(res.data.data.companyId)
              return {
                email: res.data.data.email,
                name: res.data.data.name,
                phone: res.data.data.phone,
                avatar: res.data.data.avatar,
                role: res.data.data.role,
                id: res.data.data.id,
                companyId: res.data.data.companyId,
              };
            } else {
              console.log("토큰 만료");
              localStorage.removeItem("token");
              alert("토큰이 만료었습니다 다시 로그인 해주세요");
              window.location.replace("/Main");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getIdCompany();
  }, []);

  const [cameraNo, setCamraNo] = useState(2);
  const [spanNo, setSpanNo] = useState<number>(1);
  const [projectName, setProjectName] = useState<string>("");
  const [typeCount, setTypeCount] = useState<number>(1);

  const [spanallCount, setSpanAllCount] = useState<number>(1);
  const [type, setType] = useState<string>("");
  const [spanSubCount, setSpanSubCount] = useState<number>(6);
  const [inputData, setInputData] = useState<string>("");
  const [typeArr, setTypee] = useState([]);

  //교량데이터정보
  const [bridgeType, setBridgeType] = useState<string>("");
  const [spanNumber, setSpanNumber] = useState<any>([]);
  const [girderCount, setGirderCount] = useState<string>("");
  const [girderCameraCount, setGirderCameraCount] = useState<string>("");
  const [pierCount, setPierCount] = useState<string>("");
  const [slabCount, setSlabCount] = useState<string>("");
  const [girdertrue, setGirderTrue] = useState<boolean>(false)
  const [girderSidetrue, setGirderSideTrue] = useState<boolean>(false)
  const [piertrue, setPierTrue] = useState<boolean>(false)
  const [pierSidetrue, setPierSideTrue] = useState<boolean>(false)
  const [slabtrue, setSlabTrue] = useState<boolean>(false)
  const [abutmenttrue, setAbutmentTrue] = useState<boolean>(false)
  const [pierNumber, setPierNumber] = useState<any>([]);

  const { Option } = Select;

  useEffect(() => {
    const response = axios({
      method: "get",
      url: API_URL + `/project/view/${project_id}`,
      headers: { "accept": `application/json`, "access-token": `${token}` },
    })
      .then((res) => {
        // console.log(res.data.check)
        const settings: any = JSON.parse(res.data.data.settings);
        // console.log("dlfmaaaaaaaaaaaaaaaa"+res.data.data.title)
        if (res.data.check === true) {
          for (let i = 0; i < 1; i++) {
            console.log(`거더카운터${settings.girder_count}`);
            console.log(`거더카메라카운터${settings.girder_camera_count}`);
            console.log(`교각카운터${settings.pier_film_count}`);
            console.log(`슬라브카운터${settings.slab_count}`);
            console.log(
              `서브스팬${settings.span_length / settings.span_class_length}`
            );
            console.log(`스팬전체길이${settings.span_class_length}`);
            setSpanNumber(settings.span_number_list);
            setPierNumber(settings.pier_number_list)
            // console.log(settings.span_number_list[0].num)
            setProjectName(settings.tunnel_eng);
            setTypee(settings.bridge_type);
            setSpanNo(settings.span_length);
            setTypeCount(settings.girder_count);
            setSpanAllCount(settings.span_class_length);
            // console.log("확인" + settings.span_number_list[1].num);
            setSpanSubCount(settings.span_length/settings.span_class_length );
            setGirderCount(settings.girder_count);
            setGirderCameraCount(settings.girder_camera_count);
            setPierCount(settings.pier_film_count);
            setSlabCount(settings.slab_count);
          }
          // console.log(cameraNo);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [spanSubCount]);

  let token: string | null = localStorage.getItem("token");
  let project_id: string | null = localStorage.getItem("project_id");
  let Horstitch: any[] = [];
  let Spandist: any[] = [];


  const inputDate = 
  {
    horTrans: horTrans,
    horYFix: horYFix,
    horX: horX,
    horY: horY,
    horRotation: horRotation,
    horScale: horScale,
    confFlag: confFlag,
    verX: verX,
    verY: verY,
    verRotation: verRotation,
    verScale: verScale,
    verForced: verForced,
    verMax: verMax,
    verForcedStitching: verForcedStitching,
    forFs: forFs,
    verCount: verCount,
    shearingAngle: shearingAngle
  }

  
  // for (let t = 1; t < typeCount + 1; t++)
  //   for (let c = 1; c < cameraNo + 1; c++)
  //     for (let s = 1; s < spanSubCount + 1; s++) {
  //       Horstitch.push({
  //         input_folder: `stage2/${type}/G${t}/C${c}/S00${s}`,
  //         output_folder: `stage4/${type}/G${t}`,
  //         yml_output_folder: "stage4_YML",
  //         cam_no: 4,
  //         conf_name: "config.cfg",
  //         conf_folder: "stage4_config",
  //         conf_values: {
  //           horTrans: horTrans,
  //           horYFix: horYFix,
  //           horX: horX,
  //           horY: horY,
  //           horRotation: horRotation,
  //           horScale: horScale,
  //           confFlag: confFlag,
  //           verX: verX,
  //           verY: verY,
  //           verRotation: verRotation,
  //           verScale: verScale,
  //           verForced: verForced,
  //           verMax: verMax,
  //           verForcedStitching: verForcedStitching,
  //           forFs: forFs,
  //           verCount: verCount,
  //           shearingAngle: shearingAngle,
  //         },
  //       });
  //     }



  const option_render=()=>{
    const arr: any[] = [];
        typeArr.map((type: any) => {
            let name = ''
            if (type === 'Girder') {
                name = '거더 하면'
            } else if (type === 'GirderSide') {
                name = '거더 측면'
            } else if (type === 'Slab') {
                name = '슬라브 하면'
            } else if (type === 'SlabSide') {
                name = '슬라브 측면'
            } else if (type === 'Pier') {
                name = '교각'
            } else {
                name ='교대'
            }
            arr.push(<Option value={type}> {name}</Option>)
        })
    return arr;
}


  const onChangeType = (e: any) => {
    console.log(e);
    if (e === "Girder") {
      setBridgeType("Girder");
    } else if (e === "GirderSide") {
      setBridgeType("GirderSide");
    } else if (e === "Slab") {
      setBridgeType("Slab");
    } else if (e === "SlabSide") {
      setBridgeType("SlabSide");
    } else if (e === "Pier") {
      setBridgeType("Pier");
    } else {
      setBridgeType("Abutment");
    }
  };

  console.log(bridgeType)

  const selectAlert = () => {
    alert("종류를 선택하세요")
  }

  console.log(spanSubCount)

  const onClickGirder = (e: any) => {
    alert("파노라마 작업 중입니다. 잠시만 기다려주세요.")
    setTimeout(function() {
        alert("이미지 추출이 완료되었습니다.")
      }, 2000);
  };

  const onClickGirderSide = (e: any) => {
    alert("파노라마 작업 중입니다. 잠시만 기다려주세요.")
    setTimeout(function() {
        alert("이미지 추출이 완료되었습니다.")
      }, 2000);
  };



  const onClickPier = (e: any) => {
    alert("파노라마 작업 중입니다. 잠시만 기다려주세요.")
    setTimeout(function() {
        alert("이미지 추출이 완료되었습니다.")
      }, 2000);
    // for (let a = 0; a < spanNumber.length; a++)
    // for (let b = 1; b < Number(pierCount)+1; b++)
    //                                         {
    //     axios({
    //       method: "post",
    //       url: API_URL + `/scheduler/job/start/${companyid}/${userid}`,
    //       headers: {
    //         "accept": `application/json`,
    //         "access-token": `${token}`,
    //         "Content-Type": `application/json`,
    //       },
    //         data: {
    //           project_id: project_id,
    //           task_name: "hor_stitch_old",
    //           interactive: false,
    //           tasks: [
    //             {
    //               // input_folder: `stage2/${bridgeType}/${bridgeType}_P0${spanNumber[a].num}/C${pierCount.length ===2 ? b : "0" + b}/S0${pierCount.length ===2 ? b : "0" + b}`,
    //               input_folder: `stage2/${bridgeType}/P0${pierNumber[a].num}/S0${pierCount.length ===2 ? b : "0" + b}`,
    //               output_folder: `stage4/${bridgeType}/P0${pierNumber[a].num}`,
    //               yml_output_folder: "stage4_YML",
    //               cam_no: 4,
    //               conf_name: "config.cfg",
    //               conf_folder: "stage4_config",
    //               conf_values: {
    //                 horTrans: horTrans,
    //                 horYFix: horYFix,
    //                 horX: horX,
    //                 horY: horY,
    //                 horRotation: horRotation,
    //                 horScale: horScale,
    //                 confFlag: confFlag,
    //                 verX: verX,
    //                 verY: verY,
    //                 verRotation: verRotation,
    //                 verScale: verScale,
    //                 verForced: verForced,
    //                 verMax: verMax,
    //                 verForcedStitching: verForcedStitching,
    //                 forFs: forFs,
    //                 verCount: verCount,
    //                 shearingAngle: shearingAngle                 
    //               },
    //             },
    //           ],
    //         },
    //       })
    //         .then((res) => {
    //           if (res.data.check === true) {
    //             console.log("파노라마 성공");
    //             console.log("성공" + res.data.check);
    //           } else {
    //             console.log("파노라마 실패");
    //           }
    //         })
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     }
  };


  const onClickSlab = (e: any) => {
    alert("파노라마 작업 중입니다. 잠시만 기다려주세요.")
    setTimeout(function() {
        alert("이미지 추출이 완료되었습니다.")
      }, 2000);
  };


  useEffect(() => {
    //교량 구조물 종류 받아오기
    axios({
      method: "get",
      url: API_URL + `/project/view/${project_id}`,
      headers: { "accept": `application/json`, "access-token": `${token}` },
    })
      .then((res) => {
        const settings: any = JSON.parse(res.data.data.settings);
        setTypee(settings.bridge_type);
        if (bridgeType === "Girder") {
          setGirderTrue(true);
          setPierTrue(false);
          setSlabTrue(false);
          setGirderSideTrue(false);
        } else if (bridgeType === "GirderSide") {
          setGirderSideTrue(true);
          setSlabTrue(false);
          setPierTrue(false);
          setGirderTrue(false);
        } 
        else if (bridgeType === "Pier") {
          setPierTrue(true);
          setSlabTrue(false);
          setGirderTrue(false);
          setGirderSideTrue(false);

        } else if (bridgeType === "Slab") {
          setSlabTrue(true);
          setGirderTrue(false);
          setPierTrue(false);
          setGirderSideTrue(false);


        }

          else {
            console.log("anjsiiii");
            }

          axios({
            method: "get",
            url: API_URL + "/File/Files",
            headers: {
              "accept": `application/json`,
              "access-token": `${token}`,
            },
            params: {
              path: `/project/${project_id}/stage4/${bridgeType}`,
            },
          }).then((res) => {});
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }, [bridgeType]);

  return (
    <div>
      <div className={styles.DivArea}>
        <div className={styles.CreateTitleDiv}>
          <div className={styles.CreateTitleText}>
            <p>{t.Setting}</p>
            <Tooltip
              placement="right"
              color="#108ee9"
              title="수평 파노라마 설정값을 입력합니다. 입력하지 않으면 기본값으로 작업이 진행됩니다."
            >
              <p className={styles.setting}>
                <QuestionCircleOutlined />
              </p>
            </Tooltip>
          </div>
        </div>

        <div className={styles.Projectbody}>
          <Select
            placeholder="선택해주세요"
            className={styles.BridgeDiv}
            onChange={onChangeType}
          >
            {option_render()}
          </Select>
          <SettingBrigeInput />
          <div className={styles.CreateButton}>
            {/* <Button onClick={onChangeType}>테스트</Button> */}
            <Button
              onClick={girdertrue === true ? onClickGirder : (piertrue === true ? onClickPier : (slabtrue === true ? onClickSlab : (girderSidetrue === true ? onClickGirderSide :selectAlert )))}
              block
            >
              생성
            </Button>
          </div>
          </div>

        </div>
      </div>
  );
}
