import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import { getStudentHistoryStats } from "@store/actions";
import HistoryList from "./history-list";
import NotFound from '../../components/not-found';
import NoNetwork from '../../components/no-network';
import { Row, Col, Button } from "reactstrap";
import { ArrowLeft } from "react-feather";
import ProfileDetail from "./profile-detail";
import { useTranslation } from "react-i18next";
export const StudentHistory = (props) => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState([]);
  const { user } = props.location.state;
  const [selectdUser, setSelectedUser] = useState(user);

  const { studentHistory, studentHistoryLoading, studentHistoryError } = props;
  let studentId = props.match.params.studentId;

  const fetchStudentHistory = () => {
    props.getStudentHistoryStats(studentId);
  };

  useEffect(() => {
    fetchStudentHistory();
  }, []);

  const studentsOfTeacher = () => {
    if (
      studentHistory &&
      studentHistory.history &&
      studentHistory.history.data.length > 0
    ) {
      setSelectedUser(studentHistory.history.data[0].student.user);
      let teachersData = [];
      studentHistory.history.data.forEach((e) => {
        teachersData.push(e.teacher.user);
      });
      setTeachers(teachersData);
    }
  };

  useEffect(() => {
    studentsOfTeacher();
  }, [studentHistory]);

  return (
    <>
      <Row className="mb-2">
        <Col md="6">
          <Button.Ripple
            className="btn-icon"
            size="sm"
            onClick={() => props.history.goBack()}
          >
            <ArrowLeft size={16} />
          </Button.Ripple>
          <h3 className="ml-2 d-inline m-0">{t("Student Profile")}</h3>
        </Col>
      </Row>

      <Row>
        <Col md="9">
          {!studentHistoryLoading && studentHistoryError && (
            <NoNetwork message={studentHistoryError} />
          )}
          {!studentHistoryLoading &&
            !studentHistoryError &&
            studentHistory &&
            studentHistory.history &&
            studentHistory.history.data.length == 0 && (
              <NotFound message={t("No teacher found")} />
            )}
          {studentHistory &&
            studentHistory.history &&
            studentHistory.history.data.length > 0 && (
              <HistoryList
                users={studentHistory.history.data}
                isTeacher={false}
                fetchHistory={fetchStudentHistory}
                isReloading={studentHistoryLoading}
                onBack={props.onBack}
              />
            )}
        </Col>
        <Col md="3">{selectdUser && <ProfileDetail user={selectdUser} />}</Col>
      </Row>
    </>
  );
};

StudentHistory.propTypes = {
  onSelect: PropTypes.func,
  onBack: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { studentHistory, studentHistoryLoading, studentHistoryError } =
    state.History;
  return { studentHistory, studentHistoryLoading, studentHistoryError };
};

const mapDispatchToProps = {
  getStudentHistoryStats,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StudentHistory)
);
