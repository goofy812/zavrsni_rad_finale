<template>
  <q-page class="products-page q-pa-lg">

    <!-- ===================================================== -->
    <!-- NASLOV -->
    <!-- ===================================================== -->

    <div class="page-header q-mb-xl">
      <div class="title-row">
        <div class="title-icon">
          <q-icon name="inventory_2" size="28px" />
        </div>

        <div>
          <div class="page-title">
            Naši proizvodi
          </div>

          <div class="page-subtitle">
            Pronađite građevinski materijal i opremu potrebnu za vaš projekt.
          </div>
        </div>
      </div>

      <q-breadcrumbs class="breadcrumbs q-mt-md">
        <q-breadcrumbs-el
          label="Početna"
          to="/"
          icon="home"
        />

        <q-breadcrumbs-el
          label="Proizvodi"
        />
      </q-breadcrumbs>
    </div>


    <!-- ===================================================== -->
    <!-- FILTERI -->
    <!-- ===================================================== -->

    <div class="filters-card q-mb-xl">

      <div class="filters-title">
        <q-icon name="tune" />
        <span>Pretražite i filtrirajte proizvode</span>
      </div>

      <div class="row q-col-gutter-md">

        <!-- KATEGORIJA -->
        <div class="col-12 col-sm-3">
          <q-select
            v-model="filterCategory"
            :options="categories"
            label="Kategorija"
            option-label="naziv"
            option-value="id_kategorija"
            emit-value
            map-options
            clearable
            dense
            outlined
            dark
            color="primary"
            :loading="categoriesLoading"
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-select>
        </div>


        <!-- SORTIRANJE -->
        <div class="col-12 col-sm-3">
          <q-select
            v-model="filterSort"
            :options="sortOptions"
            label="Sortiraj po"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            clearable
            dense
            outlined
            dark
            color="primary"
          >
            <template v-slot:prepend>
              <q-icon name="sort" />
            </template>
          </q-select>
        </div>


        <!-- PRETRAGA -->
        <div class="col-12 col-sm-4">
          <q-input
            v-model="filterSearch"
            label="Pretraži proizvode..."
            dense
            outlined
            clearable
            dark
            color="primary"
            @keyup.enter="searchProducts"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>

            <template v-slot:append>
              <q-icon
                name="search"
                class="cursor-pointer"
                @click="searchProducts"
              />
            </template>
          </q-input>
        </div>


        <!-- OČISTI -->
        <div class="col-12 col-sm-2 flex items-center">
          <q-btn
            outline
            color="primary"
            label="Očisti"
            icon="filter_alt_off"
            no-caps
            class="full-width clear-button"
            @click="resetFilters"
          />
        </div>

      </div>


      <!-- AKTIVNI FILTERI -->

      <div
        v-if="filterCategory || filterSort || filterSearch"
        class="active-filters q-mt-md"
      >

        <span class="active-label">
          Aktivni filteri:
        </span>

        <q-chip
          v-if="filterCategory"
          color="primary"
          text-color="white"
          removable
          @remove="filterCategory = null"
        >
          <q-icon name="category" class="q-mr-xs" />
          Kategorija
        </q-chip>

        <q-chip
          v-if="filterSort"
          color="primary"
          text-color="white"
          removable
          @remove="filterSort = null"
        >
          <q-icon name="sort" class="q-mr-xs" />
          Sortiranje
        </q-chip>

        <q-chip
          v-if="filterSearch"
          color="primary"
          text-color="white"
          removable
          @remove="filterSearch = ''"
        >
          <q-icon name="search" class="q-mr-xs" />
          {{ filterSearch }}
        </q-chip>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- LOADING -->
    <!-- ===================================================== -->

    <div
      v-if="loading"
      class="loading-container"
    >
      <q-spinner
        color="primary"
        size="60px"
      />

      <div class="loading-text">
        Učitavanje proizvoda...
      </div>
    </div>


    <!-- ===================================================== -->
    <!-- PROIZVODI -->
    <!-- ===================================================== -->

    <div
      v-else-if="products.length > 0"
    >

      <div class="products-header q-mb-lg">

        <div>
          <div class="products-title">
            Proizvodi
          </div>

          <div class="products-subtitle">
            Odaberite proizvod za više informacija.
          </div>
        </div>

        <div class="product-count">
          <q-icon name="inventory_2" />
          {{ products.length }} proizvoda
        </div>

      </div>


      <div class="row q-col-gutter-lg">

        <div
          v-for="product in products"
          :key="product.id_proizvod"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >

          <q-card
            class="product-card"
            flat
            bordered
          >

            <!-- SLIKA -->

            <div
              class="product-image-wrapper cursor-pointer"
              @click="goToProduct(product.id_proizvod)"
            >

              <q-img
                :src="
                  product.slika_url ||
                  '/images/product-placeholder.jpg'
                "
                class="product-image"
                fit="contain"
              >

                <template v-slot:error>
                  <div class="image-error">
                    <q-icon
                      name="image_not_supported"
                      size="48px"
                      color="grey-5"
                    />

                    <div>
                      Slika nije dostupna
                    </div>
                  </div>
                </template>

              </q-img>

              <!-- BADGE -->

              <div class="image-badge">
                <q-icon
                  name="visibility"
                  size="15px"
                />

                Pregled
              </div>

            </div>


            <!-- INFORMACIJE -->

            <q-card-section
              class="product-info cursor-pointer"
              @click="goToProduct(product.id_proizvod)"
            >

              <!-- NAZIV -->

              <div class="product-name">
                {{ product.naziv }}
              </div>


              <!-- KATEGORIJA -->

              <div class="product-meta">
                <q-icon
                  name="category"
                  size="15px"
                />

                <span>
                  {{ product.kategorija_naziv || "Bez kategorije" }}
                </span>
              </div>


              <!-- PROIZVOĐAČ -->

              <div
                v-if="product.proizvodac_naziv"
                class="product-meta"
              >
                <q-icon
                  name="business"
                  size="15px"
                />

                <span>
                  {{ product.proizvodac_naziv }}
                </span>
              </div>


              <q-separator class="q-my-md" />


              <!-- CIJENA -->

              <div class="price-row">

                <div class="product-price">
                  {{ formatPrice(product.cijena) }} €
                </div>

                <div class="product-unit">
                  /
                  {{ product.jedinica_mjere || "kom" }}
                </div>

              </div>


              <!-- ZALIHA -->

              <div class="stock-row">

                <q-badge
                  :color="
                    Number(product.stanje_zaliha) > 0
                      ? 'positive'
                      : 'negative'
                  "
                  class="stock-badge"
                >

                  <q-icon
                    :name="
                      Number(product.stanje_zaliha) > 0
                        ? 'check_circle'
                        : 'cancel'
                    "
                    size="14px"
                    class="q-mr-xs"
                  />

                  {{
                    Number(product.stanje_zaliha) > 0
                      ? "Na stanju"
                      : "Nema na stanju"
                  }}

                </q-badge>

                <span
                  v-if="Number(product.stanje_zaliha) > 0"
                  class="stock-number"
                >
                  {{ product.stanje_zaliha }} kom
                </span>

              </div>

            </q-card-section>


            <!-- KOŠARICA -->

            <q-card-actions class="product-actions">

              <q-btn
                color="primary"
                icon="shopping_cart"
                label="Dodaj u košaricu"
                size="md"
                no-caps
                unelevated
                class="full-width add-cart-button"
                :disabled="
                  Number(product.stanje_zaliha) <= 0
                "
                @click="addToCart(product)"
              />

            </q-card-actions>

          </q-card>

        </div>

      </div>


      <!-- ===================================================== -->
      <!-- PAGINACIJA -->
      <!-- ===================================================== -->

      <div
        v-if="totalPages > 1"
        class="pagination-container"
      >

        <q-pagination
          v-model="page"
          :max="totalPages"
          direction-links
          boundary-links
          :max-pages="5"
          color="primary"
          active-color="primary"
          @update:model-value="changePage"
        />

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- NEMA PROIZVODA -->
    <!-- ===================================================== -->

    <div
      v-else
      class="empty-state"
    >

      <div class="empty-icon">
        <q-icon
          name="search_off"
          size="64px"
        />
      </div>

      <div class="empty-title">
        Nema proizvoda
      </div>

      <div class="empty-text">
        Pokušajte promijeniti filtere pretraživanja.
      </div>

      <q-btn
        outline
        color="primary"
        label="Očisti filtere"
        icon="filter_alt_off"
        no-caps
        class="q-mt-lg"
        @click="resetFilters"
      />

    </div>

  </q-page>
