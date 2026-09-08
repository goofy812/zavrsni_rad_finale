<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="page-header q-mb-lg">
      <div class="text-h4">
        Detalji narudžbe
      </div>

      <div
        v-if="narudzba"
        class="text-grey-6 q-mt-sm"
      >
        {{ narudzba.broj_narudzbe }}
      </div>
    </div>

    <!-- UČITAVANJE -->
    <div
      v-if="loading"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        color="primary"
        size="50px"
      />
    </div>

    <!-- GREŠKA -->
    <q-card
      v-else-if="error"
      flat
      bordered
      class="q-pa-lg"
    >
      <div class="text-negative text-h6">
        {{ error }}
      </div>

      <q-btn
        class="q-mt-md"
        color="primary"
        icon="arrow_back"
        label="Natrag na moje narudžbe"
        no-caps
        @click="$router.push('/moje-narudzbe')"
      />
    </q-card>

    <!-- DETALJI -->
    <div v-else-if="narudzba">

      <!-- OSNOVNI PODACI -->
      <q-card
        flat
        bordered
        class="order-card q-mb-lg"
      >
        <q-card-section>

          <div class="row items-center justify-between">

            <div>
              <div class="text-h6">
                {{ narudzba.broj_narudzbe }}
              </div>

              <div class="text-grey-6 q-mt-xs">
                Datum:
                {{ formatDate(narudzba.datum_kreiranja) }}
              </div>
            </div>

            <q-badge
              :color="statusColor(narudzba.status_boja)"
              class="status-badge"
            >
              {{ narudzba.status_naziv }}
            </q-badge>

          </div>

        </q-card-section>
      </q-card>


      <!-- PROIZVODI -->
      <q-card
        flat
        bordered
        class="order-card"
      >

        <q-card-section>

          <div class="text-h6 q-mb-lg">
            Kupljeni proizvodi
          </div>

          <!-- NEMA STAVKI -->
          <div
            v-if="!narudzba.stavke || narudzba.stavke.length === 0"
            class="text-grey-6"
          >
            Nema stavki u ovoj narudžbi.
          </div>

          <!-- STAVKE -->
          <div
            v-for="stavka in narudzba.stavke"
            :key="stavka.id_stavka"
            class="product-row"
          >

            <!-- SLIKA -->
            <div class="product-image">

              <img
                v-if="stavka.slika_url"
                :src="stavka.slika_url"
                :alt="stavka.proizvod_naziv"
              />

              <q-icon
                v-else
                name="image"
                size="40px"
                color="grey-6"
              />

            </div>


            <!-- PODACI -->
            <div class="product-info">

              <div class="product-name">
                {{ stavka.proizvod_naziv }}
              </div>

              <div class="text-grey-6 q-mt-xs">
                Količina:
                {{ stavka.kolicina }}
                {{ stavka.jedinica_mjere || "" }}
              </div>

              <div class="text-grey-6">
                Cijena po jedinici:
                {{ money(stavka.cijena_po_jedinici) }}
              </div>

            </div>


            <!-- UKUPNO -->
            <div class="product-total">

              {{ money(stavka.ukupno) }}

            </div>

          </div>

        </q-card-section>


        <!-- UKUPNO -->
        <q-separator />

        <q-card-section>

          <div class="total-line">
            <span>Ukupno bez PDV-a:</span>

            <strong>
              {{ money(narudzba.ukupno_bez_pdv) }}
            </strong>
          </div>


          <div class="total-line">
            <span>PDV:</span>

            <strong>
              {{ money(narudzba.iznos_pdv) }}
            </strong>
          </div>


          <div class="total-line final-total">
            <span>Ukupno:</span>

            <strong>
              {{ money(narudzba.ukupno_sa_pdv) }}
            </strong>
          </div>

        </q-card-section>

      </q-card>


      <!-- PODACI ZA DOSTAVU -->
      <q-card
        v-if="
          narudzba.adresa_dostave ||
          narudzba.grad_dostave ||
          narudzba.telefon_dostave
        "
        flat
        bordered
        class="order-card q-mt-lg"
      >

        <q-card-section>

          <div class="text-h6 q-mb-md">
            Podaci za dostavu
          </div>

          <div
            v-if="narudzba.ime_primatelja || narudzba.prezime_primatelja"
            class="info-row"
          >
            <strong>Primatelj:</strong>

            <span>
              {{ narudzba.ime_primatelja || "" }}
              {{ narudzba.prezime_primatelja || "" }}
            </span>
          </div>


          <div
            v-if="narudzba.adresa_dostave"
            class="info-row"
          >
            <strong>Adresa:</strong>

            <span>
              {{ narudzba.adresa_dostave }}
            </span>
          </div>


          <div
            v-if="narudzba.grad_dostave"
            class="info-row"
          >
            <strong>Grad:</strong>

            <span>
              {{ narudzba.grad_dostave }}
            </span>
          </div>


          <div
            v-if="narudzba.postanski_broj"
            class="info-row"
          >
            <strong>Poštanski broj:</strong>

            <span>
              {{ narudzba.postanski_broj }}
            </span>
          </div>


          <div
            v-if="narudzba.telefon_dostave"
            class="info-row"
          >
            <strong>Telefon:</strong>

            <span>
              {{ narudzba.telefon_dostave }}
            </span>
          </div>


          <div
            v-if="narudzba.nacin_placanja"
            class="info-row"
          >
            <strong>Način plaćanja:</strong>

            <span>
              {{ narudzba.nacin_placanja }}
            </span>
          </div>

        </q-card-section>

      </q-card>


      <!-- NATRAG -->
      <div class="q-mt-lg">

        <q-btn
          color="primary"
          icon="arrow_back"
          label="Natrag na moje narudžbe"
          no-caps
          unelevated
          @click="$router.push('/moje-narudzbe')"
        />

      </div>

    </div>

  </q-page>
