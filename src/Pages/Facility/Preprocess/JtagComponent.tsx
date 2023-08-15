// J-tag TypeScript 버전

import {useEffect, useState} from 'react';
import { Checkbox, Image, Modal} from 'antd';
import styles from '../../../Styles/Preprocess.module.css'
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../Store/State/atom'
import { ko, en } from '../../../translations';
import { iconButtonClasses } from '@mui/material';

interface Image {
    id : any;
    imageURL : any;
}

const images : Image[] = [
{
    id:"1",
    imageURL:"http://suky.dothome.co.kr/1.jpg"
},
{
    id:"2",
    imageURL:"http://suky.dothome.co.kr/2.jpg"
},
{
    id:"3",
    imageURL:"http://suky.dothome.co.kr/3.jpg"
},
{
    id:"4",
    imageURL:"http://suky.dothome.co.kr/4.jpg"
},
{
    id:"5",
    imageURL:"http://suky.dothome.co.kr/5.jpg"
},
{
    id:"6",
    imageURL:"http://suky.dothome.co.kr/6.jpg"
},
{
    id:"7",
    imageURL:"http://suky.dothome.co.kr/7.jpg"
},
{
    id:"8",
    imageURL:"http://suky.dothome.co.kr/8.jpg"
},
{
    id:"9",
    imageURL:"http://suky.dothome.co.kr/9.jpg"
},
{
    id:"10",
    imageURL:"http://suky.dothome.co.kr/10.jpg"
},
{
    id:"11",
    imageURL:"http://suky.dothome.co.kr/11.jpg"
},
{
    id:"12",
    imageURL:"http://suky.dothome.co.kr/12.jpg"
},
{
    id:"13",
    imageURL:"http://suky.dothome.co.kr/13.jpg"
},
{
    id:"14",
    imageURL:"http://suky.dothome.co.kr/14.jpg"
},
{
    id:"15",
    imageURL:"http://suky.dothome.co.kr/15.jpg"
},
]

export default function JtagComponent() {

    interface SelectNum {
        id : number
    }

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;
    const [clickImg, setClickImg] = useState<any>();
    
    const [border, setBorder] = useState<string>(styles.JtagImage);
    const ChangeName : SelectNum[] = []; 



    const onClick = (e:any) => {      
        if(ChangeName.includes(e.target.id) === false){
            ChangeName.push(e.target.id);
            // setClickImg(e.target.src);
        }else{
            for(let i = 0; i < ChangeName.length; i++) {
                if(ChangeName[i] === e.target.id)  {
                    ChangeName.splice(i, 1);
                    i--;
                }
            }
        }
        console.log(ChangeName);
    }
    

    return (
        <div className={styles.ImageDiv}>

                <div>1. Dongtan_P01_C01.mp4</div>
                <div className={styles.ImageCheckDiv}>
                    <Checkbox>{t.LRReverse}</Checkbox>
                    <Checkbox>{t.UDReverse}</Checkbox>
                </div>
                <br />
                <br />
                <div className={styles.ImageScrollDiv}>
                    <ul className={styles.ImageScrollDivUl}>
                    <div style={{width:"120px", textAlign:"center"}}> 
                    {
                        images.map(image1 => (
                            <>
                                {/* <h6 style={{display:"inline"}}></h6> */}
                                <img src={image1.imageURL} id={image1.id} className={border} onClick={onClick}/> 
                                {/* <img src={image1.imageURL} id={image1.id} className={} onClick={onClick}/>  */}

                            </>
                        ))
                    }
                    </div>
                    {/* <p>{a}</p> */}
                    </ul>
                </div>
        </div>
    )
}