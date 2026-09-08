<template>

  <q-page class="q-pa-md">

    <!-- LOADING -->

    <div v-if="loading" class="flex flex-center q-py-xl">

      <q-spinner color="primary" size="60px" />

    </div>

    <!-- PROIZVOD -->

    <div v-else-if="product" class="row q-col-gutter-lg">

      <!-- Slika -->

      <div class="col-12 col-md-5 product-image-column">

        <q-img

          :src="product.slika_url || '/images/product-placeholder.jpg'"

          style="height: 350px"

          contain

        />

      </div>

      <!-- Podaci -->

      <div class="col-12 col-md-7">

        <!-- Naziv + lista želja -->

        <div class="row items-start justify-between no-wrap">

          <div class="text-h4 text-primary">

            {{ product.naziv }}

          </div>

          <q-btn

            round

            flat

            :color="inWishlist ? 'negative' : 'grey-5'"

            :icon="inWishlist ? 'favorite' : 'favorite_border'"

            @click="toggleWishlist"

          >

            <q-tooltip>

              {{

                inWishlist

                  ? "Ukloni s liste želja"

                  : "Dodaj na listu želja"

              }}

            </q-tooltip>

          </q-btn>

        </div>

        <!-- Kategorija / proizvođač -->

        <div class="q-mt-sm">

          <q-badge color="primary" outline>

            {{ product.kategorija_naziv || "Bez kategorije" }}

          </q-badge>

          <q-badge

            color="secondary"

            outline

            class="q-ml-sm"

          >

            {{ product.proizvodac_naziv || "Nepoznati" }}

          </q-badge>

        </div>

        <!-- Cijena -->

        <div class="text-h3 text-primary q-mt-md">

          {{ Number(product.cijena).toFixed(2) }} €

          <span class="text-subtitle1 text-grey-7">

            / {{ product.jedinica_mjere || "kom" }}

          </span>

        </div>

        <!-- Zaliha -->

        <div class="q-mt-sm">

          <q-badge

            :color="

              Number(product.stanje_zaliha) > 0

                ? 'positive'

                : 'negative'

            "

            size="md"

          >

            {{

              Number(product.stanje_zaliha) > 0

                ? "✅ Na stanju"

                : "❌ Nema na stanju"

            }}

          </q-badge>

          <span

            class="text-caption q-ml-sm"

            v-if="Number(product.stanje_zaliha) > 0"

          >

            ({{ product.stanje_zaliha }} kom)

          </span>

        </div>

        <q-separator class="q-my-md" />

        <!-- Opis -->

        <div v-if="product.opis" class="q-mb-md">

          <div class="text-subtitle1 text-bold">

            Opis

          </div>

          <p>{{ product.opis }}</p>

        </div>

        <!-- Detalji -->

        <div class="text-h6 q-mb-md">

          Detalji proizvoda

        </div>

        <q-list bordered separator class="rounded-borders">

          <q-item v-if="product.sifra">

            <q-item-section>

              Šifra proizvoda

            </q-item-section>

            <q-item-section side>

              {{ product.sifra }}

            </q-item-section>

          </q-item>

          <q-item v-if="product.namjena">

            <q-item-section>

              Namjena

            </q-item-section>

            <q-item-section side>

              {{ product.namjena }}

            </q-item-section>

          </q-item>

          <q-item v-if="product.jedinica_mjere">

            <q-item-section>

              Jedinica mjere

            </q-item-section>

            <q-item-section side>

              {{ product.jedinica_mjere }}

            </q-item-section>

          </q-item>

          <q-item v-if="product.dimenzije">

            <q-item-section>

              Dimenzije

            </q-item-section>

            <q-item-section side>

              {{ product.dimenzije }}

            </q-item-section>

          </q-item>

          <q-item v-if="product.tezina">

            <q-item-section>

              Težina

            </q-item-section>

            <q-item-section side>

              {{ product.tezina }} kg

            </q-item-section>

          </q-item>

          <!-- Ocjena -->

          <q-item>

            <q-item-section>

              Prosječna ocjena

            </q-item-section>

            <q-item-section side>

              {{ Number(product.prosjecna_ocjena || 0).toFixed(1) }}

              / 5

              ({{ reviews.length }} recenzija)

            </q-item-section>

          </q-item>

        </q-list>

        <!-- KOŠARICA -->

        <q-btn

          color="primary"

          label="Dodaj u košaricu"

          size="lg"

          no-caps

          class="full-width q-mt-lg"

          @click="addToCart(product)"

          :disabled="Number(product.stanje_zaliha) <= 0"

        />

        <!-- RECENZIJA -->

        <q-btn

          v-if="isLoggedIn"

          color="warning"

          text-color="dark"

          label="Napiši recenziju"

          icon="rate_review"

          size="lg"

          no-caps

          class="full-width q-mt-md"

          @click="openReviewDialog"

        />

      </div>

    </div>

    <!-- ===================================================== -->

    <!-- RECENZIJE -->

    <!-- ===================================================== -->

    <div

      v-if="product"

      class="q-mt-xl"

    >

      <div class="text-h5 q-mb-md">

        <q-icon

          name="star"

          color="warning"

        />

        Recenzije ({{ reviews.length }})

      </div>

      <!-- NEMA RECENZIJA -->

      <div

        v-if="reviews.length === 0"

        class="text-grey-6 q-pa-md"

      >

        Ovaj proizvod još nema recenzija.

      </div>

      <!-- RECENZIJE -->

      <q-card

        v-for="rec in reviews"

        :key="rec.id_recenzija"

        flat

        bordered

        class="q-mb-sm"

      >

        <q-card-section>

          <div class="row items-center">

            <div class="col">

              <div class="text-subtitle1 text-bold">

                {{ rec.korisnicko_ime || "Anonimni korisnik" }}

              </div>

              <div class="text-caption text-grey-7">

                {{

                  new Date(

                    rec.datum_kreiranja

                  ).toLocaleDateString("hr-HR")

                }}

              </div>

            </div>

            <div class="col-auto">

              <q-rating

                :model-value="Number(rec.ocjena)"

                max="5"

                readonly

                color="warning"

              />

            </div>

          </div>

          <!-- Naslov -->

          <div

            v-if="rec.naslov"

            class="text-subtitle1 text-bold q-mt-md"

          >

            {{ rec.naslov }}

          </div>

          <!-- Komentar -->

          <div class="q-mt-sm">

            {{ rec.komentar || "Bez komentara." }}

          </div>

        </q-card-section>

      </q-card>

    </div>

    <!-- ===================================================== -->

    <!-- GREŠKA -->

    <!-- ===================================================== -->

    <div

      v-else-if="!loading && !product"

      class="text-center q-py-xl"

    >

      <q-icon

        name="error"

        size="64px"

        color="negative"

      />

      <div class="text-h5 q-mt-sm">

        Proizvod nije pronađen

      </div>

      <q-btn

        color="primary"

        label="Natrag na proizvode"

        to="/proizvodi"

        class="q-mt-md"

      />

    </div>

    <!-- ===================================================== -->

    <!-- DIJALOG ZA RECENZIJU -->

    <!-- ===================================================== -->

    <q-dialog v-model="reviewDialog">

      <q-card

        style="width: 600px; max-width: 90vw;"

      >

        <q-card-section>

          <div class="text-h6">

            Napiši recenziju

          </div>

          <div class="text-caption text-grey-7 q-mt-xs">

            {{ product?.naziv }}

          </div>

        </q-card-section>

        <q-separator />

        <q-card-section>

          <!-- Ocjena -->

          <div class="q-mb-lg">

            <div class="text-subtitle2 q-mb-sm">

              Ocjena

            </div>

            <q-rating

              v-model="review.ocjena"

              max="5"

              size="2.5em"

              color="warning"

              icon="star_border"

              icon-selected="star"

            />

          </div>

          <!-- Naslov -->

          <q-input

            v-model="review.naslov"

            label="Naslov recenzije"

            outlined

            maxlength="100"

            counter

            class="q-mb-md"

          />

          <!-- Komentar -->

          <q-input

            v-model="review.komentar"

            label="Komentar"

            type="textarea"

            outlined

            maxlength="1000"

            counter

            autogrow

          />

        </q-card-section>

        <q-separator />

        <q-card-actions

          align="right"

          class="q-pa-md"

        >

          <q-btn

            flat

            label="Odustani"

            color="grey"

            no-caps

            v-close-popup

          />

          <q-btn

            color="primary"

            label="Objavi recenziju"

            icon="send"

            no-caps

            :loading="reviewSaving"

            @click="saveReview"

          />

        </q-card-actions>

      </q-card>

    </q-dialog>

  </q-page>

