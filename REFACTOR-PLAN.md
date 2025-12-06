# Plan Refactorizare: Universal Services & Subscriptions

## Obiectiv
Transformarea sistemului de colecții pentru a fi 100% universal - același cod pentru orice tip de afacere (fitness, dental, juridic, auto service, etc.)

## Structura Finală Colecții

| Colecție | Scop | Exemple |
|----------|------|---------|
| `services` | Orice serviciu oferit | Clase fitness, Tratamente dentare, Consultații juridice |
| `subscriptions` | Abonamente recurente | Abonament fitness, Pachet întreținere dentară |
| `products` | Produse fizice | Suplimente, Merchandise, Produse vânzare |

## Faza 1: Extindere Services Collection

### Câmpuri Noi (Opționale - afișate condiționat)

```ts
// src/collections/Services.ts - Structură Payload CMS Compatibilă

import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Serviciu',
    plural: 'Servicii',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'duration', 'featured', 'order'],
    group: 'Business',
    listSearchableFields: ['title', 'slug', 'shortDescription'],
  },
  fields: [
    // === CÂMPURI DE BAZĂ (existente) ===
    {
      name: 'title',
      type: 'text',
      label: 'Denumire serviciu',
      required: true,
      index: true,
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descriere scurtă',
      maxLength: 300,
      admin: {
        description: 'Maxim 2-3 propoziții pentru carduri',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere detaliată',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (Lucide icon name)',
      admin: {
        description: 'Ex: Scissors, Heart, Car, Dumbbell, Wrench',
      },
    },

    // === PREȚ ȘI DURATĂ ===
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Preț (RON)',
          admin: { width: '25%' },
        },
        {
          name: 'priceFrom',
          type: 'checkbox',
          label: 'De la',
          admin: {
            width: '15%',
            style: { alignSelf: 'flex-end' },
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Durată text',
          admin: {
            width: '30%',
            description: 'Ex: 30 min, 1 oră',
          },
        },
        {
          name: 'durationMinutes',
          type: 'number',
          label: 'Durată (min)',
          min: 5,
          max: 480,
          admin: { width: '30%' },
        },
      ],
    },

    // === CÂMPURI EXTINSE (pentru clase fitness, tratamente, etc.) ===
    {
      name: 'extendedOptions',
      type: 'collapsible',
      label: 'Opțiuni Avansate',
      admin: {
        initCollapsed: true,
        description: 'Câmpuri opționale pentru clase fitness, tratamente, etc.',
      },
      fields: [
        // Dificultate & Capacitate
        {
          type: 'row',
          fields: [
            {
              name: 'difficulty',
              type: 'select',
              label: 'Dificultate',
              admin: { width: '33%' },
              options: [
                { label: 'Începător', value: 'beginner' },
                { label: 'Intermediar', value: 'intermediate' },
                { label: 'Avansat', value: 'advanced' },
                { label: 'Toate nivelurile', value: 'all-levels' },
              ],
            },
            {
              name: 'capacity',
              type: 'number',
              label: 'Capacitate persoane',
              admin: { width: '33%' },
            },
            {
              name: 'caloriesBurned',
              type: 'number',
              label: 'Calorii arse',
              admin: {
                width: '33%',
                description: 'Estimat per ședință',
              },
            },
          ],
        },

        // Responsabil/Instructor
        {
          name: 'assignedTeamMember',
          type: 'relationship',
          relationTo: 'team',
          label: 'Responsabil / Instructor',
          admin: {
            description: 'Antrenor, medic, avocat responsabil de serviciu',
          },
        },

        // Program săptămânal (pentru clase/consultații programate)
        {
          name: 'schedule',
          type: 'array',
          label: 'Program săptămânal',
          labels: {
            singular: 'Ședință',
            plural: 'Ședințe',
          },
          admin: {
            description: 'Program fix pentru clase fitness, consultații programate',
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  label: 'Zi',
                  required: true,
                  admin: { width: '33%' },
                  options: [
                    { label: 'Luni', value: 'monday' },
                    { label: 'Marți', value: 'tuesday' },
                    { label: 'Miercuri', value: 'wednesday' },
                    { label: 'Joi', value: 'thursday' },
                    { label: 'Vineri', value: 'friday' },
                    { label: 'Sâmbătă', value: 'saturday' },
                    { label: 'Duminică', value: 'sunday' },
                  ],
                },
                {
                  name: 'startTime',
                  type: 'text',
                  label: 'Ora început',
                  required: true,
                  admin: {
                    width: '33%',
                    placeholder: '18:00',
                  },
                },
                {
                  name: 'endTime',
                  type: 'text',
                  label: 'Ora sfârșit',
                  admin: {
                    width: '33%',
                    placeholder: '19:00',
                  },
                },
              ],
            },
            {
              name: 'room',
              type: 'text',
              label: 'Sală / Cabinet',
            },
          ],
        },

        // Prețuri multiple (drop-in, abonament lunar, pachet)
        {
          name: 'pricingOptions',
          type: 'group',
          label: 'Opțiuni prețuri multiple',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'dropIn',
                  type: 'number',
                  label: 'Preț/ședință (RON)',
                  admin: { width: '33%' },
                },
                {
                  name: 'monthly',
                  type: 'number',
                  label: 'Abonament lunar (RON)',
                  admin: { width: '33%' },
                },
                {
                  name: 'packageSessions',
                  type: 'number',
                  label: 'Nr. ședințe pachet',
                  admin: { width: '17%' },
                },
                {
                  name: 'packagePrice',
                  type: 'number',
                  label: 'Preț pachet',
                  admin: { width: '17%' },
                },
              ],
            },
          ],
        },

        // Beneficii
        {
          name: 'benefits',
          type: 'array',
          label: 'Beneficii',
          labels: {
            singular: 'Beneficiu',
            plural: 'Beneficii',
          },
          fields: [
            {
              name: 'benefit',
              type: 'text',
              required: true,
            },
          ],
        },

        // Cerințe/Echipament necesar
        {
          name: 'requirements',
          type: 'textarea',
          label: 'Cerințe / Echipament necesar',
          admin: {
            description: 'Ex: Saltea de yoga, prosop, documente necesare',
          },
        },
      ],
    },

    // === CARACTERISTICI (ce include) ===
    {
      name: 'features',
      type: 'array',
      label: 'Ce include',
      labels: {
        singular: 'Caracteristică',
        plural: 'Caracteristici',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Caracteristică',
        },
      ],
    },

    // === SIDEBAR FIELDS ===
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categorie',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'serviceType',
      type: 'select',
      label: 'Tip serviciu',
      admin: {
        position: 'sidebar',
        description: 'Pentru filtrare și afișare',
      },
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Clasă grup', value: 'class' },
        { label: 'Sesiune individuală', value: 'individual' },
        { label: 'Consultație', value: 'consultation' },
        { label: 'Tratament', value: 'treatment' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Serviciu popular',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activ',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine afișare',
      defaultValue: 0,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  defaultSort: 'order',
}
```

