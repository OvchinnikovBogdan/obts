<template>
  <div style="background-color: ">
    <ion-card>
      <ion-card-header>
        <ion-card-title
          >Название: <b>{{ post?.name }}</b></ion-card-title
        >
      </ion-card-header>
      <ion-card-content>
        Дата и время:
        <b>{{
          post?.createdAt
            ?.toString()
            .replaceAll("-", " ")
            .replaceAll("T", "/")
            .slice(0, 16)
        }}</b>
        <div></div>
        Описание: <b>{{ post?.description }}</b>
        <div></div>
        Статус <template v-if="!masterNameComp.length">(Введите имя техника для изменения)</template>:
        <select placeholder="Статус" v-model="status" @change="changeStatus" :disabled="!masterNameComp.length">
          <option
            v-for="(status, idx) in statuses"
            :key="idx"
            :value="status.name"
          >
            {{ status.locale }}
          </option>
        </select>
        <div></div>
        Адрес: <b>{{ post?.location }}</b>
        <div></div>
        Тип: <b>{{ post?.type }}</b>
        <div></div>
        Отправитель: <b>{{ username }}</b>
        <div></div>
        <div v-if="post?.masterName">
          Мастер: {{ post?.masterName }}
        </div>
        <ion-button @click="deletePost">Удалить</ion-button>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script lang="ts" setup>
import { API_STR, loginUser } from "@/api/SignIn";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";
import { onMounted, ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";

const store = useUserStore();
const props = defineProps(["data"]);
const emit = defineEmits(["deleted"]);
const statuses = ref([
  {
    name: "open",
    locale: "Открыта",
  },
  {
    name: "inProcess",
    locale: "В процессе",
  },
  {
    name: "close",
    locale: "Закрыта",
  },
]);

const post = ref(props.data);
const status = ref(post.value?.status);
const username = ref("");
const masterNameComp = computed(() => store.masterName);

onMounted(() => getUserById());

const changeStatus = async () => {
  console.log(post.value.id, status.value);
  const headers = new Headers();
  headers.append("authorization", "Bearer " + store.accesToken);
  headers.append("Content-Type", "application/json");

  try {
    const response = await fetch(API_STR + "posts/" + post.value.id, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        status: status.value,
        masterName: masterNameComp.value,
      }),
      redirect: "follow",
    });
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const deletePost = async () => {
  const myHeaders = new Headers();
  myHeaders.append("authorization", "Bearer " + store.accesToken);
  try {
    const response = await fetch(API_STR + "posts/" + post.value?.id, {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    });
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
  emit("deleted");
};

const getUserById = async () => {
  const myHeaders = new Headers();
  myHeaders.append("authorization", "Bearer " + store.accesToken);

  try {
    const response = await fetch(API_STR + "users/" + post.value["userId"], {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    });
    const result = await response.json();
    console.log(result);
    username.value = result.login;
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.Indentation {
  margin-left: 10px;
}

.title-center {
  text-align: center;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
#container {
  position: absolute;
  left: 0;
  right: 0;
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
}
</style>
