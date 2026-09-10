<template>
  <q-page>

    <!-- ===================================================== -->
    <!-- HERO -->
    <!-- ===================================================== -->

    <section class="hero-section">

      <div class="hero-overlay"></div>

      <div class="hero-content">

        <div class="hero-main">

          <div class="hero-logo-wrapper">
            <q-img
              src="/icons/logo_TeraBuild.png"
              class="hero-logo"
              contain
              alt="TeraBuild logo"
            />
          </div>

          <div class="hero-text">
            <div class="hero-badge">
              <q-icon name="construction" size="20px" />
              <span>Materijali i oprema za gradnju</span>
            </div>

            <h1 class="hero-title">
              Sve za gradnju.
              <span>Na jednom mjestu.</span>
            </h1>

            <p class="hero-description">
              TeraBuild je web trgovina građevinskim materijalima i opremom
              namijenjena svima koji žele jednostavno pronaći, usporediti
              i naručiti proizvode potrebne za svoj projekt.
            </p>

            <div class="hero-buttons">

              <q-btn
                color="primary"
                label="Pregledaj proizvode"
                icon="shopping_cart"
                size="lg"
                unelevated
                no-caps
                to="/proizvodi"
              />

              <q-btn
                outline
                color="white"
                label="Saznaj više"
                icon="info"
                size="lg"
                no-caps
                @click="scrollToSection('about-section')"
              />

            </div>
          </div>

        </div>

      </div>

      <div class="scroll-indicator">
        <q-icon name="keyboard_arrow_down" size="32px" />
        <span>Saznaj više</span>
      </div>

    </section>


    <!-- ===================================================== -->
    <!-- UVOD -->
    <!-- ===================================================== -->

    <section
      id="about-section"
      class="content-section about-section"
    >

      <div class="container">

        <div class="section-heading text-center">

          <div class="section-label">
            <q-icon name="storefront" />
            TeraBuild
          </div>

          <h2>
            Građevinski materijali
            <span>jednostavno dostupni</span>
          </h2>

          <p>
            Na jednom mjestu dostupni su različiti građevinski materijali,
            alati i oprema potrebni za izvođenje građevinskih i završnih radova.
          </p>

        </div>


        <div class="features-grid">

          <q-card
            flat
            bordered
            class="feature-card"
          >
            <q-card-section>

              <div class="feature-icon">
                <q-icon name="inventory_2" />
              </div>

              <div class="text-h6">
                Široka ponuda
              </div>

              <p>
                Pronađite različite proizvode za gradnju,
                obnovu i uređenje prostora.
              </p>

            </q-card-section>
          </q-card>


          <q-card
            flat
            bordered
            class="feature-card"
          >
            <q-card-section>

              <div class="feature-icon">
                <q-icon name="search" />
              </div>

              <div class="text-h6">
                Jednostavna pretraga
              </div>

              <p>
                Brzo pronađite željeni proizvod pomoću kategorija
                i mogućnosti pretraživanja.
              </p>

            </q-card-section>
          </q-card>


          <q-card
            flat
            bordered
            class="feature-card"
          >
            <q-card-section>

              <div class="feature-icon">
                <q-icon name="shopping_cart" />
              </div>

              <div class="text-h6">
                Jednostavna kupnja
              </div>

              <p>
                Dodajte proizvode u košaricu i jednostavno
                završite svoju narudžbu.
              </p>

            </q-card-section>
          </q-card>


          <q-card
            flat
            bordered
            class="feature-card"
          >
            <q-card-section>

              <div class="feature-icon">
                <q-icon name="local_shipping" />
              </div>

              <div class="text-h6">
                Dostava
              </div>

              <p>
                Prilikom narudžbe unesite podatke za dostavu
                i odaberite odgovarajući način plaćanja.
              </p>

            </q-card-section>
          </q-card>

        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- STATISTIKA -->
    <!-- ===================================================== -->

    <section class="statistics-section">

      <div class="container">

        <div class="statistics-grid">

          <div class="stat-item">

            <q-icon name="inventory_2" />

            <div class="stat-number">
              {{ statistics.broj_proizvoda || 0 }}
            </div>

            <div class="stat-label">
              proizvoda
            </div>

          </div>


          <div class="stat-item">

            <q-icon name="groups" />

            <div class="stat-number">
              {{ statistics.broj_korisnika || 0 }}
            </div>

            <div class="stat-label">
              korisnika
            </div>

          </div>


          <div class="stat-item">

            <q-icon name="star" />

            <div class="stat-number">
              {{ statistics.broj_recenzija || 0 }}
            </div>

            <div class="stat-label">
              recenzija
            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- PROIZVOD DANA -->
    <!-- ===================================================== -->

    <section class="content-section">

      <div class="container">

        <div class="section-heading">

          <div class="section-label">
            <q-icon name="workspace_premium" />
            Izdvojeno
          </div>

          <h2>
            Proizvod dana
          </h2>

          <p>
            Svakog dana izdvajamo jedan proizvod iz naše ponude.
          </p>

        </div>


        <q-card
          flat
          bordered
          class="product-day-card"
        >

          <div class="product-day-image">

            <q-img
              v-if="statistics.slika_url"
              :src="statistics.slika_url"
              fit="contain"
            />

            <div
              v-else
              class="product-day-no-image"
            >
              <q-icon
                name="image_not_supported"
                size="50px"
                color="grey-6"
              />
            </div>

          </div>


          <div class="product-day-content">

            <div class="product-day-label">
              <q-icon name="star" />
              Preporuka
            </div>

            <h3>
              {{ statistics.naziv_proizvoda || "Nema podataka" }}
            </h3>

            <p>
              {{ statistics.opis || "Trenutno nema dostupnog opisa proizvoda." }}
            </p>

            <div class="product-day-bottom">

              <div class="product-price">
                {{ statistics.cijena || "" }}
              </div>

              <q-btn
                color="primary"
                icon="add_shopping_cart"
                label="Dodaj u košaricu"
                unelevated
                no-caps
                @click="addToCart(statistics.id_proizvoda)"
              />

            </div>

          </div>

        </q-card>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- KATEGORIJE -->
    <!-- ===================================================== -->

    <section class="content-section categories-section">

      <div class="container">

        <div class="section-heading text-center">

          <div class="section-label">
            <q-icon name="category" />
            Ponuda
          </div>

          <h2>
            Istražite kategorije
          </h2>

          <p>
            Odaberite kategoriju i pronađite proizvode koji su vam potrebni.
          </p>

        </div>


        <div class="categories-grid">

          <q-card
            v-for="cat in categories"
            :key="cat.id"
            flat
            bordered
            class="category-card"
            clickable
            @click="goToCategory(cat.id)"
          >

            <q-card-section class="text-center">

              <div class="category-icon">
                <q-img
                  :src="cat.slika"
                  fit="contain"
                  class="category-image"
                />
              </div>

              <div class="category-name">
                {{ cat.naziv }}
              </div>

              <div class="category-link">
                Pregledaj
                <q-icon name="arrow_forward" />
              </div>

            </q-card-section>

          </q-card>

        </div>


        <div class="text-center q-mt-xl">

          <q-btn
            color="primary"
            label="Pregledaj sve proizvode"
            icon="shopping_bag"
            size="lg"
            unelevated
            no-caps
            to="/proizvodi"
          />

        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- ZAŠTO TERABUILD -->
    <!-- ===================================================== -->

    <section class="content-section why-section">

      <div class="container">

        <div class="why-grid">

          <div>

            <div class="section-label">
              <q-icon name="verified" />
              Zašto TeraBuild?
            </div>

            <h2>
              Jednostavnija kupnja
              građevinskih proizvoda
            </h2>

            <p class="why-description">
              TeraBuild je osmišljen kako bi korisnicima omogućio
              jednostavniji pregled ponude, upravljanje košaricom
              i pregled vlastitih narudžbi.
            </p>


            <div class="why-list">

              <div class="why-item">

                <q-icon
                  name="check_circle"
                  color="positive"
                />

                <div>
                  <strong>Pregledna ponuda</strong>
                  <span>
                    Proizvodi su organizirani prema kategorijama.
                  </span>
                </div>

              </div>


              <div class="why-item">

                <q-icon
                  name="check_circle"
                  color="positive"
                />

                <div>
                  <strong>Košarica i narudžbe</strong>
                  <span>
                    Jednostavno dodavanje proizvoda i završetak kupnje.
                  </span>
                </div>

              </div>


              <div class="why-item">

                <q-icon
                  name="check_circle"
                  color="positive"
                />

                <div>
                  <strong>Lista želja</strong>
                  <span>
                    Proizvodi se mogu spremiti za kasniji pregled.
                  </span>
                </div>

              </div>


              <div class="why-item">

                <q-icon
                  name="check_circle"
                  color="positive"
                />

                <div>
                  <strong>Recenzije proizvoda</strong>
                  <span>
                    Korisnici mogu podijeliti iskustva i ocjene.
                  </span>
                </div>

              </div>

            </div>

          </div>


          <div class="why-image">

            <div class="why-image-card">

              <q-icon
                name="construction"
                size="90px"
              />

              <div class="text-h5 q-mt-md">
                TeraBuild
              </div>

              <div class="text-body2 q-mt-sm">
                Sve za vaš građevinski projekt.
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- KAKO FUNKCIONIRA -->
    <!-- ===================================================== -->

    <section class="content-section steps-section">

      <div class="container">

        <div class="section-heading text-center">

          <div class="section-label">
            <q-icon name="route" />
            Jednostavna kupnja
          </div>

          <h2>
            Kako funkcionira kupnja?
          </h2>

        </div>


        <div class="steps-grid">

          <div class="step-item">

            <div class="step-number">
              1
            </div>

            <q-icon name="search" />

            <h3>
              Pronađite proizvod
            </h3>

            <p>
              Pregledajte proizvode i odaberite ono što vam je potrebno.
            </p>

          </div>


          <div class="step-item">

            <div class="step-number">
              2
            </div>

            <q-icon name="shopping_cart" />

            <h3>
              Dodajte u košaricu
            </h3>

            <p>
              Odaberite količinu i dodajte proizvode u košaricu.
            </p>

          </div>


          <div class="step-item">

            <div class="step-number">
              3
            </div>

            <q-icon name="edit_location_alt" />

            <h3>
              Unesite podatke
            </h3>

            <p>
              Unesite podatke potrebne za dostavu narudžbe.
            </p>

          </div>


          <div class="step-item">

            <div class="step-number">
              4
            </div>

            <q-icon name="check_circle" />

            <h3>
              Potvrdite narudžbu
            </h3>

            <p>
              Provjerite podatke i potvrdite svoju narudžbu.
            </p>

          </div>

        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- FAQ -->
    <!-- ===================================================== -->

    <section class="content-section faq-section">

      <div class="container faq-container">

        <div class="section-heading text-center">

          <div class="section-label">
            <q-icon name="help_outline" />
            Pomoć
          </div>

          <h2>
            Često postavljana pitanja
          </h2>

        </div>


        <div class="faq-list">

          <q-expansion-item
            v-for="(faq, index) in faqs"
            :key="index"
            :label="faq.pitanje"
            expand-icon="add"
            expanded-icon="remove"
            class="faq-item"
          >

            <q-card flat>

              <q-card-section>
                {{ faq.odgovor }}
              </q-card-section>

            </q-card>

          </q-expansion-item>

        </div>

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- CTA -->
    <!-- ===================================================== -->

    <section class="cta-section">

      <div class="cta-content">

        <q-icon
          name="shopping_cart"
          size="55px"
        />

        <h2>
          Spremni za kupnju?
        </h2>

        <p>
          Pregledajte našu ponudu i pronađite proizvode
          za svoj sljedeći projekt.
        </p>

        <q-btn
          color="white"
          text-color="primary"
          label="Pregledaj proizvode"
          icon="shopping_bag"
          size="lg"
          unelevated
          no-caps
          to="/proizvodi"
        />

      </div>

    </section>


    <!-- ===================================================== -->
    <!-- KONTAKT + FOOTER -->
    <!-- ===================================================== -->

    <footer class="footer-section">

      <div class="container">

        <div class="footer-grid">

          <div>

            <div class="footer-logo">
              Tera<span>Build</span>
            </div>

            <p>
              Web trgovina građevinskim materijalima
              i opremom za gradnju.
            </p>

          </div>


          <div>

            <div class="footer-title">
              Kontakt
            </div>

            <a href="mailto:info@terabuild.com">
              <q-icon name="email" />
              info@terabuild.com
            </a>

            <a href="tel:+38512345678">
              <q-icon name="phone" />
              +385 1 234 5678
            </a>

          </div>


          <div>

            <div class="footer-title">
              Brze poveznice
            </div>

            <router-link to="/proizvodi">
              Proizvodi
            </router-link>

            <router-link to="/registracija">
              Registracija
            </router-link>

            <router-link to="/prijava">
              Prijava
            </router-link>

          </div>

        </div>


        <q-separator class="q-my-lg" />


        <div class="footer-bottom">

          <span>
            © 2026 TeraBuild. Sva prava pridržana.
          </span>

          <span>
            Završni rad
          </span>

        </div>

      </div>

    </footer>

  </q-page>
