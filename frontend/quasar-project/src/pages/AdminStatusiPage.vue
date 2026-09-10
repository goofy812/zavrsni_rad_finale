<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV I DODAVANJE STATUSA -->
    <div class="row items-center justify-between q-mb-lg">

      <div>
        <div class="text-h4 text-weight-bold">
          Upravljanje statusima narudžbi
        </div>

        <div class="text-grey-7 q-mt-xs">
          Pregled, dodavanje, uređivanje i brisanje statusa narudžbi.
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Dodaj status"
        @click="open()"
      />

    </div>


    <!-- TABLICA STATUSA -->
    <q-card flat bordered>

      <q-table
        :rows="items"
        :columns="columns"
        row-key="id_status_narudzbe"
        :loading="loading"
        flat
      >

        <!-- STATUS -->
        <template #body-cell-aktivan="props">
          <q-td :props="props">

            <q-badge
              :color="props.value ? 'positive' : 'negative'"
              rounded
            >
              {{ props.value ? 'Aktivan' : 'Neaktivan' }}
            </q-badge>

          </q-td>
        </template>


        <!-- BOJA -->
        <template #body-cell-boja="props">
          <q-td :props="props">

            <div class="row items-center q-gutter-sm">

              <q-badge
                v-if="props.value"
                :style="{
                  backgroundColor: props.value
                }"
              >
                {{ props.value }}
              </q-badge>

              <span v-else class="text-grey-6">
                Nije definirana
              </span>

            </div>

          </q-td>
        </template>


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
                Uredi status
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
                Obriši status
              </q-tooltip>
            </q-btn>

          </q-td>
        </template>

      </q-table>

    </q-card>


    <!-- DIJALOG ZA DODAVANJE / UREĐIVANJE -->
    <q-dialog v-model="dialog">

      <q-card
        style="min-width: 400px; width: 500px"
      >

        <!-- NASLOV -->
        <q-card-section>

          <div class="text-h6 text-weight-bold">
            {{
              form.id_status_narudzbe
                ? 'Uredi status'
                : 'Dodaj status'
            }}
          </div>

        </q-card-section>


        <!-- FORMA -->
        <q-card-section class="q-gutter-md">

          <q-input
            v-model="form.naziv"
            label="Naziv *"
            outlined
            autofocus
          />

          <q-input
            v-model="form.opis"
            label="Opis"
            outlined
          />

          <q-input
            v-model.number="form.redoslijed"
            type="number"
            label="Redoslijed"
            outlined
          />

          <q-input
            v-model="form.boja"
            label="Boja"
            outlined
            hint="Primjer: primary, positive ili negative"
          />

          <q-toggle
            v-model="form.aktivan"
            label="Aktivan"
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
// PODACI O STATUSU
// ============================================================

const form = reactive({
  id_status_narudzbe: null,
  naziv: '',
  opis: '',
  redoslijed: 0,
  boja: '',
  aktivan: true
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
    name: 'redoslijed',
    label: 'Redoslijed',
    field: 'redoslijed',
    sortable: true
  },
  {
    name: 'boja',
    label: 'Boja',
    field: 'boja'
  },
  {
    name: 'aktivan',
    label: 'Status',
    field: 'aktivan'
  },
  {
    name: 'akcije',
    label: 'Akcije',
    field: 'id_status_narudzbe'
  }
]


// ============================================================
// DOHVAT STATUSA
// ============================================================

async function load() {
  loading.value = true

  try {
    const response = await api.get('/statusi')

    items.value = response.data

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju statusa:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        'Nije moguće dohvatiti statuse narudžbi.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// OTVARANJE DIJALOGA
// ============================================================

function open(status = null) {
  Object.assign(form, {
    id_status_narudzbe:
      status?.id_status_narudzbe || null,

    naziv:
      status?.naziv || '',

    opis:
      status?.opis || '',

    redoslijed:
      status?.redoslijed || 0,

    boja:
      status?.boja || '',

    aktivan:
      status?.aktivan !== false
  })

  dialog.value = true
}


// ============================================================
// SPREMANJE STATUSA
// ============================================================

async function save() {

  if (!form.naziv.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Naziv statusa je obavezan.'
    })

    return
  }

  try {

    // Uređivanje postojećeg statusa
    if (form.id_status_narudzbe) {

      await api.put(
        `/statusi/${form.id_status_narudzbe}`,
        form
      )

    }

    // Dodavanje novog statusa
    else {

      await api.post(
        '/statusi',
        form
      )

    }

    $q.notify({
      type: 'positive',
      message: form.id_status_narudzbe
        ? 'Status je uspješno ažuriran.'
        : 'Status je uspješno dodan.'
    })

    dialog.value = false

    await load()

  } catch (error) {
    console.error(
      'Greška pri spremanju statusa:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Greška pri spremanju statusa.'
    })
  }
}


// ============================================================
// BRISANJE STATUSA
// ============================================================

async function remove(status) {

  const potvrda = confirm(
    `Obrisati status "${status.naziv}"?`
  )

  if (!potvrda) {
    return
  }

  try {

    await api.delete(
      `/statusi/${status.id_status_narudzbe}`
    )

    $q.notify({
      type: 'positive',
      message:
        'Status je uspješno obrisan.'
    })

    await load()

  } catch (error) {
    console.error(
      'Greška pri brisanju statusa:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Brisanje statusa nije moguće.'
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