## Faza 2: Redenumire Blocuri

### ClassDetail → ServiceDetail

```ts
// src/blocks/ServiceDetail/config.ts

import type { Block } from 'payload'

export const ServiceDetailBlock: Block = {
  slug: 'serviceDetail',
  labels: {
    singular: 'Service Detail',
    plural: 'Service Details',
  },
  imageURL: '/blocks/service-detail.svg',
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: 'Serviciu',
      required: true,
      admin: {
        description: 'Selectează serviciul de afișat',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'full',
      options: [
        { label: 'Full (Image + Sidebar)', value: 'full' },
        { label: 'Compact (No Sidebar)', value: 'compact' },
        { label: 'Hero Style', value: 'hero' },
      ],
    },
    // ... restul câmpurilor rămân la fel ca ClassDetail
  ],
}
```

### ClassesGrid → Se extinde Services Block existent

Blocul `Services` existent se extinde cu opțiuni pentru afișare grid clase.

## Faza 3: Actualizare RenderBlocks

```ts
// Schimbări în RenderBlocks.tsx

// Funcție nouă
async function getServiceById(id: string) {
  const payload = await getPayload({ config: configPromise })
  try {
    return await payload.findByID({
      collection: 'services',
      id,
      depth: 2,
    })
  } catch {
    return null
  }
}

// Case handler pentru serviceDetail
case 'serviceDetail': {
  const serviceRef = block.service as string | { id: string } | null
  const serviceId = typeof serviceRef === 'string' ? serviceRef : serviceRef?.id
  const serviceData = serviceId ? await getServiceById(serviceId) : null
  // ... render ServiceDetailBlock
}
```

## Faza 4: Actualizare Seeder Fitness

