<template>
  <q-page class="q-pa-lg">

    <!-- ============================= -->
    <!-- HEADER -->
    <!-- ============================= -->

    <div class="page-header q-mb-xl">

      <div class="header-content">

        <div>

          <div class="page-title">
            <q-icon name="shopping_cart_checkout" />
            Završetak narudžbe
          </div>

          <div class="page-subtitle">
            Unesite podatke za dostavu i odaberite način plaćanja
          </div>

        </div>

        <div class="checkout-step">
          <q-icon name="check_circle" />
          <span>Završni korak</span>
        </div>

      </div>

    </div>


    <div class="checkout-container">

      <!-- ============================= -->
      <!-- PODACI ZA DOSTAVU -->
      <!-- ============================= -->

      <q-card class="checkout-card">

        <q-card-section class="card-header">

          <div class="section-title">

            <div class="section-icon">
              <q-icon name="local_shipping" />
            </div>

            <div>

              <div class="text-h6">
                Podaci za dostavu
              </div>

              <div class="section-subtitle">
                Podaci na koje želite primiti narudžbu
              </div>

            </div>

          </div>

        </q-card-section>


        <q-separator />


        <q-card-section>

          <div class="row q-col-gutter-md">

            <!-- IME -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="forma.ime"
                label="Ime"
                outlined
                bg-color="dark"
                :rules="[
                  val => !!val || 'Ime je obavezno'
                ]"
              >

                <template #prepend>
                  <q-icon name="person" />
                </template>

              </q-input>

            </div>


            <!-- PREZIME -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="forma.prezime"
                label="Prezime"
                outlined
                bg-color="dark"
                :rules="[
                  val => !!val || 'Prezime je obavezno'
                ]"
              >

                <template #prepend>
                  <q-icon name="person_outline" />
                </template>

              </q-input>

            </div>


            <!-- ADRESA -->
            <div class="col-12">

              <q-input
                v-model="forma.adresa"
                label="Adresa dostave"
                outlined
                bg-color="dark"
                placeholder="Ulica i kućni broj"
                :rules="[
                  val => !!val || 'Adresa je obavezna'
                ]"
              >

                <template #prepend>
                  <q-icon name="home" />
                </template>

              </q-input>

            </div>


            <!-- GRAD -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="forma.grad"
                label="Grad"
                outlined
                bg-color="dark"
                :rules="[
                  val => !!val || 'Grad je obavezan'
                ]"
              >

                <template #prepend>
                  <q-icon name="location_city" />
                </template>

              </q-input>

            </div>


            <!-- POŠTANSKI BROJ -->
            <div class="col-12 col-md-6">

              <q-input
                v-model="forma.postanski_broj"
                label="Poštanski broj"
                outlined
                bg-color="dark"
                :rules="[
                  val => !!val || 'Poštanski broj je obavezan'
                ]"
              >

                <template #prepend>
                  <q-icon name="markunread_mailbox" />
                </template>

              </q-input>

            </div>


            <!-- TELEFON -->
            <div class="col-12">

              <q-input
                v-model="forma.telefon"
                label="Telefon"
                outlined
                bg-color="dark"
                placeholder="099 123 4567"
                :rules="[
                  val => !!val || 'Telefon je obavezan'
                ]"
              >

                <template #prepend>
                  <q-icon name="phone" />
                </template>

              </q-input>

            </div>


            <!-- NAPOMENA -->
            <div class="col-12">

              <q-input
                v-model="forma.napomena"
                label="Napomena uz narudžbu"
                type="textarea"
                outlined
                bg-color="dark"
                autogrow
                placeholder="Dodatna napomena za dostavu..."
              >

                <template #prepend>
                  <q-icon name="notes" />
                </template>

              </q-input>

            </div>

          </div>

        </q-card-section>

      </q-card>



      <!-- ============================= -->
      <!-- NAČIN PLAĆANJA -->
      <!-- ============================= -->

      <q-card class="checkout-card q-mt-lg">

        <q-card-section class="card-header">

          <div class="section-title">

            <div class="section-icon payment-section-icon">
              <q-icon name="payments" />
            </div>

            <div>

              <div class="text-h6">
                Način plaćanja
              </div>

              <div class="section-subtitle">
                Odaberite način na koji želite platiti narudžbu
              </div>

            </div>

          </div>

        </q-card-section>


        <q-separator />


        <q-card-section class="payment-options">

          <!-- ============================= -->
          <!-- POUZEĆE -->
          <!-- ============================= -->

          <div
            class="payment-option"
            :class="{
              'payment-option-selected':
                forma.nacin_placanja === 'pouzece'
            }"
            @click="odaberiPlacanje('pouzece')"
          >

            <q-radio
              v-model="forma.nacin_placanja"
              val="pouzece"
              color="primary"
            />


            <div class="payment-icon-box cash-box">
              <q-icon name="payments" />
            </div>


            <div class="payment-info-content">

              <div class="payment-title">
                Pouzeće
              </div>

              <div class="payment-description">
                Plaćanje gotovinom prilikom preuzimanja narudžbe.
              </div>

            </div>

          </div>



          <!-- ============================= -->
          <!-- KARTICA -->
          <!-- ============================= -->

          <div
            class="payment-option"
            :class="{
              'payment-option-selected':
                forma.nacin_placanja === 'kartica'
            }"
            @click="odaberiPlacanje('kartica')"
          >

            <q-radio
              v-model="forma.nacin_placanja"
              val="kartica"
              color="primary"
            />


            <div class="payment-icon-box card-box">
              <q-icon name="credit_card" />
            </div>


            <div class="payment-info-content">

              <div class="payment-title">
                Plaćanje karticom
              </div>

              <div class="payment-description">
                Plaćanje debitnom ili kreditnom karticom.
              </div>

            </div>


            <!-- Oznake kartica -->

            <div class="card-brands">

              <div class="card-brand visa">
                VISA
              </div>

              <div class="card-brand mastercard">

                <span class="mc-circle mc-red"></span>
                <span class="mc-circle mc-yellow"></span>

              </div>

              <div class="card-brand maestro">

                <span class="maestro-circle maestro-red"></span>
                <span class="maestro-circle maestro-blue"></span>

              </div>

              <div class="card-brand amex">
                AMEX
              </div>

            </div>

          </div>



          <!-- ============================= -->
          <!-- PODACI KARTICE -->
          <!-- ============================= -->

          <transition name="card-form">

            <div
              v-if="forma.nacin_placanja === 'kartica'"
              class="card-payment-form"
            >

              <div class="card-form-header">

                <div class="card-form-icon">
                  <q-icon name="credit_card" />
                </div>

                <div>

                  <div class="card-form-title">
                    Podaci kartice
                  </div>

                  <div class="card-form-subtitle">
                    Unesite podatke kartice za simulaciju plaćanja
                  </div>

                </div>

              </div>


              <div class="row q-col-gutter-md q-mt-md">

                <!-- BROJ KARTICE -->
                <div class="col-12">

                  <q-input
                    v-model="forma.broj_kartice"
                    label="Broj kartice"
                    outlined
                    bg-color="dark"
                    mask="#### #### #### ####"
                    placeholder="1234 5678 9012 3456"
                    :rules="[
                      val => !!val ||
                        'Broj kartice je obavezan',

                      val =>
                        val.replace(/\s/g, '').length === 16 ||
                        'Broj kartice mora imati 16 znamenki'
                    ]"
                  >

                    <template #prepend>
                      <q-icon name="credit_card" />
                    </template>

                  </q-input>

                </div>


                <!-- IME NA KARTICI -->
                <div class="col-12 col-md-6">

                  <q-input
                    v-model="forma.ime_na_kartici"
                    label="Ime na kartici"
                    outlined
                    bg-color="dark"
                    placeholder="IME PREZIME"
                    :rules="[
                      val =>
                        !!val ||
                        'Ime na kartici je obavezno'
                    ]"
                  >

                    <template #prepend>
                      <q-icon name="person" />
                    </template>

                  </q-input>

                </div>


                <!-- DATUM ISTEKA -->
                <div class="col-6 col-md-3">

                  <q-input
                    v-model="forma.datum_isteka"
                    label="Datum isteka"
                    outlined
                    bg-color="dark"
                    mask="##/##"
                    placeholder="MM/YY"
                    :rules="[
                      val =>
                        !!val ||
                        'Datum isteka je obavezan'
                    ]"
                  >

                    <template #prepend>
                      <q-icon name="calendar_month" />
                    </template>

                  </q-input>

                </div>


                <!-- CVV -->
                <div class="col-6 col-md-3">

                  <q-input
                    v-model="forma.cvv"
                    label="CVV"
                    outlined
                    bg-color="dark"
                    mask="###"
                    type="password"
                    placeholder="123"
                    :rules="[
                      val =>
                        !!val ||
                        'CVV je obavezan',

                      val =>
                        val.length === 3 ||
                        'CVV mora imati 3 znamenke'
                    ]"
                  >

                    <template #prepend>
                      <q-icon name="lock" />
                    </template>

                  </q-input>

                </div>

              </div>


              <!-- SIGURNOSNA PORUKA -->

              <div class="card-security-info">

                <q-icon name="lock" />

                <span>
                  Podaci kartice koriste se samo za simulaciju
                  plaćanja i ne spremaju se u bazu podataka.
                </span>

              </div>

            </div>

          </transition>



          <!-- ============================= -->
          <!-- INFO -->
          <!-- ============================= -->

          <div class="payment-notice">

            <div class="notice-icon">
              <q-icon name="info" />
            </div>

            <div>

              <div class="notice-title">
                Simulacija plaćanja
              </div>

              <div class="notice-text">
                Plaćanje u ovoj aplikaciji služi kao simulacija
                za potrebe završnog rada. Stvarna naplata se ne izvršava.
              </div>

            </div>

          </div>

        </q-card-section>

      </q-card>



      <!-- ============================= -->
      <!-- SAŽETAK -->
      <!-- ============================= -->

      <q-card class="checkout-card q-mt-lg">

        <q-card-section class="card-header">

          <div class="section-title">

            <div class="section-icon summary-icon">
              <q-icon name="receipt_long" />
            </div>

            <div>

              <div class="text-h6">
                Sažetak narudžbe
              </div>

              <div class="section-subtitle">
                Provjerite artikle i ukupni iznos prije potvrde
              </div>

            </div>

          </div>

        </q-card-section>


        <q-separator />


        <q-card-section>

          <!-- PROIZVODI -->

          <div
            v-for="item in cart"
            :key="item.id"
            class="summary-item"
          >

            <div class="summary-product">

              <div class="product-icon">
                <q-icon name="inventory_2" />
              </div>

              <div>

                <div class="product-name">
                  {{ item.naziv }}
                </div>

                <div class="product-details">
                  {{ item.kolicina }} ×
                  {{ Number(item.cijena).toFixed(2) }} €
                </div>

              </div>

            </div>


            <div class="product-total">

              {{
                (
                  Number(item.cijena) *
                  Number(item.kolicina)
                ).toFixed(2)
              }}

              €

            </div>

          </div>


          <q-separator class="q-my-lg" />


          <!-- UKUPNO -->

          <div class="total-row">

            <div>

              <div class="total-label">
                Ukupno za platiti
              </div>

              <div class="total-subtitle">
                Uključuje sve stavke narudžbe
              </div>

            </div>


            <strong>
              {{ total.toFixed(2) }} €
            </strong>

          </div>



          <!-- GUMBI -->

          <div class="buttons q-mt-xl">

            <q-btn
              flat
              color="grey-5"
              icon="arrow_back"
              label="Natrag u košaricu"
              no-caps
              class="back-button"
              @click="$router.push('/kosarica')"
            />


            <q-btn
              color="positive"
              icon="shopping_cart_checkout"
              :label="
                forma.nacin_placanja === 'kartica'
                  ? 'Plati i potvrdi narudžbu'
                  : 'Potvrdi narudžbu'
              "
              size="lg"
              unelevated
              no-caps
              class="confirm-button"
              @click="potvrdiNarudzbu"
              :loading="loading"
            />

          </div>

        </q-card-section>

      </q-card>

    </div>

  </q-page>
