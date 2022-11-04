
import OficinaSelect from '../OficinaSelect/OficinaSelect';
import PeriodoSelect from '../PeriodoSelect/PeriodoSelect';

import './FiltrosGlobales.css';

const FiltrosGlobales = ({showFiltroPeriodo=true}) => {

    return ( 
        <div className="filtrosGlobales">

            <div className="filtrosGlobales__filtro">
                <OficinaSelect />
            </div>

            {showFiltroPeriodo &&
            <div className="filtrosGlobales__filtro">
                <PeriodoSelect />
            </div>
            }

        </div>
     );
}
 
export default FiltrosGlobales;