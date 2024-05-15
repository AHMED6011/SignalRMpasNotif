import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import * as signalR from "@Microsoft/signalr";

export interface Account {
  data: Datum[];
  success: boolean;
  errors: any[];
}

export interface Datum {
  id: string;
  displayName: string;
  photo: null | string;
  unreadCount: number;
  latestMessageDate: Date | null;
  latestMessageText: null | string;
}

export interface Message {
  id: number;
  createdDate: string;
  toUserId: string;
  toUser: string;
  fromUserId: string;
  fromUser: string;
  text: string;
  viewDate: string;
  isRead: boolean;
}

export interface User {
  intId: number;
  id: string;
  email: string;
  phoneNumber: null;
  firstName: string;
  lastName: string;
  displayName: string;
  dob: Date;
  gender: null;
  role: number;
  clockIn: boolean;
  position: null;
  profilePhoto: null;
  skype: null;
  whatsApp: null;
  program: null;
  collegeName: null;
  isOnCampus: boolean;
  receiveNotifications: boolean;
  createdDate: Date;
  deletionDate: null;
}

export const useChatStore = defineStore("chat", {
  state: () => ({
    accounts: [] as Datum[],
    messages: [] as Message[],
    notification: 0 as number,
    unreadMessages: 0,
    Connection: new signalR.HubConnectionBuilder(),
  }),
  actions: {
    async getAccounts() {
      try {
        const response = await ApiService.get("api/Chat/FetchUserChats");
        this.accounts = response.data.data;
        console.log(this.accounts);
      } catch (error: any) {
        if (error.response) {
          console.error(error.response);
        } else {
          console.error(error);
        }
      }
    },
    async getMessages(id: any) {
      try {
        const response = await ApiService.get(`api/Chat/FetchMessages/${id}`);
        this.messages = response.data.data;
        console.log(this.messages);
      } catch (error) {
        console.log(error);
      }
    },

    async notifications() {
      try {
        const token = localStorage.getItem("access_token")!;
        const Connection = new signalR.HubConnectionBuilder()
          .withUrl("https://edensafebase.com/NotificationHubmobile", {
            accessTokenFactory: () => token,
            withCredentials: false,
          })
          .build();

        await Connection.start(); // Start the connection

        Connection.on("ChatsCountUpdated", (count: number) => {
          this.notification = count;
        });
      } catch (err) {
        console.error(err); // Use console.error for errors
      }
    },
    // stopNotifications() {
    //   this.Connection.stop();
    // },
    $reset() {
      this.messages = [];
    },
    $resetNotification() {
      this.notification = 0;
    },
  },
});
