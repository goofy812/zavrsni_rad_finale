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
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const items = ref([])
const loading = ref(false)

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

async function load() {
  loading.value = true

  try {
    const response = await api.get('/zaliha')
    items.value = response.data
  } catch (error) {
    console.error(error)

    $q.notify({
      type: 'negative',
      message: 'Nije moguće dohvatiti podatke o zalihi.'
    })
  } finally {
    loading.value = false
  }
}

function change(row, sign) {
  const akcija = sign === 1 ? 'dodaj' : 'umanji'

  $q.dialog({
    title: sign === 1 ? 'Dodaj na zalihu' : 'Umanji zalihu',
    message: 'Unesite količinu:',
    prompt: {
      model: '1',
      type: 'number'
    },
    cancel: true,
    persistent: true
  }).onOk(async (value) => {

    const kolicina = Number(value)

    if (!Number.isInteger(kolicina) || kolicina <= 0) {
      $q.notify({
        type: 'warning',
        message: 'Količina mora biti pozitivan cijeli broj.'
      })
      return
    }

    try {
      await api.post(`/zaliha/${row.id_zaliha}/${akcija}`, {
        kolicina
      })

      $q.notify({
        type: 'positive',
        message:
          sign === 1
            ? `Dodano ${kolicina} komada.`
            : `Umanjeno ${kolicina} komada.`
      })

      await load()

    } catch (error) {
      console.error(error)

      $q.notify({
        type: 'negative',
        message:
          error.response?.data?.message ||
          'Promjena zalihe nije uspjela.'
      })
    }
  })
}

onMounted(load)
</script>