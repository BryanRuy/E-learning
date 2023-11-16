import React, { useEffect, useState } from "react";
// ** React Imports
import { Fragment } from "react";

// ** Third Party Components
import {
  Card,
  CardBody,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Row,
  Col,
  Button,
  Media,
  Badge,
} from "reactstrap";

// ** Store & Actions
import { connect } from "react-redux";

import { withRouter } from "react-router";
import {
  getUserData,
  getAdminMeeting,
  newAdminMeeting,
  updateAdminMeeting,
  getStartedContent,
} from "../../store/actions";

import UILoader from "../../@core/components/ui-loader";
import { DateTime } from "../../components/date-time";
import { X, Calendar } from "react-feather";

import { MeetingActions, getMeetingStatusColor } from "../meetings/util";
import { getLoggedInUser } from "../../helpers/backend-helpers";

import UpcomingMeeting from "../meetings/UpcomingMeeting";
import TimePicker from "@components/datepicker/TimePicker";
import DatePicker from "@components/datepicker/DatePicker";
import Avatar from "@components/avatar";
import { GET_IMAGE_URL, BLOG_API_URL } from "./../../helpers/url_helper";
import { notifyError, notifySuccess } from "../../utility/toast";

import ReactMarkdown from "react-markdown";
import { render } from "react-dom";

import moment from "moment";
import { titleCase } from "@utils";

import NotFound from "../../components/not-found";