</template>


<script>
import { api } from "boot/axios";

export default {

  name: "PlacanjePage",

  data() {

    return {

      cart: [],

      loading: false,

      forma: {

        ime: "",

        prezime: "",

        adresa: "",

        grad: "",

        postanski_broj: "",

        telefon: "",

        napomena: "",

        nacin_placanja: "pouzece",

        // Podaci kartice
        // NE šalju se backendu
        broj_kartice: "",
        ime_na_kartici: "",
        datum_isteka: "",
        cvv: "",

      },

    };

  },


  computed: {

    total() {

      return this.cart.reduce(

        (sum, item) =>

          sum +
          Number(item.cijena) *
          Number(item.kolicina),

        0

      );

    },

  },


  mounted() {

    this.ucitajKosaricu();

  },


  methods: {

    /* ============================= */
    /* ODABIR PLAĆANJA */
    /* ============================= */

    odaberiPlacanje(nacin) {

      this.forma.nacin_placanja = nacin;

    },


    /* ============================= */
    /* UČITAVANJE KOŠARICE */
    /* ============================= */

    ucitajKosaricu() {

      try {

        this.cart = JSON.parse(

          localStorage.getItem(
            "terabuild_cart"
          ) || "[]"

        );

      } catch (error) {

        console.error(
          "Greška pri učitavanju košarice:",
          error
        );

        this.cart = [];

      }


      if (this.cart.length === 0) {

        this.$q.notify({

          type: "warning",

          message:
            "Košarica je prazna.",

          position: "top-right",

        });

        this.$router.push("/kosarica");

      }

    },


    /* ============================= */
    /* POTVRDA NARUDŽBE */
    /* ============================= */

    async potvrdiNarudzbu() {

      if (this.loading) {
        return;
      }


      /* ----------------------------- */
      /* PROVJERA KOŠARICE */
      /* ----------------------------- */

      if (!this.cart.length) {

        this.$q.notify({

          type: "warning",

          message:
            "Košarica je prazna.",

          position: "top-right",

        });

        return;

      }


      /* ----------------------------- */
      /* PROVJERA DOSTAVE */
      /* ----------------------------- */

      if (

        !this.forma.ime ||

        !this.forma.prezime ||

        !this.forma.adresa ||

        !this.forma.grad ||

        !this.forma.postanski_broj ||

        !this.forma.telefon

      ) {

        this.$q.notify({

          type: "warning",

          message:
            "Molimo ispunite sve obavezne podatke za dostavu.",

          position: "top-right",

        });

        return;

      }


      /* ----------------------------- */
      /* PROVJERA KARTICE */
      /* ----------------------------- */

      if (
        this.forma.nacin_placanja === "kartica"
      ) {

        const brojKartice =
          this.forma.broj_kartice
            .replace(/\s/g, "");


        if (
          brojKartice.length !== 16 ||

          !this.forma.ime_na_kartici ||

          !this.forma.datum_isteka ||

          this.forma.cvv.length !== 3
        ) {

          this.$q.notify({

            type: "warning",

            message:
              "Molimo unesite ispravne podatke kartice.",

            position: "top-right",

          });

          return;

        }

      }


      this.loading = true;


      try {

        /* ----------------------------- */
        /* STATUS PLAĆANJA */
        /* ----------------------------- */

        const statusPlacanja =
          this.forma.nacin_placanja === "kartica"
            ? "placeno"
            : "nije_placeno";


        /* ----------------------------- */
        /* KREIRANJE NARUDŽBE */
        /* ----------------------------- */

        const response = await api.post(

          "/narudzbe",

          {

            stavke: this.cart.map(

              (item) => ({

                id_proizvod:
                  Number(item.id),

                kolicina:
                  Number(item.kolicina),

              })

            ),


            ime_primatelja:
              this.forma.ime,


            prezime_primatelja:
              this.forma.prezime,


            adresa_dostave:
              this.forma.adresa,


            grad_dostave:
              this.forma.grad,


            postanski_broj:
              this.forma.postanski_broj,


            telefon_dostave:
              this.forma.telefon,


            /* ------------------------- */
            /* NAČIN PLAĆANJA */
            /* ------------------------- */

            nacin_placanja:
              this.forma.nacin_placanja,


            /* ------------------------- */
            /* STATUS PLAĆANJA */
            /* ------------------------- */

            status_placanja:
              statusPlacanja,


            napomena:
              this.forma.napomena || null,

          }

        );


        console.log(
          "✅ Narudžba:",
          response.data
        );


        /* ----------------------------- */
        /* OČISTI KOŠARICU */
        /* ----------------------------- */

        localStorage.removeItem(
          "terabuild_cart"
        );


        /* ----------------------------- */
        /* AŽURIRAJ BADGE */
        /* ----------------------------- */

        const badge =
          document.getElementById(
            "cartCount"
          );


        if (badge) {

          badge.textContent = "0";

          badge.style.display =
            "none";

        }


        /* ----------------------------- */
        /* PORUKA */
        /* ----------------------------- */

        const poruka =
          this.forma.nacin_placanja === "kartica"

            ? `Plaćanje karticom uspješno simulirano. Narudžba ${response.data.broj} je plaćena.`

            : `Narudžba ${response.data.broj} uspješno kreirana!`;


        this.$q.notify({

          type: "positive",

          message: poruka,

          position: "top-right",

          timeout: 4000,

        });


        /* ----------------------------- */
        /* MOJE NARUDŽBE */
        /* ----------------------------- */

        this.$router.push(
          "/moje-narudzbe"
        );


      } catch (error) {

        console.error(
          "❌ Greška pri kreiranju narudžbe:",
          error.response?.data ||
          error
        );


        this.$q.notify({

          type: "negative",

          message:
            error.response?.data?.message ||
            "Narudžba nije mogla biti kreirana.",

          position: "top-right",

        });

      } finally {

        this.loading = false;

      }

    },

  },

};
</script>


