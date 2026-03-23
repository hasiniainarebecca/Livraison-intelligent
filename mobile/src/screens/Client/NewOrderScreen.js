import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "../../components/client/Icon";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const SUGGESTIONS = [
  "Lot IVN 45, Analamahitsy",
  "Rue Pasteur, Isoraka",
  "Ankadimbahoaka",
  "Tsaralalana, centre-ville",
  "Ambohimanarina",
];

const DELIVERY_TYPES = [
  {
    id: "standard",
    label: "Standard",
    desc: "2–4h",
    emoji: "📦",
    price: "2 000 MGA",
  },
  {
    id: "express",
    label: "Express",
    desc: "30–60 min",
    emoji: "⚡",
    price: "4 500 MGA",
  },
];

const NewOrderScreen = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("standard");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 1 }]);
  const [note, setNote] = useState("");

  const addItem = () => setItems([...items, { name: "", qty: 1 }]);

  const updateItemName = (i, value) => {
    const next = [...items];
    next[i].name = value;
    setItems(next);
  };
  const updateItemQty = (i, delta) => {
    const next = [...items];
    next[i].qty = Math.max(1, next[i].qty + delta);
    setItems(next);
  };

  const STEP_LABELS = ["Adresse", "Articles", "Résumé"];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {/* ── Header ── */}
        <View
          style={{
            paddingTop: 52,
            paddingHorizontal: 22,
            paddingBottom: 20,
            backgroundColor: C.card,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => onNavigate(SCREENS.HOME)}
              style={{
                backgroundColor: C.bg,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="arrowLeft" size={18} color={C.text} />
            </TouchableOpacity>
            <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>
              Nouvelle commande
            </Text>
          </View>

          {/* Step indicator */}
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={{ flex: 1, gap: 4 }}>
                <View
                  style={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: s <= step ? C.primary : C.bgDeep,
                  }}
                />
                <Text
                  style={{
                    color: s <= step ? C.primary : C.muted,
                    fontSize: 10,
                    fontWeight: s === step ? "700" : "400",
                  }}
                >
                  {STEP_LABELS[s - 1]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Content ── */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 22 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step 1 — Address */}
          {step === 1 && (
            <View>
              <Text
                style={{
                  color: C.sub,
                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 16,
                }}
              >
                Type de livraison
              </Text>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
                {DELIVERY_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => setType(t.id)}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      backgroundColor: type === t.id ? C.primaryLt : C.card,
                      borderWidth: 2,
                      borderColor: type === t.id ? C.primary : C.border,
                      borderRadius: 16,
                      padding: 16,
                    }}
                  >
                    <Text style={{ fontSize: 28, marginBottom: 8 }}>
                      {t.emoji}
                    </Text>
                    <Text
                      style={{
                        color: C.text,
                        fontWeight: "800",
                        fontSize: 15,
                        marginBottom: 3,
                      }}
                    >
                      {t.label}
                    </Text>
                    <Text
                      style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}
                    >
                      {t.desc}
                    </Text>
                    <Text
                      style={{
                        color: type === t.id ? C.primary : C.muted,
                        fontWeight: "700",
                        fontSize: 12,
                      }}
                    >
                      {t.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={{
                  color: C.sub,
                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 10,
                }}
              >
                Adresse de livraison
              </Text>
              <View
                style={{
                  backgroundColor: C.card,
                  borderWidth: 1.5,
                  borderColor: address ? C.primary : C.border,
                  borderRadius: 14,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <Icon
                  name="location"
                  size={18}
                  color={address ? C.primary : C.muted}
                />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Entrez l'adresse de livraison..."
                  placeholderTextColor={C.muted}
                  style={{ flex: 1, color: C.text, fontSize: 14 }}
                />
              </View>

              <Text
                style={{
                  color: C.muted,
                  fontSize: 11,
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Adresses récentes
              </Text>
              <View style={{ gap: 6 }}>
                {SUGGESTIONS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setAddress(s)}
                    style={{
                      backgroundColor: C.card,
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 12,
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Icon name="location" size={14} color={C.muted} />
                    <Text style={{ color: C.sub, fontSize: 13 }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={{
                  color: C.sub,
                  fontSize: 13,
                  fontWeight: "600",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Note pour le livreur (optionnel)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Ex: Sonner deux fois, 2e étage..."
                placeholderTextColor={C.muted}
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: C.card,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 14,
                  padding: 14,
                  color: C.text,
                  fontSize: 13,
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
            </View>
          )}

          {/* Step 2 — Items */}
          {step === 2 && (
            <View>
              <Text
                style={{
                  color: C.sub,
                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 16,
                }}
              >
                Articles à livrer
              </Text>
              {items.map((item, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: C.card,
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: C.primaryLt,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="package" size={18} color={C.primary} />
                    </View>
                    <Text
                      style={{ color: C.text, fontWeight: "700", fontSize: 13 }}
                    >
                      Article {i + 1}
                    </Text>
                  </View>

                  <TextInput
                    value={item.name}
                    onChangeText={(v) => updateItemName(i, v)}
                    placeholder="Description de l'article"
                    placeholderTextColor={C.muted}
                    style={{
                      backgroundColor: C.bg,
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 10,
                      padding: 10,
                      color: C.text,
                      fontSize: 13,
                      marginBottom: 8,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ color: C.muted, fontSize: 12 }}>
                      Quantité :
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: C.bg,
                        borderRadius: 10,
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: C.border,
                      }}
                    >
                      <TouchableOpacity onPress={() => updateItemQty(i, -1)}>
                        <Text
                          style={{
                            color: C.primary,
                            fontWeight: "900",
                            fontSize: 18,
                            lineHeight: 22,
                          }}
                        >
                          −
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: C.text,
                          fontWeight: "700",
                          fontSize: 14,
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {item.qty}
                      </Text>
                      <TouchableOpacity onPress={() => updateItemQty(i, 1)}>
                        <Text
                          style={{
                            color: C.primary,
                            fontWeight: "900",
                            fontSize: 18,
                            lineHeight: 22,
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={addItem}
                style={{
                  backgroundColor: C.bg,
                  borderWidth: 1.5,
                  borderColor: C.border,
                  borderStyle: "dashed",
                  borderRadius: 14,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Icon name="plus" size={16} color={C.primary} />
                <Text
                  style={{ color: C.primary, fontWeight: "700", fontSize: 14 }}
                >
                  Ajouter un article
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3 — Summary */}
          {step === 3 && (
            <View>
              <Text
                style={{
                  color: C.sub,
                  fontSize: 13,
                  fontWeight: "600",
                  marginBottom: 16,
                }}
              >
                Résumé de la commande
              </Text>

              {/* Type + Address + Note */}
              <View
                style={{
                  backgroundColor: C.card,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: C.muted, fontSize: 12 }}>Type</Text>
                  <View
                    style={{
                      backgroundColor:
                        type === "express" ? C.accentLt : C.primaryLt,
                      borderRadius: 10,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: type === "express" ? C.accent : C.primary,
                        fontSize: 12,
                        fontWeight: "700",
                      }}
                    >
                      {type === "express" ? "⚡ Express" : "📦 Standard"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: C.border,
                    marginVertical: 10,
                  }}
                />

                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}
                  >
                    Adresse
                  </Text>
                  <Text
                    style={{ color: C.text, fontSize: 13, fontWeight: "600" }}
                  >
                    {address || "Non renseignée"}
                  </Text>
                </View>

                {!!note && (
                  <>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: C.border,
                        marginVertical: 10,
                      }}
                    />
                    <Text
                      style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}
                    >
                      Note
                    </Text>
                    <Text style={{ color: C.text, fontSize: 13 }}>{note}</Text>
                  </>
                )}
              </View>

              {/* Items + Total */}
              <View
                style={{
                  backgroundColor: C.card,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: C.muted,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontWeight: "600",
                    marginBottom: 10,
                  }}
                >
                  Articles
                </Text>
                {items
                  .filter((i) => i.name)
                  .map((item, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{ color: C.text, fontSize: 13 }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: C.muted, fontSize: 13 }}>
                        ×{item.qty}
                      </Text>
                    </View>
                  ))}
                <View
                  style={{
                    height: 1,
                    backgroundColor: C.border,
                    marginVertical: 12,
                  }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: C.muted, fontSize: 13 }}>
                    Frais de livraison
                  </Text>
                  <Text
                    style={{ color: C.text, fontSize: 13, fontWeight: "600" }}
                  >
                    {type === "express" ? "4 500" : "2 000"} MGA
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ color: C.text, fontSize: 14, fontWeight: "800" }}
                  >
                    Total estimé
                  </Text>
                  <Text
                    style={{
                      color: C.primary,
                      fontSize: 15,
                      fontWeight: "900",
                    }}
                  >
                    {type === "express" ? "~46 500" : "~44 000"} MGA
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Footer Buttons ── */}
        <View
          style={{
            paddingHorizontal: 22,
            paddingVertical: 12,
            paddingBottom: 28,
            backgroundColor: C.card,
            borderTopWidth: 1,
            borderTopColor: C.border,
            flexDirection: "row",
            gap: 10,
          }}
        >
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              style={{
                flex: 1,
                backgroundColor: C.bg,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 14,
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: C.text, fontWeight: "700", fontSize: 15 }}>
                Retour
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              if (step < 3) setStep(step + 1);
              else onNavigate(SCREENS.CONFIRM);
            }}
            style={{
              flex: 2,
              backgroundColor: C.primary,
              borderRadius: 14,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              shadowColor: C.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {step === 3 ? (
              <>
                <Icon name="check" size={18} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}
                >
                  Confirmer la commande
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}
                >
                  Continuer
                </Text>
                <Icon name="arrow" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewOrderScreen;
