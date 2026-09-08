<template>
  <q-page class="flex flex-center">
    <q-card style="width: 450px; max-width: 95%;" class="q-pa-lg">
      <q-card-section>
        <div class="text-h4 text-center q-mb-md">
          <i class="fas fa-hard-hat q-mr-sm" style="color: #f8c13d;"></i>TeraBuild
        </div>
        <div class="text-h5 text-center">Registracija</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="register">
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input v-model="ime" label="Ime" outlined dense class="q-mb-md" />
            </div>
            <div class="col-6">
              <q-input v-model="prezime" label="Prezime" outlined dense class="q-mb-md" />
            </div>
          </div>

          <q-input
            v-model="korisnicko_ime"
            label="Korisničko ime"
            outlined
            dense
            class="q-mb-md"
          />

          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            dense
            class="q-mb-md"
          />

          <q-input
            v-model="lozinka"
            label="Lozinka"
            type="password"
            outlined
            dense
            class="q-mb-md"
          />

          <q-btn
            type="submit"
            color="primary"
            label="Registriraj se"
            class="full-width"
            size="lg"
            :loading="loading"
            no-caps
          />

          <div class="text-center q-mt-md">
            <span class="text-grey">Već imaš račun?</span>
            <router-link to="/prijava" class="text-primary"> Prijavi se</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { api } from "boot/axios";

export default {
  name: "RegistracijaPage",
  data() {
    return {
      ime: "",
      prezime: "",
      korisnicko_ime: "",
      email: "",
      lozinka: "",
      loading: false,
    };
  },
  methods: {
    async register() {
      this.loading = true;
      console.log("📝 Pokušaj registracije:", this.korisnicko_ime);

      try {
        const response = await api.post("/registracija", {
          ime: this.ime,
          prezime: this.prezime,
          korisnicko_ime: this.korisnicko_ime,
          email: this.email,
          lozinka: this.lozinka,
        });

        console.log("✅ Odgovor servera:", response.data);

        if (response.data.success) {
          this.$q.notify({
            type: "positive",
            message: "Registracija uspješna!",
            position: "top-right",
          });
          this.$router.push("/prijava");
        }
      } catch (error) {
        console.error("❌ Greška:", error);
        this.$q.notify({
          type: "negative",
          message: error.response?.data?.message || "Greška pri registraciji",
          position: "top-right",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>