</template>


<script>
import { api } from "boot/axios";

export default {

  name: "IndexPage",

  data() {

    return {

      statistics: {
        broj_proizvoda: 0,
        broj_korisnika: 0,
        broj_recenzija: 0,
        naziv_proizvoda: "",
        opis: "",
        cijena: "",
        id_proizvoda: null,
        slika_url: "",
      },


      categories: [
        {
          id: 1,
          naziv: "Izolacijski materijali",
          slika: "/images/proizvodi/kategorije/01-izolacijski-materijali.png",
        },
        {
          id: 2,
          naziv: "Zidni materijali",
          slika: "/images/proizvodi/kategorije/02-zidni-materijali.png",
        },
        {
          id: 3,
          naziv: "Ljepila i mortovi",
          slika: "/images/proizvodi/kategorije/03-ljepila-i-mortovi.png",
        },
        {
          id: 4,
          naziv: "Građa i ploče",
          slika: "/images/proizvodi/kategorije/04-grada-i-ploce.png",
        },
        {
          id: 5,
          naziv: "Cement i pijesak",
          slika: "/images/proizvodi/kategorije/05-cement-i-pijesak.png",
        },
        {
          id: 6,
          naziv: "Hidroizolacija",
          slika: "/images/proizvodi/kategorije/06-hidroizolacija.png",
        },
        {
          id: 7,
          naziv: "Boje i lakovi",
          slika: "/images/proizvodi/kategorije/07-boje-i-lakovi.png",
        },
        {
          id: 8,
          naziv: "Alat i oprema",
          slika: "/images/proizvodi/kategorije/08-alat-i-oprema.png",
        },
        {
          id: 9,
          naziv: "Krovni materijali",
          slika: "/images/proizvodi/kategorije/09-krovni-materijali.png",
        },
        {
          id: 10,
          naziv: "Sanitarije",
          slika: "/images/proizvodi/kategorije/10-sanitarije.png",
        },
      ],


      faqs: [

        {
          pitanje: "Kako mogu registrirati novi račun?",
          odgovor:
            "Kliknite na gumb 'Registracija', ispunite tražene podatke i potvrdite registraciju.",
        },

        {
          pitanje: "Kako mogu naručiti proizvode?",
          odgovor:
            "Odaberite željene proizvode, dodajte ih u košaricu, unesite podatke za dostavu i potvrdite narudžbu.",
        },

        {
          pitanje: "Koji su načini plaćanja dostupni?",
          odgovor:
            "Način plaćanja odabire se prilikom izrade narudžbe. Dostupnost pojedinih načina ovisi o postavkama trgovine.",
        },

        {
          pitanje: "Kako mogu pratiti svoju narudžbu?",
          odgovor:
            "Nakon prijave možete otvoriti dio 'Moje narudžbe' gdje se prikazuju vaše prethodne narudžbe i njihovi statusi.",
        },

        {
          pitanje: "Mogu li spremiti proizvod za kasnije?",
          odgovor:
            "Da. Proizvode je moguće dodati na listu želja kako biste ih mogli jednostavno pronaći kasnije.",
        },

      ],

    };

  },


  mounted() {
    this.fetchStatistics();
  },


  methods: {

    async fetchStatistics() {

      try {

        const response = await api.get("/index-summary");

        this.statistics = response.data;

      } catch (error) {

        console.error(
          "Greška pri dohvaćanju podataka:",
          error
        );

      }

    },


    scrollToSection(id) {

      const element = document.getElementById(id);

      if (element) {

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    },


    goToCategory(categoryId) {

      this.$router.push({
        path: "/proizvodi",
        query: {
          kategorija: categoryId,
        },
      });

    },


    async addToCart(productId) {

      if (!productId) {
        this.$q.notify({
          type: "warning",
          message: "Proizvod nije dostupan za dodavanje u košaricu.",
          position: "top-right",
        });
        return;
      }

      try {
        // Dohvati potpune podatke proizvoda iz backenda
        const response = await api.get(`/proizvodi/${productId}`);
        const product = response.data?.data;

        if (!product) {
          this.$q.notify({
            type: "negative",
            message: "Proizvod nije pronađen.",
            position: "top-right",
          });
          return;
        }

        let cart = JSON.parse(
          localStorage.getItem("terabuild_cart") || "[]"
        );

        if (!Array.isArray(cart)) {
          cart = [];
        }

        const existing = cart.find(
          (item) => Number(item.id) === Number(productId)
        );

        if (existing) {
          existing.kolicina = Number(existing.kolicina || 0) + 1;
          existing.naziv = product.naziv;
          existing.cijena = Number(product.cijena || 0);
          existing.slika_url = product.slika_url || "";
          existing.jedinica = product.jedinica_mjere || "kom";
        } else {
          cart.push({
            id: Number(product.id_proizvod),
            naziv: product.naziv,
            cijena: Number(product.cijena || 0),
            slika_url: product.slika_url || "",
            jedinica: product.jedinica_mjere || "kom",
            kolicina: 1,
          });
        }

        localStorage.setItem(
          "terabuild_cart",
          JSON.stringify(cart)
        );

        const badge = document.getElementById("cartCount");

        if (badge) {
          const count = cart.reduce(
            (sum, item) => sum + Number(item.kolicina || 0),
            0
          );

          badge.textContent = count;
          badge.style.display = count > 0 ? "inline-block" : "none";
        }

        this.$q.notify({
          type: "positive",
          message: `"${product.naziv}" je dodan u košaricu.`,
          position: "top-right",
          timeout: 3000,
          actions: [
            {
              label: "Pogledaj",
              color: "white",
              handler: () => {
                this.$router.push("/kosarica");
              },
            },
          ],
        });
      } catch (error) {
        console.error(
          "Greška pri dodavanju proizvoda u košaricu:",
          error
        );

        this.$q.notify({
          type: "negative",
          message: "Proizvod nije moguće dodati u košaricu.",
          position: "top-right",
        });
      }
    },

  },

};
</script>


<style scoped>

/* ========================================================= */
/* OPĆE */
/* ========================================================= */

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.content-section {
  padding: 90px 30px;
}

.section-heading {
  max-width: 800px;
  margin-bottom: 50px;
}

.section-heading.text-center {
  margin-left: auto;
  margin-right: auto;
}

.section-heading h2 {
  font-size: 2.6rem;
  line-height: 1.2;
  margin: 12px 0 18px;
  font-weight: 800;
}

.section-heading h2 span {
  color: var(--q-primary);
}

.section-heading p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #6b7280;
}