<style scoped>

/* ================================= */
/* PAGE */
/* ================================= */

.q-page {

  background: #17191b;

  min-height: 100vh;

}


/* ================================= */
/* HEADER */
/* ================================= */

.page-header {

  max-width: 1100px;

  margin: 0 auto;

  padding-bottom: 22px;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.08);

}


.header-content {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

}


.page-title {

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 28px;

  font-weight: 700;

  color: #f1f3f4;

}


.page-title .q-icon {

  color: #42a5f5;

  font-size: 32px;

}


.page-subtitle {

  margin-top: 6px;

  color: #858e95;

  font-size: 14px;

}


.checkout-step {

  display: flex;

  align-items: center;

  gap: 7px;

  padding: 9px 14px;

  border-radius: 10px;

  background:
    rgba(33, 150, 243, 0.08);

  border:
    1px solid
    rgba(66, 165, 245, 0.15);

  color: #42a5f5;

  font-size: 13px;

  font-weight: 600;

}


/* ================================= */
/* CONTAINER */
/* ================================= */

.checkout-container {

  max-width: 1100px;

  margin: 28px auto 50px;

}


/* ================================= */
/* CARDS */
/* ================================= */

.checkout-card {

  background: #1d2022;

  border:
    1px solid
    #2b3033;

  border-radius: 16px;

  overflow: hidden;

  box-shadow:
    0 8px 25px
    rgba(0, 0, 0, 0.15);

}


