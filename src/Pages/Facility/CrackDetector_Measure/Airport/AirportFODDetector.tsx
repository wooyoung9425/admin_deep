import styles from '../../../../Styles/CrackDetector_Measure.module.css'
import { useRecoilState, atom } from 'recoil';
import { langState } from '../../../../Store/State/atom'
import { ko, en } from '../../../../translations';

export default function AirportFODDetector() {

    const [language, setLang] = useRecoilState(langState); 
    const t = language === "ko" ? ko : en;

    return (
        <>
            <div className={styles.DivArea}>
                <div>
                    <p className={styles.subOrder}>{t.dmDetectorMeasure} &gt; {t.fodDetectorMeasureResult}</p>
                    <p className={styles.mainOrder}>{t.fodDetectorMeasureResult}</p>
                </div>
            </div>
        </>
    )
}
