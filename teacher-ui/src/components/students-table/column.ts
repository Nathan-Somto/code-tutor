import type { StudentInfo } from '@/stores/students'
import { h } from 'vue'
import { createColumnHelper, type ColumnDef } from '@tanstack/vue-table'
import Actions from './actions.vue'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

export const columns: ColumnDef<StudentInfo>[] = [
  {
    accessorKey: 'profile_photo',
    header: () => h('div', { class: '' }, 'Profile Photo'),
    cell: ({ row }) => {
      return h('img', { class: 'size-10 rounded-full object-cover', src: row.getValue('profile_photo')  }, row.getValue('profile_photo'))
      }
  },
  {
    accessorKey: 'name',
    header: () => h('div', { class: '' }, 'Name'),
    cell: ({ row }) => {
      return h('div', { class: 'font-medium opacity-80' }, row.getValue('name'))
      },
      }, 
      {
        accessorKey: 'username',
    header: () => h('div', { class: '' }, 'Username'),
    cell: ({ row }) => {
      return h('div', { class: 'text-lg font-semibold' }, row.getValue('username'))
      },
      },
      {
        accessorKey: 'currentLevel',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Current Level', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase text-center font-bold' }, row.getValue('currentLevel')),
      },
      {
        accessorKey: 'xp',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Experience Points', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase text-center' }, row.getValue('xp')),
      },
      {
        accessorKey: 'totalCodeSubmissions',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Total Code Submissions', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'lowercase text-center' }, row.getValue('totalCodeSubmissions')),
      },
      {
          
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const student = row.original

      return h('div', { class: 'relative' }, h(Actions, {
        student,
      }))
    },
  },
  
]