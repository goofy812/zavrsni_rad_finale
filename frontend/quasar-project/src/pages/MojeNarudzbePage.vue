<template>
  <q-page class="orders-page q-pa-lg">

    <!-- NASLOV -->
    <div class="page-header q-mb-xl">

      <div>
        <div class="page-title">
          Moje narudžbe
        </div>

        <div class="page-subtitle">
          Pregled i povijest vaših narudžbi
        </div>
      </div>

      <!-- KALENDAR GUMB -->
      <div class="calendar-actions">

        <div
          v-if="odabraniDatum"
          class="selected-date"
        >
          <q-icon name="event" />
          {{ prikaziDatum(odabraniDatum) }}
        </div>

        <q-btn
          round
          unelevated
          icon="event"
          color="primary"
          @click="otvoriKalendar"
        >
          <q-tooltip>
            Odaberi datum
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="odabraniDatum"
          round
          flat
          icon="close"
          color="grey-5"
          @click="prikaziSve"
        >
          <q-tooltip>
            Prikaži sve narudžbe
          </q-tooltip>
        </q-btn>

      </div>

    </div>


    <!-- KALENDAR -->
    <q-dialog v-model="kalendarOtvoren">

      <q-card class="calendar-card">

        <q-card-section>

          <div class="calendar-title">
            Odaberi datum
          </div>

          <div class="calendar-subtitle">
            Zeleno označeni datumi imaju vaše narudžbe.
          </div>

        </q-card-section>


        <q-card-section>

          <q-date
            v-model="datumKalendar"
            mask="YYYY/MM/DD"
            :events="datumiNarudzbi"
            event-color="positive"
            color="positive"
            today-btn
            @update:model-value="odaberiDatum"
          />

        </q-card-section>


        <q-card-actions align="right">

          <q-btn
            flat
            label="Prikaži sve"
            color="primary"
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


    <!-- ODABRANI DATUM -->
    <q-card
      v-if="odabraniDatum"
      class="selected-date-card q-mb-xl"
      flat
      bordered
    >

      <q-card-section>

        <div class="selected-date-label">
          Narudžbe za datum
        </div>

        <div class="selected-date-value">
          {{ prikaziDatum(odabraniDatum) }}
        </div>

      </q-card-section>

    </q-card>


    <!-- NASLOV LISTE -->
    <div class="orders-heading q-mb-md">

      <div class="orders-title">

        <q-icon
          :name="odabraniDatum ? 'event' : 'history'"
          class="q-mr-sm"
        />

        <span v-if="odabraniDatum">
          Narudžbe odabranog datuma
        </span>

        <span v-else>
          Povijest narudžbi
        </span>

      </div>

      <div class="orders-subtitle">
        {{ filtriraneNarudzbe.length }}
        {{ filtriraneNarudzbe.length === 1
          ? 'narudžba'
          : 'narudžbi'
        }}
      </div>

    </div>


    <!-- LISTA NARUDŽBI -->
    <div
      v-if="filtriraneNarudzbe.length"
      class="orders-list"
    >

      <q-card
        v-for="order in filtriraneNarudzbe"
        :key="order.id_narudzba"
        class="order-card"
        flat
        bordered
        clickable
        @click="otvoriNarudzbu(order.id_narudzba)"
      >

        <q-card-section>

          <div class="order-content">

            <!-- LIJEVO -->
            <div class="order-left">

              <div class="order-icon">
                <q-icon
                  name="receipt_long"
                  size="26px"
                />
              </div>

              <div>

                <div class="order-number">
                  {{ order.broj_narudzbe }}
                </div>

                <div class="order-date">
                  {{ prikaziDatumVrijeme(order.datum_kreiranja) }}
                </div>

                <div class="order-items">
                  {{ order.broj_stavki }} stavki
                </div>

              </div>

            </div>


            <!-- DESNO -->
            <div class="order-right">

              <q-badge
                :color="order.status_boja || 'primary'"
              >
                {{ order.status_naziv }}
              </q-badge>

              <div class="order-total">
                {{ Number(order.ukupno_sa_pdv).toFixed(2) }} €
              </div>

              <div class="order-open">
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
      class="empty-orders"
      flat
      bordered
    >

      <q-icon
        name="event_busy"
        size="65px"
        color="grey"
      />

      <div class="empty-orders-title">

        <span v-if="odabraniDatum">
          Nema narudžbi za odabrani datum
        </span>

        <span v-else>
          Još nemate narudžbi
        </span>

      </div>

      <div class="empty-orders-text">

        <span v-if="odabraniDatum">
          Na ovaj datum nemate napravljenu narudžbu.
        </span>

        <span v-else>
          Nakon što napravite narudžbu,
          ona će se prikazati ovdje.
        </span>

      </div>

      <q-btn
        v-if="odabraniDatum"
        flat
        color="primary"
        label="Prikaži sve narudžbe"
        class="q-mt-lg"
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

const datumKalendar = ref(null)

const kalendarOtvoren = ref(false)


// =====================================================
// DATUMI KOJI IMAJU NARUDŽBE
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

        return `${godina}/${mjesec}/${dan}`

      })

    )
  ]

})


// =====================================================
// FILTRIRANJE
// =====================================================

