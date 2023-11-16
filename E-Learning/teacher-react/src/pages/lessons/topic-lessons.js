import React from "react";
// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import classnames from "classnames";
import {
  Card,
  CardBody,
  Row,
  Col,
  Collapse,
  Navbar,
  Button,
  CardTitle,
  CardHeader,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalBody,
  CustomInput,
} from "reactstrap";

// ** Store & Actions
import { connect, useSelector } from "react-redux";
import {
  getTeacherTopicLessons,
  getTeacherTopics,
  selectTopic,
  selectLesson,
  getLesson,
  // getStudentsForLesson,
  assignLessonToStudents,
  unassignLessonToStudents,
  deleteLesson,
  getAllStudents,
} from "@store/actions";

import { withRouter } from "react-router";
import "./style.scss";
import ReactMarkdown from "react-markdown";
import { render } from "react-dom";

import Avatar from "@components/avatar";

import {
  Trash2,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Plus,
  Search,
  ArrowLeft,
} from "react-feather";

import UILoader from "../../@core/components/ui-loader";

import { GET_IMAGE_URL, BLOG_API_URL } from "../../helpers/url_helper";

import { DateTime } from "../../components/date-time";

import NotFound from "../../components/not-found";
import NoNetwork from "../../components/no-network";

import { notifyError, notifySuccess } from "../../utility/toast";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useTranslation } from "react-i18next";

const MySwal = withReactContent(Swal);

