<template>
  <q-page class="account-page q-pa-lg">

    <!-- ===================================================== -->
    <!-- NASLOV -->
    <!-- ===================================================== -->

    <div class="page-header q-mb-xl">

      <div class="title-section">

        <div class="title-icon">
          <q-icon
            name="manage_accounts"
            size="30px"
          />
        </div>

        <div>
          <div class="page-title">
            Postavke računa
          </div>

          <div class="page-subtitle">
            Upravljajte svojim osobnim podacima i postavkama računa
          </div>
        </div>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- GLAVNI SADRŽAJ -->
    <!-- ===================================================== -->

    <div class="settings-wrapper">

      <q-card
        class="settings-card"
        flat
        bordered
      >

        <!-- ================================================= -->
        <!-- HEADER KARTICE -->
        <!-- ================================================= -->

        <q-card-section class="card-header">

          <div class="card-header-icon">
            <q-icon
              name="person"
              size="24px"
            />
          </div>

          <div>

            <div class="card-title">
              Osobni podaci
            </div>

            <div class="card-subtitle">
              Ažurirajte podatke povezane s vašim računom
            </div>

          </div>

        </q-card-section>


        <q-separator />


        <!-- ================================================= -->
        <!-- FORMA -->
        <!-- ================================================= -->

        <q-form
          @submit.prevent="spremiPromjene"
        >

          <q-card-section class="form-section">

            <!-- IME + PREZIME -->

            <div class="form-row">

              <q-input
                v-model="register.ime"
                label="Ime"
                filled
                class="form-field"
              >
                <template v-slot:prepend>
                  <q-icon name="person_outline" />
                </template>
              </q-input>


              <q-input
                v-model="register.prezime"
                label="Prezime"
                filled
                class="form-field"
              >
                <template v-slot:prepend>
                  <q-icon name="person_outline" />
                </template>
              </q-input>

            </div>


            <!-- KORISNIČKO IME -->

            <q-input
              v-model="register.korisnicko_ime"
              label="Korisničko ime"
              filled
              class="form-field q-mt-md"
              :rules="[
                (val) =>
                  !!val ||
                  'Korisničko ime je obavezno'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="alternate_email" />
              </template>
            </q-input>


            <!-- EMAIL -->

            <q-input
              v-model="register.email"
              label="Email"
              type="email"
              filled
              class="form-field q-mt-md"
              :rules="[
                (val) =>
                  !!val ||
                  'Email je obavezan'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>


            <!-- PRIVATNI RAČUN -->

            <div class="privacy-box q-mt-lg">

              <div class="privacy-icon">

                <q-icon
                  name="lock"
                  size="22px"
                />

              </div>

              <div class="privacy-content">

                <div class="privacy-title">
                  Privatni račun
                </div>

                <div class="privacy-description">
                  Postavite račun kao privatni
                  i ograničite vidljivost svojih podataka.
                </div>

              </div>

              <q-checkbox
                v-model="register.privatni_racun"
                color="primary"
              />

            </div>

          </q-card-section>


          <!-- ================================================= -->
          <!-- LOZINKA -->
          <!-- ================================================= -->

          <q-separator />

          <q-card-section class="form-section">

            <div class="section-title">

              <div class="section-icon password-icon">

                <q-icon
                  name="lock"
                  size="21px"
                />

              </div>

              <div>

                <div class="section-heading">
                  Promjena lozinke
                </div>

                <div class="section-description">
                  Ostavite prazno ako ne želite mijenjati lozinku.
                </div>

              </div>

            </div>


            <q-input
              v-model="register.novalozinka"
              label="Nova lozinka"
              type="password"
              filled
              class="form-field q-mt-lg"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" />
              </template>
            </q-input>


            <q-input
              v-model="register.potvrdalozinka"
              label="Potvrda nove lozinke"
              type="password"
              filled
              class="form-field q-mt-md"
              :rules="[
                (val) =>
                  !register.novalozinka ||
                  val === register.novalozinka ||
                  'Lozinke se ne podudaraju'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock_reset" />
              </template>
            </q-input>

          </q-card-section>


          <!-- ================================================= -->
          <!-- AKCIJE -->
          <!-- ================================================= -->

          <q-separator />

          <q-card-actions class="form-actions">

            <q-btn
              type="button"
              label="Obriši račun"
              color="negative"
              outline
              icon="delete_outline"
              no-caps
              class="delete-btn"
              @click="confirmDelete"
              :disable="spremanje"
            />


            <q-space />


            <q-btn
              type="submit"
              label="Spremi promjene"
              color="primary"
              icon="save"
              unelevated
              no-caps
              class="save-btn"
              :loading="spremanje"
            />

          </q-card-actions>

        </q-form>

      </q-card>


      <!-- ================================================= -->
      <!-- INFORMACIJA -->
      <!-- ================================================= -->

      <div class="security-note">

        <q-icon
          name="info"
          size="18px"
        />

        <span>
          Promjene podataka automatski se spremaju na vaš korisnički račun.
        </span>

      </div>

    </div>

  </q-page>
