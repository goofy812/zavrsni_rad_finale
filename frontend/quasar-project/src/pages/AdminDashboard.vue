<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="text-h4 text-weight-bold q-mb-xs">
      Administratorska nadzorna ploča
    </div>

    <div class="text-grey-7 q-mb-lg">
      Pregled osnovnih podataka i aktivnosti sustava TeraBuild.
    </div>

    <!-- STATISTIKA -->
    <div class="row q-col-gutter-md">

      <!-- KORISNICI -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-grey-7">Korisnici</div>

            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ statistika.korisnici }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- PROIZVODI -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-grey-7">Proizvodi</div>

            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ statistika.proizvodi }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- NARUDŽBE -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-grey-7">Narudžbe</div>

            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ statistika.narudzbe }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- RECENZIJE -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-grey-7">Recenzije</div>

            <div class="text-h4 text-weight-bold q-mt-sm">
              {{ statistika.recenzije }}
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- GREŠKA -->
    <q-banner
      v-if="greska"
      class="bg-red-1 text-red q-mt-lg"
      rounded
    >
      {{ greska }}
    </q-banner>

    <!-- BRZE AKCIJE -->
    <div class="text-h5 text-weight-bold q-mt-xl q-mb-md">
      Brze akcije
    </div>

    <div class="row q-col-gutter-md">

      <!-- PROIZVODI -->
      <div class="col-12 col-sm-4">
        <q-btn
          unelevated
          color="primary"
          icon="inventory_2"
          label="Upravljanje proizvodima"
          class="full-width"
          size="lg"
          @click="goTo('/admin/proizvodi')"
        />
      </div>

      <!-- KORISNICI -->
      <div class="col-12 col-sm-4">
        <q-btn
          unelevated
          color="primary"
          icon="people"
          label="Upravljanje korisnicima"
          class="full-width"
          size="lg"
          @click="goTo('/admin/korisnici')"
        />
      </div>

      <!-- NARUDŽBE -->
      <div class="col-12 col-sm-4">
        <q-btn
          unelevated
          color="primary"
          icon="shopping_cart"
          label="Upravljanje narudžbama"
          class="full-width"
          size="lg"
          @click="goTo('/admin/narudzbe')"
        />
      </div>

    </div>

    <!-- INFORMACIJE -->
    <div class="row q-col-gutter-md q-mt-lg">

      <!-- ZALIHA -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>

            <div class="text-h6 text-weight-bold">
              Stanje zaliha
            </div>

            <div class="q-mt-md">
              <div class="text-grey-7">
                Proizvodi s niskom zalihom
              </div>

              <div class="text-h4 text-weight-bold q-mt-sm">
                {{ statistika.niskaZaliha }}
              </div>
            </div>

          </q-card-section>
        </q-card>
      </div>

      <!-- SUSTAV -->
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-card-section>

            <div class="text-h6 text-weight-bold">
              Sustav
            </div>

            <div class="q-mt-md">
              <q-badge
                color="positive"
                label="Sustav aktivan"
              />
            </div>

            <div class="text-grey-7 q-mt-md">
              Administratorski dio aplikacije TeraBuild.
            </div>

          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- ZADNJI PROIZVOD -->
    <div
      v-if="zadnjiProizvod"
      class="row q-mt-lg"
    >
      <div class="col-12">

        <q-card flat bordered>
          <q-card-section>

            <div class="text-h6 text-weight-bold">
              Najnoviji proizvod
            </div>

            <div class="text-h5 q-mt-md">
              {{ zadnjiProizvod.naziv }}
            </div>

            <div class="text-grey-7 q-mt-sm">
              {{ zadnjiProizvod.opis }}
            </div>

            <div class="text-weight-bold q-mt-md">
              {{ zadnjiProizvod.cijena }}
            </div>

          </q-card-section>
        </q-card>

      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const statistika = ref({
  korisnici: 0,
  proizvodi: 0,
  narudzbe: 0,
  recenzije: 0,
  niskaZaliha: 0
})

const zadnjiProizvod = ref(null)

const greska = ref('')

function goTo(path) {
  router.push(path)
}

async function ucitajStatistiku() {
  try {
    greska.value = ''

    const response = await axios.get(
      'http://localhost:3000/api/admin/dashboard'
    )

    console.log('DASHBOARD PODACI:', response.data)

    const podaci = response.data

    statistika.value.korisnici =
      Number(podaci.broj_korisnika ?? 0)

    statistika.value.proizvodi =
      Number(podaci.broj_proizvoda ?? 0)

    statistika.value.narudzbe =
      Number(podaci.broj_narudzbi ?? 0)

    statistika.value.recenzije =
      Number(podaci.broj_recenzija ?? 0)

    statistika.value.niskaZaliha =
      Number(podaci.niska_zaliha ?? 0)

    zadnjiProizvod.value = podaci.naziv_proizvoda
      ? {
          naziv: podaci.naziv_proizvoda,
          opis: podaci.opis,
          cijena: podaci.cijena
        }
      : null

  } catch (error) {
    console.error(
      'Greška pri dohvaćanju statistike:',
      error
    )

    greska.value =
      'Nije moguće dohvatiti podatke administratorske ploče.'
  }
}

onMounted(() => {
  ucitajStatistiku()
})
</script>