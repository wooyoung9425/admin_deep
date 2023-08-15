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

export default function SettingBrigeInput() {
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

  const HorTransInput = (e: any) => {
    setHorTrans(e.target.value);
  };
  const horYFixInput = (e: any) => {
    setHorYFix(e.target.value);
  };
  const horXInput = (e: any) => {
    setHorX(e.target.value);
  };
  const horYInput = (e: any) => {
    setHorY(e.target.value);
  };
  const horRotationInput = (e: any) => {
    setHorRotation(e.target.value);
  };
  const horScaleInput = (e: any) => {
    setHorScale(e.target.value);
  };
  const confFlagInput = (e: any) => {
    setConfFlag(e.target.value);
  };
  const verXInput = (e: any) => {
    setVerX(e.target.value);
  };
  const verYInput = (e: any) => {
    setVerY(e.target.value);
  };
  const verRotationInput = (e: any) => {
    setVerRotation(e.target.value);
  };
  const verScaleInput = (e: any) => {
    setVerScale(e.target.value);
  };
  const verForcedInput = (e: any) => {
    setVerForced(e.target.value);
  };
  const verMaxInput = (e: any) => {
    setVerMax(e.target.value);
  };
  const verForcedStitchingInput = (e: any) => {
    setVerForcedStitching(e.target.value);
  };
  const forFsInput = (e: any) => {
    setForFs(e.target.value);
  };
  const verCountInput = (e: any) => {
    setVerCount(e.target.value);
  };
  const shearingAngleInput = (e: any) => {
    setShearingAngle(e.target.value);
  };

  

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

  const { Option } = Select;
  let token: string | null = localStorage.getItem("token");
  let project_id: string | null = localStorage.getItem("project_id");
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
                `아이디는 다음과 같음 : ${res.data.data.id} / 회사는 다음과 같음 : ${res.data.data.companyId}`
              );
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





  return (

          <div className={styles.Createtable}>
            <div className="half1">
              <Form
                className={styles.Forms}
                labelCol={{ span: 14 }}
                wrapperCol={{ span: 8 }}
                layout="horizontal"
              >
                <Form.Item
                  className={styles.FormItem}
                  label="HORIZONTAL_JUST_TRANSLATION"
                >
                  <Input
                    disabled
                    value={horTrans}
                    onChange={HorTransInput}
                    type={"number"}
                  />
                </Form.Item>

                <Form.Item className={styles.FormItem} label="HORIZONTAL_Y_FIX">
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 100"
                  >
                    <Input
                      value={horYFix}
                      onChange={horYFixInput}
                      suffix="pix"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="HORIZONTAL_X_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input value={horX} onChange={horXInput} suffix="%" />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="HORIZONTAL_Y_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input value={horY} onChange={horYInput} suffix="%" />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="HORIZONTAL_ROTATION_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input
                      value={horRotation}
                      onChange={horRotationInput}
                      suffix="%"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="HORIZONTAL_SCALE_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input
                      value={horScale}
                      onChange={horScaleInput}
                      suffix="%"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item className={styles.FormItem} label="CONF_FLAG">
                  <Input disabled value={confFlag} onChange={confFlagInput} />
                </Form.Item>
                <Form.Item className={styles.FormItem} label="FOR_FS">
                  <Input
                    disabled
                    value={forFs}
                    onChange={forFsInput}
                    type={"number"}
                  />
                </Form.Item>
              </Form>
            </div>
            <div className="half2">
              <Form
                className={styles.Forms}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 8 }}
                layout="horizontal"
              >
                <Form.Item className={styles.FormItem} label="VERTICAL_X_LIMIT">
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input value={verX} onChange={verXInput} suffix="%" />
                  </Tooltip>
                </Form.Item>
                <Form.Item className={styles.FormItem} label="VERTICAL_Y_LIMIT">
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input value={verY} onChange={verYInput} suffix="%" />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="VERTICAL_ROTATION_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input
                      value={verRotation}
                      onChange={verRotationInput}
                      type={"number"}
                      suffix="%"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="VERTICAL_SCALE_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input
                      value={verScale}
                      onChange={verScaleInput}
                      type={"number"}
                      suffix="%"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="VERTICAL_FORCED_LIMIT"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 1.00"
                  >
                    <Input
                      value={verForced}
                      onChange={verForcedInput}
                      type={"number"}
                      suffix="%"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item className={styles.FormItem} label="VERTICAL_MAX_IN">
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 99"
                  >
                    <Input
                      value={verMax}
                      onChange={verMaxInput}
                      type={"number"}
                      suffix="pix"
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item
                  className={styles.FormItem}
                  label="VERTICAL_FORCED_STITCHING"
                >
                  <Tooltip
                    placement="right"
                    color="#2db7f5"
                    title="입력범위 : 0 ~ 100"
                  >
                    <Input
                      disabled
                      value={verForcedStitching}
                      onChange={verForcedStitchingInput}
                      suffix="%"
                      type={"number"}
                    />
                  </Tooltip>
                </Form.Item>
                <Form.Item className={styles.FormItem} label="VERTICAL_COUNT">
                  <Input
                    disabled
                    value={verCount}
                    onChange={verCountInput}
                    type={"number"}
                  />
                </Form.Item>
                <Form.Item className={styles.FormItem} label="SHEARING_ANGLE">
                  <Input
                    disabled
                    value={shearingAngle}
                    onChange={shearingAngleInput}
                    type={"number"}
                  />
                </Form.Item>
              </Form>
            </div>
            
          </div>



  );
}
