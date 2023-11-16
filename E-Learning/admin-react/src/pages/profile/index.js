import React, { Fragment, useState, useEffect } from 'react'
import Tabs from './Tabs'
import GeneralTabContent from './GeneralTabContent'
import InfoTabContent from './InfoTabContent'
import PasswordTabContent from './PasswordTabContent'
import { Row, Col, TabContent, TabPane, Card, CardBody } from 'reactstrap'

// ** Store & Actions
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

import { setProfileUser  ,getCounties} from './store/actions'

import UILoader from '../../@core/components/ui-loader';
import {useTranslation} from 'react-i18next'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import { getLoggedInUser } from '../../helpers/backend-helpers'

const AccountSettings = (props) => {
  const [activeTab, setActiveTab] = useState('1')

  const {t} = useTranslation()
  const toggleTab = tab => {
    setActiveTab(tab)
  }

  useEffect(() => {
    props.setProfileUser(getLoggedInUser() || {})
    props.getCounties()
  }, [])

  return (
    <Fragment>
      <h3 className="mb-2">
        {t('Account Settings')}
      </h3>
      <UILoader blocking={
        props.updateProfileLoading ||
        props.updateProfilePictureLoading ||
        props.updatePasswordLoading}
      >
        <Row>
          <Col className='mb-2 mb-md-0' md='3'>
            <Tabs activeTab={activeTab} toggleTab={toggleTab} />
          </Col>
          <Col md='9'>
            <Card>
              <CardBody>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId='1'>
                    <GeneralTabContent />
                  </TabPane>
                  <TabPane tabId='2'>
                    <InfoTabContent />
                  </TabPane>
                  <TabPane tabId='3'>
                    <PasswordTabContent />
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </UILoader>

    </Fragment>
  )
}

const mapStateToProps = (state) => {

  const {
    updateProfileLoading,
    updateProfilePictureLoading,
    updatePasswordLoading,
  } = state.Profile;
  return {
    updateProfileLoading,
    updateProfilePictureLoading,
    updatePasswordLoading,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    setProfileUser,
    getCounties
  })(AccountSettings)
)
