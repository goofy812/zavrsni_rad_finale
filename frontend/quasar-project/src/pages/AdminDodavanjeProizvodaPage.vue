<template>
  <q-page class="q-pa-lg"><div class="text-h4 q-mb-lg">{{ editing ? 'Uredi proizvod' : 'Dodaj proizvod' }}</div>
    <q-form @submit.prevent="save" class="q-gutter-md" style="max-width: 900px">
      <div class="row q-col-gutter-md"><q-input class="col-8" v-model="form.naziv" label="Naziv *" outlined /><q-input class="col-4" v-model="form.sifra" label="Šifra *" outlined /></div>
      <q-input v-model="form.opis" type="textarea" label="Opis" outlined />
      <div class="row q-col-gutter-md"><q-input class="col-4" v-model.number="form.cijena" type="number" step="0.01" label="Cijena *" outlined /><q-input class="col-4" v-model="form.jedinica_mjere" label="Jedinica mjere" outlined /><q-input class="col-4" v-model.number="form.tezina" type="number" step="0.001" label="Težina" outlined /></div>
      <div class="row q-col-gutter-md"><q-select class="col-6" v-model="form.id_kategorija" :options="categories" option-label="naziv" option-value="id_kategorija" emit-value map-options label="Kategorija *" outlined /><q-select class="col-6" v-model="form.id_proizvodac" :options="manufacturers" option-label="naziv" option-value="id_proizvodac" emit-value map-options label="Proizvođač *" outlined /></div>
      <q-input v-model="form.dimenzije" label="Dimenzije" outlined /><q-input v-model="form.namjena" label="Namjena" outlined /><q-input v-model="form.slika_url" label="URL slike" outlined />
      <q-toggle v-model="form.aktivan" label="Aktivan" />
      <div><q-btn type="submit" color="primary" :loading="loading" :label="editing ? 'Spremi' : 'Dodaj'" class="q-mr-sm" /><q-btn flat label="Odustani" to="/admin/proizvodi" /></div>
    </q-form>
  </q-page>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'; import { useRoute, useRouter } from 'vue-router'; import { useQuasar } from 'quasar'; import { api } from 'boot/axios';
const route = useRoute(); const router = useRouter(); const $q = useQuasar(); const loading = ref(false); const categories = ref([]); const manufacturers = ref([]);
const editing = computed(() => !!route.params.id);
const form = reactive({ naziv:'', opis:'', sifra:'', cijena:0, jedinica_mjere:'kom', tezina:null, dimenzije:'', namjena:'', slika_url:'', id_kategorija:null, id_proizvodac:null, aktivan:true });
async function load() { const [c,m] = await Promise.all([api.get('/kategorije'), api.get('/proizvodaci/simple')]); categories.value=c.data; manufacturers.value=m.data; if (editing.value) { const r=await api.get(`/proizvodi/${route.params.id}`); Object.assign(form, r.data.data || r.data); } }
async function save() { loading.value=true; try { if (editing.value) await api.put(`/proizvodi/${route.params.id}`, form); else await api.post('/proizvodi', form); $q.notify({ type:'positive', message:'Proizvod je spremljen.' }); router.push('/admin/proizvodi'); } catch(e) { $q.notify({ type:'negative', message:e.response?.data?.message || 'Spremanje nije uspjelo.' }); } finally { loading.value=false; } }
onMounted(load);
</script>
