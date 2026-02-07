import * as Font from 'expo-font';
import {
  ArrowLeft,
  Bell,
  Heart,
  Home,
  Menu,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'CoffeeFont': require('../../assets/fonts/Pacifico-Regular (1).ttf'),
          'ItalicCoffee Font': require('../../assets/fonts/FoodBrandDemo-Regular.otf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Font Load Error:", e);
        setFontsLoaded(true); 
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#D17842" />
      </View>
    );
  }

 
  const addToCart = (item: any) => {
    setCartItems([...cartItems, { ...item, cartId: Math.random().toString() }]);
    alert(`${item.name} added to cart!`);
  };

  const removeFromCart = (cartId: any) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const totalPrice = cartItems.reduce((sum: number, item: any) =>
    sum + parseInt(item.price.replace('$', '')), 0
  );

  
  const SplashScreen = () => (
    <View style={styles.splashContainer}>
      <ImageBackground
        source={require('../../assets/images/background.jpeg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.darkOverlay}>
          <Text style={[styles.logoText, { fontFamily: 'CoffeeFont', fontWeight: 'light' }]}>Baker's Coffee Shop</Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.tagline, { fontFamily: 'CoffeeFont' }]}>Feeling Low? Take a Sip of Coffee</Text>
          <Text style={[styles.tagline, { fontFamily: 'ItalicCoffee Font', fontSize: 25 }]}>
            Brewed with Love, Served with Passion
          </Text>

          <TouchableOpacity style={styles.getStartedBtn} onPress={() => setScreen('home')}>
            <Text style={styles.btnText}>Get Start</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );

  
  const HomeScreen = () => {
    const coffeeItems = [
      { id: '1', name: 'Latte', price: '$69', img: require('../../assets/images/latte.webp') },
      { id: '2', name: 'Espresso', price: '$28', img: require('../../assets/images/espresso.jpg') },
      { id: '3', name: 'Black Coffee', price: '$80', img: require('../../assets/images/blackcoffee.jpg') },
      { id: '4', name: 'Cold Coffee', price: '$24', img: require('../../assets/images/icedcoffee.jpg') },
    ];

    const filteredItems = coffeeItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View style={styles.container}>
        <View style={styles.homeHeader}>
          <Menu color="white" size={24} />
          <TouchableOpacity onPress={() => setScreen('cart')}>
            <View>
              <ShoppingCart color="white" size={24} />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.mainTitle, { fontFamily: 'CoffeeFont' }]}>It's a Great Day for Coffee</Text>

        <View style={styles.searchBar}>
          <Search color="#888" size={20} />
          <TextInput
            placeholder="Find your coffee"
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <FlatList
          data={filteredItems}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.coffeeCard}>
              <Image source={item.img} style={styles.cardImg} />
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <TouchableOpacity style={styles.plusBtn} onPress={() => addToCart(item)}>
                  <Plus color="white" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: '#555', textAlign: 'center', marginTop: 20 }}>No coffee found...</Text>}
        />

        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => setScreen('home')}><Home color="#D17842" size={24} /></TouchableOpacity>
          <Heart color="#555" size={24} />
          <Bell color="#555" size={24} />
          <TouchableOpacity onPress={() => setScreen('cart')}><User color="#555" size={24} /></TouchableOpacity>
        </View>
      </View>
    );
  };

  
  const CartScreen = () => (
    <View style={styles.container}>
      <View style={styles.homeHeader}>
        <TouchableOpacity onPress={() => setScreen('home')}><ArrowLeft color="white" size={24} /></TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}><Text style={{ color: '#555' }}>Your cart is empty</Text></View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.cartId}
          renderItem={({ item }) => (
            <View style={styles.cartItemCard}>
              <Image source={item.img} style={styles.cartItemImg} />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'ItalicCoffee Font' }}>{item.name}</Text>
                <Text style={{ color: '#D17842' }}>{item.price}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.cartId)}>
                <Trash2 color="#ff4444" size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <View style={styles.totalSection}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Total</Text>
          <Text style={{ color: '#D17842', fontSize: 18, fontWeight: 'bold' }}>${totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.getStartedBtn} onPress={() => alert('Your Order has been Placed!')}>
          <Text style={styles.btnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'cart' && <CartScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 50 },
  splashContainer: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  darkOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: 'rgba(0,0,0,0.5)' },
  logoText: { color: 'white', fontSize: 50, marginTop: 50, textAlign: 'center' },
  tagline: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 10, fontWeight: 'light' },
  getStartedBtn: { backgroundColor: '#D17842', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  homeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  mainTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', width: '70%', marginBottom: 20 },
  searchBar: { backgroundColor: '#1E1E1E', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 20 },
  searchInput: { color: 'white', marginLeft: 10, flex: 1 },
  coffeeCard: { backgroundColor: '#1E1E1E', flex: 1, margin: 8, borderRadius: 20, padding: 12 },
  cardImg: { width: '100%', height: 100, borderRadius: 15, marginBottom: 10 },
  cardName: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' },
  cardPrice: { color: 'white', fontWeight: 'bold' },
  plusBtn: { backgroundColor: '#D17842', padding: 6, borderRadius: 8 },
  navBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  badge: { position: 'absolute', right: -6, top: -6, backgroundColor: '#D17842', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cartItemCard: { flexDirection: 'row', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  cartItemImg: { width: 50, height: 50, borderRadius: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  totalSection: { borderTopWidth: 1, borderTopColor: '#333', paddingVertical: 20 }
});