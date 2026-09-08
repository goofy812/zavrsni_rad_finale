<template>
  <q-page padding class="q-pa-lg">

    <!-- NASLOV -->
    <div class="text-h5 q-mb-md">
      Pretraga korisnika
    </div>

    <!-- PRETRAGA -->
    <div class="row q-col-gutter-md">
      <div class="col">
        <q-input
          filled
          v-model="korisnicko_ime"
          label="Upiši korisničko ime"
          clearable
        />
      </div>

      <div class="col-auto">
        <q-btn
          label="Traži"
          color="primary"
          class="full-height"
          @click="fetchUsers"
        />
      </div>
    </div>

    <!-- REZULTATI -->
    <div class="q-mt-lg q-gutter-md">

      <q-card
        v-for="user in users"
        :key="user.id_korisnik"
        @click="onCardClicked(user.id_korisnik)"
        class="cursor-pointer"
        flat
        bordered
      >

        <q-card-section>

          <div class="text-h6 q-mb-md">
  {{ user.ime || "" }} {{ user.prezime || "" }}

  <q-icon
    v-if="Number(user.razina_prava) === 1"
    name="admin_panel_settings"
    color="primary"
    size="sm"
    class="q-ml-sm"
  >
    <q-tooltip>
      Administrator
    </q-tooltip>
  </q-icon>
</div>

<div class="text-body2 text-grey-7">
  <strong>Korisničko ime:</strong>
  {{ user.korisnicko_ime }}
</div>

<div class="text-body2 text-grey-7 q-mt-xs">
  <strong>E-mail:</strong>
  {{ user.email }}
</div>

<div class="text-body2 text-grey-7 q-mt-xs">
  <strong>Tip korisnika:</strong>
  {{ Number(user.razina_prava) === 1 ? "Administrator" : "Korisnik" }}
</div>

        </q-card-section>

        <q-card-actions align="right">

          <q-btn
            v-if="isAdminUser && Number(user.razina_prava) !== 1"
            dense
            color="primary"
            label="Dodaj kao administratora"
            icon="admin_panel_settings"
            @click.stop="onEditButtonClick(user)"
          />

        </q-card-actions>

      </q-card>

      <!-- NEMA REZULTATA -->
      <div
        v-if="users.length === 0 && korisnicko_ime"
        class="text-grey-7 q-mt-lg"
      >
        Nije pronađen korisnik s tim korisničkim imenom.
      </div>

    </div>

  </q-page>
</template>


<script setup>
import { ref, onMounted, watch } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const korisnicko_ime = ref("");
const users = ref([]);
const isAdminUser = ref(false);


// ============================================================
// OTVARANJE DETALJA KORISNIKA
// ============================================================

function onCardClicked(userId) {
  router.push(`/admin/korisnici/${userId}`);
}


// ============================================================
// PROVJERA JE LI TRENUTNI KORISNIK ADMIN
// ============================================================

const checkAdmin = async () => {

  const user = JSON.parse(
    localStorage.getItem("terabuild_user") || "null"
  );

  const userId = user?.id_korisnik || "";

  if (!userId) {
    isAdminUser.value = false;
    return;
  }

  try {

    const response = await api.get(
      `/administratori/check/${userId}`
    );

    isAdminUser.value =
      response.data.isAdmin === true;

  } catch (error) {

    console.error(
      "Greška pri provjeri administratorskih prava:",
      error
    );

    isAdminUser.value = false;
  }
};


// ============================================================
// DOHVAT KORISNIKA
// ============================================================

const fetchUsers = async () => {

  try {

    const params = {};

    if (korisnicko_ime.value.trim()) {
      params.korisnicko_ime =
        korisnicko_ime.value.trim();
    }

    const res = await api.get(
      "/korisnici",
      {
        params
      }
    );

    users.value = res.data;

  } catch (err) {

    console.error(
      "Greška pri dohvaćanju korisnika:",
      err
    );

    users.value = [];
  }
};


// ============================================================
// AUTOMATSKA PRETRAGA DOK SE TIPKA
// ============================================================

let timeout = null;

watch(korisnicko_ime, () => {

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    fetchUsers();
  }, 300);

});


// ============================================================
// DODAVANJE ADMINISTRATORA
// ============================================================

async function onEditButtonClick(user) {

  try {

    await api.post(
      `/administratori/${user.id_korisnik}`
    );

    alert(
      `Korisnik "${user.korisnicko_ime}" dodan je kao administrator!`
    );

    await fetchUsers();

  } catch (error) {

    console.error(
      "Greška pri dodavanju administratora:",
      error
    );

    alert(
      "Došlo je do greške pri dodavanju administratora."
    );
  }
}


// ============================================================
// UČITAVANJE STRANICE
// ============================================================

onMounted(async () => {

  await checkAdmin();

  await fetchUsers();

});
</script>