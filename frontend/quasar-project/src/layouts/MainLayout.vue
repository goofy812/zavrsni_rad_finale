<template>
  <q-layout view="hHh LpR fFf">

    <!-- ============================================================ -->
    <!-- HEADER -->
    <!-- ============================================================ -->

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <!-- LOGO + NAZIV -->
        <q-toolbar-title>
          <router-link
            to="/"
            class="text-white text-decoration-none row items-center no-wrap"
          >
            <img
              src="/icons/logo_TeraBuild.png"
              alt="TeraBuild logo"
              class="terabuild-logo"
            />

            <span class="terabuild-name">
              TeraBuild
            </span>
          </router-link>
        </q-toolbar-title>

        <!-- Košarica -->
        <q-btn
          flat
          round
          icon="shopping_cart"
          to="/kosarica"
          class="q-ml-sm"
        >
          <q-badge
            color="red"
            floating
            v-if="cartCount > 0"
          >
            {{ cartCount }}
          </q-badge>
        </q-btn>

        <!-- Korisnički izbornik -->
        <q-btn
          flat
          round
          :icon="isLoggedIn ? 'account_circle' : 'login'"
          @click="isLoggedIn ? logout() : $router.push('/prijava')"
        />

      </q-toolbar>
    </q-header>


    <!-- ============================================================ -->
    <!-- DRAWER -->
    <!-- ============================================================ -->

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >

      <q-list>

        <q-item-label
          header
          class="text-primary"
        >
          Navigacija
        </q-item-label>


        <!-- Početna -->
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            Početna
          </q-item-section>
        </q-item>


        <!-- Proizvodi -->
        <q-item clickable to="/proizvodi">
          <q-item-section avatar>
            <q-icon name="inventory_2" />
          </q-item-section>

          <q-item-section>
            Proizvodi
          </q-item-section>
        </q-item>


        <!-- Košarica -->
        <q-item clickable to="/kosarica">

          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>

          <q-item-section>
            Košarica
          </q-item-section>

          <q-item-section side>
            <q-badge
              color="red"
              v-if="cartCount > 0"
            >
              {{ cartCount }}
            </q-badge>
          </q-item-section>

        </q-item>


        <!-- ======================================================== -->
        <!-- SAMO ZA PRIJAVLJENE -->
        <!-- ======================================================== -->

        <template v-if="isLoggedIn">

          <!-- Lista želja -->
          <q-item clickable to="/lista-zelja">

            <q-item-section avatar>
              <q-icon name="favorite" />
            </q-item-section>

            <q-item-section>
              Lista želja
            </q-item-section>

          </q-item>


          <!-- Moje narudžbe -->
          <q-item clickable to="/moje-narudzbe">

            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>

            <q-item-section>
              Moje narudžbe
            </q-item-section>

          </q-item>


          <!-- Profil -->
          <q-item clickable to="/profil">

            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>

            <q-item-section>
              Profil
            </q-item-section>

          </q-item>


          <q-separator />


          <!-- ====================================================== -->
          <!-- ADMIN PANEL -->
          <!-- ====================================================== -->

          <template v-if="isAdmin">

            <q-item-label
              header
              class="text-warning"
            >
              Admin panel
            </q-item-label>


            <!-- Dashboard -->
            <q-item clickable to="/admin/dashboard">

              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section>
                Dashboard
              </q-item-section>

            </q-item>


            <!-- Proizvodi -->
            <q-item clickable to="/admin/proizvodi">

              <q-item-section avatar>
                <q-icon name="inventory" />
              </q-item-section>

              <q-item-section>
                Proizvodi
              </q-item-section>

            </q-item>


            <!-- Kategorije -->
            <q-item clickable to="/admin/kategorije">

              <q-item-section avatar>
                <q-icon name="category" />
              </q-item-section>

              <q-item-section>
                Kategorije
              </q-item-section>

            </q-item>


            <!-- Proizvođači -->
            <q-item clickable to="/admin/proizvodaci">

              <q-item-section avatar>
                <q-icon name="business" />
              </q-item-section>

              <q-item-section>
                Proizvođači
              </q-item-section>

            </q-item>


            <!-- Narudžbe -->
            <q-item clickable to="/admin/narudzbe">

              <q-item-section avatar>
                <q-icon name="list_alt" />
              </q-item-section>

              <q-item-section>
                Narudžbe
              </q-item-section>

            </q-item>


            <!-- Zaliha -->
            <q-item clickable to="/admin/zaliha">

              <q-item-section avatar>
                <q-icon name="warehouse" />
              </q-item-section>

              <q-item-section>
                Zaliha
              </q-item-section>

            </q-item>


            <!-- Statusi -->
            <q-item clickable to="/admin/statusi">

              <q-item-section avatar>
                <q-icon name="label" />
              </q-item-section>

              <q-item-section>
                Statusi
              </q-item-section>

            </q-item>


            <!-- Korisnici -->
            <q-item clickable to="/admin/korisnici">

              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>

              <q-item-section>
                Korisnici
              </q-item-section>

            </q-item>


            <!-- Upravljanje -->
            <q-item clickable to="/admin/upravljanje">

              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>

              <q-item-section>
                Upravljanje
              </q-item-section>

            </q-item>


            <q-separator />

          </template>


          <!-- Odjava -->
          <q-item
            clickable
            @click="logout"
          >

            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              Odjava
            </q-item-section>

          </q-item>

        </template>


        <!-- ======================================================== -->
        <!-- NEPRIJAVLJENI -->
        <!-- ======================================================== -->

        <template v-else>

          <!-- Registracija -->
          <q-item clickable to="/registracija">

            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>

            <q-item-section>
              Registracija
            </q-item-section>

          </q-item>


          <!-- Prijava -->
          <q-item clickable to="/prijava">

            <q-item-section avatar>
              <q-icon name="login" />
            </q-item-section>

            <q-item-section>
              Prijava
            </q-item-section>

          </q-item>

        </template>

      </q-list>

    </q-drawer>


    <!-- ============================================================ -->
    <!-- PAGE CONTENT -->
    <!-- ============================================================ -->

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>


