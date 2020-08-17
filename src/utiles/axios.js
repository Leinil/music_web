import axios from 'axios';
import baseUrl from './ip';
import { Message } from 'element-ui';

const service = axios.create({
    baseUrl
})
// http request
service.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
})

// http response
service.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
})

export default service;