</template>


<script>
import { api } from "boot/axios";

export default {
  name: "ProizvodiPage",

  data() {
    return {
      products: [],
      categories: [],

      loading: false,
      categoriesLoading: false,

      page: 1,
      totalPages: 1,

      filterCategory: null,
      filterSort: null,
      filterSearch: "",

      searchTimer: null,

      sortOptions: [
        {
          label: "Po nazivu (A-Z)",
          value: "naziv_asc",
        },
        {
          label: "Po nazivu (Z-A)",
          value: "naziv_desc",
        },
        {
          label: "Cijena (niža prvo)",
          value: "cijena_asc",
        },
        {
          label: "Cijena (viša prvo)",
          value: "cijena_desc",
        },
        {
          label: "Najnoviji",
          value: "datum_desc",
        },
      ],
    };
  },


  mounted() {
    this.loadCategories();
    this.loadProducts();
  },


  beforeUnmount() {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },


  watch: {

    filterCategory() {
      this.page = 1;
      this.loadProducts();
    },


    filterSort() {
      this.page = 1;
      this.loadProducts();
    },


    filterSearch() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      this.page = 1;

      this.searchTimer = setTimeout(() => {
        this.loadProducts();
      }, 400);
    },

  },


  methods: {

    // =====================================================
    // KATEGORIJE
    // =====================================================

    async loadCategories() {
      this.categoriesLoading = true;

      try {
        const response = await api.get("/kategorije");

        let data = [];

        if (Array.isArray(response.data)) {
          data = response.data;

        } else if (
          Array.isArray(response.data?.data)
        ) {
          data = response.data.data;

        } else if (
          Array.isArray(response.data?.kategorije)
        ) {
          data = response.data.kategorije;
        }

        this.categories = data.filter(
          category =>
            Number(category.aktivan ?? 1) === 1
        );

      } catch (error) {

        console.error(
          "Greška pri učitavanju kategorija:",
          error
        );

        this.categories = [];

        this.$q.notify({
          type: "negative",
          message: "Kategorije nije moguće učitati.",
          position: "top-right",
        });

      } finally {
        this.categoriesLoading = false;
      }
    },


    // =====================================================
    // PROIZVODI
    // =====================================================

    async loadProducts() {
      this.loading = true;

      try {

        const params = {
          page: this.page,
          limit: 12,
        };


        if (
          this.filterCategory !== null &&
          this.filterCategory !== undefined &&
          this.filterCategory !== ""
        ) {
          params.kategorija =
            this.filterCategory;
        }


        if (this.filterSort) {
          params.sort =
            this.filterSort;
        }


        const search =
          String(
            this.filterSearch || ""
          ).trim();


        if (search.length > 0) {
          params.pretraga =
            search;
        }


        const response =
          await api.get(
            "/proizvodi",
            {
              params,
            }
          );


        let data = [];
        let meta = {};


        if (
          Array.isArray(response.data)
        ) {

          data = response.data;

        } else {

          data =
            response.data?.data || [];

          meta =
            response.data?.meta || {};
        }


        this.products = data;


        this.totalPages =
          Number(
            meta.last_page ||
            meta.lastPage ||
            meta.total_pages ||
            1
          );


        if (
          !this.totalPages ||
          this.totalPages < 1
        ) {
          this.totalPages = 1;
        }


        if (
          this.page > this.totalPages
        ) {
          this.page =
            this.totalPages;
        }

      } catch (error) {

        console.error(
          "Greška pri učitavanju proizvoda:",
          error
        );

        this.products = [];
        this.totalPages = 1;

        this.$q.notify({
          type: "negative",
          message:
            "Proizvode nije moguće učitati.",
          position: "top-right",
        });

      } finally {
        this.loading = false;
      }
    },


    // =====================================================
    // PRETRAGA
    // =====================================================

    searchProducts() {

      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      this.page = 1;
      this.loadProducts();
    },


    // =====================================================
    // PAGINACIJA
    // =====================================================

    changePage(newPage) {

      this.page =
        Number(newPage);

      this.loadProducts();
    },


    // =====================================================
    // RESET
    // =====================================================

    resetFilters() {

      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      this.filterCategory = null;
      this.filterSort = null;
      this.filterSearch = "";

      this.page = 1;

      this.loadProducts();
    },


    // =====================================================
    // OTVORI PROIZVOD
    // =====================================================

    goToProduct(id) {

      this.$router.push(
        `/proizvod/${id}`
      );
    },


    // =====================================================
    // CIJENA
    // =====================================================

    formatPrice(price) {

      const value =
        Number(price);

      if (Number.isNaN(value)) {
        return "0.00";
      }

      return value.toFixed(2);
    },


    // =====================================================
    // KOŠARICA
    // =====================================================

    addToCart(product) {

      const stanje =
        Number(
          product.stanje_zaliha || 0
        );


      if (stanje <= 0) {

        this.$q.notify({
          type: "warning",
          message:
            "Nema dovoljno proizvoda na stanju!",
          position: "top-right",
        });

        return;
      }


      let cart =
        JSON.parse(
          localStorage.getItem(
            "terabuild_cart"
          ) || "[]"
        );


      const productId =
        Number(
          product.id_proizvod
        );


      const existing =
        cart.find(
          item =>
            Number(item.id) ===
            productId
        );


      if (existing) {

        if (
          Number(existing.kolicina) >=
          stanje
        ) {

          this.$q.notify({
            type: "warning",
            message:
              "Nema više tog proizvoda na stanju.",
            position: "top-right",
          });

          return;
        }

        existing.kolicina += 1;

      } else {

        cart.push({
          id: productId,

          naziv:
            product.naziv,

          cijena:
            Number(product.cijena),

          jedinica:
            product.jedinica_mjere ||
            "kom",

          slika_url:
            product.slika_url ||
            null,

          kolicina: 1,
        });
      }


      localStorage.setItem(
        "terabuild_cart",
        JSON.stringify(cart)
      );


      this.updateCartBadge();


      this.$q.notify({
        type: "positive",
        message:
          `"${product.naziv}" dodan u košaricu!`,
        position: "top-right",
        timeout: 2500,

        actions: [
          {
            label: "Pogledaj",
            color: "white",

            handler: () => {
              this.$router.push(
                "/kosarica"
              );
            },
          },
        ],
      });
    },


    // =====================================================
    // BROJ KOŠARICE
    // =====================================================

    updateCartBadge() {

      const cart =
        JSON.parse(
          localStorage.getItem(
            "terabuild_cart"
          ) || "[]"
        );


      const count =
        cart.reduce(
          (sum, item) =>
            sum +
            Number(
              item.kolicina || 0
            ),
          0
        );


      const badge =
        document.getElementById(
          "cartCount"
        );


      if (badge) {

        badge.textContent =
          count;

        badge.style.display =
          count > 0
            ? "inline-block"
            : "none";
      }
    },

  },
};
</script>


