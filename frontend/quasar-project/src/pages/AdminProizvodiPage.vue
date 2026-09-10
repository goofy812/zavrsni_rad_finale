<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV I DODAVANJE PROIZVODA -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">
          Upravljanje proizvodima
        </div>

        <div class="text-grey-7 q-mt-xs">
          Pregled, uređivanje i brisanje proizvoda.
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Dodaj proizvod"
        to="/admin/proizvodi/dodaj"
      />
    </div>

    <!-- TABLICA PROIZVODA -->
    <q-card flat bordered>
      <q-table
        :rows="products"
        :columns="columns"
        row-key="id_proizvod"
        :loading="loading"
        flat
      >

        <!-- CIJENA -->
        <template #body-cell-cijena="props">
          <q-td :props="props">
            <span class="text-weight-medium">
              {{ Number(props.value).toFixed(2) }} €
            </span>
          </q-td>
        </template>

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

        <!-- AKCIJE -->
        <template #body-cell-akcije="props">
          <q-td :props="props">

            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              @click="
                $router.push(
                  `/admin/proizvodi/${props.row.id_proizvod}`
                )
              "
            >
              <q-tooltip>
                Uredi proizvod
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
                Obriši proizvod
              </q-tooltip>
            </q-btn>

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

const products = ref([])
const loading = ref(false)


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
    name: 'sifra',
    label: 'Šifra',
    field: 'sifra'
  },
  {
    name: 'cijena',
    label: 'Cijena',
    field: 'cijena',
    sortable: true
  },
  {
    name: 'kategorija_naziv',
    label: 'Kategorija',
    field: 'kategorija_naziv'
  },
  {
    name: 'proizvodac_naziv',
    label: 'Proizvođač',
    field: 'proizvodac_naziv'
  },
  {
    name: 'aktivan',
    label: 'Status',
    field: 'aktivan'
  },
  {
    name: 'akcije',
    label: 'Akcije',
    field: 'id_proizvod'
  }
]


// ============================================================
// DOHVAT PROIZVODA
// ============================================================

async function load() {
  loading.value = true

  try {
    const response = await api.get('/proizvodi', {
      params: {
        limit: 100
      }
    })

    products.value = response.data.data || response.data

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju proizvoda:',
      error
    )

    $q.notify({
      type: 'negative',
      message: 'Nije moguće dohvatiti proizvode.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// BRISANJE PROIZVODA
// ============================================================

async function remove(product) {
  const potvrda = confirm(
    `Obrisati proizvod "${product.naziv}"?`
  )

  if (!potvrda) {
    return
  }

  try {
    await api.delete(
      `/proizvodi/${product.id_proizvod}`
    )

    $q.notify({
      type: 'positive',
      message: 'Proizvod je uspješno obrisan.'
    })

    await load()

  } catch (error) {
    console.error(
      'Greška pri brisanju proizvoda:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Brisanje proizvoda nije uspjelo.'
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