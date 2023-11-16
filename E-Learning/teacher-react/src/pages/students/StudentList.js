import React, { useState } from "react";

import { CardBody, CardTitle, Table, Badge, Button } from "reactstrap";

import CardReload from "../../@core/components/card-reload";

import Avatar from "@components/avatar";
import { titleCase } from "@utils";
import { DateTime } from "../../components/date-time";
import { useEffect } from "react";
import { getAllStudents, getStudentById } from "@store/actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getProfileImageUrl } from "../../helpers/url_helper";
import CustomPagination from "../pagination";
import { useTranslation } from "react-i18next";

const StudentList = (props) => {
  const { t } = useTranslation();
  const { students, studentList } = props;
  const [studentData, setStudentData] = useState();
  const [currentPage, setCurrentPage] = useState(0);

  const onStudentSelect = (student) => {
    props.history.push(`/students/${student.user.userId}`);
  };

  const onPageChange = (page) => {
    setCurrentPage(page-1)
    let data = {
      page: page,
      limit: 20,
    };
    if (studentList[page]) setStudentData(studentList[page]);
    else props.getAllStudents(data);
  };

  const fetchStudents = () => {
    let data = {
      page: currentPage,
      limit: 20,
    };
    props.getAllStudents(data);
  };
  useEffect(() => {
    setStudentData(students.data);
  }, [students]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const getStudentStatusColor = (studentStatus) => {
    switch (studentStatus) {
      case "active":
        return "light-success";
      case "blocked":
        return "light-danger";
      case "waiting-for-teacher":
        return "light-warning";
      case "new":
        return "light-warning";
      default:
        return "light-warning";
    }
  };

  return (
    <CardReload
      title={t("Students")}
      onReload={fetchStudents}
      isReloading={props.studentsLoading}
    >
      <CardBody>
        {studentData && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("Name")}</th>
                <th>{t("Email")}</th>
                <th>{t("Created At")}</th>
                <th>{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {studentData.map((s, i) => (
                <tr key={s.userId}>
                  <td>{i + 1}</td>
                  <td onClick={() => onStudentSelect(s)}>
                    <Avatar
                      className="cursor-pointer"
                      img={getProfileImageUrl(s.user.profilePicture)}
                    />
                    <span className="align-middle font-weight-bold ml-1">
                      <u> {s.user.name}</u>
                    </span>
                  </td>
                  <td>{s.user.email}</td>
                  <td>
                    <DateTime dateTime={s.user.createdAt} type="date" />
                  </td>
                  <td>
                    <Badge
                      pill
                      color={getStudentStatusColor(s.status)}
                      className="mr-1"
                    >
                      {titleCase(s.status)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {students.count > 0 && (
          <CustomPagination
            pages={Math.ceil(students.count / 20)}
            onSelect={onPageChange}
            selectedPage={currentPage}
          />
        )}
      </CardBody>
    </CardReload>
  );
};

const mapStateToProps = (state) => {
  const { students, studentList, studentsError, studentsLoading } =
    state.Students;
  return {
    students,
    studentList,
    studentsError,
    studentsLoading,
  };
};

export default withRouter(
  connect(mapStateToProps, { getAllStudents, getStudentById })(StudentList)
);
