import React from "react";
import { Fragment, useState, useEffect } from "react";
import Avatar from "@components/avatar";

import { withRouter } from "react-router";

// ** Store & Actions
import { connect } from "react-redux";
import {
  getBlogList,
  getBlogListSuccess,
  getBlogListFailure,
  getBlog,
  getBlogSuccess,
  getBlogFailure,
  commentOnBlog,
  commentOnBlogSuccess,
  commentOnBlogFailure,
  getBlogComments,
} from "../store/actions";

import UILoader from "../../../@core/components/ui-loader";

import { useParams } from "react-router-dom";

import {
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Media,
  Form,
  Input,
  Button,
  FormGroup,
} from "reactstrap";

import "@styles/base/pages/page-blog.scss";
import "../style.scss";

import {
  GET_BLOG_IMAGE_URL,
  GET_IMAGE_URL,
  BLOG_API_URL,
} from "../../../helpers/url_helper";
import moment from "moment";

import ReactMarkdown from "react-markdown";
import { render } from "react-dom";
import { getCategoryBadgeColor } from "../util";

const BlogDetails = (props) => {
  let { id } = useParams();
  const { selectedBlog } = props;

  const [comment, setComment] = useState("");

  useEffect(() => {
    props.getBlog(id);
    props.getBlogComments(id);
  }, []);

  useEffect(() => {
    if (selectedBlog.id) {
      let uploadPath = `${BLOG_API_URL}/uploads/`;
      let markdown = String(selectedBlog.content).replaceAll(
        "/uploads/",
        uploadPath
      );

      render(
        <ReactMarkdown>{markdown}</ReactMarkdown>,
        document.getElementById("blog-content-container")
      );
    }
  }, [selectedBlog]);

  const renderComments = () => {
    return props.blogComments.map((comment, index) => (
      <Media className="mb-2" key={"comment" + index}>
        <Avatar
          className="mr-75"
          img={GET_IMAGE_URL(comment.noNameUser.profilePicture)}
          width="38"
          height="38"
        />
        <Media body>
          <h6 className="font-weight-bolder mb-25">
            {comment.noNameUser.name}
          </h6>
          <div className="pb-0 mb-0 text-muted">
            {moment(comment.created_at).format("MMM DD,YYYY hh:mm a")}
          </div>
          <div>{comment.text}</div>
        </Media>
      </Media>
    ));
  };

  const postComment = (e) => {
    e.preventDefault();
    props.commentOnBlog({ blogId: props.selectedBlog.id, text: comment });
    setComment("");
  };

  return (
    <Fragment>
      <UILoader blocking={props.selectedBlogLoading}>
        <div className="blog-wrapper">
          <div className="content-detached">
            <div className="content-body">
              {Object.keys(selectedBlog).length > 0 && (
                <Row>
                  <Col sm="12">
                    <Card className="mb-3">
                      <div
                        className="blog-detail-banner-container"
                        style={{
                          backgroundImage: `url(${GET_BLOG_IMAGE_URL(
                            selectedBlog.mainImage.formats.large
                              ? selectedBlog.mainImage.formats.large.url
                              : selectedBlog.mainImage.formats.medium.url
                          )})`,
                        }}
                      >
                        <span className="pl-3 pr-3 pb-1">
                          {selectedBlog.title}
                        </span>
                        <div className="blog-banner-gradient"></div>
                      </div>
                      <CardBody className="p-3">
                        <Media className="mb-2">
                          <Avatar
                            className="mr-50"
                            img={GET_IMAGE_URL(
                              selectedBlog.noNameUser.profilePicture
                            )}
                            imgHeight="24"
                            imgWidth="24"
                          />
                          <Media body>
                            <small className="text-muted mr-25">by</small>
                            <small>
                              <a
                                className="text-body"
                                href="/"
                                onClick={(e) => e.preventDefault()}
                              >
                                {selectedBlog.noNameUser.name}
                              </a>
                            </small>
                            <span className="text-muted ml-50 mr-25">|</span>
                            <small className="text-muted">
                              {moment(selectedBlog.publishedDate).format(
                                "MMM DD, YYYY"
                              )}
                            </small>
                          </Media>
                        </Media>
                        <div className="my-1 py-25">
                          {selectedBlog.categoryIds.map((category, index) => (
                            <span
                              key={
                                selectedBlog.id + "category_selected" + index
                              }
                            >
                              <Badge color={getCategoryBadgeColor(index)} pill>
                                {category.name}
                              </Badge>
                              &nbsp;
                            </span>
                          ))}
                        </div>
                        <div id="blog-content-container"></div>
                      </CardBody>
                    </Card>
                  </Col>
                  {props.blogComments.length > 0 && (
                    <Col sm="12">
                      <h6 className="section-label">Comment</h6>
                      <Card>
                        <CardBody>{renderComments()}</CardBody>
                      </Card>
                    </Col>
                  )}
                  <Col sm="12">
                    <h6 className="section-label">Leave a Comment</h6>
                    <Card>
                      <CardBody>
                        <Form className="form" onSubmit={(e) => postComment(e)}>
                          <Row>
                            <Col sm="12">
                              <FormGroup className="mb-2">
                                <Input
                                  className="mb-2"
                                  type="textarea"
                                  rows="4"
                                  placeholder="Comment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="12">
                              <Button.Ripple type="submit" color="primary">
                                Post Comment
                              </Button.Ripple>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </div>
      </UILoader>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  const {
    blogList,
    blogListError,
    blogListLoading,
    selectedBlog,
    selectedBlogError,
    selectedBlogLoading,
    commentProcessing,
    blogComments,
    blogCommentsLoading,
    blogCommentsError,
  } = state.Blogs;
  return {
    blogList,
    blogListError,
    blogListLoading,
    selectedBlog,
    selectedBlogError,
    selectedBlogLoading,
    commentProcessing,
    blogComments,
    blogCommentsLoading,
    blogCommentsError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getBlogList,
    getBlogListSuccess,
    getBlogListFailure,
    getBlog,
    getBlogSuccess,
    getBlogFailure,
    commentOnBlog,
    commentOnBlogSuccess,
    commentOnBlogFailure,
    getBlogComments,
  })(BlogDetails)
);
