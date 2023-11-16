import React, { Fragment, useState, useEffect } from 'react'
import Tabs from './Tabs'
import GeneralTabContent from './GeneralTabContent'
import InfoTabContent from './InfoTabContent'
import PasswordTabContent from './PasswordTabContent'
import { Row, Col, TabContent, TabPane, Card, CardBody, Alert } from 'reactstrap'

// ** Store & Actions
import { connect } from 'react-redux'
// import { getUserTopics, getUserTopicLessons, selectTopic, selectLesson, getLesson, completedLesson } from './store/actions'

import { withRouter } from 'react-router';
import { setProfileUser, getCounties } from '@store/actions'
import UILoader from '../../@core/components/ui-loader';
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import { getLoggedInUser, isUserPlanExpired } from '../../helpers/backend-helpers'
import SavedCardsTabContent from './SavedCardsTabContent'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { loadStripe } from "@stripe/stripe-js";
const AccountSettings = (props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('1')

  const toggleTab = tab => {
    setActiveTab(tab)
  }


  useEffect(() => {
    props.setProfileUser(getLoggedInUser() || {})
    props.getCounties()
  }, [])

  useEffect(() => {

    if (props.paymentPlan && (((!props.paymentPlan.startDate && !props.paymentPlan.endDate) || moment(props.paymentPlan.endDate).isBefore(new Date()))
      && props.paymentPlan)) {
      setActiveTab('4')
    }
  }, [props.paymentPlan])

  return (
    <Fragment>
      <h3 className="mb-2">
        {t('Account Settings')}
      </h3>
      <Row>
        <Col className='mb-2 mb-md-0' md='3'>
          <Tabs activeTab={activeTab} toggleTab={toggleTab} />
        </Col>

        <Col md='9'>

          {
            !props.paymentPlan &&
            <Alert className="p-1 w-100" color="info">{t(`Currently you have no subscription plan`)}</Alert>
          }

          {
            (props.paymentPlan && ((!props.paymentPlan.startDate && !props.paymentPlan.endDate) || moment(props.paymentPlan.endDate).isBefore(new Date()))) &&
            <Alert className="p-1 w-100" color="danger">{t(`Your subscription has expired`)}</Alert>
          }
        
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
                <TabPane tabId='4'>
                  <SavedCardsTabContent />
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* </UILoader> */}

    </Fragment>

  )
}

const mapStateToProps = (state) => {

  const {
    updateProfileLoading,
    updateProfilePictureLoading,
    updatePasswordLoading,
  } = state.Profile;

  const {

    paymentPlan,
    paymentPlanError,
    paymentPlanLoading,
  } = state.Stripe

  return {
    updateProfileLoading,
    updateProfilePictureLoading,
    updatePasswordLoading,

    paymentPlan,
    paymentPlanError,
    paymentPlanLoading,
  }
}

export default withRouter(
  connect(mapStateToProps, {
    setProfileUser,
    getCounties
  })(AccountSettings)
)
