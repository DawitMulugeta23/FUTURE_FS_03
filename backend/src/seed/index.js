// Update seed/index.js to include services
const Service = require("../models/Service.model");

// Add to seedData function after menu items seeding
console.log("🌱 Seeding services...");
const services = [
  {
    name: "Private Event Hosting",
    description:
      "Host your private events, parties, and gatherings in our beautiful cafe space. Includes decor, catering, and dedicated staff.",
    price: 5000,
    duration: 180,
    category: "event",
    isPopular: true,
    includes: [
      "Venue rental",
      "Decor setup",
      "Dedicated staff",
      "Custom menu options",
    ],
    maxCapacity: 50,
    bookingRequired: true,
  },
  {
    name: "Catering Service",
    description:
      "Professional catering for corporate events, weddings, and special occasions. Our team brings the Yesekela experience to your venue.",
    price: 2500,
    duration: 240,
    category: "catering",
    isPopular: true,
    includes: [
      "Food preparation",
      "Professional staff",
      "Equipment setup",
      "Cleanup service",
    ],
    maxCapacity: 200,
    bookingRequired: true,
  },
  {
    name: "Coffee Tasting Workshop",
    description:
      "Learn about Ethiopian coffee culture, brewing methods, and taste different coffee varieties in this interactive workshop.",
    price: 350,
    duration: 90,
    category: "special",
    isPopular: true,
    includes: [
      "Coffee tasting",
      "Brewing demonstration",
      "Take-home coffee beans",
      "Certificate of participation",
    ],
    maxCapacity: 15,
    bookingRequired: true,
  },
  {
    name: "Traditional Coffee Ceremony",
    description:
      "Experience the authentic Ethiopian coffee ceremony with traditional popcorn, incense, and freshly roasted coffee.",
    price: 450,
    duration: 60,
    category: "beverage",
    isPopular: true,
    includes: [
      "Traditional coffee",
      "Fresh popcorn",
      "Incense",
      "Cultural explanation",
    ],
    maxCapacity: 10,
    bookingRequired: true,
  },
  {
    name: "Birthday Package",
    description:
      "Celebrate your birthday with a special package including cake, decorations, and a personalized experience.",
    price: 1200,
    duration: 120,
    category: "special",
    isPopular: true,
    includes: [
      "Birthday cake",
      "Decorations",
      "Birthday song",
      "Personalized service",
    ],
    maxCapacity: 20,
    bookingRequired: true,
  },
  {
    name: "Corporate Meeting Package",
    description:
      "Professional meeting space with catering, AV equipment, and refreshments for your business meetings.",
    price: 3000,
    duration: 240,
    category: "event",
    includes: ["Meeting room", "AV equipment", "Refreshments", "Lunch option"],
    maxCapacity: 25,
    bookingRequired: true,
  },
];

await Service.insertMany(services);
console.log(`✅ Created ${services.length} services`);
