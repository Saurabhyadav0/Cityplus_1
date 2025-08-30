"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DepartmentDropdownProps {
  value: string | null
  onValueChange: (value: string) => void
  disabled?: boolean
}

const departments = [
  { value: "roads", label: "Roads & Infrastructure" },
  { value: "sanitation", label: "Sanitation" },
  { value: "lighting", label: "Public Lighting" },
  { value: "water", label: "Water & Utilities" },
  { value: "parks", label: "Parks & Recreation" },
  { value: "other", label: "Other" },
]

export function DepartmentDropdown({ value, onValueChange, disabled = false }: DepartmentDropdownProps) {
  return (
    <Select value={value || "unassigned"} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Assign department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {departments.map((dept) => (
          <SelectItem key={dept.value} value={dept.value}>
            {dept.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
