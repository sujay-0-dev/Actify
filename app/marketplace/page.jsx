"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Star, Search, Filter, ShoppingBag, Tag, MapPin, Clock, Heart, Loader2, CheckCircle } from "lucide-react"
import LevelBadge from "@/components/gamification/level-badge"

export default function MarketplacePage() {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("browse")
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data for products
      const mockProducts = [
        {
          id: 1,
          title: "Handmade Bamboo Cutlery Set",
          seller: {
            name: "Rahul S.",
            avatar: "https://th.bing.com/th/id/OIP.JnLIe7HloAAHVNJz_9dAPAHaFS?rs=1&pid=ImgDetMain",
            level: 3,
            rating: 4.8,
            reviews: 24,
            verified: true,
          },
          category: "eco-friendly",
          price: 450,
          location: "South Delhi",
          distance: "3.2 km",
          images: ["https://th.bing.com/th/id/OIP.JnLIe7HloAAHVNJz_9dAPAHaFS?rs=1&pid=ImgDetMain"],
          description: "Eco-friendly bamboo cutlery set including fork, knife, spoon, and chopsticks in a cotton pouch.",
          condition: "New",
          postedDate: "2023-06-15",
          tags: ["eco-friendly", "handmade", "sustainable"],
        },
        {
          id: 2,
          title: "Handwoven Cotton Tote Bag",
          seller: {
            name: "Priya M.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 4,
            rating: 4.9,
            reviews: 36,
            verified: true,
          },
          category: "handmade",
          price: 350,
          location: "East Delhi",
          distance: "5.7 km",
          images: ["https://th.bing.com/th/id/OIP.mxeKCwDwVxd_izycKGiexwAAAA?w=208&h=277&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
          description: "Handwoven cotton tote bag with traditional designs. Perfect for shopping and everyday use.",
          condition: "New",
          postedDate: "2023-06-12",
          tags: ["handmade", "cotton", "tote", "traditional"],
        },
        {
          id: 3,
          title: "Secondhand Fiction Books (Set of 5)",
          seller: {
            name: "Amit K.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 2,
            rating: 4.7,
            reviews: 18,
            verified: true,
          },
          category: "books",
          price: 600,
          location: "North Delhi",
          distance: "7.3 km",
          images: ["https://th.bing.com/th/id/OIP.gKWEFcLG8krejeGOKkPuRAHaHa?w=208&h=208&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
          description: "Collection of 5 fiction books in good condition. Titles include bestsellers from popular authors.",
          condition: "Used - Good",
          postedDate: "2023-06-10",
          tags: ["books", "fiction", "secondhand", "reading"],
        },
        {
          id: 4,
          title: "Homemade Organic Jam (3 Flavors)",
          seller: {
            name: "Sneha R.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 3,
            rating: 4.6,
            reviews: 15,
            verified: false,
          },
          category: "food",
          price: 550,
          location: "West Delhi",
          distance: "8.5 km",
          images: ["https://th.bing.com/th/id/OIP.s2uV6_Wl85BevQUarU7ngAHaFj?w=255&h=191&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
          description: "Set of 3 homemade organic jams - strawberry, mixed berry, and orange marmalade. No preservatives.",
          condition: "New",
          postedDate: "2023-06-08",
          tags: ["food", "organic", "homemade", "jam"],
        },
        {
          id: 5,
          title: "Vintage Film Camera",
          seller: {
            name: "Vikram J.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 2,
            rating: 4.5,
            reviews: 12,
            verified: true,
          },
          category: "electronics",
          price: 2500,
          location: "Central Delhi",
          distance: "4.2 km",
          images: ["https://th.bing.com/th/id/OIP.eVPdDZSn3U9-9_elEj2K6QHaFi?w=264&h=198&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
          description: "Vintage film camera from the 1980s. In working condition with minor cosmetic wear.",
          condition: "Used - Good",
          postedDate: "2023-06-05",
          tags: ["camera", "vintage", "film", "photography"],
        },
        {
          id: 6,
          title: "Hand-painted Ceramic Planters (Set of 3)",
          seller: {
            name: "Neha P.",
            avatar: "/placeholder.svg?height=80&width=80",
            level: 3,
            rating: 4.7,
            reviews: 20,
            verified: false,
          },
          category: "home",
          price: 850,
          location: "South Delhi",
          distance: "2.8 km",
          images: ["https://th.bing.com/th/id/OIP.KixFxEEF035ZWzFE6euECgHaD-?w=312&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
          description: "Set of 3 hand-painted ceramic planters in different sizes. Perfect for indoor plants.",
          condition: "New",
          postedDate: "2023-06-02",
          tags: ["home", "decor", "handmade", "plants"],
        },
      ]

      setProducts(mockProducts)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "eco-friendly", label: "Eco-Friendly" },
    { id: "handmade", label: "Handmade" },
    { id: "books", label: "Books" },
    { id: "food", label: "Food" },
    { id: "electronics", label: "Electronics" },
    { id: "home", label: "Home & Garden" },
  ]

  const filteredProducts = products
    .filter((product) => categoryFilter === "all" || product.category === categoryFilter)
    .filter(
      (product) =>
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )

  const handleCreateListing = () => {
    if (!user) {
      router.push("/login?redirect=/marketplace/create")
    } else {
      router.push("/marketplace/create")
    }
  }

  const toggleFavorite = (productId) => {
    if (!user) {
      router.push("/login?redirect=/marketplace")
      return
    }

    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId))
    } else {
      setFavorites([...favorites, productId])
      
      toast({
        title: "Added to Favorites!",
        description: "This item has been added to your favorites.",
        action: (
          <div className="flex items-center justify-center p-1 bg-pink-100 rounded-full dark:bg-pink-900/30">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
        ),
      })
    }
  }

  const userListings = [
    {
      id: 101,
      title: "Handmade Macrame Wall Hanging",
      category: "home",
      price: 750,
      images: ["https://th.bing.com/th/id/OIP.JnLIe7HloAAHVNJz_9dAPAHaFS?rs=1&pid=ImgDetMain"],
      status: "active",
      views: 28,
      favorites: 5,
      postedDate: "2023-06-20",
    },
    {
      id: 102,
      title: "Organic Honey (500g)",
      category: "food",
      price: 450,
      images: ["https://th.bing.com/th/id/OIP.jIzFWlyNnbCAMTxWDX5HNQHaJ4?w=208&h=277&c=7&r=0&o=5&dpr=1.3&pid=1.7"],
      status: "draft",
      views: 0,
      favorites: 0,
      postedDate: "2023-06-25",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 text-white bg-gradient-to-r from-pink-600 to-amber-600">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Community Marketplace</h1>
            <p className="mb-6 text-xl text-white/80">
              Buy and sell products created by community members. Support local crafts and sustainable goods.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleCreateListing} className="text-pink-600 bg-white hover:bg-white/90">
                <Tag className="w-4 h-4 mr-2" /> List Your Product
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <ShoppingBag className="w-4 h-4 mr-2" /> Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[600px] grid-cols-3 mb-8">
              <TabsTrigger value="browse">Browse Products</TabsTrigger>
              <TabsTrigger value="my-listings">My Listings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              <div className="flex flex-col gap-4 mb-8 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-10 border-gray-300 dark:border-gray-700" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-300 dark:border-gray-700">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                  </Button>
                  <Button onClick={handleCreateListing} className="text-white bg-pink-600 hover:bg-pink-700">
                    List Your Product
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(category.id)}
                  >
                    {category.label}
                  </Badge>
                ))}
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg game-card">
                      <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        <button 
                          className={`absolute top-2 right-2 p-2 rounded-full ${
                            favorites.includes(product.id) 
                              ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" 
                              : "bg-white/80 text-gray-600 hover:text-pink-600 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:text-pink-400"
                          }`}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
                        </button>
                        <Badge className="absolute text-pink-800 capitalize bg-pink-100 top-2 left-2 dark:bg-pink-900/30 dark:text-pink-300">
                          {product.category}
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                          <div className="text-lg font-bold text-pink-600 dark:text-pink-400">₹{product.price}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="relative">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                                <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1">
                                <LevelBadge level={product.seller.level} size="sm" />
                              </div>
                            </div>
                            <div className="ml-2">
                              <div className="flex items-center text-sm font-medium">
                                {product.seller.name}
                                {product.seller.verified && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Star className="w-3 h-3 mr-1 text-amber-500 fill-amber-500" />
                                <span>{product.seller.rating}</span>
                                <span className="mx-1">•</span>
                                <span>{product.seller.reviews} reviews</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {product.condition}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-pink-600 dark:text-pink-400" />
                            <span>{product.location} ({product.distance})</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-pink-600 dark:text-pink-400" />
                            <span>{new Date(product.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-4 border-t">
                        <Button variant="outline" size="sm" className="text-pink-600 border-pink-200 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-900/20">
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="text-white bg-pink-600 hover:bg-pink-700"
                        >
                          Contact Seller
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && !isLoading && (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full dark:bg-pink-900/30">
                    <Search className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No products found</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button onClick={() => {setCategoryFilter("all"); setSearchQuery("")}}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-listings" className="space-y-6">
              {!user ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full dark:bg-pink-900/30">
                    <ShoppingBag className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Sign in to manage your listings</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Create an account or sign in to manage your marketplace listings
                  </p>
                  <Button onClick={() => router.push("/login?redirect=/marketplace")}>
                    Sign In / Register
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Your Marketplace Listings</h2>
                    <Button onClick={handleCreateListing} className="text-white bg-pink-600 hover:bg-pink-700">
                      Create New Listing
                    </Button>
                  </div>

                  {userListings.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full dark:bg-pink-900/30">
                        <Tag className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No listings yet</h3>
                      <p className="mb-6 text-gray-500 dark:text-gray-400">
                        Create your first marketplace listing to start selling
                      </p>
                      <Button onClick={handleCreateListing}>
                        Create Listing
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {userListings.map((listing) => (
                        <Card key={listing.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                          <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                            <Image
                              src={listing.images[0] || "/placeholder.svg"}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                            <Badge 
                              className={`absolute top-2 right-2 ${
                                listing.status === "active" 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {listing.status === "active" ? "Active" : "Draft"}
                            </Badge>
                          </div>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">{listing.title}</CardTitle>
                              <div className="text-lg font-bold text-pink-600 dark:text-pink-400">₹{listing.price}</div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center">
                                <Badge variant="outline" className="capitalize">
                                  {listing.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                  <Search className="w-4 h-4 mr-1" />
                                  <span>{listing.views} views</span>
                                </div>
                                <div className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1" />
                                  <span>{listing.favorites}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-4 border-t">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            {listing.status === "draft" ? (
                              <Button size="sm" className="text-white bg-green-600 hover:bg-green-700">
                                Publish
                              </Button>
                            ) : (
                              <Button size="sm" variant="destructive">
                                Unpublish
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              {!user ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full dark:bg-pink-900/30">
                    <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Sign in to view favorites</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Create an account or sign in to save and view your favorite listings
                  </p>
                  <Button onClick={() => router.push("/login?redirect=/marketplace")}>
                    Sign In / Register
                  </Button>
                </div>
              ) : favorites.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full dark:bg-pink-900/30">
                    <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">No favorites yet</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">
                    Browse the marketplace and save items you love
                  </p>
                  <Button onClick={() => setActiveTab("browse")}>
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products
                    .filter((product) => favorites.includes(product.id))
                    .map((product) => (
                      <Card key={product.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg game-card">
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                          <button 
                            className="absolute p-2 text-pink-600 bg-pink-100 rounded-full top-2 right-2 dark:bg-pink-900/30 dark:text-pink-400"
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                          <Badge className="absolute text-pink-800 capitalize bg-pink-100 top-2 left-2 dark:bg-pink-900/30 dark:text-pink-300">
                            {product.category}
                          </Badge>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                            <div className="text-lg font-bold text-pink-600 dark:text-pink-400">₹{product.price}</div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-pink-600 dark:text-pink-400" />
                              <span>{product.location} ({product.distance})</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-pink-600 dark:text-pink-400" />
                              <span>{new Date(product.postedDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-4 border-t">
                          <Button variant="outline" size="sm" className="text-pink-600 border-pink-200 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-900/20">
                            View Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="text-white bg-pink-600 hover:bg-pink-700"
                          >
                            Contact Seller
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  )
}