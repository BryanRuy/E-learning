import React from "react"

import { Modal, ModalBody, ModalFooter, CardImg } from "reactstrap"
import { DOCUMENT_BASE_URL } from "../../helpers/url_helper";
const imgPlaceholder = require(`@src/assets/images/custom-placeholder/img_preview_placeholder.jpeg`);

const PreviewBookModal = (props) => {

    const { isOpen, Image, toggleModal } = props


    const toggle = () => {
        toggleModal()
    }

    return (

        <>
            <Modal className='modal-lg' isOpen={isOpen} toggle={toggle}>
                <ModalBody>

                    <CardImg top src={DOCUMENT_BASE_URL + Image} />

                </ModalBody>

            </Modal>
        </>

    )
}

export default PreviewBookModal