/* ================================= */
/* SECTION HEADER */
/* ================================= */

.card-header {

  padding: 20px 22px;

}


.section-title {

  display: flex;

  align-items: center;

  gap: 14px;

}


.section-icon {

  width: 44px;

  height: 44px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  background:
    rgba(66, 165, 245, 0.10);

  color: #42a5f5;

}


.section-icon .q-icon {

  font-size: 24px;

}


.payment-section-icon {

  color: #21ba45;

  background:
    rgba(33, 186, 69, 0.10);

}


.summary-icon {

  color: #42a5f5;

}


.section-subtitle {

  margin-top: 3px;

  font-size: 13px;

  color: #7d878d;

}


/* ================================= */
/* INPUTS */
/* ================================= */

:deep(.q-field__control) {

  background: #191c1e !important;

  border-radius: 10px;

}


:deep(.q-field--outlined .q-field__control:before) {

  border-color:
    #30363a;

}


:deep(.q-field--outlined:hover .q-field__control:before) {

  border-color:
    #42a5f5;

}


:deep(.q-field__label) {

  color: #858e95;

}


:deep(.q-field__native) {

  color: #f1f3f4;

}


:deep(.q-field__prepend) {

  color: #6f7a81;

}


/* ================================= */
/* PAYMENT OPTIONS */
/* ================================= */

