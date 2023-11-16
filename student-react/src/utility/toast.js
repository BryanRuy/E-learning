import React, { Fragment } from 'react'

import { Bell, Check, X, AlertTriangle, Info } from 'react-feather'
import Avatar from '@components/avatar'
import { toast } from 'react-toastify'
import moment from 'moment'



const notifyAlert = (title, message, hideProgress, color) => toast(
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper mr-1'>
                <Avatar size='sm' color={color} icon={<Bell size={12} />} />
                <h6 className={`toast-title text-${color}`} >{title || "Notification"}</h6>
            </div>
            <small className='text-muted'>{moment().format("HH:mm ")}</small>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                {message}
            </span>
        </div>
    </Fragment>,
    { hideProgressBar: hideProgress }
)


/**
 * 
 * @param {'success'| 'info' | 'error' | 'warning'} type 
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} hideProgress 
 */
const notify = (type, title, message, hideProgress = true) => {

    switch (type) {
        case "success":
            notifyAlert(title, message, hideProgress, 'success')
            break;
        case "info":
            notifyAlert(title, message, hideProgress, 'info')
            break;
        case "error":
            notifyAlert(title, message, hideProgress, 'danger')
            break;
        case "warning":
            notifyAlert(title, message, hideProgress, 'warning')
            break;
        default:
            notifyAlert(title, message, hideProgress, 'primary')
    }
}

/**
 *  
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} hideProgress 
 */
export const notifySuccess = (title, message, hideProgress = true) => {
    notify('success', title, message, hideProgress)
}

/**
 *  
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} hideProgress 
 */
export const notifyInfo = (title, message, hideProgress = true) => {
    notify('info', title, message, hideProgress)
}

/**
 *  
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} hideProgress 
 */
export const notifyError = (title, message, hideProgress = true) => {
    notify('error', title, message, hideProgress)
}

/**
 *  
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} hideProgress 
 */
export const notifyWarning = (title, message, hideProgress = true) => {
    notify('warning', title, message, hideProgress)
}

/**
 *  
 * @param {string} title 
 * @param {string} message 
 * @param {boolean} hideProgress 
 */
export const notifyPrimary = (title, message, hideProgress = true) => {
    notify('primary', title, message, hideProgress)
}