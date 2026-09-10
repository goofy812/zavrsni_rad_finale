<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV I DODAVANJE PROIZVOĐAČA -->
    <div class="row items-center justify-between q-mb-lg">

      <div>
        <div class="text-h4 text-weight-bold">
          Upravljanje proizvođačima
        </div>

        <div class="text-grey-7 q-mt-xs">
          Pregled, dodavanje, uređivanje i brisanje proizvođača.
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Dodaj proizvođača"
        @click="open()"
      />

    </div>


    <!-- TABLICA PROIZVOĐAČA -->
    <q-card flat bordered>

      <q-table
        :rows="items"
        :columns="columns"
        row-key="id_proizvodac"
        :loading="loading"
        flat
      >

        <!-- AKCIJE -->
        <template #body-cell-akcije="props">
          <q-td :props="props">

            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="open(props.row)"
            >
              <q-tooltip>
                Uredi proizvođača
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="remove(props.row)"
            >
              <q-tooltip>
                Obriši proizvođača
              </q-tooltip>
            </q-btn>

          </q-td>
        </template>

      </q-table>

    </q-card>


    <!-- DIJALOG ZA DODAVANJE / UREĐIVANJE -->
    <q-dialog v-model="dialog">

      <q-card
        style="min-width: 420px; width: 500px"
      >

        <!-- NASLOV -->
        <q-card-section>

          <div class="text-h6 text-weight-bold">
            {{
              form.id_proizvodac
                ? 'Uredi proizvođača'
                : 'Dodaj proizvođača'
            }}
          </div>

        </q-card-section>


        <!-- PODACI PROIZVOĐAČA -->
        <q-card-section class="q-gutter-md">

          <q-input
            v-model="form.naziv"
            label="Naziv *"
            outlined
            autofocus
          />

          <q-input
            v-model="form.kontakt_osoba"
            label="Kontakt osoba"
            outlined
          />

          <q-input
            v-model="form.email"
            type="email"
            label="Email"
            outlined
          />

          <q-input
            v-model="form.telefon"
            label="Telefon"
            outlined
          />

          <q-input
            v-model="form.web"
            label="Web stranica"
            outlined
          />

        </q-card-section>


        <!-- GUMBI -->
        <q-card-actions align="right">

          <q-btn
            flat
            label="Odustani"
            v-close-popup
          />

          <q-btn
            color="primary"
            label="Spremi"
            @click="save"
          />

        </q-card-actions>

      </q-card>

    </q-dialog>

  </q-page>
</template>


<script setup>
import {
  onMounted,
  reactive,
  ref
} from 'vue'

import { useQuasar } from 'quasar'

import { api } from 'boot/axios'


// ============================================================
// INICIJALIZACIJA
// ============================================================

const $q = useQuasar()


// ============================================================
// PODACI
// ============================================================

const items = ref([])

const dialog = ref(false)

const loading = ref(false)


// ============================================================
// PODACI O PROIZVOĐAČU
// ============================================================

const form = reactive({
  id_proizvodac: null,
  naziv: '',
  kontakt_osoba: '',
  email: '',
  telefon: '',
  web: ''
})


// ============================================================
// STUPCI TABLICE
// ============================================================

const columns = [
  {
    name: 'naziv',
    label: 'Naziv',
    field: 'naziv',
    align: 'left',
    sortable: true
  },
  {
    name: 'kontakt_osoba',
    label: 'Kontakt osoba',
    field: 'kontakt_osoba'
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email'
  },
  {
    name: 'telefon',
    label: 'Telefon',
    field: 'telefon'
  },
  {
    name: 'akcije',
    label: 'Akcije',
    field: 'id_proizvodac'
  }
]


// ============================================================
// DOHVAT PROIZVOĐAČA
// ============================================================

async function load() {
  loading.value = true

  try {
    const response = await api.get('/proizvodaci')

    items.value =
      response.data.data || response.data

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju proizvođača:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        'Nije moguće dohvatiti proizvođače.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// OTVARANJE DIJALOGA
// ============================================================

function open(manufacturer = null) {
  Object.assign(form, {
    id_proizvodac:
      manufacturer?.id_proizvodac || null,

    naziv:
      manufacturer?.naziv || '',

    kontakt_osoba:
      manufacturer?.kontakt_osoba || '',

    email:
      manufacturer?.email || '',

    telefon:
      manufacturer?.telefon || '',

    web:
      manufacturer?.web || ''
  })

  dialog.value = true
}


// ============================================================
// SPREMANJE PROIZVOĐAČA
// ============================================================

async function save() {

  if (!form.naziv.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Naziv proizvođača je obavezan.'
    })

    return
  }

  try {

    // Uređivanje postojećeg proizvođača
    if (form.id_proizvodac) {

      await api.put(
        `/proizvodaci/${form.id_proizvodac}`,
        form
      )

    }

    // Dodavanje novog proizvođača
    else {

      await api.post(
        '/proizvodaci',
        form
      )

    }

    $q.notify({
      type: 'positive',
      message: form.id_proizvodac
        ? 'Proizvođač je uspješno ažuriran.'
        : 'Proizvođač je uspješno dodan.'
    })

    dialog.value = false

    await load()

  } catch (error) {
    console.error(
      'Greška pri spremanju proizvođača:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Greška pri spremanju proizvođača.'
    })
  }
}


// ============================================================
// BRISANJE PROIZVOĐAČA
// ============================================================

async function remove(manufacturer) {

  const potvrda = confirm(
    `Obrisati proizvođača "${manufacturer.naziv}"?`
  )

  if (!potvrda) {
    return
  }

  try {

    await api.delete(
      `/proizvodaci/${manufacturer.id_proizvodac}`
    )

    $q.notify({
      type: 'positive',
      message:
        'Proizvođač je uspješno obrisan.'
    })

    await load()

  } catch (error) {
    console.error(
      'Greška pri brisanju proizvođača:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Brisanje proizvođača nije moguće.'
    })
  }
}


// ============================================================
// INICIJALNO UČITAVANJE
// ============================================================

onMounted(() => {
  load()
})
</script>