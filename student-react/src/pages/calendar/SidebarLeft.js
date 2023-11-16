// ** React Imports
import React, { Fragment, useState } from 'react'


// ** Custom Components
import { CardBody, CustomInput } from 'reactstrap'
import { useTranslation } from 'react-i18next'
// ** illustration import
import illustration from '@src/assets/images/pages/calendar-illustration.png'


const SidebarLeft = props => {

  const {t} = useTranslation()
  // ** Props
  const {
    filters,
    selectedFilters,
    toggleFilter,
    toggleAllFilter
  } = props


  return (
    <Fragment>
      <div className='sidebar-wrapper'>

        <CardBody>
          <h5 className='section-label mb-1'>
            <span className='align-middle'>{t('Filter')}</span>
          </h5>
          <CustomInput
            type='checkbox'
            className='mb-1'
            label={t('View All')}
            id='view-all'
            checked={selectedFilters.length == filters.length}
            onChange={e => {
              toggleAllFilter(e.target.checked)
            }}
          />
          <div className='calendar-events-filter'>
            {filters.length &&
              filters.map(filter => {
                return (
                  <CustomInput
                    type='checkbox'
                    key={filter.label}
                    id={filter.label}
                    label={t(`${filter.label}s`)}
                    checked={selectedFilters.find(f => f == filter.type) != undefined}
                    className={filter.className}
                    onChange={e => toggleFilter(filter.type)}
                  />
                )
              })}
          </div>
        </CardBody>
      </div>
      <div className='mt-auto'>
        <img className='img-fluid' src={illustration} alt='illustration' />
      </div>
    </Fragment>
  )
}

export default SidebarLeft
