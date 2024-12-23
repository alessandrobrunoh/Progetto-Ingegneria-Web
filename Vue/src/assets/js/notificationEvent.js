import { ref } from 'vue';

export const notification = {
    showNotification: ref(false),
    notificationMessage: ref(''),
    notificationColor: ref(''),
  
    send(message, color) {
      this.notificationMessage.value = message;
      this.notificationColor.value = color;
      this.showNotification.value = true;
      setTimeout(() => {
        this.showNotification.value = false;
      }, 5000);
    }
  };