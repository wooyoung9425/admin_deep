import { Slider } from 'antd';
import styles from '../../../Styles/Preprocess.module.css'
import {StepBackwardOutlined, CaretRightOutlined,PauseOutlined, StepForwardOutlined} from '@ant-design/icons';
import ReactPlayer from 'react-player'
import { VideoContents } from '../../../Store/Type/type';
import { useState, useRef, useEffect } from 'react';
import { VideoList,  videoURL,TimeSet } from '../../../Store/State/atom';
import { useRecoilValue, useRecoilState, constSelector } from 'recoil';
import axios from "axios";
import { API_URL } from '../../../Store/Global';

export default function VideoController() {
    //token
    let token: string | null = localStorage.getItem("token") 
    let project_id: string | null = localStorage.getItem("project_id")
    let fps: number = 0;
    const [btn, setBtn] = useState("확인")
    const [task, setTask] = useState<any>([])
    const [editName,setEditName]=useState<any>([])



    const [userid, setUserId] = useState<number>(-1);
    const [companyid, setCompanyId] = useState<number>(-1);

    const [isBind, setIsBind] = useState(false);

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

    const DataBind = () => {
        if (!isBind) {
            getIdCompany();
            setIsBind(true);
        }
      };
  
    useEffect(() => {
        DataBind();
        
      }, [isBind]);

  
    
    // checkbox 
    const [checkbox1, setCheckbox1] = useState(false)
    const [checkbox2, setCheckbox2] = useState(false)
    
    //project 정보 가져오기
    let flip_setting = 0
    let file_prefix =""

    useEffect(()=>{
        if (typeof window !== 'undefined' || "null") {
            // console.log('You are on the browser');
            token = localStorage.getItem("token");
        } else {
            console.log('You are on the server');
            // 👉️ can't use localStorage1
        }

        axios({
            method: 'get',
            url: API_URL + `/project/view/${project_id}`,
            headers: { "accept": `application/json`, "access-token": `${token}` },
        }).then((res) => {
            const settings: any = JSON.parse(res.data.data.settings)
            console.log(settings)
            setCameraNo(settings.cameraCount)

            file_prefix = settings.tunnel_eng + '_' + settings.direction+'_C'
            console.log(file_prefix)
            if (settings.scanSpeed === 10) {
                const speed = 15
                fps = Number(settings.fps / speed)
                console.log("fps 값은 : ",fps)
            } else if (settings.scanSpeed === 20) {
                const speed = 30
                fps = Number(settings.fps / speed)
                console.log("fps 값은 : ",fps)
            } else if (settings.scanSpeed === 30) {
                const speed = 60
                fps = Number(settings.fps / speed)
                console.log("fps 값은 : ",fps)
            }
        })
    })

    let video_url = useRecoilValue(videoURL);
    // const [videoList, setVideoList] = useState<VideoContents[]>([]);
    const [videoList, setVideoList] = useRecoilState<VideoContents[]>(VideoList);
    let Index = videoList.findIndex((element) => element["no"] === video_url[0]);
    // let Index = video_url[0];
    let [sliderStart,setSliderStart] = useState(0) 
    let [sliderEnd, setSliderEnd] = useState(1000)
    
    const formatter = (value: any) => `${String(Math.floor(value/60%60)).padStart(2,'0') +':'+String(Math.floor(value%60)).padStart(2,'0')}`;
    const videoRef = useRef<ReactPlayer>(null);
    // const du_hh = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getDuration() / 60 / 60)).padStart(2, '0') : "00"
    const du_mm = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getDuration() / 60 % 60)).padStart(2, '0') : "00"
    const du_ss = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getDuration() % 60)).padStart(2, '0') : "00"   
    const duration = videoRef && videoRef.current ? du_mm + ":" + du_ss : "00:00";
    // const duration = videoRef && videoRef.current ? du_hh + ":" + du_mm + ":" + du_ss : "00:00:00";
    const [startTime, setStartTime] = useState<any>('00:00')
    const [endTime, setEndTime] = useState(duration)
    const [state, setState] = useState({
        playing: false,     // 재생중인지
        muted: false,      // 음소거인지
        controls: false,   // 기본으로 제공되는 컨트롤러 사용할건지
        volume: 0.5,       // 볼륨크기
        playbackRate: 1.0, // 배속
        played: 0,         // 재생의 정도 (value)
        seeking: false,    // 재생바를 움직이고 있는지
        duration: 0,       // 전체 시간
    });
    
    // let hh = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getCurrentTime() / 60 / 60)).padStart(2, '0') : "00"
    let mm = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getCurrentTime() / 60 % 60)).padStart(2, '0') : "00"
    let ss = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getCurrentTime() % 60)).padStart(2, '0') : "00"
    // let currentTime = videoRef && videoRef.current ? hh+':'+mm+':'+ ss : "00:00:00";
    let currentTime = videoRef && videoRef.current ? mm+':'+ ss : "00:00";
    
    const progressHandler = () => {
        // console.log(state.playing)
        // hh = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getCurrentTime() / 60 / 60)).padStart(2, '0') : "00"
        mm = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getCurrentTime() / 60 % 60)).padStart(2, '0') : "00"
        ss = videoRef && videoRef.current ? String(Math.floor(videoRef.current.getCurrentTime() % 60)).padStart(2, '0') : "00"
        
        currentTime =  mm + ':' + ss;
        // currentTime = hh + ':' + mm + ':' + ss;
        // console.log(state.playing, currentTime)
        console.log(1)
        
        if (Index !== -1) {
            const a = Number(videoList[Index].start.substring(0, 2) * 60) + Number(videoList[Index].start.substring(3, 5))
            const b = Number(videoList[Index].end.substring(0, 2)) * 60 + Number(videoList[Index].end.substring(3, 5))
            setSliderEnd(b)
            setSliderStart(a)
            console.log(a, b)

        }
        setState({ ...state, })
    }

    
    const rewindHandler = () => {
        videoRef.current?.seekTo(videoRef.current.getCurrentTime() - 3)
        console.log(videoRef.current?.getCurrentTime())
    }
    const forwardHandler = () => {
        videoRef.current?.seekTo(videoRef.current.getCurrentTime() + 3)
        console.log(videoRef.current?.getCurrentTime())
    }
    const startPlay = () => {
        setState({ ...state, playing: true, })
        console.log(state.playing)
    }
    const stopPlay = () => {
        setState({ ...state, playing: false })
        console.log(state.playing)
    }


    const onChange = (value: number | any) => {
        console.log('onChange: ', value);
        // const start_hh = String(Math.floor(value[0] / 60 / 60)).padStart(2, '0')
        const start_mm = String(Math.floor(value[0] / 60 % 60)).padStart(2, '0')
        const start_ss = String(Math.floor(value[0] % 60)).padStart(2, '0')
        // const end_hh = String(Math.floor(value[1] / 60 / 60)).padStart(2, '0')
        const end_mm = String(Math.floor(value[1] / 60 % 60)).padStart(2, '0')
        const end_ss = String(Math.floor(value[1] % 60)).padStart(2, '0')
               
        setStartTime(start_mm + ':' + start_ss)
        setEndTime( end_mm + ':' + end_ss)
        // setStartTime(start_hh + ':' + start_mm + ':' + start_ss)
        // setEndTime(end_hh + ':' + end_mm + ':' + end_ss)
    };
    const [value1, setvalue1] = useState<number>(0)
    const [value2, setvalue2] = useState(duration)
    
    const onAfterChange = (value: number|any) => {
        console.log(7)
        if (value1 !== value[0]) {
            setvalue1(value[0])
            videoRef.current?.seekTo(value[0])
        } else if (value2 !== value[1]) {
            setvalue2(value[1])
            videoRef.current?.seekTo(value[1])
        }
    };
    
    //list저장 및 이미지 분할 api연결 전달
    
    const [cameraNo, setCameraNo]=useState(0);
    const TimeSetList = (e: any) => {
        console.log(fps)
        const findIndex = videoList.findIndex((element) => element["no"] === video_url[0]);
        // const findIndex = video_url[0];
        console.log(findIndex)

        let copyarr = [...videoList]
        if (endTime === '00:00') {
            copyarr[Index] = { ...copyarr[Index], start: startTime, end: duration }
        } else {
            copyarr[Index] = { ...copyarr[Index], start: startTime, end: endTime }
        }    
        
        setVideoList(copyarr)
       
        if (findIndex !== -1) {
            console.log("상하 : ", checkbox1, "좌우: ", checkbox2)
            if (checkbox1 === true && checkbox2 === true) {
                //상하 좌우 둘다
                flip_setting = -1
            } else if (checkbox1 === true && checkbox2 === false) {
                //상하만
                flip_setting=0
            } else if (checkbox1 === false && checkbox2 === true) {
                //좌우만
                flip_setting=1
            } else {
                // 둘다안함
                flip_setting=2
            }
            const str = String(videoList[findIndex].no-1).padStart(2, '0')
            const str_name = String(videoList[findIndex].no).padStart(2, '0')
            console.log("상하좌우:",  flip_setting, videoList[findIndex].no)
            
            console.log('카메라 번호', str, '  비디오 이름 :', video_url, videoList[Number(str)].Video_name.props.children)
           

            const index = editName.indexOf(videoList[Number(str)].Video_name.props.children)
            
            if (index !== -1) {
                // alert(index+"동일한거 있어"+endTime)
                const arr = [...task]
                console.log(arr)
                arr[index] = { ...arr[index], cut_front_sec: startTime, cut_end_sec: endTime }
                setTask(arr)
                
            } else {
                // alert(index + "동일한거 없어"+flip_setting)
                if (editName.length === 0) {
                    setEditName([videoList[findIndex].Video_name.props.children])
                } else {
                    setEditName([...editName, videoList[findIndex].Video_name.props.children])
                }
                if (endTime === '00:00') {
                    setTask([...task, {
                        video_name: videoList[findIndex].Video_name.props.children,
                        cut_front_time: startTime, 
                        cut_end_time: duration,
                        flip_setting: flip_setting, //상하반전여부 filesetting
                        input_folder: "stage0/C"+ str_name,
                        output_folder: "stage1/C" + str_name,
                        file_prefix: file_prefix +str_name+"_", //이름 규칙
                        fps_setting: fps
                    }])
                } else {
                    console.log(index)
                    setTask([...task, {
                        video_name: videoList[findIndex].Video_name.props.children,
                        cut_front_time: startTime, //ex)1분 30초 => 90으로 넘어감
                        cut_end_time: endTime,
                        flip_setting: flip_setting, //상하반전여부 filesetting
                        input_folder: "stage0/C"+ str_name,
                        output_folder: "stage1/C" + str_name,
                        file_prefix: file_prefix+str_name+"_", //이름 규칙
                        fps_setting: fps
                    }])
                }
                
            }
            console.log(task)
            console.log("이름", editName, startTime,endTime)
        }
        
    }

    /////////////////30초마다 status알려주는 alert//////////////////////////////////////////
    let job_id = 0;
    let result :any;
    const confirm = () => {
        console.log(job_id)
        axios({
            url: API_URL + '/scheduler/job/query',
            headers: { "accept": `application/json`, "access-token": `${token}`, "Content-Type" : `application/json` },
                data: {
                    "job_id": job_id ,
                    "company_id": companyid
                }               
            }).then((res) => {
                console.log(res)
                if (res.data.check == true) {
                    console.log("성공")
                    if (res.data.data.status === "done") {
                        alert("이미지 추출이 끝났습니다.")
                        setTask([])
                        clearInterval(result)
                        window.location.href='../Preprocess/ImageTask'
                    } else if (res.data.data.status === "progress") {
                        // alert("이미지 추출중입니다.")
                    } else if(res.data.data.status === "error"){
                        alert("해당 파일이 없습니다.")
                    }
                 } else {
                    console.log("실패")
                 }
            })
        
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    const imageCut = () => {
        alert("이미지 추출중입니다. 잠시만 기다려주세요.")
        // setTimeout(function() {
        //     alert("이미지 추출이 완료되었습니다.")
        //   }, 2000);

        console.log(task)
        console.log("카메라 개수", cameraNo)
        console.log("fps", fps)
        if (task.length === cameraNo) {
            const response = axios({
                method: "post",
                url: API_URL +`/scheduler/job/start/${companyid}/${userid}`,
                headers: {
                  "accept": `application/json`,
                  "access-token": `${token}`,
                  "Content-Type": `application/json`
                },
                      data: {
                    project_id: project_id,
                    task_name: "video_cut_frame",
                    interactive: false,
                    tasks:task
                }
            }).then((res)=>{
                console.log("-------------"+res.data.check)
                if (res.data.check == true) {
                    console.log("성공", res.data.data.job_id) 
                    job_id = res.data.data.job_id
                    /////30초마다 alert로 알려줌////////////
                    result = setInterval(confirm, 30000)
                    alert("이미지 추출중입니다.")
                    console.log(task)
                } else {
                    console.log("실패")
                }
            }).catch((err) => {
                console.log(err);
                console.log(task)
            });
        } else {
            console.log(task)
            // console.log(arr)
            alert("영상파일과 카메라 수가 일치하지 않습니다.")
        }
        
    }
   
    
  return (
    <>
        <div style={{float:'left'}}>
            <ReactPlayer className={styles.react_player} controls={false}
              url={ video_url} 
              ref={videoRef}  
              onProgress={progressHandler}
              playing={state.playing}
                  
            /> 
            <div style={{ float: "left", width: "10vw", fontSize:'0.75vw'}}>
                <h2>{currentTime} / {duration} </h2>
            </div>
            <div style={{ paddingLeft:"6vw", paddingRight:"13vw", float:'left'}}>
              <StepBackwardOutlined className={styles.playControll} onClick={rewindHandler} />
              <button>
                {!state.playing ? (
                     <CaretRightOutlined className={styles.playControll} onClick={startPlay} />) : (
                     <PauseOutlined className={styles.playControll} onClick={stopPlay}/>
                     )
                     } 
              </button>
                        
              <StepForwardOutlined className={styles.playControll} onClick={forwardHandler} />
              </div>
            <div>
                  <Slider className={styles.Slider_Area} range={true} step={1} //value={[sliderStart, sliderEnd]}
                      defaultValue={[sliderStart, sliderEnd]} disabled={false}
                      min={0} max={videoRef.current?.getDuration()} onChange={onChange} onAfterChange={onAfterChange}
                      tooltipVisible={true} tipFormatter={formatter} />
            </div>
        </div>
          
        <div className={styles.checkbox}>
              <input type="checkbox" id='UpDown' onChange={(e) => {
                  setCheckbox1(e.target.checked);
                }} />  &nbsp;상하반전&nbsp;&nbsp;
                  
            <input type="checkbox" id='LeftRight' onChange={(e) => {
                      setCheckbox2(e.target.checked);
                  }}/> &nbsp;좌우반전
        </div>
          <div>
              <h2 style={{ float: "left", marginRight: '3vw', fontSize:'1vw' }}>  시작 시간 : {startTime}</h2>
              <h2 style={{float:'left',  fontSize:'1vw' }}> 종료 시간 : {endTime}</h2>
          </div>
          
          
        <div>
              <button style={{ marginLeft: '37vw', width: '8vw', backgroundColor: 'rgb(206, 211, 233)', marginBottom: ' 1vw'}} onClick={TimeSetList}>
                  확인
              </button>
              <button  style={{ marginLeft: '37vw', width: '8vw', backgroundColor: 'rgb(206, 211, 233)' }} onClick={imageCut}>
                  이미지 추출
              </button>
        </div>
    </>
  )
}
