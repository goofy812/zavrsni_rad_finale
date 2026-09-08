<template>
  <q-page class="q-pa-lg">

    <!-- NASLOV -->
    <div class="row items-center q-mb-lg">
      <q-btn
        flat
        round
        icon="arrow_back"
        @click="goBack"
        class="q-mr-sm"
      />

      <div>
        <div class="text-h4 text-weight-bold">
          Detalji korisnika
        </div>

        <div class="text-grey-7">
          Pregled podataka korisničkog računa
        </div>
      </div>
    </div>

    <!-- GREŠKA -->
    <q-banner
      v-if="greska"
      class="bg-red-1 text-red q-mb-lg"
      rounded
    >
      {{ greska }}
    </q-banner>

    <!-- UČITAVANJE -->
    <div
      v-if="ucitavanje"
      class="flex flex-center q-pa-xl"
    >
      <q-spinner
        color="primary"
        size="40px"
      />
    </div>

    <!-- PODACI O KORISNIKU -->
    <div v-if="korisnik && !ucitavanje">

      <div class="row q-col-gutter-lg">

        <!-- OSNOVNI PODACI -->
        <div class="col-12 col-md-8">

          <q-card flat bordered>
            <q-card-section>

              <div class="text-h5 text-weight-bold q-mb-lg">
                Osnovni podaci
              </div>

              <div class="row q-col-gutter-lg">

                <!-- KORISNIČKO IME -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Korisničko ime
                  </div>

                  <div class="text-h6 q-mt-xs">
                    {{ korisnik.korisnicko_ime }}
                  </div>
                </div>

                <!-- IME -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Ime
                  </div>

                  <div class="text-h6 q-mt-xs">
                    {{ korisnik.ime || "Nije uneseno" }}
                  </div>
                </div>

                <!-- PREZIME -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Prezime
                  </div>

                  <div class="text-h6 q-mt-xs">
                    {{ korisnik.prezime || "Nije uneseno" }}
                  </div>
                </div>

                <!-- EMAIL -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    E-mail
                  </div>

                  <div class="text-h6 q-mt-xs">
                    {{ korisnik.email }}
                  </div>
                </div>

                <!-- TIP KORISNIKA -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Tip korisnika
                  </div>

                  <div class="q-mt-sm">
                    <q-badge
                      :color="
                        korisnik.tip_korisnika === 'admin'
                          ? 'primary'
                          : 'grey'
                      "
                    >
                      {{
                        korisnik.tip_korisnika === "admin"
                          ? "Administrator"
                          : "Kupac"
                      }}
                    </q-badge>
                  </div>
                </div>

                <!-- RAZINA PRAVA -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Razina prava
                  </div>

                  <div class="text-h6 q-mt-xs">
                    {{ korisnik.razina_prava }}
                  </div>
                </div>

                <!-- PRIVATNI RAČUN -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Privatni račun
                  </div>

                  <div class="q-mt-sm">
                    <q-badge
                      :color="
                        korisnik.privatni_racun
                          ? 'positive'
                          : 'grey'
                      "
                    >
                      {{
                        korisnik.privatni_racun
                          ? "Da"
                          : "Ne"
                      }}
                    </q-badge>
                  </div>
                </div>

                <!-- DATUM KREIRANJA -->
                <div class="col-12 col-sm-6">
                  <div class="text-grey-7">
                    Datum kreiranja računa
                  </div>

                  <div class="text-h6 q-mt-xs">
                    {{ formatDatum(korisnik.datum_kreiranja) }}
                  </div>
                </div>

              </div>

            </q-card-section>
          </q-card>

        </div>

        <!-- STATUS -->
        <div class="col-12 col-md-4">

          <q-card flat bordered>
            <q-card-section>

              <div class="text-h6 text-weight-bold">
                Status računa
              </div>

              <div class="q-mt-lg">

                <q-badge
                  color="positive"
                  class="q-pa-sm"
                >
                  Račun aktivan
                </q-badge>

              </div>

              <div class="text-grey-7 q-mt-md">
                Korisničkim računom trenutno je moguće
                koristiti funkcionalnosti sustava.
              </div>

            </q-card-section>
          </q-card>

        </div>

      </div>

      <!-- ADMINISTRATIVNE AKCIJE -->
      <div class="text-h5 text-weight-bold q-mt-xl q-mb-md">
        Administrativne akcije
      </div>

      <q-card flat bordered>
        <q-card-section>

          <div class="row q-col-gutter-md">

            <!-- UREDI -->
            <div class="col-12 col-sm-4">
              <q-btn
                unelevated
                color="primary"
                icon="edit"
                label="Uredi korisnika"
                class="full-width"
                @click="urediKorisnika"
              />
            </div>

            <!-- ADMIN -->
            <div class="col-12 col-sm-4">
              <q-btn
                unelevated
                :color="
                  korisnik.razina_prava === 1
                    ? 'orange'
                    : 'primary'
                "
                :icon="
                  korisnik.razina_prava === 1
                    ? 'person_remove'
                    : 'admin_panel_settings'
                "
                :label="
                  korisnik.razina_prava === 1
                    ? 'Ukloni administratora'
                    : 'Dodaj administratora'
                "
                class="full-width"
                @click="promijeniAdminStatus"
              />
            </div>

            <!-- OBRIŠI -->
            <div class="col-12 col-sm-4">
              <q-btn
                unelevated
                color="negative"
                icon="delete"
                label="Obriši korisnika"
                class="full-width"
                @click="obrisiKorisnika"
              />
            </div>

          </div>

        </q-card-section>
      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "boot/axios";

