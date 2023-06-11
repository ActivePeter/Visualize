import {LoadPersonDetail} from "@/network/users"
import { Notification } from "element-ui";
const token=localStorage.getItem("token");

const state = {
  token: token||"",
  userinfo: JSON.parse(localStorage.getItem('userinfo'))||null
};

var tokenChecked=false;

const checkTokenValid=function(){
  LoadPersonDetail(state.userinfo.id).then(res=>{
    console.log(res);
    if(res.status){
      if(res.status==200){
        tokenChecked=true;
        // console.log("tokenChecked");
      }else{
        Notification.error({
          title: "提示",
          message: "登入已过期，请重新登入"
        });
        mutations.SET_TOKEN(state,"");
        mutations.SET_USERINFO(state,null);
      }
    }else{
      if(!tokenChecked){
        setTimeout(function (){
          checkTokenValid();
        }, 3000);
        // checkTokenValid();
      }
    }
  })
}

if(state.userinfo){
  setTimeout(function (){
    checkTokenValid();
  }, 1000);
  
}


const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  SET_USERINFO(state, userinfo) {
    state.userinfo = userinfo;
    localStorage.setItem('userinfo', JSON.stringify(userinfo));
  }
};

const actions = {
  resetStatus({commit}) {
    commit("SET_TOKEN", "");
    commit("SET_USERINFO", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
