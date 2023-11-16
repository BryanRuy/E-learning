import axios from 'axios';
import authHeader from './jwt-token-access/auth-token-header';
import { BASE_URL } from './url_helper';


//apply base url for axios
const API_URL = BASE_URL;

const axiosApi = axios.create({
	baseURL: API_URL,
});

const DEBUG = false;

function logoutUser() {
// 	localStorage.removeItem('authUser');
// 	localStorage.removeItem('authToken');
	localStorage.removeItem('authTeacher');
	localStorage.removeItem('authTeacherToken');
	localStorage.removeItem('adminUser');
	window.location.href = '/';
}

axiosApi.defaults.headers.common['Authorization'] = authHeader()['Authorization'];

axiosApi.interceptors.response.use(
	(response) => {
		if(response.config.responseType === 'blob')
		return response;
		
		DEBUG && console.log('HTTP_RESPONSE', response);

		if (response.data.status) {
			let data = response.data;
			if (data.status === 401) {
				logoutUser();
			}
			if (data.status !== 200 || data.status !== 201) {
				if (data.message) {
					return Promise.reject(data.message);
				}
			}
		}

		return response.data;
	},
	(error) => {
		DEBUG && console.log('HTTP_ERROR', error);

		if (error.response) {
			// Request made and server responded
			console.log(error.response.data);
			console.log(error.response.status);
			console.log(error.response.headers);
		} else if (error.request) {
			// The request was made but no response was received
			console.log(error.request);
		} else {
			// Something happened in setting up the request that triggered an Error
			console.log('Error', error.message);
		}

		return Promise.reject(error);
	}
);

export function resetAPIAuthToken() {
	axiosApi.defaults.headers.common['Authorization'] = authHeader()['Authorization'];
	// console.log(authHeader()['Authorization']);
}

export async function get(url, config = {}) {
	resetAPIAuthToken();
	return await axiosApi
		.get(url, { ...config })
		.then((response) => response.data);
}

export async function post(url, data, config = {}) {
	resetAPIAuthToken();
	return await axiosApi
		.post(url, { ...data }, { ...config })
		.then((response) => response.data);
}

export async function postForm(url, data, config = {}) {
	return await axiosApi
		.post(url, data, { 'Content-Type': 'multipart/form-data' })
		.then((response) => response.data);
}

export async function putForm(url, data, config = {}) {
	return await axiosApi
		.put(url, data, { 'Content-Type': 'multipart/form-data' })
		.then((response) => response.data);
}

export async function put(url, data, config = {}) {
	resetAPIAuthToken();
	return axiosApi
		.put(url, { ...data }, { ...config })
		.then((response) => response.data);
}

export async function del(url, data, config = {}) {
	resetAPIAuthToken();
	return await axiosApi
		.delete(url, { ...config, data: data })
		.then((response) => response.data);
}

export function GetUrlWithPagingParams(url , params = {}){
	let endUrl = url;
	let values = [];
	values.push(`page=${params.page || 1}`);
	values.push(`limit=${params.limit || 20}`);
	endUrl += '?'+(values.join('&'));
	return endUrl
}

export async function download(url) {
	resetAPIAuthToken();
	return await axiosApi
		.get(url, { 
			responseType: 'blob'
		 })
		.then((response) => response.data);
}