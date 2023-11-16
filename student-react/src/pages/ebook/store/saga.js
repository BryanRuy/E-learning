import { call, put, takeEvery } from "redux-saga/effects"
import { GET_EBOOKS ,DOWNLOAD_EBOOK , BUY_EBOOK} from './actionTypes'
import  {getEbooksSuccess , getEbooksFailure,
            downloadEbookSuccess, downloadEbookFailure,
            buyEbookSuccess, buyEbookFailure} from './actions'

import { getEbooks ,downloadEbook , buyEbook} from '../../../helpers/backend-helpers'

function* getEbooksHttp(){
    try {
        const response = yield call(getEbooks);
        if (response) {
          yield put(getEbooksSuccess(response))
          return;
        }
        throw "Unknown response received from Server";
    
      } catch (error) {
        yield put(getEbooksFailure(error))
      }
}

function* downloadEbookHttp({payload:data}){
  try {
      const response = yield call(downloadEbook, data);
      if (response) {
        yield put(downloadEbookSuccess(response))
        return;
      }
      throw "Unknown response received from Server";
  
    } catch (error) {
      yield put(downloadEbookFailure(error))
    }
}

function* buyEbookHttp({payload:data}){
  try {
      const response = yield call(buyEbook, data.ebookId, data.token);
  
      if (response) {
        yield put(buyEbookSuccess(response))
        return;
      }
      throw "Unknown response received from Server";
  
    } catch (error) {
      yield put(buyEbookFailure(error))
    }
}


function* EbookSaga() {
    yield takeEvery(GET_EBOOKS, getEbooksHttp)
    yield takeEvery(DOWNLOAD_EBOOK, downloadEbookHttp)
    yield takeEvery(BUY_EBOOK, buyEbookHttp)
  }
  
  export default EbookSaga
  