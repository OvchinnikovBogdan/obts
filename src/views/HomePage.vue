<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div class="title-center">
          <img 
          src="https://www.prodo.ru/upload/iblock/8c5/ean2e9rhf07i24d7sqzhjg8dbds0a7xe.jpg"
          alt=""
          width="100px"
          style="display: block; margin: 20px auto; max-width: 300px; border-radius: 777px;"
        >
        </div>
        <ion-title>Omsk Bacon Technical Support</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Omsk Bacon Technical Support</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container" class="fl">
        <div v-if="role === 'admin'">
          <ion-card>
            <ion-card-content>
              <ion-title>Количество заявок: {{ filteredPosts.length }}</ion-title>
            <div>&nbsp;</div>
            <ion-input 
              label="Имя техника"
              placeholder="Заполните для изменения статуса" 
              v-model="name"
              fill="outline"
              label-placement="floating"
              :counter="true"
              :maxlength="50"
            />
            <ion-searchbar
              placeholder="Название"
              v-model="search"
            ></ion-searchbar>
            <ion-card-content>
              <ion-title>Сортировать по статусу: </ion-title>
              <select v-model="selectedStatus">
                <option
                  v-for="(status, idx) in statuses"
                  :key="idx"
                  :value="status.name"
                >
                  {{ status.locale }}
                </option>
              </select>
            </ion-card-content>
            <ion-title>Сортировать по дате: </ion-title>
            <ion-datetime
              presentation="date"
              :multiple="true"
              @ion-change="(ev) => updateDates(ev?.detail?.value)"
            ></ion-datetime>
            </ion-card-content>
          </ion-card>
          <the-card
            v-for="post in filteredPosts"
            :key="post?.id"
            :data="post"
            @deleted="updatePosts"
          />
        </div>
        <div class="Indentation" v-else>
          <ion-input placeholder="Имя" v-model="currentPost.name" />
          <ion-input placeholder="Описание" v-model="currentPost.description" />
          <ion-select placeholder="Тип" v-model="currentPost.type">
            <ion-select-option value="Ремонт">Ремонт</ion-select-option>
            <ion-select-option value="Обслуживание"
              >Обслуживание</ion-select-option
            >
          </ion-select>
          <ion-input placeholder="Место" v-model="currentPost.location" />
          <ion-button @click="sendPost">Отправить</ion-button>
        </div>
      </div>
    </ion-content>
    <ion-toast
      :is-open="postSended"
      message="Заявка отправленна"
      :duration="1000"
      @didDismiss="postSended = false"
    >
    </ion-toast>
    <ion-toast
      :is-open="postDescarded"
      message="Заполните данные"
      swipe-gesture="vertical"
      :duration="1000"
      @didDismiss="postDescarded = false"
    >
    </ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import TheCard from "./TheCard.vue";
import { IPost, addPost, getPosts } from "@/api/Posts";
import { useUserStore } from "@/stores/userStore";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSearchbar,
  IonDatetime,
  IonCard,
  IonToast,
  /*IonInfiniteScroll,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,*/
} from "@ionic/vue";
import { ComputedRef, Ref, computed, ref, onMounted } from "vue";

const store = useUserStore();
onMounted(async () => await store.getUser());

const postSended = ref(false);
const postDescarded = ref(false);
const posts: Ref<IPost[]> = ref([]);
const currentPost: Ref<IPost> = ref({
  userId: Number.NaN,
  name: "",
  description: "",
  type: "",
  location: "",
});
const search = ref("");
const selectedDates = ref();
const selectedStatus = ref("");
const statuses = ref([
  {
    name: "",
    locale: "Не сортировать",
  },
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

const role: ComputedRef<string> = computed(() => store.user.role);
const name = computed({
  get: () => {
    return store.masterName
  },
  set: (value: string) => {
    store.masterName = value;
  }
});

const filteredPostsByName = computed(() => {
  if (!search.value) return [...posts.value];
  return [...posts.value].filter((el) =>
    el.name
      .toLowerCase()
      .includes(search.value.toLowerCase().normalize().trim())
  );
});

const filteredPostsByStatus = computed(() => {
  if (!selectedDates.value) return filteredPostsByName.value;
  return filteredPostsByName.value.filter((el) => {
    if (!el.createdAt) return false;
    const check = new Date(el.createdAt).getTime();
    const from = new Date(selectedDates.value[0])?.getTime();
    const to = new Date(selectedDates.value[1])?.getTime();
    return check <= to && check >= from;
  });
});

const filteredPosts = computed(() => {
  if (selectedStatus.value.normalize().trim() === "")
    return filteredPostsByStatus.value;
  return filteredPostsByStatus.value.filter((el) => {
    return el.status
      ?.toLowerCase()
      .includes(selectedStatus.value.toLowerCase().normalize().trim());
  });
});

onMounted(async () => {
  await updatePosts();
  setInterval(async () => await updatePosts(), 5_000);
});

const updatePosts = async () => {
  const rawPosts = await getPosts(store.accesToken);
  posts.value = rawPosts.sort((a, b) => 
    new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime()
  );
}

const sendPost = async () => {
  if (
    !(
      !!isNaN(currentPost.value.id ?? Number.NaN) &&
      !!currentPost.value.name &&
      !!currentPost.value.description &&
      !!currentPost.value.type &&
      !!currentPost.value.location
    )
  ) {
    postDescarded.value = true;
    return;
  }
  postSended.value = true;
  console.log(currentPost.value);
  await addPost(currentPost.value, store.accesToken);
};

const updateDates = (array: any) => {
  const ar = array as [];
  if (!ar) return;
  if (ar.length < 2) {
    selectedDates.value = undefined;
    return;
  }
  selectedDates.value = ar.map((el) => el + "T00:00:00.000Z");
  console.log(selectedDates.value);
};
</script>

<style scoped>
.custom-input {
  --border-radius: 6px;
  --padding-start: 12px;
  --border-width: 1px;
}

.Indentation ion-input,
.Indentation ion-select {
  margin: 10px 0;
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
