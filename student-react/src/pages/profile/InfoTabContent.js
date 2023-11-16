import React, { useState, useEffect } from 'react'

import { Label, Input, FormGroup, Row, Col, Button, InputGroup } from 'reactstrap'
// ** Store & Actions
import { connect } from 'react-redux'
import {
  uploadProfilePicture,
  updateProfileData

} from './store/actions'

import { withRouter } from 'react-router';
import PhoneNumber from 'awesome-phonenumber';

import { useTranslation } from 'react-i18next'
import { notifyWarning, notifySuccess, notifyError } from '../../utility/toast'
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import '@styles/react/libs/flatpickr/flatpickr.scss'


const InfoTabContent = (props) => {

  const {t} = useTranslation()

  const linkedInRegex = /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/
  const facebookRegex = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/
  const githubRegex = /^(http(s)?:\/\/)?(www\.)?github\.com\/(?!-)(?:[A-z0-9-]){1,39}[^-]\/?$/
  const twitterRegex = /^(http(s)?:\/\/)?(www\.)?twitter\.com\/[A-z 0-9 _]{1,15}\/?$/

  const [gitLink, setGitLink] = useState("")
  const [fbLink, setFbLink] = useState("")
  const [linkedInLink, setLinkedInLink] = useState("")
  const [twitterLink, setTwitterLink] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    initValues()
  }, [props.user])

  useEffect(() => {
    if (isUpdating && !props.updateProfileLoading && !props.updateProfileError) {
      setIsUpdating(false)
      notifySuccess(t("Update Profile"), t("Profile updated successfully"))
    }
    else if (isUpdating && !props.updateProfileLoading && props.updateProfileError) {
      setIsUpdating(false)
      notifyError(t("Update Profile"), props.updateProfileError)
    }
  }, [props.updateProfileLoading])

  const handleSubmit = (e) => {
    e.preventDefault();


    if (gitLink && !gitLink.match(githubRegex))
      return notifyWarning("Info", `Github ${t('url is not valid')}`)
    if (linkedInLink && !linkedInLink.match(linkedInRegex))
      return notifyWarning("Info", `LinkedIn ${t('url is not valid')}`)
    if (fbLink && !fbLink.match(facebookRegex))
      return notifyWarning("Info", `Facebook ${t('url is not valid')}`)
    if (twitterLink && !twitterLink.match(twitterRegex))
      return notifyWarning("Info", `Twitter ${t('url is not valid')}`)

    let phone;
    if (contactNo) {
      let regionCode = PhoneNumber(contactNo).getRegionCode()
      if (!regionCode) return notifyWarning("Info", "Contact No must start with international code")
      phone = new PhoneNumber(contactNo, regionCode);

      if (!phone.isValid()) return notifyWarning("Info", "Contact No is not valid")
    }
    let data = {
      userId: props.user.userId,
      gitLink: gitLink || "",
      fbLink: fbLink || "",
      linkedInLink: linkedInLink || "",
      twitterLink: twitterLink || "",
      contactNo: contactNo ? phone.getNumber('international') : ""
    }

    setIsUpdating(true)
    props.updateProfileData(data)
  }

  const initValues = () => {
    setGitLink(props.user.gitLink || "")
    setLinkedInLink(props.user.linkedInLink || "")
    setFbLink(props.user.fbLink || "")
    setTwitterLink(props.user.twitterLink || "")
    setContactNo(props.user.contactNo || "")
  }

  const cancelEditing = () => {
    initValues()
  }

  return (
    <form className='mt-2'
      onSubmit={e => handleSubmit(e)}
    >
      <Row>
        <Col md="6">
          <Row>
            <Col sm='12'>
              <FormGroup>
                <Label className="ml-25">
                  Phone
                </Label>
                <div className="d-block">
                  <IntlTelInput
                    containerClassName="intl-tel-input"
                    inputClassName="form-control"
                    preferredCountries={['ro']}
                    defaultValue={contactNo}
                    onPhoneNumberChange={(...args) => {
                      setContactNo(args[3])
                    }}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label className="ml-25">
                  Github
                </Label>
                <InputGroup className='input-group-merge'>
                  <Input
                    type="text"
                    placeholder={t('Enter github url')}
                    value={gitLink}
                    onChange={e => setGitLink(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label className="ml-25">
                  LinkedIn
                </Label>
                <InputGroup className='input-group-merge'>
                  <Input
                    type="text"
                    placeholder={t('Enter linkedIn url')}
                    value={linkedInLink}
                    onChange={e => setLinkedInLink(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label className="ml-25">
                  Facebook
                </Label>
                <InputGroup className='input-group-merge'>
                  <Input
                    type="text"
                    placeholder={t('Enter facebook url')}
                    value={fbLink}
                    onChange={e => setFbLink(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col sm='12'>
              <FormGroup>
                <Label className="ml-25">
                  Twitter
                </Label>
                <InputGroup className='input-group-merge'>
                  <Input
                    type="text"
                    placeholder={t('Enter twitter url')}
                    value={twitterLink}
                    onChange={e => setTwitterLink(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className='mt-2' sm='12'>
              <Button.Ripple type='submit' className='mr-1' color='primary'>
                {t('Save changes')}
              </Button.Ripple>
              <Button.Ripple
                type={'button'}
                color='secondary' outline
                onClick={() => cancelEditing()}
              >
                {t('Cancel')}
              </Button.Ripple>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  )
}

const mapStateToProps = (state) => {

  const {
    user,
    updateProfileLoading,
    updateProfileError,
    updateProfilePictureLoading,
    updateProfilePictureError,
  } = state.Profile;
  return {
    user,
    updateProfileLoading,
    updateProfileError,
    updateProfilePictureLoading,
    updateProfilePictureError,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    uploadProfilePicture,
    updateProfileData
  })(InfoTabContent)
)
