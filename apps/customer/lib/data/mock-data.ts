export interface ProductOption {
  name: string;
  type: string;
  extraPrice: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  prepTime: number;
  available: boolean;
  featured: boolean;
  options?: ProductOption[];
  dietary?: string[];
  ingredients?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "c1111111-1111-4111-a111-111111111111",
    name: "Signature Jollof & Rice",
    description: "Authentic slow-cooked party Jollof and fried rice specialities.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c2222222-2222-4222-a222-222222222222",
    name: "Flame-Grilled Grills & Suya",
    description: "Spicy Kano-style beef suya, chicken wings, and grilled turkey.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c3333333-3333-4333-a333-333333333333",
    name: "Traditional Soups & Swallows",
    description: "Rich Egusi, Seafood Okro, and Edikang Ikong paired with pounded yam.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "c4444444-4444-4444-a444-444444444444",
    name: "Artisan Sides & Extras",
    description: "Fried plantains (Dodo), steamed Moi-Moi, and coleslaw.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "8a2f1c3e-1111-4111-a111-111111111111",
    categoryId: "c1111111-1111-4111-a111-111111111111",
    name: "Firewood Smoked Basmati Jollof & Goat Meat",
    description: "Long-grain Basmati rice simmered in roasted red pepper puree, infused with traditional smoky flavor and served with tender spiced goat meat.",
    price: 8500,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    prepTime: 25,
    available: true,
    featured: true,
    dietary: ["Chef's Special", "Spicy", "Gluten-Free"],
    ingredients: ["Long-grain Basmati Rice", "Tender Goat Meat", "Roasted Bell Peppers", "Scotch Bonnet", "Davini's Secret Yaji Spice"],
    options: [
      { name: "Standard Portion", type: "Size", extraPrice: 0 },
      { name: "Royal Large Feast", type: "Size", extraPrice: 3000 },
      { name: "Mild Spice", type: "Spice Level", extraPrice: 0 },
      { name: "Extra Spicy (Lagos Style)", type: "Spice Level", extraPrice: 0 },
    ],
  },
  {
    id: "8a2f1c3e-2222-4222-a222-222222222222",
    categoryId: "c2222222-2222-4222-a222-222222222222",
    name: "Kano Spiced Beef Suya Platter",
    description: "Prime beef strips marinated in authentic Yaji ground peanut spice, flame-grilled over charcoal and garnished with fresh red onions and tomatoes.",
    price: 6500,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    prepTime: 20,
    available: true,
    featured: true,
    dietary: ["High Protein", "Spicy", "Charcoal Grilled"],
    ingredients: ["Prime Beef Tenderloin", "Kano Ground Peanut Yaji", "Red Onions", "Vine-ripened Tomatoes", "Coriander"],
    options: [
      { name: "Regular Spice", type: "Spice Level", extraPrice: 0 },
      { name: "Fiery Hot", type: "Spice Level", extraPrice: 0 },
    ],
  },
  {
    id: "8a2f1c3e-3333-4333-a333-333333333333",
    categoryId: "c3333333-3333-4333-a333-333333333333",
    name: "Royal Fisherman's Seafood Okro",
    description: "Fresh diced okra simmered in rich palm broth loaded with jumbo prawns, calamari, croaker fish, and blue crab. Served with smooth Pounded Yam.",
    price: 12500,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    prepTime: 30,
    available: true,
    featured: true,
    dietary: ["Seafood Lover", "Traditional Heritage"],
    ingredients: ["Fresh Diced Okra", "Jumbo Prawns", "Blue Crab", "Croaker Fish Fillet", "Red Palm Broth", "Locust Beans (Iru)"],
    options: [
      { name: "With Pounded Yam", type: "Swallow Choice", extraPrice: 0 },
      { name: "With Eba (Garri)", type: "Swallow Choice", extraPrice: 0 },
      { name: "With Semovita", type: "Swallow Choice", extraPrice: 0 },
    ],
  },
  {
    id: "8a2f1c3e-4444-4444-a444-444444444444",
    categoryId: "c1111111-1111-4111-a111-111111111111",
    name: "Special Fried Rice & Grilled Chicken",
    description: "Stir-fried parboiled rice tossed with sweet corn, green peas, carrots, and diced liver. Accompanied by quarter grilled chicken.",
    price: 7800,
    image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=800&q=80",
    prepTime: 25,
    available: true,
    featured: false,
    dietary: ["Family Favorite"],
    ingredients: ["Parboiled Rice", "Quarter Grilled Chicken", "Sweet Corn", "Green Peas", "Carrots", "Sautéed Liver Cubes"],
    options: [
      { name: "Standard Portion", type: "Size", extraPrice: 0 },
      { name: "Extra Chicken Piece", type: "Size", extraPrice: 2500 },
    ],
  },
  {
    id: "8a2f1c3e-5555-4555-a555-555555555555",
    categoryId: "c4444444-4444-4444-a444-444444444444",
    name: "Golden Fried Plantain (Dodo)",
    description: "Sweet ripe yellow plantains sliced and deep-fried to caramelized perfection.",
    price: 2000,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    available: true,
    featured: false,
    dietary: ["Vegetarian", "Sweet & Savory"],
    ingredients: ["Ripe Yellow Plantains", "Vegetable Oil", "Sea Salt Accent"],
  },
  {
    id: "8a2f1c3e-6666-4666-a666-666666666666",
    categoryId: "c2222222-2222-4222-a222-222222222222",
    name: "Spicy Peppered Asun (Goat Meat)",
    description: "Bite-sized roasted goat meat tossed in vibrant habanero and scotch bonnet pepper reduction.",
    price: 7000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    prepTime: 20,
    available: true,
    featured: false,
    dietary: ["Very Spicy", "Keto Friendly"],
    ingredients: ["Roasted Goat Meat", "Habanero Pepper Puree", "Red Onions", "Scent Leaves"],
    options: [
      { name: "Medium Hot", type: "Spice Level", extraPrice: 0 },
      { name: "Extremely Spicy", type: "Spice Level", extraPrice: 0 },
    ],
  },
];

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev_1",
    customerName: "Chief Adebayo O.",
    rating: 5,
    comment: "The Firewood Basmati Jollof reminded me of royal Lagos weddings. Absolutely incredible aroma and tender goat meat!",
    date: "2 days ago",
  },
  {
    id: "rev_2",
    customerName: "Nneka E.",
    rating: 5,
    comment: "Express delivery was truly 20 minutes! The Kano Suya had the exact Yaji kick I have been craving all month.",
    date: "1 week ago",
  },
  {
    id: "rev_3",
    customerName: "Dr. Tunde M.",
    rating: 5,
    comment: "Impeccable packaging and table reservation service. Davini's is undeniably the gold standard for dining.",
    date: "2 weeks ago",
  },
];

