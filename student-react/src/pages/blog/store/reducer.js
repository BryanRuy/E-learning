



import {

  GET_BLOG_LIST,
  GET_BLOG_LIST_SUCCESS,
  GET_BLOG_LIST_FAILURE,
  GET_BLOG,
  GET_BLOG_SUCCESS,
  GET_BLOG_FAILURE,
  COMMENT_ON_BLOG,
  COMMENT_ON_BLOG_FAILURE,
  COMMENT_ON_BLOG_SUCCESS,
  GET_BLOG_CATEGORIES,
  GET_BLOG_CATEGORIES_SUCCESS,
  GET_BLOG_CATEGORIES_FAILURE,
  GET_BLOG_COMMENTS,
  GET_BLOG_COMMENTS_SUCCESS,
  GET_BLOG_COMMENTS_FAILURE,

} from './actionTypes'

const initialState = {
  blogList: [],
  blogListError: null,
  blogListLoading: false,
  selectedBlog: {},
  selectedBlogError: null,
  selectedBlogLoading: false,
  commentProcessing: false,
  blogCategories: [],
  blogCategoriesLoading: false,
  blogCategoriesError: null,
  blogComments: [],
  blogCommentsLoading: false,
  blogCommentsError: null,

}



const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BLOG_LIST:
      return { ...state, blogListLoading: true }

    case GET_BLOG_LIST_SUCCESS:
      return { ...state, blogList: action.payload, blogListError: null, blogListLoading: false }

    case GET_BLOG_LIST_FAILURE:
      return { ...state, blogList: [], blogListError: action.payload, blogListLoading: false }

    case GET_BLOG:
      return { ...state, selectedBlogLoading: true }

    case GET_BLOG_SUCCESS:
      return { ...state, selectedBlog: action.payload, selectedBlogError: null, selectedBlogLoading: false }

    case GET_BLOG_FAILURE:
      return { ...state, selectedBlog: {}, selectedBlogError: action.payload, selectedBlogLoading: false }

    case COMMENT_ON_BLOG:
      return { ...state, commentProcessing: true }

    case COMMENT_ON_BLOG_SUCCESS:
      if (state.selectedBlog.id == action.payload.blogId)
        state.blogComments.push(action.payload)
      return { ...state, commentProcessing: false }

    case COMMENT_ON_BLOG_FAILURE:
      return { ...state, commentProcessing: false, commentError: action.payload }

    case GET_BLOG_CATEGORIES:
      return { ...state, blogCategoriesLoading: true }

    case GET_BLOG_CATEGORIES_SUCCESS:
      return { ...state, blogCategories: action.payload, blogCategoriesLoading: false }

    case GET_BLOG_CATEGORIES_FAILURE:
      return { ...state, blogCategories: [], blogCategoriesLoading: false, blogCategoriesError: action.payload }

    case GET_BLOG_COMMENTS:
      return { ...state, blogCommentsLoading: true, blogCommentsError: null, blogComments: [] }

    case GET_BLOG_COMMENTS_SUCCESS:
      return { ...state, blogComments: action.payload, blogCommentsLoading: false }

    case GET_BLOG_COMMENTS_FAILURE:
      return { ...state, blogComments: [], blogCommentsLoading: false, blogCommentsError: action.payload }

    default:
      return state
  }
}

export default blogReducer