.payment-options {

  padding: 22px;

}


.payment-option {

  position: relative;

  display: flex;

  align-items: center;

  gap: 14px;

  min-height: 94px;

  padding: 15px 17px;

  margin-bottom: 12px;

  border-radius: 14px;

  border:
    1px solid
    #30363a;

  background: #191c1e;

  cursor: pointer;

  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;

}


.payment-option:hover {

  border-color:
    rgba(66, 165, 245, 0.45);

  background: #1b2023;

  transform: translateY(-1px);

}


.payment-option-selected {

  border-color:
    #42a5f5 !important;

  background:
    rgba(66, 165, 245, 0.07) !important;

  box-shadow:
    0 0 0 1px
    rgba(66, 165, 245, 0.08);

}


/* ================================= */
/* PAYMENT ICON */
/* ================================= */

.payment-icon-box {

  width: 50px;

  height: 50px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

}


.payment-icon-box .q-icon {

  font-size: 27px;

}


.cash-box {

  color: #21ba45;

  background:
    rgba(33, 186, 69, 0.10);

}


.card-box {

  color: #42a5f5;

  background:
    rgba(66, 165, 245, 0.10);

}


/* ================================= */
/* PAYMENT TEXT */
/* ================================= */

.payment-info-content {

  flex: 1;

  min-width: 0;

}