</template>

<script>

import { api } from "boot/axios";

export default {

  name: "ProizvodDetalji",

  data() {

    return {

      product: null,

      loading: true,

      inWishlist: false,

      reviews: [],

      isLoggedIn: false,

      reviewDialog: false,

      reviewSaving: false,

      review: {

        ocjena: 5,

        naslov: "",

        komentar: "",

      },

    };

  },

  mounted() {

    this.checkLogin();

    this.loadProduct();

  },

  methods: {

    // ========================================================

    // PROVJERA PRIJAVE

    // ========================================================

    checkLogin() {

      const token =

        localStorage.getItem("terabuild_token");

      this.isLoggedIn = !!token;

    },

    // ========================================================

    // DOHVAT PROIZVODA

    // ========================================================

    async loadProduct() {

      this.loading = true;

      try {

        const id = this.$route.params.id;

        console.log(

          "📤 Dohvaćam proizvod ID:",

          id

        );

        const response =

          await api.get(`/proizvodi/${id}`);

        console.log(

          "📥 Odgovor:",

          response.data

        );

        this.product =

          response.data.data;

        await Promise.all([

          this.checkWishlist(),

          this.loadReviews(),

          this.loadMyReview(),

        ]);

      } catch (error) {

        console.error(

          "❌ Greška:",

          error

        );

        this.$q.notify({

          type: "negative",

          message:

            "Greška pri učitavanju proizvoda.",

          position: "top-right",

        });

      } finally {

        this.loading = false;

      }

    },

    // ========================================================

    // DOHVAT RECENZIJA PROIZVODA

    // ========================================================

    async loadReviews() {

      if (!this.product) {

        return;

      }

      try {

        const id =

          this.product.id_proizvod;

        const response =

          await api.get(

            `/recenzije/proizvod/${id}`

          );

        this.reviews =

          response.data?.data || [];

        console.log(

          "📋 Recenzije:",

          this.reviews

        );

      } catch (error) {

        console.error(

          "Greška pri dohvaćanju recenzija:",

          error

        );

        this.reviews = [];

      }

    },

    // ========================================================

    // DOHVAT MOJE RECENZIJE

    // ========================================================

    async loadMyReview() {

      if (!this.isLoggedIn || !this.product) {

        return;

      }

      try {

        const id =

          this.product.id_proizvod;

        const response =

          await api.get(

            `/recenzije/moja/${id}`

          );

        const mojaRecenzija =

          response.data?.data;

        if (mojaRecenzija) {

          this.review = {

            ocjena:

              Number(

                mojaRecenzija.ocjena

              ),

            naslov:

              mojaRecenzija.naslov || "",

            komentar:

              mojaRecenzija.komentar || "",

          };

        }

      } catch (error) {

        console.error(

          "Greška pri dohvaćanju moje recenzije:",

          error

        );

      }

    },

    // ========================================================

    // LISTA ŽELJA - PROVJERA

    // ========================================================

    async checkWishlist() {

      if (

        !localStorage.getItem(

          "terabuild_token"

        ) ||

        !this.product

      ) {

        this.inWishlist = false;

        return;

      }

      try {

        const response =

          await api.get(

            `/lista-zelja/check/${this.product.id_proizvod}`

          );

        this.inWishlist =

          response.data?.exists === true;

      } catch (error) {

        console.error(

          "Greška pri provjeri liste želja:",

          error

        );

        this.inWishlist = false;

      }

    },

    // ========================================================

    // LISTA ŽELJA - DODAJ / UKLONI

    // ========================================================

    async toggleWishlist() {

      if (!this.product) {

        return;

      }

      const token =

        localStorage.getItem(

          "terabuild_token"

        );

      if (!token) {

        this.$q.notify({

          type: "warning",

          message:

            "Za listu želja morate se prijaviti.",

          position: "top-right",

          actions: [

            {

              label: "Prijava",

              color: "white",

              handler: () =>

                this.$router.push(

                  "/prijava"

                ),

            },

          ],

        });

        return;

      }

      try {

        const id =

          Number(

            this.product.id_proizvod

          );

        if (this.inWishlist) {

          await api.delete(

            `/lista-zelja/${id}`

          );

          this.inWishlist = false;

          this.$q.notify({

            type: "info",

            message:

              "Proizvod uklonjen s liste želja.",

            position: "top-right",

          });

        } else {

          await api.post(

            "/lista-zelja",

            {

              id_proizvod: id,

            }

          );

          this.inWishlist = true;

          this.$q.notify({

            type: "positive",

            message:

              "Proizvod dodan na listu želja.",

            position: "top-right",

          });

        }

      } catch (error) {

        console.error(

          "Greška pri promjeni liste želja:",

          error

        );

        this.$q.notify({

          type: "negative",

          message:

            error.response?.data?.message ||

            "Listu želja nije moguće ažurirati.",

          position: "top-right",

        });

      }

    },

    // ========================================================

    // OTVORI DIJALOG RECENZIJE

    // ========================================================

    openReviewDialog() {

      if (!this.isLoggedIn) {

        this.$q.notify({

          type: "warning",

          message:

            "Za pisanje recenzije morate se prijaviti.",

          position: "top-right",

        });

        return;

      }

      this.reviewDialog = true;

    },

    // ========================================================

    // SPREMI RECENZIJU

    // ========================================================

    async saveReview() {

      if (!this.product) {

        return;

      }

      if (

        !this.review.ocjena ||

        Number(this.review.ocjena) < 1 ||

        Number(this.review.ocjena) > 5

      ) {

        this.$q.notify({

          type: "warning",

          message:

            "Odaberite ocjenu od 1 do 5.",

          position: "top-right",

        });

        return;

      }

      if (

        !this.review.naslov ||

        !this.review.naslov.trim()

      ) {

        this.$q.notify({

          type: "warning",

          message:

            "Unesite naslov recenzije.",

          position: "top-right",

        });

        return;

      }

      if (

        !this.review.komentar ||

        !this.review.komentar.trim()

      ) {

        this.$q.notify({

          type: "warning",

          message:

            "Unesite komentar.",

          position: "top-right",

        });

        return;

      }

      this.reviewSaving = true;

      try {

        await api.post(

          "/recenzije",

          {

            id_proizvod:

              Number(

                this.product.id_proizvod

              ),

            ocjena:

              Number(

                this.review.ocjena

              ),

            naslov:

              this.review.naslov.trim(),

            komentar:

              this.review.komentar.trim(),

          }

        );

        this.$q.notify({

          type: "positive",

          message:

            "Recenzija je uspješno dodana.",

          position: "top-right",

        });

        this.reviewDialog = false;

        await this.loadReviews();

        // Ponovno dohvaćanje proizvoda

        // zbog prosječne ocjene

        const response =

          await api.get(

            `/proizvodi/${this.product.id_proizvod}`

          );

        this.product =

          response.data.data;

      } catch (error) {

        console.error(

          "Greška pri spremanju recenzije:",

          error

        );

        this.$q.notify({

          type: "negative",

          message:

            error.response?.data?.message ||

            "Recenzija nije mogla biti spremljena.",

          position: "top-right",

        });

      } finally {

        this.reviewSaving = false;

      }

    },

    // ========================================================

    // KOŠARICA

    // ========================================================

    addToCart(product) {

      let cart =

        JSON.parse(

          localStorage.getItem(

            "terabuild_cart"

          ) || "[]"

        );

      const existing =

        cart.find(

          (item) =>

            Number(item.id) ===

            Number(product.id_proizvod)

        );

      if (existing) {

        existing.kolicina += 1;

      } else {

        cart.push({

          id:

            product.id_proizvod,

          naziv:

            product.naziv,

          cijena:

            product.cijena,

          jedinica:

            product.jedinica_mjere ||

            "kom",

          slika_url:

            product.slika_url,

          kolicina: 1,

        });

      }

      localStorage.setItem(

        "terabuild_cart",

        JSON.stringify(cart)

      );

      this.$q.notify({

        type: "positive",

        message:

          `"${product.naziv}" dodan u košaricu!`,

        position: "top-right",

      });

    },

  },

};

</script>

<style scoped>
.product-image-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-detail-image {
  width: 100%;
  height: 430px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.product-detail-image :deep(img) {
  padding: 20px;
}

@media (max-width: 1023px) {
  .product-detail-image {
    height: 360px;
  }
}

@media (max-width: 599px) {
  .product-detail-image {
    height: 300px;
  }
}
</style>
