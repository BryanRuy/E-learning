import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import notAuthImg from "@src/assets/images/pages/not-authorized.svg";
import { useSkin } from "@hooks/useSkin";
import "@styles/base/pages/page-misc.scss";
import BrandLogo from "../components/brand-logo";

const NotAuthorized = () => {
  const [skin, setSkin] = useSkin();

  const illustration =
      skin === "dark" ? "not-authorized-dark.svg" : "not-authorized.svg",
    source = require(`@src/assets/images/pages/${illustration}`);
  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <BrandLogo />
        <h2 className="brand-text text-primary ml-1">noName</h2>
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">You are not authorized! 🔐</h2>
          <p className="mb-2">
            Your session might have expired and you may need to login again.
          </p>
          <Button.Ripple
            tag={Link}
            to="/login"
            color="primary"
            className="btn-sm-block mb-1"
          >
            Back to login
          </Button.Ripple>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  );
};
export default NotAuthorized;
