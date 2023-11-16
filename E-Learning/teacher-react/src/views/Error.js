import React from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import "@styles/base/pages/page-misc.scss";
import BrandLogo from "../components/brand-logo";

const Error = () => {
  const [skin, setSkin] = useSkin();

  const illustration = skin === "dark" ? "error-dark.svg" : "error.svg";
  const source = require(`@src/assets/images/pages/${illustration}`);

  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <BrandLogo />
        <h2 className="brand-text text-primary ml-1">noName</h2>
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Are You... Lost??? 🙀</h2>
          <p className="mb-2">
            Oops! The requested URL was not found on this server.
          </p>
          <h2>
            <Button.Ripple
              tag={Link}
              to="/"
              color="primary"
              className="btn-sm-block mb-2"
            >
              Back to home
            </Button.Ripple>
          </h2>
          <img
            className="img-fluid"
            src={source}
            alt="Not Found Illustration"
          />
        </div>
      </div>
    </div>
  );
};
export default Error;
