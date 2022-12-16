import store from '@/store';

class ApiClient {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Retrieve the list of chats that match the filter.
   * @param username {String} the username
   * @param password {String} the password
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  login(username, password) {
    return this.axiosInstance.post('/auth/login', { username, password });
  }

  /**
   * Retrieve the list of chats that match the filter.
   * @param email {string} The email of the user
   * @param username {string} The username of the user
   * @param password {string} The password of the user
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  signup(email, username, password) {
    return this.axiosInstance.post('/auth/signup', {
      email,
      username,
      password,
    });
  }

  /**
   * Refresh the access token.
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  refreshToken() {
    return this.axiosInstance.post('/auth/refresh');
  }

  /**
   * Retrieve the list of users that match the filter.
   * @param filter {string} The filter to apply
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  getUsers(filter) {
    return this.axiosInstance.get(`/api/users?filter=${filter}`);
  }

  /**
   * Create a chat with the logged user and the user with the given ID.
   * @param otherId {string} The ID of the other user
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  createChat(otherId) {
    return this.axiosInstance.post('/api/chats', { otherId });
  }

  /**
   * Create a message in a chat.
   * @param chatId {string} The ID of the chat
   * @param message {Message} The message to create
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  sendMessage(chatId, message) {
    return this.axiosInstance.post(`/api/chats/${chatId}/messages`, {
      message,
    });
  }

  /**
   * Send a sticer in a chat.
   * @param chatId {string} The ID of the chat
   * @param sticker {string} The sticker to send
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  sendSticker(chatId, sticker) {
    return this.axiosInstance.post(`/api/chats/${chatId}/stickers`, {
      sticker,
    });
  }

  /**
   * Send a file in a chat.
   * @param chatId {string} The ID of the chat
   * @param file {File} The file to send
   * @param type {string} The type of the file: image / video / file
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  async sendFile(chatId, file, type) {
    // before sending the file, it's best to refresh the token
    // to avoid the token to expire while the file is being uploaded
    await store.dispatch('refreshToken');
    const formData = new FormData();
    formData.append(type, file);
    formData.append('chatId', chatId);
    // console.log(chatId, file, type, formData);
    return this.axiosInstance.post(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Send a sticker in a chat.
   * @param chatId {string} The ID of the chat
   * @param sticker {string} The name of the sticker to send
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
   async sendSticker(chatId, sticker) {
    // before sending the sticker, it's best to refresh the token
    // to avoid the token to expire while the sticker is being uploaded
    await store.dispatch('refreshToken');
    // console.log(chatId, sticker);
    return this.axiosInstance.post(`/api/chats/${chatId}/sticker`, {
      sticker,
    });
  }
}

export default {
  /**
   * Install the plugin.
   * @param Vue {Vue} The Vue instance
   * @param axiosInstance {AxiosInstance} The axios instance
   */
  install(Vue, axiosInstance) {
    Vue.prototype.$api = new ApiClient(axiosInstance);
  },
};
