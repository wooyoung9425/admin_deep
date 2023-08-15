import { useEffect, useState, useRef } from 'react';
import { Radio, Col, InputNumber, Row, Slider, Button, Upload } from 'antd';
import type { RadioChangeEvent, UploadProps } from 'antd';
// import type { UploadProps } from 'antd';
import styles from '../Styles/CrackDetector_Measure.module.css';
import axios from "axios";
import { API_URL} from '../Store/Global';

export default function ViewerCrack() {  

  //Corrosion 부식 #F59331
  //Crack 균열 #322770
  //Desquamation 박락 #B971F0
  //Efflorescence 백태 #E21F5D
  //Fail 파손 #275D0E
  //Leakage 누수 #02BABC
  //PaintDesquamation 도장박락 #1B8F73
  //PaintSpalling 도장박리 #0E4DDE
  //RebarExposure 철근노출 #B83DF5
  //Segregation 재료분리 #FF6037
  //Spalling 박리 #1B8F05 

  let project_id: string | null = localStorage.getItem("project_id")

  let EditImageStore = localStorage.getItem("edit_crack_image");

  let project_type: string | null = localStorage.getItem("project_Type");

  let bridge_type: string | null = localStorage.getItem("bridge_type");

  const canvasRef = useRef<any>(null);

  const [ctx, setCtx] = useState<any>();

    // Slider
    const [inputValue, setInputValue] = useState(20);

    //color
    const [color, setColor] = useState<string>("#ffffff");

    // getCtx
    const [getCtx, setGetCtx] = useState<any>(null);
  
    // getCanvas
    const [getCanvas, setGetCanvas] = useState(null);

    // painting state
    const [painting, setPainting] = useState(false);

    const [TestImage, setTestImage] = useState<any>();
    const [TestImageW, setTestImageW] = useState<number>();
    const [TestImageH, setTestImageH] = useState<number>();
    const [TestImageLen, setTestImageLen] = useState<boolean>(false);

    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);
    let token: string | null = localStorage.getItem("token");
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


  useEffect(() => {
    console.log("균열 수정")
    const indexBack = EditImageStore?.indexOf("&") 
    const uploadImgName = String(EditImageStore).substring(0, indexBack)

    const canvas : any = canvasRef.current;
    const ctx : any = canvas.getContext("2d");
    setCtx(canvas.getContext("2d"));

    const image = new Image();
    image.src = uploadImgName;
    image.crossOrigin = 'Anonymous';

    image.onload = function() {

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, image.width, image.height);


      setTestImage(image)
      console.log(image)
      setTestImageW(project_type === "Bridge" && bridge_type === "Girder" ? image.width / 20 : image.width / 10)
      setTestImageW(project_type === "Tunnel" ? image.width*1.3: image.width*1.3)
      setTestImageH(project_type === "Bridge" && bridge_type === "Girder" ? image.height / 20 : image.height / 10)
      setTestImageH(project_type === "Tunnel" ? image.height *2 : image.height *2)
    };

    ctx.lineJoin = "round";
    ctx.lineWidth = inputValue; // 라인 크기 조절
    ctx.strokeStyle = color; // 흰색 #ffffff, 회색 #808080, 검은색 #0000000

    if(String(TestImage).length > 0){
      setTestImageLen(true)
    }

    setGetCtx(ctx);
    setGetCanvas(canvas);
  }, [])

const drawFn = (e:any) => {
  // mouse position
  const mouseX = project_type === "Bridge" && bridge_type === "Girder" ? e.nativeEvent.offsetX * 20 : e.nativeEvent.offsetX * 10 ;
  const mouseY = project_type === "Bridge" && bridge_type === "Girder" ? e.nativeEvent.offsetY * 20 : e.nativeEvent.offsetY * 10 ;

  if (!painting) {
    getCtx.beginPath();
    getCtx.moveTo(mouseX, mouseY);
  } else {
    getCtx.lineTo(mouseX, mouseY);
    getCtx.stroke();
  }
}

