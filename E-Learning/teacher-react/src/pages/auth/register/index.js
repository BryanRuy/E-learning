import React, { useEffect, useState } from "react";
import { useSkin } from "@hooks/useSkin";
import { Link, withRouter } from "react-router-dom";
import { registerAccount } from "./store/actions";
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
import InputPasswordToggle from "../../../@core/components/input-password-toggle";

import {
  notifyError,
  notifySuccess,
  notifyWarning,
} from "../../../utility/toast";
import GoogleSignIn from "../../../views/google-signin";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { GOOGLE_RECAPTCHA_KEY } from "../../../helpers/url_helper";

const Register = (props) => {
  const [skin, setSkin] = useSkin();
  const recaptchaRef = React.useRef();
  const { t } = useTranslation();
  const illustration =
      skin === "dark" ? "register-dark.svg" : "register-light.svg",
    source = require(`@src/assets/images/illustrations/${illustration}`);

  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (processing && !props.loading && props.error) {
      setProcessing(false);
      notifyError(t("Register Account"), props.error);
    } else if (processing && !props.loading && !props.error) {
      setProcessing(false);
      notifySuccess(
        t("Register Account"),
        t("Account registered successfully")
      );
    }
  }, [props.loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password != confirmPassword)
      return notifyWarning(
        t("Register Account"),
        t("Confirm password is not same")
      );
    setProcessing(true);
    // const token = recaptchaRef.current.getValue();
    props.registerAccount({
      data: {
        // reCaptchaToken: token,
        role: "teacher",
        name,
        email,
        password,
        confirmPassword,
      },
      history: props.history,
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
              {t("Register as teacher")}
            </CardTitle>
            <CardText className="mb-2">{t("Please fill up the form")}</CardText>
            <Form onSubmit={(e) => handleSubmit(e)}>
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
                    id="password"
                    name="password"
                    placeholder={t("Enter Password")}
                    className="input-group-merge"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <p>
                  By continuing you confirm that you have read and agree with
                  the{" "}
                  <a target="_blank" href="https://noName.ro/terms-of-services">
                    Terms of Services
                  </a>{" "}
                  and{" "}
                  <a target="_blank" href="https://noName.ro/privacy-policy">
                    Privacy Policy
                  </a>
                  .
                </p>
              </FormGroup>
              <Button.Ripple
                type="submit"
                color="primary"
                className="btn btn-block mt-2"
                disabled={props.loading || processing}
              >
                {props.loading && (
                  <>
                    <i className="las la-spinner la-spin"></i>&nbsp;&nbsp;
                  </>
                )}
                {t("Submit")}
              </Button.Ripple>
            </Form>
            <p className="text-center mt-2">
              <span className="mr-25">{t("Already have an account?")}</span>
              <Link to="/login">
                <span>{t("Login")}</span>
              </Link>
            </p>
            <div className="divider my-2">
              <div className="divider-text">or</div>
            </div>

            <div className="auth-footer-btn d-flex justify-content-center">
              <GoogleSignIn
                processing={processing}
                processingCallBack={() => setProcessing(!processing)}
              />
            </div>
            {/* <div className='d-flex justify-content-center mt-2' >
                            <ReCAPTCHA
                                theme={skin}
                                ref={recaptchaRef}
                                size="normal"
                                type = "image"
                                sitekey={GOOGLE_RECAPTCHA_KEY}
                            />
                        </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { error, loading } = state.Register;
  return {
    error,
    loading,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    registerAccount,
  })(Register)
);
