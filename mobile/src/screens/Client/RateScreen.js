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
import { Svg, Polygon } from "react-native-svg";
import Icon from "../../components/client/Icon";
import { C } from "../../constants/client/colors";
import { SCREENS } from "../../constants/client/screens";

const TAGS = [
  "Rapide",
  "Soigneux",
  "Ponctuel",
  "Bien emballé",
  "Sympathique",
  "Professionnel",
];
const LABELS = [
  "",
  "Très déçu 😔",
  "Décevant 😕",
  "Correct 😐",
  "Bien 😊",
  "Excellent ! 🌟",
];

const RateScreen = ({ order, onNavigate }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  if (submitted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: C.bg,
          alignItems: "center",
          justifyContent: "center",
          padding: 30,
        }}
      >
        <Text style={{ fontSize: 80, marginBottom: 20 }}>⭐</Text>
        <Text
          style={{
            color: C.text,
            fontSize: 24,
            fontWeight: "900",
            marginBottom: 10,
          }}
        >
          Merci !
        </Text>
        <Text
          style={{
            color: C.muted,
            fontSize: 14,
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 20,
          }}
        >
          Votre évaluation aide notre communauté de livreurs à s'améliorer.
        </Text>
        <TouchableOpacity
          onPress={() => onNavigate(SCREENS.HOME)}
          style={{
            backgroundColor: C.primary,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 40,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
            Retour à l'accueil
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            paddingBottom: 16,
            backgroundColor: C.card,
            borderBottomWidth: 1,
            borderBottomColor: C.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
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
              Évaluer la livraison
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 22 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Driver card */}
          {order && (
            <View
              style={{
                backgroundColor: C.card,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: C.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "900", fontSize: 20 }}
                >
                  {order.driver.name[0]}
                </Text>
              </View>
              <View>
                <Text
                  style={{ color: C.text, fontWeight: "700", fontSize: 15 }}
                >
                  {order.driver.name}
                </Text>
                <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                  {order.id}
                </Text>
              </View>
            </View>
          )}

          {/* Stars */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Text
              style={{
                color: C.sub,
                fontSize: 15,
                fontWeight: "700",
                marginBottom: 16,
              }}
            >
              Comment s'est passée votre livraison ?
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= rating;
                return (
                  <TouchableOpacity key={s} onPress={() => setRating(s)}>
                    <Svg width={40} height={40} viewBox="0 0 24 24">
                      <Polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        fill={filled ? C.yellow : "none"}
                        stroke={filled ? C.yellow : C.border}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                );
              })}
            </View>
            {rating > 0 && (
              <Text
                style={{
                  color: C.primary,
                  fontWeight: "700",
                  fontSize: 14,
                  marginTop: 10,
                }}
              >
                {LABELS[rating]}
              </Text>
            )}
          </View>

          {/* Tags */}
          <Text
            style={{
              color: C.sub,
              fontSize: 13,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            Ce qui s'est démarqué
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={{
                    backgroundColor: selected ? C.primaryLt : C.card,
                    borderWidth: 1.5,
                    borderColor: selected ? C.primary : C.border,
                    borderRadius: 20,
                    paddingVertical: 7,
                    paddingHorizontal: 16,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? C.primary : C.muted,
                      fontWeight: selected ? "700" : "400",
                      fontSize: 13,
                    }}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Comment */}
          <Text
            style={{
              color: C.sub,
              fontSize: 13,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            Ajouter un commentaire
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Partagez votre expérience..."
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: C.card,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 14,
              padding: 14,
              color: C.text,
              fontSize: 13,
              minHeight: 100,
              textAlignVertical: "top",
            }}
          />
        </ScrollView>

        {/* ── Submit ── */}
        <View
          style={{
            paddingHorizontal: 22,
            paddingVertical: 12,
            paddingBottom: 28,
            backgroundColor: C.card,
            borderTopWidth: 1,
            borderTopColor: C.border,
          }}
        >
          <TouchableOpacity
            onPress={() => setSubmitted(true)}
            disabled={rating === 0}
            style={{
              backgroundColor: rating > 0 ? C.yellow : C.bg,
              borderWidth: 1,
              borderColor: rating > 0 ? C.yellow : C.border,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: rating > 0 ? 1 : 0.6,
            }}
          >
            <Icon name="star" size={18} color={rating > 0 ? "#fff" : C.muted} />
            <Text
              style={{
                color: rating > 0 ? "#fff" : C.muted,
                fontWeight: "800",
                fontSize: 16,
              }}
            >
              Envoyer l'évaluation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RateScreen;
