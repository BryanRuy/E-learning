import React, { Fragment, useState } from 'react'
import { Label } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const PickerMultipleDates = () => {
  const [picker, setPicker] = useState(new Date())
  return (
    <Fragment>
      <Label for='multi-dates-picker'>Multiple Dates</Label>
      <Flatpickr
        value={picker}
        id='multi-dates-picker'
        className='form-control'
        options={{ mode: 'multiple' }}
        onChange={date => setPicker(date)}
      />
    </Fragment>
  )
}

export default PickerMultipleDates