const filtriraneNarudzbe = computed(() => {

  if (!odabraniDatum.value) {
    return orders.value
  }

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
      `${godina}/${mjesec}/${dan}`

    return datumNarudzbe === odabraniDatum.value

  })

})


// =====================================================
// OTVORI KALENDAR
// =====================================================

function otvoriKalendar() {

  datumKalendar.value =
    odabraniDatum.value

  kalendarOtvoren.value = true

}


// =====================================================
// ODABERI DATUM
// =====================================================

function odaberiDatum(datum) {

  odabraniDatum.value = datum

  datumKalendar.value = datum

  kalendarOtvoren.value = false

}


// =====================================================
// PRIKAŽI SVE
// =====================================================

function prikaziSve() {

  odabraniDatum.value = null

  datumKalendar.value = null

  kalendarOtvoren.value = false

}


// =====================================================
// FORMAT DATUMA
// =====================================================

function prikaziDatum(datum) {

  if (!datum) {
    return ''
  }

  const dijelovi =
    datum.split('/')

  return `${dijelovi[2]}.${dijelovi[1]}.${dijelovi[0]}.`

}


// =====================================================
// DATUM + VRIJEME
// =====================================================

function prikaziDatumVrijeme(datum) {

  return new Date(datum)
    .toLocaleString('hr-HR')

}


// =====================================================
// OTVORI DETALJE
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
// UČITAVANJE
// =====================================================

onMounted(() => {

  ucitajNarudzbe()

})

</script>


<style scoped>

.orders-page {
  min-height: 100vh;
  background: #17191b;
  color: #f5f5f5;
}


/* NASLOV */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  max-width: 1450px;
  margin: 0 auto;

  padding-bottom: 20px;

  border-bottom: 1px solid #2b3033;
}

.page-title {
  font-size: 34px;
  font-weight: 800;
}

.page-subtitle {
  margin-top: 5px;
  color: #8e989f;
  font-size: 14px;
}


/* KALENDAR */

.calendar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-date {
  padding: 9px 13px;

  border-radius: 9px;

  background: rgba(25, 118, 210, 0.1);

  border: 1px solid rgba(25, 118, 210, 0.25);

  color: #90caf9;

  font-size: 13px;
  font-weight: 600;
}

.calendar-card {
  min-width: 370px;

  border-radius: 16px;

  background: #1d2022;
  color: #f5f5f5;
}

.calendar-title {
  font-size: 20px;
  font-weight: 750;
}

.calendar-subtitle {
  margin-top: 5px;

  color: #858e95;
  font-size: 12px;
}


/* ODABRANI DATUM */

.selected-date-card {
  max-width: 1450px;

  margin-left: auto;
  margin-right: auto;

  background: #1d2022;

  border: 1px solid #2b3033;

  border-radius: 14px;
}

.selected-date-label {
  color: #858e95;
  font-size: 12px;
}

.selected-date-value {
  margin-top: 5px;

  font-size: 20px;
  font-weight: 750;
}


/* NASLOV LISTE */

.orders-heading {
  max-width: 1450px;
  margin: 0 auto;
}

.orders-title {
  display: flex;
  align-items: center;

  color: #f1f3f4;

  font-size: 21px;
  font-weight: 750;
}

.orders-subtitle {
  margin-top: 4px;
  margin-left: 30px;

  color: #737d84;

  font-size: 12px;
}


/* LISTA */

.orders-list {
  max-width: 1450px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  gap: 12px;
}


/* KARTICA */

.order-card {
  background: #1d2022;

  border: 1px solid #2b3033;

  border-radius: 14px;

  transition: 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);

  border-color: #3a4247;
}

.order-content {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 25px;
}

.order-left {
  display: flex;

  align-items: center;

  gap: 15px;
}

.order-icon {
  width: 50px;
  height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  background: rgba(25, 118, 210, 0.1);

  color: #42a5f5;
}

.order-number {
  color: #f2f4f5;

  font-size: 18px;
  font-weight: 750;
}

.order-date,
.order-items {
  margin-top: 6px;

  color: #8b959b;

  font-size: 12px;
}

.order-right {
  display: flex;

  align-items: center;

  gap: 25px;
}

.order-total {
  min-width: 105px;

  text-align: right;

  color: #42a5f5;

  font-size: 21px;
  font-weight: 800;
}

.order-open {
  color: #737e84;

  font-size: 12px;
}


/* PRAZNO */

.empty-orders {
  max-width: 700px;

  min-height: 400px;

  margin: 45px auto;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 50px 30px;

  text-align: center;

  background: #1d2022;

  border: 1px solid #2b3033;

  border-radius: 20px;
}

.empty-orders-title {
  margin-top: 22px;

  font-size: 23px;
  font-weight: 750;
}

.empty-orders-text {
  max-width: 500px;

  margin-top: 9px;

  color: #818b91;

  font-size: 14px;

  line-height: 1.6;
}


/* MOBITEL */

@media (max-width: 700px) {

  .page-header {
    align-items: flex-start;

    flex-direction: column;
  }

  .calendar-actions {
    align-self: flex-end;
  }

  .page-title {
    font-size: 27px;
  }

  .calendar-card {
    min-width: 0;

    width: calc(100vw - 32px);
  }

  .order-content {
    align-items: flex-start;

    flex-direction: column;
  }

  .order-right {
    width: 100%;

    justify-content: flex-end;
  }

}

</style>