.section-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1976d2;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
}

.section-label .q-icon {
  font-size: 20px;
}


/* ========================================================= */
/* HERO */
/* ========================================================= */

.hero-section {
  min-height: calc(100vh - 64px);
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;

  background:
    linear-gradient(
      135deg,
      #101820 0%,
      #1d2a35 55%,
      #263746 100%
    );

  color: white;
}

.hero-overlay {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at 20% 20%,
      rgba(248, 193, 61, 0.16),
      transparent 35%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(25, 118, 210, 0.18),
      transparent 35%
    );
}

.hero-content {
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 1150px;
  padding: 60px 25px;
}

.hero-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 55px;
  width: 100%;
}

.hero-logo-wrapper {
  flex: 0 0 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-logo {
  width: 210px;
  height: 210px;
}

.hero-text {
  flex: 1;
  max-width: 780px;
  text-align: left;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 16px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;

  background: rgba(255, 255, 255, 0.08);

  font-size: 0.9rem;

  margin-bottom: 25px;
}

.hero-title {
  font-size: clamp(2.7rem, 6vw, 5rem);
  line-height: 1.05;
  font-weight: 900;
  margin: 10px 0 25px;
}

.hero-title span {
  display: block;
  color: #f8c13d;
}

.hero-description {
  max-width: 760px;
  margin: 0 0 35px;

  font-size: 1.15rem;
  line-height: 1.7;

  color: rgba(255, 255, 255, 0.8);
}

.hero-buttons {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 14px;
}

.scroll-indicator {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;

  color: rgba(255, 255, 255, 0.6);

  font-size: 0.8rem;
}


/* ========================================================= */
/* UVOD / FEATURES */
/* ========================================================= */

.about-section {
  background: #ffffff;
}

.features-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 20px;
}

