import React, { useState, useEffect } from 'react'
// import Image from 'next/image'
import styles from '../../../Styles/Panorama.module.css'
import styled from "styled-components";
import { ko, en } from '../../../translations';
import { langState } from '../../../Store/State/atom'
import { Button, Tabs, Image, Table, Slider } from 'antd';
import { useRecoilState } from 'recoil';
import { API_URL, IMAGE_URL } from '../../../Store/Global';
import axios from 'axios';
import { ConsoleSqlOutlined } from '@ant-design/icons';




    

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
let CameraCount = 5
;



export default function ImageConfirmAirport() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    let token : string | null = localStorage.getItem("token") 
    let project_id : string | null = localStorage.getItem("project_id")
    const { TabPane } = Tabs;


    interface ImageList {
        index : any;
        key : any;
        name : any;
        lean: any;
        left: any;
        right: any;
    }

    interface Result {
        key : any;
        name : any;
        lean: any;
        left: any;
        right: any;
    }

    interface CutList {
        key : any;
        name : any;
        lean: any;
        left: any;
        right: any;
        resize: any;
    }

    interface PanoramaImage {
        no : any
        result_image : string
    }

    const [index, setIndex] = useState('1');

    const [arr, setArr] = useState<any>([])


    const [num, setNum] = useState(0);
    const [list, setList] = useState(0)
    const ImageList : ImageList[] = [];   
    const PanoramaImage : PanoramaImage[] = [];  
    
    const CutList : CutList[] = [];
    const Result : Result[] = [];



    const [ImgList, setImgList] = useState<any | undefined>(ImageList)
    const [CutImgList, setCutImgList] = useState<any | undefined>(CutList)
    const [resultImage, setResultImage] = useState<any | undefined>(Result)

    const [panormamImgList,setPanormamImgList] = useState<any[]>(PanoramaImage);

    const [panorama, setPanorama] = useState<boolean>(false);
    const [listName, setListName] = useState("");
    const [allList, setAlllest] = useState("");
    const [veiwList, setViewList] = useState<Number>(1);
    const [panoramaa, setPanoramaa] = useState<boolean>(false);
    const [panoramaaa, setPanoramaaa] = useState<boolean>(false);




    const [tab,satTab] = useState(0)
    const [lean,setLean] = useState(0)

    const [rrr, setRrr] = useState('')
    useEffect(() => {
        axios({
            method: 'get',
            url: API_URL+'/File/Files',
            headers: { "accept": `application/json`, "access-token": `${token}` },
            params: {
                path: `/project/${project_id}/stage3`
            }
        }).then((res)=>{
            if (res.data.check === true) {
                console.log("555555555555555555555555555555555555", `${IMAGE_URL}/image?path=/project/${project_id}/stage3/${res.data.data.files[0]}&width=1240`)
                setRrr(`${IMAGE_URL}/image?path=/project/${project_id}/stage3/${res.data.data.files[0]}&width=1240`)
    
            } else {
            }
        }).catch((err) => {
            console.log(err);
        });
        
    }, [])


useEffect(() => {
    for(let j = 0; j <5; j++){

    axios({
        method: 'get',
        url: API_URL+'/File/Files',
        headers: { "accept": `application/json`, "access-token": `${token}` },
        params: {
            path: `/project/${project_id}/stage3`
        }
    }).then((res)=>{
        if (res.data.check === true) {
            // console.log("성공")
            
            for(let i = 0; i<res.data.data.files.length; i++){
                // console.log('adsfasdfasdfasdfasdf', res.data.data.files[i])

                PanoramaImage.push({
                    result_image : `${IMAGE_URL}?path=/project/${project_id}/stage3/${res.data.data.files[i]}&width=1240`,
                    no : i
                })
                console.log(PanoramaImage[0].result_image)
                ImageList.push({
                                index : i+1,
                                key : j,
                                name : res.data.data.files[i],
                                lean : "",
                                left: "",
                                right:""

                            })
                CutList.push({
                    key : j,
                    name : res.data.data.files[i],
                    lean : "",
                    left: "",
                    right:"",
                    resize: "10",

                })
                Result.push({
                    key : j,
                    name : res.data.data.files[i],
                    lean : "",
                    left: "",
                    right:""

                })
            }
            setListName(res.data.data.files[0]);
            setAlllest(res.data.data.files.length);
            // console.log("전체파일리스트" + res.data.data.files[1])
            if(PanoramaImage.length > 0){
                setPanorama(true);
                setPanoramaaa(true);

            }
            if(res.data.data.files.length < 1){
                alert("파노라마 작업이 필요합니다.")


            }



            

        } else {
        }

                ImageList.sort((obj1, obj2) => {
                    if (obj1.name > obj2.name) {
                        return 1;
                    }
                    if (obj1.name < obj2.name) {
                        return -1;
                    }
                    return 0;
                    })
                CutList.sort((obj1, obj2) => {
                    if (obj1.name > obj2.name) {
                        return 1;
                    }
                    if (obj1.name < obj2.name) {
                        return -1;
                    }
                    return 0;
                    })

        let copyArrImgList = [...ImgList];
        for(let i = 0; i < 2; i++){
            copyArrImgList[i] = { ...copyArrImgList[i]};
        // console.log(ImgList[i].lean, "ImgListttttt")

        }
        setImgList(copyArrImgList)
            setPanormamImgList(PanoramaImage);

    }).catch((err) => {
        console.log(err);
    });
    }

}, [])

    







    const [choiceIndex, setChoiceIndex] = useState<number>(1)

    const { Column } = Table;

    const onChange = (key: string) => {
        console.log(key);
    };


    const [prevdisable, setPrevdisisable] = useState(true);
    const [nextdisable, setNextdisable] = useState(false);

    const nextClick = () => {
            if(num < Number(allList)+1){
                setNum(num+1);
                satTab(tab+1);
                console.log("김잉ㅇㅇㅇㅇㅇㅇㅇㅇ"+Number(allList),num);
                setNextdisable(false);
                setPrevdisisable(false);
                
            }if(num >= Number(allList)-2){
                setNextdisable(true);
                console.log(Number(allList)-1, num);  
                setPrevdisisable(false);

            }
    }

    const prevClick = () => {
        if(num <= Number(allList)-1){
            setNum(num-1);
            satTab(tab-1);
            console.log('감소' + num)
            setNextdisable(false);
            if(num <= 1){
                setPrevdisisable(true);
                setNextdisable(false);
            }
        }
}
    

