// ** React Imports
import React, { Fragment, useState, forwardRef, useEffect } from 'react'



// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import {
    ChevronDown, Share, Printer, FileText,
    File, Grid, Copy, Plus, Trash,
    Archive, MoreVertical, RefreshCcw, Download
} from 'react-feather'
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    UncontrolledDropdown,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Input,
    Label,
    Row,
    Col,

} from 'reactstrap'
import moment from 'moment'
import { getFileType } from '../../utility/Utils'
import { GET_DOCUMENT_URL } from '../../helpers/url_helper'


import { saveAs } from 'file-saver';


// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
    <div className='custom-control custom-checkbox'>
        <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
        <label className='custom-control-label' onClick={onClick} />
    </div>
))



const DataTableWithButtons = (props) => {

    const { store } = props
    const { documents, documentLoading, selectedType,
        uploadUserDocument, updateUserDocumentProgress,
        deleteUserDocument, getUserDocuments } = store


    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])


    useEffect(() => {
        if (selectedType) {
            setData(documents.filter(d => getFileType(d.fileType) === selectedType))
        }
        else {
            setData(documents)
        }


    }, [selectedType])

    useEffect(() => {
        setData(documents)

    }, [documents])

    const copyLink = (e, text) => {
        e.preventDefault()

        let input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        let result = document.execCommand('copy');
        document.body.removeChild(input);
    }
    const bytesToSize = (bytes, decimals = 2) => {
        let SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        for (var i = 0, r = bytes, b = 1024; r > b; i++) r /= b;
        return `${parseFloat(r.toFixed(decimals))} ${SIZES[i]}`;
    }

    const downloadDocument = (e, doc) => {
        e.preventDefault()
        saveAs(GET_DOCUMENT_URL(doc.name), doc.fileName)
    }
    const columns = [
        {
            name: 'File Name',
            selector: 'fileName',
            sortable: true,
            minWidth: '250px'
        },
        {
            name: 'Size',
            selector: 'fileSize',
            sortable: false,
            minWidth: '100px',
            cell: row => {
                return (
                    <>
                        {
                            bytesToSize(row.fileSize)
                        }
                    </>
                )
            }
        },
        {
            name: 'Last Modified',
            selector: 'updatedAt',
            sortable: true,
            minWidth: '250px',
            cell: row => {
                return (
                    <>
                        {
                            moment(row).format("DD MMM YYYY")
                        }</>
                )
            }
        },
        {
            name: 'Actions',
            selector: 'name',
            allowOverflow: true,
            cell: row => {
                return (
                    <div className='d-flex'>
                        <UncontrolledDropdown>
                            <DropdownToggle className='pr-1' tag='span'>
                                <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem tag='a' href='/' className='w-100' onClick={e => downloadDocument(e, row)}>
                                    <Download size={15} />
                                    <span className='align-middle ml-50'>Download</span>
                                </DropdownItem>
                                <DropdownItem tag='a' href='/' className='w-100' onClick={e => copyLink(e, GET_DOCUMENT_URL(row.name))}>
                                    <Copy size={15} />
                                    <span className='align-middle ml-50'>Copy Link</span>
                                </DropdownItem>
                                <DropdownItem tag='a' href='/' className='w-100' onClick={e => deleteDoc(e, row.documentId)}>
                                    <Trash size={15} />
                                    <span className='align-middle ml-50'>Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                )
            }
        }
    ]

    // ** Function to handle filter
    const handleFilter = e => {
        const value = e.target.value
        let updatedData = []
        setSearchValue(value)


        if (value.length) {
            updatedData = data.filter(item => {
                const startsWith =
                    item.fileName.toLowerCase().startsWith(value.toLowerCase())


                const includes =
                    item.fileName.toLowerCase().includes(value.toLowerCase())

                if (startsWith) {
                    return startsWith
                } else if (!startsWith && includes) {
                    return includes
                } else return null
            })
            setFilteredData(updatedData)
            setSearchValue(value)
        }
    }

    const onFileSelectChange = (e) => {
        // console.log("FILES", e.target.files)
        let count = 0;
        for (let key in e.target.files) {
            if (e.target.files.hasOwnProperty(key)) {
                uploadUserDocument({
                    file: e.target.files[key],
                    callback: ({ progress, documentId }) => updateUserDocumentProgress({ progress, documentId })
                })
                if (count == 5) {
                    break;
                }
                count++
            }
        }
        document.getElementById('attach-user-doc').value = null;
    }

    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }

    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            pageCount={searchValue.length ?
                (filteredData.length > 0 ? filteredData.length / 6 : 1)
                : (data.length > 0 ? data.length / 6 : 1)
            }
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


    const deleteDoc = (e, id) => {
        e.preventDefault()
        deleteUserDocument(id)
    }

    return (
        <Fragment>
            <Card>
                <CardHeader className='flex-row  align-md-items-center align-items-end justify-content-end border-bottom'>
                    <input
                        type='file'
                        id="attach-user-doc"
                        multiple={true}
                        hidden
                        onChange={onFileSelectChange} />
                    {
                        !documentLoading &&
                        <Button
                            className="ml-2 btn-icon"
                            onClick={() => getUserDocuments()}
                        >
                            <RefreshCcw
                                size={15}
                            />
                        </Button>
                    }

                    <Button className='ml-2 btn-icon' color='primary' onClick={() => { document.getElementById("attach-user-doc").click() }} >
                        <Plus size={15} />
                    </Button>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
                        <Label className='mr-1' for='search-input'>
                            Search
                        </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input'
                            value={searchValue}
                            onChange={handleFilter}
                        />
                    </Col>
                </Row>
                <DataTable
                    noHeader
                    pagination
                    selectableRows
                    columns={columns}
                    paginationPerPage={6}
                    className='react-dataTable'
                    sortIcon={<ChevronDown size={10} />}
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={CustomPagination}
                    data={searchValue.length ? filteredData : data}
                    selectableRowsComponent={BootstrapCheckbox}
                />
            </Card>
        </Fragment>

    )
}

export default DataTableWithButtons
