<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <div></div>
        <ion-title class="title-center">Вход</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Вход</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" class="fl">
        <div class="title-center">
          <img 
          src="https://www.prodo.ru/upload/iblock/8c5/ean2e9rhf07i24d7sqzhjg8dbds0a7xe.jpg"
          alt=""
          width="100px"
          style="display: block; margin: 20px auto; max-width: 300px; border-radius: 777px;"
        >
        </div>
        <ion-input placeholder="Логин" v-model="login"></ion-input>
        <ion-input
          type="password"
          placeholder="Пароль"
          v-model="password"
        ></ion-input>
        <ion-button @click="signIn()">Войти</ion-button>
      </div>
    </ion-content>
    <ion-toast
      :is-open="dangetToast"
      message="Неверно заполненны данные"
      :duration="1000"
      @didDismiss="dangetToast = false"
    >
    </ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonButtons,
  IonBackButton,
  IonToast,
} from "@ionic/vue";
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import { useIonRouter } from "@ionic/vue";

const login = ref("");
const password = ref("");

const store = useUserStore();
const router = useIonRouter();

const dangetToast = ref(false);

const signIn = async () => {
  const result = await store.signIn(login.value, password.value);
  if (result) router.push("/home");
  else dangetToast.value = true;
};
</script>

<style scoped>
.title-center {
  text-align: center;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.fl {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
