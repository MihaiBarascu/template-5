'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Clock, User, MapPin, ArrowRight } from 'lucide-react'
import { getBgClasses, getCategoryColors, type CategoryColorName } from '@/blocks/_shared/themeHelpers'

interface ScheduleEntry {
  id?: string | null
  day: string
  startTime: string
  endTime?: string | null
  title: string
  trainer?: string | null
  room?: string | null
  color?: string | null
  classSlug?: string // Used for service detail page links
  duration?: number | null
  category?: string
}

interface ScheduleLabels {
  allFilter?: string
  todayBadge?: string
  noClasses?: string
  detailsButton?: string
  timeHeader?: string
  dayLabels?: Record<string, string>
}

interface ScheduleTableBlockProps {
  variant?: 'table-week' | 'list-days' | 'cards-days' | 'calendar-compact'
  heading?: string
  subheading?: string
  showTrainer?: boolean
  showDuration?: boolean
  showRoom?: boolean
  showCategoryFilter?: boolean
  highlightToday?: boolean
  startHour?: number
  endHour?: number
  ctaButton?: {
    enabled?: boolean | null
    label?: string | null
    link?: string | null
  } | null
  backgroundColor?: 'default' | 'light' | 'dark'
  scheduleEntries: ScheduleEntry[]
  labels?: ScheduleLabels
}