<script setup>

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LocalStorage } from "quasar";

const router = useRouter();


// ============================================================ //
// REAKTIVNI PODACI
// ============================================================ //

const leftDrawerOpen = ref(false);

const isLoggedIn = ref(false);

const isAdmin = ref(false);

const cartCount = ref(0);



// ============================================================ //
// KORISNIK
// ============================================================ //

function getUser() {

  const userStr = LocalStorage.getItem("terabuild_user");

  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}


// ============================================================ //
// PROVJERA PRIJAVE
// ============================================================ //

function checkLoginStatus() {

  const token = LocalStorage.getItem("terabuild_token");

  const user = getUser();

  isLoggedIn.value = !!(token && user);

  return isLoggedIn.value;
}


// ============================================================ //
// PROVJERA ADMINA
// ============================================================ //

function checkAdminStatus() {

  const user = getUser();

  isAdmin.value = user?.tip_korisnika === "admin";

  console.log(
    "👑 Admin status:",
    isAdmin.value,
    user
  );

  return isAdmin.value;
}


// ============================================================ //
// STATUS KORISNIKA
// ============================================================ //

function checkUserStatus() {

  checkLoginStatus();

  checkAdminStatus();

  updateCartCount();

}


// ============================================================ //
// KOŠARICA
// ============================================================ //

function updateCartCount() {

  const cart = JSON.parse(
    localStorage.getItem("terabuild_cart") || "[]"
  );

  cartCount.value = cart.reduce(
    (sum, item) => sum + item.kolicina,
    0
  );

}

// ============================================================ //
// ODJAVA
// ============================================================ //

function logout() {

  LocalStorage.remove("terabuild_token");

  LocalStorage.remove("terabuild_user");

  LocalStorage.remove("terabuild_cart");

  isLoggedIn.value = false;

  isAdmin.value = false;

  cartCount.value = 0;

  router.push("/prijava");

}


// ============================================================ //
// DRAWER
// ============================================================ //

function toggleLeftDrawer() {

  leftDrawerOpen.value = !leftDrawerOpen.value;

}


// ============================================================ //
// LIFECYCLE
// ============================================================ //

onMounted(() => {

  checkUserStatus();


  window.addEventListener("storage", (e) => {

    if (e.key === "terabuild_cart") {
      updateCartCount();
    }

    if (e.key === "terabuild_user") {
      checkUserStatus();
    }

  });


  router.afterEach(() => {
    checkUserStatus();
  });

});

</script>


<style scoped>

.text-decoration-none {
  text-decoration: none;
}


/* ============================================================ */
/* TERABUILD LOGO */
/* ============================================================ */

.terabuild-logo {

  width: 38px;

  height: 38px;

  object-fit: contain;

  display: block;

}


/* ============================================================ */
/* NAZIV TERABUILD */
/* ============================================================ */

.terabuild-name {

  font-size: 21px;

  font-weight: 600;

  line-height: 1;

}


/* Hover */
/* ============================================================ */

.text-decoration-none:hover {

  color: #f8c13d !important;

}


.text-decoration-none:hover .terabuild-name {

  color: #f8c13d;

}


/* ============================================================ */
/* PRETRAGA */
/* ============================================================ */

.q-header .q-input {

  max-width: 250px;

}

</style>