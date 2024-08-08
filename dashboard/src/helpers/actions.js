
import { useEffect , useState } from 'react';

const getUser = () =>{
    const user = JSON.parse(localStorage.getItem('auth')) || null;
    return user;
}


const logout = () =>{
    localStorage.removeItem('auth');
    localStorage.removeItem('theme');
    window.location.href = '/login';
}


const getCompanyID = () => {
    const company_id = JSON.parse(localStorage.getItem('auth')).company_id;
    return company_id;
}

const getCompanyLogo = () =>{
    const company_logo = JSON.parse(localStorage.getItem('auth')).logo;
    return company_logo;

}

const getCompanyName = () =>{
    const company_name = JSON.parse(localStorage.getItem('auth')).company_name;
    return company_name;

}

export const ex_theme = localStorage.getItem('theme')  || 'light'


export const API_URL = "http://86.38.217.190:8009/api/"
export const DOMAIN_URL = "http://86.38.217.190:8009/"

export {getUser, logout , getCompanyID , getCompanyLogo , getCompanyName}