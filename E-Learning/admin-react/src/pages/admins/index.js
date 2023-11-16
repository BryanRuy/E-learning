import React, { useEffect, useState } from "react";
// ** React Imports
import { Fragment } from "react";

// ** Third Party Components
import {
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Input,
  Button,
  Table,
} from "reactstrap";

import { DateTime } from "../../components/date-time";
import { RefreshCcw } from "react-feather";
// ** Store & Actions
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getAdmins } from "./store/actions";

import UILoader from "../../@core/components/ui-loader";
import NotFound from "../../components/not-found";
import NoNetwork from "../../components/no-network";
import CustomPagination from "../pagination";
import { useTranslation } from "react-i18next";

const Admins = (props) => {
  const [searchValue, setSearchValue] = useState();
  const [dataList, setDataList] = useState([]);
  const [pagesCount, setPagesCount] = useState(0);

  const { adminsList, admins, adminsLoading, adminsError } = props;

  const { t } = useTranslation();
  useEffect(() => {
    fetchAdmins(1);
  }, []);

  const fetchAdmins = (page) => {
    let data = { page: page, limit: 20, search: searchValue };
    props.getAdmins(data);
  };

  const onSelectPage = (page) => {
    if (adminsList[page]) setDataList(adminsList[page]);
    else {
      fetchAdmins(page);
    }
  };

  const searchAdminByName = () => {
    fetchAdmins(1);
  };

  const viewOrEditUser = (user) => {
    props.history.push({
      pathname:`/edit-user-profile/${user.userId}`,
      state:{user , userType:"Admin"}
    })
  };

  useEffect(() => {
    if (admins && admins.data) setDataList(admins.data);
    if (admins && admins.count) setPagesCount(admins.count);
  }, [admins]);

  const addNewAdminAccount = () => {
    props.history.push('/register-admin')
  };

  return (
    <Fragment>
      <UILoader blocking={adminsLoading}>
        <Row className="mb-2">
          <Col className="float-right">
            <Button.Ripple
              outline
              color="primary"
              onClick={() => addNewAdminAccount()}
            >
              {t("Register Admin")}
            </Button.Ripple>
          </Col>
        </Row>
        <Card>
          <CardBody>
            <Row className="d-flex align-items-center">
              <Col sm="6">
                <h4 className="m-0">{t(`Admins`)}</h4>
              </Col>
            </Row>

            <Row className=" mx-0 mt-1 mb-50">
              <Col
                className=" d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
                sm="12" 
              >
                <Label className="mr-1" for="search-input">
                  {t("Search")}
                </Label>
                <Input
                  className="dataTable-filter"
                  type="text"
                  bsSize="sm"
                  id="search-input"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
                <Button.Ripple
                  className="btn-icon ml-1"
                  size="sm"
                  onClick={searchAdminByName}
                >
                  <RefreshCcw size={14} />
                </Button.Ripple>
              </Col>
            </Row>

            <div className="shadow-stats-item mt-3">
              {!adminsLoading && adminsError && (
                <NoNetwork message={adminsError} />
              )}

              {!adminsLoading && !adminsError && dataList.length == 0 && (
                <NotFound message={t("No admin found")} />
              )}

              {!adminsLoading && !adminsError && dataList.length > 0 && (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t("Name")}</th>
                      <th>{t("Email")}</th>
                      <th>{t("DATE/TIME")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataList.map((s, i) => (
                      <tr key={"admins-" + i}>
                        <td>{i + 1}</td>
                        <td>
                          <span className="align-middle font-weight-bold">
                            {s.name}
                          </span>
                        </td>
                        <td>{s.email}</td>
                        <td>
                          <DateTime dateTime={s.createdAt} type="dateTime" />
                        </td>
                        <td>
                          <Button
                            color="flat-primary"
                            onClick={() => viewOrEditUser(s)}
                          >
                            {t("View")}
                          </Button>
                        </td>
                        {/* <td>
                          <Button
                            color="flat-primary"
                            onClick={() => onSelect(s)}
                          >
                            {t("Assign")}
                          </Button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              { pagesCount > 0 && (
                <CustomPagination
                  pages={Math.ceil(pagesCount / 20)}
                  onSelect={onSelectPage}
                />
              )}
            </div>
          </CardBody>
        </Card>
      </UILoader>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const { adminsList, admins, adminsLoading, adminsError } = state.Admins;

  return {
    adminsList,
    admins,
    adminsLoading,
    adminsError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getAdmins,
  })(Admins)
);
