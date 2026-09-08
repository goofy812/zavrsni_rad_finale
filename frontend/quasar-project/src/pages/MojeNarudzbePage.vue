<template>
  <q-page class="orders-page q-pa-lg">

    <!-- ===================================================== -->
    <!-- NASLOV -->
    <!-- ===================================================== -->

    <div class="page-header q-mb-xl">

      <div class="title-section">

        <div class="title-icon">
          <q-icon
            name="receipt_long"
            size="30px"
          />
        </div>

        <div>
          <div class="page-title">
            Moje narudžbe
          </div>

          <div class="page-subtitle">
            Pregled i povijest vaših narudžbi
          </div>
        </div>

      </div>


      <!-- KALENDAR -->

      <div class="calendar-actions">

        <div
          v-if="odabraniDatum"
          class="selected-date"
        >
          <q-icon
            name="event"
            size="17px"
          />

          {{ prikaziDatum(odabraniDatum) }}
        </div>


        <q-btn
          round
          unelevated
          icon="event"
          color="primary"
          class="calendar-btn"
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
          @click="odabraniDatum = null"
        >

          <q-tooltip>
            Prikaži sve narudžbe
          </q-tooltip>

        </q-btn>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- KALENDAR DIALOG -->
    <!-- ===================================================== -->

    <q-dialog v-model="kalendarOtvoren">

      <q-card class="calendar-card">

        <q-card-section class="calendar-header">

          <div>

            <div class="calendar-title">
              Odaberi datum
            </div>

            <div class="calendar-subtitle">
              Odaberite datum za pregled narudžbi
            </div>

          </div>


          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
          />

        </q-card-section>


        <q-card-section class="q-pt-none">

          <div class="calendar-info">

            <span class="calendar-dot"></span>

            <span>
              Zeleno označeni datumi sadrže vaše narudžbe.
            </span>

          </div>


          <q-date
            v-model="datumZaKalendar"
            mask="YYYY-MM-DD"
            :events="datumiNarudzbi"
            event-color="positive"
            color="positive"
            today-btn
            @update:model-value="odaberiDatum"
          />

        </q-card-section>


        <q-card-actions
          align="right"
          class="calendar-actions-bottom"
        >

          <q-btn
            flat
            label="Prikaži sve"
            color="primary"
            no-caps
            @click="prikaziSve"
          />

          <q-btn
            flat
            label="Zatvori"
            v-close-popup
            no-caps
          />

        </q-card-actions>

      </q-card>

    </q-dialog>


    <!-- ===================================================== -->
    <!-- ODABRANI DATUM -->
    <!-- ===================================================== -->

    <q-card
      v-if="odabraniDatum"
      class="selected-date-card q-mb-xl"
      flat
      bordered
    >

      <q-card-section>

        <div class="selected-date-content">

          <div class="selected-date-icon">

            <q-icon
              name="event"
              size="27px"
            />

          </div>


          <div>

            <div class="selected-date-label">
              Narudžbe za datum
            </div>

            <div class="selected-date-value">
              {{ prikaziDatum(odabraniDatum) }}
            </div>

          </div>

        </div>

      </q-card-section>

    </q-card>


    <!-- ===================================================== -->
    <!-- NASLOV POPISA -->
    <!-- ===================================================== -->

    <div class="orders-heading">

      <div>

        <div class="orders-title">

          <q-icon
            :name="odabraniDatum ? 'event' : 'history'"
            size="22px"
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
          {{
            filtriraneNarudzbe.length === 1
              ? "narudžba"
              : "narudžbi"
          }}
        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- POPIS NARUDŽBI -->
    <!-- ===================================================== -->

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


            <!-- LIJEVA STRANA -->

            <div class="order-left">

              <div class="order-icon">

                <q-icon
                  name="receipt_long"
                  size="26px"
                />

              </div>


              <div class="order-info">

                <div class="order-number">
                  {{ order.broj_narudzbe }}
                </div>

                <div class="order-date">

                  <q-icon
                    name="schedule"
                    size="15px"
                  />

                  {{ prikaziDatumVrijeme(order.datum_kreiranja) }}

                </div>

                <div class="order-items">

                  <q-icon
                    name="inventory_2"
                    size="15px"
                  />

                  {{ order.broj_stavki }} stavki

                </div>

              </div>

            </div>


            <!-- DESNA STRANA -->

            <div class="order-right">

              <q-badge
                :color="
                  order.status_boja || 'primary'
                "
                class="order-status"
              >

                {{ order.status_naziv }}

              </q-badge>


              <div class="order-total">
                {{
                  Number(
                    order.ukupno_sa_pdv
                  ).toFixed(2)
                }}
                €
              </div>


              <div class="order-open">

                Pregled narudžbe

                <q-icon
                  name="arrow_forward"
                  size="18px"
                />

              </div>

            </div>


          </div>

        </q-card-section>

      </q-card>

    </div>


    <!-- ===================================================== -->
    <!-- NEMA NARUDŽBI -->
    <!-- ===================================================== -->

    <q-card
      v-else
      class="empty-orders"
      flat
      bordered
    >

      <div class="empty-orders-icon">

        <q-icon
          name="event_busy"
          size="65px"
        />

      </div>


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
          Odaberite drugi datum putem kalendara.
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
        icon="history"
        label="Prikaži sve narudžbe"
        no-caps
        class="q-mt-lg"
        @click="prikaziSve"
      />

      <q-btn
        v-else
        unelevated
        color="primary"
        icon="storefront"
        label="Pregledaj proizvode"
        to="/proizvodi"
        no-caps
        class="q-mt-lg"
      />

    </q-card>

  </q-page>
