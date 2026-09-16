<template>
  <q-page class="admin-products-page q-pa-lg">

    <!-- NASLOV -->
    <div class="page-header q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold">
          Upravljanje proizvodima
        </div>

        <div class="text-grey-5 q-mt-xs">
          Pregled, uređivanje i upravljanje statusom proizvoda.
        </div>
      </div>

      <q-btn
        color="primary"
        icon="add"
        label="Dodaj proizvod"
        to="/admin/proizvodi/dodaj"
        unelevated
      />
    </div>

    <!-- TABLICA -->
    <q-card flat bordered class="products-card">

      <q-table
        :rows="products"
        :columns="columns"
        row-key="id_proizvod"
        :loading="loading"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
        no-data-label="Nema proizvoda za prikaz."
        no-results-label="Nema pronađenih proizvoda."
      >

        <!-- CIJENA -->
        <template #body-cell-cijena="props">
          <q-td :props="props">
            <span class="text-weight-medium">
              {{ formatPrice(props.row.cijena) }} €
            </span>
          </q-td>
        </template>


        <!-- STATUS -->
        <template #body-cell-aktivan="props">
          <q-td :props="props">

            <q-badge
              :color="Number(props.row.aktivan) === 1 ? 'positive' : 'negative'"
              rounded
              class="status-badge"
            >
              <q-icon
                :name="
                  Number(props.row.aktivan) === 1
                    ? 'check_circle'
                    : 'cancel'
                "
                size="14px"
                class="q-mr-xs"
              />

              {{
                Number(props.row.aktivan) === 1
                  ? 'Aktivan'
                  : 'Nije aktivan'
              }}
            </q-badge>

          </q-td>
        </template>


        <!-- AKCIJE -->
        <template #body-cell-akcije="props">
          <q-td :props="props">

            <div class="action-buttons">

              <!-- UREDI -->
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                @click="editProduct(props.row)"
              >
                <q-tooltip>
                  Uredi proizvod
                </q-tooltip>
              </q-btn>
              
              <!-- BRISANJE -->
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

            </div>

          </q-td>
        </template>

      </q-table>

    </q-card>

  </q-page>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const $q = useQuasar()
const router = useRouter()


// ============================================================
// PODACI
// ============================================================

const products = ref([])
const loading = ref(false)


// ============================================================
// STUPCI
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
    field: 'sifra',
    align: 'left'
  },

  {
    name: 'cijena',
    label: 'Cijena',
    field: 'cijena',
    align: 'right',
    sortable: true
  },

  {
    name: 'kategorija_naziv',
    label: 'Kategorija',
    field: 'kategorija_naziv',
    align: 'left'
  },

  {
    name: 'proizvodac_naziv',
    label: 'Proizvođač',
    field: 'proizvodac_naziv',
    align: 'left'
  },

  {
    name: 'aktivan',
    label: 'Status',
    field: 'aktivan',
    align: 'center',
    sortable: true
  },

  {
    name: 'akcije',
    label: 'Akcije',
    field: 'id_proizvod',
    align: 'center'
  }
]


// ============================================================
// FORMAT CIJENE
// ============================================================

function formatPrice(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return '0.00'
  }

  return number.toFixed(2)
}


// ============================================================
// DOHVAT SVIH PROIZVODA ZA ADMINA
// ============================================================

async function load() {
  loading.value = true

  try {

    /*
     * VAŽNO:
     *
     * Ne koristimo /proizvodi jer ta javna ruta
     * vraća samo aktivne proizvode.
     *
     * Admin koristi posebnu rutu koja vraća
     * AKTIVNE I NEAKTIVNE proizvode.
     */

    const response = await api.get('/proizvodi/admin/svi')

    const data = response.data?.data

    products.value = Array.isArray(data)
      ? data
      : []

  } catch (error) {

    console.error(
      'Greška pri dohvaćanju proizvoda:',
      error
    )

    $q.notify({
      type: 'negative',
      message:
        error.response?.data?.message ||
        'Nije moguće dohvatiti proizvode.'
    })

  } finally {
    loading.value = false
  }
}


// ============================================================
// UREĐIVANJE PROIZVODA
// ============================================================

function editProduct(product) {

  router.push(
    `/admin/proizvodi/${product.id_proizvod}`
  )
}

// ============================================================
// DEAKTIVACIJA PROIZVODA
// ============================================================

async function remove(product) {

  const confirmed = confirm(
    `Deaktivirati proizvod "${product.naziv}"?`
  )

  if (!confirmed) {
    return
  }


  try {

    /*
     * DELETE u backendu je soft delete:
     *
     * aktivan = 0
     *
     * Proizvod se NE briše fizički iz baze.
     */

    await api.delete(
      `/proizvodi/${product.id_proizvod}`
    )


    $q.notify({
      type: 'warning',
      message: 'Proizvod je deaktiviran.'
    })


    // Bitno: učitavamo ADMIN popis,
    // pa proizvod ostaje vidljiv.
    await load()

  } catch (error) {

    console.error(
      'Greška pri deaktiviranju proizvoda:',
      error
    )

    $q.notify({
      type: 'negative',

      message:
        error.response?.data?.message ||
        'Deaktiviranje proizvoda nije uspjelo.'
    })
  }
}


// ============================================================
// INIT
// ============================================================

onMounted(() => {
  load()
})
</script>


<style scoped>

.admin-products-page {
  min-height: calc(100vh - 64px);
  background: #17191b;
  color: white;
}


.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}


.products-card {
  background: #191b1d;
  border-color: #34383c;
  border-radius: 14px;
  overflow: hidden;
}


/* Q-TABLE */

.products-card :deep(.q-table__container) {
  background: #191b1d;
  color: #f5f5f5;
}


.products-card :deep(thead tr) {
  background: #222528;
}


.products-card :deep(thead th) {
  color: #cfd3d6;
  font-weight: 600;
  font-size: 13px;
}


.products-card :deep(tbody tr) {
  background: #191b1d;
}


.products-card :deep(tbody tr:hover) {
  background: #24282b;
}


.products-card :deep(td) {
  border-color: #303438;
}


.products-card :deep(.q-table__bottom) {
  background: #191b1d;
  color: #aaa;
  border-color: #303438;
}


/* STATUS */

.status-badge {
  padding: 6px 10px;
  font-size: 12px;
}


/* AKCIJE */

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}


/* RESPONSIVE */

@media (max-width: 800px) {

  .admin-products-page {
    padding: 16px !important;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-header .q-btn {
    width: 100%;
  }

}

</style>