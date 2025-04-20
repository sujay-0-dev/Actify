"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected: Date | null;
  onSelect: (date: Date | null) => void;
  className?: string;
}

export function DatePicker({ selected, onSelect, className }: DatePickerProps): React.ReactElement {
  return React.createElement(
    Popover,
    {},
    React.createElement(
      PopoverTrigger,
      { asChild: true },
      React.createElement(
        Button,
        {
          variant: "outline",
          className: cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          ),
        },
        React.createElement(CalendarIcon, { className: "w-4 h-4 mr-2" }),
        selected
          ? format(selected, "PPP")
          : React.createElement("span", {}, "Pick a date")
      )
    ),
    React.createElement(
      PopoverContent,
      { className: "w-auto p-0", align: "start" },
      React.createElement(Calendar, {
        mode: "single",
        selected: selected as Date,
        onSelect: (date: Date | undefined) => {
          onSelect(date || null);
        },
        initialFocus: true,
      })
    )
  );
}