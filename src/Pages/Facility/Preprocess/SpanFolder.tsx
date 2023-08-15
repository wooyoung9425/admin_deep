import { Button, Tabs} from 'antd';
import { useEffect, useState } from 'react';
import styles from '../../../Styles/Preprocess.module.css'
import { ko, en } from '../../../translations';
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import axios from "axios";
import { API_URL, IMAGE_URL } from '../../../Store/Global';

interface Image {
  camerafolderName : string;
  spanfolderName : string;
  imageURL : Array<string>;
}

export default function SpanFolder() {

  // let CameraCount:any[] = [];

  const images : Image [] = [];
  // const copyFolder : CopyFolder [] = [];

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")
    const project_type = localStorage.getItem("project_Type");

    const [cameraCount, setcameraCount] = useState<number>(0);
    const [ImgList, setImgList] = useState<any[]>(images);

    // const [Copyarr, setCopyarr] = useState<any[]>(copyFolder);

    const [resultImageList, setresultImageList] = useState<boolean>(false)

    // const [ProjectNameEn, setProjectNameEn] = useState<string>("")

    const { TabPane } = Tabs;

    const rendering = (j:number) => {
      const resultImage:any[] = [];        
      ImgList[j].imageURL.map((imageURL:any)=>{
          resultImage.push(<img src={imageURL} id={String(j)} alt={imageURL} key={imageURL} className={styles.JtagImage}/>)
      })
          
      if(resultImage.length < 1){
          setresultImageList(false);
      }
      return resultImage;
  }

    const Tabrendering = () => {
      const resultTab:any[] = [];   

      for (let i = 1; i < cameraCount+1; i++) {

      resultTab.push(     
        <TabPane tab={"Camera " + `${i}`} key={i}>
          <div className={styles.JtagDiv}>
                        { 
                        resultImageList === true ? 
                            ImgList.map((_,j)=>(
                                // console.log(i);
                                // CameraSet[j].FirstCamera - 1 <= i && i < CameraSet[j].LastCamera ? 
                                // ImgList[j].camerafolderName === "C0" + Number(i) ?
                                ImgList[j].camerafolderName === "C" + String(i).padStart(2,"0") ?
                                <div className={styles.ImageScrollDivDrone}>
                                    <ul className={styles.ImageScrollDivUl}>
                                    <div className={styles.ImageDiv}>
                                        <div>{ImgList[j].camerafolderName}. {ImgList[j].spanfolderName}</div>
                                        <br />
                                        { rendering(j) }
                                    </div>
                                    </ul>
                                </div>
                                : <div></div>
                            ))
                            :   
                            <div>
                            이미지 로딩 중 입니다.
                            </div>
                    }
                    </div>      
        </TabPane>
      )            
      
      if(resultTab.length < 1){
          // setresultImageList(false);
      }
    }
      return resultTab;
  }

  useEffect(()=>{
    // console.log(cameraCount)
    const response = axios({
        method: 'get',
        url: API_URL + `/project/view/${project_id}`,
        headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
    }).then((res) => {
      if (res.data.check === true) {
            const settings: any = JSON.parse(res.data.data.settings)
            if (res.data.check === true) {
                setcameraCount(settings.cameraCount)
                // setProjectNameEn(settings.tunnel_eng)
                // copyFolder.push({
                //   input_folder : "stage0_use",
                //   output_folder : `stage2/${settings.tunnel_eng}`
                // })
                
                for(let i = 0; i < settings.cameraCount; i++){
                  for(let j =0; j<settings.spanCount; j++){
                  images.push({
                    // camerafolderName:"C0" + Number(i + 1),
                    camerafolderName:"C" + String(i + 1).padStart(2,"0"),
                    // spanfolderName :"S00" + Number(j + 1),
                    spanfolderName :"S" + String(j + 1).padStart(3,"0"),
                    imageURL : []
                  })
                }
              }

              for(let i = 0; i < settings.cameraCount * settings.spanCount; i++){
                // for(let j = 0; j < settings.spanCount; j++){
                  axios({
                      method: 'get',
                      url: API_URL+'/File/Files',
                      headers: { "accept": `application/json`, "access-token": `${token}` },
                      params: {
                          path: `/project/${project_id}/stage2/${settings.airport_eng}/${images[i].camerafolderName}/${images[i].spanfolderName}`
                      }
                  }).then((res)=>{
                      if (res.data.check === true) {
                          // console.log("성공")

                          // console.log(res.data.data.files)
      
                          for(let j=0; j<res.data.data.files.length; j++){
                              images[i].imageURL.push(`${IMAGE_URL}/image?path=/project/${project_id}/stage2/${settings.airport_eng}/${images[i].camerafolderName}/${images[i].spanfolderName}/${res.data.data.files[j]}&width=360`)
                          }

                          setresultImageList(true);
      
                      } else {
                          console.log("실패")
                      }
                  }).catch((err) => {
                      console.log(err);
                  });
                // }
            }
          }
        setImgList(images);
        // setCopyarr(copyFolder);
      }
    }).catch((err) => {
        console.log(err);
    });

    // console.log(ImgList)
    // console.log(resultImageList)
},[])

const onClickConfirm = (e:any) => {
  window.location.replace('../Panorama/SettingAirport')
}


  return (
      <>
      <div className={styles.DivArea}>
                <p className={styles.subOrder}>{t.ppPreprocessor} &gt; {t.ppDistFolder}</p>
                <p className={styles.mainOrder}>{t.ppDistFolder}</p>     
      <Tabs defaultActiveKey="1">
          { Tabrendering()}
      </Tabs>

      <Button onClick={onClickConfirm}>확인</Button>


      </div>
      </>
  )
}
