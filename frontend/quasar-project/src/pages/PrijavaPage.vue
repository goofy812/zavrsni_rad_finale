<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90%;" class="q-pa-lg">
      <q-card-section>
        <div class="text-h4 text-center q-mb-md">
          <i class="fas fa-hard-hat q-mr-sm" style="color: #f8c13d;"></i>TeraBuild
        </div>
        <div class="text-h5 text-center">Prijava</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="login">
          <q-input
            v-model="korisnicko_ime"
            label="Korisničko ime ili email"
            outlined
            dense
            class="q-mb-md"
          />

          <q-input
            v-model="lozinka"
            label="Lozinka"
            :type="showPassword ? 'text' : 'password'"
            outlined
            dense
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            color="primary"
            label="Prijavi se"
            class="full-width"
            size="lg"
            :loading="loading"
            no-caps
          />

          <div class="text-center q-mt-md">
            <span class="text-grey">Nemaš račun?</span>
            <router-link to="/registracija" class="text-primary"> Registriraj se</router-link>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import { LocalStorage } from "quasar";

export default {
  name: "PrijavaPage",
  data() {
    return {
      korisnicko_ime: "",
      lozinka: "",
      showPassword: false,
      loading: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        // 🔥 ISPRAVNA PUTANJA: /auth/prijava
        const response = await api.post("/prijava", {
          korisnicko_ime: this.korisnicko_ime,
          lozinka: this.lozinka,
        });

        if (response.data.success) {
          LocalStorage.set("terabuild_token", response.data.token);
          LocalStorage.set("terabuild_user", JSON.stringify(response.data.korisnik));

          this.$q.notify({
            type: "positive",
            message: "Prijava uspješna!",
            position: "top-right",
          });

          this.$router.push("/");
        }
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: error.response?.data?.message || "Greška pri prijavi",
          position: "top-right",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>