.payment-title {

  font-size: 16px;

  font-weight: 700;

  color: #f1f3f4;

}


.payment-description {

  margin-top: 4px;

  font-size: 13px;

  color: #7d878d;

}


/* ================================= */
/* CARD BRANDS */
/* ================================= */

.card-brands {

  display: flex;

  align-items: center;

  gap: 6px;

  margin-left: auto;

}


.card-brand {

  width: 48px;

  height: 30px;

  border-radius: 5px;

  display: flex;

  align-items: center;

  justify-content: center;

  position: relative;

  overflow: hidden;

  background: #f5f5f5;

  font-size: 10px;

  font-weight: 900;

}


/* VISA */

.visa {

  color: #1c3d91;

  font-size: 12px;

  font-style: italic;

}


/* MASTERCARD */

.mastercard {

  background: #f5f5f5;

}


.mc-circle {

  position: absolute;

  width: 17px;

  height: 17px;

  border-radius: 50%;

}


.mc-red {

  background: #eb001b;

  left: 9px;

}


.mc-yellow {

  background: #f79e1b;

  left: 20px;

}


/* MAESTRO */

.maestro {

  background: #f5f5f5;

}


.maestro-circle {

  width: 15px;

  height: 15px;

  border-radius: 50%;

  margin-left: -3px;

}


.maestro-red {

  background: #e31837;

}


.maestro-blue {

  background: #0066b3;

  margin-left: -5px;

}


/* AMEX */

.amex {

  background: #1677c8;

  color: white;

  font-size: 9px;

}


/* ================================= */
/* CARD FORM */
/* ================================= */

.card-payment-form {

  margin-top: 14px;

  padding: 20px;

  border-radius: 14px;

  background: #191c1e;

  border:
    1px solid
    rgba(66, 165, 245, 0.25);

  box-shadow:
    0 6px 20px
    rgba(0, 0, 0, 0.12);

}


.card-form-header {

  display: flex;

  align-items: center;

  gap: 12px;

}


.card-form-icon {

  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background:
    rgba(66, 165, 245, 0.10);

  color: #42a5f5;

}


.card-form-icon .q-icon {

  font-size: 23px;

}


.card-form-title {

  color: #e9edef;

  font-size: 15px;

  font-weight: 700;

}


.card-form-subtitle {

  margin-top: 3px;

  color: #737e85;

  font-size: 12px;

}


