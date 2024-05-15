<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-lg-row">
    <!--begin::Sidebar-->
    <div
      class="flex-column flex-lg-row-auto w-100 w-lg-300px w-xl-400px mb-10 mb-lg-0"
    >
      <!--begin::Contacts-->
      <div class="card card-flush">
        <!--begin::Card header-->
        <div class="card-header pt-7" id="kt_chat_contacts_header">
          <!--begin::Form-->
          <form class="w-100 position-relative" autocomplete="off">
            <!--begin::Icon-->
            <KTIcon
              icon-name="magnifier"
              icon-class="fs-2 fs-lg-1 text-gray-500 position-absolute top-50 ms-5 translate-middle-y"
            />
            <!--end::Icon-->

            <!--begin::Input-->
            <input
              type="text"
              class="form-control form-control-solid px-15"
              name="search"
              value=""
              placeholder="Search by username or email..."
            />
            <!--end::Input-->
          </form>
          <!--end::Form-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body pt-5" id="kt_chat_contacts_body">
          <!--begin::List-->
          <div
            class="scroll-y me-n5 pe-5 h-200px h-lg-auto"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_toolbar, #kt_footer, #kt_chat_contacts_header"
            data-kt-scroll-wrappers="#kt_content, #kt_chat_contacts_body"
            data-kt-scroll-offset="0px"
          >
            <template v-for="(item, index) in accounts" :key="index">
              <div class="d-flex flex-stack py-4">
                <!--begin::Details-->
                <ul
                  class="list-group cursor-pointer w-100 text-start text-white"
                  @click="getAccountId(item.id, item.displayName)"
                >
                  <li
                    class="list-group-item bg-hover-primary text-white list-group-item-primary"
                  >
                    <div class="d-flex justify-content-between">
                      <h4>
                        {{ item.displayName }}
                      </h4>
                      <span
                        v-if="item.unreadCount > 0"
                        class="text-success fs-4"
                      >
                        {{ item.unreadCount }}</span
                      >
                    </div>
                    <p class="d-flex justify-content-between">
                      <span>{{ item.latestMessageText }}</span>
                      <small v-if="item.latestMessageDate">
                        <i>{{ formatDate(item.latestMessageDate) }}</i>
                      </small>
                    </p>
                  </li>
                </ul>
                <!--end::Details-->
              </div>
            </template>
          </div>
          <!--end::List-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Contacts-->
    </div>
    <!--end::Sidebar-->

    <!--begin::Content-->
    <div class="flex-lg-row-fluid ms-lg-7 ms-xl-10">
      <!--begin::Messenger-->
      <div class="card" id="kt_chat_messenger">
        <!--begin::Card header-->
        <div class="card-header" id="kt_chat_messenger_header">
          <!--begin::Title-->
          <div class="card-title">
            <!--begin::User-->
            <div class="d-flex justify-content-center flex-column me-3">
              <div v-if="isGroupChat" class="symbol-group symbol-hover">
                <div class="symbol symbol-35px symbol-circle">
                  <img
                    alt="Pic"
                    :src="getAssetPath('media/avatars/300-5.jpg')"
                  />
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <img
                    alt="Pic"
                    :src="getAssetPath('media/avatars/300-25.jpg')"
                  />
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <span class="symbol-label bg-light-warning text-warning 40px"
                    >M</span
                  >
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <img
                    alt="Pic"
                    :src="getAssetPath('media/avatars/300-9.jpg')"
                  />
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <span class="symbol-label bg-light-danger text-danger 40px"
                    >O</span
                  >
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <span class="symbol-label bg-light-primary text-primary 40px"
                    >N</span
                  >
                </div>
                <div class="symbol symbol-35px symbol-circle">
                  <img
                    alt="Pic"
                    :src="getAssetPath('media/avatars/300-23.jpg')"
                  />
                </div>
                <a
                  href="#"
                  class="symbol symbol-35px symbol-circle"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_modal_view_users"
                >
                  <span
                    class="symbol-label fs-8 fw-bold"
                    data-bs-toggle="tooltip"
                    data-bs-trigger="hover"
                    title=""
                    data-bs-original-title="View more users"
                    >+42</span
                  >
                </a>
                <!--end::All users-->
              </div>
              <template v-else>
                <p class="fs-4 fw-bold text-gray-900 me-1 mb-2 lh-1">
                  {{ toUserName }}
                </p>
              </template>
            </div>
            <!--end::User-->
          </div>
          <!--end::Title-->

          <!--begin::Card toolbar-->
          <div class="card-toolbar">
            <!--begin::Menu-->
            <div class="me-n3">
              <button
                class="btn btn-sm btn-icon btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                <i class="bi bi-three-dots fs-2"></i>
              </button>
              <Dropdown4></Dropdown4>
            </div>
            <!--end::Menu-->
          </div>
          <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body" id="kt_chat_messenger_body">
          <!--begin::Messages-->
          <div
            class="scroll-y me-n5 pe-5 h-300px h-lg-auto"
            data-kt-element="messages"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
            data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body"
            data-kt-scroll-offset="5px"
            ref="scrollContainer"
          >
            <template v-for="(item, index) in messages" :key="index">
              <MessageIn
                ref="messagesInRef"
                v-if="item.fromUserId === toUserId"
                :name="item.fromUser"
                :time="item.createdDate"
                :text="item.text"
              ></MessageIn>
              <MessageOut
                ref="messagesOutRef"
                v-if="item.toUserId === 'bece8021-af5f-491b-9568-08d92b5d768e'"
                :time="item.createdDate"
                :text="item.text"
              ></MessageOut>
            </template>
          </div>
          <!--end::Messages-->
        </div>
        <!--end::Card body-->

        <!--begin::Card footer-->
        <div class="card-footer pt-4" id="kt_chat_messenger_footer">
          <!--begin::Input-->
          <input
            v-model="text"
            @keydown.enter="sendMessage"
            class="form-control form-control-flush mb-3"
            :disabled="!isEnable"
            data-kt-element="input"
            placeholder="Type a message"
          />
          <!--end::Input-->

          <!--begin:Toolbar-->
          <div class="d-flex flex-stack">
            <!--begin::Actions-->
            <div class="d-flex align-items-center me-2">
              <button
                class="btn btn-sm btn-icon btn-active-light-primary me-1"
                type="button"
                data-bs-toggle="tooltip"
                title="Coming soon"
              >
                <i class="bi bi-paperclip fs-3"></i>
              </button>
              <button
                class="btn btn-sm btn-icon btn-active-light-primary me-1"
                type="button"
                data-bs-toggle="tooltip"
                title="Coming soon"
              >
                <i class="bi bi-upload fs-3"></i>
              </button>
            </div>
            <!--end::Actions-->

            <!--begin::Send-->
            <button
              @click="sendMessage"
              :class="{
                'disabled btn btn-primary': !isEnable,
                'btn btn-primary': isEnable,
              }"
              type="button"
              data-kt-element="send"
            >
              Send
            </button>
            <!--end::Send-->
          </div>
          <!--end::Toolbar-->
        </div>
        <!--end::Card footer-->
      </div>
      <!--end::Messenger-->
    </div>
    <!--end::Content-->
  </div>

  <!--end::Layout-->
