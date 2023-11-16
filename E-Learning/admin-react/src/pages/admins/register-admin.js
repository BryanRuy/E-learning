import React, { useEffect, useState } from "react";
import { useSkin } from "@hooks/useSkin";
import { Link, withRouter } from "react-router-dom";
import { registerAdmin } from "./store/actions";
import {
  Row,
  Col,
  Card,
  FormGroup,
  Label,
  Button,
  Form,
  InputGroup,
  Input,
  CardText,
  CardBody,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import BrandLogo from "../../components/brand-logo";
import { connect } from "react-redux";
// import InputPasswordToggle from '../../../@core/components/input-password-toggle';
import InputPasswordToggle from "../../@core/components/input-password-toggle";

import { notifyError, notifySuccess, notifyWarning } from "../../utility/toast";
import { useTranslation } from "react-i18next";

const RegisterAdmin = (props) => {
  const [skin, setSkin] = useSkin();
  const { t } = useTranslation();
  const illustration =
      skin === "dark" ? "register-dark.svg" : "register-light.svg",
    source = require(`@src/assets/images/illustrations/${illustration}`);

  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

//   useEffect(() => {
//     if (processing && !props.registerAdminLoading && props.registerAdminError) {
//       setProcessing(false);
//       notifyError(t("Register Account"), props.registerAdminError);
//     } else if (
//       processing &&
//       !props.registerAdminLoading &&
//       !props.registerAdminError
//     ) {
//       setProcessing(false);
//       notifySuccess(
//         t("Register Account"),
//         t("Account registered successfully")
//       );
//     }
//   }, [props.registerAdminLoading]);


  useEffect(() => {
      if(props.registerAdminError){
        setProcessing(false);
        notifyError(t("Register Account"), props.registerAdminError);
      }
  }, [props.registerAdminError])

  useEffect(() => {
    if(props.registerAdminSuccess){
      setProcessing(false);
      notifySuccess(
        t("Register Account"),
        t("Account registered successfully")
      );
    }
}, [props.registerAdminSuccess])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password != confirmPassword)
      return notifyWarning(
        t("Register Account"),
        t("Confirm password is not same")
      );
    setProcessing(true);
    let data = {
        role: "admin",
        name,
        email,
        password,
        confirmPassword,
      }
    props.registerAdmin(data);
  };

  return (
    <Col lg="4" md="6" sm="12">
      <Card>
        <Form className="m-2" onSubmit={(e) => handleSubmit(e)}>
          <FormGroup>
            <Label className="ml-25">{t("Name")}</Label>
            <InputGroup className="input-group-merge">
              <Input
                type="text"
                placeholder={t("Enter Name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="ml-25">{t("Email")}</Label>
            <InputGroup className="input-group-merge">
              <Input
                type="mail"
                placeholder={t("Enter Email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label className="ml-25">{t("Password")}</Label>
            <InputPasswordToggle
              value={password}
              id="password"
              name="password"
              placeholder={t("Enter Password")}
              className="input-group-merge"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-merge">
              <Label className="ml-25">{t("Confirm Password")}</Label>
              <InputPasswordToggle
                value={confirmPassword}
                id="confirmpassword"
                name="password"
                placeholder={t("Enter Password")}
                className="input-group-merge"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </InputGroup>
          </FormGroup>
          <Button.Ripple
            type="submit"
            color="primary"
            className="btn btn-block mt-2"
            disabled={props.registerAdminLoading || processing}
          >
            {props.registerAdminLoading && (
              <>
                <i className="las la-spinner la-spin"></i>&nbsp;&nbsp;
              </>
            )}
            {t("Submit")}
          </Button.Ripple>
        </Form>
      </Card>
    </Col>
  );
};

const mapStateToProps = (state) => {
  const { registerAdminSuccess, registerAdminLoading, registerAdminError } =
    state.Admins;
  return {
    registerAdminSuccess,
    registerAdminLoading,
    registerAdminError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    registerAdmin,
  })(RegisterAdmin)
);
