import React from 'react'
import { File, Image, Music, Archive, FileText, Code, Film } from 'react-feather'
import Linkify from 'linkifyjs/react';
import { GET_DOCUMENT_URL } from '../../../helpers/url_helper';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import { videoFiles, audioFiles, imageFiles, codeFiles, zipFiles, documentFiles } from '../../../utility/Utils'



export const getChatNotificationIds = () => {
    const obj = localStorage.getItem("chatNotificationsIds")
    return obj ? JSON.parse(obj) : {};
}

/**
 * 
 * @param {Object} obj 
 */
export const setChatNotificationIds = (obj) => {
    localStorage.setItem("chatNotificationsIds", JSON.stringify(obj || {}))
}




/**
 * 
 * @param {string} extension 
 */
export const getFileIcon = (ex) => {
    let size = 16

    if (videoFiles.find(v => v == ex)) return <Film size={size} />
    if (imageFiles.find(i => i == ex)) return <Image size={size} />
    if (audioFiles.find(a => a == ex)) return <Music size={size} />
    if (zipFiles.find(z => z == ex)) return <Archive size={size} />
    if (documentFiles.find(d => d == ex)) return <FileText size={size} />
    if (codeFiles.find(c => c == ex)) return <Code size={size} />

    return <File size={size} />
}


/**
 * 
 * @param {string} url 
 * @param {string} ex
 * @param{Boolean} darkmode
 * @returns 
 */
export const getFilePreview = (url, ex) => {

    if (videoFiles.find(v => v == ex))
        return (
            <div className="preview">
                <video controls>
                    <source src={GET_DOCUMENT_URL(url)} type={`video/${ex}`} />
                </video>
            </div>
        )
    if (imageFiles.find(i => i == ex)) return <div className="preview"><img src={GET_DOCUMENT_URL(url)} /></div>
    if (audioFiles.find(a => a == ex))
        return (
            <div className="preview">
                <AudioPlayer
                    src={GET_DOCUMENT_URL(url)}
                    showJumpControls={false}
                    layout={'horizontal-reverse'}
                    customVolumeControls={[]}
                    loop={false}
                />
            </div>
        )

    return ""
}

export function detectLinkInMessage(text) {
    var options = {
        defaultProtocol: 'https', target: {
            url: '_blank'
        },
    };
    return <Linkify tagName="span" options={options}>{text}</Linkify>;
}