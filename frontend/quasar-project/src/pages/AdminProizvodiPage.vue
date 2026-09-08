<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h4">Upravljanje proizvodima</div>
      <q-btn color="primary" icon="add" label="Dodaj proizvod" to="/admin/proizvodi/dodaj" />
    </div>
    <q-table :rows="products" :columns="columns" row-key="id_proizvod" :loading="loading">
      <template #body-cell-cijena="props"><q-td :props="props">{{ Number(props.value).toFixed(2) }} €</q-td></template>
      <template #body-cell-aktivan="props"><q-td :props="props"><q-badge :color="props.value ? 'positive' : 'negative'">{{ props.value ? 'Aktivan' : 'Neaktivan' }}</q-badge></q-td></template>
      <template #body-cell-akcije="props">
        <q-td :props="props"><q-btn flat round icon="edit" @click="$router.push(`/admin/proizvodi/${props.row.id_proizvod}`)" /><q-btn flat round color="negative" icon="delete" @click="remove(props.row)" /></q-td>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
const $q = useQuasar();
const products = ref([]); const loading = ref(false);
const columns = [
  { name: 'naziv', label: 'Naziv', field: 'naziv', align: 'left', sortable: true },
  { name: 'sifra', label: 'Šifra', field: 'sifra' },
  { name: 'cijena', label: 'Cijena', field: 'cijena', sortable: true },
  { name: 'kategorija_naziv', label: 'Kategorija', field: 'kategorija_naziv' },
  { name: 'proizvodac_naziv', label: 'Proizvođač', field: 'proizvodac_naziv' },
  { name: 'aktivan', label: 'Status', field: 'aktivan' },
  { name: 'akcije', label: 'Akcije', field: 'id_proizvod' },
];
async function load() { loading.value = true; try { const r = await api.get('/proizvodi', { params: { limit: 100 } }); products.value = r.data.data || r.data; } finally { loading.value = false; } }
async function remove(row) { if (!confirm(`Obrisati proizvod "${row.naziv}"?`)) return; try { await api.delete(`/proizvodi/${row.id_proizvod}`); $q.notify({ type: 'positive', message: 'Proizvod obrisan.' }); await load(); } catch (e) { $q.notify({ type: 'negative', message: e.response?.data?.message || 'Brisanje nije uspjelo.' }); } }
onMounted(load);
</script>
