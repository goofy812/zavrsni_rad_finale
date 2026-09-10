<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV I DODAVANJE KATEGORIJE -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">
          Upravljanje kategorijama
        </div>

        <div class="text-grey-7 q-mt-xs">
          Pregled, dodavanje, uređivanje i brisanje kategorija.
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Dodaj kategoriju"
        @click="open()"
      />
    </div>


    <!-- KATEGORIJE -->
    <div class="row q-col-gutter-md">

      <div
        v-for="item in items"
        :key="item.id_kategorija"
        class="col-12 col-sm-6 col-md-4"
      >

        <q-card
          flat
          bordered
          class="full-height"
        >

          <!-- PODACI O KATEGORIJI -->
          <q-card-section>

            <div class="text-h6 text-weight-bold">
              {{ item.naziv }}
            </div>

            <div class="text-caption text-grey-7 q-mt-sm">
              {{ item.opis || 'Bez opisa' }}
            </div>

          </q-card-section>


          <!-- AKCIJE -->
          <q-card-actions align="right">

            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="open(item)"
            >
              <q-tooltip>
                Uredi kategoriju
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="remove(item)"
            >
              <q-tooltip>
                Obriši kategoriju
              </q-tooltip>
            </q-btn>

          </q-card-actions>

        </q-card>

      </div>

    </div>


    <!-- DIJALOG ZA DODAVANJE / UREĐIVANJE -->
    <q-dialog v-model="dialog">

      <q-card style="min-width: 360px; width: 500px">

        <!-- NASLOV -->
        <q-card-section>

          <div class="text-h6 text-weight-bold">
            {{ form.id_kategorija
              ? 'Uredi kategoriju'
              : 'Dodaj kategoriju'
            }}
          </div>

        </q-card-section>


        <!-- FORMA -->
        <q-card-section>

          <q-input
            v-model="form.naziv"
            label="Naziv *"
            outlined
            autofocus
          />

          <q-input
            v-model="form.opis"
            label="Opis"
            type="textarea"
            outlined
            class="q-mt-md"
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

const form = reactive({
  id_kategorija: null,
  naziv: '',
  opis: ''
})


// ============================================================
// DOHVAT KATEGORIJA
// ============================================================

async function load() {
  try {
    const response = await api.get('/kategorije')

    items.value = response.data

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju kategorija:',
      error
    )

    $q.notify({
      type: 'negative',
      message: 'Nije moguće dohvatiti kategorije.'
    })
  }
}


// ============================================================
// OTVARANJE DIJALOGA
// ============================================================

function open(category = null) {
  Object.assign(form, {
    id_kategorija:
      category?.id_kategorija || null,

    naziv:
      category?.naziv || '',

    opis:
      category?.opis || ''
  })

  dialog.value = true
}


// ============================================================
// SPREMANJE KATEGORIJE
// ============================================================

async function save() {

  // Provjera obaveznog naziva
  if (!form.naziv.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Naziv kategorije je obavezan.'
    })

    return
  }

  try {

    // Uređivanje postojeće kategorije
    if (form.id_kategorija) {

      await api.put(
        `/kategorije/${form.id_kategorija}`,
        form
      )

    }

    // Dodavanje nove kategorije
    else {

      await api.post(
        '/kategorije',
        form
      )

    }

    $q.notify({
      type: 'positive',
      message: form.id_kategorija
        ? 'Kategorija je uspješno ažurirana.'
        : 'Kategorija je uspješno dodana.'
    })

    dialog.value = false

    await load()

  } catch (error) {
    console.error(
      'Greška pri spremanju kategorije:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Greška pri spremanju kategorije.'
    })
  }
}


// ============================================================
// BRISANJE KATEGORIJE
// ============================================================

async function remove(category) {

  const potvrda = confirm(
    `Obrisati kategoriju "${category.naziv}"?`
  )

  if (!potvrda) {
    return
  }

  try {

    await api.delete(
      `/kategorije/${category.id_kategorija}`
    )

    $q.notify({
      type: 'positive',
      message: 'Kategorija je uspješno obrisana.'
    })

    await load()

  } catch (error) {
    console.error(
      'Greška pri brisanju kategorije:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Brisanje kategorije nije moguće.'
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