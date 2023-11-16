import React from 'react'
import { useState} from 'react'
import ReactPaginate from 'react-paginate'


const CustomPagination = (props) => {
    const { selectedPage, pages } = props
    const [currentPage, setCurrentPage] = useState(selectedPage || 0)

    const onSelect = (page) => {
        props.onSelect(page.selected+1);
        setCurrentPage(page.selected);
    }

    return (

        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => onSelect(page)}
            pageCount={pages ? pages : 1}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            nextLinkClassName='page-link'
            nextClassName='page-item next'
            previousClassName='page-item prev'
            previousLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
        />
    )
}
export default CustomPagination