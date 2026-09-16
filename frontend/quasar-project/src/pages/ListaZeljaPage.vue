<template>
  <q-page class="wishlist-page q-pa-lg">

    <!-- ===================================================== -->
    <!-- NASLOV -->
    <!-- ===================================================== -->

    <div class="page-header q-mb-xl">
      <div class="title-section">

        <div class="title-icon">
          <q-icon
            name="favorite"
            size="30px"
          />
        </div>

        <div>
          <div class="page-title">
            Lista želja
          </div>

          <div class="page-subtitle">
            Proizvodi koje ste spremili za kasniju kupnju
          </div>
        </div>

      </div>

      <div
        v-if="products.length > 0"
        class="wishlist-count"
      >
        <q-icon
          name="favorite"
          size="17px"
        />
        {{ products.length }}
        {{ products.length === 1 ? "proizvod" : "proizvoda" }}
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- UČITAVANJE -->
    <!-- ===================================================== -->

    <div
      v-if="loading"
      class="loading-container"
    >
      <q-spinner
        color="primary"
        size="55px"
      />

      <div class="loading-text">
        Učitavanje liste želja...
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- PRAZNA LISTA -->
    <!-- ===================================================== -->

    <div
      v-else-if="products.length === 0"
      class="empty-wishlist"
    >

      <div class="empty-icon">
        <q-icon
          name="favorite_border"
          size="75px"
        />
      </div>

      <div class="empty-title">
        Lista želja je prazna
      </div>

      <div class="empty-text">
        Na stranici proizvoda pritisnite srce
        kako biste spremili proizvod za kasniju kupnju.
      </div>

      <q-btn
        color="primary"
        label="Pregledaj proizvode"
        icon="storefront"
        to="/proizvodi"
        class="browse-button"
        no-caps
        unelevated
      />

    </div>


    <!-- ===================================================== -->
    <!-- PROIZVODI -->
    <!-- ===================================================== -->

    <div
      v-else
      class="products-grid"
    >

      <div
        v-for="item in products"
        :key="item.id_proizvod"
        class="product-column"
      >

        <q-card
          class="product-card"
          bordered
        >

          <!-- ================================================= -->
          <!-- SLIKA -->
          <!-- ================================================= -->

          <div
            class="product-image-wrapper cursor-pointer"
            @click="goToProduct(item.id_proizvod)"
          >

            <q-img
              :src="
                item.slika_url ||
                '/images/product-placeholder.jpg'
              "
              class="product-image"
              fit="contain"
            >

              <template v-slot:error>

                <div class="image-error">

                  <q-icon
                    name="image_not_supported"
                    size="42px"
                    color="grey-5"
                  />

                  <div>
                    Slika nije dostupna
                  </div>

                </div>

              </template>

            </q-img>


            <!-- UKLONI IZ LISTE -->

            <q-btn
              round
              unelevated
              size="md"
              color="negative"
              icon="favorite"
              class="wishlist-btn"
              @click.stop="
                removeFromList(
                  item.id_proizvod
                )
              "
            >

              <q-tooltip>
                Ukloni s liste želja
              </q-tooltip>

            </q-btn>

          </div>


          <!-- ================================================= -->
          <!-- INFORMACIJE -->
          <!-- ================================================= -->

          <q-card-section
            class="product-info cursor-pointer"
            @click="goToProduct(item.id_proizvod)"
          >

            <!-- KATEGORIJA -->

            <div class="product-category">

              <q-icon
                name="category"
                size="15px"
              />

              {{ item.kategorija_naziv || "Bez kategorije" }}

            </div>


            <!-- NAZIV -->

            <div class="product-name">
              {{ item.proizvod_naziv }}
            </div>


            <!-- CIJENA -->

            <div class="product-price">

              {{ Number(item.cijena).toFixed(2) }}

              <span class="currency">
                €
              </span>

              <span class="unit">
                / {{ item.jedinica_mjere || "kom" }}
              </span>

            </div>


            <!-- ZALIHA -->

            <q-badge
              :color="
                Number(item.stanje_zaliha) > 0
                  ? 'positive'
                  : 'negative'
              "
              class="stock-badge"
            >

              <q-icon
                :name="
                  Number(item.stanje_zaliha) > 0
                    ? 'check_circle'
                    : 'cancel'
                "
                size="15px"
                class="q-mr-xs"
              />

              {{
                Number(item.stanje_zaliha) > 0
                  ? "Na stanju"
                  : "Nema na stanju"
              }}

            </q-badge>

          </q-card-section>


          <!-- ================================================= -->
          <!-- AKCIJE -->
          <!-- ================================================= -->

          <q-card-actions class="product-actions">

            <q-btn
              color="primary"
              label="Dodaj u košaricu"
              icon="shopping_cart"
              no-caps
              unelevated
              class="add-cart-btn"
              :disabled="
                Number(item.stanje_zaliha) <= 0
              "
              @click="addToCart(item)"
            />

          </q-card-actions>

        </q-card>

      </div>

    </div>

  </q-page>
