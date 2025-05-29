import { createSupabaseBrowserClient } from "./supabase";
import { type Service } from "../components/ServiceGrid"; // Import the Service type

export async function fetchServices(): Promise<Service[] | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("services")
    .select("*"); // Select all columns for now

  if (error) {
    console.error("Error fetching services:", error);
    return null;
  }

  // Need to map the data from Supabase schema to the Service type if necessary
  // For now, assuming the column names match the Service interface
  // You might need to adjust this mapping depending on exact column names and types
  return data as Service[];
}

// Define a type for categories based on your database schema
export interface Category {
  id: string;
  name: string;
  icon: string | null; // Assuming icon can be null based on your SQL insert
  description: string | null; // Assuming description can be null
}

export async function fetchCategories(): Promise<Category[] | null> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name"); // Fetch only id and name for the filter

  if (error) {
    console.error("Error fetching categories:", error);
    return null;
  }

  return data as Category[];
} 