.feature-card {
  border-radius: 16px;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-6px);

  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  width: 55px;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: rgba(25, 118, 210, 0.1);

  color: #1976d2;

  margin-bottom: 18px;
}

.feature-icon .q-icon {
  font-size: 28px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0;
}


/* ========================================================= */
/* STATISTIKA */
/* ========================================================= */

.statistics-section {
  padding: 60px 30px;

  background:
    linear-gradient(
      135deg,
      #1976d2,
      #1565c0
    );

  color: white;
}

.statistics-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-item > .q-icon {
  font-size: 35px;
  opacity: 0.9;
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  margin-top: 5px;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}


/* ========================================================= */
/* PROIZVOD DANA */
/* ========================================================= */

.product-day-card {
  display: grid;

  grid-template-columns:
    minmax(300px, 0.8fr)
    minmax(0, 1.2fr);

  border-radius: 20px;
  overflow: hidden;

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.08);
}

.product-day-image {
  min-height: 330px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f7f8fa;

  padding: 35px;
}

.product-day-image .q-img {
  width: 100%;
  height: 250px;
}

.product-day-image .q-img :deep(img) {
  object-fit: contain !important;
  object-position: center !important;
}

.product-day-content {
  padding: 45px;
}

.product-day-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: #d89b00;

  font-weight: 700;

  margin-bottom: 15px;
}

