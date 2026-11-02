import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export Location Data (Countries, States, Cities) so components can import directly from '@/lib/utils'
export {
  LOCATION_DATA,
  COUNTRIES,
  getCountries,
  getStatesByCountry,
  getCitiesByState,
  type LocationCountry,
  type LocationState,
} from './locationData';
