


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

export const API_URL = "http://127.0.0.1:8000/api"

export {getUser, logout , getCompanyID}