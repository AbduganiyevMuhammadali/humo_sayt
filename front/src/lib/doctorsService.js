import { supabase, isSupabaseReady, STORAGE_BUCKET } from './supabase'

// Shifokorlar bilan ishlash xizmati.
// Supabase ulangan bo'lsa — bazadan, aks holda standart ro'yxatdan foydalanadi.

const TABLE = 'doctors'

// Supabase bo'sh bo'lganda yoki ulanmaganda ko'rsatiladigan standart shifokorlar.
// photo_url bo'sh — DoctorsSection avtomatik /images/doctor-N.jpg ni qidiradi.
export const defaultDoctors = [
  {
    id: 'd1',
    name: 'Хакимов Акмал Раббимович',
    specialty: 'Терапевт-кардиолог',
    experience: '46 лет стажа',
    patients: '10000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd2',
    name: 'Хакимов Фаррух Акмалович',
    specialty: 'Терапевт-хирург',
    experience: '16 лет стажа',
    patients: '3000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd3',
    name: 'Раупов Фарход Тўйчиевич',
    specialty: 'Педиатр-аллерголог',
    experience: '25 лет стажа',
    patients: '5000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd4',
    name: 'Амриев Акрамжон Ахмадович',
    specialty: 'Невропатолог',
    experience: '8 лет стажа',
    patients: '2000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd5',
    name: 'Абдиев Бахром Бокожонович',
    specialty: 'Терапевт',
    experience: '15 лет стажа',
    patients: '2000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd6',
    name: 'Юсупов Тўлқин Юнусович',
    specialty: 'Уролог',
    experience: '15 лет стажа',
    patients: '3000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd7',
    name: 'Самебоев Рустам Матлубович',
    specialty: 'Невропатолог',
    experience: '45 лет стажа',
    patients: '10000+ пациентов',
    photo_url: '',
  },
  {
    id: 'd8',
    name: 'Зиядуллаев Хамидулло Хайруллаевич',
    specialty: 'Уролог-Эндоуролог',
    experience: '15+ лет стажа',
    patients: '3000+ пациентов',
    photo_url: '/images/doctor-urolog.jpg',
  },
  {
    id: 'd9',
    name: 'Меликулов Санат Меликович',
    specialty: 'Врач ЛОР',
    experience: '27 лет стажа',
    patients: '5000+ пациентов',
    photo_url: '/images/doctor-8.jpg',
  },
  {
    id: 'd10',
    name: 'Хакимова Нафиса Акмаловна',
    specialty: 'Врач-лаборант',
    experience: '19+ лет стажа',
    patients: '',
    photo_url: '/images/doctor-9.jpg',
  },
]

// Barcha shifokorlarni olish.
export async function fetchDoctors() {
  if (!isSupabaseReady) return defaultDoctors
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort', { ascending: true })
  if (error) {
    console.warn('[doctors] fetch error:', error.message)
    return defaultDoctors
  }
  return data && data.length ? data : defaultDoctors
}

// Yangi shifokor qo'shish.
export async function createDoctor(doctor) {
  const { data, error } = await supabase.from(TABLE).insert(doctor).select().single()
  if (error) throw error
  return data
}

// Shifokorni yangilash.
export async function updateDoctor(id, patch) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Shifokorni o'chirish.
export async function deleteDoctor(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

// Rasm yuklash → ommaviy URL qaytaradi.
export async function uploadPhoto(file) {
  const ext = file.name.split('.').pop()
  const path = `doctor-${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
