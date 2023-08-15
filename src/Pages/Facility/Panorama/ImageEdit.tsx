import React, { useState, useEffect } from "react";
// import Image from 'next/image'
import styles from "../../../Styles/Panorama.module.css";
import styled from "styled-components";
import { ko, en } from "../../../translations";
import { langState } from "../../../Store/State/atom";
import { Button, Tabs, Image, Table, Slider } from "antd";
import { useRecoilState } from "recoil";
import { API_URL, IMAGE_URL } from "../../../Store/Global";
import axios from "axios";
import { ConsoleSqlOutlined } from "@ant-design/icons";
import { send } from "process";

const CosSlider = styled(Slider)`
    
    .ant-slider-tooltip .ant-tooltip-inner {
        none
    }

    .ant-slider-handle {
        position: absolute;
        width: 0.5px;
        height: 440px;
        margin-top: -436px;       
        background-color: #fff;
        border-left: solid 0.5px #230;
        opacity: 1;
        border-radius: 10%;
        box-shadow: 0;
        cursor: pointer;
        transition: border-color 0.3s, box-shadow 0.6s, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    `;

const TopCosSlider = styled(Slider)`
    
    .ant-slider-tooltip .ant-tooltip-inner {
        none
    }

    .ant-slider-handle {
        position: absolute;
        width: 0.5px;
        height: 440px;
        margin-top: -436px;       
        background-color: #fff;
        border-left: solid 0.5px #230;
        opacity: 1;
        border-radius: 10%;
        box-shadow: 0;
        cursor: pointer;
        transition: border-color 0.3s, box-shadow 0.6s, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    `;

const BotCosSlider = styled(Slider)`
    
    .ant-slider-tooltip .ant-tooltip-inner {
        none
    }

    .ant-slider-handle {
        position: absolute;
        width: 0.5px;
        height: 493px;
        margin-top: -490px;       
        background-color: #fff;
        border-left: solid 0.5px #230;
        opacity: 1;
        border-radius: 10%;
        box-shadow: 0;
        cursor: pointer;
        transition: border-color 0.3s, box-shadow 0.6s, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    `;

// const [prevdisable, setPrevdisisable] = useState(true);
// const [nextdisable, setNextdisable] = useState(false);

// const nextClick = () => {
//         if(num < images.length+1){
//             setNum(num);
//             satTab(tab+1);
//             console.log(num);
//             setNextdisable(false);
//             setPrevdisisable(false);

//         }else if(num <= images.length-1){
//             setPrevdisisable(false);
//             setNextdisable(true);

//         }

// }

//     const prevClick = () => {
//         if(num <= images.length-1){
//             setNum(num-1);
//             satTab(tab-1);
//             console.log('감소' + num)
//             setNextdisable(false);
//             if(num <= 1){
//                 setPrevdisisable(true);
//                 setNextdisable(false);

//             }
//         }
// }

