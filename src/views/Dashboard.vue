<template>
  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
    <div class="row mb-5">
      <TestCicrle />
    </div>

    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->
      <div class="col-xl-4">
        <MixedWidget5
          widget-classes="card-xl-stretch mb-xl-8 h-md-100"
          chart-color="primary"
          chart-height="150"
        ></MixedWidget5>
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xl-8">
        <Widget10 className="h-md-100" />
      </div>
      <!--end::Col-->
    </div>

    <!--begin::Col-->
    <div class="col-xl-6">
      <Widget9 className="h-lg-100" :height="300" />
    </div>
    <!--end::Col-->
  </div>
  <!--end::Row-->
</template>

<script>
import { getAssetPath } from "@/core/helpers/assets";
import Widget9 from "@/components/dashboard-default-widgets/Widget9.vue";
import Widget10 from "@/components/dashboard-default-widgets/Widget10.vue";
import MixedWidget5 from "@/components/widgets/mixed/Widget5.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import html2pdf from "html2pdf.js";
import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import { useChatStore } from "@/stores/chat";
import { defineComponent, onMounted } from "vue";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import TestCicrle from "./TestCicrle.vue";

export default defineComponent({
  name: "main-dashboard",
  components: { Widget9, Widget10, MixedWidget5, TestCicrle },
  setup() {
    const chat = useChatStore();

    const firebaseConfig = {
      apiKey: "AIzaSyC0aNDiJN3mWIJ7-cSY8uL55HJLLRAteMg",
      authDomain: "vue-notifications-a7522.firebaseapp.com",
      projectId: "vue-notifications-a7522",
      storageBucket: "vue-notifications-a7522.appspot.com",
      messagingSenderId: "746400036064",
      appId: "1:746400036064:web:70860aebb654de2c2c8c85",
      measurementId: "G-F61WNGZWRP",
    };

    const exportToPdf = () => {
      html2pdf(document.getElementById("element-to-convert"), {
        margin: 1,
        filename: "i-was-html.pdf",
      });
    };

    const app = initializeApp(firebaseConfig);

    const notify = (msg) => {
      toast(`${msg}`, {
        autoClose: 2000,
        theme: "light",
        type: "default",
        transition: "slide",
        hideProgressBar: true,
      });
    };
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      notify(payload.notification.title);
    });
    getToken(messaging, {
      vapidKey:
        "BOaLe7jqiEubbQ-LAZV7eyIrKPYex01c-ByAdMVVORB5JPD_xVs7-qF5PGK7cQim8Ls3jpBrjrMKcaSRWDt81vA",
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Token is:", currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });

    onMounted(async () => {
      await chat.notifications();
    });

    return {
      getAssetPath,
      exportToPdf,
      app,
    };
  },
});
</script>

<style lang="scss" scoped></style>
