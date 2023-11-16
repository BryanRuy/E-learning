import React from "react";
// ** React Imports
import { Fragment, useState, useEffect } from "react";

import Select from "react-select";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { connect, useSelector } from "react-redux";
import {
  getUserDocuments,
  getUserDocumentsSuccess,
  getUserDocumentsFailure,
  selectUserDocumentsType,
  uploadUserDocument,
  addUserDocumentToQueue,
  cancelUserDocumentUpload,
  updateUserDocumentProgress,
  deleteUserDocument,
  deleteUserDocumentFailure,
  deleteUserDocumentSuccess,
} from "./store/actions";

import "@styles/base/pages/app-chat.scss";
import "@styles/base/pages/app-chat-list.scss";
import "./style.scss";

import { withRouter } from "react-router";

import DocumentTable from "./table";
import { Row, Col, Progress, UncontrolledTooltip } from "reactstrap";
import { Card, CardBody } from "reactstrap";

import {
  File,
  Code,
  Image,
  Film,
  Archive,
  FileText,
  Music,
  Layers,
} from "react-feather";
import { getShortNameForDocument } from "../../utility/Utils";

import UILoader from "../../@core/components/ui-loader";
import { getLoggedInUser } from "../../helpers/backend-helpers";

const AppDocuments = (props) => {
  // ** Store Vars
  const store = useSelector((state) => state.Documents);

  const [usedStorage, setUsedStorage] = useState(0);
  // ** Get data on Mount

  useEffect(() => {
    props.getUserDocuments();
  }, []);

  useEffect(() => {
    let user = getLoggedInUser() || {}
    let totalMemory = user.storage;
    let size = 0;
    for (let d of props.documents) {
      size += d.fileSize;
    }
    let totalSize = ((size / totalMemory) * 100).toFixed(2);
    setUsedStorage(totalSize);
  }, [props.documents]);

  const categoryTypes = [
    {
      label: "All Files",
      value: null,
      icon: <Layers size={16} />,
    },
    {
      label: "Document",
      value: "document",
      icon: <FileText size={16} />,
    },
    {
      label: "Images",
      value: "image",
      icon: <Image size={16} />,
    },
    {
      label: "Videos",
      value: "video",
      icon: <Film size={16} />,
    },
    {
      label: "Audio",
      value: "audio",
      icon: <Music size={16} />,
    },
    {
      label: "Source Code",
      value: "code",
      icon: <Code size={16} />,
    },
    {
      label: "Archive Files",
      value: "archive",
      icon: <Archive size={16} />,
    },
    {
      label: "Other Files",
      value: "file",
      icon: <File size={16} />,
    },
  ];

  return (
    <Fragment>
      <Card className="app-document-container">
        <CardBody>
          <UILoader blocking={props.documentLoading}>
            <Row>
              <Col lg="2" md="3" sm="12">
                {props.documents && (
                  <div>
                    <span>Storage used: {usedStorage}%</span>
                    <Progress value={usedStorage} />
                  </div>
                )}
                <div className="mt-3">
                  <h6 className="text-muted pl-1  mt-3 mb-2">Category</h6>
                  <Select
                    className="file-category-select d-sm-block d-md-none d-lg-none d-xl-none"
                    options={categoryTypes}
                    defaultValue={categoryTypes[0]}
                    value={categoryTypes.find(
                      (c) => c.value == props.selectedType
                    )}
                    onChange={(e) => props.selectUserDocumentsType(e.value)}
                  />
                  <ul className="list-documents d-none d-sm-none d-md-block d-lg-block d-xl-block">
                    {categoryTypes.map((c) => (
                      <li
                        key={"doc_category_" + c.label}
                        className={
                          props.selectedType == c.value ? "active" : ""
                        }
                        onClick={() => props.selectUserDocumentsType(c.value)}
                      >
                        {c.icon}
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col lg="10" md="9" sm="12">
                <DocumentTable store={props} />
              </Col>
              {props.documentUploads.length > 0 && (
                <div>
                  <div className="user-document-progress-container">
                    {props.documentUploads.map((d) => (
                      <div
                        className="file"
                        key={"selectedFiles_" + d.documentId}
                      >
                        <Progress
                          value={d.progress}
                          min={0}
                          max={100}
                          animated={true}
                        />
                        <div className="details">
                          <span id={`doc-name-${d.documentId}`}>
                            {getShortNameForDocument(d.name)}
                          </span>
                          <UncontrolledTooltip
                            placement="top"
                            target={`doc-name-${d.documentId}`}
                          >
                            {d.name}
                          </UncontrolledTooltip>
                          <button
                            onClick={() =>
                              props.cancelUserDocumentUpload({
                                documentId: d.documentId,
                              })
                            }
                          >
                            <i className="la la-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Row>
          </UILoader>
        </CardBody>
      </Card>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    documents,
    documentLoading,
    documentsError,
    selectedType,
    documentUploads,
  } = state.Documents;
  return {
    documents,
    documentLoading,
    documentsError,
    selectedType,
    documentUploads,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getUserDocuments,
    getUserDocumentsSuccess,
    getUserDocumentsFailure,
    selectUserDocumentsType,
    uploadUserDocument,
    addUserDocumentToQueue,
    cancelUserDocumentUpload,
    updateUserDocumentProgress,
    deleteUserDocument,
    deleteUserDocumentFailure,
    deleteUserDocumentSuccess,
  })(AppDocuments)
);
