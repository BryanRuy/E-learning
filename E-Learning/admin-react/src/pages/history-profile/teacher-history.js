import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getTeacherHistoryStats,
  getTeacherPaymentPlan,
  postTeacherPaymentPlan,
  updateTeacherPaymentPlan,
} from "@store/actions";
import HistoryList from "./history-list";
import NotFound from "../../components/not-found";
import NoNetwork from "../../components/no-network";
import { ArrowLeft } from "react-feather";
import { Row, Col, Button } from "reactstrap";
import ProfileDetail from "./profile-detail";

import UILoader from "../../@core/components/ui-loader";
import {
  errorAlertDialog,
  successAlertDialog,
} from "../../helpers/HelperFunctions";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";

import { useTranslation } from "react-i18next";
export const TeacherHistory = (props) => {
  let teacherId = props.match.params.teacherId;
  const { user } = props.location.state;
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(user);

  const {
    teacherHistory,
    teacherHistoryLoading,
    teacherHistoryError,
    paymentPlan,
    paymentPlanLoading,
    paymentPlanError,
    postPaymentPlanSuccess,
    postPaymentPlanLoading,
    postPaymentPlanError,
    putPaymentPlanSuccess,
    putPaymentPlanLoading,
    putPaymentPlanError,
  } = props;

  const fetchTeacherHistory = () => {
    props.getTeacherHistoryStats(teacherId);
    props.getTeacherPaymentPlan(teacherId);
  };

  const updateSubscribtion = (data) => {
    data.userId = teacherId;
    data.paymentPlanId = paymentPlan.paymentPlanId;
    props.updateTeacherPaymentPlan(data);
  };

  const createSubscribtion = (data) => {
    data.userId = teacherId;
    props.postTeacherPaymentPlan(data);
  };

  useEffect(() => {
    if (postPaymentPlanSuccess)
      successAlertDialog(t("Subscribtion created successfully"));
  }, [postPaymentPlanSuccess]);

  useEffect(() => {
    if (postPaymentPlanError) errorAlertDialog(postPaymentPlanError);
  }, [postPaymentPlanError]);

  useEffect(() => {
    if (putPaymentPlanSuccess)
      successAlertDialog(t("Subscribtion created successfully"));
  }, [putPaymentPlanSuccess]);

  useEffect(() => {
    if (putPaymentPlanError) errorAlertDialog(putPaymentPlanError);
  }, [putPaymentPlanError]);

  const studentsOfTeacher = () => {
    if (
      teacherHistory &&
      teacherHistory.history &&
      teacherHistory.history.data.length > 0
    ) {
      setSelectedUser(teacherHistory.history.data[0].teacher.user);
      let studentData = [];
      teacherHistory.history.data.forEach((e) => {
        studentData.push(e.student.user);
      });
      setStudents(studentData);
    }
  };

  useEffect(() => {
    fetchTeacherHistory();
  }, []);

  useEffect(() => {
    studentsOfTeacher();
  }, [teacherHistory]);

  return (
    <>
      <UILoader
        blocking={
          paymentPlanLoading || postPaymentPlanLoading || putPaymentPlanLoading
        }
      >
        <Row className="mb-2">
          <Col md="6">
            <Button.Ripple
              className="btn-icon"
              size="sm"
              onClick={() => props.history.goBack()}
            >
              <ArrowLeft size={16} />
            </Button.Ripple>
            <h3 className="ml-2 d-inline m-0">{t("Teacher Profile")}</h3>
          </Col>
        </Row>

        <Row>
          <Col md="9">
            {!teacherHistoryLoading && teacherHistoryError && (
              <NoNetwork message={teacherHistoryError} />
            )}
            {!teacherHistoryLoading &&
              !teacherHistoryError &&
              teacherHistory &&
              teacherHistory.history &&
              teacherHistory.history.data.length == 0 && (
                <NotFound message={t("No student found")} />
              )}
            {teacherHistory &&
              teacherHistory.history &&
              teacherHistory.history.data.length > 0 && (
                <HistoryList
                  users={teacherHistory.history.data}
                  isTeacher={true}
                  fetchHistory={fetchTeacherHistory}
                  isReloading={teacherHistoryLoading}
                  onBack={props.onBack}
                />
              )}
          </Col>
          <Col md="3">
            {selectedUser && (
              <ProfileDetail
                user={selectedUser}
                isTeacher={true}
                paymentPlan={paymentPlan}
                updateOrCreateSubscribtion={
                  paymentPlan ? updateSubscribtion : createSubscribtion
                }
              />
            )}
          </Col>
        </Row>
      </UILoader>
    </>
  );
};

TeacherHistory.propTypes = {
  onSelect: PropTypes.func,
  onBack: PropTypes.func,
};

const mapStateToProps = (state) => {
  const {
    teacherHistory,
    teacherHistoryLoading,
    teacherHistoryError,

    paymentPlan,
    paymentPlanLoading,
    paymentPlanError,

    postPaymentPlanSuccess,
    postPaymentPlanLoading,
    postPaymentPlanError,

    putPaymentPlanSuccess,
    putPaymentPlanLoading,
    putPaymentPlanError,
  } = state.History;

  return {
    teacherHistory,
    teacherHistoryLoading,
    teacherHistoryError,

    paymentPlan,
    paymentPlanLoading,
    paymentPlanError,

    postPaymentPlanSuccess,
    postPaymentPlanLoading,
    postPaymentPlanError,

    putPaymentPlanSuccess,
    putPaymentPlanLoading,
    putPaymentPlanError,
  };
};

const mapDispatchToProps = {
  getTeacherHistoryStats,
  getTeacherPaymentPlan,
  postTeacherPaymentPlan,
  updateTeacherPaymentPlan,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TeacherHistory)
);