<style scoped>

/* ========================================================= */
/* GLAVNA STRANICA */
/* ========================================================= */

.products-page {
  min-height: 100vh;
  background: #17191b;
  color: #f5f5f5;
}


/* ========================================================= */
/* NASLOV */
/* ========================================================= */

.page-header {
  max-width: 1450px;
  margin: 0 auto;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 54px;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(25, 118, 210, 0.14);

  border: 1px solid rgba(25, 118, 210, 0.4);

  border-radius: 14px;

  color: #42a5f5;
}

.page-title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin-top: 5px;

  color: #9da4aa;

  font-size: 15px;
}

.breadcrumbs {
  color: #7f8a92;
}

:deep(.q-breadcrumbs__el) {
  color: #8f9aa2;
}

:deep(.q-breadcrumbs__el--active) {
  color: #42a5f5;
}


/* ========================================================= */
/* FILTERI */
/* ========================================================= */

.filters-card {
  max-width: 1450px;
  margin-left: auto;
  margin-right: auto;

  padding: 24px;

  background: #1d2022;

  border: 1px solid #2c3033;

  border-radius: 18px;

  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.18);
}

.filters-title {
  display: flex;
  align-items: center;

  gap: 9px;

  margin-bottom: 20px;

  font-size: 16px;
  font-weight: 700;

  color: #f1f1f1;
}

