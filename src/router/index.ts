import {createRouter,createWebHashHistory} from "vue-router"
import Home from "../pages/Home/index.vue"

const routers=[
    {
        path:"/",
        name:"首页",
        component:Home
    }
];

const router = createRouter({
    history:createWebHashHistory(),
    routes:routers
})

// console.log(import.meta.env.VITE_APP_BASE_URL)

export default router