import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export function titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

const toTitleCase = (string) => {
    let str = String(string);
    return str.charAt(0).toUpperCase() + str.substr(1);
}


const showAlertDialog = (msg, icon) => {
    const MySwal = withReactContent(Swal)
    return MySwal.fire({
        text: msg,
        title: toTitleCase(icon),
        icon: icon,
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}


export const errorAlertDialog = (msg) => {
    showAlertDialog(msg, 'error')
}

export const successAlertDialog = (msg) => {
    showAlertDialog(msg, 'success')
}

export const infoAlertDialog = (msg) => {
    showAlertDialog(msg, 'info')
}

export const setLocalizedLang = (lang) => {
    localStorage.setItem('lang', lang)
}

export const getLocalizedLang = () => {
    let lang = localStorage.getItem('lang')
    return lang ? lang : 'ro'
}