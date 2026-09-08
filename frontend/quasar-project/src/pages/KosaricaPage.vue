<template>
  <q-page class="cart-page q-pa-lg">

    <!-- ===================================================== -->
    <!-- NASLOV -->
    <!-- ===================================================== -->

    <div class="page-header q-mb-xl">

      <div class="title-section">

        <div class="title-icon">
          <q-icon
            name="shopping_cart"
            size="30px"
          />
        </div>

        <div>
          <div class="page-title">
            Košarica
          </div>

          <div class="page-subtitle">
            Pregled proizvoda koje ste odabrali
          </div>
        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- PRAZNA KOŠARICA -->
    <!-- ===================================================== -->

    <div
      v-if="cart.length === 0"
      class="empty-cart"
    >

      <div class="empty-cart-icon">
        <q-icon
          name="shopping_cart"
          size="75px"
        />
      </div>

      <div class="empty-cart-title">
        Vaša košarica je prazna
      </div>

      <div class="empty-cart-text">
        Pregledajte ponudu i dodajte proizvode u košaricu.
      </div>

      <q-btn
        color="primary"
        label="Pregledaj proizvode"
        icon="storefront"
        to="/proizvodi"
        class="empty-cart-button"
        no-caps
        unelevated
      />

    </div>


    <!-- ===================================================== -->
    <!-- KOŠARICA -->
    <!-- ===================================================== -->

    <div
      v-else
      class="cart-container"
    >

      <!-- =================================================== -->
      <!-- STAVKE -->
      <!-- =================================================== -->

      <div class="cart-list">

        <div
          v-for="item in cart"
          :key="item.id"
          class="cart-item"
        >

          <!-- SLIKA -->

          <div class="cart-image-wrapper">

            <q-img
              :src="
                item.slika_url ||
                '/images/product-placeholder.jpg'
              "
              class="cart-image"
              fit="contain"
            >

              <template v-slot:error>

                <div class="image-error">

                  <q-icon
                    name="image_not_supported"
                    size="32px"
                    color="grey-5"
                  />

                </div>

              </template>

            </q-img>

          </div>


          <!-- PROIZVOD -->

          <div class="cart-product">

            <div class="product-name">
              {{ item.naziv }}
            </div>

            <div class="product-price">

              {{ Number(item.cijena).toFixed(2) }}
              €

              <span>
                / {{ item.jedinica || "kom" }}
              </span>

            </div>

          </div>


          <!-- KOLIČINA -->

          <div class="quantity-section">

            <div class="quantity-label">
              Količina
            </div>

            <div class="quantity-controls">

              <q-btn
                round
                dense
                flat
                icon="remove"
                size="sm"
                color="grey-5"
                @click="updateQty(item.id, -1)"
              />

              <div class="quantity-value">
                {{ item.kolicina }}
              </div>

              <q-btn
                round
                dense
                flat
                icon="add"
                size="sm"
                color="primary"
                @click="updateQty(item.id, 1)"
              />

            </div>

          </div>


          <!-- UKUPNO -->

          <div class="item-total">

            <div class="item-total-label">
              Ukupno
            </div>

            <div class="item-total-price">

              {{
                (
                  Number(item.cijena) *
                  Number(item.kolicina)
                ).toFixed(2)
              }}

              €

            </div>

          </div>


          <!-- BRISANJE -->

          <div class="remove-section">

            <q-btn
              round
              flat
              color="negative"
              icon="delete_outline"
              @click="removeFromCart(item.id)"
            >

              <q-tooltip>
                Ukloni proizvod
              </q-tooltip>

            </q-btn>

          </div>

        </div>

      </div>


      <!-- =================================================== -->
      <!-- SAŽETAK -->
      <!-- =================================================== -->

      <div class="cart-summary">

        <!-- LIJEVA STRANA -->

        <div class="summary-actions">

          <q-btn
            color="negative"
            icon="delete_sweep"
            label="Isprazni košaricu"
            flat
            no-caps
            class="summary-button"
            @click="clearCart"
          />

          <q-btn
            color="primary"
            icon="arrow_back"
            label="Nastavi kupnju"
            flat
            no-caps
            class="summary-button"
            to="/proizvodi"
          />

        </div>


        <!-- DESNA STRANA -->

        <div class="summary-total">

          <div class="total-heading">
            Sažetak narudžbe
          </div>

          <div class="total-row">

            <span>
              Ukupno:
            </span>

            <strong>
              {{ total.toFixed(2) }} €
            </strong>

          </div>

          <div class="tax-info">
            Cijena uključuje PDV
          </div>


          <q-btn
            color="positive"
            icon="shopping_cart_checkout"
            label="Završi narudžbu"
            size="lg"
            unelevated
            no-caps
            class="checkout-btn"
            @click="checkout"
          />

        </div>

      </div>

    </div>

  </q-page>
