import React,{useState} from "react"
import { FormGroup, Media, CustomInput, } from "reactstrap"



const ImagePickerWithPreview = (props) => {

  const { Image, acceptType, type, lblTitle } = props
 

  const onChange = e => {
     props.onChange(e, type)
  }

  return (
    <>
      <div className='border rounded p-2'>
        <h4 className='mb-1'>{lblTitle}</h4>
        <Media className='flex-column flex-md-row'>
          <img
            className='rounded mr-2 mb-1 mb-md-0'
            src={Image}
            alt='featured img'
            width='70'
            height='40'
          />

          <Media body>
            <div className='d-inline-block'>
              <FormGroup className='mb-0'>
                <CustomInput
                  type='file'
                  id='exampleCustomFileBrowser'
                  name='customFile'
                  onChange={onChange}
                  accept={acceptType}
                />
              </FormGroup>
            </div>
          </Media>
        </Media>
      </div>
     
    </>
  )
}

export default ImagePickerWithPreview