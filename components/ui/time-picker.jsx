"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { format, parse, set } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TimePicker({ selected, onSelect, className }) {
  const [selectedTime, setSelectedTime] = React.useState({
    hours: selected ? format(selected, "HH") : "12",
    minutes: selected ? format(selected, "mm") : "00",
  })

  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, "0")
  )

  const minutes = ["00", "15", "30", "45"]

  React.useEffect(() => {
    if (selected) {
      setSelectedTime({
        hours: format(selected, "HH"),
        minutes: format(selected, "mm"),
      })
    }
  }, [selected])

  const handleTimeChange = (type, value) => {
    const newTime = { ...selectedTime, [type]: value }
    setSelectedTime(newTime)
    
    const timeString = `${newTime.hours}:${newTime.minutes}`
    const parsedTime = parse(timeString, "HH:mm", new Date())
    
    if (selected) {
      // Keep the same date but change the time
      const newDateTime = set(selected, {
        hours: parseInt(newTime.hours),
        minutes: parseInt(newTime.minutes),
        seconds: 0
      })
      onSelect(newDateTime)
    } else {
      onSelect(parsedTime)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <Clock className="w-4 h-4 mr-2" />
          {selected ? format(selected, "h:mm a") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center space-x-2">
          <Select
            value={selectedTime.hours}
            onValueChange={(value) => handleTimeChange("hours", value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Hours" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-lg">:</span>
          <Select
            value={selectedTime.minutes}
            onValueChange={(value) => handleTimeChange("minutes", value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}