const route = useRoute();
const router = useRouter();

const korisnik = ref(null);
const ucitavanje = ref(true);
const greska = ref("");

async function ucitajKorisnika() {
  try {
    ucitavanje.value = true;
    greska.value = "";

    const response = await api.get(
      `/korisnici/${route.params.id}`
    );

    korisnik.value = response.data;

  } catch (error) {
    console.error(
      "Greška pri dohvaćanju korisnika:",
      error
    );

    greska.value =
      "Nije moguće dohvatiti podatke korisnika.";
  } finally {
    ucitavanje.value = false;
  }
}

function formatDatum(datum) {
  if (!datum) {
    return "Nije poznato";
  }

  return new Date(datum).toLocaleDateString("hr-HR");
}

function goBack() {
  router.push("/admin/korisnici");
}

function urediKorisnika() {
  router.push(
    `/admin/korisnici/${korisnik.value.id_korisnik}/uredi`
  );
}

async function promijeniAdminStatus() {
  if (!korisnik.value) {
    return
  }

  try {
    if (korisnik.value.razina_prava === 1) {

      await api.delete(
        `/administratori/${korisnik.value.id_korisnik}`
      )

      korisnik.value.razina_prava = 0
      korisnik.value.tip_korisnika = "kupac"

      alert("Korisniku su uklonjena administratorska prava.")

    } else {

      await api.post(
        `/administratori/${korisnik.value.id_korisnik}`
      )

      korisnik.value.razina_prava = 1
      korisnik.value.tip_korisnika = "admin"

      alert("Korisniku su dodijeljena administratorska prava.")
    }

  } catch (error) {
    console.error(
      "Greška pri promjeni administratorskih prava:",
      error
    )

    alert(
      "Nije moguće promijeniti administratorska prava."
    )
  }
}

async function obrisiKorisnika() {
  if (!korisnik.value) {
    return;
  }

  const potvrda = confirm(
    `Jeste li sigurni da želite obrisati korisnika "${korisnik.value.korisnicko_ime}"?`
  );

  if (!potvrda) {
    return;
  }

  try {

    await api.delete(
      `/korisnici/${korisnik.value.id_korisnik}`
    );

    alert("Korisnik je uspješno obrisan.");

    router.push("/admin/korisnici");

  } catch (error) {
    console.error(
      "Greška pri brisanju korisnika:",
      error
    );

    alert(
      "Nije moguće obrisati korisnika."
    );
  }
}

onMounted(() => {
  ucitajKorisnika();
});
</script>