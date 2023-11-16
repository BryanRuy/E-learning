import React, { Fragment, useState, useEffect } from 'react'
import {
  Button, Media, Label, Row, Col, Input, FormGroup,
  Form, InputGroup
} from 'reactstrap'

import Select from 'react-select'
import { selectThemeColors } from '@utils'
// ** Store & Actions
import { connect } from 'react-redux'
import {
  uploadProfilePicture,
  updateProfileData

} from './store/actions'

import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router';

import { GET_IMAGE_URL } from '../../helpers/url_helper'

import { notifyError, notifySuccess } from '../../utility/toast'

const GeneralTabs = (props) => {

  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [name, setName] = useState(props.user.name || "")
  const [zipCode, setZipCode] = useState(props.user.zipCode || "")
  const [city, setCity] = useState(props.user.city || "")
  const [county, setCounty] = useState(props.user.county || "")
  const [country, setCountry] = useState("Romania")
  const [address, setAddress] = useState(props.user.address || "")
  const [about, setAbout] = useState(props.user.about)
  const [file, setFile] = useState(null)
  const [cities, setCities] = useState([]);

  let counties__ = props.countiesData.counties || [];
  const countiesOptions = counties__.map(x=>{return {value: x.id, label: x.name}});
  

  useEffect(() => {
    if (county) {
      let defaultCounty = countiesOptions.find(e => (e.value == county))
      if (defaultCounty) {
        setCounty(defaultCounty.value);
      }
      
    }
  }, [props.countiesData])

  useEffect(() => {
    if (cities && city) {
      let defaultCity = cities.find(e => (e.value == city))
      if (defaultCity) {
        setCity(defaultCity.value);
      }
    }
  }, [cities])

  useEffect(() => {
    if (props.user) {
      setName(props.user.name || "")
      setAbout(props.user.about || "")
      setCity(props.user.city || "")
      setCounty(props.user.county || "")
      setCountry(props.user.country || "")
      setAddress(props.user.address || "")
      setZipCode(props.user.zipCode || "")
    } 
  }, [props.user])

  useEffect(() => {
    if(county){
      let citiesDataList = props.countiesData.cities || {};
      let citiesList = citiesDataList[county] || []
      let filteredCities = citiesList.map(x => { return { label: x.name, value: x.name } });
      setCities(filteredCities)
    }
  },[county, props.countiesData])

  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(files[0])
    setFile(files[0])

  }

  const publishPhoto = () => {
    let form = new FormData()
    form.append('file', file)
    props.uploadProfilePicture(form)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing && !props.updateProfileLoading && !props.updateProfileError) {
      setIsEditing(false)
      notifySuccess(t("Update Profile"), t("Profile updated successfully"))
    }
    else if (isEditing && !props.updateProfileLoading && props.updateProfileError) {
      notifyError(t("Update Profile"), props.updateProfileError)
    }
  }, [props.updateProfileLoading])

  useEffect(() => {
    if (file && !props.updateProfilePictureLoading && !props.updateProfilePictureError) {
      setFile(null)
      notifySuccess(t("Update Profile Picture"), t("Profile picture updated successfully"))
      window.location.reload()
    }
    else if (file && !props.updateProfilePictureLoading && props.updateProfilePictureError) {
      setFile(null)
      notifyError(t("Update Profile Picture"), props.updateProfilePictureError)
    }
  }, [props.updateProfilePictureLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    props.updateProfileData({
      name, about, city, county, country, address,zipCode
    })
  }

  const resetImage = () => {
    setFile(null);
    setAvatar(props.user.profilePicture || "")
  }

  const countryOptions = [
    { value: 'Romania', label: 'Romania' }
  ]

 
  return (
    <Fragment>
      <Media>
        <Media className='mr-25' left>
          <Media object className='rounded mr-50' src={file ? avatar : GET_IMAGE_URL(props.user.profilePicture)} alt={t('No Profile Picture')} height='80' width='80' />
        </Media>
        <Media className='mt-75 ml-1' body>
          {
            file ? <>
              <Button.Ripple
                tag={Label}
                className='mr-75'
                size='sm'
                color='primary'
                onClick={() => publishPhoto()}
              >
                Publish
              </Button.Ripple>
              <Button.Ripple
                color='secondary'
                size='sm'
                outline
                onClick={() => resetImage()}
              >
                {t("Reset")}
              </Button.Ripple>
            </>
              :
              <Button.Ripple tag={Label} className='mr-75' size='sm' color='primary'>
                {t("Upload")}
                <Input type='file' onChange={onChange} hidden accept='image/*' />
              </Button.Ripple>
          }

          <p>{t('Allowed JPG, GIF or PNG. Max size of 800kB')}</p>
        </Media>
      </Media>
      <form className='mt-2'
        onSubmit={e => handleSubmit(e)}
      >
        <Row>
          <Col md='6'>
            <FormGroup>
              <Label className="ml-25">
                {t('Name')}
              </Label>
              <InputGroup className='input-group-merge'>
                <Input
                  type="text"
                  placeholder={t('Enter Name')}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!isEditing}
                  required />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md='6'>
            <FormGroup>
              <Label className="ml-25">
                {t('Email')}
              </Label>
              <InputGroup className='input-group-merge'>
                <Input
                  type="mail"
                  placeholder={t('Enter Email')}
                  value={props.user.email || ""}
                  disabled
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md='6'>
            <FormGroup>
              <Label className="ml-25">
                {t('Address')}
              </Label>
              <InputGroup className='input-group-merge'>
                <Input
                  type="text"
                  placeholder={t('Enter Address')}
                  value={address || ""}
                  onChange={e => setAddress(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md='6'>
            <FormGroup>
              <Label className="ml-25">
                {t('County')}
              </Label>
              {
                isEditing &&
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  value={countiesOptions.find(e => (e.value == county))}
                  defaultValue={countiesOptions.find(e => (e.value == county))}
                  options={countiesOptions}
                  isClearable={false}
                  disabled={!isEditing}
                  onChange={e => setCounty(e.value)}
                />
              }
              {
                !isEditing &&
                <InputGroup className='input-group-merge'>
                <Input
                  type="text"
                  placeholder={t('Your county')}
                  value={county}
                  disabled={!isEditing}
                />
              </InputGroup>
               } 
            </FormGroup>
          </Col>
          <Col md='6'>
            <FormGroup>
              <Label className="ml-25">
                {t('City')}
              </Label>
              {
                isEditing &&
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  value={cities.find(e => (e.value == city))}
                  defaultValue={city}
                  options={cities}
                  isClearable={false}
                  disabled={!isEditing}
                  onChange={e => setCity(e.value)}
                />
              }
              {
                !isEditing &&
                <InputGroup className='input-group-merge'>
                <Input
                  type="text"
                  placeholder={t('Your City')}
                  value={city}
                  disabled={!isEditing}
                />
              </InputGroup>
               } 
            </FormGroup>
          </Col>

          <Col md='6'>
            <FormGroup>
              <Label className="ml-25">{t("Country")}</Label>
              {
                isEditing &&
                <Select
                  theme={selectThemeColors}
                  className='react-select'
                  classNamePrefix='select'
                  defaultValue={countryOptions.find(e => (e.value == country))}
                  options={countryOptions}
                  isClearable={false}
                  onChange={e => setCountry(e.value)}
                />
              }
              {
                !isEditing &&
                <InputGroup className='input-group-merge'>
                <Input
                  type="text"
                  placeholder='Your country'
                  value={country}
                  disabled={!isEditing}
                />
              </InputGroup>
               } 
            </FormGroup>
          </Col>
          <Col md='6'>
          {
                <FormGroup>
                <Label className="ml-25">{t("Cod postal")}</Label>
                <InputGroup className='input-group-merge'>
                <Input
                  type="text"
                  placeholder={t('Adauga cod postal')}
                  value={zipCode}
                  disabled={!isEditing}
                  onChange={e => setZipCode(e.target.value)}
                  required
                />
              </InputGroup>
              </FormGroup>
               } 
          </Col>
          <Col sm='12'>
            <FormGroup >
              <Input
                type='textarea'
                rows='4'
                placeholder={t('About')}
                value={about}
                onChange={e => setAbout(e.target.value)}
                disabled={!isEditing}
              />
            </FormGroup>
          </Col>
          <p className='ml-2'>{t('The address is required in order to send invoices.')}</p>
          <Col className='mt-2' sm='12'>
            {
              isEditing &&
              <>
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
              </>
            }
          </Col>
        </Row>
      </form>
      {
        !isEditing
        &&
        <Button.Ripple
          type={'button'}
          className='mr-1'
          color='primary'
          onClick={() => setIsEditing(true)}
        >
          {t('Edit')}
        </Button.Ripple>
      }
    </Fragment >
  )
}

const mapStateToProps = (state) => {

  const {
    user,

    updateProfileLoading,
    updateProfileError,

    updateProfilePictureLoading,
    updateProfilePictureError,

    countiesData,
    countiesLoading,
    countiesError
  } = state.Profile;
  return {
    user,

    updateProfileLoading,
    updateProfileError,

    updateProfilePictureLoading,
    updateProfilePictureError,

    countiesData,
    countiesLoading,
    countiesError
  }
}

export default withRouter(
  connect(mapStateToProps, {
    uploadProfilePicture,
    updateProfileData
  })(GeneralTabs)
)