const onChange = (value:any) => {
  const canvas : any = canvasRef.current;
  const ctx : any = canvas.getContext("2d");

    ctx.lineJoin = "round";
    ctx.lineWidth = inputValue; // 라인 크기 조절
    ctx.strokeStyle = color; // 흰색 #ffffff, 회색 #808080, 검은색 #0000000

    setGetCtx(ctx);
    setGetCanvas(canvas);

  if (isNaN(value)) {
      return;
  }
  setInputValue(value);
};

const onChangeColor = (e: RadioChangeEvent) => {

  const canvas : any = canvasRef.current;
    const ctx : any = canvas.getContext("2d");

    ctx.lineJoin = "round";
    ctx.lineWidth = inputValue; // 라인 크기 조절
    ctx.strokeStyle = color; // 흰색 #ffffff, 회색 #808080, 검은색 #0000000

    setGetCtx(ctx);
    setGetCanvas(canvas);

  if(e.target.value===1){
    setColor("#FFFFFF")
  }else if(e.target.value===2){
    setColor("#000000")
  }
}

const onClickSetting = () => {
  const canvas : any = canvasRef.current;
  const ctx : any = canvas.getContext("2d");

  ctx.lineJoin = "round";
  ctx.lineWidth = inputValue; // 라인 크기 조절
  ctx.strokeStyle = color; //

  setGetCtx(ctx);
  setGetCanvas(canvas);
}


const onClickUpload = () => {
  alert("수정이 완료 되었습니다.")
  const canvas = document.querySelector(`.${document.getElementById("imageID")?.className} canvas:nth-child(1)`) as HTMLCanvasElement;
  const canvasAddress = canvas.toDataURL("image/png");

  const indexFront = EditImageStore?.indexOf("/stage")
  const indexBack = EditImageStore?.indexOf("&")

  const uploadImgName = project_type === "Bridge"  ?  bridge_type === "Girder" ? 
                                                                              String(EditImageStore).substring(Number(indexFront)+27, indexBack)
                                                                              : bridge_type === "GirderSide" ? String(EditImageStore).substring(Number(indexFront)+31, indexBack)
                                                                              : bridge_type === "Slab" ? String(EditImageStore).substring(Number(indexFront)+25, indexBack)
                                                                              : String(EditImageStore).substring(Number(indexFront)+23, indexBack)
                                                    :String(EditImageStore).substring(Number(indexFront)+8, indexBack)
  const TunneluploadImgName = project_type === "Tunnel"  ?  
                                                    String(EditImageStore).substring(Number(indexFront)+27, indexBack)
                                                    : String(EditImageStore).substring(Number(indexFront)+23, indexBack)
                          // : String(EditImageStore).substring(Number(indexFront)+8, indexBack)


  const BridgeSpanNum = project_type === "Bridge" ? bridge_type === "Girder" ? String(EditImageStore).substring(Number(indexFront)+42, Number(indexBack)-10)
                                                                              : bridge_type === "GirderSide" ? String(EditImageStore).substring(Number(indexFront)+47, Number(indexBack)-10)
                                                                              : bridge_type === "Slab" ? String(EditImageStore).substring(Number(indexFront)+37, Number(indexBack)-10)
                                                                              : String(EditImageStore).substring(Number(indexFront)+19, Number(indexBack)-19)
                                                  : ""

 const TunnelSpanNum = project_type === "Tunnel" ?  String(EditImageStore).substring(Number(indexFront)+42, Number(indexBack)-10)
                                                  : String(EditImageStore).substring(Number(indexFront)+19, Number(indexBack)-19)
                     

                                                  

  // console.log(uploadImgName)
  // console.log(`stage6_crack/${bridge_type}/${BridgeSpanNum}`)

  // const downloadImage = document.createElement("a");
  // downloadImage.href = canvasAddress;
  // downloadImage.download = uploadImgName;
  // downloadImage.click();
  // console.log(downloadImage)

  // 터널 업로드 할 때 쓰면 돼
  // project_type === "Tunnel" ? 
  // axios({
  //   method: 'post',
  //   // url: API_URL + `/File/Upload/${project_id}/stage6/${uploadImgName}`,
  //   url: API_URL + `/file/upload/${project_id}?path=stage6&filename=${uploadImgName}`,
  //   headers: { 
  //   "accept": `application/json`,
  //   "access-token": `${token}`,
  //   "Content-Type": `multipart/form-data`  },
  // data: { upload: dataURLtoFile(canvasAddress,uploadImgName) },
  // }).then((res) => {
  //     console.log(res.data.check, res)
  // }).catch((err) => {
  //     console.log(err)
  // })
  // :

    project_type === "Tunnel" ? 
  axios({
    method : 'post',
    // url : API_URL + `/File/Upload/${project_id}`,
    url: API_URL + `/file/upload/${project_id}?path=stage6_crack/${TunnelSpanNum}&filename=${TunneluploadImgName}`,
    headers: { 
    "accept": `application/json`,
    "access-token": `${token}`,
    "Content-Type": `multipart/form-data`  },
  // params : {
  //     path: `stage6_crack/${bridge_type}/${BridgeSpanNum}`,
  //     filename : uploadImgName
  //   },
    data : {upload: dataURLtoFile(canvasAddress,TunneluploadImgName)},
  }).then((res) => {
    console.log(res.data.check, res)
  }).catch((err) => {
    console.log(err)
  })

  :
  //교량 균열할 때 쓰면 돼
  axios({
    method : 'post',
    // url : API_URL + `/File/Upload/${project_id}`,
    url: API_URL + `/file/upload/${project_id}?path=stage6_crack/${bridge_type}/${BridgeSpanNum}&filename=${uploadImgName}`,
    headers: { 
    "accept": `application/json`,
    "access-token": `${token}`,
    "Content-Type": `multipart/form-data`  },
  // params : {
  //     path: `stage6_crack/${bridge_type}/${BridgeSpanNum}`,
  //     filename : uploadImgName
  //   },
    data : {upload: dataURLtoFile(canvasAddress,uploadImgName)},
  }).then((res) => {
    console.log(res.data.check, res)
  }).catch((err) => {
    console.log(err)
  })
}

