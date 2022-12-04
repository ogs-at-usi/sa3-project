class ApiClient {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  /**
   * Retrieve the list of chats that match the filter.
   * @param username
   * @param password
   * @returns {*}
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
   * Retrieve the list of users that match the filter.
   * @param filter {string} The filter to apply
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  getUsers(filter) {
    return this.axiosInstance.get(`/api/users?filter=${filter}`);
  }

  /**
   * Create a chat with the logged user and the user with the given ID.
   * @param otherUserID {string} The ID of the other user
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  createChat(otherUserID) {
    return this.axiosInstance.post('/api/chats', { otherUserID });
  }

  /**
   * Create a message in a chat.
   * @param chatID {string} The ID of the chat
   * @param message {Message} The message to create
   * @returns {Promise<AxiosResponse<any>>} The promise with the response
   */
  sendMessage(chatID, message) {
    return this.axiosInstance.post(`/api/chats/${chatID}/messages`, {
      type: message.type,
      content: message.content,
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
