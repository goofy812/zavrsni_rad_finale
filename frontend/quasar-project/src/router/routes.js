const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),

    children: [
      // ============================================================
      // JAVNE RUTE
      // ============================================================

      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },

      {
        path: "proizvodi",
        component: () => import("pages/ProizvodiPage.vue"),
      },

      {
        path: "proizvod/:id",
        component: () => import("pages/ProizvodDetalji.vue"),
      },

      {
        path: "kosarica",
        component: () => import("pages/KosaricaPage.vue"),
      },

      // ============================================================
      // PLAĆANJE
      // ============================================================

      {
        path: "placanje",
        component: () => import("pages/PlacanjePage.vue"),
        meta: {
          requireLogin: true,
        },
      },

      // ============================================================
      // AUTH RUTE
      // ============================================================

      {
        path: "registracija",
        component: () => import("pages/RegistracijaPage.vue"),
      },

      {
        path: "prijava",
        component: () => import("pages/PrijavaPage.vue"),
      },

      // ============================================================
      // KORISNIČKE RUTE
      // ============================================================

      {
        path: "lista-zelja",
        component: () => import("pages/ListaZeljaPage.vue"),
        meta: {
          requireLogin: true,
        },
      },

      {
        path: "moje-narudzbe",
        component: () => import("pages/MojeNarudzbePage.vue"),
        meta: {
          requireLogin: true,
        },
      },

      {
        path: "moje-narudzbe/:id",
        component: () => import("pages/NarudzbaDetaljiPage.vue"),
        meta: {
          requireLogin: true,
        },
      },

      {
        path: "profil",
        component: () => import("pages/PostavkePage.vue"),
        meta: {
          requireLogin: true,
        },
      },

      // ============================================================
      // ADMIN RUTE
      // ============================================================

      {
        path: "admin/dashboard",
        component: () => import("pages/AdminDashboard.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/proizvodi",
        component: () => import("pages/AdminProizvodiPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/proizvodi/dodaj",
        component: () => import("pages/AdminDodavanjeProizvodaPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/proizvodi/:id",
        component: () => import("pages/AdminDodavanjeProizvodaPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/kategorije",
        component: () => import("pages/AdminKategorijePage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/proizvodaci",
        component: () => import("pages/AdminProizvodaciPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/narudzbe",
        component: () => import("pages/AdminNarudzbePage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/zaliha",
        component: () => import("pages/AdminZalihaPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/statusi",
        component: () => import("pages/AdminStatusiPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/korisnici",
        component: () => import("pages/KorisniciPage.vue"),
        meta: {
          requireAdmin: true,
        },
      },

      {
        path: "admin/korisnici/:id",
        component: () => import("pages/AdminKorisnikDetaljiPage.vue"),
        meta: { 
          requireAdmin: true ,
        }
      },

      {
        path: "admin/korisnici/:id/uredi",
        component: () => import("pages/AdminUrediKorisnikaPage.vue"),
        meta: { 
          requireAdmin: true, 
        }
      },
      
      {
        path: "admin/upravljanje",
        component: () => import("pages/AdminUpravljanjePage.vue"),
        meta: {
          requireAdmin: true,
        },
      },
    ],
  },

  // ============================================================
  // 404 - MORA BITI ZADNJA RUTA
  // ============================================================

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;