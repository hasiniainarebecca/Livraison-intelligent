import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../api/axios";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function CatalogScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { addToCart, totalItems, totalPrice } = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState({});

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category_id = activeCategory;
    if (search) params.search = search;
    api
      .get("/products", { params })
      .then(({ data }) => setProducts(data.data ?? data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  const handleAdd = useCallback(
    (product) => {
      addToCart(product);
      setAdded((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(
        () => setAdded((prev) => ({ ...prev, [product.id]: false })),
        1200,
      );
    },
    [addToCart],
  );

  const handleCheckout = () => {
    if (totalItems === 0) return;
    if (!user || user.role !== "client") {
      // Utilisateur non connecté → aller à Login
      navigation.navigate("Login");
    } else {
      navigation.navigate("CartTab", { screen: "Checkout" });
    }
  };

  const renderProduct = ({ item }) => {
    const isAdded = added[item.id];
    return (
      <View style={s.card}>
        <View
          style={[
            s.imgBox,
            { backgroundColor: item.category?.color ?? "#E5E7EB" },
          ]}
        >
          <Text style={{ fontSize: 36 }}>{item.category?.icon ?? "📦"}</Text>
        </View>
        <View style={s.cardBody}>
          <Text style={s.catBadge}>{item.category?.name}</Text>
          <Text style={s.productName} numberOfLines={2}>
            {item.name}
          </Text>
          {item.description ? (
            <Text style={s.description} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <View style={s.cardFooter}>
            <Text style={s.price}>{parseFloat(item.price).toFixed(2)} €</Text>
            <TouchableOpacity
              style={[s.addBtn, isAdded && s.addBtnAdded]}
              onPress={() => handleAdd(item)}
            >
              <Text style={s.addBtnText}>
                {isAdded ? "✓ Ajouté" : "+ Panier"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Hero */}
      <View style={s.hero}>
        <View style={s.heroRow}>
          <View>
            <Text style={s.heroTitle}>Catalogue</Text>
            <Text style={s.heroSub}>Composez votre commande</Text>
          </View>
          <TouchableOpacity
            style={s.cartBtn}
            onPress={() => navigation.navigate("CartTab")}
          >
            <Text style={s.cartBtnText}>🛒</Text>
            {totalItems > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtres catégories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.catScrollView}
        contentContainerStyle={s.catRow}
      >
        <TouchableOpacity
          style={[s.catTab, activeCategory === "" && s.catTabActive]}
          onPress={() => setActiveCategory("")}
        >
          <Text
            style={[s.catTabText, activeCategory === "" && s.catTabTextActive]}
          >
            Tout
          </Text>
        </TouchableOpacity>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              s.catTab,
              activeCategory === String(c.id) && s.catTabActive,
            ]}
            onPress={() => setActiveCategory(String(c.id))}
          >
            <Text
              style={[
                s.catTabText,
                activeCategory === String(c.id) && s.catTabTextActive,
              ]}
            >
              {c.icon ? `${c.icon} ` : ""}
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recherche */}
      <View style={s.searchRow}>
        <TextInput
          style={s.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Grille produits */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3B82F6"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={s.row}
          contentContainerStyle={s.listContent}
          ListEmptyComponent={
            <Text style={s.emptyText}>Aucun produit trouvé.</Text>
          }
        />
      )}

      {/* FAB commander */}
      {totalItems > 0 && (
        <TouchableOpacity style={s.fab} onPress={handleCheckout}>
          <Text style={s.fabText}>
            🛒 Commander ({totalItems}) — {totalPrice.toFixed(2)} €
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  hero: {
    backgroundColor: "#1E293B",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#fff" },
  heroSub: { color: "#BAE6FD", fontSize: 13, marginTop: 2 },
  cartBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    position: "relative",
  },
  cartBtnText: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  catScrollView: { maxHeight: 52 },
  catRow: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  catTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  catTabActive: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  catTabText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  catTabTextActive: { color: "#fff" },

  searchRow: { paddingHorizontal: 12, paddingBottom: 8 },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },

  listContent: { padding: 8, paddingBottom: 100 },
  row: { justifyContent: "space-between", paddingHorizontal: 4 },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    padding: 40,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  imgBox: { height: 90, alignItems: "center", justifyContent: "center" },
  cardBody: { padding: 10 },
  catBadge: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
  description: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: { fontSize: 15, fontWeight: "800", color: "#111827" },
  addBtn: {
    backgroundColor: "#3B82F6",
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addBtnAdded: { backgroundColor: "#10B981" },
  addBtnText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  fab: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#10B981",
    borderRadius: 50,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