.product-day-content h3 {
  font-size: 2rem;
  margin: 0 0 15px;
  font-weight: 800;
}

.product-day-content p {
  color: #6b7280;
  line-height: 1.7;
}

.product-day-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-top: 30px;
}

.product-price {
  color: #1976d2;
  font-size: 1.5rem;
  font-weight: 800;
}


/* ========================================================= */
/* KATEGORIJE */
/* ========================================================= */

.categories-section {
  background: #f7f8fa;
}

.categories-grid {
  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  gap: 18px;
}

.category-card {
  border-radius: 16px;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.category-card:hover {
  transform: translateY(-7px);

  border-color: #1976d2;

  box-shadow:
    0 15px 30px rgba(0, 0, 0, 0.08);
}

.category-icon {
  width: 65px;
  height: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 15px;

  border-radius: 50%;

  background: rgba(25, 118, 210, 0.1);

  color: #1976d2;
}

.category-icon .q-icon {
  font-size: 30px;
}

.category-image {
  width: 65px;
  height: 65px;
  border-radius: 50%;
}

.product-day-no-image {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-name {
  font-weight: 700;
  min-height: 45px;
}

.category-link {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 4px;

  margin-top: 12px;

  color: #1976d2;

  font-size: 0.85rem;
}


/* ========================================================= */
/* ZAŠTO TERABUILD */
/* ========================================================= */

.why-section {
  background: white;
}

.why-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 80px;

  align-items: center;
}

.why-grid h2 {
  font-size: 2.6rem;
  line-height: 1.2;
  font-weight: 800;

  margin: 15px 0 20px;
}

.why-description {
  color: #6b7280;
  line-height: 1.7;
  font-size: 1.05rem;
}

.why-list {
  margin-top: 30px;
}

.why-item {
  display: flex;
  gap: 14px;

  margin-bottom: 22px;
}

.why-item > .q-icon {
  font-size: 26px;
  flex-shrink: 0;
}

.why-item div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.why-item span {
  color: #6b7280;
  font-size: 0.95rem;
}

.why-image {
  display: flex;
  justify-content: center;
}

.why-image-card {
  width: 100%;
  max-width: 420px;
  min-height: 360px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  border-radius: 30px;

  background:
    linear-gradient(
      135deg,
      #1976d2,
      #0d47a1
    );

  color: white;

  text-align: center;

  box-shadow:
    0 25px 50px rgba(25, 118, 210, 0.25);
}


/* ========================================================= */
/* KORACI */
/* ========================================================= */

.steps-section {
  background: #f7f8fa;
}

.steps-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 30px;
}

