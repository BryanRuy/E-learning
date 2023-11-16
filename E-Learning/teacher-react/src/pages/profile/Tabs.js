import React from 'react'


import { useHistory } from 'react-router-dom'

import { Nav, NavItem, NavLink } from 'reactstrap'
import { User, Lock, Info, Calendar ,CreditCard } from 'react-feather'
import { useTranslation } from 'react-i18next'

const Tabs = ({ activeTab, toggleTab }) => {
  const {t} =  useTranslation()
  const history = useHistory()
  return (
    <Nav className='nav-left' pills vertical>
      <NavItem>
        <NavLink active={activeTab === '1'} onClick={() => toggleTab('1')}>
          <User size={18} className='mr-1' />
          <span className='font-weight-bold'>{t('General')}</span>
        </NavLink>
      </NavItem>
      
      <NavItem>
        <NavLink active={activeTab === '2'} onClick={() => toggleTab('2')}>
          <Info size={18} className='mr-1' />
          <span className='font-weight-bold'>{t('Info')}</span>
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink active={activeTab === '3'} onClick={() => toggleTab('3')}>
          <Lock size={18} className='mr-1' />
          <span className='font-weight-bold'>{t('Change Password')}</span>
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink active={activeTab === '4'} onClick={() => toggleTab('4')}>
          <CreditCard size={18} className='mr-1'/>
          <span className='font-weight-bold'>{t('Subscribtion')}</span>
        </NavLink>
      </NavItem>

      <NavItem>
        <NavLink active={activeTab === '5'} onClick={() => history.push('/calendar')}>
          <Calendar size={18} className='mr-1' />
          <span className='font-weight-bold'>{t('Calendar')}</span>
        </NavLink>
      </NavItem>
    </Nav>
  )
}

export default Tabs
