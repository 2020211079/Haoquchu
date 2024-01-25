import { defineStore } from "pinia";

export const useStore = defineStore("main",{
    state:()=>{
        return {
            isCollapse: false,
            avatar: ''
        }
    },
    getters: {
        getCollapse(state){
            return state.isCollapse;
        },
        getAvatar(state){
            return state.avatar;
        }
    },
    actions: {
        setCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        setAvatar(filename){
            this.avatar = filename;
        }
    }
})