</template>


<script setup>

import {
  computed,
  onMounted,
  ref
} from "vue";

import { api } from "boot/axios";

import { useRouter } from "vue-router";


const router = useRouter();


// ============================================================
// PODACI
// ============================================================

const orders = ref([]);

const odabraniDatum = ref(null);

const datumZaKalendar = ref(null);

const kalendarOtvoren = ref(false);


// ============================================================
// DATUMI ZA KALENDAR
// ============================================================

// QDate events koristi YYYY/MM/DD format.

const datumiNarudzbi = computed(() => {

  const datumi = orders.value

    .map((order) => {

      const datum =
        new Date(
          order.datum_kreiranja
        );


      if (isNaN(datum.getTime())) {
        return null;
      }


      const godina =
        datum.getFullYear();


      const mjesec =
        String(
          datum.getMonth() + 1
        ).padStart(2, "0");


      const dan =
        String(
          datum.getDate()
        ).padStart(2, "0");


      return `${godina}/${mjesec}/${dan}`;

    })

    .filter(Boolean);


  return [
    ...new Set(datumi)
  ];

});


// ============================================================
// FILTRIRANE NARUDŽBE
// ============================================================

const filtriraneNarudzbe = computed(() => {

  if (!odabraniDatum.value) {

    return orders.value;

  }


  return orders.value.filter(
    (order) => {

      const datum =
        new Date(
          order.datum_kreiranja
        );


      if (isNaN(datum.getTime())) {

        return false;

      }


      const godina =
        datum.getFullYear();


      const mjesec =
        String(
          datum.getMonth() + 1
        ).padStart(2, "0");


      const dan =
        String(
          datum.getDate()
        ).padStart(2, "0");


      const datumNarudzbe =
        `${godina}-${mjesec}-${dan}`;


      return (
        datumNarudzbe ===
        odabraniDatum.value
      );

    }
  );

});


// ============================================================
// OTVORI KALENDAR
// ============================================================

function otvoriKalendar() {

  datumZaKalendar.value =
    odabraniDatum.value ||
    null;


  kalendarOtvoren.value =
    true;

}


// ============================================================
// ODABIR DATUMA
// ============================================================

function odaberiDatum(datum) {

  odabraniDatum.value =
    datum;


  kalendarOtvoren.value =
    false;

}


// ============================================================
// PRIKAŽI SVE
// ============================================================

function prikaziSve() {

  odabraniDatum.value =
    null;

  datumZaKalendar.value =
    null;

  kalendarOtvoren.value =
    false;

}


// ============================================================
// PRIKAZ DATUMA
// ============================================================

function prikaziDatum(datum) {

  if (!datum) {

    return "";

  }


  const dijelovi =
    datum.split("-");


  if (dijelovi.length !== 3) {

    return datum;

  }


  return `${dijelovi[2]}.${dijelovi[1]}.${dijelovi[0]}.`;

}