/* ================================= */
/* SECURITY INFO */
/* ================================= */

.card-security-info {

  display: flex;

  align-items: center;

  gap: 8px;

  margin-top: 6px;

  padding: 10px 12px;

  border-radius: 8px;

  background:
    rgba(33, 186, 69, 0.06);

  color: #7d878d;

  font-size: 11px;

}


.card-security-info .q-icon {

  color: #21ba45;

  font-size: 17px;

}


/* ================================= */
/* ANIMATION */
/* ================================= */

.card-form-enter-active,
.card-form-leave-active {

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;

}


.card-form-enter-from,
.card-form-leave-to {

  opacity: 0;

  transform: translateY(-8px);

}


/* ================================= */
/* NOTICE */
/* ================================= */

.payment-notice {

  display: flex;

  align-items: flex-start;

  gap: 12px;

  margin-top: 18px;

  padding: 15px 16px;

  border-radius: 11px;

  background:
    rgba(33, 150, 243, 0.07);

  border:
    1px solid
    rgba(66, 165, 245, 0.10);

}


.notice-icon {

  width: 28px;

  height: 28px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #42a5f5;

  color: #101416;

}


.notice-title {

  font-size: 13px;

  font-weight: 700;

  color: #dbe3e8;

  margin-bottom: 2px;

}


.notice-text {

  font-size: 12px;

  line-height: 1.5;

  color: #7d878d;

}


/* ================================= */
/* SUMMARY */
/* ================================= */

.summary-item {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 14px 0;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.055);

}


.summary-item:last-child {

  border-bottom: none;

}


.summary-product {

  display: flex;

  align-items: center;

  gap: 12px;

}


.product-icon {

  width: 40px;

  height: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 9px;

  background:
    rgba(255, 255, 255, 0.045);

  color: #7d878d;

}


.product-name {

  color: #e9edef;

  font-size: 14px;

  font-weight: 600;

}


.product-details {

  margin-top: 3px;

  color: #737e85;

  font-size: 12px;

}


.product-total {

  color: #e9edef;

  font-size: 14px;

  font-weight: 700;

  white-space: nowrap;

}


/* ================================= */
/* TOTAL */
/* ================================= */

.total-row {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

}


.total-label {

  font-size: 16px;

  font-weight: 700;

  color: #e9edef;

}


.total-subtitle {

  margin-top: 3px;

  font-size: 12px;

  color: #737e85;

}


.total-row strong {

  font-size: 28px;

  color: #42a5f5;

  white-space: nowrap;

}


/* ================================= */
/* BUTTONS */
/* ================================= */

.buttons {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

}


.back-button {

  border-radius: 10px;

}


.confirm-button {

  min-width: 230px;

  border-radius: 11px;

  font-weight: 700;

  box-shadow:
    0 5px 18px
    rgba(33, 186, 69, 0.15);

}


/* ================================= */
/* MOBILE */
/* ================================= */

@media (max-width: 700px) {

  .q-page {

    padding: 16px !important;

  }


  .header-content {

    align-items: flex-start;

    flex-direction: column;

  }


  .page-title {

    font-size: 23px;

  }


  .checkout-step {

    display: none;

  }


  .checkout-container {

    margin-top: 20px;

  }


  .card-header {

    padding: 17px;

  }


  .payment-options {

    padding: 17px;

  }


  .payment-option {

    align-items: flex-start;

    padding: 13px;

  }


  .payment-icon-box {

    width: 44px;

    height: 44px;

  }


  .payment-description {

    line-height: 1.4;

  }


  .card-brands {

    position: absolute;

    right: 14px;

    bottom: 9px;

    transform: scale(0.8);

    transform-origin: right bottom;

  }


  .summary-item {

    gap: 10px;

  }


  .product-icon {

    display: none;

  }


  .total-row {

    align-items: flex-end;

  }


  .total-row strong {

    font-size: 23px;

  }


  .buttons {

    flex-direction: column-reverse;

    align-items: stretch;

  }


  .confirm-button {

    width: 100%;

  }


  .back-button {

    width: 100%;

  }


  .card-payment-form {

    padding: 15px;

  }

}

</style>