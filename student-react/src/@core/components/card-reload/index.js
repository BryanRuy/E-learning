import React from 'react';
// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import PropTypes from 'prop-types'
import classnames from 'classnames'
import UiLoader from '@components/ui-loader'
import { ChevronDown, RotateCw, X } from 'react-feather'
import { Card, CardHeader, CardTitle, Collapse, Spinner } from 'reactstrap'

const CardReload = props => {
  // ** Props
  const { title, isReloading, onReload, children } = props
  // console.log(props);
  // ** If user passes reload action then return <BlockUi> as Wrapper else return <Fragment>
  const BlockUiWrapper = isReloading ? UiLoader : Fragment

  return (
    <BlockUiWrapper
      /*eslint-disable */
      /*eslint-disable */
      {...(props.isReloading
        ? {
          blocking: isReloading
        }
        : {})}
    /*eslint-enable */
    /*eslint-enable */
    >
      <Card className={props.className}>
        <CardHeader>
          <CardTitle tag='h4'>{title}</CardTitle>
          {onReload && <div className='action-icons'><RotateCw className='cursor-pointer' size={15} onClick={() => onReload()} /></div>}
        </CardHeader>
        {children}
      </Card>
    </BlockUiWrapper>
  )
}

export default CardReload

// ** PropTypes
CardReload.propTypes = {
  title: PropTypes.string.isRequired,
  onReload: PropTypes.func,
  isReloading: PropTypes.bool
}