</template>


<script>

import { api } from "boot/axios";

export default {

  name: "ListaZeljaPage",


  data() {

    return {

      products: [],

      loading: true,

    };

  },


  mounted() {

    this.loadList();

  },


  methods: {

    // =====================================================
    // UČITAVANJE LISTE
    // =====================================================

    async loadList() {

      this.loading = true;

      try {

        const response =
          await api.get(
            "/lista-zelja"
          );

        this.products = response.data?.data || [];

      } catch (error) {

        console.error(
          "Greška pri učitavanju liste:",
          error
        );

        this.products = [];

        this.$q.notify({

          type: "negative",

          message:
            error.response?.data?.message ||
            "Lista želja nije mogla biti učitana.",

          position: "top-right",

        });

      } finally {

        this.loading = false;

      }

    },


    // =====================================================
    // DETALJI PROIZVODA
    // =====================================================

    goToProduct(id) {

      this.$router.push(
        `/proizvod/${id}`
      );

    },


    // =====================================================
    // DODAJ U KOŠARICU
    // =====================================================

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
            product.proizvod_naziv,

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
          `"${product.proizvod_naziv}" dodan u košaricu!`,

        position: "top-right",

      });

    },


    // =====================================================
    // UKLONI IZ LISTE ŽELJA
    // =====================================================

    async removeFromList(productId) {

      try {

        await api.delete(
          `/lista-zelja/${productId}`
        );


        this.products =
          this.products.filter(

            (item) =>

              Number(item.id_proizvod) !==
              Number(productId)

          );


        this.$q.notify({

          type: "positive",

          message:
            "Proizvod uklonjen s liste želja.",

          position: "top-right",

        });

      } catch (error) {

        console.error(
          "Greška pri brisanju s liste:",
          error
        );


        this.$q.notify({

          type: "negative",

          message:
            error.response?.data?.message ||
            "Greška pri uklanjanju proizvoda.",

          position: "top-right",

        });

      }

    },

  },

};

</script>


<style scoped>

/* ========================================================= */
/* GLAVNA STRANICA */
/* ========================================================= */

.wishlist-page {

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
    rgba(244, 67, 54, 0.12);

  border:
    1px solid rgba(244, 67, 54, 0.35);

  color: #ef5350;

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


.wishlist-count {

  display: flex;

  align-items: center;

  gap: 6px;

  padding: 9px 14px;

  border-radius: 20px;

  background:
    rgba(244, 67, 54, 0.1);

  border:
    1px solid rgba(244, 67, 54, 0.25);

  color: #ef5350;

  font-size: 13px;

  font-weight: 650;

}


/* ========================================================= */
/* LOADING */
/* ========================================================= */

.loading-container {

  min-height: 450px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}


.loading-text {

  margin-top: 18px;

  color: #858e95;

  font-size: 14px;

}


/* ========================================================= */
/* PRAZNA LISTA */
/* ========================================================= */

.empty-wishlist {

  max-width: 700px;

  min-height: 450px;

  margin: 50px auto;

  padding: 55px 30px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 20px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.2);

}