const dataURLtoFile = (dataurl: any, fileName: string) => {
  var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
          
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, {type:mime});
}

  return (
    <>
      <div className={styles.viewerDiv} id="imageID">
      {/* {rendering()} */}
      <p/>
      <p className={styles.mainOrder}>균열 검출 결과를 수정하세요.</p>
      <div className={styles.canvasWrap}>
        <canvas    
          style={{width: TestImageLen === true ? TestImageW: "", height : TestImageLen === true ? TestImageH : ""}}
          className="canvas"
          ref={canvasRef}
          onMouseDown={() => setPainting(true)}
          onMouseUp={() => setPainting(false)}
          onMouseMove={e => drawFn(e)}
          onMouseLeave={() => setPainting(false)}
        >
      </canvas>
    </div>

    <div>
    <Row>
          <Col span={4}/>

          <Col span={5}>
            <div className={styles.subOrder}> 붓 두께 설정 : </div>
          </Col>

          <Col span={6}>
              <Slider
                  min={0}
                  max={100}
                  onChange={onChange}
                  value={inputValue}
                  step={1}
              />
          </Col>

          <Col span={5}>
              <InputNumber
                  min={0}
                  max={100}
                  step={1}
                  value={inputValue}
                  onChange={onChange}
              />
          </Col>

          <Col span={4}/>

      </Row>

      <Row>
          <Col span={4}/>

          <Col span={5}>
            <div className={styles.subOrder}> 붓 색상 설정 : </div>
          </Col>

          <Col span={6}>
            <Radio.Group onChange={onChangeColor} optionType="button">
                    <Radio value={1}>White</Radio>
                    <Radio value={2}>Black</Radio>
              </Radio.Group>
          </Col>

          <Col span={5}>
              
          </Col>

          <Col span={4}/>

      </Row>

      <br/>

      <Row>
          <Col span={6}/>

          <Col span={6}>
            <Button onClick={onClickSetting}> 붓 설정 적용하기 </Button>
          </Col>

          <Col span={6}>
            {/* <Upload {...props}> */}
              <Button onClick={onClickUpload}> 업로드하기 </Button>
            {/* </Upload> */}
          </Col>

          <Col span={6}/>

      </Row>

      <br/>

      </div>
      </div>
    </>
    
  )
}
