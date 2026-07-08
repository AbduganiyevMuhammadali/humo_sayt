<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { isSupabaseReady } from '../../lib/supabase'
import {
  fetchDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  uploadPhoto,
} from '../../lib/doctorsService'

// ===== Kirish (oddiy parol) =====
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'humo2026'
const authed = ref(sessionStorage.getItem('admin_ok') === '1')
const pass = ref('')
const loginError = ref('')

function login() {
  if (pass.value === ADMIN_PASSWORD) {
    authed.value = true
    sessionStorage.setItem('admin_ok', '1')
    loginError.value = ''
    load()
  } else {
    loginError.value = "Parol noto'g'ri"
  }
}
function logout() {
  authed.value = false
  sessionStorage.removeItem('admin_ok')
}

// ===== Shifokorlar =====
const doctors = ref([])
const loading = ref(false)
const saving = ref(false)
const message = ref('')

const empty = () => ({
  id: null,
  name: '',
  specialty: '',
  experience: '',
  patients: '',
  photo_url: '',
  sort: 0,
})
const form = reactive(empty())
const editing = computed(() => form.id !== null)
const uploadingPhoto = ref(false)

async function load() {
  if (!authed.value) return
  loading.value = true
  try {
    doctors.value = await fetchDoctors()
  } finally {
    loading.value = false
  }
}

function startEdit(d) {
  Object.assign(form, d)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function resetForm() {
  Object.assign(form, empty())
}

async function onPhoto(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (!isSupabaseReady) {
    flash("⚠️ Avval Supabase'ni ulang — rasm yuklash uchun kerak")
    return
  }
  uploadingPhoto.value = true
  try {
    form.photo_url = await uploadPhoto(file)
    flash('✓ Rasm yuklandi')
  } catch (err) {
    flash('Xato: ' + err.message)
  } finally {
    uploadingPhoto.value = false
  }
}

async function save() {
  if (!form.name || !form.specialty) {
    flash('Ism va mutaxassislikni kiriting')
    return
  }
  if (!isSupabaseReady) {
    flash("⚠️ Supabase ulanmagan. Sozlamani .env faylga kiriting (README'ga qarang)")
    return
  }
  saving.value = true
  try {
    const payload = {
      name: form.name,
      specialty: form.specialty,
      experience: form.experience,
      patients: form.patients,
      photo_url: form.photo_url,
      sort: Number(form.sort) || 0,
    }
    if (editing.value) {
      await updateDoctor(form.id, payload)
      flash('✓ Saqlandi')
    } else {
      await createDoctor(payload)
      flash("✓ Shifokor qo'shildi")
    }
    resetForm()
    await load()
  } catch (err) {
    flash('Xato: ' + err.message)
  } finally {
    saving.value = false
  }
}

async function remove(d) {
  if (!confirm(`"${d.name}" shifokorni o'chirasizmi?`)) return
  try {
    await deleteDoctor(d.id)
    await load()
    flash("✓ O'chirildi")
  } catch (err) {
    flash('Xato: ' + err.message)
  }
}

let flashTimer = null
function flash(text) {
  message.value = text
  clearTimeout(flashTimer)
  flashTimer = setTimeout(() => (message.value = ''), 3500)
}

onMounted(load)
</script>

<template>
  <div class="admin">
    <!-- LOGIN -->
    <div v-if="!authed" class="login">
      <div class="login__card">
        <h1>HUMO MEDLINE</h1>
        <p>Admin panel</p>
        <input
          v-model="pass"
          type="password"
          placeholder="Parol"
          @keyup.enter="login"
        />
        <button class="btn-pri" @click="login">Kirish</button>
        <span v-if="loginError" class="login__err">{{ loginError }}</span>
      </div>
    </div>

    <!-- PANEL -->
    <div v-else class="panel">
      <header class="panel__top">
        <div>
          <h1>Admin panel</h1>
          <p>Shifokorlarni boshqarish</p>
        </div>
        <div class="panel__top-right">
          <a href="/" class="link">← Saytga</a>
          <button class="btn-ghost" @click="logout">Chiqish</button>
        </div>
      </header>

      <div v-if="!isSupabaseReady" class="warn">
        ⚠️ Supabase ulanmagan. O'zgarishlarni saqlash uchun <code>.env</code> faylga
        Supabase URL va kalitni kiriting (yo'riqnoma <code>SUPABASE_SETUP.md</code> da).
      </div>

      <div class="grid">
        <!-- FORMA -->
        <section class="card form">
          <h2>{{ editing ? 'Shifokorni tahrirlash' : "Yangi shifokor qo'shish" }}</h2>

          <div class="photo">
            <div class="photo__preview" :style="form.photo_url ? { backgroundImage: `url(${form.photo_url})` } : {}">
              <span v-if="!form.photo_url">Rasm yo'q</span>
            </div>
            <label class="photo__btn">
              {{ uploadingPhoto ? 'Yuklanmoqda…' : 'Rasm tanlash' }}
              <input type="file" accept="image/*" hidden @change="onPhoto" />
            </label>
          </div>

          <label>Ism familiya
            <input v-model="form.name" placeholder="Masalan: Хакимов Акмал" />
          </label>
          <label>Mutaxassislik
            <input v-model="form.specialty" placeholder="Невропатолог" />
          </label>
          <label>Tajriba
            <input v-model="form.experience" placeholder="20 лет стажа" />
          </label>
          <label>Bemorlar
            <input v-model="form.patients" placeholder="4500+ пациентов" />
          </label>
          <label>Tartib raqami
            <input v-model="form.sort" type="number" placeholder="0" />
          </label>

          <div class="form__actions">
            <button class="btn-pri" :disabled="saving" @click="save">
              {{ saving ? 'Saqlanmoqda…' : editing ? 'Saqlash' : "Qo'shish" }}
            </button>
            <button v-if="editing" class="btn-ghost" @click="resetForm">Bekor qilish</button>
          </div>
        </section>

        <!-- RO'YXAT -->
        <section class="card list">
          <h2>Shifokorlar ({{ doctors.length }})</h2>
          <p v-if="loading" class="muted">Yuklanmoqda…</p>
          <ul v-else class="docs">
            <li v-for="d in doctors" :key="d.id" class="doc">
              <div class="doc__ava" :style="d.photo_url ? { backgroundImage: `url(${d.photo_url})` } : {}">
                <span v-if="!d.photo_url">{{ (d.name || '?').slice(0, 1) }}</span>
              </div>
              <div class="doc__info">
                <strong>{{ d.name }}</strong>
                <span>{{ d.specialty }}</span>
                <small>{{ d.experience }} · {{ d.patients }}</small>
              </div>
              <div class="doc__act">
                <button class="ico" title="Tahrirlash" @click="startEdit(d)">✎</button>
                <button class="ico ico--del" title="O'chirish" @click="remove(d)">🗑</button>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <transition name="fade">
        <div v-if="message" class="toast">{{ message }}</div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  background: #eef4fb;
  font-family: var(--font-body, sans-serif);
}

/* LOGIN */
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, #0f1f3a, #1d3457);
}
.login__card {
  width: 340px;
  padding: 40px 34px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.login__card h1 {
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  color: #0f1f3a;
}
.login__card p {
  margin: 6px 0 24px;
  color: #5b6b85;
}
.login__card input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(36, 65, 108, 0.16);
  font-size: 1rem;
  margin-bottom: 14px;
}
.login__err {
  display: block;
  margin-top: 12px;
  color: #e23b3b;
  font-size: 0.9rem;
}

