import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Media,
  Label,
  Row,
  Col,
  Input,
  FormGroup,
  Form,
  InputGroup,
  Card,
} from "reactstrap";

import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'
import InputPasswordToggle from '@components/input-password-toggle'
import { useForm } from 'react-hook-form'
import Select from "react-select";
import { selectThemeColors } from "@utils";
// ** Store & Actions
import { connect } from "react-redux";
import {
  getCounties,
  updateUserPassword,
  updateUserPasswordFailure,
  updateAdminProfile,
  updateStudentProfile,
  updateTeacherProfile,
  updateAdminProfilePicture,
  updateTeacherProfilePicture,
  updateStudentProfilePicture,
} from "@store/actions";

import { useTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { GET_IMAGE_URL } from "../../helpers/url_helper";
import { notifyError, notifyInfo, notifySuccess } from "../../utility/toast";
import UILoader from "../../@core/components/ui-loader";

const EditProfileUser = (props) => {


  const UpdatePasswordSchema = yup.object().shape({
    'newPassword': yup.string().min(1).required(),
    'confirmPassword': yup
      .string()
      .min(1)
      .required()
      .oneOf([yup.ref(`newPassword`), null], 'Passwords must match')
  })

  const { register, errors, handleSubmit, trigger } = useForm({
    resolver: yupResolver(UpdatePasswordSchema)
  })
console.log("STATE ==>",props.history.location.state );
  const { user, userType } = props.history.location.state;
  const [selectedUser, setSelectedUser] = useState(user);
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [storage, setStorage] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState(selectedUser.name || "");
  const [city, setCity] = useState(selectedUser.city || "");
  const [county, setCounty] = useState(selectedUser.county || "");
  const [country, setCountry] = useState("Romania");
  const [address, setAddress] = useState(selectedUser.address || "");
  const [about, setAbout] = useState(selectedUser.about || "");
  const [file, setFile] = useState(null);
  const [cities, setCities] = useState([]);

  let counties__ = props.countiesData.counties || [];
  const countiesOptions = counties__.map((x) => {
    return { value: x.id, label: x.name };
  });


  useEffect(() => {
    props.getCounties();
  }, []);

  useEffect(() => {
    if (county) {
      let defaultCounty = countiesOptions.find((e) => e.value == county);
      if (defaultCounty) {
        setCounty(defaultCounty.value);
      }
    }
  }, [props.countiesData]);

  useEffect(() => {
    if (cities && city) {
      let defaultCity = cities.find((e) => e.value == city);
      if (defaultCity) {
        setCity(defaultCity.value);
      }
    }
  }, [cities]);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name || "");
      setAbout(selectedUser.about || "");
      setCity(selectedUser.city || "");
      setCounty(selectedUser.county || "");
      setCountry(selectedUser.country || "");
      setAddress(selectedUser.address || "");
    }
  }, [selectedUser]);

  useEffect(() => {
    if (county) {
      let citiesDataList = props.countiesData.cities || {};
      let citiesList = citiesDataList[county] || [];
      let filteredCities = citiesList.map((x) => {
        return { label: x.name, value: x.name };
      });
      setCities(filteredCities);
    }
  }, [county, props.countiesData]);

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
    setFile(files[0]);
  };

  const publishPhoto = () => {
    let form = new FormData();
    form.append("file", file);

    if (userType == "Admin") {
      props.updateAdminProfilePicture(selectedUser.userId, form);
    } else if (userType == "Student") {
      props.updateTeacherProfilePicture(selectedUser.userId, form);
    } else if (userType == "Teacher") {
      props.updateStudentProfilePicture(selectedUser.userId, form);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && props.adminProfileSuccess) {
      setIsEditing(false);
      setSelectedUser(props.admin);
      notifySuccess(t("Update Profile"), t("Profile updated successfully"));
    }
  }, [props.adminProfileSuccess]);

  useEffect(() => {
    if (isEditing && props.adminProfileError) {
      notifyError(t("Update Profile"), props.adminProfileError);
    }
  }, [props.adminProfileError]);

  useEffect(() => {
    if (isEditing && props.studentProfileSuccess) {
      setIsEditing(false);
      setSelectedUser(props.student);
      notifySuccess(t("Update Profile"), t("Profile updated successfully"));
    }
  }, [props.studentProfileSuccess]);

  useEffect(() => {
    if (isEditing && props.studentProfileError) {
      notifyError(t("Update Profile"), props.studentProfileError);
    }
  }, [props.studentProfileError]);

  useEffect(() => {
    if (isEditing && props.teacherProfileSuccess) {
      setIsEditing(false);
      setSelectedUser(props.teacher);
      notifySuccess(t("Update Profile"), t("Profile updated successfully"));
    }
  }, [props.teacherProfileSuccess]);

  useEffect(() => {
    if (isEditing && props.teacherProfileError) {
      notifyError(t("Update Profile"), props.teacherProfileError);
    }
  }, [props.teacherProfileError]);

  useEffect(() => {
    if (file && props.adminProfilePictureSuccess) {
      setFile(null);
      setSelectedUser(props.admin);
      notifySuccess(
        t("Update Profile Picture"),
        t("Profile picture updated successfully")
      );
    }
  }, [props.adminProfilePictureSuccess]);

  useEffect(() => {
    if (file && props.adminProfilePictureError) {
      setFile(null);
      notifyError(t("Update Profile Picture"), props.adminProfilePictureError);
    }
  }, [props.adminProfilePictureError]);

  useEffect(() => {
    if (file && props.teacherProfilePictureSuccess) {
      setFile(null);
      setSelectedUser(props.teacher);
      notifySuccess(
        t("Update Profile Picture"),
        t("Profile picture updated successfully")
      );
    }
  }, [props.teacherProfilePictureSuccess]);

  useEffect(() => {
    if (file && props.teacherProfilePictureError) {
      setFile(null);
      notifyError(
        t("Update Profile Picture"),
        props.teacherProfilePictureError
      );
    }
  }, [props.teacherProfilePictureError]);

  useEffect(() => {
    if (file && props.studentProfilePictureSuccess) {
      setSelectedUser(props.student);
      setFile(null);
      notifySuccess(
        t("Update Profile Picture"),
        t("Profile picture updated successfully")
      );
    }
  }, [props.studentProfilePictureSuccess]);

  useEffect(() => {
    if (file && props.studentProfilePictureError) {
      setFile(null);
      notifyError(
        t("Update Profile Picture"),
        props.studentProfilePictureError
      );
    }
  }, [props.studentProfilePictureError]);

  useEffect(() => {
    if (props.userPasswordSuccess) {
      resetChangePassword()
      notifySuccess(t("Update Password"), t("Password updated successfully"))
    }
    return () => props.updateUserPasswordFailure(null)
  }, [props.userPasswordSuccess])

  useEffect(() => {
    if (props.userPasswordError) {
      notifyError(t("Update Password"), props.userPasswordError)
    }
    return () => props.updateUserPasswordFailure(null)
  }, [props.userPasswordError])

  useEffect(() => {
    if(userType == 'Student' && props.student) setSelectedUser(props.student)
    if(userType == 'Teacher' && props.teacher) setSelectedUser(props.teacher)
    if(userType == 'Admin' && props.admin) setSelectedUser(props.admin)

  }, [props.teacher, props.student, props.admin])

  
  const bytesToSize = (bytes, decimals = 2) => {
    let SIZES = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    for (var i = 0, r = bytes, b = 1024; r > b; i++) r /= b;
    return `${parseFloat(r.toFixed(decimals))} ${SIZES[i]}`;
}
  const updateBasicProfile = (e) => {
    e.preventDefault();
    let data = {
      userId: selectedUser.userId,
      role: selectedUser.role,
      name,
      about,
      city,
      county,
      country,
      address,
    };
    if (userType == "Admin") {
      props.updateAdminProfile(data);
    } else if (userType == "Student") {
      props.updateStudentProfile(data);
    } else if (userType == "Teacher") {
      props.updateTeacherProfile(data);
    }
  };

  const onUpdatePassword = () => {
    let newPassword = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    if (!newPassword || newPassword != confirmPassword) return;
    props.updateUserPassword({
      userId: user.userId,
      newPassword,
      confirmPassword,
    });
  };
  const onUpdateStorage = (e) => {
    e.preventDefault();
    console.log(userType);
    if(storage <= 0){
      notifyInfo("Update storage","Please enter storage in Mb's ")
      return
   }
    let data = {
      userId: selectedUser.userId,
      role: selectedUser.role,
      storage:storage
    };
    if (userType == "Admin") {
      props.updateAdminProfile(data);
    } else if (userType == "Student") {
      props.updateStudentProfile(data);
    } else if (userType == "Teacher") {
      props.updateTeacherProfile(data);
    }
  };

  const resetChangePassword = () => {
    document.getElementById("newPassword").value = ""
    document.getElementById("confirmPassword").value = ""
  }

  const resetImage = () => {
    setFile(null);
    setAvatar(selectedUser.profilePicture || "");
  };

  const countryOptions = [{ value: "Romania", label: "Romania" }];

  return (
    <UILoader blocking= { props.adminProfileLoading  || props.teacherProfileLoading ||
     props.studentProfileLoading || props.adminProfilePictureLoading ||
      props.teacherProfilePictureLoading || props.studentProfilePictureLoading || props.userPasswordLoading}>
    <Row>
      <Col sm="12" lg="6" md="6">
        <Card>
          <Fragment>
            <div className="m-2">
              <Media>
                <Media className="mr-25" left>
                  <Media
                    object
                    className="rounded mr-50"
                    src={
                      file ? avatar : GET_IMAGE_URL(selectedUser.profilePicture)
                    }
                    alt={t("No Profile Picture")}
                    height="80"
                    width="80"
                  />
                </Media>
                <Media className="mt-75 ml-1" body>
                  {file ? (
                    <>
                      <Button.Ripple
                        tag={Label}
                        className="mr-75"
                        size="sm"
                        color="primary"
                        onClick={() => publishPhoto()}
                      >
                        Publish
                      </Button.Ripple>
                      <Button.Ripple
                        color="secondary"
                        size="sm"
                        outline
                        onClick={() => resetImage()}
                      >
                        {t("Reset")}
                      </Button.Ripple>
                    </>
                  ) : (
                    <Button.Ripple
                      tag={Label}
                      className="mr-75"
                      size="sm"
                      color="primary"
                    >
                      {t("Upload")}
                      <Input
                        type="file"
                        onChange={onChange}
                        hidden
                        accept="image/*"
                      />
                    </Button.Ripple>
                  )}

                  <p>{t("Allowed JPG, GIF or PNG. Max size of 800kB")} </p>
                </Media>
              </Media>
              <form className="mt-2" onSubmit={(e) => updateBasicProfile(e)}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label className="ml-25">{t("Name")}</Label>
                      <InputGroup className="input-group-merge">
                        <Input
                          type="text"
                          placeholder={t("Enter Name")}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="ml-25">{t("Email")}</Label>
                      <InputGroup className="input-group-merge">
                        <Input
                          type="mail"
                          placeholder={t("Enter Email")}
                          value={selectedUser.email || ""}
                          disabled
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="ml-25">{t("Address")}</Label>
                      <InputGroup className="input-group-merge">
                        <Input
                          type="text"
                          placeholder={t("Enter Address")}
                          value={address || ""}
                          onChange={(e) => setAddress(e.target.value)}
                          disabled={!isEditing}
                          required
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="ml-25">{t("County")}</Label>
                      {isEditing && (
                        <Select
                          theme={selectThemeColors}
                          className="react-select"
                          classNamePrefix="select"
                          value={countiesOptions.find((e) => e.value == county)}
                          defaultValue={countiesOptions.find(
                            (e) => e.value == county
                          )}
                          options={countiesOptions}
                          isClearable={false}
                          disabled={!isEditing}
                          onChange={(e) => setCounty(e.value)}
                        />
                      )}
                      {!isEditing && (
                        <InputGroup className="input-group-merge">
                          <Input
                            type="text"
                            placeholder={t("Your county")}
                            value={county}
                            disabled={!isEditing}
                          />
                        </InputGroup>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label className="ml-25">{t("City")}</Label>
                      {isEditing && (
                        <Select
                          theme={selectThemeColors}
                          className="react-select"
                          classNamePrefix="select"
                          value={cities.find((e) => e.value == city)}
                          defaultValue={city}
                          options={cities}
                          isClearable={false}
                          disabled={!isEditing}
                          onChange={(e) => setCity(e.value)}
                        />
                      )}
                      {!isEditing && (
                        <InputGroup className="input-group-merge">
                          <Input
                            type="text"
                            placeholder={t("Your City")}
                            value={city}
                            disabled={!isEditing}
                          />
                        </InputGroup>
                      )}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <Label className="ml-25">{t("Country")}</Label>
                      {isEditing && (
                        <Select
                          theme={selectThemeColors}
                          className="react-select"
                          classNamePrefix="select"
                          defaultValue={countryOptions.find(
                            (e) => e.value == country
                          )}
                          options={countryOptions}
                          isClearable={false}
                          onChange={(e) => setCountry(e.value)}
                        />
                      )}
                      {!isEditing && (
                        <InputGroup className="input-group-merge">
                          <Input
                            type="text"
                            placeholder="Your country"
                            value={country}
                            disabled={!isEditing}
                          />
                        </InputGroup>
                      )}
                    </FormGroup>
                  </Col>
                  <Col sm="12">
                    <FormGroup>
                      <Input
                        type="textarea"
                        rows="4"
                        placeholder={t("About")}
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col className="mt-2" sm="12">
                    {isEditing && (
                      <>
                        <Button.Ripple
                          type="submit"
                          className="mr-1"
                          color="primary"
                        >
                          {t("Save changes")}
                        </Button.Ripple>
                        <Button.Ripple
                          type={"button"}
                          color="secondary"
                          outline
                          onClick={() => cancelEditing()}
                        >
                          {t("Cancel")}
                        </Button.Ripple>
                      </>
                    )}
                  </Col>
                </Row>
              </form>
              {!isEditing && (
                <Button.Ripple
                  type={"button"}
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  {t("Edit")}
                </Button.Ripple>
              )}
            </div>
          </Fragment>
        </Card>
      </Col>
      <Col sm="12" lg="4" md="6">
        <Card>
          <div className="m-2">
            <Form onSubmit={handleSubmit(onUpdatePassword)}>
              <Row>
                <Col >
                  <FormGroup>
                    <InputPasswordToggle
                      label="New Password"
                      htmlFor="newPassword"
                      name="newPassword"
                      innerRef={register({ required: true })}
                      className={classnames("input-group-merge", {
                        "is-invalid": errors["newPassword"],
                      })}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col >
                  <FormGroup>
                    <InputPasswordToggle
                      label="Retype New Password"
                      htmlFor="confirmPassword"
                      name="confirmPassword"
                      innerRef={register({ required: true })}
                      className={classnames("input-group-merge", {
                        "is-invalid": errors["confirmPassword"],
                      })}
                    />
                  </FormGroup>
                </Col>
                <Col className="mt-1" sm="12">
                  <Button.Ripple type="submit" className="mr-1" color="primary">
                    {t("Save changes")}
                  </Button.Ripple>
                  <Button.Ripple
                    color="secondary"
                    outline
                    onClick={() => resetChangePassword()}
                  >
                    {t("Cancel")}
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>

        <Card >
          <div className="m-2">
            <p>Current storage: {bytesToSize(selectedUser.storage)}</p>
            <Label className="ml-25">{t("Storage in Mbs")}</Label>

            <Input
              type="text"
              value={storage}
              placeholder={t("Enter storage")}
              onChange={(e) => setStorage(e.target.value)}
            />
            <Button.Ripple
            className="mt-2" sm="12"
                  type={"button"}
                  color="primary"
                  onClick={(e) => onUpdateStorage(e)}
                >
                  {t("Update storage")}
                </Button.Ripple>
          </div>
        </Card>
      </Col>


    </Row>
    </UILoader>
  );
};

const mapStateToProps = (state) => {
  const { countiesData, countiesLoading, countiesError } = state.Profile;
  const {
    admin,
    teacher,
    student,

    adminProfileLoading,
    adminProfileSuccess,
    adminProfileError,

    teacherProfileLoading,
    teacherProfileSuccess,
    teacherProfileError,

    studentProfileLoading,
    studentProfileSuccess,
    studentProfileError,

    adminProfilePictureLoading,
    adminProfilePictureSuccess,
    adminProfilePictureError,

    teacherProfilePictureLoading,
    teacherProfilePictureSuccess,
    teacherProfilePictureError,

    studentProfilePictureLoading,
    studentProfilePictureSuccess,
    studentProfilePictureError,

    userPasswordLoading,
    userPasswordSuccess,
    userPasswordError,
  } = state.UsersProfile;
  return {
    countiesData,
    countiesLoading,
    countiesError,

    admin,
    teacher,
    student,

    adminProfileLoading,
    adminProfileSuccess,
    adminProfileError,

    teacherProfileLoading,
    teacherProfileSuccess,
    teacherProfileError,

    studentProfileLoading,
    studentProfileSuccess,
    studentProfileError,

    adminProfilePictureLoading,
    adminProfilePictureSuccess,
    adminProfilePictureError,

    teacherProfilePictureLoading,
    teacherProfilePictureSuccess,
    teacherProfilePictureError,

    studentProfilePictureLoading,
    studentProfilePictureSuccess,
    studentProfilePictureError,

    userPasswordLoading,
    userPasswordSuccess,
    userPasswordError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getCounties,
    updateAdminProfile,
    updateStudentProfile,
    updateTeacherProfile,
    updateAdminProfilePicture,
    updateTeacherProfilePicture,
    updateStudentProfilePicture,
    updateUserPassword,
    updateUserPasswordFailure
  })(EditProfileUser)
);