const GetStartedPage = (props) => {
  const contentRef = React.createRef();
  const { content } = props;

  const [user, setUser] = useState({});
  const [isNewMeeting, setIsNewMeeting] = useState(false);
  const [isUpdateMeeting, setIsUpdateMeeting] = useState(false);
  const [meetingAction, setMeetingAction] = useState("Updated");

  const [agenda, setAgenda] = useState("");
  const [message, setMessage] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState(
    new Date("1970-01-01 10:00:00")
  );

  useEffect(() => {
    setUser(getLoggedInUser());
    props.getUserData();
    props.getStartedContent();
  }, []);

  useEffect(() => {
    if (isUpdateMeeting) {
      setMeetingDate(props.meeting.scheduledAt);
      setMeetingTime(props.meeting.scheduledAt);
    }
  }, [isUpdateMeeting]);

  const closeMeeting = () => {
    setAgenda("");
    setMessage("");
    setMeetingDate(new Date());
    setMeetingTime(new Date("1970-01-01 10:00:00"));
    setIsNewMeeting(false);
    setIsUpdateMeeting(false);
  };

  const onMeetingAction = (e, id, action, data = {}) => {
    e.preventDefault();
    setMeetingAction(action);
    setIsUpdateMeeting(true);
    props.updateAdminMeeting({ id, action, data });
  };

  const requestMeeting = (e) => {
    e.preventDefault();
    setIsNewMeeting(true);
    let date = moment(meetingDate);
    let time = moment(meetingTime);
    date.set("hour", time.get("hour")).set("minute", time.get("minute"));
    props.newAdminMeeting({
      scheduledAt: date,
      agenda,
      message,
    });
  };

  const rescheduleMeeting = (e) => {
    let date = moment(meetingDate);
    let time = moment(meetingTime);
    date.set("hour", time.get("hour")).set("minute", time.get("minute"));
    onMeetingAction(e, props.meeting.meetingId, MeetingActions.Reschedule, {
      message,
      scheduledAt: date,
    });
  };

  useEffect(() => {
    if (isNewMeeting && !props.newMeetingLoading && !props.newMeetingError) {
      closeMeeting();
      notifySuccess("New Meeting", "Meeting scheduled successfully");
    } else if (
      isNewMeeting &&
      !props.newMeetingLoading &&
      props.newMeetingError
    ) {
      notifyError("New Meeting", props.newMeetingError);
    }
  }, [props.newMeetingLoading]);

  useEffect(() => {
    if (
      isUpdateMeeting &&
      !props.updateMeetingLoading &&
      !props.updateMeetingError
    ) {
      closeMeeting();
      notifySuccess("Update Meeting", `Meeting ${meetingAction} successfully`);
    } else if (
      isUpdateMeeting &&
      !props.updateMeetingLoading &&
      props.updateMeetingError
    ) {
      notifyError("Update Meeting", props.updateMeetingError);
    }
  }, [props.updateMeetingLoading]);

  const meetingComponent = () => {
    return (
      <div className="mt-4 mb-4 d-flex align-items-center justify-content-center">
        {(props.meetingError ||
          props.meeting.status == "cancelled" ||
          props.meeting.status == "rejected") && (
          <Col lg="8">
            <div>
              <h3 className="mb-2">Schedule a meeting with us!</h3>
              <Form className="mt-1 mb-2" onSubmit={(e) => requestMeeting(e)}>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <Label className="ml-25">Agenda</Label>
                      <InputGroup className="input-group-merge">
                        <Input
                          type="text"
                          placeholder="Meeting Agenda"
                          value={agenda}
                          onChange={(e) => setAgenda(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="12" lg="6">
                    <DatePicker value={meetingDate} onChange={setMeetingDate} />
                  </Col>
                  <Col md="12" lg="6">
                    <TimePicker value={meetingTime} onChange={setMeetingTime} />
                  </Col>
                  <Col lg="12">
                    <FormGroup>
                      <Label className="ml-25">Personal Message</Label>
                      <InputGroup className="input-group-merge">
                        <Input
                          type="textarea"
                          rows="4"
                          placeholder="Send a personal message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <Button.Ripple type="submit" color="primary">
                  Request Meeting
                </Button.Ripple>
              </Form>
            </div>
          </Col>
        )}
        {!props.meetingError && props.meeting.status == "accepted" && (
          <Col lg="8">
            <UpcomingMeeting meeting={props.meeting} />
          </Col>
        )}
        {Object.keys(props.meeting).length > 0 &&
          props.meeting.status != "cancelled" &&
          props.meeting.status != "rejected" &&
          props.meeting.status != "accepted" && (
            <Col lg="6" className="mb-3">
              <h3 className=" mb-2">Meeting Details</h3>
              <Row>
                <Col sm={12} md={2} className="mt-1">
                  <div className="text-center">
                    <Avatar
                      className="box-shadow-1 avatar-border"
                      img={GET_IMAGE_URL(
                        props.meeting.participants.find(
                          (u) => u.user.userId != user.userId
                        ).user.profilePicture
                      )}
                      size="lg"
                    />
                  </div>
                </Col>
                <Col sm={12} md={5} className="mt-1">
                  <h5>
                    {
                      props.meeting.participants.find(
                        (u) => u.user.userId != user.userId
                      ).user.name
                    }
                  </h5>
                  <div className="mt-25">
                    <Badge
                      pill
                      color={getMeetingStatusColor(props.meeting.status)}
                      className="mr-1"
                    >
                      {titleCase(props.meeting.status)}
                    </Badge>
                  </div>
                </Col>
                <Col sm={12} md={5} className="mt-1">
                  <Media>
                    <Avatar
                      color="light-primary"
                      className="rounded mr-1"
                      icon={<Calendar size={18} />}
                    />
                    <Media body>
                      <h6 className="mb-0">
                        <DateTime
                          dateTime={props.meeting.scheduledAt}
                          format="ddd DD MMM, YYYY"
                        />
                      </h6>
                      <small>
                        <DateTime
                          dateTime={props.meeting.scheduledAt}
                          type="time"
                        />
                      </small>
                    </Media>
                  </Media>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={12} md={2}>
                  <h6>Agenda</h6>
                </Col>
                <Col sm={12} md={10}>
                  {props.meeting.agenda}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={12} md={2}>
                  <h6>Personal Message</h6>
                </Col>
                <Col sm={12} md={10}>
                  {props.meeting.message}
                </Col>
              </Row>
              <div className="mt-1 text-right">
                {(props.meeting.status == "pending" ||
                  props.meeting.status == "rescheduled") && (
                  <UncontrolledButtonDropdown>
                    <DropdownToggle outline color="primary" caret>
                      Actions
                    </DropdownToggle>
                    <DropdownMenu>
                      {props.meeting.status == "pending" &&
                        props.meeting.user.userId != user.userId && (
                          <>
                            <DropdownItem
                              href="/"
                              tag="a"
                              onClick={(e) =>
                                onMeetingAction(
                                  e,
                                  props.meeting.meetingId,
                                  MeetingActions.Reject
                                )
                              }
                            >
                              Reject
                            </DropdownItem>
                            <DropdownItem
                              href="/"
                              tag="a"
                              onClick={(e) => {
                                e.preventDefault();
                                rescheduleMeeting();
                              }}
                            >
                              Reschedule
                            </DropdownItem>
                          </>
                        )}
                      {(props.meeting.status == "rescheduled" ||
                        (props.meeting.status == "pending" &&
                          props.meeting.user.userId == user.userId)) && (
                        <DropdownItem
                          href="/"
                          tag="a"
                          onClick={(e) =>
                            onMeetingAction(
                              e,
                              props.meeting.meetingId,
                              MeetingActions.Cancel
                            )
                          }
                        >
                          Cancel
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                )}
                {((props.meeting.status == "pending" &&
                  props.meeting.user.userId != user.userId) ||
                  (props.meeting.status == "rescheduled" &&
                    props.meeting.user.userId == user.userId)) && (
                  <Button.Ripple
                    type="button"
                    color="primary"
                    className="ml-2"
                    onClick={(e) =>
                      onMeetingAction(
                        e,
                        props.meeting.meetingId,
                        MeetingActions.Accept
                      )
                    }
                  >
                    Accept
                  </Button.Ripple>
                )}
              </div>
            </Col>
          )}
      </div>
    );
  };

  const updateMeetingModel = () => {
    return Object.keys(props.meeting).length > 0 ? (
      <Modal isOpen={isUpdateMeeting} className="pt-5">
        <UILoader blocking={props.updateMeetingLoading}>
          <ModalBody className="p-2">
            <div className="close-icon">
              <X size={16} onClick={() => closeMeeting()} />
            </div>
            <h3 className="mb-2">Reschedule Meeting</h3>
            <div className="text-center">
              <Avatar
                className="box-shadow-1 avatar-border"
                img={GET_IMAGE_URL(
                  props.meeting.participants.find(
                    (u) => u.user.userId != user.userId
                  ).user.profilePicture
                )}
                size="xl"
              />
              <h5 className="mt-25 pt-1">
                {
                  props.meeting.participants.find(
                    (u) => u.user.userId != user.userId
                  ).user.name
                }
              </h5>
            </div>
            <Form className="mt-1 mb-2" onSubmit={(e) => rescheduleMeeting(e)}>
              <Row>
                <Col lg="12">
                  <FormGroup>
                    <DatePicker value={meetingDate} onChange={setMeetingDate} />
                  </FormGroup>
                </Col>
                <Col lg="12">
                  <FormGroup>
                    <TimePicker value={meetingTime} onChange={setMeetingTime} />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label className="ml-25">Personal Message</Label>
                <InputGroup className="input-group-merge">
                  <Input
                    type="textarea"
                    rows="4"
                    placeholder="Send a personal message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-right">
                <Button.Ripple
                  className="mr-1"
                  color="primary"
                  outline
                  onClick={() => closeMeeting()}
                >
                  Cancel
                </Button.Ripple>
                <Button.Ripple type="submit" color="primary">
                  Submit
                </Button.Ripple>
              </div>
            </Form>
          </ModalBody>
        </UILoader>
      </Modal>
    ) : null;
  };

  const renderContent = (contentData) => {
    // console.log(contentData);
    if (contentData) {
      let uploadPath = `${BLOG_API_URL}/uploads/`;
      let markdown = String(contentData).replaceAll("/uploads/", uploadPath);
      let fun = () => {
        if (contentRef.current) {
          render(<ReactMarkdown>{markdown}</ReactMarkdown>, contentRef.current);
        } else {
          setTimeout(fun, 100);
        }
      };
      setTimeout(fun, 200);
    }
  };

  return (
    <Fragment>
      <UILoader
        blocking={
          props.meetingLoading ||
          props.updateMeetingLoading ||
          props.contentLoading
        }
      >
        <Card>
          <CardBody>
            {!props.contentLoading && props.contentError && (
              <NotFound message={props.contentError} />
            )}
            {
              content && content.content && (
                <ReactMarkdown>{content.content}</ReactMarkdown>
              )
              //  renderContent()
            }
            {/* {
                            meetingComponent()
                        } */}
          </CardBody>
        </Card>
      </UILoader>
      {/* {
                updateMeetingModel()
            } */}
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    meeting,
    meetingLoading,
    meetingError,

    newMeetingLoading,
    newMeetingError,

    updateMeetingLoading,
    updateMeetingError,

    content,
    contentLoading,
    contentError,
  } = state.GetStarted;

  return {
    meeting,
    meetingLoading,
    meetingError,
    newMeetingLoading,
    newMeetingError,
    updateMeetingLoading,
    updateMeetingError,
    content,
    contentLoading,
    contentError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getUserData,
    getAdminMeeting,
    newAdminMeeting,
    updateAdminMeeting,
    getStartedContent,
  })(GetStartedPage)
);
