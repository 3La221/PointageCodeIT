import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { API_URL } from './actions';

const axiosService = axios.create({
    baseURL : "http://86.38.217.190:8009/api/",
    headers : {
        "Content-Type":"application/json",
    }
})



axiosService.interceptors.request.use(async(config)=>{
    const {access} = JSON.parse(localStorage.getItem("auth"));
    config.headers.Authorization = `Bearer ${access}`
    return config
})

axiosService.interceptors.response.use(
    (res) => Promise.resolve(res) ,
    (err) => Promise.reject(err)
)

const refreshAuthLogic = async(failedRequest) =>{
    const data = JSON.parse(localStorage.getItem("auth"))
    
    const {refresh,user_id} = data 
    return axios.post("/token/refresh/",data,{
        baseURL : `http://86.38.217.190:8009/api/`,
        headers :{
            Authorization : `Bearer ${refresh}`
        }
    }).then((resp)=>{
        const {access} = resp.data;
        failedRequest.response.config.headers["Authorization"] = "Bearer" + access;
        localStorage.setItem("auth",JSON.stringify({
            access,refresh,user_id
        })) 
    })
    .catch(()=>{
        localStorage.removeItem("auth")
    })
}





createAuthRefreshInterceptor(axiosService,refreshAuthLogic) 



export default axiosService