let spanCount = 3;
let CameraCount = 5;
export default function ImageEdit() {
  const [language, setLang] = useRecoilState(langState);
  const t = language === "ko" ? ko : en;

  let token: string | null = localStorage.getItem("token");
  let project_id: string | null = localStorage.getItem("project_id");
  const { TabPane } = Tabs;

  interface ImageList {
    result_image: any;
    cam: any;
    span: any;
    name: any;
    lean: any;
    left: any;
    right: any;
    alllist: any;
  }

  interface Result {
    key: any;
    name: any;
    lean: any;
    left: any;
    right: any;
  }

  interface CutList {
    name: any;
    lean: any;
    left: any;
    right: any;
    resize: any;
  }

  interface PanoramaImage {
    no: any;
    result_image: string;
  }

  const [cam, setCam] = useState("1");
  const [span, setSpan] = useState("1");
  const [alllist, setAlllist] = useState("1");
  const [arr, setArr] = useState<any>([]);

  const [num, setNum] = useState(0);
  const [list, setList] = useState(0);
  const ImageList: ImageList[] = [];
  const PanoramaImage: PanoramaImage[] = [];

  const CutList: CutList[] = [];
  const Result: Result[] = [];

  const [ImgList, setImgList] = useState<any | undefined>(ImageList);
  const [CutImgList, setCutImgList] = useState<any | undefined>(CutList);
  const [resultImage, setResultImage] = useState<any | undefined>(Result);

  const [panormamImgList, setPanormamImgList] = useState<any[]>(PanoramaImage);

  const [panorama, setPanorama] = useState<boolean>(false);
  const [listName, setListName] = useState("");
  const [allList, setAlllest] = useState("");
  const [veiwList, setViewList] = useState<Number>(1);

  const [tab, satTab] = useState(0);
  const [lean, setLean] = useState(0);
  const [urll, setUrll] = useState([]);
  const [urlll, setUrlll] = useState("0");
  const [direction, setDirection] = useState("");
  const [directionn, setDirectionn] = useState(direction);
  // const[dirvlaue, setDirvlaue] = useState(direction);
  const [cNameEn, setEnName] = useState("");
  const [panoramaa, setPanoramaa] = useState<boolean>(false);
  const [cutClick, setCutClick] = useState<boolean>(false);
  const [sendData, setSendData] = useState<any>([])
  const [cameraNo, setCamraNo] = useState(1);


  const [userid, setUserId] = useState<number>(-1);
  const [companyid, setCompanyId] = useState<number>(-1);

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
                setUserId(res.data.data.id)
                setCompanyId(res.data.data.companyId)
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



  let Spandist: any[] = [];

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
            console.log(`터널이름${settings.tunnel_eng}`);
            setEnName(settings.tunnel_eng);
            setDirection(settings.direction);
            setCamraNo(settings.cameraCount);

          }
          // console.log(`상행oooooooooooooooooooo${settings.direction}` )
        }
      })
      .catch((err) => {});
  }, []);

  let Arrr: any = [];

  const [rrr, setRrr] = useState("");
  useEffect(() => {
    axios({
      method: "get",
      url: API_URL + "/File/Files",
      headers: { "accept": `application/json`, "access-token": `${token}` },
      params: {
        path: `/project/${project_id}/stage4/S001`,
      },
    })
      .then((res) => {
        if (res.data.check === true) {
          console.log("555555555555555555555555555555555555", `${IMAGE_URL}/image?path=/project/${project_id}/stage4/S001/${res.data.data.files[0]}&width=1240`)
          setRrr(
            `${IMAGE_URL}/image?path=/project/${project_id}/stage4/S001/${res.data.data.files[0]}&width=1240`
          );
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // console.log("555555555555555555555555555555555555",rrr)

  useEffect(() => {
    for (let j = 1; j < spanCount + 1; j++) {
      axios({
        method: "get",
        url: API_URL + "/File/Files",
        headers: {
          "accept": `application/json`,
          "access-token": `${token}`,
        },
        params: {
          path: `/project/${project_id}/stage4/S00${j}`,
        },
      })
        .then((res) => {
          if (res.data.check === true) {
            for (let i = 0; i < res.data.data.files.length; i++) {
              // console.log("adsfasdfasdfasdfasdf", res.data.data.files.len);

              PanoramaImage.push({
                result_image: `${IMAGE_URL}?path=/project/${project_id}/stage4/S00${j}/${res.data.data.files[i]}&width=1240`,
                no: i,
              });

              setUrll(res.data.data.files[0]);

              // console.log(PanoramaImage[0].result_image)
              ImageList.push({
                result_image: `${IMAGE_URL}?path=/project/${project_id}/stage4/S00${j}/${res.data.data.files[i]}&width=1240`,
                cam: i + 1,
                span: j,
                name: res.data.data.files[i],
                lean: "0",
                left: "0",
                right: "0",
                alllist: (j - 1) * 4 + (i + 1),
              });
              CutList.push({
                name: res.data.data.files[i],
                lean: "0",
                left: "0",
                right: "0",
                resize: "10",
              });
              Result.push({
                key: j,
                name: res.data.data.files[i],
                lean: "",
                left: "",
                right: "",
              });
            }
            setListName(res.data.data.files[0]);
            setAlllest(res.data.data.files.length);
            if (PanoramaImage.length > 0) {
              setPanorama(true);
              // console.log("큰거야큰거",res.data.data.files[0])
            } else {
              alert("파노라마 작업이 진행 중입니다.");
            }
          } else {
          }

          ImageList.sort((obj1, obj2) => {
            if (obj1.span > obj2.span) {
              return 1;
            }
            if (obj1.span < obj2.span) {
              return -1;
            }
            return 0;
          });
          CutList.sort((obj1, obj2) => {
            if (obj1.name > obj2.name) {
              return 1;
            }
            if (obj1.name < obj2.name) {
              return -1;
            }
            return 0;
          });
          let Url = [...panormamImgList];
          Url.sort((obj1, obj2) => {
            if (obj1.no > obj2.no) {
              return 1;
            }
            if (obj1.no < obj2.no) {
              return -1;
            }
            return 0;
          });
          Url.sort((obj1, obj2) => {
            if (obj1.no > obj2.no) {
              return 1;
            }
            if (obj1.no < obj2.no) {
              return -1;
            }
            return 0;
          });
          Url.sort((obj1, obj2) => {
            if (obj1.result_image > obj2.result_image) {
              return 1;
            }
            if (obj1.result_imageo < obj2.result_image) {
              return -1;
            }
            return 0;
          });

          setUrlll(Url[0].result_image);


          let copyArrImgList = [...ImgList];
          for (let i = 0; i < 2; i++) {
            copyArrImgList[i] = { ...copyArrImgList[i] };
            // console.log(ImgList[i].lean, "ImgListttttt")
          }
          setImgList(copyArrImgList);

          let cutArrImgList = [...CutImgList];
          cutArrImgList.sort((obj1, obj2) => {
            if (obj1.key > obj2.key) {
              return 1;
            }
            if (obj1.key < obj2.key) {
              return -1;
            }
            return 0;
          });
          for (let i = 0; i < 2; i++) {
            cutArrImgList[i] = { ...cutArrImgList[i] };
            // console.log(cutArrImgList[i].lean, "cutArrImgListitttttt");
          }
          setCutImgList(cutArrImgList);

          setPanormamImgList(PanoramaImage);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  for (let i = 1; i < cameraNo; i++) {
    Spandist.push({
      input_folder: "stage4_edit",
    });
  }

  let copyArrImgList = [...ImgList];
  let cutArrImgList = [...CutImgList];



  const ok = () => {
    
    console.log("기울기 :" + cutArrImgList[0].lean);

    copyArrImgList[Number(num - 1)] = {
      ...copyArrImgList[Number(num - 1)],
      lean: Number(leanval3),
    };
    setImgList(copyArrImgList);

    cutArrImgList[Number(num - 1)] = {
      ...cutArrImgList[Number(num - 1)],
      lean: Number(leanval3),
    };
    setCutImgList(cutArrImgList);
    console.log(Number(num));
  };

  const ok2 = () => {

      copyArrImgList[Number(num - 1)] = {
        ...copyArrImgList[Number(num - 1)],
        left: Number(cutval1),
        right: Number(cutval2),
      };
      setImgList(copyArrImgList);
      // console.log(copyArrImgList)
      // console.log(ImgList)
      cutArrImgList[Number(num - 1)] = {
        ...cutArrImgList[Number(num - 1)],
        left: Number(cutval1),
        right: Number(cutval2),
      };
      if(cutArrImgList.length > 0){
        setCutImgList(cutArrImgList);

      }
      // console.log(cutClick)


  };

  useEffect(()=>{
    let sData : any[] = cutArrImgList.map((val1 : any, val2: any)=> [String(val1.name), String(val1.lean), String(val1.left), String(val1.right), String(val1.resize)])
    setSendData(sData);
  
    const cutData = [...sData]
    // console.log(sendData)
  },[sendData])

  

  const onClickPonirama = (e: any) => {
    
    alert("파노라마 이미지가 성공적으로 생성되었습니다.")
    // console.log(arr);
    // console.log(Verstitch);
    // axios({
    //   method: "post",
    //   url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
    //   headers: {
    //     "accept": `application/json`,
    //     "access-token": `${token}`,
    //     "Content-Type": `application/json`
    //   },
    //   data: {
    //     project_id: project_id,
    //     task_name: "create_csv",
    //     interactive: false,
    //     tasks: [
    //       {
    //         input_folder: "stage4/S001",
    //         output_folder: "stage4_csv",
    //         csv_name: "Template.csv",
    //         csv_header: ["ImageName", "Lean", "Left", "Right", "Resize"],
    //         csv_values:  sendData
    // ,
    //       },
    //     ],
    //   },
    // })
    //   .then((res) => {
    //     if (res.data.check === true) {
    //       console.log("파노라마 성공");
    //       axios({
    //         method: "post",
    //         url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
    //         headers: {
    //           "accept": `application/json`,
    //           "access-token": `${token}`,
    //           "Content-Type": `application/json`
    //         },
    //         data: {
    //           project_id: project_id,
    //           task_name: "cut_image",
    //           interactive: false,
    //           tasks: [
    //             {
    //               input_folder: "stage4_copy",
    //               template_path: "stage4_csv/Template.csv",
    //               output_folder: "stage4_edit"
    //       ,
    //             },
    //           ],
    //         },
    //       })
    //         .then((res) => {
    //           if (res.data.check === true) {
    //             console.log("cut이미지 성공");
                
    //             axios({
    //               method: "post",
    //               url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
    //               headers: {
    //                 "accept": `application/json`,
    //                 "access-token": `${token}`,
    //                 "Content-Type": `application/json`
    //               },
    //               data: {
    //                 project_id: project_id,
    //                 task_name: "span_dist",
    //                 interactive: false,
    //                 tasks: [{
    //                   input_folder: "stage4_edit"
    //                 }],
    //               },
    //             })
    //               .then((res) => {
    //                 if (res.data.check === true) {
    //                   console.log("스팬분배 성공");
    //                 } else {
    //                   console.log("스팬분배 실패");
    //                 }
    //               })
      
      
      
    //           } else {
    //             console.log("파노라마 실패");
    //           }
    //         })



    //     } else {
    //       console.log("파노라마 실패");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };




  const [choiceIndex, setChoiceIndex] = useState<number>(1);

  const { Column } = Table;

  const onChange = (key: string) => {
    console.log(key);
  };

  const [leanval1, setLeanVal1] = useState(0);
  const [leanval2, setLeanVal2] = useState(0);
  const [leanval3, setLeanVal3] = useState(0);
  const [cutval1, setCutVal1] = useState(0);
  const [cutval2, setCutVal2] = useState(0);

  const onChangeLean1 = (value: any) => {
    setLeanVal1(value);
    setLeanVal3(leanval1 - leanval2 - 1);
    // console.log("기울기"+leanval3)
  };
  const onChangeLean2 = (value: any) => {
    setLeanVal2(value);
    setLeanVal3(leanval1 - leanval2 - 1);
    // console.log("기울기"+leanval3)
  };
  const onChangeCut = (value: any) => {
    setCutVal1(Math.round((value[0])/14.4));
    setCutVal2(Math.round((1140-value[1])/14.4));
  };



  const [prevdisable, setPrevdisisable] = useState(true);
  const [nextdisable, setNextdisable] = useState(false);

  const nextClick = () => {
    if (num < Number(allList) + 1) {
      setNum(num + 1);
      satTab(tab + 1);
      console.log("김잉ㅇㅇㅇㅇㅇㅇㅇㅇ" + Number(allList), num);
      setNextdisable(false);
      setPrevdisisable(false);
    }
    if (num >= Number(allList) - 2) {
      setNextdisable(true);
      console.log(Number(allList) - 1, num);
      setPrevdisisable(false);
    }
  };

  const prevClick = () => {
    if (num <= Number(allList) - 1) {
      setNum(num - 1);
      satTab(tab - 1);
      console.log("감소" + num);
      setNextdisable(false);
      if (num <= 1) {
        setPrevdisisable(true);
        setNextdisable(false);
      }
    }
  };

  let tempList: any[] = [];
  let result_list: any[][] = [];

  for (let i = 0; i < spanCount; i++) {
    tempList = ImgList.filter((Img: { span: any }) => Img.span === i + 1);
    result_list.push(tempList);
  }
  const [url, setUrl] = useState("0");

  const rendering = () => {
    let result = [];
    for (let i = 1; i < spanCount + 1; i++) {
      result.push(
        <TabPane tab={"Span" + `${i}`} key={i}>
          <div
            className="sd"
            style={{ display: "flex", width: "1610px", height: "730px" }}
          >
            <div className={styles.CamList}>
              <div
                className="tableContainer"
                style={{ width: "400px", fontSize: "10px", cursor: "pointer" }}
              >
                <Table
                  dataSource={result_list[i - 1]}
                  pagination={false}
                  scroll={{ y: 640 }}
                  size="small"
                >
                  <Column title="no" dataIndex="cam" key="cam" width={20} />
                  <Column
                    title="name"
                    dataIndex="name"
                    key="name"
                    width={115}
                    onCell={(gi: number | any) => {
                      return {
                        onClick: (e) => {
                          setCam(gi.cam);
                          setUrl(gi.name);
                          setSpan(gi.span);
                          setLean(leanval3);
                          setPanoramaa(true);
                          setNum(gi.alllist);
                          console.log(gi.cam);
                        },
                      };
                    }}
                  />
                  <Column title="Lean" dataIndex="lean" key="lean" width={30} />
                  <Column title="Left" dataIndex="left" key="left" width={25} />
                  <Column
                    title="Right"
                    dataIndex="right"
                    key="righg"
                    width={30}
                  />
                </Table>
              </div>
            </div>

            <div
              style={{ width: "1340px", height: "650px", marginLeft: "10px" }}
            >
              <Tabs onChange={onChange} type="card">
                <TabPane tab="Lean" key="1">
                  <div
                    style={{
                      width: "100%",
                      height: "315px",
                      marginTop: "30px",
                    }}
                  >
                    {/* `/project/${project_id}/stage4/S00${j}` */}
                    <img
                      src={
                        panoramaa === true
                          ? `${IMAGE_URL}/image?path=/project/${project_id}/stage4/S00${span}/${url}&width=1240`
                          : rrr
                      }
                      alt=""
                      width={1140}
                      height={400}
                      style={{ marginLeft: "20px" }}
                    ></img>
                    <div style={{ paddingLeft: "15px" }}>
                      {/* <CosSlider range defaultValue={[0,1340]} disabled={disabled} min={0} max={1340}  onChange={onChange1}/> */}
                      <a
                        style={{
                          paddingLeft: "15px",
                          color: "black",
                          cursor: "default",
                        }}
                      >
                        위 :
                      </a>{" "}
                      <TopCosSlider
                        style={{ width: "1140px", marginTop: "10px" }}
                        defaultValue={1140}
                        min={0}
                        max={1140}
                        onChange={onChangeLean1}
                      />{" "}
                    </div>
                    <div style={{ paddingLeft: "15px" }}>
                      <a
                        style={{
                          paddingLeft: "15px",
                          color: "black",
                          cursor: "default",
                        }}
                      >
                        아래 :
                      </a>{" "}
                      <BotCosSlider
                        style={{ width: "1140px" }}
                        defaultValue={0}
                        min={0}
                        max={1140}
                        onChange={onChangeLean2}
                      />{" "}
                    </div>

                    <div className="sds"></div>
                    <Button
                      disabled={prevdisable}
                      style={{
                        width: "130px",
                        height: "30px",
                        marginLeft: "880px",
                        marginRight: "20px",
                      }}
                      onClick={prevClick}
                    >
                      이전
                    </Button>
                    <Button
                      disabled={nextdisable}
                      style={{
                        width: "130px",
                        height: "30px",
                        marginTop: "30px",
                      }}
                      onClick={nextClick}
                    >
                      다음
                    </Button>
                    <Button
                      style={{
                        width: "150px",
                        marginTop: "30px",
                        marginLeft: "1010px",
                      }}
                      onClick={ok}
                    >
                      완료
                    </Button>
                    <Button
                      style={{
                        width: "300px",
                        marginTop: "20px",
                        marginLeft: "1010px",
                      }}
                      onClick={onClickPonirama}
                    >
                      실행
                    </Button>
                  </div>
                </TabPane>
                <TabPane tab="Cut" key="2">
                  <div
                    style={{
                      width: "100%",
                      height: "315px",
                      marginTop: "30px",
                    }}
                  >
                    <img
                      src={
                        panoramaa === true
                          ? `${IMAGE_URL}/image?path=/project/${project_id}/stage4/S00${span}/${url}&width=1240`
                          : rrr
                      }
                      alt=""
                      width={1140}
                      height={400}
                      style={{ marginLeft: "20px" }}
                    ></img>
                    <div style={{ paddingLeft: "15px" }}>
                      <CosSlider
                        style={{ width: "1140px", marginTop: "30px" }}
                        range
                        defaultValue={[0, 1140]}
                        min={0}
                        max={1140}
                        onChange={onChangeCut}
                      />{" "}
                    </div>
                    <Button
                      disabled={prevdisable}
                      style={{
                        width: "130px",
                        height: "30px",
                        marginLeft: "880px",
                        marginRight: "20px",
                      }}
                      onClick={prevClick}
                    >
                      이전
                    </Button>
                    <Button
                      disabled={nextdisable}
                      style={{
                        width: "130px",
                        height: "30px",
                        marginTop: "5px",
                      }}
                      onClick={nextClick}
                    >
                      다음
                    </Button>

                    <Button
                      style={{
                        width: "150px",
                        marginTop: "50px",
                        marginLeft: "1010px",
                      }}
                      onClick={ok2}
                    >
                      완료
                    </Button>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </TabPane>
      );
    }

    return result;
  };

  return (
    <div>
      <div className={styles.DivArea}>
        <div>
          <p className={styles.subOrder}>
            {t.Panorama} &gt; {t.pnImageEdit}
          </p>
          <p className={styles.mainOrder}>{t.pnImageEdit}</p>
        </div>

        <div className={styles.SetDiv}>
          <Tabs defaultActiveKey="1">{rendering()}</Tabs>
        </div>
        <div style={{ float: "right", marginRight: "10px" }}>
          {/* <Button disabled={prevdisable} style={{width:"150px", marginRight: "20px"}} onClick={prevClick}>이전</Button> */}

          {/* <Button disabled={nextdisable} style={{width:"150px", marginTop: "25px"}} onClick={nextClick}>다음</Button> */}
        </div>
      </div>
    </div>
  );
}
