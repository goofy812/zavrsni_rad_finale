<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="text-h4 text-weight-bold q-mb-md">
      Moje narudžbe
    </div>

    <div class="text-grey-7 q-mb-lg">
      Pregled i povijest vaših narudžbi
    </div>

    <!-- KALENDAR -->
    <div class="row items-center q-gutter-sm q-mb-lg">

      <q-btn
        color="primary"
        icon="event"
        label="Odaberi datum"
        @click="otvoriKalendar"
      />

      <div v-if="odabraniDatum">
        Odabrani datum:
        <strong>{{ odabraniDatum }}</strong>
      </div>

      <q-btn
        v-if="odabraniDatum"
        flat
        icon="close"
        label="Prikaži sve"
        @click="prikaziSve"
      />

    </div>


    <!-- KALENDAR -->
    <q-dialog v-model="kalendarOtvoren">

      <q-card>

        <q-card-section>
          <div class="text-h6">
            Odaberi datum
          </div>

          <div class="text-grey-7">
            Zeleno označeni datumi imaju narudžbe.
          </div>
        </q-card-section>

        <q-card-section>

          <q-date
            v-model="odabraniDatum"
            mask="YYYY-MM-DD"
            :events="datumiNarudzbi"
            event-color="positive"
            today-btn
            @update:model-value="odaberiDatum"
          />

        </q-card-section>

        <q-card-actions align="right">

          <q-btn
            flat
            label="Prikaži sve"
            @click="prikaziSve"
          />

          <q-btn
            flat
            label="Zatvori"
            v-close-popup
          />

        </q-card-actions>

      </q-card>

    </q-dialog>


    <!-- NASLOV POPISA -->
    <div class="text-h5 text-weight-bold q-mb-md">
      {{ odabraniDatum
        ? 'Narudžbe odabranog datuma'
        : 'Povijest narudžbi'
      }}
    </div>


    <!-- NARUDŽBE -->
    <div v-if="filtriraneNarudzbe.length">

      <q-card
        v-for="order in filtriraneNarudzbe"
        :key="order.id_narudzba"
        class="q-mb-md"
        flat
        bordered
        clickable
        @click="otvoriNarudzbu(order.id_narudzba)"
      >

        <q-card-section>

          <div class="row items-center justify-between">

            <!-- LIJEVO -->
            <div>

              <div class="text-h6">
                {{ order.broj_narudzbe }}
              </div>

              <div class="text-grey-7 q-mt-sm">
                {{ new Date(order.datum_kreiranja).toLocaleString('hr-HR') }}
              </div>

              <div class="text-grey-7 q-mt-sm">
                {{ order.broj_stavki }} stavki
              </div>

            </div>


            <!-- DESNO -->
            <div class="text-right">

              <q-badge
                :color="order.status_boja || 'primary'"
              >
                {{ order.status_naziv }}
              </q-badge>

              <div class="text-h6 q-mt-sm">
                {{ Number(order.ukupno_sa_pdv).toFixed(2) }} €
              </div>

              <div class="text-primary q-mt-sm">
                Pregled narudžbe →
              </div>

            </div>

          </div>

        </q-card-section>

      </q-card>

    </div>


    <!-- NEMA NARUDŽBI -->
    <q-card
      v-else
      flat
      bordered
      class="q-pa-xl text-center"
    >

      <q-icon
        name="event_busy"
        size="60px"
        color="grey"
      />

      <div class="text-h6 q-mt-md">
        {{ odabraniDatum
          ? 'Nema narudžbi za odabrani datum'
          : 'Još nemate narudžbi'
        }}
      </div>

      <q-btn
        v-if="odabraniDatum"
        flat
        color="primary"
        label="Prikaži sve narudžbe"
        class="q-mt-md"
        @click="prikaziSve"
      />

    </q-card>

  </q-page>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const router = useRouter()


// =====================================================
// PODACI
// =====================================================

const orders = ref([])

const odabraniDatum = ref(null)

const kalendarOtvoren = ref(false)


// =====================================================
// DATUMI KOJI IMAJU NARUDŽBU
// =====================================================

const datumiNarudzbi = computed(() => {

  return [
    ...new Set(
      orders.value.map(order => {

        const datum =
          new Date(order.datum_kreiranja)

        const godina =
          datum.getFullYear()

        const mjesec =
          String(datum.getMonth() + 1)
            .padStart(2, '0')

        const dan =
          String(datum.getDate())
            .padStart(2, '0')

        return `${godina}-${mjesec}-${dan}`

      })
    )
  ]

})


// =====================================================
// FILTRIRANE NARUDŽBE
// =====================================================

const filtriraneNarudzbe = computed(() => {

  // Ako nije odabran datum,
  // prikaži sve narudžbe
  if (!odabraniDatum.value) {
    return orders.value
  }

  // Ako je odabran datum,
  // prikaži samo narudžbe tog datuma
  return orders.value.filter(order => {

    const datum =
      new Date(order.datum_kreiranja)

    const godina =
      datum.getFullYear()

    const mjesec =
      String(datum.getMonth() + 1)
        .padStart(2, '0')

    const dan =
      String(datum.getDate())
        .padStart(2, '0')

    const datumNarudzbe =
      `${godina}-${mjesec}-${dan}`

    return datumNarudzbe === odabraniDatum.value

  })

})


// =====================================================
// OTVORI KALENDAR
// =====================================================

function otvoriKalendar() {

  kalendarOtvoren.value = true

}


// =====================================================
// ODABIR DATUMA
// =====================================================

function odaberiDatum(datum) {

  odabraniDatum.value = datum

  kalendarOtvoren.value = false

}


// =====================================================
// PRIKAŽI SVE
// =====================================================

function prikaziSve() {

  odabraniDatum.value = null

  kalendarOtvoren.value = false

}


// =====================================================
// OTVORI DETALJE NARUDŽBE
// =====================================================

function otvoriNarudzbu(id) {

  router.push(
    `/moje-narudzbe/${id}`
  )

}


// =====================================================
// DOHVAT NARUDŽBI
// =====================================================

async function ucitajNarudzbe() {

  try {

    const response =
      await api.get('/narudzbe/moje')

    orders.value =
      response.data?.data || []

  } catch (error) {

    console.error(
      'Greška pri dohvaćanju narudžbi:',
      error
    )

    orders.value = []

  }

}


// =====================================================
// UČITAVANJE STRANICE
// =====================================================

onMounted(() => {

  ucitajNarudzbe()

})

</script>