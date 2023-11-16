import React from "react";
import { Fragment, useState, useEffect } from "react";

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
  getBlogCategories,
  getBlogCategoriesSuccess,
  getBlogCategoriesFailure,
} from "../store/actions";

import Avatar from "@components/avatar";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardImg,
  Badge,
  Media,
} from "reactstrap";

import * as Icon from "react-feather";

import { InputGroup, InputGroupAddon, Input, InputGroupText } from "reactstrap";

import UILoader from "../../../@core/components/ui-loader";

import "@styles/base/pages/page-blog.scss";
import "../style.scss";

import moment from "moment";
import { GET_BLOG_IMAGE_URL, GET_IMAGE_URL } from "../../../helpers/url_helper";
import { getCategoryBadgeColor } from "../util";
import NotFound from "../../../components/not-found";
import NoNetwork from "../../../components/no-network";

const BlogList = (props) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    props.getBlogList();
    props.getBlogCategories();
  }, []);

  useEffect(() => {
    let cat = props.blogCategories.find((c) => "#" + c.name == query);
    cat ? setActiveCategory(cat.id) : setActiveCategory(null);
  }, [query]);

  const getFilteredBlogs = () => {
    if (!query) return props.blogList;
    let blogs = [];
    props.blogList.forEach((b) => {
      if (
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.categoryIds.find((c) => "#" + c.name == query)
      )
        blogs.push(b);
    });
    return blogs;
  };

  const renderRenderList = () => {
    let blogs = getFilteredBlogs();
    return blogs.length > 0 ? (
      blogs.map((item) => {
        return (
          <Col key={"blog-item" + item.id} md="6" lg="4">
            <Card>
              <Link to={`/blog/${item.id}`}>
                {item.mainImage && (
                  <CardImg
                    className="img-fluid"
                    src={GET_BLOG_IMAGE_URL(item.mainImage.formats.medium.url)}
                    alt={item.title}
                    top
                  />
                )}
              </Link>
              <CardBody>
                <CardTitle tag="h4">
                  <Link
                    className="blog-title-truncate text-body-heading"
                    to={`/blog/${item.id}`}
                  >
                    {item.title}
                  </Link>
                </CardTitle>
                <div className="my-1 py-25">
                  {item.categoryIds.map((category, index) => (
                    <span key={item.id + "category" + index}>
                      <Badge color={getCategoryBadgeColor(index)} pill>
                        {category.name}
                      </Badge>
                      &nbsp;
                    </span>
                  ))}
                </div>
                <CardText className="blog-content-truncate">
                  {item.description}
                </CardText>

                <Media>
                  <Avatar
                    className="mr-50"
                    img={GET_IMAGE_URL(
                      item.noNameUser ? item.noNameUser.profilePicture : null
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
                        {item.noNameUser ? item.noNameUser.name : ""}
                      </a>
                    </small>
                    <span className="text-muted ml-50 mr-25">|</span>
                    <small className="text-muted">
                      {moment(item.publishedDate).format("MMM DD, YYYY")}
                    </small>
                  </Media>
                </Media>
              </CardBody>
            </Card>
          </Col>
        );
      })
    ) : (
      <Col>
        <NotFound />
      </Col>
    );
  };

  const selectCategory = (id) => {
    setQuery("#" + props.blogCategories.find((c) => c.id == id).name);
    setActiveCategory(id);
  };

  const unSelectCategory = () => {
    setActiveCategory(null);
    setQuery("");
  };

  return (
    <Fragment>
      <div className="blog-wrapper">
        <Row>
          <Col lg="4">
            <InputGroup className="input-group-merge">
              <Input
                placeholder="Search here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  {!query && <Icon.Search size={14} />}
                  {query && (
                    <Icon.X size={14} onClick={() => unSelectCategory()} />
                  )}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="pt-2 blog-category-pills">
              {props.blogCategories.map((cat, index) => (
                <Badge
                  key={"cat-pill" + index}
                  color={cat.id == activeCategory ? "primary" : "success"}
                  pill
                  onClick={() => selectCategory(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </Col>
        </Row>

        <div className="content-detached mt-3">
          <div className="content-body">
            <UILoader blocking={props.blogListLoading}>
              <div className="blog-list-wrapper">
                {props.blogList.length > 0 && <Row>{renderRenderList()}</Row>}
                {props.blogList.length == 0 &&
                  !props.blogListLoading &&
                  !props.blogListError && (
                    <NotFound message={"No blog found"} />
                  )}
                {props.blogList.length == 0 &&
                  !props.blogListLoading &&
                  props.blogListError && <NoNetwork />}
                {/* <Row>
                      <Col sm='12'>
                        <Pagination className='d-flex justify-content-center mt-2'>
                          <PaginationItem className='prev-item'>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}></PaginationLink>
                          </PaginationItem>
                          <PaginationItem active>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              1
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              2
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              3
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem >
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              4
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              5
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              6
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}>
                              7
                            </PaginationLink>
                          </PaginationItem>
                          <PaginationItem className='next-item'>
                            <PaginationLink href='#' onClick={e => e.preventDefault()}></PaginationLink>
                          </PaginationItem>
                        </Pagination>
                      </Col>
                    </Row>
                     */}
              </div>
            </UILoader>
          </div>
        </div>
      </div>
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
    blogCategories,
  } = state.Blogs;
  return {
    blogList,
    blogListError,
    blogListLoading,
    selectedBlog,
    selectedBlogError,
    selectedBlogLoading,
    commentProcessing,
    blogCategories,
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
    getBlogCategories,
    getBlogCategoriesSuccess,
    getBlogCategoriesFailure,
  })(BlogList)
);
