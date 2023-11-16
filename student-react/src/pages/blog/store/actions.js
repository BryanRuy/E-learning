import {
  GET_BLOG_LIST,
  GET_BLOG_LIST_SUCCESS,
  GET_BLOG_LIST_FAILURE,
  GET_BLOG,
  GET_BLOG_SUCCESS,
  GET_BLOG_FAILURE,
  COMMENT_ON_BLOG,
  COMMENT_ON_BLOG_SUCCESS,
  COMMENT_ON_BLOG_FAILURE,
  GET_BLOG_CATEGORIES,
  GET_BLOG_CATEGORIES_SUCCESS,
  GET_BLOG_CATEGORIES_FAILURE,
  GET_BLOG_COMMENTS,
  GET_BLOG_COMMENTS_SUCCESS,
  GET_BLOG_COMMENTS_FAILURE,

} from './actionTypes'


export const getBlogList = () => {
  return {
    type: GET_BLOG_LIST,
  }
}

export const getBlogListSuccess = (data) => {
  return {
    type: GET_BLOG_LIST_SUCCESS,
    payload: data
  }
}

export const getBlogListFailure = (data) => {
  return {
    type: GET_BLOG_LIST_FAILURE,
    payload: data
  }
}


export const getBlog = (id) => {
  return {
    type: GET_BLOG,
    payload: id
  }
}

export const getBlogSuccess = (data) => {
  return {
    type: GET_BLOG_SUCCESS,
    payload: data
  }
}

export const getBlogFailure = (data) => {
  return {
    type: GET_BLOG_FAILURE,
    payload: data
  }
}

export const commentOnBlog = ({ blogId, text }) => {
  return {
    type: COMMENT_ON_BLOG,
    payload: { blogId, text }
  }
}

export const commentOnBlogSuccess = (data) => {
  return {
    type: COMMENT_ON_BLOG_SUCCESS,
    payload: data
  }
}

export const commentOnBlogFailure = (error) => {
  return {
    type: COMMENT_ON_BLOG_FAILURE,
    payload: error
  }
}

export const getBlogCategories = () => {
  return {
    type: GET_BLOG_CATEGORIES,
  }
}

export const getBlogCategoriesSuccess = (data) => {
  return {
    type: GET_BLOG_CATEGORIES_SUCCESS,
    payload: data
  }
}

export const getBlogCategoriesFailure = (error) => {
  return {
    type: GET_BLOG_CATEGORIES_FAILURE,
    payload: error
  }
}

export const getBlogComments = (id) => {
  return {
    type: GET_BLOG_COMMENTS,
    payload: id
  }
}

export const getBlogCommentsSuccess = (data) => {
  return {
    type: GET_BLOG_COMMENTS_SUCCESS,
    payload: data
  }
}

export const getBlogCommentsFailure = (error) => {
  return {
    type: GET_BLOG_COMMENTS_FAILURE,
    payload: error
  }
}

