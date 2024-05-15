<template>
  <div class="d-flex justify-content-start mb-10">
    <!--begin::Wrapper-->
    <div class="d-flex flex-column align-items-start">
      <!--begin::User-->
      <div class="d-flex align-items-center mb-2">
        <!--begin::Details-->
        <div class="ms-3">
          <span class="fs-5 fw-bold text-gray-900 text-hover-primary me-1">{{
            name
          }}</span>
          <p class="text-muted fs-7 mb-1">{{ formatDate(time) }}</p>
        </div>
        <!--end::Details-->
      </div>
      <!--end::User-->

      <!--begin::Text-->
      <div
        class="p-5 rounded bg-light-info text-white fw-semibold mw-lg-400px text-start"
        data-kt-element="message-text"
      >
        {{ text }}
      </div>
      <!--end::Text-->
    </div>
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDateFormat } from "@vueuse/core";

export default defineComponent({
  name: "message-out",
  props: {
    name: String,
    image: String,
    time: String,
    text: String,
  },

  setup() {
    const formatDate = (dateString: any) => {
      return useDateFormat(dateString, "YYYY-MM-DD HH:mm").value.replace(
        /["']/g,
        ""
      );
    };
    return {
      formatDate,
    };
  },
});
</script>
