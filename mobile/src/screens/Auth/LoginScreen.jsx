import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Svg, Path, Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      // La navigation est gérée par RootNavigator via le changement d'état user
    } catch (err) {
      alert(err);
      alert(process.env.EXPO_PUBLIC_API_URL);
      setError(
        err.response?.data?.message ?? "Email ou mot de passe incorrect.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={s.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.bgOrbA} />
        <View style={s.bgOrbB} />

        <View style={s.card}>
          <View style={s.logoWrap}>
            <Icon name="door" size={26} color="#0F172A" />
          </View>
          <Text style={s.title}>Connexion</Text>
          <Text style={s.subtitle}>Bienvenue sur delivery Pro</Text>

          {error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <Icon name="mail" size={18} color="#64748B" />
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="client@test.com"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Mot de passe</Text>
            <View style={s.inputWrap}>
              <Icon name="lock" size={18} color="#64748B" />
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <TouchableOpacity
            style={s.btn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={s.btnRow}>
                <Text style={s.btnText}>Se connecter</Text>
                <Icon name="arrow" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={s.link}
          >
            <Text style={s.linkText}>
              Pas encore de compte ?{" "}
              <Text style={s.linkAccent}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Catalog")}
            style={s.link}
          >
            <Text style={s.linkMuted}>
              Parcourir le catalogue sans connexion →
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("client")}
            style={s.link}
          >
            <Text style={s.linkMuted}>voir le design client →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("livreur")}
            style={s.link}
          >
            <Text style={s.linkMuted}>voir le design livreur →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Icon({ name, size = 20, color = "#0F172A" }) {
  const stroke = {
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };
  if (name === "door") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7" {...stroke} />
        <Path d="M7 3v18" {...stroke} />
        <Circle cx="14.5" cy="12" r="0.8" fill={color} />
      </Svg>
    );
  }
  if (name === "mail") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
          {...stroke}
        />
        <Path d="M22 8l-10 6L2 8" {...stroke} />
      </Svg>
    );
  }
  if (name === "lock") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"
          {...stroke}
        />
        <Path d="M8 11V8a4 4 0 1 1 8 0v3" {...stroke} />
      </Svg>
    );
  }
  if (name === "arrow") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path d="M5 12h12" {...stroke} />
        <Path d="M13 6l6 6-6 6" {...stroke} />
      </Svg>
    );
  }
  return null;
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#F8FAFC",
  },
  bgOrbA: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#E2E8F0",
  },
  bgOrbB: {
    position: "absolute",
    bottom: -60,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DBEAFE",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#0F172A",
  },
  subtitle: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: { color: "#DC2626", fontSize: 13 },
  field: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 15, color: "#0F172A" },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },
  btnRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { marginTop: 14, alignItems: "center" },
  linkText: { fontSize: 14, color: "#334155" },
  linkAccent: { color: "#2563EB", fontWeight: "700" },
  linkMuted: { fontSize: 13, color: "#6B7280" },
});