// ============================================================
// PRIKAZ DATUMA I VREMENA
// ============================================================

function prikaziDatumVrijeme(datum) {

  if (!datum) {

    return "";

  }


  return new Date(
    datum
  ).toLocaleString(
    "hr-HR"
  );

}


// ============================================================
// OTVORI DETALJE
// ============================================================

function otvoriNarudzbu(id) {

  router.push(
    `/moje-narudzbe/${id}`
  );

}


// ============================================================
// UČITAJ NARUDŽBE
// ============================================================

async function ucitajNarudzbe() {

  try {

    const response =
      await api.get(
        "/narudzbe/moje"
      );


    orders.value =
      response.data?.data || [];

  } catch (error) {

    console.error(
      "Greška pri dohvaćanju mojih narudžbi:",
      error
    );


    orders.value = [];

  }

}


// ============================================================
// START
// ============================================================

onMounted(() => {

  ucitajNarudzbe();

});

</script>


<style scoped>

/* ========================================================= */
/* GLAVNA STRANICA */
/* ========================================================= */

.orders-page {

  min-height: 100vh;

  background: #17191b;

  color: #f5f5f5;

}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.page-header {

  max-width: 1450px;

  margin: 0 auto;

  padding-bottom: 20px;

  border-bottom:
    1px solid #2b3033;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

}


.title-section {

  display: flex;

  align-items: center;

  gap: 16px;

}


.title-icon {

  width: 56px;

  height: 56px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 14px;

  background:
    rgba(25, 118, 210, 0.13);

  border:
    1px solid rgba(25, 118, 210, 0.35);

  color: #42a5f5;

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


/* ========================================================= */
/* KALENDAR */
/* ========================================================= */

.calendar-actions {

  display: flex;

  align-items: center;

  gap: 8px;

}


.selected-date {

  display: flex;

  align-items: center;

  gap: 6px;

  padding: 9px 13px;

  border-radius: 9px;

  background:
    rgba(25, 118, 210, 0.1);

  border:
    1px solid rgba(25, 118, 210, 0.25);

  color: #90caf9;

  font-size: 13px;

  font-weight: 600;

}


.calendar-btn {

  box-shadow:
    0 4px 14px rgba(25, 118, 210, 0.25);

}


/* ========================================================= */
/* KALENDAR DIALOG */
/* ========================================================= */

.calendar-card {

  min-width: 370px;

  overflow: hidden;

  border-radius: 16px;

  background: #1d2022;

  color: #f5f5f5;

}


.calendar-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

  padding-bottom: 8px;

}


.calendar-title {

  font-size: 20px;

  font-weight: 750;

}


.calendar-subtitle {

  margin-top: 4px;

  color: #858e95;

  font-size: 12px;

}


.calendar-info {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 12px;

  color: #9aa3a9;

  font-size: 12px;

}


.calendar-dot {

  width: 8px;

  height: 8px;

  border-radius: 50%;

  background: #21ba45;

}


.calendar-card .q-date {

  border-radius: 12px;

}


.calendar-actions-bottom {

  padding: 12px 18px 18px;

}


/* ========================================================= */
/* ODABRANI DATUM */
/* ========================================================= */

.selected-date-card {

  max-width: 1450px;

  margin-left: auto;

  margin-right: auto;

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 14px;

}


.selected-date-content {

  display: flex;

  align-items: center;

  gap: 14px;

}


.selected-date-icon {

  width: 48px;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background:
    rgba(33, 186, 69, 0.1);

  color: #21ba45;

}


.selected-date-label {

  color: #858e95;

  font-size: 12px;

}


.selected-date-value {

  margin-top: 3px;

  font-size: 20px;

  font-weight: 750;

}


/* ========================================================= */
/* NASLOV NARUDŽBI */
/* ========================================================= */

.orders-heading {

  max-width: 1450px;

  margin: 0 auto 15px;

}


.orders-title {

  display: flex;

  align-items: center;

  color: #f1f3f4;

  font-size: 21px;

  font-weight: 750;

}


.orders-title .q-icon {

  color: #42a5f5;

}


.orders-subtitle {

  margin-top: 4px;

  margin-left: 30px;

  color: #737d84;

  font-size: 12px;

}


/* ========================================================= */
/* LISTA */
/* ========================================================= */

