"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

export interface SearchableSelectOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  trigger?: React.ReactNode; // custom trigger (icon etc.)
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  trigger,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            role="combobox"
            className="flex items-center justify-between w-full border px-3 py-2 rounded-md text-sm"
          >
            {selected ? selected.label : placeholder}
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-62.5 p-0" onClick={(e)=>e.stopPropagation()}>

        <Command>
          <CommandInput placeholder={searchPlaceholder} />

          <CommandEmpty>{emptyText}</CommandEmpty>

          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                onClick={(e)=>e.stopPropagation()}
              >
                {option.label}
                <Check
                  className={cn(
                    "ml-auto size-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}