</template>

<script>
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useChatStore } from "@/stores/chat";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import Dropdown4 from "@/components/dropdown/Dropdown4.vue";
import MessageIn from "@/components/messenger-parts/MessageIn.vue";
import MessageOut from "@/components/messenger-parts/MessageOut.vue";

import * as signalR from "@Microsoft/signalr";

export default defineComponent({
  name: "private-chat",
  components: {
    MessageIn,
    MessageOut,
    Dropdown4,
  },

  setup() {
    const messagesInRef = (ref < null) | (HTMLElement > null);
    const messagesOutRef = (ref < null) | (HTMLElement > null);

    const chat = useChatStore();
    const route = useRoute();

    const { accounts, messages, notification } = storeToRefs(chat);

    const text = ref("");
    const toUserId = ref(0);
    const toUserName = ref("");
    const isEnable = ref(false);

    const Connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://edensafebase.com/chathubmobile`, {
        accessTokenFactory: () => localStorage.getItem("access_token"),
        withCredentials: false,
      })
      .build();

    const sendMessage = () => {
      if (text.value.trim().length >= 1) {
        Connection.invoke("SendMessage", text.value, toUserId.value);
        text.value = "";
      }
    };

    const startConnection = () => {
      Connection.on("ReceiveMessage", (receivedText) => {
        console.log(receivedText);
        messages.value.push(receivedText);
        scrollToBottom();
      });
      Connection.start().catch((err) => console.log(err));
      if (Connection.state === "Connecting") {
        chat.$resetNotification();
      }
    };

    const deleteMessage = () => {
      Connection.on("DeleteMessage", (receivedText) => {
        console.log(receivedText);
      });
    };

    const stopConnection = () => {
      if (Connection) {
        Connection.stop()
          .then(() => {
            chat.$reset();
            console.log("SignalR connection closed");
          })
          .catch((error) => {
            console.error("Error closing SignalR connection:", error);
          });
      }
    };

    const getAccountId = (id, toUser) => {
      chat.$reset();
      setTimeout(async () => {
        if (toUserId.value !== id) {
          await chat.getMessages(id);
          toUserId.value = id;
          await chat.getAccounts();
          isEnable.value = true;
          scrollToBottom();
          toUserName.value = toUser;
        }
      }, 1);
    };

    onMounted(async () => {
      await startConnection();

      await chat.getAccounts();
    });

    const isGroupChat = computed(() => {
      return route.path.indexOf("/group-chat") !== -1;
    });

    const formatDate = (dateString) => {
      return useDateFormat(dateString, "YYYY-MM-DD").value.replace(/["']/g, "");
    };

    const scrollContainer = ref(null);

    const scrollToBottom = () => {
      setTimeout(() => {
        if (scrollContainer.value) {
          console.log("New message");
          let scrContainer = scrollContainer.value.scrollHeight + 200;
          scrollContainer.value.scrollTop = scrContainer;
        }
      }, 2);
    };

    onUnmounted(stopConnection);

    return {
      sendMessage,
      messagesInRef,
      messagesOutRef,
      isGroupChat,
      accounts,
      messages,
      text,
      toUserId,
      toUserName,
      isEnable,
      notification,
      getAssetPath,
      getAccountId,
      scrollContainer,
      scrollToBottom,
      formatDate,
    };
  },
});
</script>