// Helper function to get color for schedule entries (supports both direct colors and category mapping)
function getEntryColors(colorName: string | null | undefined): { bg: string; border: string; text: string } {
  if (!colorName) return { bg: 'bg-theme-primary/10', border: 'border-theme-primary', text: 'text-theme-primary' }

  // Handle 'primary' as theme color
  if (colorName === 'primary') {
    return { bg: 'bg-theme-primary/10', border: 'border-theme-primary', text: 'text-theme-primary' }
  }

  // Try to get from centralized category colors
  try {
    return getCategoryColors(colorName as CategoryColorName)
  } catch {
    // Default fallback to theme primary
    return { bg: 'bg-theme-primary/10', border: 'border-theme-primary', text: 'text-theme-primary' }
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  cardio: 'orange',
  strength: 'blue',
  flexibility: 'green',
  'mind-body': 'purple',
  hiit: 'orange',
  combat: 'primary',
  dance: 'purple',
}

export function ScheduleTableBlock({
  variant = 'table-week',
  heading,
  subheading,
  showTrainer = true,
  showDuration = true,
  showRoom = false,
  showCategoryFilter = true,
  highlightToday = true,
  startHour = 7,
  endHour = 22,
  ctaButton,
  backgroundColor = 'default',
  scheduleEntries,
  labels = {},
}: ScheduleTableBlockProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  // null = show all days, number = show only that day
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)

  // Merge default labels with provided labels
  const defaultDayLabels: Record<string, string> = {
    monday: 'Luni',
    tuesday: 'Marti',
    wednesday: 'Miercuri',
    thursday: 'Joi',
    friday: 'Vineri',
    saturday: 'Sambata',
    sunday: 'Duminica',
  }
  const dayLabels = { ...defaultDayLabels, ...labels.dayLabels }
  const allFilterLabel = labels.allFilter || 'Toate'
  const todayBadgeLabel = labels.todayBadge || 'Astazi'
  const noClassesLabel = labels.noClasses || 'Fara clase'
  const detailsButtonLabel = labels.detailsButton || 'Detalii'
  const timeHeaderLabel = labels.timeHeader || 'Ora'

  // Build days array from labels
  const DAYS_WITH_LABELS = [
    { key: 'monday', label: dayLabels.monday, short: dayLabels.monday?.charAt(0) || 'L' },
    { key: 'tuesday', label: dayLabels.tuesday, short: dayLabels.tuesday?.substring(0, 2) || 'Ma' },
    { key: 'wednesday', label: dayLabels.wednesday, short: dayLabels.wednesday?.substring(0, 2) || 'Mi' },
    { key: 'thursday', label: dayLabels.thursday, short: dayLabels.thursday?.charAt(0) || 'J' },
    { key: 'friday', label: dayLabels.friday, short: dayLabels.friday?.charAt(0) || 'V' },
    { key: 'saturday', label: dayLabels.saturday, short: dayLabels.saturday?.charAt(0) || 'S' },
    { key: 'sunday', label: dayLabels.sunday, short: dayLabels.sunday?.charAt(0) || 'D' },
  ]

  const bgClass = getBgClasses(backgroundColor)

  // Get today's day key
  const today = DAYS_WITH_LABELS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]?.key

  // Get unique categories from schedule entries
  const categories = Array.from(new Set(scheduleEntries.map((e) => e.category).filter(Boolean)))

  // Filter entries by category
  const filteredEntries = selectedCategory === 'all'
    ? scheduleEntries
    : scheduleEntries.filter((e) => e.category === selectedCategory)

  // Group entries by day
  const entriesByDay = DAYS_WITH_LABELS.reduce((acc, day) => {
    acc[day.key] = filteredEntries
      .filter((e) => e.day === day.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    return acc
  }, {} as Record<string, ScheduleEntry[]>)

  if (variant === 'list-days') {
    return (
      <section className={`py-section ${bgClass}`}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
              {subheading && <p className="text-theme-text-light max-w-2xl mx-auto">{subheading}</p>}
            </div>
          )}

          {showCategoryFilter && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-theme-primary text-theme-text-on-primary'
                    : 'bg-theme-light text-theme-text hover:bg-theme-primary/10'
                }`}
              >
                {allFilterLabel}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat || 'all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedCategory === cat
                      ? 'bg-theme-primary text-theme-text-on-primary'
                      : 'bg-theme-light text-theme-text hover:bg-theme-primary/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-8">
            {DAYS_WITH_LABELS.map((day) => {
              const dayEntries = entriesByDay[day.key]
              if (!dayEntries.length) return null

              return (
                <div key={day.key} className={`${highlightToday && today === day.key ? 'ring-2 ring-theme-primary rounded-lg p-4' : ''}`}>
                  <h3 className={`text-xl font-bold mb-4 ${highlightToday && today === day.key ? 'text-theme-primary' : ''}`}>
                    {day.label}
                    {highlightToday && today === day.key && (
                      <span className="ml-2 text-sm font-normal bg-theme-primary text-theme-text-on-primary px-2 py-1 rounded">{todayBadgeLabel}</span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {dayEntries.map((entry, idx) => {
                      const color = getEntryColors(entry.color || CATEGORY_COLORS[entry.category || ''])
                      return (
                        <div
                          key={entry.id || idx}
                          className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${color.bg} ${color.border}`}
                        >
                          <div className="font-bold text-lg w-20">
                            {entry.startTime}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">{entry.title}</div>
                            <div className="flex items-center gap-4 text-sm text-theme-text-light mt-1">
                              {showDuration && entry.duration && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {entry.duration} min
                                </span>
                              )}
                              {showTrainer && entry.trainer && (
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {entry.trainer}
                                </span>
                              )}
                              {showRoom && entry.room && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {entry.room}
                                </span>
                              )}
                            </div>
                          </div>
                          {entry.classSlug && (
                            <Link
                              href={`/clase/${entry.classSlug}`}
                              className="btn-primary py-2 px-4 text-sm"
                            >
                              {detailsButtonLabel}
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {ctaButton?.enabled && ctaButton.link && (
            <div className="text-center mt-10">
              <Link href={ctaButton.link} className="btn-primary inline-flex items-center gap-2">
                {ctaButton.label || 'Inscrie-te acum'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'cards-days') {
    // For cards-days, default to today if nothing selected
    const effectiveDayIndex = selectedDayIndex ?? (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
    const selectedDay = DAYS_WITH_LABELS[effectiveDayIndex]
    const selectedDayEntries = selectedDay ? entriesByDay[selectedDay.key] : []

    return (
      <section className={`py-section ${bgClass}`}>
        <div className="container mx-auto px-4">
          {(heading || subheading) && (
            <div className="text-center mb-12">
              {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
              {subheading && <p className="text-theme-text-light max-w-2xl mx-auto">{subheading}</p>}
            </div>
          )}

          {/* Day selector tabs */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {DAYS_WITH_LABELS.map((day, index) => {
              const isSelected = effectiveDayIndex === index
              const isToday = highlightToday && today === day.key

              return (
                <button
                  key={day.key}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`
                    px-4 py-2 rounded-full font-medium transition-all duration-200
                    ${isSelected
                      ? 'bg-theme-primary text-theme-text-on-primary shadow-lg scale-105'
                      : isToday
                        ? 'bg-theme-primary/20 text-theme-primary hover:bg-theme-primary/30'
                        : 'bg-theme-light text-theme-text hover:bg-theme-primary/10'
                    }
                  `}
                >
                  <span className="hidden sm:inline">{day.label}</span>
                  <span className="sm:hidden">{day.short}</span>
                  {isToday && !isSelected && (
                    <span className="ml-1 w-2 h-2 bg-theme-primary rounded-full inline-block" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected day content */}
          <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] overflow-hidden max-w-2xl mx-auto">
            <div className="bg-theme-primary text-theme-text-on-primary px-6 py-4">
              <h3 className="heading-h3 font-bold text-center">
                {selectedDay?.label}
                {highlightToday && today === selectedDay?.key && (
                  <span className="ml-2 text-sm font-normal bg-white/20 px-2 py-1 rounded">{todayBadgeLabel}</span>
                )}
              </h3>
            </div>
            <div className="p-6 space-y-3 min-h-[300px]">
              {selectedDayEntries.length === 0 ? (
                <p className="text-center text-theme-text-light py-8">{noClassesLabel}</p>
              ) : (
                selectedDayEntries.map((entry, idx) => {
                  const color = getEntryColors(entry.color || CATEGORY_COLORS[entry.category || ''])
                  return (
                    <div
                      key={entry.id || idx}
                      className={`flex items-center gap-4 p-4 rounded-xl ${color.bg} border-l-4 ${color.border}`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-lg">{entry.startTime}</div>
                        {entry.endTime && (
                          <div className="text-xs text-theme-text-muted">- {entry.endTime}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-theme-text">{entry.title}</div>
                        <div className="flex items-center gap-3 text-sm text-theme-text-light mt-1">
                          {showDuration && entry.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {entry.duration} min
                            </span>
                          )}
                          {showTrainer && entry.trainer && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {entry.trainer}
                            </span>
                          )}
                          {showRoom && entry.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {entry.room}
                            </span>
                          )}
                        </div>
                      </div>
                      {entry.classSlug && (
                        <Link
                          href={`/clase/${entry.classSlug}`}
                          className="btn-primary py-2 px-4 text-sm flex-shrink-0"
                        >
                          {detailsButtonLabel}
                        </Link>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {ctaButton?.enabled && ctaButton.link && (
            <div className="text-center mt-10">
              <Link href={ctaButton.link} className="btn-primary inline-flex items-center gap-2">
                {ctaButton.label || 'Inscrie-te acum'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Default: table-week
  // Determine which days to show
  const daysToShow = selectedDayIndex !== null
    ? [DAYS_WITH_LABELS[selectedDayIndex]]
    : DAYS_WITH_LABELS

  return (
    <section className={`py-section ${bgClass}`}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && <h2 className="heading-h2 font-bold mb-4">{heading}</h2>}
            {subheading && <p className="text-theme-text-light max-w-2xl mx-auto">{subheading}</p>}
          </div>
        )}

        {showCategoryFilter && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-theme-primary text-theme-text-on-primary'
                  : 'bg-theme-light text-theme-text hover:bg-theme-primary/10'
              }`}
            >
              {allFilterLabel}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat || 'all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-theme-primary text-theme-text-on-primary'
                    : 'bg-theme-light text-theme-text hover:bg-theme-primary/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className={`w-full border-collapse ${selectedDayIndex === null ? 'min-w-[800px]' : 'max-w-md mx-auto'}`}>
            <thead>
              <tr>
                <th className="p-3 bg-theme-light text-left w-20">{timeHeaderLabel}</th>
                {daysToShow.map((day) => {
                  const dayIndex = DAYS_WITH_LABELS.findIndex(d => d.key === day.key)
                  const isSelected = selectedDayIndex === dayIndex
                  const isToday = highlightToday && today === day.key

                  return (
                    <th
                      key={day.key}
                      onClick={() => setSelectedDayIndex(isSelected ? null : dayIndex)}
                      className={`p-3 text-center cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-theme-primary text-theme-text-on-primary'
                          : isToday
                            ? 'bg-theme-primary/30 text-theme-primary hover:bg-theme-primary/40'
                            : 'bg-theme-light hover:bg-theme-primary/10'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {day.label}
                        {isToday && !isSelected && (
                          <span className="inline-block w-2 h-2 bg-theme-primary rounded-full" />
                        )}
                        {isSelected && (
                          <span className="text-xs opacity-75">(click pt toate)</span>
                        )}
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: endHour - startHour }, (_, i) => startHour + i).map((hour) => (
                <tr key={hour} className="border-b border-theme-border">
                  <td className="p-3 text-sm font-medium text-theme-text-light align-top">
                    {hour.toString().padStart(2, '0')}:00
                  </td>
                  {daysToShow.map((day) => {
                    const hourEntries = entriesByDay[day.key].filter((entry) => {
                      const entryHour = parseInt(entry.startTime.split(':')[0], 10)
                      return entryHour === hour
                    })
                    const dayIndex = DAYS_WITH_LABELS.findIndex(d => d.key === day.key)
                    const isSelected = selectedDayIndex === dayIndex

                    return (
                      <td
                        key={day.key}
                        className={`p-2 align-top min-h-[60px] transition-colors ${
                          isSelected ? 'bg-theme-primary/5' : ''
                        }`}
                      >
                        {hourEntries.map((entry, idx) => {
                          const color = getEntryColors(entry.color || CATEGORY_COLORS[entry.category || ''])
                          return (
                            <div
                              key={entry.id || idx}
                              className={`p-2 rounded mb-1 text-xs ${color.bg} border-l-2 ${color.border}`}
                            >
                              <div className="font-bold">{entry.startTime}</div>
                              <div className="font-medium">{entry.title}</div>
                              {showTrainer && entry.trainer && (
                                <div className="text-theme-text-light">{entry.trainer}</div>
                              )}
                              {showRoom && entry.room && (
                                <div className="text-theme-text-muted text-[10px]">{entry.room}</div>
                              )}
                            </div>
                          )
                        })}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ctaButton?.enabled && ctaButton.link && (
          <div className="text-center mt-10">
            <Link href={ctaButton.link} className="btn-primary inline-flex items-center gap-2">
              {ctaButton.label || 'Inscrie-te acum'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default ScheduleTableBlock
