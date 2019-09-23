/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");

import VueChatScroll from "vue-chat-scroll";
Vue.use(VueChatScroll);

import Toaster from "v-toaster";

// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import "v-toaster/dist/v-toaster.css";

// optional set default imeout, the default is 10000 (10 seconds).
Vue.use(Toaster, {
    timeout: 5000
});

import Vuetify from "vuetify";

Vue.use(Vuetify);

import "vuetify/dist/vuetify.min.css";

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const VueUploadComponent = require("vue-upload-component");
Vue.component("file-upload", VueUploadComponent);

Vue.component("Chat", require("./components/Chat.vue").default);
Vue.component("PrivateChat", require("./components/PrivateChat.vue").default);

Vue.component("message", require("./components/message.vue").default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// const app = new Vue({
//     el: "#app"
// });

const app = new Vue({
    el: "#app",
    data() {
        return {
            message: "",
            chat: {
                message: [],
                user: [],
                color: [],
                time: []
            },
            typing: "",
            numbusers: 0
        };
    },
    methods: {
        send() {
            if (this.message.length !== 0) {
                this.chat.message.push(this.message);
                this.chat.user.push("You");
                this.chat.color.push("success");
                this.chat.time.push(this.getTime());

                axios
                    .post("/send", {
                        message: this.message,
                        chat: this.chat
                    })
                    .then(response => {
                        console.log(response);
                        this.message = "";
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        getTime() {
            let time = new Date();
            return time.getHours() + ":" + time.getMinutes();
        },
        getOldMessages() {
            axios
                .get("/getOldMessages")
                .then(response => {
                    console.log(response);
                    if (response.data !== "") {
                        this.chat = response.data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    watch: {
        message() {
            Echo.private("chat").whisper("typing", {
                name: this.message
            });
        }
    },
    mounted() {
        this.getOldMessages();
        Echo.private("chat")
            .listen("ChatEvent", e => {
                this.chat.message.push(e.message);
                this.chat.user.push(e.user.name);
                this.chat.color.push("warning");
                this.chat.time.push(this.getTime());

                // console.log(e);
            })
            .listenForWhisper("typing", e => {
                if (e.name !== "") {
                    this.typing = "typing...";
                } else {
                    this.typing = "";
                }
            });

        Echo.join(`chat`)
            .here(users => {
                //
                this.numbusers = users.length;
            })
            .joining(user => {
                this.numbusers += 1;
                this.$toaster.success(user.name + " joined chat.");
                console.log(user.name);
            })
            .leaving(user => {
                this.numbusers -= 1;
                this.$toaster.error(user.name + " left room.");
                console.log(user.name);
            });
    }
});
