# **App Name**: Feira Digital

## Core Features:

- Secure User Authentication: Comprehensive authentication flow for user registration, login (email/password and Google Sign-In), password recovery, email verification, and account management, securing protected seller routes.
- Seller Booth Management: Sellers can create, read, update, and delete their booth profile, including details like name, descriptions, images (cover/logo), categories, tags, and contact information. (Firestore interaction)
- Product Catalog Management: Sellers can perform full CRUD operations on their products, featuring multi-image uploads with previews, detailed descriptions, pricing (BRL), and active/inactive toggles. (Firestore interaction)
- AI-Powered Product Tagging: An AI tool that suggests relevant tags and categories for seller products based on descriptions and images to improve product discoverability within the marketplace.
- Marketplace Exploration & Search: Public users can browse and search for booths using paginated listings, filters (category, location, tags), and real-time search functionality on the Explore and Home pages. (Firestore interaction)
- Detailed Booth & Product Pages: Dedicated pages for individual booths showcasing full profiles, product listings with detail modals, seller contact options (WhatsApp), and a user rating system. (Firestore interaction)
- Booth Rating System: Authenticated users can rate booths from 1 to 5 stars (one rating per user per booth), with the system displaying average ratings and total ratings for each booth. (Firestore interaction)

## Style Guidelines:

- Primary Color: A warm, earthy burnt orange, `#A35529`, to anchor the 'craft fair' aesthetic, evoking authenticity and warmth.
- Background Color: A very light, subtle cream, `#F7F5F2`, providing a clean, warm canvas that supports content legibility.
- Accent Color: A soft, inviting salmon-pink, `#FF8E8E`, used sparingly for highlights, calls-to-action, or interactive elements, offering gentle contrast.
- Headline Font: 'Playfair Display' (serif) for a touch of elegance and artistic flair. Note: currently only Google Fonts are supported.
- Body Font: 'Work Sans' (sans-serif) for clear readability and a modern, approachable feel. Note: currently only Google Fonts are supported.
- Utilize minimalist line-art icons that complement the modern craft fair aesthetic, avoiding overly complex or heavily skeuomorphic designs.
- Mobile-first responsive design, rigorously tested at 375px and 1280px. Incorporates fluid typography via clamp() and consistent spacing with a 4px base unit. Implements skeleton loaders for all asynchronous data fetching and informative empty states with call-to-actions.
- Subtle, smooth UI transitions applied globally using a 180ms cubic-bezier(0.16, 1, 0.3, 1) timing function for a polished user experience.