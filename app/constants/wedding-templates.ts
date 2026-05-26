// constants/wedding-templates.ts

export interface WeddingTemplate {
  id: string;
  name: string;
  category: "Basic" | "Standard" | "Premium";
  price: number;
  theme: string;
  placeholderBg: string;
  isPopular: boolean;
  // 🎯 BAGONG DETAILS PARA SA DESIGN SYSTEM NG TEMPLATE
  design?: {
    bgImage: string;
    fontHeading: string;
    fontBody: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export const weddingTemplates: WeddingTemplate[] = [
  {
    id: "tpl-001",
    name: "Minimalist Elegance",
    category: "Basic",
    price: 350,
    theme: "Clean, White, Slate",
    placeholderBg: "bg-gradient-to-br from-slate-100 to-slate-200",
    isPopular: false,
    // 🎯 IDINAGDAG ANG STYLE AT THEME PARA SA TPL-001
    design: {
      bgImage: "https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=800&auto=format&fit=crop", 
      fontHeading: "font-serif",      // Elegant serif for headers
      fontBody: "font-sans",          // Clean sans-serif for readable body text
      primaryColor: "text-slate-900", // Almost black/dark slate for main emphasis
      secondaryColor: "text-slate-500", // Soft slate gray for dates/locations
      accentColor: "border-slate-300" // Light slate for fine lines/dividers
    }
  },
  {
    id: "tpl-002",
    name: "Classic Floral",
    category: "Standard",
    price: 400,
    theme: "Rose, Pastel, Greenery",
    placeholderBg: "bg-gradient-to-br from-rose-100 to-pink-50",
    isPopular: true
  },
  {
    id: "tpl-003",
    name: "Rustic Charm",
    category: "Standard",
    price: 400,
    theme: "Wood, Amber, Vintage",
    placeholderBg: "bg-gradient-to-br from-amber-100 to-orange-50",
    isPopular: false
  },
  {
    id: "tpl-004",
    name: "Modern Monochrome",
    category: "Premium",
    price: 450,
    theme: "Black, White, Gold Accent",
    placeholderBg: "bg-gradient-to-br from-gray-200 to-gray-300",
    isPopular: false
  },
  {
    id: "tpl-005",
    name: "Pastel Dream",
    category: "Basic",
    price: 350,
    theme: "Lilac, Baby Blue, Soft",
    placeholderBg: "bg-gradient-to-br from-indigo-50 to-blue-100",
    isPopular: false
  },
  {
    id: "tpl-006",
    name: "Royal Gold Majesty",
    category: "Premium",
    price: 500,
    theme: "Gold, Emerald, Luxury",
    placeholderBg: "bg-gradient-to-br from-emerald-100 to-teal-50",
    isPopular: true
  }
];