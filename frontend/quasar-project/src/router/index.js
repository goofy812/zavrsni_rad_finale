import { defineRouter } from "#q-app/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import routes from "./routes";
import { api } from "src/boot/axios";
import { LocalStorage } from "quasar";

// ============================================================
// DOHVAT KORISNIKA
// ============================================================

function getUser() {
  try {
    // Prvo pokušaj Quasar LocalStorage
    let user = LocalStorage.getItem("terabuild_user");

    if (user) {
      if (typeof user === "string") {
        try {
          return JSON.parse(user);
        } catch {
          return null;
        }
      }

      return user;
    }

    // Ako nije pronađen, pokušaj obični localStorage
    const nativeUser = localStorage.getItem("terabuild_user");

    if (!nativeUser) {
      return null;
    }

    try {
      return JSON.parse(nativeUser);
    } catch {
      return null;
    }
  } catch (err) {
    console.error("Greška kod dohvaćanja korisnika:", err);
    return null;
  }
}

// ============================================================
// PROVJERA PRIJAVE
// ============================================================

function getToken() {
  try {
    // Quasar
    const quasarToken = LocalStorage.getItem("terabuild_token");

    if (quasarToken) {
      return quasarToken;
    }

    // obični localStorage
    return localStorage.getItem("terabuild_token");
  } catch {
    return null;
  }
}

function checkLogin() {
  const token = getToken();
  const user = getUser();

  console.log("PROVJERA PRIJAVE:", {
    token: !!token,
    user,
  });

  return !!token && !!user?.id_korisnik;
}

// ============================================================
// PROVJERA ADMINA
// ============================================================

async function checkAdmin() {
  const user = getUser();

  if (!user?.id_korisnik) {
    return false;
  }

  // Ako već imamo podatak u korisniku
  if (
    user.tip_korisnika === "admin" ||
    user.razina_prava === 1
  ) {
    return true;
  }

  try {
    const res = await api.get(
      `/administratori/check/${user.id_korisnik}`
    );

    return res.data?.isAdmin === true;
  } catch (err) {
    console.error("Greška kod provjere admina:", err);
    return false;
  }
}

// ============================================================
// ROUTER
// ============================================================

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({
      left: 0,
      top: 0,
    }),

    routes,

    history: createHistory(
      process.env.VUE_ROUTER_BASE
    ),
  });

  // ============================================================
  // ZAŠTITA RUTA
  // ============================================================

  Router.beforeEach(async (to) => {
    // Stranica zahtijeva prijavu
    if (to.meta.requireLogin) {
      const loggedIn = checkLogin();

      console.log(
        "Ruta:",
        to.path,
        "Prijavljen:",
        loggedIn
      );

      if (!loggedIn) {
        return {
          path: "/prijava",
          query: {
            redirect: to.fullPath,
          },
        };
      }
    }

    // Stranica zahtijeva admina
    if (to.meta.requireAdmin) {
      const admin = await checkAdmin();

      if (!admin) {
        return "/";
      }
    }

    return true;
  });

  return Router;
});