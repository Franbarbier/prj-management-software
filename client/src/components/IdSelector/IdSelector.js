import { useEffect, useState } from 'react';
import './IdSelector.css';

const IdSelector = ({entities, onChange, placeholder="Pegar ID"}) => {

    const [query, setQuery] = useState("")
    const [selectedEntity, setSelectedEntity] = useState(false)

    useEffect(()=>{
        let filteredEntities = entities.filter(filterById)
        if(filteredEntities.length === 1){
            setSelectedEntity(filteredEntities[0])
        }
    }, [query, entities])

    useEffect(()=>{
        onChange(selectedEntity)
        !selectedEntity && setQuery("")
    }, [selectedEntity])

    function filterById(entity){
        if(query === ""){
            return true
        }
        return entity._id.includes(query)
    }

    return (
        <div className="idSelector">
            <div>
                {selectedEntity ? 
                <div className="idSelector__selectedEntity">
                    <div>{selectedEntity._id}</div><div className="idSelector__remove" onClick={()=>setSelectedEntity(false)}>x</div>
                </div>
                :
                <input type="text" placeholder={placeholder} onChange={(e)=>setQuery(e.target.value)} />
                }
            </div>
        </div>
    )
}

export default IdSelector