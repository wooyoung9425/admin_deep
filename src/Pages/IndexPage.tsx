import React from 'react'
import { Link } from 'react-router-dom';
import styles from '../Styles/Index_choice.module.css'
import { projectType } from '../Store/State/atom';
import { useRecoilState } from 'recoil';


export default function IndexPage() {

    // const [ProjectType, setProjectType] = useRecoilState(projectType);

  return (
    <div>
      <section>
                <div className={styles.index_inner}>
                    <div className={styles.head}>
                        <a className={styles.head_title}>Service</a>
                        <br />
                        <a className={styles.head_text}>딥인스펙션에서 제공하는 AI안전점검 프로그램</a>
                    </div>


                    <div className={styles.box_container}>
                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.tunnel_box}>
                                    <Link to="/Facility" onClick={()=>localStorage.setItem('project_Type', "Tunnel")}>
                                        <a><div className={styles.maintext}>Tunnel</div></a>
                                    </Link>
                                    <div className={styles.subtext}>터널</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.dam_box}>

                                <Link to="/Facility" onClick={()=>localStorage.setItem('project_Type', "Dam")}>
                                        <a><div className={styles.maintext}>Dam</div></a>
                                </Link>
                                    <div className={styles.subtext}>댐</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.scaf_box}>
                                    <a href="#"><div className={styles.maintext}>Scaf</div></a>
                                    <div className={styles.subtext}>가설기자재</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.airport_box}>

                                <Link to="/Facility" onClick={()=>localStorage.setItem('project_Type', "Airport")}>
                                        <a><div className={styles.maintext}>Airport</div></a>
                                </Link>
                                <div className={styles.subtext}>항공기 및 활주로</div>

                                    {/* <a href="#"><div className={styles.maintext}>Airport</div></a>
                                    <div className={styles.subtext}>항공기 및 활주로</div> */}
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                              <div className={styles.bridge_box}>
                                   <Link to="/Facility" onClick={()=>localStorage.setItem('project_Type', "Bridge")}>
                                        <a><div className={styles.maintext}>Bridge</div></a>
                                    </Link>
                                    <div className={styles.subtext}>교량</div>
                                </div>
                            </div>s
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.cuslope_box}>
                                    <a href="#"><div className={styles.maintext}>Cutslope</div></a>
                                    <div className={styles.subtext}>비탈면</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                              <div className={styles.building_box}>
                                  <Link to="/Facility" onClick={()=>localStorage.setItem('project_Type', "Building")}>
                                        <a><div className={styles.maintext}>Building</div></a>
                                    </Link>
                                    <div className={styles.subtext}>건물</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.waterwork_box}>
                                    <a href="#"><div className={styles.maintext}>Waterwork</div></a>
                                    <div className={styles.subtext}>상수도</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.mid}>
                            <div className={styles.index}>
                                <div className={styles.pipeline_box}>
                                    <a href="#"><div className={styles.maintext}>Pipeline</div></a>
                                    <div className={styles.subtext}>가스배관/열배관</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='footer'>
                        <div className={styles.homeicon}>
                            <a href="./"> <div><img src="./images/index/icon_home.png" alt="" width={30} height={30} ></img></div></a>
                        </div>


                    </div>
                </div>



            </section>
    </div>
  )
}