</template>


<script>
import { api } from "boot/axios";

export default {

  name: "NarudzbaDetaljiPage",

  data() {
    return {

      narudzba: null,

      loading: true,

      error: null,

    };
  },


  mounted() {

    this.ucitajNarudzbu();

  },


  methods: {

    // =====================================================
    // UČITAJ NARUDŽBU
    // =====================================================

    async ucitajNarudzbu() {

      this.loading = true;

      this.error = null;

      try {

        const id = this.$route.params.id;

        if (!id) {

          this.error = "ID narudžbe nije pronađen.";

          return;

        }


        const response =
          await api.get(`/narudzbe/${id}`);


        if (
          response.data &&
          response.data.success
        ) {

          this.narudzba =
            response.data.data;

        } else {

          this.error =
            response.data?.message ||
            "Narudžba nije pronađena.";

        }

      } catch (error) {

        console.error(
          "Greška pri dohvaćanju detalja narudžbe:",
          error
        );

        this.error =
          error.response?.data?.message ||
          "Greška pri dohvaćanju narudžbe.";

      } finally {

        this.loading = false;

      }

    },


    // =====================================================
    // FORMAT DATUMA
    // =====================================================

    formatDate(date) {

      if (!date) {
        return "-";
      }

      return new Date(date).toLocaleString(
        "hr-HR"
      );

    },


    // =====================================================
    // FORMAT CIJENE
    // =====================================================

    money(value) {

      const number = Number(value || 0);

      return number.toFixed(2) + " €";

    },


    // =====================================================
    // STATUS
    // =====================================================

    statusColor(color) {

      if (!color) {
        return "primary";
      }

      return color;

    },

  },

};
</script>


<style scoped>

.page-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 16px;
}

.order-card {
  background: rgba(255, 255, 255, 0.02);
}

.status-badge {
  font-size: 14px;
  padding: 7px 12px;
}

.product-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.product-row:last-child {
  border-bottom: none;
}

.product-image {
  width: 80px;
  height: 80px;
  min-width: 80px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;

  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 17px;
  font-weight: 600;
}

.product-total {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.total-line {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.final-total {
  margin-top: 10px;
  padding-top: 15px;

  border-top: 1px solid rgba(255, 255, 255, 0.1);

  font-size: 20px;
}

.info-row {
  display: flex;
  gap: 15px;
  padding: 7px 0;
}

.info-row strong {
  min-width: 150px;
}

@media (max-width: 600px) {

  .product-row {
    align-items: flex-start;
  }

  .product-image {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }

  .product-total {
    font-size: 15px;
  }

  .info-row {
    flex-direction: column;
    gap: 2px;
  }

}

</style>