.filters-title .q-icon {
  color: #42a5f5;
}

:deep(.q-field__control) {
  border-radius: 10px;
}

.clear-button {
  height: 40px;
}

.active-filters {
  display: flex;
  align-items: center;

  flex-wrap: wrap;

  gap: 8px;
}

.active-label {
  color: #929aa0;
  font-size: 13px;
}


/* ========================================================= */
/* LOADING */
/* ========================================================= */

.loading-container {
  min-height: 400px;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 18px;
}

.loading-text {
  color: #929aa0;
}


/* ========================================================= */
/* NASLOV PROIZVODA */
/* ========================================================= */

.products-header {
  max-width: 1450px;
  margin-left: auto;
  margin-right: auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.products-title {
  font-size: 23px;
  font-weight: 750;
}

.products-subtitle {
  margin-top: 4px;

  color: #8f989f;

  font-size: 14px;
}

.product-count {
  display: flex;
  align-items: center;

  gap: 7px;

  padding: 8px 14px;

  border-radius: 20px;

  background: #202427;

  border: 1px solid #30353a;

  color: #aeb6bd;

  font-size: 13px;
}

.product-count .q-icon {
  color: #42a5f5;
}


/* ========================================================= */
/* KARTICA PROIZVODA */
/* ========================================================= */

.product-card {
  height: 100%;

  display: flex;
  flex-direction: column;

  background: #1d2022;

  border: 1px solid #2b3033;

  border-radius: 16px;

  overflow: hidden;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-6px);

  border-color: rgba(33, 150, 243, 0.65);

  box-shadow:
    0 14px 35px rgba(0, 0, 0, 0.35);
}


