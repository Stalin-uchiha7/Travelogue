import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const dummyProperties = [
  {
    name: "Luxury Beach Resort, Goa",
    location: "Goa, India",
    stars: 5,
    price: 8500,
    description: "Experience the ultimate beachfront luxury at our 5-star resort. Featuring infinity pools, world-class spa, and direct beach access. Perfect for couples and families seeking an unforgettable vacation.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Spa', 'Beach Access']
  },
  {
    name: "Heritage Palace Hotel, Rajasthan",
    location: "Jaipur, Rajasthan",
    stars: 5,
    price: 12000,
    description: "Step into royal grandeur at this meticulously restored heritage palace. Enjoy traditional Rajasthani architecture, courtyards, and authentic cultural experiences. A true taste of India's regal past.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Restaurant', 'Spa', 'Heritage']
  },
  {
    name: "Mountain View Retreat, Himachal",
    location: "Shimla, Himachal Pradesh",
    stars: 4,
    price: 5500,
    description: "Escape to the serene mountains with breathtaking views of the Himalayas. Cozy cottages, trekking trails, and cool mountain air await you. Ideal for nature lovers and adventure enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Trekking']
  },
  {
    name: "Backwater Paradise, Kerala",
    location: "Alleppey, Kerala",
    stars: 4,
    price: 6500,
    description: "Discover the tranquil backwaters of Kerala aboard a traditional houseboat. Float through serene canals, witness local life, and enjoy authentic Kerala cuisine. A unique and peaceful experience.",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Breakfast', 'Dinner', 'Houseboat', 'Backwater View']
  },
  {
    name: "Desert Camp Experience, Jaisalmer",
    location: "Jaisalmer, Rajasthan",
    stars: 3,
    price: 4500,
    description: "Sleep under the stars in the Thar Desert. Traditional tents, camel rides, folk music, and bonfire dinners. Experience the magic of the desert with authentic Rajasthani hospitality.",
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['Parking', 'Breakfast', 'Dinner', 'Camel Ride', 'Cultural Show']
  },
  {
    name: "Taj View Hotel, Agra",
    location: "Agra, Uttar Pradesh",
    stars: 4,
    price: 7200,
    description: "Wake up to stunning views of the Taj Mahal from your room. Modern amenities combined with perfect location. Just a short walk from one of the world's most iconic monuments.",
    images: [
      "https://images.unsplash.com/photo-1527842891421-42eec6e703ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Taj View', 'Restaurant']
  },
  {
    name: "Beachside Villa, Gokarna",
    location: "Gokarna, Karnataka",
    stars: 3,
    price: 3500,
    description: "Affordable beachfront accommodation with laid-back vibes. Perfect for backpackers and budget travelers. Beautiful beaches, surfing, and relaxed atmosphere in this coastal gem.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Beach Access', 'Surfing']
  },
  {
    name: "Wildlife Safari Lodge, Ranthambore",
    location: "Ranthambore, Rajasthan",
    stars: 4,
    price: 9800,
    description: "Stay in the heart of tiger country. Luxury jungle lodge with expert guides for wildlife safaris. Spot tigers, leopards, and diverse birdlife in Ranthambore National Park.",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Safari Guide', 'Wildlife Viewing']
  },
  {
    name: "Lakeside Resort, Udaipur",
    location: "Udaipur, Rajasthan",
    stars: 5,
    price: 11000,
    description: "Romantic lakeside resort with stunning views of Lake Pichola and City Palace. Boat rides, rooftop dining, and traditional Rajasthani hospitality. Perfect for honeymooners and couples.",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Lakeside View', 'Restaurant']
  },
  {
    name: "Hill Station Resort, Ooty",
    location: "Ooty, Tamil Nadu",
    stars: 4,
    price: 6200,
    description: "Quaint hill station retreat surrounded by tea plantations and eucalyptus trees. Cool climate, botanical gardens nearby, and charming colonial architecture. Ideal for a peaceful getaway.",
    images: [
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Tea Garden View']
  },
  {
    name: "Golden Temple Stay, Amritsar",
    location: "Amritsar, Punjab",
    stars: 3,
    price: 3800,
    description: "Budget-friendly accommodation near the Golden Temple. Experience the spiritual ambiance, langar community meals, and Sikh hospitality. Close to historic sites and local markets.",
    images: [
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast']
  },
  {
    name: "Spice Plantation Homestay, Coorg",
    location: "Coorg, Karnataka",
    stars: 4,
    price: 5800,
    description: "Authentic homestay experience on a working spice plantation. Coffee picking, traditional Kodava cuisine, and scenic waterfalls. Immerse yourself in local culture and nature.",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Plantation Tour', 'Traditional Cuisine']
  },
  {
    name: "Pilgrimage Hotel, Varanasi",
    location: "Varanasi, Uttar Pradesh",
    stars: 3,
    price: 4200,
    description: "Traditional hotel near the sacred Ganges River. Witness morning aarti ceremonies, boat rides at sunrise, and ancient temples. Experience the spiritual heart of India.",
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Ganges View']
  },
  {
    name: "Adventure Base Camp, Manali",
    location: "Manali, Himachal Pradesh",
    stars: 3,
    price: 4800,
    description: "Adventure hub for thrill seekers. Paragliding, river rafting, skiing, and trekking expeditions. Cozy log cabins with mountain views and bonfire evenings under the stars.",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Adventure Activities']
  },
  {
    name: "Heritage Haveli, Jodhpur",
    location: "Jodhpur, Rajasthan",
    stars: 4,
    price: 6800,
    description: "Restored 18th-century haveli in the Blue City. Rooftop views of Mehrangarh Fort, traditional courtyards, and royal treatment. Discover the royal history of Jodhpur.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Heritage', 'Rooftop View']
  },
  {
    name: "Eco-Friendly Resort, Munnar",
    location: "Munnar, Kerala",
    stars: 4,
    price: 7200,
    description: "Sustainable resort amidst tea gardens and rolling hills. Organic dining, nature walks, and eco-friendly practices. Breathtaking views and peaceful atmosphere for nature lovers.",
    images: [
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Tea Garden View', 'Eco-Friendly']
  },
  {
    name: "Beach Resort, Pondicherry",
    location: "Pondicherry, Tamil Nadu",
    stars: 4,
    price: 7500,
    description: "French colonial charm meets Indian beaches. Heritage architecture, French Quarter walks, pristine beaches, and international cuisine. A unique cultural fusion experience.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Beach Access', 'Heritage']
  },
  {
    name: "Buddhist Monastery Stay, Darjeeling",
    location: "Darjeeling, West Bengal",
    stars: 3,
    price: 5200,
    description: "Peaceful monastery guesthouse with views of Kanchenjunga. Morning prayers, tea garden tours, and toy train rides. Spiritual retreat in the Eastern Himalayas.",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Spiritual']
  },
  {
    name: "Luxury Safari Camp, Jim Corbett",
    location: "Jim Corbett, Uttarakhand",
    stars: 5,
    price: 12500,
    description: "Premium jungle safari experience with luxury tented accommodation. Expert naturalists, jeep safaris, and wildlife photography. Spot elephants, tigers, and diverse fauna.",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Safari Guide', 'Luxury Tents', 'Wildlife Viewing']
  },
  {
    name: "Bamboo Forest Resort, Wayanad",
    location: "Wayanad, Kerala",
    stars: 4,
    price: 6800,
    description: "Nestled in lush bamboo forests, this eco-resort offers a serene escape. Organic farming tours, spice plantation visits, and traditional Kerala architecture. Perfect for nature enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Forest View', 'Spice Plantation', 'Eco-Friendly']
  },
  {
    name: "Riverside Cottages, Rishikesh",
    location: "Rishikesh, Uttarakhand",
    stars: 3,
    price: 4200,
    description: "Peaceful riverside cottages overlooking the Ganges. Yoga and meditation classes, white water rafting, and spiritual experiences. The yoga capital of the world awaits you.",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Riverside View', 'Yoga Classes', 'Rafting']
  },
  {
    name: "Hilltop Palace, Mount Abu",
    location: "Mount Abu, Rajasthan",
    stars: 4,
    price: 7800,
    description: "The only hill station in Rajasthan, offering cool climate and stunning views. Dilwara temples nearby, Nakki Lake boat rides, and scenic sunset points. A royal mountain retreat.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Lake Access', 'Temple Tours']
  },
  {
    name: "Desert Luxury Camp, Pushkar",
    location: "Pushkar, Rajasthan",
    stars: 4,
    price: 5500,
    description: "Luxury tents in the desert with traditional Rajasthani hospitality. Pushkar Camel Fair experience, sacred lake visits, and folk music evenings. Cultural immersion at its finest.",
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Dinner', 'Cultural Show', 'Desert Safari']
  },
  {
    name: "Beachfront Bungalows, Puri",
    location: "Puri, Odisha",
    stars: 3,
    price: 4500,
    description: "Traditional bungalows steps away from the famous Puri Beach. Visit the Jagannath Temple, enjoy local seafood, and witness stunning sunrises over the Bay of Bengal.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Temple Proximity', 'Seafood']
  },
  {
    name: "Tea Estate Bungalow, Darjeeling",
    location: "Darjeeling, West Bengal",
    stars: 4,
    price: 7200,
    description: "Heritage colonial bungalow in a working tea estate. Morning tea tasting sessions, toy train rides, and views of Kanchenjunga. Experience the charm of British-era hill stations.",
    images: [
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Tea Estate View', 'Mountain View', 'Heritage']
  },
  {
    name: "Island Resort, Andaman",
    location: "Havelock Island, Andaman",
    stars: 4,
    price: 9800,
    description: "Tropical island resort with pristine beaches and crystal-clear waters. Scuba diving, snorkeling, and water sports. Radhanagar Beach, one of Asia's best beaches, is nearby.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Diving', 'Water Sports']
  },
  {
    name: "Floating Cottages, Kumarakom",
    location: "Kumarakom, Kerala",
    stars: 4,
    price: 8500,
    description: "Unique floating cottages on Vembanad Lake. Bird watching in Kumarakom Bird Sanctuary, traditional Kerala meals, and serene backwater views. A peaceful waterworld experience.",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Lake View', 'Bird Watching', 'Houseboat']
  },
  {
    name: "Heritage Fort Hotel, Jaisalmer",
    location: "Jaisalmer, Rajasthan",
    stars: 5,
    price: 11500,
    description: "Luxury hotel within the ancient Jaisalmer Fort. UNESCO World Heritage site location, royal suites, and rooftop views of the Golden City. Live like royalty in this historic fortress.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Fort View', 'Heritage', 'Rooftop Restaurant']
  },
  {
    name: "Mountain Lodge, Gulmarg",
    location: "Gulmarg, Jammu & Kashmir",
    stars: 4,
    price: 9200,
    description: "Alpine lodge in the heart of Gulmarg's ski paradise. Winter skiing, summer gondola rides, and stunning views of snow-capped peaks. Kashmir's crown jewel destination.",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Skiing', 'Gondola Access']
  },
  {
    name: "Spiritual Retreat, Haridwar",
    location: "Haridwar, Uttarakhand",
    stars: 3,
    price: 3800,
    description: "Budget-friendly accommodation near Har Ki Pauri. Witness the sacred Ganga Aarti ceremony, visit ancient temples, and experience the spiritual energy of this holy city.",
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Ganges View', 'Temple Proximity', 'Spiritual']
  },
  {
    name: "Beach Huts, Tarkarli",
    location: "Tarkarli, Maharashtra",
    stars: 3,
    price: 4800,
    description: "Rustic beach huts on the pristine Tarkarli Beach. Dolphin watching, water sports, and fresh Malvani seafood. A hidden gem on Maharashtra's Konkan coast.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Dolphin Watching', 'Water Sports']
  },
  {
    name: "Luxury Palace, Mysore",
    location: "Mysore, Karnataka",
    stars: 5,
    price: 10500,
    description: "Royal palace hotel reflecting Mysore's regal heritage. Near the magnificent Mysore Palace, Dasara celebrations, and silk shopping. Experience South Indian royalty.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Heritage', 'Palace View']
  },
  {
    name: "Valley View Resort, Kodaikanal",
    location: "Kodaikanal, Tamil Nadu",
    stars: 4,
    price: 6900,
    description: "Picturesque resort overlooking the valleys of Kodaikanal. Coaker's Walk, Bear Shola Falls, and star-gazing opportunities. The Princess of Hill Stations offers cool mountain air.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Valley View', 'Mountain View', 'Nature Walks']
  },
  {
    name: "Jungle Treehouse, Kabini",
    location: "Kabini, Karnataka",
    stars: 4,
    price: 11200,
    description: "Unique treehouse accommodation in Kabini's wildlife reserve. Elephant sightings, boat safaris on Kabini River, and immersive jungle experience. Perfect for wildlife lovers.",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Jungle View', 'Safari', 'Wildlife Viewing']
  },
  {
    name: "Cave Resort, Ajanta Ellora",
    location: "Aurangabad, Maharashtra",
    stars: 3,
    price: 5200,
    description: "Comfortable stay near the UNESCO World Heritage caves of Ajanta and Ellora. Explore ancient Buddhist, Hindu, and Jain cave temples dating back 2000 years.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Heritage Tours', 'Historical Sites']
  },
  {
    name: "Coastal Villa, Gokarna",
    location: "Gokarna, Karnataka",
    stars: 4,
    price: 6500,
    description: "Modern coastal villa near Om Beach. Surfing, beach yoga, and laid-back hippie vibes. One of India's best beach destinations for relaxation and adventure.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Surfing', 'Yoga']
  },
  {
    name: "Royal Haveli, Bikaner",
    location: "Bikaner, Rajasthan",
    stars: 4,
    price: 7500,
    description: "Restored 19th-century haveli in the desert city of Bikaner. Junagarh Fort tours, camel festival experiences, and authentic Rajasthani cuisine. Discover the less-traveled Rajasthan.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Heritage', 'Cultural Tours', 'Traditional Cuisine']
  },
  {
    name: "Misty Mountain Lodge, Mussoorie",
    location: "Mussoorie, Uttarakhand",
    stars: 4,
    price: 7100,
    description: "Charming lodge in the Queen of Hills. Mall Road shopping, Gun Hill sunset views, and cool mountain climate. Perfect escape from the plains with colonial charm.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Heritage', 'Nature Trails']
  },
  {
    name: "Beach Resort, Diu",
    location: "Diu, Daman & Diu",
    stars: 3,
    price: 5500,
    description: "Seaside resort in the peaceful union territory of Diu. Portuguese heritage architecture, clean beaches, and laid-back atmosphere. A hidden coastal paradise.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Heritage', 'Water Sports']
  },
  {
    name: "Sunrise Point Resort, Kanyakumari",
    location: "Kanyakumari, Tamil Nadu",
    stars: 4,
    price: 5800,
    description: "Watch the spectacular sunrise and sunset from India's southernmost tip. Ocean views, Vivekananda Rock Memorial nearby, and the confluence of three seas.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Ocean View', 'Sunrise Point', 'Temple Proximity']
  },
  {
    name: "Heritage Fort Resort, Chittorgarh",
    location: "Chittorgarh, Rajasthan",
    stars: 4,
    price: 7200,
    description: "Stay near the magnificent Chittorgarh Fort, the largest fort in India. Witness Rajput valor, ancient palaces, and stunning architecture. A history lover's paradise.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Fort View', 'Heritage', 'Historical Tours']
  },
  {
    name: "Riverfront Resort, Haridwar",
    location: "Haridwar, Uttarakhand",
    stars: 4,
    price: 6500,
    description: "Luxury resort on the banks of the Ganges. Witness the daily Ganga Aarti, enjoy river rafting, and experience the spiritual energy of this holy city.",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Ganges View', 'Spiritual']
  },
  {
    name: "Valley Cottages, Kasol",
    location: "Kasol, Himachal Pradesh",
    stars: 3,
    price: 3800,
    description: "Rustic cottages in the Parvati Valley, known as 'Mini Israel of India'. Trekking to Kheerganga, Israeli cuisine, and backpacker-friendly atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Trekking', 'Budget-Friendly']
  },
  {
    name: "Palace Suite, Bhopal",
    location: "Bhopal, Madhya Pradesh",
    stars: 5,
    price: 9500,
    description: "Luxury hotel in the City of Lakes. Close to Upper and Lower Lakes, ancient mosques, and the State Museum. Experience royal Nawabi hospitality.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Heritage', 'Lake View']
  },
  {
    name: "Desert Oasis, Bikaner",
    location: "Bikaner, Rajasthan",
    stars: 4,
    price: 6800,
    description: "Luxury desert resort featuring camel safaris, sand dunes, and traditional Rajasthani architecture. Visit the famous Junagarh Fort and camel research center.",
    images: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Desert Safari', 'Cultural Show', 'Heritage']
  },
  {
    name: "Backpacker Hostel, Hampi",
    location: "Hampi, Karnataka",
    stars: 2,
    price: 1200,
    description: "Budget-friendly hostel near the UNESCO World Heritage site. Explore ancient Vijayanagara ruins, boulder climbing, and meet fellow travelers. Perfect for backpackers.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Dormitory', 'Heritage Tours', 'Budget-Friendly', 'Boulder Climbing']
  },
  {
    name: "Mountain Paradise, Nainital",
    location: "Nainital, Uttarakhand",
    stars: 4,
    price: 6200,
    description: "Charming hill station resort overlooking Naini Lake. Boat rides, scenic viewpoints, and shopping on Mall Road. The Lake District of India offers cool mountain air.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Lake View', 'Mountain View', 'Boat Rides']
  },
  {
    name: "Coastal Paradise, Alibaug",
    location: "Alibaug, Maharashtra",
    stars: 4,
    price: 6800,
    description: "Beach resort near Mumbai offering a quick escape. Clean beaches, water sports, and historic forts. Popular weekend destination for Mumbaikars.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Water Sports', 'Fort Tours']
  },
  {
    name: "Spiritual Ashram, Rishikesh",
    location: "Rishikesh, Uttarakhand",
    stars: 3,
    price: 2800,
    description: "Authentic ashram experience on the banks of Ganges. Daily yoga and meditation sessions, satsang, and simple vegetarian meals. Transformative spiritual retreat.",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Yoga Classes', 'Meditation', 'Vegetarian Meals', 'Spiritual', 'Riverside View']
  },
  {
    name: "Tea Estate Lodge, Darjeeling",
    location: "Darjeeling, West Bengal",
    stars: 4,
    price: 7800,
    description: "Colonial-era bungalow in a premium tea estate. Morning tea plucking experience, stunning views of Kanchenjunga, and world-famous Darjeeling tea tasting.",
    images: [
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Tea Estate View', 'Mountain View', 'Heritage']
  },
  {
    name: "Island Beach Resort, Lakshadweep",
    location: "Agatti Island, Lakshadweep",
    stars: 4,
    price: 15000,
    description: "Exotic island resort in India's pristine coral atolls. Crystal-clear lagoons, coral reef snorkeling, and untouched beaches. Paradise for water sports enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Snorkeling', 'Water Sports']
  },
  {
    name: "Palace Heritage Hotel, Udaipur",
    location: "Udaipur, Rajasthan",
    stars: 5,
    price: 13500,
    description: "Ultra-luxury palace hotel with royal suites overlooking Lake Pichola. Fine dining, spa, and butler service. Experience the grandeur of Mewar dynasty.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Spa', 'Butler Service', 'Heritage', 'Lakeside View']
  },
  {
    name: "Adventure Camp, Bir Billing",
    location: "Bir, Himachal Pradesh",
    stars: 3,
    price: 4200,
    description: "Paragliding capital of India! Stay in cozy camps with mountain views. Experience world-class paragliding, meditation retreats, and Tibetan culture.",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Paragliding', 'Mountain View', 'Meditation']
  },
  {
    name: "Beachfront Villa, Kovalam",
    location: "Kovalam, Kerala",
    stars: 4,
    price: 7200,
    description: "Lighthouse Beach resort with stunning cliff views. Ayurveda spa, fresh seafood, and golden sand beaches. Popular beach destination in South India.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Ayurveda Spa', 'Lighthouse View']
  },
  {
    name: "Forest Lodge, Bandhavgarh",
    location: "Bandhavgarh, Madhya Pradesh",
    stars: 4,
    price: 10800,
    description: "Wildlife lodge near Bandhavgarh Tiger Reserve. Highest tiger density in India, jungle safaris, and nature walks. Tiger spotting guaranteed!",
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Safari Guide', 'Wildlife Viewing', 'Jungle Lodge']
  },
  {
    name: "Hill Station Villa, Mahabaleshwar",
    location: "Mahabaleshwar, Maharashtra",
    stars: 4,
    price: 6500,
    description: "Scenic hill station resort famous for strawberries and viewpoints. Cool climate, strawberry picking, and panoramic valley views. Perfect weekend getaway.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Strawberry Farm', 'Viewpoints']
  },
  {
    name: "Desert Palace, Jodhpur",
    location: "Jodhpur, Rajasthan",
    stars: 5,
    price: 11800,
    description: "Luxury heritage palace with views of Mehrangarh Fort. Royal treatment, traditional Rajasthani cuisine, and architectural marvels. Experience Blue City's grandeur.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Pool', 'Parking', 'Breakfast', 'Heritage', 'Fort View', 'Royal Suite']
  },
  {
    name: "Beach Huts, Digha",
    location: "Digha, West Bengal",
    stars: 3,
    price: 3800,
    description: "Budget beach resort on the Bay of Bengal. Long stretches of sandy beaches, fresh seafood, and relaxed atmosphere. Popular weekend destination from Kolkata.",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Beach Access', 'Seafood', 'Budget-Friendly']
  },
  {
    name: "Mountain Retreat, Lansdowne",
    location: "Lansdowne, Uttarakhand",
    stars: 3,
    price: 4500,
    description: "Peaceful hill station with British-era architecture. Nature walks, bird watching, and tranquility. Undiscovered gem in Garhwal Himalayas.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ['WiFi', 'Parking', 'Breakfast', 'Mountain View', 'Nature Walks', 'Bird Watching']
  }
];

export const addDummyProperties = async () => {
  try {
    // Get existing properties to check for duplicates
    const existingPropertiesSnapshot = await getDocs(collection(db, 'properties'));
    const existingNames = new Set(
      existingPropertiesSnapshot.docs.map(doc => doc.data().name)
    );
    
    const results = [];
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const property of dummyProperties) {
      // Skip if property with same name already exists
      if (existingNames.has(property.name)) {
        console.log(`Skipped existing property: ${property.name}`);
        skippedCount++;
        continue;
      }
      
      const docRef = await addDoc(collection(db, 'properties'), {
        ...property,
        createdAt: serverTimestamp()
      });
      results.push({ id: docRef.id, ...property });
      console.log(`Added property: ${property.name}`);
      addedCount++;
    }
    
    console.log(`Successfully added ${addedCount} new properties! Skipped ${skippedCount} existing ones.`);
    return results;
  } catch (error) {
    console.error('Error adding dummy properties:', error);
    throw error;
  }
};