const AppLessons = (props) => {
  const { t } = useTranslation();
  const lessonRef = React.createRef();
  const lessonContentRef = React.createRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLessons, setIsOpenLessons] = useState(false);
  const [isAssignModelOpen, setIsAssignModelOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [query, setQuery] = useState("");
  const [studentIdsAccessRequest, setStudentIdsAccessRequest] = useState([]);
  const [studentIdsAccessRemove, setStudentIdsAccessRemove] = useState([]);
  const [isLessonDeleting, setIsLessonDeleting] = useState(false);

  const toggleLessons = () => setIsOpenLessons(!isOpenLessons);

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (props.selectedTopic) {
      // props.getStudentsForLesson()
      props.getAllStudents({ page: 1, limit: 100 });
      props.getTeacherTopicLessons(props.selectedTopic);
      setIsOpenLessons(false);
    } else {
      props.history.goBack();
    }
  }, [props.selectedTopic]);

  useEffect(() => {
    if (isLessonDeleting && !props.lessonDeleting && props.lessonDeleteError) {
      setIsLessonDeleting(false);
      notifyError(t("Delete Lesson"), props.lessonDeleteError);
    } else if (
      isLessonDeleting &&
      !props.lessonDeleting &&
      !props.lessonDeleteError
    ) {
      setIsLessonDeleting(false);
      notifySuccess(t("Delete Lesson"), t("Lesson deleted successfully"));
    }
  }, [props.lessonDeleting]);

  useEffect(() => {
    if (
      isAssignModelOpen &&
      !props.studentsLessonAssignLoading &&
      !props.studentsLessonAssignError
    ) {
      setIsAssignModelOpen(false);
      setStudentIdsAccessRequest([]);
      notifySuccess(
        t("Lesson Access"),
        t("Lesson access granted successfully")
      );
    } else if (
      isAssignModelOpen &&
      !props.studentsLessonAssignLoading &&
      props.studentsLessonAssignError
    ) {
      notifyError(t("Lesson Access"), props.studentsLessonAssignError);
    }
  }, [props.studentsLessonAssignLoading]);

  useEffect(() => {
    if (
      isRevoking &&
      !props.studentsLessonUnassignLoading &&
      !props.studentsLessonUnassignError
    ) {
      setIsRevoking(false);
      setStudentIdsAccessRemove([]);
      notifySuccess(
        t("Lesson Access"),
        t("Lesson access revoked successfully")
      );
    } else if (
      isRevoking &&
      !props.studentsLessonUnassignLoading &&
      props.studentsLessonUnassignError
    ) {
      notifyError(t("Lesson Access"), props.studentsLessonUnassignError);
    }
  }, [props.studentsLessonUnassignLoading]);

  useEffect(() => {
    setStudentIdsAccessRequest([]);
    setStudentIdsAccessRemove([]);
    setIsOpenLessons(false);
    if (props.selectedLesson) {
      let lesson = props.lessons.find((l) => l.id == props.selectedLesson);
      if (lesson && !lesson.isFull) {
        props.getLesson(props.selectedLesson);
      }
    }
  }, [props.selectedLesson]);

  useEffect(() => {
    if (props.lessons.length > 0 && !props.selectedLesson) {
      props.selectLesson(props.lessons[0].id);
    } else if (props.lessons.length > 0 && props.selectedLesson) {
      props.getLesson(props.selectedLesson);
    }
  }, [props.lessons]);

  const toggleFromGrantAccessList = (id) => {
    if (studentIdsAccessRequest.find((i) => i == id))
      return setStudentIdsAccessRequest(
        studentIdsAccessRequest.filter((i) => i != id)
      );
    setStudentIdsAccessRequest([...studentIdsAccessRequest, id]);
  };

  const toggleFromRemoveAccessList = (id) => {
    if (studentIdsAccessRemove.find((i) => i == id))
      return setStudentIdsAccessRemove(
        studentIdsAccessRemove.filter((i) => i != id)
      );
    setStudentIdsAccessRemove([...studentIdsAccessRemove, id]);
  };

  const assignLesson = () => {
    props.assignLessonToStudents({
      lessonId: props.selectedLesson,
      studentIds: studentIdsAccessRequest,
    });
  };

  const getFilterStudents = (list) => {
    if (!query) return list;
    let students = [];
    list.forEach((s) => {
      if (s.noNameUser.name.toLowerCase().includes(query.toLowerCase()))
        students.push(s);
    });
    return students;
  };

  const getStudentsWithoutLesson = () => {
    let lesson = props.lessons.find((l) => l.id == props.selectedLesson);
    if (!lesson) return [];
    if (!lesson.isFull) return [];
    let filteredStudents = [];
    props.students.data.forEach((s) => {
      let exist = false;
      lesson.studentLessons.forEach((sl) => {
        if (s.user.userId == sl.noNameUser.noNameUserUuid) {
          exist = true;
        }
      });
      if (!exist) filteredStudents.push(s);
    });

    return filteredStudents;
  };

  const renderLesson = (content) => {
    if (content) {
      let uploadPath = `${BLOG_API_URL}/uploads/`;
      let markdown = String(content).replaceAll("/uploads/", uploadPath);
      let fun = () => {
        if (lessonContentRef.current) {
          render(
            <ReactMarkdown>{markdown}</ReactMarkdown>,
            lessonContentRef.current
          );
          window.scrollTo(0, 0);
          lessonRef.current.scrollTo(0, 0);
        } else {
          setTimeout(fun, 100);
        }
      };
      setTimeout(fun, 200);
    }
  };

  const revokeAccess = () => {
    setIsRevoking(true);
    props.unassignLessonToStudents({
      lessonId: props.selectedLesson,
      studentIds: studentIdsAccessRemove,
    });
  };

  const handleLessonEdit = (lesson) => {
    props.history.push({
      pathname: "/update-lesson",
      state: lesson,
    });
  };

  const activeLesson = () => {
    let lesson = props.lessons.find((l) => l.id == props.selectedLesson);
    if (!lesson) return;
    return (
      <UILoader blocking={props.oneLessonLoading}>
        {lesson && (
          <Card
            className={`active-lesson-container ${
              isOpenLessons ? "hide" : ""
            } `}
          >
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
              <div className="text-right">
                <Button.Ripple
                  color="primary"
                  outline
                  onClick={() => handleLessonEdit(lesson)}
                >
                  {t("Edit")}
                </Button.Ripple>
              </div>
            </CardHeader>
            <CardBody>
              <div ref={lessonRef} className="active-lesson">
                {lesson.videoUrl && (
                  <div className="lesson-video mt-2">
                    <iframe
                      src={lesson.videoUrl}
                      title={t("YouTube video player")}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <div
                  ref={lessonContentRef}
                  id="active-lesson-content"
                  className={lesson.videoUrl ? "mt-4" : ""}
                >
                  {props.oneLessonError && <NoNetwork />}
                </div>
                {lesson.content && renderLesson(lesson.content)}
              </div>
            </CardBody>
          </Card>
        )}
        {lesson.studentLessons && (
          <div className={`students ${isOpenLessons ? "active" : "m-2"}`}>
            <div className="heading" onClick={toggleLessons}>
              <h4>{t("Students")}</h4>
              <div>
                {isOpenLessons ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronUp size={20} />
                )}
              </div>
            </div>
            {isOpenLessons && (
              <Collapse isOpen={isOpenLessons}>
                <div className="student-list">
                  <Row>
                    <Col sm="12" md="7" lg="8">
                      <InputGroup className="input-group-merge">
                        <Input
                          placeholder="Search here"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {!query && <Search size={14} />}
                            {query && (
                              <X size={14} onClick={() => setQuery("")} />
                            )}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col sm="12" md="5" lg="4">
                      <div className="text-right mt-1 mt-md-0">
                        <Button.Ripple
                          color="primary"
                          onClick={() => setIsAssignModelOpen(true)}
                        >
                          <Plus size={14} />
                          &nbsp;
                          {t("Grant Access")}
                        </Button.Ripple>
                      </div>
                    </Col>
                  </Row>
                  {lesson.studentLessons.length == 0 && (
                    <NotFound message="This Lesson is not Assigned to any student" />
                  )}
                  {lesson.studentLessons.length > 0 && (
                    <Table
                      key="lesson-student-table"
                      className="mt-2"
                      responsive
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t("Students")}</th>
                          <th>{t("Progress")}</th>
                          <th>{t("Date")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilterStudents(lesson.studentLessons).map(
                          (s, index) => (
                            <tr key={"filter-student" + index}>
                              <td>
                                <CustomInput
                                  type="checkbox"
                                  className="custom-control-Primary"
                                  id={"filter-student" + index}
                                  inline
                                  onClick={() =>
                                    toggleFromRemoveAccessList(
                                      s.noNameUser.noNameUserUuid
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <Avatar
                                  className="box-shadow-1 avatar-border"
                                  size="sm"
                                  img={GET_IMAGE_URL(
                                    s.noNameUser.profilePicture
                                  )}
                                  imgHeight="70"
                                  imgWidth="70"
                                />
                                &nbsp;&nbsp;
                                <span>{s.noNameUser.name}</span>
                              </td>
                              <td>
                                {s.isCompleted ? (
                                  <Badge
                                    pill
                                    color="light-success"
                                    className="mr-1"
                                  >
                                    {t("Completed")}
                                  </Badge>
                                ) : (
                                  <Badge
                                    pill
                                    color="light-warning"
                                    className="mr-1"
                                  >
                                    {t("Incomplete")}
                                  </Badge>
                                )}
                              </td>
                              <td>
                                <DateTime dateTime={s.created_at} />
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  )}
                  {studentIdsAccessRemove.length > 0 && (
                    <div className="mt-2">
                      <Button.Ripple
                        color="primary"
                        onClick={() => revokeAccess()}
                      >
                        {t("Revoke Access")}
                      </Button.Ripple>
                    </div>
                  )}
                </div>
              </Collapse>
            )}
          </div>
        )}
      </UILoader>
    );
  };

  const handleLessonDelete = (id) => {
    return MySwal.fire({
      icon: "question",
      title: `${t("Confirm")}`,
      text: `${t("Are you sure to delete this lesson?")}`,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary ml-1",
      },
      confirmButtonText: "Yes",
      buttonsStyling: false,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        props.deleteLesson(id);
      }
    });
  };

  return (
    <>
      {props.topics.find((t) => t.id == props.selectedTopic) && (
        <Fragment>
          <UILoader
            blocking={
              props.lessonsLoading || props.studentsLessonUnassignLoading
            }
          >
            <Card className="h-100 border-less-card">
              <CardBody className="p-0">
                {!props.lessonsLoading && props.lessonsError && (
                  <NoNetwork title={"Error"} message={props.lessonsError} />
                )}
                {!props.lessonsLoading && !props.lessonsError && (
                  <Row className="h-100">
                    <Col
                      lg={3}
                      sm="12"
                      md="12"
                      className={`pr-lg-0  topic-list-shadow`}
                    >
                      <Navbar expand="lg" className="p-0 lesson-nav">
                        {!isOpen && (
                          <Menu
                            className="m-2 d-md-block d-lg-none"
                            width={20}
                            height={20}
                            onClick={toggle}
                          />
                        )}
                        {isOpen && (
                          <X
                            className="m-2 d-md-block d-lg-none"
                            width={20}
                            height={20}
                            onClick={toggle}
                          />
                        )}
                        <Collapse isOpen={isOpen} navbar className={"h-100"}>
                          <Card className="w-100 h-100">
                            <CardHeader>
                              <div className="d-flex align-items-center mb-1">
                                <div className="d-none d-lg-inline d-xl-inline">
                                  <Button.Ripple
                                    className="btn-block btn-icon"
                                    color="flat-primary"
                                    onClick={() => {
                                      props.history.goBack();
                                    }}
                                  >
                                    <ArrowLeft size={14} />
                                  </Button.Ripple>
                                </div>
                                <h6 className="ml-25 mb-0">
                                  {
                                    props.topics.find(
                                      (t) => t.id == props.selectedTopic
                                    ).title
                                  }
                                </h6>
                              </div>
                              <div className="d-flex w-100 align-items-center justify-content-between">
                                <h4 className="text-primary ml-25 mb-0">
                                  {t("Lessons")}
                                </h4>
                                <div>
                                  <Button.Ripple
                                    className="btn-block btn-icon"
                                    color="primary"
                                    onClick={() => {
                                      props.history.push("/new-lesson");
                                    }}
                                  >
                                    <Plus size={14} />
                                  </Button.Ripple>
                                </div>
                              </div>
                            </CardHeader>
                            <CardBody className="p-0 h-100">
                              {props.lessons.length == 0 &&
                                !props.lessonsLoading &&
                                !props.lessonsError && (
                                  <NotFound
                                    message="Add new Lesson"
                                    width={100}
                                    height={100}
                                  />
                                )}
                              {props.lessons.length > 0 && (
                                <div className="h-100 lesson-list">
                                  {props.lessons.map((l, index) => (
                                    <div
                                      key={"lesson-key-" + index}
                                      className={`lesson-container ${
                                        l.id == props.selectedLesson
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <div
                                        className="lesson-content"
                                        onClick={() => {
                                          props.selectLesson(l.id);
                                          if (isOpen) setIsOpen(false);
                                        }}
                                      >
                                        {l.title}
                                      </div>
                                      <div className="lesson-action">
                                        <Trash2
                                          size={14}
                                          onClick={() =>
                                            handleLessonDelete(l.id)
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        </Collapse>
                      </Navbar>
                    </Col>
                    <Col
                      lg="9"
                      md="12"
                      sm="12"
                      className="h-100 active-lesson-col"
                    >
                      {activeLesson()}
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </UILoader>
          <Modal isOpen={isAssignModelOpen} className="modal-dialog-centered">
            <UILoader
              blocking={props.studentsLessonAssignLoading}
              className="model-loader"
            >
              <ModalBody className="pb-1">
                <div className="text-right">
                  <X
                    size={16}
                    onClick={() => {
                      setIsAssignModelOpen(false);
                      setStudentIdsAccessRequest([]);
                    }}
                  />
                </div>
                <h4>{t("Select a student")}</h4>
                {getStudentsWithoutLesson().length == 0 && (
                  <NotFound message={t("No Student Left")} />
                )}
                <Row className="mt-1">
                  {getStudentsWithoutLesson().map((s, index) => (
                    <Col
                      key={"lesson-assign-" + index}
                      lg="12"
                      className="mb-25 p-1 student-bottom-border"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Avatar
                            className="box-shadow-1 avatar-border"
                            size="sm"
                            img={GET_IMAGE_URL(s.user.profilePicture)}
                          />
                          &nbsp;&nbsp;
                          <span>{s.user.name}</span>
                        </div>
                        <CustomInput
                          type="checkbox"
                          className="custom-control-Primary"
                          id={"lesson-assign-" + index}
                          inline
                          onClick={() =>
                            toggleFromGrantAccessList(s.user.userId)
                          }
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
                {studentIdsAccessRequest.length > 0 && (
                  <div className="text-right">
                    <Button.Ripple
                      color="primary"
                      className="mt-2"
                      onClick={() => assignLesson()}
                    >
                      {t("Apply")}
                    </Button.Ripple>
                  </div>
                )}
              </ModalBody>
            </UILoader>
          </Modal>
        </Fragment>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    topics,
    topicsLoading,
    topicsError,
    lessons,
    lessonsLoading,
    lessonsError,
    selectedTopic,
    selectedLesson,
    oneLessonLoading,
    oneLessonError,
    // students,
    // studentsError,
    // studentsLoading,

    studentsLessonAssignLoading,
    studentsLessonAssignError,
    studentsLessonUnassignLoading,
    studentsLessonUnassignError,
    lessonDeleting,
    lessonDeleteError,
  } = state.Lessons;

  const { students, studentsError, studentsLoading } = state.Students;
  return {
    topics,
    topicsLoading,
    topicsError,
    lessons,
    lessonsLoading,
    lessonsError,
    selectedTopic,
    selectedLesson,
    oneLessonLoading,
    oneLessonError,

    students,
    studentsError,
    studentsLoading,

    studentsLessonAssignLoading,
    studentsLessonAssignError,
    studentsLessonUnassignLoading,
    studentsLessonUnassignError,
    lessonDeleting,
    lessonDeleteError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getTeacherTopicLessons,
    getTeacherTopics,
    selectTopic,
    selectLesson,
    getLesson,
    // getStudentsForLesson,
    assignLessonToStudents,
    unassignLessonToStudents,
    deleteLesson,
    getAllStudents,
  })(AppLessons)
);
