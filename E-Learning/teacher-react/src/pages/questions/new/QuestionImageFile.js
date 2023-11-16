
import React from 'react'
import { useRef, useState } from 'react';
import { X } from 'react-feather'
import { useTranslation } from 'react-i18next';
import { Button } from 'reactstrap'
import Swal from 'sweetalert2';

export const QuestionImageFile = (props) => {

    let imageUrl = null

    const {t} = useTranslation()
    const { question, index, label, onFileChanged, htmlId, htmlName, maxSizeInBytes } = props;

    if (question.image) {
        let file = question.image.split("/")
        imageUrl = file[2]
    }

    const [fileName, setFileName] = useState(imageUrl)

    const onRemoveFile = () => {
        if (fileInputRef && fileInputRef.current) fileInputRef.current.value = ""
        onFileChanged(null);
        setFileName(null)
    }

    const onChange = (e) => {

        let file = e.target.files[0];
        if (file.size > (maxSizeInBytes || 2097152)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                html:`${t('Image file is too big. Please upload an image of upto 2MB')}`
            })

            e.target.value = "";
            return;
        };
        setFileName(file.name)
        onFileChanged(file);
    }


    const fileInputRef = useRef(React.createRef())

    return (
        <div class="form-group custom-file-container">
            <label for={`file-${index}`} class="">{label}</label>
            <div class="custom-file">
                <input id={htmlId}
                    ref={fileInputRef}
                    type="file"
                    name={htmlName}
                    accept="image/x-png,image/gif,image/jpeg"
                    onChange={onChange}
                    className='custom-file-input'
                />
                <label className="custom-file-label" for={htmlId}>{fileName ? fileName : 'Choose file'}</label>
            </div>
            {
                fileInputRef
                && fileInputRef.current
                && fileInputRef.current.files
                && fileInputRef.current.files[0]
                && <Button type="button" role="button" className="remove-file-icon btn-icon" color="flat-secondary" onClick={onRemoveFile} size="sm"><X size={16} /></Button>
            }

        </div>
    )
}

export default QuestionImageFile
