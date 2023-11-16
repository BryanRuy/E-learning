import React, { useEffect, useState } from "react";
import { useSkin } from "@hooks/useSkin";
import { Link, withRouter } from "react-router-dom";
import { forgotAccountPassword } from "./store/actions";
import {
  Row,
  Col,
  CardTitle,
  FormGroup,
  Label,
  Button,
  Form,
  InputGroup,
  Input,
  CardText,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";
import BrandLogo from "../../../components/brand-logo";
import { connect } from "react-redux";

import { useTranslation } from "react-i18next";
import { notifyError, notifySuccess } from "../../../utility/toast";

const ForgotPassword = (props) => {
  const [skin, setSkin] = useSkin();

  const { t } = useTranslation();
  const illustration =
      skin === "dark" ? "forgot-password-dark.svg" : "forgot-password.svg",
    source = require(`@src/assets/images/illustrations/${illustration}`);

  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (processing && !props.loading && props.error) {
      setProcessing(false);
      notifyError(t("Forgot Password"), props.error);
    } else if (processing && !props.loading && !props.error) {
      setProcessing(false);
      notifySuccess(t("Forgot Password"), t("Reset Link sent successfully"));
    }
  }, [props.loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    props.forgotAccountPassword({
      email,
    });
  };

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/">
          <BrandLogo />
          <h2 className="brand-text text-primary ml-1">noName</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Illustration" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              {t("Forgot Password?")}
            </CardTitle>
            <CardText className="mb-2">
              {t(
                `Enter your email and we'll send you instructions to reset your password`
              )}
            </CardText>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <FormGroup>
                <Label className="ml-25">{t("Email")}</Label>
                <InputGroup className="input-group-merge">
                  <Input
                    type="email"
                    placeholder={t("Enter email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <Button.Ripple
                type="submit"
                color="primary"
                className="btn btn-block mt-2"
                disabled={props.loading}
              >
                {props.loading && (
                  <>
                    <i className="las la-spinner la-spin"></i>&nbsp;&nbsp;
                  </>
                )}
                {t("Send Reset Link")}
              </Button.Ripple>
              <br />
              <Button.Ripple
                type="button"
                color="flat-primary"
                className="btn btn-block mt-2"
                disabled={props.loading}
                onClick={() => props.history.replace("/login")}
              >
                {t("Back to Login")}
              </Button.Ripple>
            </Form>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { error, loading } = state.ForgotPassword;
  return {
    error,
    loading,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    forgotAccountPassword,
  })(ForgotPassword)
);
