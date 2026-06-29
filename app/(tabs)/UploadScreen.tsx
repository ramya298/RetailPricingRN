import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { pickAndParseCSV } from "../../src/services/csvService";
import { ingestCSV } from "../../src/services/dataService";
import { useAppStore } from "../../src/store/appStore";
import {
  useColors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
} from "../../src/theme";
import { Card, SectionHeader, StatCard, Badge } from "../../src/components/ui";
import type { ParseResult } from "../../src/types";

export default function UploadScreen() {
  const c = useColors();
  const [result, setResult] = useState<ParseResult | null>(null);
  const [filename, setFilename] = useState("");
  const { addNotification } = useAppStore();
  const qc = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const picked = await pickAndParseCSV();
      if (!picked) return null; // user cancelled

      if (picked.headerErrors.length) {
        throw new Error(picked.headerErrors.join("\n"));
      }
      if (picked.parseErrors.length && picked.rows.length === 0) {
        throw new Error(
          "Could not parse CSV: " + picked.parseErrors[0].message,
        );
      }

      setFilename(picked.filename);
      return ingestCSV(picked.rows, picked.filename);
    },
    onSuccess(data) {
      if (!data) return;
      setResult(data);
      qc.invalidateQueries({ queryKey: ["records"] });
      qc.invalidateQueries({ queryKey: ["batches"] });
      if (data.errors.length === 0) {
        addNotification(
          "success",
          "Upload complete",
          `${data.records.length} records ingested.`,
        );
      } else {
        addNotification(
          "warning",
          "Upload complete with warnings",
          `${data.records.length} ingested, ${data.errors.length} rows skipped.`,
        );
      }
    },
    onError(err: Error) {
      addNotification("error", "Upload failed", err.message);
    },
  });

  const reset = () => {
    setResult(null);
    setFilename("");
    uploadMutation.reset();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.bgPage }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ marginBottom: Spacing.xl }}>
        <Text
          style={{
            fontSize: FontSize.xxl,
            fontWeight: FontWeight.semibold,
            color: c.textPrimary,
          }}
        >
          {"Upload CSV file"}
        </Text>
      </View>

      {/* Upload button */}
      {!result && (
        <TouchableOpacity
          style={[
            styles.dropZone,
            {
              borderColor: uploadMutation.isPending
                ? c.borderAccent
                : c.borderStrong,
              backgroundColor: uploadMutation.isPending
                ? c.bgAccent
                : c.surface1,
            },
          ]}
          onPress={() => uploadMutation.mutate()}
          disabled={uploadMutation.isPending}
          activeOpacity={0.8}
        >
          {uploadMutation.isPending ? (
            <>
              <ActivityIndicator
                size="large"
                color={c.fillAccent}
                style={{ marginBottom: 12 }}
              />
              <Text style={[styles.dropTitle, { color: c.textAccent }]}>
                Processing {filename}…
              </Text>
              <Text style={[styles.dropSub, { color: c.textMuted }]}>
                Parsing and validating rows
              </Text>
            </>
          ) : (
            <>
              <View
                style={[styles.iconCircle, { backgroundColor: c.bgAccent }]}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={32}
                  color={c.fillAccent}
                />
              </View>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Result */}
      {result && (
        <Card style={{ marginBottom: Spacing.xl }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing.lg,
            }}
          >
            <Ionicons
              name={result.errors.length === 0 ? "checkmark-circle" : "warning"}
              size={22}
              color={result.errors.length === 0 ? c.textSuccess : c.textWarning}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: FontSize.lg,
                fontWeight: FontWeight.semibold,
                color: c.textPrimary,
                flex: 1,
              }}
            >
              {result.errors.length === 0
                ? "Upload successful"
                : "Upload complete with warnings"}
            </Text>
            <TouchableOpacity onPress={reset}>
              <Ionicons name="close" size={20} color={c.textMuted} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: FontSize.sm,
              color: c.textMuted,
              marginBottom: Spacing.md,
            }}
          >
            {filename}
          </Text>

          {/* Stats */}
          <View
            style={{ flexDirection: "row", gap: 8, marginBottom: Spacing.lg }}
          >
            <StatCard label="Total rows" value={result.totalRows} />
            <StatCard
              label="Ingested"
              value={result.records.length}
              color={c.textSuccess}
            />
            <StatCard
              label="Errors"
              value={result.errors.length}
              color={result.errors.length ? c.textDanger : c.textSuccess}
            />
          </View>

          {/* Error list */}
          {result.errors.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: FontSize.sm,
                  fontWeight: FontWeight.medium,
                  color: c.textPrimary,
                  marginBottom: 8,
                }}
              >
                Row errors ({result.errors.length})
              </Text>
              {result.errors.slice(0, 20).map((e, i) => (
                <View
                  key={i}
                  style={[styles.errorRow, { borderBottomColor: c.border }]}
                >
                  <Text
                    style={{
                      fontSize: FontSize.xs,
                      color: c.textMuted,
                      width: 52,
                    }}
                  >
                    Row {e.row}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.xs,
                      color: c.textWarning,
                      fontFamily: "monospace",
                      width: 90,
                    }}
                  >
                    {e.field}
                  </Text>
                  <Text
                    style={{
                      fontSize: FontSize.xs,
                      color: c.textSecondary,
                      flex: 1,
                    }}
                  >
                    {e.message}
                  </Text>
                </View>
              ))}
              {result.errors.length > 20 && (
                <Text
                  style={{
                    fontSize: FontSize.xs,
                    color: c.textMuted,
                    marginTop: 6,
                  }}
                >
                  + {result.errors.length - 20} more errors
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[styles.uploadAgainBtn, { borderColor: c.borderStrong }]}
            onPress={reset}
          >
            <Ionicons
              name="document-outline"
              size={14}
              color={c.textSecondary}
            />
            <Text
              style={{
                fontSize: FontSize.sm,
                color: c.textSecondary,
                marginLeft: 6,
              }}
            >
              Upload another file
            </Text>
          </TouchableOpacity>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: 40 },
  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: Radius.lg,
    padding: Spacing.xxxl,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  dropTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: 6,
  },
  dropSub: { fontSize: FontSize.sm, textAlign: "center" },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    gap: 8,
    borderBottomWidth: 1,
  },
  uploadAgainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  refTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.md,
  },
  refRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
});
