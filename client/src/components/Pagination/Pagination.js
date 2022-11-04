import { useState, useEffect } from "react";

import { pagination } from "../../GlobalFunctions";

import './Pagination.css';

const Pagination = ({rows_length, setActivePage}) => {

    const[thisPagination, setThisPagination] = useState({activePage: pagination.get_pages(rows_length)[0]})

    useEffect(()=>{
        setThisPagination({...thisPagination, pages:pagination.get_pages(rows_length), updated:true})
    }, [rows_length])

    useEffect(()=>{
        setActivePage(thisPagination.activePage)
    }, [thisPagination.activePage])

    function handleClickTab(clickedPage){
        setThisPagination({...thisPagination, activePage: clickedPage, pages:pagination.get_pages(rows_length, clickedPage)})        
    }

    return ( 
        <div className="pagination">                        
            <div className="pagination__innerContainer">
                {thisPagination?.pages?.length >0  && thisPagination.pages.map((page)=>
                    <div 
                        key={page} 
                        className={`${page === thisPagination.activePage ? "pagination__tab-active" : ""} pagination__tab`} 
                        onClick={()=>handleClickTab(page)}>
                            {page}
                    </div>
                )}
            </div>
        </div>
     );
}
 
export default Pagination;