<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="text-h4 text-weight-bold q-mb-lg">
      Upravljanje narudžbama
    </div>

    <!-- TABLICA NARUDŽBI -->
    <q-card flat bordered>
      <q-table
        :rows="orders"
        :columns="columns"
        row-key="id_narudzba"
        :loading="loading"
        flat
      >

        <!-- UKUPNA CIJENA -->
        <template #body-cell-ukupno_sa_pdv="props">
          <q-td :props="props">
            <span class="text-weight-medium">
              {{ Number(props.value).toFixed(2) }} €
            </span>
          </q-td>
        </template>

        <!-- STATUS NARUDŽBE -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.status_boja || 'primary'"
              rounded
            >
              {{ props.row.status_naziv }}
            </q-badge>
          </q-td>
        </template>

        <!-- PROMJENA STATUSA -->
        <template #body-cell-akcije="props">
          <q-td :props="props">

            <q-select
              dense
              outlined
              :model-value="props.row.id_status_narudzbe"
              :options="statuses"
              option-label="naziv"
              option-value="id_status_narudzbe"
              emit-value
              map-options
              label="Status"
              @update:model-value="
                value => updateStatus(props.row, value)
              "
            />

          </q-td>
        </template>

      </q-table>
    </q-card>

  </q-page>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()


// ============================================================
// PODACI
// ============================================================

const orders = ref([])
const statuses = ref([])
const loading = ref(false)


// ============================================================
// STUPCI TABLICE
// ============================================================

const columns = [
  {
    name: 'broj_narudzbe',
    label: 'Broj narudžbe',
    field: 'broj_narudzbe',
    align: 'left',
    sortable: true
  },
  {
    name: 'korisnik_ime',
    label: 'Korisnik',
    field: 'korisnik_ime',
    sortable: true
  },
  {
    name: 'ukupno_sa_pdv',
    label: 'Ukupno',
    field: 'ukupno_sa_pdv',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status_naziv'
  },
  {
    name: 'datum_kreiranja',
    label: 'Datum',
    field: 'datum_kreiranja',
    sortable: true
  },
  {
    name: 'akcije',
    label: 'Promijeni status',
    field: 'id_narudzba'
  }
]


// ============================================================
// DOHVAT NARUDŽBI I STATUSA
// ============================================================

async function load() {
  loading.value = true

  try {
    const [ordersResponse, statusesResponse] =
      await Promise.all([
        api.get('/narudzbe', {
          params: {
            limit: 100
          }
        }),

        api.get('/statusi')
      ])

    orders.value =
      ordersResponse.data.data || ordersResponse.data

    statuses.value =
      statusesResponse.data

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju narudžbi:',
      error
    )

    $q.notify({
      type: 'negative',
      message: 'Nije moguće dohvatiti narudžbe.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// PROMJENA STATUSA NARUDŽBE
// ============================================================

async function updateStatus(order, statusId) {
  try {
    await api.put(
      `/narudzbe/${order.id_narudzba}/status`,
      {
        id_status_narudzbe: statusId
      }
    )

    $q.notify({
      type: 'positive',
      message: 'Status narudžbe je uspješno promijenjen.'
    })

    await load()

  } catch (error) {
    console.error(
      'Greška pri promjeni statusa:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Promjena statusa nije uspjela.'
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