```ts
// src/seed/helpers.ts - Funcție nouă universală

export async function seedServices(
  payload: Payload,
  services: Array<{
    // Câmpuri de bază
    title: string
    shortDescription?: string
    price?: number
    duration?: string
    durationMinutes?: number
    imageId?: string
    icon?: string

    // Câmpuri extinse (opționale)
    serviceType?: 'standard' | 'class' | 'individual' | 'consultation' | 'treatment'
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
    capacity?: number
    caloriesBurned?: number
    assignedTeamMemberId?: string
    schedule?: Array<{
      day: string
      startTime: string
      endTime?: string
      room?: string
    }>
    pricingOptions?: {
      dropIn?: number
      monthly?: number
      packageSessions?: number
      packagePrice?: number
    }
    benefits?: string[]
    requirements?: string
    features?: string[]

    // Meta
    categoryId?: string
    featured?: boolean
    active?: boolean
    order?: number
  }>,
): Promise<Map<string, string>> {
  const serviceMap = new Map<string, string>()

  for (const service of services) {
    const slug = service.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    const created = await payload.create({
      collection: 'services',
      data: {
        title: service.title,
        slug,
        shortDescription: service.shortDescription,
        price: service.price,
        duration: service.duration,
        durationMinutes: service.durationMinutes,
        image: service.imageId,
        icon: service.icon,
        serviceType: service.serviceType || 'standard',
        difficulty: service.difficulty,
        capacity: service.capacity,
        caloriesBurned: service.caloriesBurned,
        assignedTeamMember: service.assignedTeamMemberId,
        schedule: service.schedule?.map(s => ({
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
        })),
        pricingOptions: service.pricingOptions,
        benefits: service.benefits?.map(b => ({ benefit: b })),
        requirements: service.requirements,
        features: service.features?.map(f => ({ feature: f })),
        category: service.categoryId,
        featured: service.featured ?? false,
        active: service.active ?? true,
        order: service.order ?? 0,
      },
    })
    serviceMap.set(service.title, created.id)
  }

  console.log(`   Created ${services.length} services`)
  return serviceMap
}
```

## Faza 5: Actualizare fitness.ts

```ts
// src/seed/businesses/fitness.ts

// În loc de seedClasses() folosim seedServices()
const createdServices = await seedServices(payload, fitnessData.classes.map(classItem => ({
  title: classItem.title,
  shortDescription: classItem.shortDescription,
  serviceType: 'class', // Marchează ca clasă
  difficulty: classItem.difficulty,
  durationMinutes: classItem.duration,
  capacity: classItem.capacity,
  assignedTeamMemberId: classItem.trainerName ? createdTeam.get(classItem.trainerName) : undefined,
  schedule: classItem.schedule,
  pricingOptions: {
    dropIn: classItem.pricing?.dropIn,
    monthly: classItem.pricing?.monthly,
  },
  benefits: classItem.benefits,
  imageId: getImageId(fitnessImages.classes[classItem.imageIndex || 0]?.filename),
  featured: classItem.featured,
  order: classItem.order,
})))
```

## Faza 6: Curățare

### Fișiere de șters:
- `src/collections/Classes.ts`
- `src/blocks/ClassDetail/` (întreg folder-ul)
- `src/blocks/ClassesGrid/` (sau păstrăm și îl redenumim)

### Fișiere de actualizat:
- `src/collections/index.ts` - elimină Classes export
- `src/blocks/index.ts` - elimină ClassDetail, ClassesGrid
- `src/blocks/RenderBlocks.tsx` - elimină case-urile pentru classes
- `payload.config.ts` - elimină Classes din collections

## Beneficii Finale

1. **Un singur sistem** - Services funcționează pentru orice afacere
2. **Câmpuri condiționale** - Se afișează doar ce e relevant
3. **Seeder universal** - `seedServices()` pentru orice tip de serviciu
4. **Blocuri universale** - ServiceDetail în loc de ClassDetail
5. **Payload CMS compatibil** - Folosește patterns oficiale (collapsible, row, relationship)

## Ordine Execuție

1. ✅ Backup branch curent
2. 🔄 Extinde Services collection cu câmpuri noi
3. 🔄 Creează ServiceDetail block (copie din ClassDetail)
4. 🔄 Actualizează RenderBlocks pentru serviceDetail
5. 🔄 Creează seedServices() helper universal
6. 🔄 Actualizează fitness seeder să folosească services
7. 🔄 Testează seeder-ul
8. 🔄 Șterge Classes collection și blocuri vechi
9. 🔄 Regenerează payload-types.ts
10. ✅ Test final complet
