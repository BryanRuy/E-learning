import React, { Fragment, useState } from 'react'
import { Label } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import FormGroup from 'reactstrap/lib/FormGroup'
import moment from 'moment'


const DatePicker = (props) => {

  return (
    <FormGroup>
      <Label for='default-picker'>{props.label || 'Date'}</Label>
      <Flatpickr
        className='form-control'
        value={props.value}
        onChange={date => props.onChange(date[0])}
        id='default-picker'
        options={{
          dateFormat: "d/m/Y",
          disable: props.disableDates ? props.disableDates.map(d => moment(d).format("DD/MM/YYYY")) : [],
        }}
      />
    </FormGroup>
  )
}

export default DatePicker