.step-item {
  text-align: center;
  position: relative;
}

.step-number {
  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 20px;

  border-radius: 50%;

  background: #1976d2;
  color: white;

  font-weight: 800;
}

.step-item > .q-icon {
  font-size: 40px;
  color: #1976d2;
}

.step-item h3 {
  font-size: 1.15rem;
  margin: 18px 0 10px;
}

.step-item p {
  color: #6b7280;
  line-height: 1.6;
}


/* ========================================================= */
/* FAQ */
/* ========================================================= */

.faq-section {
  background: white;
}

.faq-container {
  max-width: 850px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.faq-item :deep(.q-item) {
  min-height: 60px;
  font-weight: 600;
}


/* ========================================================= */
/* CTA */
/* ========================================================= */

.cta-section {
  padding: 80px 30px;

  background:
    linear-gradient(
      135deg,
      #1976d2,
      #0d47a1
    );

  color: white;

  text-align: center;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.7rem;
  font-weight: 800;

  margin: 15px 0;
}

.cta-content p {
  font-size: 1.1rem;
  line-height: 1.7;

  color: rgba(255, 255, 255, 0.8);

  margin-bottom: 30px;
}


/* ========================================================= */
/* FOOTER */
/* ========================================================= */

.footer-section {
  background: #101820;
  color: white;

  padding: 60px 30px 25px;
}

.footer-grid {
  display: grid;

  grid-template-columns:
    2fr 1fr 1fr;

  gap: 60px;
}

.footer-logo {
  font-size: 2rem;
  font-weight: 900;
}

.footer-logo span {
  color: #f8c13d;
}

.footer-grid p {
  color: #9ca3af;
  max-width: 350px;
  line-height: 1.7;
}

.footer-title {
  font-weight: 800;
  font-size: 1.1rem;

  margin-bottom: 18px;
}

.footer-grid a {
  display: flex;
  align-items: center;

  gap: 8px;

  color: #9ca3af;

  text-decoration: none;

  margin-bottom: 12px;

  transition: color 0.2s ease;
}

.footer-grid a:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;

  color: #6b7280;

  font-size: 0.85rem;
}