let tempList: any[] = [];
let result_list: any[][] = [];
// console.log('====================')
// console.log('cut image list:', CutImgList)
// console.log(ImgList)
// console.log('====================')

for (let i = 0; i < spanCount; i ++){
    tempList = ImgList.filter((Img: { key: any; }) => Img.key === i+1)
    result_list.push(tempList)
}
console.log(result_list)
/*for (let i = 0; i < ImgList.length; i++){
    temp_list[i].push(ImgList[i])

    }
    
}*/

    useEffect(() => {
        const response = axios({
            method: 'post',
            url: API_URL + `/project/view/${project_id}`,
            headers : {"accept" : `application/json`, "access-token" : `${token}`}, 
        }).then((res) => {
            // console.log(res.data.check) 
            const settings: any = JSON.parse(res.data.data.settings)
            // console.log("dlfmaaaaaaaaaaaaaaaa"+res.data.data.title)
                if (res.data.check === true) {
                    for (let i = 0; i < 1; i++) {
                        console.log(`터널이름${settings.tunnel_eng}` )
                        setAirportName(settings.tunnel_eng)
                        console.log(`카메라 갯수${settings.cameraCount}` )
                        console.log(`스팬 갯수${settings.spanCount}` )
                }

            }
            }).catch((err) => {
                console.log(err);
            });
    }, []);

    const [Airportname, setAirportName] = useState('')
    let defaultsrc = `${Airportname}_C01_S001.png`

    console.log("--==-=-=-=-=-=",typeof defaultsrc)


    const [url, setUrl] = useState('');

    const alertt = () => {
        alert('파노라마를 실행해주세요')
    }

        const rendering = () => {
            let result = [];
            for (let i = 1; i < 2; i++) {
                
                result.push(

                    <div className='sd' style={{display: "flex",  width: "1610px", height:"730px"}}>
                    <div className={styles.CamList}>
                        <div className='tableContainer' style={{width:"400px", fontSize:"10px", cursor:"pointer"}}>
                        <Table dataSource={result_list[i-1]} pagination={false} scroll={{ y: 640 }} size="small">
                            <Column title="no" dataIndex="index" key="index" width={20}/>
                            <Column title="name" dataIndex="name" key="name" width={115} onCell={(gi : number|any) => {
                                return{
                                    onClick: e => {
                                        setNum(gi.index)
                                        console.log("컷테스트:---------------------"+ gi.name)
                                        setUrl(gi.name)
                                        setIndex(gi.key)     
                                        setPanoramaa(true)         
                                    

                                    }
                                }
                            }}/>
                        </Table>                        
                        </div>
                        </div>

                        <div style={{ width:"1340px", height:"650px", marginLeft: "10px"}}>
                        <img src={ panoramaa === true ? `${IMAGE_URL}/image?path=/project/${project_id}/stage3/${url}&width=1240` :  (panoramaaa === true ? rrr : '' ) } alt="" width={1140} height={400} style={{marginLeft:"20px"}} ></img>
                        <div style={{paddingLeft:"15px"}}>

                        <div className='sds'></div>
                            <Button disabled={prevdisable} style={{width:"130px", height:"30px",marginLeft: "880px", marginRight: "20px"}} onClick={prevClick}>이전</Button>
                            <Button disabled={nextdisable} style={{width:"130px", height:"30px", marginTop: "30px"}} onClick={nextClick}>다음</Button>
                        <Button  style={{width:"150px", marginTop: "30px", marginLeft: "1010px"} }  >완료</Button>
                        </div>
                        





                    </div>
                        </div>


                );
            }

            return result;
            
        };


        console.log("이미지리스트????================")

    return (
        <div>
            <div className={styles.DivArea}>
            <div>
                <p className={styles.subOrder}>{t.Panorama} &gt; {t.pnVerticalPanorama}</p>
                <p className={styles.mainOrder}>{t.pnVerticalPanorama}</p>
            </div>

            <div className={styles.SetDiv}>

            {rendering()}

                </div>
                <div style={{float:"right", marginRight:"10px"}}>
                {/* <Button disabled={prevdisable} style={{width:"150px", marginRight: "20px"}} onClick={prevClick}>이전</Button> */}

                {/* <Button disabled={nextdisable} style={{width:"150px", marginTop: "25px"}} onClick={nextClick}>다음</Button> */}
                </div>
            </div>
        </div>
    )
    }
