'use client'

import { useState } from 'react'
import {
  FaUtensils,
  FaCar,
  FaHome,
  FaHeartbeat,
  FaGamepad,
  FaGraduationCap,
  FaShoppingBag,
  FaPlane,
  FaGift,
  FaDumbbell,
  FaMusic,
  FaFilm,
  FaCoffee,
  FaGasPump,
  FaWifi,
  FaCreditCard,
  FaHospital,
  FaBriefcase,
  FaBaby,
  FaDog,
  FaBook,
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
} from 'react-icons/fa'
import { cn } from '@/lib/utils'

const icons = [
  { name: 'utensils', component: FaUtensils, label: 'Alimentação' },
  { name: 'car', component: FaCar, label: 'Transporte' },
  { name: 'home', component: FaHome, label: 'Casa' },
  { name: 'heartbeat', component: FaHeartbeat, label: 'Saúde' },
  { name: 'gamepad', component: FaGamepad, label: 'Lazer' },
  { name: 'graduation-cap', component: FaGraduationCap, label: 'Educação' },
  { name: 'shopping-bag', component: FaShoppingBag, label: 'Compras' },
  { name: 'plane', component: FaPlane, label: 'Viagem' },
  { name: 'gift', component: FaGift, label: 'Presente' },
  { name: 'dumbbell', component: FaDumbbell, label: 'Esporte' },
  { name: 'music', component: FaMusic, label: 'Música' },
  { name: 'film', component: FaFilm, label: 'Entretenimento' },
  { name: 'coffee', component: FaCoffee, label: 'Café' },
  { name: 'gas-pump', component: FaGasPump, label: 'Combustível' },
  { name: 'wifi', component: FaWifi, label: 'Internet' },
  { name: 'credit-card', component: FaCreditCard, label: 'Pagamento' },
  { name: 'hospital', component: FaHospital, label: 'Hospital' },
  { name: 'briefcase', component: FaBriefcase, label: 'Trabalho' },
  { name: 'baby', component: FaBaby, label: 'Bebê' },
  { name: 'dog', component: FaDog, label: 'Pet' },
  { name: 'book', component: FaBook, label: 'Livro' },
  { name: 'laptop', component: FaLaptop, label: 'Tecnologia' },
  { name: 'mobile-alt', component: FaMobileAlt, label: 'Celular' },
  { name: 'tshirt', component: FaTshirt, label: 'Roupas' },
]

interface IconPickerProps {
  selectedIcon?: string
  onSelect: (iconName: string) => void
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-2 rounded-lg border border-gray-300 p-4 dark:border-gray-700">
      {icons.map((icon) => {
        const IconComponent = icon.component
        const isSelected = selectedIcon === icon.name

        return (
          <button
            key={icon.name}
            type="button"
            onClick={() => onSelect(icon.name)}
            className={cn(
              'flex aspect-square items-center justify-center rounded-lg border-2 transition-all',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-base',
              isSelected
                ? 'border-brand-base bg-brand-base/10 dark:border-green-500 dark:bg-green-500/20'
                : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
              'dark:hover:bg-gray-700'
            )}
            aria-label={icon.label}
            title={icon.label}
          >
            <IconComponent
              className={cn(
                'h-5 w-5',
                isSelected
                  ? 'text-brand-base dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

