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

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrors({});
    setLoading(true);
    try {
      await register({ ...form, role: "client" });
      // RootNavigator redirige automatiquement selon user.role
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ _: [data?.message ?? "Erreur lors de l'inscription."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChangeText: (v) => setForm({ ...form, [key]: v }),
  });

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
            <Icon name="user" size={26} color="#0F172A" />
          </View>
          <Text style={s.title}>Créer un compte</Text>
          <Text style={s.subtitle}>Rejoignez delivery Pro</Text>

          {errors._ && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{errors._[0]}</Text>
            </View>
          )}

          <View style={s.field}>
            <Text style={s.label}>Nom complet</Text>
            <View style={s.inputWrap}>
              <Icon name="user" size={18} color="#64748B" />
              <TextInput
                style={s.input}
                placeholder="Jean Dupont"
                placeholderTextColor="#94A3B8"
                autoComplete="name"
                {...field("name")}
              />
            </View>
            {errors.name && <Text style={s.fieldError}>{errors.name[0]}</Text>}
          </View>

          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <View style={s.inputWrap}>
              <Icon name="mail" size={18} color="#64748B" />
              <TextInput
                style={s.input}
                placeholder="email@exemple.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                {...field("email")}
              />
            </View>
            {errors.email && (
              <Text style={s.fieldError}>{errors.email[0]}</Text>
            )}
          </View>

          <View style={s.field}>
            <Text style={s.label}>Mot de passe</Text>
            <View style={s.inputWrap}>
              <Icon name="lock" size={18} color="#64748B" />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                {...field("password")}
              />
            </View>
            {errors.password && (
              <Text style={s.fieldError}>{errors.password[0]}</Text>
            )}
          </View>

          <View style={s.field}>
            <Text style={s.label}>Confirmer le mot de passe</Text>
            <View style={s.inputWrap}>
              <Icon name="shield" size={18} color="#64748B" />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                {...field("password_confirmation")}
              />
            </View>
          </View>

          <TouchableOpacity
            style={s.btn}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={s.btnRow}>
                <Text style={s.btnText}>S'inscrire</Text>
                <Icon name="arrow" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={s.link}>
            <Text style={s.linkText}>
              Déjà un compte ? <Text style={s.linkAccent}>Se connecter</Text>
            </Text>
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
  if (name === "user") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="8" r="4" {...stroke} />
        <Path d="M4 20a8 8 0 0 1 16 0" {...stroke} />
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
  if (name === "shield") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
          {...stroke}
        />
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
    fontSize: 24,
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
  field: { marginBottom: 12 },
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
  fieldError: { color: "#DC2626", fontSize: 12, marginTop: 4 },
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
});
