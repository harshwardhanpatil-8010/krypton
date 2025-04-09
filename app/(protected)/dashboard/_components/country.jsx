import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export function DropdownMenuCheckboxes() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Country</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        <DropdownMenuLabel>🇮🇳</DropdownMenuLabel>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
