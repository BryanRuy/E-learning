import React from "react"
import {useEffect, useState , useRef} from "react"
import {Cropper} from "react-cropper"
import "cropperjs/dist/cropper.css";
import { Modal ,ModalBody, ModalFooter , Button } from "reactstrap"
import { useTranslation } from "react-i18next";
const imgPlaceholder = require(`@src/assets/images/custom-placeholder/img_preview_placeholder.jpeg`);

const TestCropper = (props) => {

    const {t} = useTranslation()
    const {type, isOpen , Image ,toggleModal , onCrop} = props
    const [cropResult, setCropResult] = useState()
    const cropperRef = useRef(null);

    const cropImage = () => {
        if (cropperRef.current ){

            const imageElement = cropperRef.current;
            const cropper = imageElement.cropper
            setCropResult(cropper.getCroppedCanvas().toDataURL())
            toggleModal()
        
        }
    }

    const toggle = () =>{
       toggleModal()
    }

    useEffect(() => {
      if(cropResult)
        onCrop(type,cropResult)
    }, [cropResult])


    return (

        <>
            <Modal className='modal-lg' isOpen={isOpen} toggle={toggle}>
                <ModalBody>
                 
                    <Cropper
                        style={{ height: 700, width: '100%' }}
                        aspectRatio={6 /  9}
                        initialAspectRatio={6 / 9}
                        preview=".img-preview"
                        guides={false}
                        src={Image}
                        ref={cropperRef}
                        viewMode={1}
                        dragMode="move"
                        cropBoxMovable={false}
                    />
                    
                </ModalBody>
                <ModalFooter>
                    <Button color='primary'onClick={cropImage}> {t('Crop')}  </Button>
                </ModalFooter>
            </Modal>
        </>

    )
}

export default TestCropper