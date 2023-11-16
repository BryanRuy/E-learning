import React from "react";
import { CardBody, Label, Table } from "reactstrap";
import { DateTime } from "../../components/date-time";
import PropTypes from "prop-types";
import CardReload from "../../@core/components/card-reload";

import { Button } from "reactstrap";
import { Plus } from "react-feather";

import "../../assets/scss/custom/components/_card.scss";
import CustomPagination from "../pagination";
import { useTranslation } from "react-i18next";
const TestList = (props) => {
  const {
    count,
    limit,
    tests,
    isTeacher,
    fetchTests,
    isReloading,
    onPageChange,
  } = props;

  const { t } = useTranslation();
  const onSelectTests = (test) => {
    if (props.onSelect) {
      props.onSelect(test);
    }
  };

  const onNewTest = () => {
    if (props.onNewTest) {
      props.onNewTest();
    }
  };
  const onSelectPage = (page) => {
    if (onPageChange) onPageChange(page);
  };

  return (
    <CardReload
      className="p-0 test-list"
      title={t("Tests")}
      onReload={fetchTests}
      isReloading={isReloading}
    >
      {isTeacher && (
        <div className="text-right">
          <Button.Ripple
            className="btn-header"
            color="primary"
            onClick={onNewTest}
          >
            <Plus size={14} />
            <span className="align-middle ml-25">{t("Add Test")}</span>
          </Button.Ripple>
        </div>
      )}

      <CardBody>
        {tests && (
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("Title")}</th>
                <th>{t("Created At")}</th>
                <th>{t("Time Limit")}</th>
                <th>{t("Total Marks")}</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t, i) => (
                <tr key={t.testId} onClick={() => onSelectTests(t)}>
                  <td>{i + 1}</td>
                  <td>
                    <span className="align-middle font-weight-bold">
                      {t.title}
                    </span>
                  </td>
                  <td>
                    <DateTime dateTime={t.createdAt} type="dateTime" />
                  </td>
                  <td>{t.timeLimit / 60} mins</td>
                  <td>{t.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {count > 0 && (
          <CustomPagination
            pages={Math.ceil(count / limit)}
            onSelect={onSelectPage}
          />
        )}
      </CardBody>
    </CardReload>
  );
};

TestList.propTypes = {
  onSelect: PropTypes.func,
  tests: PropTypes.array.isRequired,
  onBack: PropTypes.func,
};

export default TestList;
