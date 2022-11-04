import { periodos } from "../../GlobalFunctions";
import { useAppContext } from "../../contexts/AppContext";

import './PeriodoSelect.css';

const PeriodoSelect = () => {

    const {periodo, setPeriodo} = useAppContext()

    function periodosMatch(periodoToCompare){
        return JSON.stringify(periodoToCompare) === JSON.stringify(periodo)
    }

    return ( 
        <div className="periodoSelect">
            <div className="periodoSelect__label">Período: </div>
            <div>
                <select onChange={(e)=>setPeriodo(periodos.get_rango_from_periodo(JSON.parse(e.target.value)))}>
                    {periodos.periodos.map((period, i)=>
                    <option value={JSON.stringify(period)} selected={periodosMatch(periodos.get_rango_from_periodo(period))} key={i}>
                        {period.label}
                    </option>
                    )}
                </select>
            </div>            
        </div>
     );
}
 
export default PeriodoSelect;