</template>


<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  useRouter
} from "vue-router";

import {
  useQuasar,
  LocalStorage
} from "quasar";

import {
  api
} from "src/boot/axios";


const router =
  useRouter();

const $q =
  useQuasar();


const spremanje =
  ref(false);


// ============================================================
// DOHVAT TRENUTNOG KORISNIKA
// ============================================================

function getUser() {

  try {

    let user =
      LocalStorage.getItem(
        "terabuild_user"
      );


    console.log(
      "Postavke - LocalStorage korisnik:",
      user
    );


    if (!user) {

      return null;

    }


    if (
      typeof user ===
      "object"
    ) {

      return user;

    }


    if (
      typeof user ===
      "string"
    ) {

      try {

        return JSON.parse(
          user
        );

      } catch {

        console.error(
          "Korisnik nije ispravan JSON:",
          user
        );

        return null;

      }

    }


    return null;

  } catch (err) {

    console.error(
      "Greška kod čitanja korisnika:",
      err
    );

    return null;

  }

}


// ============================================================
// ID KORISNIKA
// ============================================================

function getIdKorisnika() {

  const user =
    getUser();


  console.log(
    "Postavke - trenutni korisnik:",
    user
  );


  console.log(
    "Postavke - ID korisnika:",
    user?.id_korisnik
  );


  return (
    user?.id_korisnik ||
    null
  );

}


// ============================================================
// PODACI FORMULARA
// ============================================================

const register =
  ref({

    ime: "",

    prezime: "",

    korisnicko_ime: "",

    email: "",

    privatni_racun: false,

    novalozinka: "",

    potvrdalozinka: "",

  });


// ============================================================
// UČITAVANJE PODATAKA
// ============================================================

onMounted(
  async () => {

    const idKorisnika =
      getIdKorisnika();


    console.log(
      "Postavke - ID koji šaljem backendu:",
      idKorisnika
    );


    if (!idKorisnika) {

      $q.notify({

        type: "negative",

        message:
          "Korisnik nije prijavljen.",

      });


      router.push(
        "/prijava"
      );


      return;

    }


    try {

      const res =
        await api.get(
          `/korisnici/${idKorisnika}`
        );


      console.log(
        "Postavke - odgovor backend:",
        res.data
      );


      const korisnik = res.data;


      register.value.ime =
        korisnik.ime || "";


      register.value.prezime =
        korisnik.prezime || "";


      register.value.korisnicko_ime =
        korisnik.korisnicko_ime || "";


      register.value.email =
        korisnik.email || "";


      register.value.privatni_racun =
        !!korisnik.privatni_racun;


    } catch (err) {

      console.error(
        "Greška pri učitavanju korisnika:",
        err
      );


      console.error(
        "Server odgovor:",
        err.response?.data
      );


      $q.notify({

        type: "negative",

        message:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Nije moguće učitati podatke korisnika.",

      });

    }

  }
);


// ============================================================
// SPREMANJE PROMJENA
// ============================================================

