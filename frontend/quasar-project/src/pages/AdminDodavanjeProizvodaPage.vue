<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="text-h4 text-weight-bold q-mb-lg">
      {{ editing ? 'Uredi proizvod' : 'Dodaj proizvod' }}
    </div>

    <!-- FORMA -->
    <q-form
      @submit.prevent="save"
      class="q-gutter-md"
      style="max-width: 900px"
    >

      <!-- NAZIV I ŠIFRA -->
      <div class="row q-col-gutter-md">

        <q-input
          class="col-8"
          v-model="form.naziv"
          label="Naziv *"
          outlined
          required
        />

        <q-input
          class="col-4"
          v-model="form.sifra"
          label="Šifra *"
          outlined
          required
        />

      </div>


      <!-- OPIS -->
      <q-input
        v-model="form.opis"
        type="textarea"
        label="Opis"
        outlined
      />


      <!-- CIJENA, JEDINICA I TEŽINA -->
      <div class="row q-col-gutter-md">

        <q-input
          class="col-4"
          v-model.number="form.cijena"
          type="number"
          step="0.01"
          label="Cijena *"
          outlined
          required
        />

        <q-input
          class="col-4"
          v-model="form.jedinica_mjere"
          label="Jedinica mjere"
          outlined
        />

        <q-input
          class="col-4"
          v-model.number="form.tezina"
          type="number"
          step="0.001"
          label="Težina"
          outlined
        />

      </div>


      <!-- KATEGORIJA I PROIZVOĐAČ -->
      <div class="row q-col-gutter-md">

        <q-select
          class="col-6"
          v-model="form.id_kategorija"
          :options="categories"
          option-label="naziv"
          option-value="id_kategorija"
          emit-value
          map-options
          label="Kategorija *"
          outlined
          required
        />

        <q-select
          class="col-6"
          v-model="form.id_proizvodac"
          :options="manufacturers"
          option-label="naziv"
          option-value="id_proizvodac"
          emit-value
          map-options
          label="Proizvođač *"
          outlined
          required
        />

      </div>


      <!-- DODATNI PODACI -->
      <q-input
        v-model="form.dimenzije"
        label="Dimenzije"
        outlined
      />

      <q-input
        v-model="form.namjena"
        label="Namjena"
        outlined
      />

      <q-input
        v-model="form.slika_url"
        label="URL slike"
        outlined
      />


      <!-- STATUS PROIZVODA -->
      <q-toggle
        v-model="form.aktivan"
        label="Aktivan"
      />


      <!-- GUMBI -->
      <div class="q-pt-sm">

        <q-btn
          type="submit"
          color="primary"
          :loading="loading"
          :label="editing ? 'Spremi' : 'Dodaj'"
          class="q-mr-sm"
        />

        <q-btn
          flat
          label="Odustani"
          to="/admin/proizvodi"
        />

      </div>

    </q-form>

  </q-page>
</template>


<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { useQuasar } from 'quasar'

import { api } from 'boot/axios'


// ============================================================
// INICIJALIZACIJA
// ============================================================

const route = useRoute()
const router = useRouter()
const $q = useQuasar()


// ============================================================
// STANJE
// ============================================================

const loading = ref(false)

const categories = ref([])

const manufacturers = ref([])


// ============================================================
// UTVRĐIVANJE NAČINA RADA
// ============================================================

const editing = computed(() => {
  return !!route.params.id
})


// ============================================================
// PODACI O PROIZVODU
// ============================================================

const form = reactive({
  naziv: '',
  opis: '',
  sifra: '',
  cijena: 0,
  jedinica_mjere: 'kom',
  tezina: null,
  dimenzije: '',
  namjena: '',
  slika_url: '',
  id_kategorija: null,
  id_proizvodac: null,
  aktivan: true
})


// ============================================================
// DOHVAT KATEGORIJA, PROIZVOĐAČA I PROIZVODA
// ============================================================

async function load() {
  loading.value = true

  try {
    const [
      categoriesResponse,
      manufacturersResponse
    ] = await Promise.all([
      api.get('/kategorije'),
      api.get('/proizvodaci/simple')
    ])

    categories.value =
      categoriesResponse.data

    manufacturers.value =
      manufacturersResponse.data

    // Ako se uređuje postojeći proizvod,
    // dohvaćaju se njegovi podaci.
    if (editing.value) {
      const response = await api.get(
        `/proizvodi/${route.params.id}`
      )

      Object.assign(
        form,
        response.data.data || response.data
      )
    }

  } catch (error) {
    console.error(
      'Greška pri učitavanju podataka proizvoda:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Nije moguće učitati podatke proizvoda.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// SPREMANJE PROIZVODA
// ============================================================

async function save() {
  loading.value = true

  try {

    // Uređivanje postojećeg proizvoda
    if (editing.value) {

      await api.put(
        `/proizvodi/${route.params.id}`,
        form
      )

    }

    // Dodavanje novog proizvoda
    else {

      await api.post(
        '/proizvodi',
        form
      )

    }

    $q.notify({
      type: 'positive',
      message: editing.value
        ? 'Proizvod je uspješno ažuriran.'
        : 'Proizvod je uspješno dodan.'
    })

    router.push('/admin/proizvodi')

  } catch (error) {
    console.error(
      'Greška pri spremanju proizvoda:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Spremanje proizvoda nije uspjelo.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// INICIJALNO UČITAVANJE
// ============================================================

onMounted(() => {
  load()
})
</script>