/* PANEL */
.panel {
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 24px 80px;
}
.panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.panel__top h1 {
  font-size: 1.6rem;
  color: #0f1f3a;
}
.panel__top p {
  color: #5b6b85;
}
.panel__top-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.link {
  color: #2f5d97;
  font-weight: 600;
  text-decoration: none;
}

.warn {
  padding: 16px 18px;
  border-radius: 14px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  color: #8a5a00;
  margin-bottom: 22px;
  font-size: 0.94rem;
}
.warn code {
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 6px;
  border-radius: 5px;
}

.grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 22px;
  align-items: start;
}
.card {
  background: #fff;
  border-radius: 20px;
  padding: 26px;
  box-shadow: 0 10px 30px rgba(15, 31, 58, 0.08);
}
.card h2 {
  font-size: 1.15rem;
  color: #0f1f3a;
  margin-bottom: 18px;
}

/* forma */
.photo {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}
.photo__preview {
  width: 84px;
  height: 84px;
  border-radius: 16px;
  background: #e8f0fb center/cover no-repeat;
  display: grid;
  place-items: center;
  color: #8aa3c4;
  font-size: 0.75rem;
  flex: none;
}
.photo__btn {
  padding: 10px 16px;
  border-radius: 10px;
  background: #eef4fb;
  border: 1px solid rgba(36, 65, 108, 0.14);
  color: #24416c;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}
.form label {
  display: block;
  margin-bottom: 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #5b6b85;
}
.form input {
  width: 100%;
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(36, 65, 108, 0.14);
  font-size: 0.96rem;
}
.form__actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.btn-pri {
  padding: 12px 22px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #3f7bc4, #1d3457);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.btn-pri:disabled {
  opacity: 0.6;
}
.btn-ghost {
  padding: 12px 20px;
  border-radius: 10px;
  border: 1px solid rgba(36, 65, 108, 0.18);
  background: #fff;
  color: #24416c;
  font-weight: 600;
  cursor: pointer;
}

/* ro'yxat */
.docs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}
.doc {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid rgba(36, 65, 108, 0.08);
}
.doc__ava {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #cfe2f6 center/cover no-repeat;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #24416c;
  flex: none;
}
.doc__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.doc__info strong {
  color: #0f1f3a;
}
.doc__info span {
  color: #2f5d97;
  font-size: 0.9rem;
}
.doc__info small {
  color: #8aa3c4;
  font-size: 0.82rem;
}
.doc__act {
  display: flex;
  gap: 8px;
}
.ico {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid rgba(36, 65, 108, 0.14);
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
}
.ico--del:hover {
  background: #ffeaea;
  border-color: #ffb3b3;
}
.muted {
  color: #8aa3c4;
}

.toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f1f3a;
  color: #fff;
  padding: 14px 26px;
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
  z-index: 50;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