.empty-icon {

  width: 115px;

  height: 115px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(244, 67, 54, 0.1);

  color: #ef5350;

}


.empty-title {

  margin-top: 25px;

  font-size: 25px;

  font-weight: 750;

}


.empty-text {

  max-width: 500px;

  margin-top: 9px;

  color: #858e95;

  font-size: 15px;

  line-height: 1.6;

}


.browse-button {

  margin-top: 25px;

  min-width: 205px;

  height: 44px;

  border-radius: 9px;

  font-weight: 650;

}


/* ========================================================= */
/* GRID PROIZVODA */
/* ========================================================= */

.products-grid {

  max-width: 1450px;

  margin: 0 auto;

  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 20px;

}


.product-column {

  min-width: 0;

}


/* ========================================================= */
/* KARTICA */
/* ========================================================= */

.product-card {

  height: 100%;

  display: flex;

  flex-direction: column;

  overflow: hidden;

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 15px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

}


.product-card:hover {

  transform:
    translateY(-5px);

  border-color:
    #3a4247;

  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.25);

}


/* ========================================================= */
/* SLIKA */
/* ========================================================= */

.product-image-wrapper {

  position: relative;

  height: 220px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #ffffff;

  overflow: hidden;

}


.product-image {

  width: 100%;

  height: 100%;

}


.product-image :deep(img) {

  object-fit: contain !important;

  padding: 14px;

  transition:
    transform 0.3s ease;

}


.product-card:hover
.product-image :deep(img) {

  transform:
    scale(1.04);

}


/* ========================================================= */
/* HEART BUTTON */
/* ========================================================= */

.wishlist-btn {

  position: absolute;

  top: 12px;

  right: 12px;

  z-index: 5;

  box-shadow:
    0 3px 12px rgba(0, 0, 0, 0.22);

}


/* ========================================================= */
/* ERROR SLIKE */
/* ========================================================= */

.image-error {

  width: 100%;

  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  background: #f1f1f1;

  color: #888;

  font-size: 12px;

}


/* ========================================================= */
/* INFORMACIJE */
/* ========================================================= */

.product-info {

  flex: 1;

  padding: 17px 18px 12px;

}


.product-category {

  display: flex;

  align-items: center;

  gap: 5px;

  color: #7e898f;

  font-size: 12px;

  margin-bottom: 8px;

}


.product-name {

  min-height: 46px;

  color: #f1f3f4;

  font-size: 17px;

  font-weight: 700;

  line-height: 1.35;

}


.product-price {

  margin-top: 13px;

  color: #42a5f5;

  font-size: 23px;

  font-weight: 800;

}


.currency {

  font-size: 20px;

}


.unit {

  color: #747e84;

  font-size: 12px;

  font-weight: 500;

}


.stock-badge {

  margin-top: 12px;

  padding: 6px 9px;

  border-radius: 6px;

  font-size: 11px;

}


/* ========================================================= */
/* AKCIJE */
/* ========================================================= */

.product-actions {

  padding: 12px 18px 18px;

}


.add-cart-btn {

  width: 100%;

  height: 42px;

  border-radius: 8px;

  font-weight: 650;

}


/* ========================================================= */
/* TABLET */
/* ========================================================= */

@media (max-width: 1100px) {

  .products-grid {

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

  }

}


/* ========================================================= */
/* MANJI TABLET */
/* ========================================================= */

@media (max-width: 800px) {

  .products-grid {

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

  }


  .page-header {

    align-items: flex-start;

    flex-direction: column;

  }

}


/* ========================================================= */
/* MOBITEL */
/* ========================================================= */

@media (max-width: 550px) {

  .wishlist-page {

    padding: 16px !important;

  }


  .page-title {

    font-size: 27px;

  }


  .title-icon {

    width: 48px;

    height: 48px;

  }


  .products-grid {

    grid-template-columns:
      1fr;

    gap: 16px;

  }


  .product-image-wrapper {

    height: 230px;

  }


  .page-header {

    margin-bottom: 20px;

  }


  .wishlist-count {

    align-self: flex-start;

  }

}

</style>