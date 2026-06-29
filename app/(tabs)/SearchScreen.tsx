import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import {
  searchRecords,
  updateRecord,
  deleteRecord,
  resetData,
  seedIfEmpty,
} from "../../src/services/dataService";
import { useAppStore } from "../../src/store/appStore";
import {
  useColors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
} from "../../src/theme";
import {
  Button,
  Badge,
  SectionHeader,
  EmptyState,
  Divider,
  RowItem,
} from "../../src/components/ui";
import type {
  PricingRecord,
  SearchFilters,
  EditPayload,
} from "../../src/types";
import { DEFAULT_FILTERS } from "../../src/types";
import { Card } from "@/components/Card";

const PAGE_SIZE = 25;
const STATIC_STORE_IDS = ["NYC-001", "LAX-002", "CHI-003", "SEA-004"];

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({
  record,
  onClose,
  onSave,
}: {
  record: PricingRecord;
  onClose: () => void;
  onSave: (p: EditPayload) => void;
}) {
  const c = useColors();
  const [price, setPrice] = useState(String(record.price));
  const [name, setName] = useState(record.productName);

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: c.bgPage }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.modalHeader,
            { borderBottomColor: c.border, backgroundColor: c.surface1 },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <Ionicons name="close" size={22} color={c.textSecondary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.lg,
              fontWeight: FontWeight.semibold,
              color: c.textPrimary,
              flex: 1,
              textAlign: "center",
            }}
          >
            Edit record
          </Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: Spacing.xl, gap: Spacing.lg }}
        >
          {/* Read-only info */}
          <Card>
            <RowItem label="Store ID" value={record.storeId} />
            <Divider />
            <RowItem
              label="SKU"
              value={record.sku}
              valueStyle={{
                fontFamily: "monospace",
                color: useColors().textAccent,
              }}
            />
            <Divider />
            <RowItem label="Date" value={record.date} />
            <Divider />
            <RowItem label="Currency" value={record.currency} />
          </Card>

          {/* Editable fields */}
          <View>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>
              Product name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                styles.input,
                {
                  borderColor: c.borderStrong,
                  backgroundColor: c.surface2,
                  color: c.textPrimary,
                },
              ]}
              placeholder="Product name"
              placeholderTextColor={c.textMuted}
            />
          </View>

          <View>
            <Text style={[styles.fieldLabel, { color: c.textSecondary }]}>
              Price ({record.currency})
            </Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              style={[
                styles.input,
                {
                  borderColor: c.borderStrong,
                  backgroundColor: c.surface2,
                  color: c.textPrimary,
                },
              ]}
              placeholder="0.00"
              placeholderTextColor={c.textMuted}
            />
          </View>

          <Button
            label="Save changes"
            onPress={() => {
              const p = parseFloat(price);
              if (isNaN(p) || p < 0) {
                Alert.alert(
                  "Invalid price",
                  "Enter a valid non-negative number.",
                );
                return;
              }
              if (!name.trim()) {
                Alert.alert("Invalid name", "Product name cannot be empty.");
                return;
              }
              onSave({
                id: record.id,
                price: Math.round(p * 100) / 100,
                productName: name.trim(),
              });
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Record Row ───────────────────────────────────────────────────────────────

function RecordRow({
  record,
  onEdit,
  onDelete,
}: {
  record: PricingRecord;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const c = useColors();
  return (
    <View
      style={[
        styles.recordRow,
        { borderBottomColor: c.border, backgroundColor: c.surface1 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: FontSize.sm,
            fontWeight: FontWeight.medium,
            color: c.textPrimary,
          }}
          numberOfLines={1}
        >
          {record.productName}
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 3 }}>
          <Text
            style={{
              fontSize: FontSize.xs,
              color: c.textAccent,
              fontFamily: "monospace",
            }}
          >
            {record.sku}
          </Text>
          <Text style={{ fontSize: FontSize.xs, color: c.textMuted }}>
            {record.storeId}
          </Text>
          <Text style={{ fontSize: FontSize.xs, color: c.textMuted }}>
            {record.date}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end", gap: 8 }}>
        <Text
          style={{
            fontSize: FontSize.base,
            fontWeight: FontWeight.semibold,
            color: c.textPrimary,
          }}
        >
          {record.currency} {record.price.toFixed(2)}
        </Text>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <TouchableOpacity onPress={onEdit} style={[styles.iconBtn]}>
            <Ionicons name="pencil" size={14} color={c.textAccent} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Delete record",
                "This will soft-delete the record. Continue?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: onDelete },
                ],
              )
            }
            style={[styles.iconBtn]}
          >
            <Ionicons name="trash" size={14} color={c.textDanger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const c = useColors();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [editRecord, setEditRecord] = useState<PricingRecord | null>(null);
  const [showStoreAccordion, setShowStoreAccordion] = useState(false);
  const { addNotification } = useAppStore();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["records", applied, page],
    queryFn: () => searchRecords(applied, page, PAGE_SIZE),
  });

  const editMutation = useMutation({
    mutationFn: updateRecord,
    onSuccess() {
      setEditRecord(null);
      qc.invalidateQueries({ queryKey: ["records"] });
      addNotification("success", "Record updated");
    },
    onError: (e: Error) => addNotification("error", "Update failed", e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["records"] });
      addNotification("success", "Record deleted");
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      await resetData();
      await seedIfEmpty();
    },
    onSuccess() {
      const cleared = { ...DEFAULT_FILTERS };
      setFilters(cleared);
      setApplied(cleared);
      setPage(1);
      qc.invalidateQueries({ queryKey: ["records"] });
      qc.invalidateQueries({ queryKey: ["batches"] });
      addNotification(
        "success",
        "Data reset",
        "App data restored to default sample records.",
      );
    },
    onError: (e: Error) => addNotification("error", "Reset failed", e.message),
  });

  const confirmReset = useCallback(() => {
    Alert.alert(
      "Reset all data",
      "This will clear stored records and restore the app to the default sample dataset.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetMutation.mutate(),
        },
      ],
    );
  }, [resetMutation]);

  const applyFilters = useCallback(
    (nextFilters: SearchFilters = filters) => {
      setApplied(nextFilters);
      setPage(1);
    },
    [filters],
  );

  const total = query.data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const records = query.data?.records ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: c.bgPage }}>
      {/* Store ID accordion */}
      <View
        style={[
          styles.filterCard,
          { backgroundColor: c.surface1, borderColor: c.border },
        ]}
      >
        <TouchableOpacity
          style={styles.filterCardHeader}
          onPress={() => setShowStoreAccordion((value) => !value)}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: FontSize.sm,
                fontWeight: FontWeight.medium,
                color: c.textPrimary,
              }}
            >
              Store ID
            </Text>
            <Text
              style={{
                fontSize: FontSize.xs,
                color: c.textMuted,
                marginTop: 2,
              }}
            >
              {filters.storeId || "All stores"}
            </Text>
          </View>
          <Ionicons
            name={showStoreAccordion ? "chevron-up" : "chevron-down"}
            size={18}
            color={c.textSecondary}
          />
        </TouchableOpacity>

        {showStoreAccordion && (
          <View style={styles.storeOptions}>
            {STATIC_STORE_IDS.map((id) => {
              const active = filters.storeId === id;
              return (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    setFilters((current) => ({ ...current, storeId: id }));
                    setShowStoreAccordion(false);
                  }}
                  style={[
                    {
                      padding: 10,
                      borderBottomWidth: 1,
                      backgroundColor: active ? c.fillAccent : c.surface2,
                      borderColor: active ? c.fillAccent : c.borderStrong,
                    },
                  ]}
                >
                  <Text style={{ color: active ? "#fff" : c.textPrimary }}>
                    {id}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ marginTop: Spacing.md }}>
          <Text
            style={{
              fontSize: FontSize.sm,
              fontWeight: FontWeight.medium,
              color: c.textSecondary,
              marginBottom: 6,
            }}
          >
            Please input keyword
          </Text>
          <TextInput
            value={filters.query}
            onChangeText={(value) =>
              setFilters((current) => ({ ...current, query: value }))
            }
            placeholder="Type keyword or text"
            placeholderTextColor={c.textMuted}
            style={[
              styles.input,
              {
                borderColor: c.borderStrong,
                backgroundColor: c.surface2,
                color: c.textPrimary,
              },
            ]}
          />

          <View style={{ flexDirection: "row", gap: 8, marginTop: Spacing.sm }}>
            <Button
              label="Filter"
              onPress={() => {
                applyFilters(filters);
                setShowStoreAccordion(false);
              }}
              style={{ flex: 1 }}
            />
            <Button
              label="Clear filter"
              variant="secondary"
              onPress={() => {
                const cleared = { ...DEFAULT_FILTERS };
                setFilters(cleared);
                applyFilters(cleared);
                setShowStoreAccordion(false);
              }}
              style={{ flex: 1 }}
            />
          </View>
          <View style={{ marginTop: Spacing.sm }}>
            <Button
              label="Reset data"
              variant="danger"
              loading={resetMutation.isPending}
              disabled={resetMutation.isPending}
              onPress={confirmReset}
            />
          </View>
        </View>
      </View>

      {/* Result count */}
      <View
        style={[
          styles.resultCount,
          { backgroundColor: c.surface0, borderBottomColor: c.border },
        ]}
      >
        <Text style={{ fontSize: FontSize.xs, color: c.textMuted }}>
          {query.isLoading ? "Loading…" : `${total.toLocaleString()} records`}
          {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={records}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <RecordRow
            record={item}
            onEdit={() => setEditRecord(item)}
            onDelete={() => deleteMutation.mutate(item.id)}
          />
        )}
        ListEmptyComponent={
          !query.isLoading ? (
            <EmptyState
              icon={<Ionicons name="search" size={48} color={c.textMuted} />}
              title="No records found"
              subtitle="Try adjusting your search or clearing filters."
            />
          ) : null
        }
        // Pagination footer
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={[styles.pagination, { borderTopColor: c.border }]}>
              <Button
                label="Previous"
                variant="secondary"
                small
                disabled={page === 1}
                onPress={() => setPage((p) => p - 1)}
                icon={
                  <Ionicons
                    name="chevron-back"
                    size={14}
                    color={c.textSecondary}
                  />
                }
              />
              <Text style={{ fontSize: FontSize.sm, color: c.textSecondary }}>
                {page} / {totalPages}
              </Text>
              <Button
                label="Next"
                variant="secondary"
                small
                disabled={page >= totalPages}
                onPress={() => setPage((p) => p + 1)}
                icon={
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={c.textSecondary}
                  />
                }
              />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Edit modal */}
      {editRecord && (
        <EditModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSave={(p) => editMutation.mutate(p)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: 8,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  filterCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  filterCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  storeOptions: {
    flexWrap: "wrap",
    gap: 8,
    marginTop: Spacing.sm,
  },
  storeChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  resultCount: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 7,
    borderBottomWidth: 1,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSize.base,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
});