async function spremiPromjene() {

  const idKorisnika =
    getIdKorisnika();


  if (!idKorisnika) {

    $q.notify({

      type: "negative",

      message:
        "Korisnik nije pronađen.",

    });


    return;

  }


  // Provjera nove lozinke

  if (

    register.value.novalozinka &&

    register.value.novalozinka !==
      register.value.potvrdalozinka

  ) {

    $q.notify({

      type: "negative",

      message:
        "Lozinke se ne podudaraju.",

    });


    return;

  }


  spremanje.value = true;


  try {

    const payload = {

      ime:
        register.value.ime,

      prezime:
        register.value.prezime,

      korisnicko_ime:
        register.value.korisnicko_ime,

      email:
        register.value.email,

      privatni_racun:
        register.value.privatni_racun,

    };


    // Nova lozinka samo ako je unesena

    if (

      register.value.novalozinka &&

      register.value.novalozinka.trim() !== ""

    ) {

      payload.lozinka =
        register.value.novalozinka;

    }


    console.log(
      "Šaljem PUT korisniku:",
      idKorisnika,
      payload
    );


    const res =
      await api.put(
        `/korisnici/${idKorisnika}`,
        payload
      );


    console.log(
      "Backend odgovor:",
      res.data
    );


    if (
      res.data?.success === false
    ) {

      throw new Error(
        res.data.message ||
        "Greška pri spremanju."
      );

    }


    // ========================================================
    // AŽURIRAJ LOCAL STORAGE
    // ========================================================

    const trenutniUser =
      getUser();


    if (trenutniUser) {

      const azuriraniUser = {

        ...trenutniUser,

        id_korisnik:
          trenutniUser.id_korisnik,

        ime:
          register.value.ime,

        prezime:
          register.value.prezime,

        korisnicko_ime:
          register.value.korisnicko_ime,

        email:
          register.value.email,

        privatni_racun:
          register.value.privatni_racun,

      };


      LocalStorage.set(
        "terabuild_user",
        azuriraniUser
      );


      console.log(
        "Ažuriran korisnik u LocalStorage:",
        azuriraniUser
      );

    }


    // Očisti lozinku

    register.value.novalozinka =
      "";

    register.value.potvrdalozinka =
      "";


    $q.notify({

      type: "positive",

      message:
        "Promjene su uspješno spremljene.",

    });


  } catch (err) {

    console.error(
      "Greška pri spremanju korisnika:",
      err
    );


    console.error(
      "Server odgovor:",
      err.response?.data
    );


    $q.notify({

      type: "negative",

      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Greška pri spremanju promjena.",

    });

  } finally {

    spremanje.value =
      false;

  }

}


// ============================================================
// POTVRDA BRISANJA RAČUNA
// ============================================================

function confirmDelete() {

  $q.dialog({

    title:
      "Upozorenje!",

    message:
      "Jeste li sigurni da želite obrisati račun? Ova radnja se ne može poništiti.",

    ok: {

      label:
        "Da, obriši",

      color:
        "negative",

    },

    cancel: {

      label:
        "Ne",

      flat:
        true,

    },

    persistent:
      true,

  }).onOk(
    deleteAccount
  );

}


// ============================================================
// BRISANJE RAČUNA
// ============================================================

async function deleteAccount() {

  const idKorisnika =
    getIdKorisnika();


  if (!idKorisnika) {

    $q.notify({

      type: "negative",

      message:
        "Korisnik nije pronađen.",

    });


    return;

  }


  try {

    await api.delete(
      `/korisnici/${idKorisnika}`
    );


    // Obriši prijavu

    LocalStorage.remove(
      "terabuild_token"
    );


    LocalStorage.remove(
      "terabuild_user"
    );


    LocalStorage.remove(
      "terabuild_cart"
    );


    $q.notify({

      type: "positive",

      message:
        "Račun je uspješno obrisan.",

    });


    router.push(
      "/"
    );


  } catch (err) {

    console.error(
      "Greška pri brisanju računa:",
      err
    );


    console.error(
      "Server odgovor:",
      err.response?.data
    );


    $q.notify({

      type: "negative",

      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Greška pri brisanju računa.",

    });

  }

}

</script>


<style scoped>

/* ========================================================= */
/* GLAVNA STRANICA */
/* ========================================================= */

.account-page {

  min-height: 100vh;

  background: #17191b;

  color: #f5f5f5;

}


/* ========================================================= */
/* HEADER */
/* ========================================================= */

