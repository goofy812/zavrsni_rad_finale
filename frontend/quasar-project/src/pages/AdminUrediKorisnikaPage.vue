<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="row items-center q-mb-lg">

      <q-btn
        flat
        round
        icon="arrow_back"
        @click="goBack"
        class="q-mr-sm"
      />

      <div>
        <div class="text-h4 text-weight-bold">
          Uredi korisnika
        </div>

        <div class="text-grey-7">
          Uređivanje podataka korisničkog računa
        </div>
      </div>

    </div>

    <!-- GREŠKA -->
    <q-banner
      v-if="greska"
      class="bg-red-1 text-red q-mb-lg"
      rounded
    >
      {{ greska }}
    </q-banner>

    <!-- FORMA -->
    <q-card
      v-if="!ucitavanje"
      flat
      bordered
    >

      <q-card-section>

        <div class="text-h5 text-weight-bold q-mb-lg">
          Podaci korisnika
        </div>

        <div class="row q-col-gutter-md">

          <!-- IME -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="forma.ime"
              outlined
              label="Ime"
            />
          </div>

          <!-- PREZIME -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="forma.prezime"
              outlined
              label="Prezime"
            />
          </div>

          <!-- KORISNIČKO IME -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="forma.korisnicko_ime"
              outlined
              label="Korisničko ime"
            />
          </div>

          <!-- EMAIL -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="forma.email"
              outlined
              label="E-mail"
              type="email"
            />
          </div>

          <!-- NOVA LOZINKA -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="forma.lozinka"
              outlined
              label="Nova lozinka"
              type="password"
              hint="Ostavite prazno ako ne želite promijeniti lozinku."
            />
          </div>

          <!-- PRIVATNI RAČUN -->
          <div class="col-12 col-md-6 flex items-center">

            <q-checkbox
              v-model="forma.privatni_racun"
              label="Privatni račun"
            />

          </div>

        </div>

      </q-card-section>

      <!-- GUMBI -->
      <q-card-actions
        align="right"
        class="q-pa-md"
      >

        <q-btn
          flat
          label="Odustani"
          @click="goBack"
        />

        <q-btn
          unelevated
          color="primary"
          icon="save"
          label="Spremi promjene"
          :loading="spremanje"
          @click="spremi"
        />

      </q-card-actions>

    </q-card>

    <!-- UČITAVANJE -->
    <div
      v-if="ucitavanje"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        color="primary"
        size="40px"
      />
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { api } from "boot/axios"

const route = useRoute()
const router = useRouter()

const ucitavanje = ref(true)
const spremanje = ref(false)
const greska = ref("")

const forma = ref({
  ime: "",
  prezime: "",
  korisnicko_ime: "",
  email: "",
  lozinka: "",
  privatni_racun: false
})

async function ucitajKorisnika() {
  try {
    ucitavanje.value = true
    greska.value = ""

    const response = await api.get(
      `/korisnici/${route.params.id}`
    )

    const korisnik = response.data

    forma.value = {
      ime: korisnik.ime || "",
      prezime: korisnik.prezime || "",
      korisnicko_ime: korisnik.korisnicko_ime || "",
      email: korisnik.email || "",
      lozinka: "",
      privatni_racun:
        Number(korisnik.privatni_racun) === 1
    }

  } catch (error) {

    console.error(
      "Greška pri dohvaćanju korisnika:",
      error
    )

    greska.value =
      "Nije moguće dohvatiti podatke korisnika."

  } finally {
    ucitavanje.value = false
  }
}

async function spremi() {
  try {

    greska.value = ""
    spremanje.value = true

    await api.put(
      `/korisnici/${route.params.id}`,
      forma.value
    )

    alert("Podaci korisnika su uspješno spremljeni.")

    router.push(
      `/admin/korisnici/${route.params.id}`
    )

  } catch (error) {

    console.error(
      "Greška pri spremanju korisnika:",
      error
    )

    greska.value =
      error.response?.data?.message ||
      "Nije moguće spremiti promjene."

  } finally {
    spremanje.value = false
  }
}

function goBack() {
  router.push(
    `/admin/korisnici/${route.params.id}`
  )
}

onMounted(() => {
  ucitajKorisnika()
})
</script>