</template>


<script>

export default {

  name: "KosaricaPage",


  data() {

    return {

      cart: [],

    };

  },


  computed: {

    // =====================================================
    // UKUPNA CIJENA
    // =====================================================

    total() {

      return this.cart.reduce(

        (sum, item) =>

          sum +

          Number(item.cijena || 0) *

          Number(item.kolicina || 0),

        0

      );

    },

  },


  mounted() {

    this.loadCart();

  },


  methods: {

    // =====================================================
    // UČITAJ KOŠARICU
    // =====================================================

    loadCart() {

      try {

        const savedCart =
          localStorage.getItem(
            "terabuild_cart"
          );

        this.cart = JSON.parse(
          savedCart || "[]"
        );


        if (!Array.isArray(this.cart)) {

          this.cart = [];

        }

      } catch (error) {

        console.error(
          "Greška pri učitavanju košarice:",
          error
        );

        this.cart = [];

      }


      this.updateCartBadge();

    },


    // =====================================================
    // SPREMI KOŠARICU
    // =====================================================

    saveCart() {

      try {

        localStorage.setItem(
          "terabuild_cart",
          JSON.stringify(this.cart)
        );

      } catch (error) {

        console.error(
          "Greška pri spremanju košarice:",
          error
        );

      }


      this.updateCartBadge();

    },


    // =====================================================
    // BADGE
    // =====================================================

    updateCartBadge() {

      const count =
        this.cart.reduce(

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


    // =====================================================
    // PROMJENA KOLIČINE
    // =====================================================

    updateQty(id, change) {

      const item =
        this.cart.find(
          (i) =>
            Number(i.id) ===
            Number(id)
        );


      if (!item) {

        return;

      }


      item.kolicina =
        Number(item.kolicina) +
        Number(change);


      if (item.kolicina <= 0) {

        this.cart =
          this.cart.filter(
            (i) =>
              Number(i.id) !==
              Number(id)
          );

      }


      this.saveCart();

    },


    // =====================================================
    // UKLONI PROIZVOD
    // =====================================================

    removeFromCart(id) {

      const item =
        this.cart.find(
          (i) =>
            Number(i.id) ===
            Number(id)
        );


      this.cart =
        this.cart.filter(
          (i) =>
            Number(i.id) !==
            Number(id)
        );


      this.saveCart();


      this.$q.notify({

        type: "warning",

        message: item
          ? `"${item.naziv}" uklonjen iz košarice.`
          : "Proizvod uklonjen iz košarice.",

        position: "top-right",

      });

    },


    // =====================================================
    // ISPRAZNI
    // =====================================================

    clearCart() {

      this.$q

        .dialog({

          title:
            "Isprazni košaricu",

          message:
            "Jeste li sigurni da želite ukloniti sve proizvode iz košarice?",

          persistent: true,

          ok: {

            label:
              "Isprazni",

            color:
              "negative",

            noCaps:
              true,

          },

          cancel: {

            label:
              "Odustani",

            flat:
              true,

            noCaps:
              true,

          },

        })

        .onOk(() => {

          this.cart = [];

          this.saveCart();


          this.$q.notify({

            type:
              "info",

            message:
              "Košarica je ispražnjena.",

            position:
              "top-right",

          });

        });

    },


    // =====================================================
    // CHECKOUT
    // =====================================================

    checkout() {

      // Provjera košarice

      if (this.cart.length === 0) {

        this.$q.notify({

          type:
            "warning",

          message:
            "Košarica je prazna!",

          position:
            "top-right",

        });

        return;

      }


      // Provjera prijave

      const token =
        localStorage.getItem(
          "terabuild_token"
        );


      if (!token) {

        this.$q.notify({

          type:
            "warning",

          message:
            "Za završetak narudžbe morate se prijaviti.",

          position:
            "top-right",

        });


        this.$router.push(
          "/prijava"
        );

        return;

      }


      // Spremi košaricu za checkout

      try {

        localStorage.setItem(

          "terabuild_checkout",

          JSON.stringify(
            this.cart
          )

        );

      } catch (error) {

        console.error(

          "Greška pri spremanju podataka za checkout:",

          error

        );


        this.$q.notify({

          type:
            "negative",

          message:
            "Podaci košarice nisu mogli biti spremljeni.",

          position:
            "top-right",

        });

        return;

      }


      // Otvori checkout

      this.$router.push(
        "/placanje"
      );

    },

  },

};

</script>


<style scoped>

/* ========================================================= */
/* GLAVNA STRANICA */
/* ========================================================= */

.cart-page {
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
    rgba(25, 118, 210, 0.14);

  border:
    1px solid rgba(25, 118, 210, 0.4);

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
/* PRAZNA KOŠARICA */
/* ========================================================= */

.empty-cart {

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


.empty-cart-icon {

  width: 115px;

  height: 115px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(25, 118, 210, 0.1);

  color: #42a5f5;

}


.empty-cart-title {

  margin-top: 25px;

  font-size: 25px;

  font-weight: 750;

}


.empty-cart-text {

  margin-top: 8px;

  color: #858e95;

  font-size: 15px;

}


.empty-cart-button {

  margin-top: 25px;

  min-width: 200px;

  height: 44px;

  border-radius: 9px;

  font-weight: 650;

}


/* ========================================================= */
/* KOŠARICA */
/* ========================================================= */

.cart-container {

  max-width: 1450px;

  margin: 0 auto;

}


/* ========================================================= */
/* LISTA */
/* ========================================================= */

.cart-list {

  overflow: hidden;

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 16px;

  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.16);

}


/* ========================================================= */
/* STAVKA */
/* ========================================================= */

.cart-item {

  min-height: 145px;

  display: flex;

  align-items: center;

  padding: 20px 24px;

  gap: 20px;

  border-bottom:
    1px solid #2b3033;

  transition:
    background 0.2s ease;

}


.cart-item:last-child {

  border-bottom: none;

}


.cart-item:hover {

  background:
    rgba(255, 255, 255, 0.025);

}


/* ========================================================= */
/* SLIKA */
/* ========================================================= */

.cart-image-wrapper {

  width: 105px;

  min-width: 105px;

  height: 105px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #ffffff;

  border-radius: 12px;

  overflow: hidden;

  border:
    1px solid #303438;

}


.cart-image {

  width: 100%;

  height: 100%;

}


.cart-image :deep(img) {

  object-fit: contain !important;

  padding: 10px;

}


.image-error {

  width: 100%;

  height: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #f1f1f1;

}


/* ========================================================= */
/* PROIZVOD */
/* ========================================================= */

.cart-product {

  flex: 1;

  min-width: 220px;

}


.product-name {

  font-size: 18px;

  font-weight: 700;

  line-height: 1.35;

  color: #f1f3f4;

}


.product-price {

  margin-top: 9px;

  font-size: 15px;

  color: #aab2b8;

}


.product-price span {

  color: #737d84;

}


/* ========================================================= */
/* KOLIČINA */
/* ========================================================= */

.quantity-section {

  width: 160px;

  display: flex;

  flex-direction: column;

  align-items: center;

}


.quantity-label {

  margin-bottom: 8px;

  color: #7f898f;

  font-size: 12px;

}


.quantity-controls {

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 4px 7px;

  background: #24282b;

  border:
    1px solid #353b3f;

  border-radius: 10px;

}


.quantity-value {

  min-width: 32px;

  text-align: center;

  font-size: 17px;

  font-weight: 700;

  color: #f0f2f3;

}


/* ========================================================= */
/* UKUPNO */
/* ========================================================= */

.item-total {

  width: 150px;

  text-align: right;

}


.item-total-label {

  margin-bottom: 5px;

  color: #737d84;

  font-size: 12px;

}


.item-total-price {

  font-size: 21px;

  font-weight: 800;

  color: #42a5f5;

}


/* ========================================================= */
/* BRISANJE */
/* ========================================================= */

.remove-section {

  width: 45px;

  display: flex;

  justify-content: center;

}


/* ========================================================= */
/* SAŽETAK */
/* ========================================================= */

.cart-summary {

  margin-top: 20px;

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 30px;

  padding: 25px;

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 16px;

}


/* ========================================================= */
/* AKCIJE */
/* ========================================================= */

.summary-actions {

  display: flex;

  align-items: center;

  gap: 10px;

}


.summary-button {

  border-radius: 8px;

}


/* ========================================================= */
/* UKUPNO */
/* ========================================================= */

.summary-total {

  min-width: 310px;

  text-align: right;

}


.total-heading {

  margin-bottom: 10px;

  color: #8c969d;

  font-size: 13px;

  text-transform: uppercase;

  letter-spacing: 0.5px;

}


.total-row {

  display: flex;

  align-items: baseline;

  justify-content: flex-end;

  gap: 12px;

  font-size: 20px;

}


.total-row strong {

  color: #42a5f5;

  font-size: 30px;

  font-weight: 800;

}


.tax-info {

  margin-top: 4px;

  margin-bottom: 18px;

  color: #707a81;

  font-size: 12px;

}


/* ========================================================= */
/* CHECKOUT */
/* ========================================================= */

.checkout-btn {

  min-width: 230px;

  height: 48px;

  border-radius: 9px;

  font-weight: 700;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

}


.checkout-btn:hover {

  transform: translateY(-2px);

  box-shadow:
    0 8px 20px rgba(33, 186, 69, 0.25);

}


/* ========================================================= */
/* TABLET */
/* ========================================================= */

@media (max-width: 900px) {

  .cart-item {

    flex-wrap: wrap;

  }


  .cart-product {

    flex: 1;

    min-width:
      calc(100% - 145px);

  }


  .quantity-section {

    width: auto;

    margin-left: 125px;

    align-items: flex-start;

  }


  .item-total {

    width: auto;

    margin-left: auto;

  }


  .cart-summary {

    flex-direction: column;

  }


  .summary-actions {

    width: 100%;

  }


  .summary-total {

    width: 100%;

    text-align: left;

  }


  .total-row {

    justify-content: flex-start;

  }

}


/* ========================================================= */
/* MOBITEL */
/* ========================================================= */

@media (max-width: 600px) {

  .cart-page {

    padding: 16px !important;

  }


  .page-title {

    font-size: 27px;

  }


  .title-icon {

    width: 48px;

    height: 48px;

  }


  .cart-item {

    display: grid;

    grid-template-columns: 75px 1fr;

    gap: 14px;

    padding: 16px;

  }


  .cart-image-wrapper {

    width: 75px;

    min-width: 75px;

    height: 75px;

  }


  .cart-product {

    min-width: 0;

  }


  .product-name {

    font-size: 16px;

  }


  .quantity-section {

    width: auto;

    margin-left: 0;

    align-items: flex-start;

  }


  .item-total {

    width: auto;

    margin-left: 0;

    text-align: left;

  }


  .remove-section {

    justify-content: flex-end;

  }


  .cart-summary {

    padding: 20px;

  }


  .summary-actions {

    flex-direction: column;

    align-items: stretch;

  }


  .summary-button {

    width: 100%;

  }


  .summary-total {

    min-width: 0;

  }


  .total-row {

    justify-content: space-between;

    font-size: 18px;

  }


  .total-row strong {

    font-size: 25px;

  }


  .checkout-btn {

    width: 100%;

  }

}

</style>