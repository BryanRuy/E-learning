import React from 'react'
// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import ReactCountryFlag from 'react-country-flag'
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'

import i18next from "i18next";
import { getLocalizedLang, setLocalizedLang } from '../../../../helpers/HelperFunctions';
const LangDropdown = () => {

    const lang = getLocalizedLang()
    const [locale, setLocale] = useState(lang)
    // ** Vars
    const langObj = {
        ro: 'Romanian',
        en: 'English',
    }

    // ** Function to switch Language
    const handleLangUpdate = (e, lang) => {
        e.preventDefault()
        setLocale(lang)
        i18next.changeLanguage(lang)
        setLocalizedLang(lang)
    }

    return (

        <UncontrolledDropdown href='/' tag='li' className='dropdown-language nav-item'>
            <DropdownToggle href='/' tag='a' className='nav-link' onClick={e => e.preventDefault()}>
                <ReactCountryFlag
                    className='country-flag flag-icon'
                    countryCode='us'
                    countryCode={locale === 'en' ? 'us' : locale}
                    svg
                />
                <span className='selected-language'>{langObj[locale]}</span>
            </DropdownToggle>
            <DropdownMenu className='mt-0' right>
                <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'en')}>
                    <ReactCountryFlag className='country-flag' countryCode='us' svg />
                    <span className='ml-1'>English</span>
                </DropdownItem>

                <DropdownItem href='/' tag='a' onClick={e => handleLangUpdate(e, 'ro')}>
                    <ReactCountryFlag className='country-flag' countryCode='ro' svg />
                    <span className='ml-1'>Romanian</span>
                </DropdownItem>

            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default LangDropdown