/* ========================================================= */
/* MOBITEL */
/* ========================================================= */

@media (max-width: 900px) {

  .features-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .categories-grid {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .steps-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .why-grid {
    grid-template-columns: 1fr;
    gap: 45px;
  }

  .product-day-card {
    grid-template-columns: 1fr;
  }

  .product-day-image {
    min-height: 260px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

}


@media (max-width: 600px) {

  .content-section {
    padding: 60px 18px;
  }

  .hero-section {
    min-height: 100vh;
  }

  .hero-content {
    padding: 40px 20px;
  }

  .hero-main {
    flex-direction: column;
    gap: 25px;
  }

  .hero-logo-wrapper {
    flex: none;
  }

  .hero-logo {
    width: 110px;
    height: 110px;
  }

  .hero-text {
    max-width: 100%;
    text-align: center;
  }

  .hero-title {
    font-size: 2.6rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-buttons {
    justify-content: center;
    flex-direction: column;
  }

  .hero-buttons .q-btn {
    width: 100%;
  }

  .section-heading h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .categories-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .product-day-content {
    padding: 28px 22px;
  }

  .product-day-content h3 {
    font-size: 1.5rem;
  }

  .product-day-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-day-bottom .q-btn {
    width: 100%;
  }

  .why-grid h2 {
    font-size: 2rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .cta-content h2 {
    font-size: 2rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
  }

}

</style>