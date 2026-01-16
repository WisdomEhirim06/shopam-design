'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Edit3,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  MoreVertical,
  Trash2,
  Star,
  MapPin,
  Package,
  TrendingUp,
  Users,
  X,
  Upload,
  Image as ImageIcon,
  ShoppingCart,
  Minus,
} from 'lucide-react';

type Tab = 'posts' | 'products' | 'details';

interface Post {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  views: number;
  date: string;
  tags: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  sales: number;
  description?: string;
  category?: string;
  features?: string[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  
  // Form state for create/edit post
  const [postForm, setPostForm] = useState({
    image: null as File | null,
    imagePreview: '',
    caption: '',
    tags: '',
  });

  // File input refs
  const createPostFileRef = useRef<HTMLInputElement>(null);
  const editPostFileRef = useRef<HTMLInputElement>(null);

  // Sample vendor data
  const vendorData = {
    name: "Sarah's Store",
    subtitle: 'Fashion & Beauty Vendor',
    avatar: '/api/placeholder/200/200',
    coverImage: '/api/placeholder/1200/300',
    followers: 11234,
    following: 567,
    totalSales: 15450,
    rating: 4.8,
    location: 'Lagos, Nigeria',
    bio: 'Authentic African crafts, fashion, and beauty products made with love and tradition. Supporting local artisans and bringing quality to you.',
    joinedDate: 'January 2024',
    responseTime: '< 1 hour',
  };

  // Sample posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      image: '/api/placeholder/400/400',
      caption: 'New African print dress collection! 🔥 These stunning pieces celebrate African heritage with vibrant patterns and modern cuts. Perfect for any special occasion or everyday wear. Limited stock available!',
      likes: 234,
      comments: 45,
      views: 1200,
      date: '2024-01-15',
      tags: ['fashion', 'african', 'dress'],
    },
    {
      id: '2',
      image: '/api/placeholder/400/400',
      caption: 'Beautiful handwoven basket set available now',
      likes: 189,
      comments: 32,
      views: 980,
      date: '2024-01-14',
      tags: ['crafts', 'home'],
    },
    {
      id: '3',
      image: '/api/placeholder/400/400',
      caption: 'Limited edition Ankara fabrics 💫',
      likes: 456,
      comments: 78,
      views: 2100,
      date: '2024-01-13',
      tags: ['fabric', 'ankara'],
    },
    {
      id: '4',
      image: '/api/placeholder/400/400',
      caption: 'Check out our new jewelry collection!',
      likes: 312,
      comments: 56,
      views: 1500,
      date: '2024-01-12',
      tags: ['jewelry', 'accessories'],
    },
  ]);

  // Sample products
  const products: Product[] = [
    {
      id: '1',
      name: 'African Print Dress',
      price: 30000,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 124,
      stock: 15,
      sales: 89,
      description: 'Beautiful African print dress made from high-quality Ankara fabric. Perfect for weddings, parties, and special occasions. Features vibrant colors and traditional patterns.',
      category: 'Fashion',
      features: [
        'Premium Ankara fabric',
        'Available in sizes S-XXL',
        'Machine washable',
        'Vibrant, fade-resistant colors',
        'Traditional African patterns',
      ],
    },
    {
      id: '2',
      name: 'Handwoven Basket Set',
      price: 25000,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 98,
      stock: 8,
      sales: 156,
      description: 'Set of 3 handwoven baskets crafted by local artisans. Perfect for storage, organization, or as decorative pieces. Each basket is unique with natural variations.',
      category: 'Home & Crafts',
      features: [
        'Set of 3 different sizes',
        'Handcrafted by local artisans',
        'Natural, eco-friendly materials',
        'Sturdy and durable',
        'Multi-purpose use',
      ],
    },
    {
      id: '3',
      name: 'Ankara Fabric (6 yards)',
      price: 18000,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 203,
      stock: 45,
      sales: 234,
      description: 'Premium quality Ankara fabric, 6 yards. Ideal for making dresses, skirts, tops, and accessories. Bold African prints that make a statement.',
      category: 'Fabrics',
      features: [
        '6 yards per piece',
        '100% cotton',
        'Colorfast and durable',
        'Perfect for tailoring',
        'Authentic African designs',
      ],
    },
    {
      id: '4',
      name: 'Beaded Necklace',
      price: 12000,
      image: '/api/placeholder/300/300',
      rating: 4.6,
      reviews: 87,
      stock: 32,
      sales: 178,
      description: 'Elegant beaded necklace featuring traditional African beadwork. Handcrafted with attention to detail. Perfect accessory for any outfit.',
      category: 'Jewelry',
      features: [
        'Handcrafted beadwork',
        'Adjustable length',
        'Lightweight and comfortable',
        'Traditional designs',
        'Comes in gift packaging',
      ],
    },
    {
      id: '5',
      name: 'Traditional Earrings',
      price: 8000,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 145,
      stock: 50,
      sales: 267,
      description: 'Beautiful traditional African earrings. Lightweight and comfortable for all-day wear. Makes a perfect gift or addition to your jewelry collection.',
      category: 'Jewelry',
      features: [
        'Hypoallergenic materials',
        'Lightweight design',
        'Traditional craftsmanship',
        'Secure fastening',
        'Multiple color options',
      ],
    },
    {
      id: '6',
      name: 'Kente Cloth Scarf',
      price: 15000,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 76,
      stock: 22,
      sales: 134,
      description: 'Authentic Kente cloth scarf with traditional Ghanaian patterns. Versatile accessory that adds cultural elegance to any outfit.',
      category: 'Accessories',
      features: [
        'Authentic Kente patterns',
        'Soft and comfortable',
        'Versatile styling options',
        'Handwoven quality',
        'Rich cultural heritage',
      ],
    },
  ];

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setPostForm({
      image: null,
      imagePreview: post.image,
      caption: post.caption,
      tags: post.tags.join(', '),
    });
    setShowEditPost(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm({
          ...postForm,
          image: file,
          imagePreview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      image: null,
      imagePreview: '',
      caption: '',
      tags: '',
    });
    setEditingPost(null);
  };

  const handleCreatePost = () => {
    if (!postForm.caption || !postForm.imagePreview) return;

    const newPost: Post = {
      id: String(Date.now()),
      image: postForm.imagePreview,
      caption: postForm.caption,
      likes: 0,
      comments: 0,
      views: 0,
      date: new Date().toISOString(),
      tags: postForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
    resetPostForm();
  };

  const handleUpdatePost = () => {
    if (!editingPost || !postForm.caption) return;

    const updatedPosts = posts.map((p) =>
      p.id === editingPost.id
        ? {
            ...p,
            image: postForm.imagePreview || p.image,
            caption: postForm.caption,
            tags: postForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
          }
        : p
    );

    setPosts(updatedPosts);
    setShowEditPost(false);
    resetPostForm();
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowProductDetail(true);
  };

  return (
    <div className="space-y-6">
      {/* Cover Image & Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="theme-card rounded-xl overflow-hidden"
      >
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-crimson to-shopam">
          <div className="absolute inset-0 bg-black/20"></div>
          <button className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-all">
            <Camera size={20} className="text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full border-4 theme-card overflow-hidden" style={{ borderColor: 'var(--bg-primary)' }}>
                <div className="w-full h-full bg-gradient-to-br from-crimson to-shopam flex items-center justify-center text-white text-4xl font-bold">
                  S
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-2 theme-red-bg rounded-full text-white hover:opacity-90 transition-all">
                <Camera size={16} />
              </button>
            </div>
          </div>

          {/* Name & Stats */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold theme-text-primary">{vendorData.name}</h1>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Edit3 size={18} className="theme-text-secondary" />
                </button>
              </div>
              <p className="theme-text-secondary mb-3">{vendorData.subtitle}</p>
              <div className="flex items-center gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="theme-red" />
                  <span className="theme-text-secondary">{vendorData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400" fill="currentColor" />
                  <span className="theme-text-primary font-semibold">{vendorData.rating}</span>
                  <span className="theme-text-secondary">rating</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold theme-text-primary">{vendorData.followers.toLocaleString()}</p>
                <p className="text-sm theme-text-secondary">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold theme-text-primary">{products.length}</p>
                <p className="text-sm theme-text-secondary">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold theme-text-primary">{posts.length}</p>
                <p className="text-sm theme-text-secondary">Posts</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 theme-text-secondary max-w-2xl">{vendorData.bio}</p>

          {/* Quick Stats */}
          <div className="mt-4 flex items-center gap-6 flex-wrap text-sm theme-text-secondary">
            <div>Joined {vendorData.joinedDate}</div>
            <div>• Avg. response: {vendorData.responseTime}</div>
            <div>• ₦{vendorData.totalSales.toLocaleString()} total sales</div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="theme-card rounded-xl p-2 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'posts'
                ? 'text-white'
                : 'theme-text-secondary hover:bg-white/5'
            }`}
            style={activeTab === 'posts' ? { backgroundColor: 'var(--primary-red)' } : {}}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'products'
                ? 'text-white'
                : 'theme-text-secondary hover:bg-white/5'
            }`}
            style={activeTab === 'products' ? { backgroundColor: 'var(--primary-red)' } : {}}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'details'
                ? 'text-white'
                : 'theme-text-secondary hover:bg-white/5'
            }`}
            style={activeTab === 'details' ? { backgroundColor: 'var(--primary-red)' } : {}}
          >
            Profile Details
          </button>
        </div>

        {activeTab === 'posts' && (
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-2 px-4 py-3 text-white rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--primary-red)' }}
          >
            <Plus size={20} />
            <span className="hidden md:inline">Create Post</span>
          </button>
        )}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'posts' && (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="theme-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform"
              >
                {/* Post Image */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-crimson/20 to-shopam/20"></div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5 text-white">
                      <Heart size={20} />
                      <span className="font-semibold text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <MessageCircle size={20} />
                      <span className="font-semibold text-sm">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <Eye size={20} />
                      <span className="font-semibold text-sm">{post.views}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPost(post);
                      }}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                    >
                      <Edit3 size={14} className="text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post.id);
                      }}
                      className="p-1.5 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Post Info */}
                <div className="p-3">
                  <div className="theme-text-primary mb-2 text-sm">
                    {expandedPosts.includes(post.id) ? (
                      <>
                        {post.caption}{' '}
                        {post.caption.length > 80 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPosts(expandedPosts.filter((id) => id !== post.id));
                            }}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                          >
                            see less
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {post.caption.length > 80
                          ? `${post.caption.substring(0, 80)}... `
                          : post.caption}
                        {post.caption.length > 80 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPosts([...expandedPosts, post.id]);
                            }}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                          >
                            more
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs theme-text-secondary">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <div className="flex gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: 'var(--primary-red-light)', color: 'var(--primary-red)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="theme-card rounded-xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-crimson/10 to-shopam/10"></div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-semibold rounded-full">
                      {product.stock} left
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold theme-text-primary mb-1 line-clamp-1 text-sm">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                      />
                    ))}
                    <span className="text-xs theme-text-secondary ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm" style={{ color: 'var(--primary-red)' }}>
                      ₦{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs theme-text-secondary">
                      {product.sales} sold
                    </span>
                  </div>

                  <button
                    onClick={() => handleViewProduct(product)}
                    className="w-full py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: 'var(--primary-red)',
                      color: 'white',
                    }}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Business Information */}
            <div className="theme-card rounded-xl p-6">
              <h3 className="text-xl font-bold theme-text-primary mb-6">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm theme-text-secondary">Store Name</label>
                  <p className="text-lg font-semibold theme-text-primary">{vendorData.name}</p>
                </div>
                <div>
                  <label className="text-sm theme-text-secondary">Category</label>
                  <p className="text-lg font-semibold theme-text-primary">{vendorData.subtitle}</p>
                </div>
                <div>
                  <label className="text-sm theme-text-secondary">Location</label>
                  <p className="text-lg font-semibold theme-text-primary">{vendorData.location}</p>
                </div>
                <div>
                  <label className="text-sm theme-text-secondary">Bio</label>
                  <p className="theme-text-primary">{vendorData.bio}</p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="theme-card rounded-xl p-6">
              <h3 className="text-xl font-bold theme-text-primary mb-6">Performance Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-500/20">
                      <TrendingUp size={24} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Total Sales</p>
                      <p className="text-2xl font-bold theme-text-primary">₦{vendorData.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-500/20">
                      <Users size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Followers</p>
                      <p className="text-2xl font-bold theme-text-primary">{vendorData.followers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-amber-500/20">
                      <Star size={24} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Rating</p>
                      <p className="text-2xl font-bold theme-text-primary">{vendorData.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg theme-red-light-bg">
                      <Package size={24} style={{ color: 'var(--primary-red)' }} />
                    </div>
                    <div>
                      <p className="text-sm theme-text-secondary">Products Listed</p>
                      <p className="text-2xl font-bold theme-text-primary">{products.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowCreatePost(false);
              resetPostForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="theme-modal rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold theme-text-primary">Create New Post</h3>
                <button
                  onClick={() => {
                    setShowCreatePost(false);
                    resetPostForm();
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={24} className="theme-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 theme-text-primary">
                    Post Image *
                  </label>
                  <input
                    ref={createPostFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => createPostFileRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-all"
                    style={{ borderColor: postForm.imagePreview ? 'var(--primary-red)' : 'var(--border-primary)' }}
                  >
                    {postForm.imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={postForm.imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <p className="text-sm theme-text-secondary">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon size={48} className="mx-auto mb-3 theme-text-secondary" />
                        <p className="theme-text-primary mb-1">Click to upload image</p>
                        <p className="text-sm theme-text-secondary">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium mb-2 theme-text-primary">
                    Caption *
                  </label>
                  <textarea
                    value={postForm.caption}
                    onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                    rows={4}
                    placeholder="Write something about this post..."
                    className="theme-input w-full px-4 py-3 rounded-lg resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2 theme-text-primary">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    placeholder="e.g. fashion, african, dress (comma separated)"
                    className="theme-input w-full px-4 py-3 rounded-lg"
                  />
                  <p className="text-xs theme-text-secondary mt-1">
                    Separate tags with commas
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCreatePost(false);
                      resetPostForm();
                    }}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all theme-card hover:border-primary border"
                    style={{ borderColor: 'var(--border-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!postForm.caption || !postForm.imagePreview}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--primary-red)' }}
                  >
                    Publish Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {showEditPost && editingPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowEditPost(false);
              resetPostForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="theme-modal rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold theme-text-primary">Edit Post</h3>
                <button
                  onClick={() => {
                    setShowEditPost(false);
                    resetPostForm();
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={24} className="theme-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 theme-text-primary">
                    Post Image
                  </label>
                  <input
                    ref={editPostFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => editPostFileRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-all"
                    style={{ borderColor: 'var(--primary-red)' }}
                  >
                    <div className="space-y-3">
                      <img
                        src={postForm.imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm theme-text-secondary">Click to change image</p>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium mb-2 theme-text-primary">
                    Caption *
                  </label>
                  <textarea
                    value={postForm.caption}
                    onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                    rows={4}
                    placeholder="Write something about this post..."
                    className="theme-input w-full px-4 py-3 rounded-lg resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2 theme-text-primary">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                    placeholder="e.g. fashion, african, dress (comma separated)"
                    className="theme-input w-full px-4 py-3 rounded-lg"
                  />
                  <p className="text-xs theme-text-secondary mt-1">
                    Separate tags with commas
                  </p>
                </div>

                {/* Post Stats (Read-only) */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart size={16} className="theme-red" />
                      <span className="font-bold theme-text-primary">{editingPost.likes}</span>
                    </div>
                    <p className="text-xs theme-text-secondary">Likes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageCircle size={16} className="text-blue-400" />
                      <span className="font-bold theme-text-primary">{editingPost.comments}</span>
                    </div>
                    <p className="text-xs theme-text-secondary">Comments</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye size={16} className="text-green-400" />
                      <span className="font-bold theme-text-primary">{editingPost.views}</span>
                    </div>
                    <p className="text-xs theme-text-secondary">Views</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowEditPost(false);
                      resetPostForm();
                    }}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all theme-card hover:border-primary border"
                    style={{ borderColor: 'var(--border-primary)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePost}
                    disabled={!postForm.caption}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--primary-red)' }}
                  >
                    Update Post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showProductDetail && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowProductDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="theme-modal rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold theme-text-primary">Product Details</h3>
                <button
                  onClick={() => setShowProductDetail(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={24} className="theme-text-secondary" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 mb-4">
                    <div className="w-full h-full bg-gradient-to-br from-crimson/10 to-shopam/10"></div>
                  </div>
                  
                  {/* Image Gallery (Placeholder) */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer hover:opacity-80 transition-opacity"></div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  {/* Name & Category */}
                  <div>
                    <p className="text-sm theme-text-secondary mb-1">{selectedProduct.category}</p>
                    <h2 className="text-3xl font-bold theme-text-primary mb-3">
                      {selectedProduct.name}
                    </h2>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < Math.floor(selectedProduct.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="theme-text-primary font-semibold">{selectedProduct.rating}</span>
                      <span className="theme-text-secondary">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-4xl font-bold theme-red mb-2">
                      ₦{selectedProduct.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-400 font-semibold">
                        {selectedProduct.stock} in stock
                      </span>
                      <span className="theme-text-secondary">
                        {selectedProduct.sales} sold
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold theme-text-primary mb-2">Description</h4>
                    <p className="theme-text-secondary leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Features */}
                  {selectedProduct.features && (
                    <div>
                      <h4 className="font-semibold theme-text-primary mb-3">Features</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--primary-red)' }}></div>
                            <span className="theme-text-secondary">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2 theme-text-primary">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 rounded-lg theme-card hover:border-primary border transition-all"
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <Minus size={20} />
                      </button>
                      <span className="text-2xl font-bold theme-text-primary w-16 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                        className="p-3 rounded-lg theme-card hover:border-primary border transition-all"
                        style={{ borderColor: 'var(--border-primary)' }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: 'var(--primary-red)' }}
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                    <button
                      className="w-full px-6 py-4 rounded-xl font-semibold transition-all theme-card hover:border-primary border"
                      style={{ borderColor: 'var(--border-primary)', color: 'var(--primary-red)' }}
                    >
                      Contact Vendor
                    </button>
                  </div>

                  {/* Vendor Info */}
                  <div className="pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-crimson to-shopam flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-semibold theme-text-primary">{vendorData.name}</p>
                        <div className="flex items-center gap-2 text-sm theme-text-secondary">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span>{vendorData.rating} rating</span>
                          <span>•</span>
                          <span>{vendorData.responseTime} response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}