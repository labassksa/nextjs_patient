// API Product interface based on the response structure
interface APIProduct {
  id: number;
  arabicProductName: string;
  englishProductName: string;
  barcode: string;
  price: string;
  arabicBrand: string;
  englishBrand: string;
  productImagesUrls: string[];
  isImported: boolean;
  supplier: string;
  createdAt: string;
  lastUpdatedAt: string;
}

// Local Product interface for the app
export interface Product {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  barcode: string;
  totalWithTax: number;
  expiryDate: string;
  minQuantity: number;
  brand: string;
  brandAr: string;
  isImported: boolean;
  supplier: string;
}

const API_BASE_URL = 'https://api.labass.sa/api_marketplace';

// Fetch products from the API
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Get token from localStorage (same pattern as other controllers)
    const token = typeof window !== 'undefined' ? localStorage.getItem("labass_token") : null;
    
    if (!token) {
      console.log('No authentication token found, using fallback data');
      return getFallbackProducts();
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Following the same pattern as invoiceController
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.log('Authentication failed, using fallback data');
        return getFallbackProducts();
      }
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const apiProducts: APIProduct[] = await response.json();
    
    // Map API response to local product structure
    return apiProducts.map(mapAPIProductToProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return fallback data when API fails
    console.log('Returning fallback data due to API error');
    return getFallbackProducts();
  }
}

// Fallback products for development/testing
function getFallbackProducts(): Product[] {
  return [
    {
      id: 1,
      name: "Bioderma Makeup Remover",
      nameAr: "بيوديرما مزيل مكياج سينسييو الحساسة 500 ملي",
      description: "Bioderma Sensibio H2O Makeup Remover - 500ml",
      price: 24.00,
      originalPrice: 27.60,
      image: "/images/products/placeholder.png",
      barcode: "3401345935571",
      totalWithTax: 27.60,
      expiryDate: "12-2025",
      minQuantity: 1,
      brand: "Bioderma",
      brandAr: "بيوديرما",
      isImported: false,
      supplier: "alhumazi"
    },
    {
      id: 2,
      name: "Bioderma Cleansing Bar",
      nameAr: "بيوديرما صابونه ترطيب 150 جرام",
      description: "Bioderma Atoderm Intensive Ultra-Soothing Cleansing Bar 150g",
      price: 13.00,
      originalPrice: 14.95,
      image: "/images/products/placeholder.png",
      barcode: "3401399373527",
      totalWithTax: 14.95,
      expiryDate: "12-2025",
      minQuantity: 1,
      brand: "Bioderma",
      brandAr: "بيوديرما",
      isImported: false,
      supplier: "alhumazi"
    }
  ];
}

// Map API product to local product structure
function mapAPIProductToProduct(apiProduct: APIProduct): Product {
  const price = parseFloat(apiProduct.price);
  const originalPrice = price * 1.15; // Assuming 15% discount
  const totalWithTax = price * 1.15; // Assuming 15% VAT
  
  return {
    id: apiProduct.id,
    name: apiProduct.englishProductName || apiProduct.arabicProductName,
    nameAr: apiProduct.arabicProductName,
    description: `${apiProduct.englishBrand} - ${apiProduct.barcode}`,
    price: price,
    originalPrice: Math.round(originalPrice * 100) / 100,
    image: apiProduct.productImagesUrls[0] || '/images/products/placeholder.png',
    barcode: apiProduct.barcode,
    totalWithTax: Math.round(totalWithTax * 100) / 100,
    expiryDate: calculateExpiryDate(apiProduct.createdAt),
    minQuantity: 1,
    brand: apiProduct.englishBrand,
    brandAr: apiProduct.arabicBrand,
    isImported: apiProduct.isImported,
    supplier: apiProduct.supplier
  };
}

// Calculate expiry date (example: 2 years from creation)
function calculateExpiryDate(createdAt: string): string {
  const createdDate = new Date(createdAt);
  const expiryDate = new Date(createdDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  
  const month = String(expiryDate.getMonth() + 1).padStart(2, '0');
  const year = expiryDate.getFullYear();
  
  return `${month}-${year}`;
}

// Search products by name or brand
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  
  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.nameAr.includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.brandAr.includes(searchTerm) ||
    product.barcode.includes(searchTerm)
  );
}