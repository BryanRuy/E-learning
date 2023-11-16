import moment from "moment";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss'
export function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

const toTitleCase = (string) => {
    let str = String(string);
    return str.charAt(0).toUpperCase() + str.substr(1);
}

export const setLocalizedLang = (lang) => {
    localStorage.setItem('lang', lang)
}

export const getLocalizedLang = () => {
    let lang = localStorage.getItem('lang')
    return lang ? lang : 'ro'
}

const showAlertDialog = (msg, icon, onOK) => {
    const MySwal = withReactContent(Swal)
    return MySwal.fire({
        text: msg,
        title: toTitleCase(icon),
        icon: icon,
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    }).then((value)=>{
        if(value.isConfirmed && onOK)
        onOK();
    })
}

export const errorAlertDialog = (msg) => {
    showAlertDialog(msg, 'error')
}

export const successAlertDialog = (msg , onOK) => {
    showAlertDialog(msg, 'success', onOK)
}

export const infoAlertDialog = (msg) => {
    showAlertDialog(msg, 'info')
}