.orders-list {

  max-width: 1450px;

  margin: 0 auto;

  display: flex;

  flex-direction: column;

  gap: 12px;

}


/* ========================================================= */
/* KARTICA NARUDŽBE */
/* ========================================================= */

.order-card {

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 14px;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

}


.order-card:hover {

  transform:
    translateY(-2px);

  border-color:
    #3a4247;

  box-shadow:
    0 9px 28px rgba(0, 0, 0, 0.22);

}


.order-card .q-card__section {

  padding: 20px 22px;

}


/* ========================================================= */
/* SADRŽAJ NARUDŽBE */
/* ========================================================= */

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

  min-width: 0;

}


.order-icon {

  width: 50px;

  height: 50px;

  min-width: 50px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background:
    rgba(25, 118, 210, 0.1);

  color: #42a5f5;

}


.order-info {

  min-width: 0;

}


.order-number {

  color: #f2f4f5;

  font-size: 18px;

  font-weight: 750;

}


.order-date {

  display: inline-flex;

  align-items: center;

  gap: 5px;

  margin-top: 6px;

  color: #8b959b;

  font-size: 12px;

}


.order-items {

  display: inline-flex;

  align-items: center;

  gap: 5px;

  margin-left: 12px;

  color: #727d83;

  font-size: 12px;

}


/* ========================================================= */
/* DESNA STRANA */
/* ========================================================= */

.order-right {

  display: flex;

  align-items: center;

  gap: 25px;

}


.order-status {

  padding: 6px 10px;

  border-radius: 6px;

  font-size: 11px;

  font-weight: 650;

}


.order-total {

  min-width: 105px;

  text-align: right;

  color: #42a5f5;

  font-size: 21px;

  font-weight: 800;

}


.order-open {

  display: flex;

  align-items: center;

  gap: 5px;

  color: #737e84;

  font-size: 12px;

  white-space: nowrap;

  transition:
    color 0.2s ease;

}


.order-card:hover .order-open {

  color: #42a5f5;

}


/* ========================================================= */
/* PRAZNO */
/* ========================================================= */

.empty-orders {

  max-width: 700px;

  min-height: 420px;

  margin: 45px auto;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 50px 30px;

  text-align: center;

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 20px;

}


.empty-orders-icon {

  width: 110px;

  height: 110px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(25, 118, 210, 0.09);

  color: #607d8b;

}


.empty-orders-title {

  margin-top: 22px;

  font-size: 23px;

  font-weight: 750;

  color: #e8eaeb;

}


.empty-orders-text {

  max-width: 500px;

  margin-top: 9px;

  color: #818b91;

  font-size: 14px;

  line-height: 1.6;

}


/* ========================================================= */
/* TABLET */
/* ========================================================= */

@media (max-width: 900px) {

  .page-header {

    align-items: flex-start;

    flex-direction: column;

  }


  .calendar-actions {

    align-self: flex-end;

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


/* ========================================================= */
/* MOBITEL */
/* ========================================================= */

@media (max-width: 600px) {

  .orders-page {

    padding: 16px !important;

  }


  .page-title {

    font-size: 27px;

  }


  .page-subtitle {

    font-size: 13px;

  }


  .title-icon {

    width: 48px;

    height: 48px;

  }


  .calendar-actions {

    width: 100%;

    align-self: stretch;

    justify-content: flex-end;

  }


  .selected-date {

    margin-right: auto;

  }


  .calendar-card {

    min-width: 0;

    width: calc(100vw - 32px);

  }


  .calendar-card .q-date {

    width: 100%;

  }


  .order-card .q-card__section {

    padding: 16px;

  }


  .order-left {

    width: 100%;

  }


  .order-right {

    width: 100%;

    display: grid;

    grid-template-columns: auto 1fr;

    gap: 10px 15px;

  }


  .order-status {

    justify-self: start;

  }


  .order-total {

    min-width: 0;

    text-align: right;

  }


  .order-open {

    grid-column: 1 / -1;

    justify-content: flex-end;

  }


  .order-items {

    display: flex;

    margin-left: 0;

    margin-top: 5px;

  }


  .order-date {

    display: flex;

  }


  .empty-orders {

    min-height: 390px;

    margin-top: 30px;

    padding: 35px 20px;

  }

}

</style>