<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="text-h4 text-weight-bold q-mb-lg">
      Upravljanje zalihom
    </div>

    <div class="text-grey-7 q-mb-lg">
      Pregled količine proizvoda na skladištu i ažuriranje stanja zalihe.
    </div>


    <!-- TABLICA ZALIHE -->
    <q-card flat bordered>

      <q-table
        :rows="items"
        :columns="columns"
        row-key="id_zaliha"
        :loading="loading"
        flat
      >

        <!-- KOLIČINA -->
        <template #body-cell-kolicina="props">
          <q-td :props="props">
            <span class="text-weight-medium">
              {{ props.value }}
              {{ props.row.jedinica_mjere || '' }}
            </span>
          </q-td>
        </template>


        <!-- MINIMALNA KOLIČINA -->
        <template #body-cell-minimalna_kolicina="props">
          <q-td :props="props">

            <span
              :class="
                Number(props.value) >= Number(props.row.kolicina)
                  ? 'text-negative text-weight-bold'
                  : ''
              "
            >
              {{ props.value }}
            </span>

          </q-td>
        </template>


        <!-- AKCIJE -->
        <template #body-cell-akcije="props">
          <q-td :props="props">

            <q-btn
              flat
              round
              color="positive"
              icon="add"
              @click="change(props.row, 1)"
            >
              <q-tooltip>
                Dodaj na zalihu
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              color="negative"
              icon="remove"
              @click="change(props.row, -1)"
            >
              <q-tooltip>
                Umanji zalihu
              </q-tooltip>
            </q-btn>

          </q-td>
        </template>

      </q-table>

    </q-card>

  </q-page>
</template>


<script setup>
import {
  onMounted,
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

const loading = ref(false)


// ============================================================
// STUPCI TABLICE
// ============================================================

const columns = [
  {
    name: 'proizvod_naziv',
    label: 'Proizvod',
    field: 'proizvod_naziv',
    align: 'left',
    sortable: true
  },
  {
    name: 'sifra',
    label: 'Šifra',
    field: 'sifra'
  },
  {
    name: 'kolicina',
    label: 'Količina',
    field: 'kolicina',
    sortable: true
  },
  {
    name: 'minimalna_kolicina',
    label: 'Minimum',
    field: 'minimalna_kolicina',
    sortable: true
  },
  {
    name: 'lokacija_skladista',
    label: 'Lokacija',
    field: 'lokacija_skladista'
  },
  {
    name: 'akcije',
    label: 'Akcije',
    field: 'id_zaliha'
  }
]


// ============================================================
// DOHVAT ZALIHE
// ============================================================

async function load() {
  loading.value = true

  try {
    const response = await api.get('/zaliha')

    items.value = response.data

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju zalihe:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        'Nije moguće dohvatiti podatke o zalihi.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// PROMJENA KOLIČINE ZALIHE
// ============================================================

async function change(row, sign) {

  const amount = prompt(
    sign > 0
      ? 'Unesite količinu za dodavanje:'
      : 'Unesite količinu za umanjivanje:',
    '1'
  )

  if (amount === null) {
    return
  }

  const quantity = Number(amount)

  if (
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    $q.notify({
      type: 'warning',
      message:
        'Količina mora biti pozitivan broj.'
    })

    return
  }

  $q.loading.show()

  try {

    const action =
      sign > 0
        ? 'dodaj'
        : 'umanji'

    await api.post(
      `/zaliha/${row.id_zaliha}/${action}`,
      {
        kolicina: quantity
      }
    )

    $q.notify({
      type: 'positive',
      message:
        sign > 0
          ? 'Zaliha je uspješno povećana.'
          : 'Zaliha je uspješno umanjena.'
    })

    await load()

  } catch (error) {
    console.error(
      'Greška pri promjeni zalihe:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Promjena zalihe nije uspjela.'
    })

  } finally {
    $q.loading.hide()
  }
}


// ============================================================
// INICIJALNO UČITAVANJE
// ============================================================

onMounted(() => {
  load()
})
</script>