/* ========================================================= */
/* SLIKA */
/* ========================================================= */

.product-image-wrapper {
  position: relative;

  background: #ffffff;

  border-bottom: 1px solid #2d3134;
}

.product-image {
  height: 235px;

  width: 100%;

  background: #ffffff;
}

.product-image :deep(img) {
  object-fit: contain !important;

  object-position: center !important;

  padding: 18px;

  transition:
    transform 0.3s ease;
}

.product-card:hover .product-image :deep(img) {
  transform: scale(1.04);
}

.image-badge {
  position: absolute;

  top: 12px;
  right: 12px;

  display: flex;
  align-items: center;

  gap: 5px;

  padding: 5px 9px;

  border-radius: 20px;

  background: rgba(20, 24, 27, 0.88);

  color: #e8edf0;

  font-size: 11px;

  opacity: 0;

  transform: translateY(-5px);

  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.product-card:hover .image-badge {
  opacity: 1;

  transform: translateY(0);
}

.image-error {
  height: 235px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 8px;

  background: #f2f2f2;

  color: #888;

  font-size: 13px;
}


/* ========================================================= */
/* INFORMACIJE */
/* ========================================================= */

.product-info {
  flex: 1;

  padding: 18px 18px 10px;
}

.product-name {
  min-height: 48px;

  font-size: 17px;

  font-weight: 750;

  line-height: 1.35;

  color: #f4f6f7;
}

.product-card:hover .product-name {
  color: #42a5f5;
}

.product-meta {
  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 7px;

  color: #858e95;

  font-size: 12px;
}

.product-meta .q-icon {
  color: #68737b;
}


/* ========================================================= */
/* CIJENA */
/* ========================================================= */

.price-row {
  display: flex;

  align-items: baseline;

  gap: 5px;
}

.product-price {
  color: #42a5f5;

  font-size: 23px;

  font-weight: 800;
}

.product-unit {
  color: #858e95;

  font-size: 13px;
}


/* ========================================================= */
/* ZALIHA */
/* ========================================================= */

.stock-row {
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 8px;

  margin-top: 12px;
}

.stock-badge {
  padding: 5px 8px;

  border-radius: 6px;

  font-size: 11px;

  font-weight: 600;
}

.stock-number {
  color: #7f898f;

  font-size: 12px;
}


/* ========================================================= */
/* GUMB KOŠARICE */
/* ========================================================= */

.product-actions {
  padding: 12px 18px 18px;
}

.add-cart-button {
  height: 42px;

  border-radius: 9px;

  font-weight: 650;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.add-cart-button:hover:not(:disabled) {
  transform: translateY(-1px);

  box-shadow:
    0 7px 18px rgba(25, 118, 210, 0.3);
}


/* ========================================================= */
/* PAGINACIJA */
/* ========================================================= */

.pagination-container {
  display: flex;

  justify-content: center;

  margin-top: 45px;

  padding-bottom: 20px;
}


/* ========================================================= */
/* PRAZNO */
/* ========================================================= */

.empty-state {
  max-width: 600px;

  margin: 80px auto;

  padding: 50px 30px;

  text-align: center;

  background: #1d2022;

  border: 1px solid #2b3033;

  border-radius: 18px;
}

.empty-icon {
  color: #606970;
}

.empty-title {
  margin-top: 15px;

  font-size: 23px;

  font-weight: 700;

  color: #e6e9eb;
}

.empty-text {
  margin-top: 7px;

  color: #858e95;
}


/* ========================================================= */
/* RESPONSIVE */
/* ========================================================= */

@media (max-width: 900px) {

  .page-title {
    font-size: 28px;
  }

  .products-header {
    align-items: flex-start;

    gap: 15px;

    flex-direction: column;
  }

}


@media (max-width: 600px) {

  .products-page {
    padding: 18px !important;
  }

  .title-row {
    align-items: flex-start;
  }

  .title-icon {
    width: 46px;
    height: 46px;
  }

  .page-title {
    font-size: 25px;
  }

  .page-subtitle {
    font-size: 13px;
  }

  .filters-card {
    padding: 18px;
  }

  .product-image {
    height: 220px;
  }

  .product-name {
    min-height: auto;
  }

}

</style>