.page-header {

  max-width: 1100px;

  margin: 0 auto;

  padding-bottom: 20px;

  border-bottom:
    1px solid #2b3033;

  display: flex;

  align-items: center;

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
/* WRAPPER */
/* ========================================================= */

.settings-wrapper {

  max-width: 1100px;

  margin: 0 auto;

}


/* ========================================================= */
/* GLAVNA KARTICA */
/* ========================================================= */

.settings-card {

  background: #1d2022;

  border:
    1px solid #2b3033;

  border-radius: 16px;

  overflow: hidden;

  box-shadow:
    0 12px 35px rgba(0, 0, 0, 0.2);

}


/* ========================================================= */
/* HEADER KARTICE */
/* ========================================================= */

.card-header {

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 22px 25px;

}


.card-header-icon {

  width: 45px;

  height: 45px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 11px;

  background:
    rgba(25, 118, 210, 0.1);

  color: #42a5f5;

}


.card-title {

  font-size: 19px;

  font-weight: 750;

}


.card-subtitle {

  margin-top: 3px;

  color: #7f898f;

  font-size: 12px;

}


/* ========================================================= */
/* FORMA */
/* ========================================================= */

.form-section {

  padding: 28px 25px;

}


.form-row {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 16px;

}


.form-field {

  width: 100%;

}


/* ========================================================= */
/* PRIVATNI RAČUN */
/* ========================================================= */

.privacy-box {

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 15px 17px;

  border-radius: 11px;

  background: #202426;

  border:
    1px solid #30363a;

}


.privacy-icon {

  width: 40px;

  height: 40px;

  min-width: 40px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 9px;

  background:
    rgba(25, 118, 210, 0.1);

  color: #42a5f5;

}


.privacy-content {

  flex: 1;

}


.privacy-title {

  font-size: 14px;

  font-weight: 700;

}


.privacy-description {

  margin-top: 3px;

  color: #7d878d;

  font-size: 11px;

  line-height: 1.45;

}


/* ========================================================= */
/* SEKCIJA LOZINKE */
/* ========================================================= */

.section-title {

  display: flex;

  align-items: center;

  gap: 12px;

}


.section-icon {

  width: 42px;

  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

}


.password-icon {

  background:
    rgba(255, 193, 7, 0.1);

  color: #ffc107;

}


.section-heading {

  font-size: 16px;

  font-weight: 700;

}


.section-description {

  margin-top: 3px;

  color: #7d878d;

  font-size: 12px;

}


/* ========================================================= */
/* AKCIJE */
/* ========================================================= */

.form-actions {

  padding: 20px 25px;

  background: #1a1d1f;

}


.save-btn {

  min-width: 165px;

  height: 42px;

  border-radius: 8px;

  font-weight: 650;

}


.delete-btn {

  height: 42px;

  border-radius: 8px;

  font-weight: 600;

}


/* ========================================================= */
/* SIGURNOSNA NAPOMENA */
/* ========================================================= */

.security-note {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  margin-top: 16px;

  color: #69747a;

  font-size: 11px;

  text-align: center;

}


/* ========================================================= */
/* MOBITEL */
/* ========================================================= */

@media (max-width: 650px) {

  .account-page {

    padding: 16px !important;

  }


  .page-header {

    margin-bottom: 20px;

  }


  .page-title {

    font-size: 27px;

  }


  .page-subtitle {

    font-size: 12px;

  }


  .title-icon {

    width: 48px;

    height: 48px;

  }


  .settings-card {

    border-radius: 13px;

  }


  .card-header {

    padding: 19px;

  }


  .form-section {

    padding: 22px 19px;

  }


  .form-row {

    grid-template-columns: 1fr;

    gap: 0;

  }


  .privacy-box {

    align-items: flex-start;

  }


  .privacy-box .q-checkbox {

    margin-top: -4px;

  }


  .form-actions {

    padding: 18px 19px;

    display: flex;

    flex-direction: column-reverse;

    gap: 10px;

  }


  .form-actions .q-space {

    display: none;

  }


  .save-btn,

  .delete-btn {

    width: 100%;

  }


  .security-note {

    align-items: flex-start;

    padding: 0 10px;

  }

}

</style>