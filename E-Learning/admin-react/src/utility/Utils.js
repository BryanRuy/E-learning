

export let videoFiles = Object.freeze(["webm", "mpg", "mp2", "mpeg", "mpe", "mpv", "ogg",
  "mp4", , "m4p", 'm4v', 'avi', 'wmv', 'mov', 'qt', "flv", 'swf', 'avchd'])

export let imageFiles = Object.freeze(["jpg", "jpeg", "jpe", "jif", "jfif", "jfi",
  "png", "gif", "webp", "tiff", "tif", "bmp", "dib",
  "jp2", "j2k", "jpf", "jpx", "jpm", "mj2", "svg", "svgz"])

export let audioFiles = Object.freeze(["wav", "wave", "aiff", "aif", "aifc", "pcm", "au", "l16", "flac", "m4a", "caf",
  "wma", "wmv", "mp3", "ogg", "oga", "mogg", "aac", "3gp", "m4r"])

export let zipFiles = Object.freeze([
  "zip", "zipx", "tar", "gz", "z", "cab", "rar", "bz2", "lzh", "7z", "img", "iso", "xz", "vhd", "vmdk"
])

export let documentFiles = Object.freeze([
  "doc", "docx", "odt", "pdf", "xls", "xlsx", "ods", "ppt", "pptx", "txt", "csv", "tsv", "pages", "numbers",
])

export let codeFiles = Object.freeze(["html", "htm", "php", "aspx", "asp", "jsp",
  "js", "jsx", "ts", "json", "c", "cgi", "pl", "class", "cpp",
  "cs", "h", "java", "php", "py", "sh", "swift", "vb"])

/**
 * 
 * @param {string} ext 
 * @returns { 'video' | 'image' | 'audio' | 'archive' | 'code' | 'document'  | 'file'}
 */
export const getFileType = (ext) => {
  if (videoFiles.find(ex => ex == ext)) return 'video'
  if (imageFiles.find(ex => ex == ext)) return 'image'
  if (audioFiles.find(ex => ex == ext)) return 'audio'
  if (zipFiles.find(ex => ex == ext)) return 'archive'
  if (documentFiles.find(ex => ex == ext)) return 'document'
  if (codeFiles.find(ex => ex == ext)) return 'code'

  return 'file'
}



// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

// ** Ellipse the text ** //
export const getShortNameForDocument = (name) => {
  if (name.length < 30) return name
  return name.substring(0, 8) + "..." + name.substring(name.length - 8);
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const titleCase = text => {
  return text.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}
