import React, { useState, useEffect } from 'react'

import * as yup from 'yup'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, FormGroup, Row, Col, Button } from 'reactstrap'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Store & Actions
import { connect } from 'react-redux'
import { updatePassword } from './store/actions'

import { withRouter } from 'react-router';

import { useTranslation } from 'react-i18next'
import { notifyError, notifySuccess } from '../../utility/toast'

const PasswordTabContent = (props) => {

  const { t } = useTranslation()
  const SignupSchema = yup.object().shape({
    'currentPassword': yup.string().min(1).required(),
    'newPassword': yup.string().min(1).required(),
    'confirmPassword': yup
      .string()
      .min(1)
      .required()
      .oneOf([yup.ref(`newPassword`), null], 'Passwords must match')
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    resolver: yupResolver(SignupSchema)
  })

  const [isUpdating, setIsUpdating] = useState(false)


  const resetChangePassword = () => {

    document.getElementById("currentPassword").value = ""
    document.getElementById("newPassword").value = ""
    document.getElementById("confirmPassword").value = ""
  }

  useEffect(() => {
    if (isUpdating && !props.updatePasswordLoading && !props.updatePasswordError) {
      setIsUpdating(false)
      resetChangePassword()
      notifySuccess(t("Update Password"), t("Password updated successfully"))
    }
    else if (isUpdating && !props.updatePasswordLoading && props.updatePasswordError) {
      setIsUpdating(false)
      notifyError(t("Update Password"), props.updatePasswordError)
    }
  }, [props.updatePasswordLoading])

  const onSubmit = () => {
    let currentPassword = document.getElementById("currentPassword").value
    let newPassword = document.getElementById("newPassword").value
    let confirmPassword = document.getElementById("confirmPassword").value
    if (!currentPassword || !newPassword || newPassword != confirmPassword) return
    setIsUpdating(true)
    props.updatePassword({
      currentPassword,
      newPassword,
      confirmPassword
    })

  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <InputPasswordToggle
              label={t('Old Password')}
              htmlFor='currentPassword'
              name='currentPassword'
              innerRef={register({ required: true })}
              className={classnames('input-group-merge', {
                'is-invalid': errors['currentPassword']
              })}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <InputPasswordToggle
              label={t('New Password')}
              htmlFor='newPassword'
              name='newPassword'
              innerRef={register({ required: true })}
              className={classnames('input-group-merge', {
                'is-invalid': errors['newPassword']
              })}
            />
          </FormGroup>
        </Col>

      </Row>
      <Row>
        <Col sm='6'>
          <FormGroup>
            <InputPasswordToggle
              label={t('Retype New Password')}
              htmlFor='confirmPassword'
              name='confirmPassword'
              innerRef={register({ required: true })}
              className={classnames('input-group-merge', {
                'is-invalid': errors['confirmPassword']
              })}
            />
          </FormGroup>
        </Col>
        <Col className='mt-1' sm='12'>
          <Button.Ripple type='submit' className='mr-1' color='primary'>
           {t('Save changes')}
          </Button.Ripple>
          <Button.Ripple color='secondary' outline
            onClick={() => resetChangePassword()}
          >
            {t('Cancel')}
          </Button.Ripple>
        </Col>
      </Row>
    </Form>
  )
}


const mapStateToProps = (state) => {

  const {
    updatePasswordLoading,
    updatePasswordError
  } = state.Profile;
  return {
    updatePasswordLoading,
    updatePasswordError
  }
}

export default withRouter(
  connect(mapStateToProps, {
    updatePassword
  })(PasswordTabContent)
)
