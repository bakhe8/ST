import React, { useState, useEffect } from 'react';
import { apiUrl } from '../services/api';

interface PageComponent {
  id: string;
  name: string;
  icon?: string;
  propsSchema: any;
  defaultProps: any;
  isThemeSpecial?: boolean;
  path?: string;
  fields?: any[];
}

interface PageElement {
  id: string;
  componentId: string;
  props: any;
  visibility?: PageElementVisibility;
}

type PageElementViewport = 'all' | 'desktop' | 'mobile';

interface PageElementVisibility {
  enabled: boolean;
  viewport: PageElementViewport;
}

type HiddenFieldSavePolicy = 'preserve' | 'clear';

interface BooleanFieldControlProps {
  label: string;
  checked: boolean;
  format?: string;
  description?: string;
  compact?: boolean;
  onChange: (next: boolean) => void;
}

interface TextualFieldControlProps {
  label: string;
  value: string;
  description?: string;
  placeholder?: string;
  multiline?: boolean;
  direction?: 'rtl' | 'ltr' | 'inherit';
  compact?: boolean;
  disabled?: boolean;
  showImagePreview?: boolean;
  onChange: (next: string) => void;
}

interface SelectionFieldOption {
  value: string;
  label: string;
}

interface SelectionFieldControlProps {
  label: string;
  options: SelectionFieldOption[];
  selectedValues: string[];
  multiple?: boolean;
  description?: string;
  compact?: boolean;
  onChange: (nextValues: string[]) => void;
}

interface NumericFieldControlProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  description?: string;
  compact?: boolean;
  onChange: (nextValue: number) => void;
}

// Utility to parse fields from twilight.json component schema
function parsePropsSchema(fields: any[]): { [key: string]: any } {
  const schema: any = {};
  fields?.forEach(field => {
    if (field.type === 'static') return;
    schema[field.id] = field.format || field.type || 'string';
  });
  return schema;
}

function pickLocalizedText(value: any): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    if (typeof value.ar === 'string' && value.ar.trim()) return value.ar;
    if (typeof value.en === 'string' && value.en.trim()) return value.en;
    const firstString = Object.values(value).find((entry: any) => typeof entry === 'string' && entry.trim());
    if (typeof firstString === 'string') return firstString;
  }
  return String(value);
}

function normalizeItemsFieldValue(value: any): string[] {
  const source = Array.isArray(value) ? value : [value];
  return Array.from(
    new Set(
      source
        .map((entry: any) => {
          if (typeof entry === 'string' || typeof entry === 'number') return String(entry);
          if (entry && typeof entry === 'object') {
            if (entry.id != null) return String(entry.id);
            if (entry.value != null) return String(entry.value);
          }
          return '';
        })
        .map((id: string) => id.trim())
        .filter(Boolean)
    )
  );
}

function normalizeVariableListValue(value: any): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    const first = value.find((entry) => entry != null);
    return normalizeVariableListValue(first);
  }
  if (value && typeof value === 'object') {
    const candidate = (value as any).url ?? (value as any).value ?? (value as any).path ?? '';
    return typeof candidate === 'string' ? candidate : String(candidate || '');
  }
  return '';
}

function getCollectionFieldPathTail(fieldId: string): string {
  const normalized = String(fieldId || '');
  const parts = normalized.split('.');
  return parts[parts.length - 1] || normalized;
}

function normalizeCollectionItems(value: any): Record<string, any>[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({ ...entry }));
}

function getCollectionItemValue(item: any, fieldId: string): any {
  if (!item || typeof item !== 'object') return undefined;
  if (item[fieldId] != null) return item[fieldId];
  const shortKey = getCollectionFieldPathTail(fieldId);
  return item[shortKey];
}

function setCollectionItemValue(item: any, fieldId: string, value: any) {
  const next = { ...(item || {}) };
  next[fieldId] = value;
  const shortKey = getCollectionFieldPathTail(fieldId);
  if (shortKey !== fieldId && Object.prototype.hasOwnProperty.call(next, shortKey)) {
    delete next[shortKey];
  }
  return next;
}

function getCollectionSubFieldDefaultValue(subField: any): any {
  if (subField?.type === 'boolean') return Boolean(subField.value);
  if (subField?.type === 'number' || subField?.format === 'integer') {
    const parsed = Number(subField?.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (subField?.type === 'items' && subField?.format === 'variable-list') {
    return normalizeVariableListValue(subField?.value);
  }
  if (typeof subField?.value !== 'undefined') return pickLocalizedText(subField.value);
  return '';
}

function createCollectionItemTemplate(field: any): Record<string, any> {
  const template: Record<string, any> = {};
  (field?.fields ?? []).forEach((subField: any) => {
    if (!subField?.id) return;
    template[subField.id] = getCollectionSubFieldDefaultValue(subField);
  });
  return template;
}

function normalizeConditionOperator(operator: any): string {
  return String(operator || '=').trim().toLowerCase();
}

function normalizeComparableScalar(value: any): any {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const lowered = trimmed.toLowerCase();
    if (lowered === 'true') return true;
    if (lowered === 'false') return false;
    const asNumber = Number(trimmed);
    if (trimmed !== '' && Number.isFinite(asNumber)) return asNumber;
    return trimmed;
  }
  return value;
}

function valueEquals(actual: any, expected: any): boolean {
  const normalizedActual = normalizeComparableScalar(actual);
  const normalizedExpected = normalizeComparableScalar(expected);
  return normalizedActual === normalizedExpected;
}

function resolveConditionValue(
  conditionId: string,
  props: Record<string, any>,
  collectionItem?: Record<string, any>
): any {
  const id = String(conditionId || '').trim();
  if (!id) return undefined;

  if (collectionItem && typeof collectionItem === 'object') {
    const fromCollection = getCollectionItemValue(collectionItem, id);
    if (typeof fromCollection !== 'undefined') return fromCollection;
    const shortKey = getCollectionFieldPathTail(id);
    if (typeof collectionItem[shortKey] !== 'undefined') return collectionItem[shortKey];
  }

  if (props && typeof props === 'object') {
    if (typeof props[id] !== 'undefined') return props[id];
    const shortKey = getCollectionFieldPathTail(id);
    if (typeof props[shortKey] !== 'undefined') return props[shortKey];
  }

  return undefined;
}

function evaluateFieldConditions(
  field: any,
  props: Record<string, any>,
  collectionItem?: Record<string, any>
): boolean {
  if (field?.hide === true) return false;

  const conditions = Array.isArray(field?.conditions) ? field.conditions : [];
  if (conditions.length === 0) return true;

  return conditions.every((condition: any) => {
    const op = normalizeConditionOperator(condition?.operation);
    const expected = condition?.value;
    const actual = resolveConditionValue(condition?.id, props, collectionItem);

    if (op === '=' || op === '==' || op === 'eq') {
      if (Array.isArray(actual)) {
        return actual.some((entry) => valueEquals(entry, expected));
      }
      return valueEquals(actual, expected);
    }

    if (op === '!=' || op === '!==' || op === 'ne' || op === '<>') {
      if (Array.isArray(actual)) {
        return !actual.some((entry) => valueEquals(entry, expected));
      }
      return !valueEquals(actual, expected);
    }

    if (op === 'in') {
      const expectedList = Array.isArray(expected) ? expected : [expected];
      if (Array.isArray(actual)) {
        return actual.some((entry) => expectedList.some((target) => valueEquals(entry, target)));
      }
      return expectedList.some((target) => valueEquals(actual, target));
    }

    if (op === 'not in' || op === 'nin') {
      const expectedList = Array.isArray(expected) ? expected : [expected];
      if (Array.isArray(actual)) {
        return !actual.some((entry) => expectedList.some((target) => valueEquals(entry, target)));
      }
      return !expectedList.some((target) => valueEquals(actual, target));
    }

    if (op === 'contains') {
      if (Array.isArray(actual)) {
        return actual.some((entry) => valueEquals(entry, expected));
      }
      if (typeof actual === 'string') {
        return actual.includes(String(expected ?? ''));
      }
      return false;
    }

    if (op === 'not contains') {
      if (Array.isArray(actual)) {
        return !actual.some((entry) => valueEquals(entry, expected));
      }
      if (typeof actual === 'string') {
        return !actual.includes(String(expected ?? ''));
      }
      return true;
    }

    if (op === '>' || op === '>=' || op === '<' || op === '<=') {
      const actualNumber = Number(actual);
      const expectedNumber = Number(expected);
      if (!Number.isFinite(actualNumber) || !Number.isFinite(expectedNumber)) return false;
      if (op === '>') return actualNumber > expectedNumber;
      if (op === '>=') return actualNumber >= expectedNumber;
      if (op === '<') return actualNumber < expectedNumber;
      return actualNumber <= expectedNumber;
    }

    // Unknown operator: do not hide field silently.
    return true;
  });
}

function removeFieldValueFromObject(source: Record<string, any>, fieldId: string): Record<string, any> {
  const next = { ...(source || {}) };
  const id = String(fieldId || '').trim();
  if (!id) return next;

  delete next[id];
  delete next[`${id}__type`];
  delete next[`${id}__value`];

  const shortKey = getCollectionFieldPathTail(id);
  if (shortKey !== id) {
    delete next[shortKey];
    delete next[`${shortKey}__type`];
    delete next[`${shortKey}__value`];
  }

  return next;
}

function applyHiddenFieldSavePolicy(
  fields: any[],
  props: Record<string, any>,
  policy: HiddenFieldSavePolicy
): Record<string, any> {
  const source = props && typeof props === 'object' ? { ...props } : {};
  if (policy !== 'clear') return source;

  let nextProps: Record<string, any> = { ...source };
  const fieldList = Array.isArray(fields) ? fields : [];

  fieldList.forEach((field: any) => {
    const fieldId = String(field?.id || '').trim();
    const isVisible = evaluateFieldConditions(field, nextProps);

    if (!isVisible && fieldId) {
      nextProps = removeFieldValueFromObject(nextProps, fieldId);
      return;
    }

    const isCollectionField = field?.type === 'collection' || field?.format === 'collection';
    if (!isCollectionField || !fieldId || !Array.isArray(nextProps[fieldId])) return;

    const subFields = Array.isArray(field?.fields) ? field.fields : [];
    if (subFields.length === 0) return;

    nextProps[fieldId] = (nextProps[fieldId] || []).map((item: any) => {
      if (!item || typeof item !== 'object') return item;
      let nextItem = { ...item };

      subFields.forEach((subField: any) => {
        const subFieldId = String(subField?.id || '').trim();
        if (!subFieldId) return;
        const subVisible = evaluateFieldConditions(subField, nextProps, nextItem);
        if (!subVisible) {
          nextItem = removeFieldValueFromObject(nextItem, subFieldId);
        }
      });

      return nextItem;
    });
  });

  return nextProps;
}

const BooleanFieldControl: React.FC<BooleanFieldControlProps> = ({
  label,
  checked,
  format,
  description,
  compact = false,
  onChange
}) => {
  const normalizedFormat = String(format || 'switch').toLowerCase();
  const isCheckbox = normalizedFormat === 'checkbox';

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: compact ? 8 : 10,
        background: checked ? '#f0fdf4' : '#fff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{label}</div>
          {description && (
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              {description}
            </div>
          )}
        </div>

        <button
          type="button"
          role={isCheckbox ? 'checkbox' : 'switch'}
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {isCheckbox ? (
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: checked ? '1px solid #10b981' : '1px solid #cbd5e1',
                background: checked ? '#10b981' : '#fff',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700
              }}
            >
              {checked ? '✓' : ''}
            </span>
          ) : (
            <span
              style={{
                width: 44,
                height: 24,
                borderRadius: 999,
                border: checked ? '1px solid #10b981' : '1px solid #cbd5e1',
                background: checked ? '#10b981' : '#e2e8f0',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#fff',
                  marginInlineStart: checked ? 22 : 2,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              />
            </span>
          )}
          <span
            style={{
              fontSize: 12,
              color: checked ? '#047857' : '#64748b',
              fontWeight: 700,
              minWidth: 44,
              textAlign: 'center'
            }}
          >
            {checked ? 'مفعل' : 'معطل'}
          </span>
        </button>
      </div>
    </div>
  );
};

const TextualFieldControl: React.FC<TextualFieldControlProps> = ({
  label,
  value,
  description,
  placeholder,
  multiline = false,
  direction = 'inherit',
  compact = false,
  disabled = false,
  showImagePreview = false,
  onChange
}) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 9,
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    background: disabled ? '#f8fafc' : '#fff',
    color: '#0f172a',
    direction
  };

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: compact ? 8 : 10,
        background: '#fff'
      }}
    >
      <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
        {label}
      </label>
      {description && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          {description}
        </div>
      )}

      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, minHeight: compact ? 70 : 92, resize: 'vertical' }}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}

      {showImagePreview && value && (
        <div style={{ marginTop: 8 }}>
          <img
            src={value}
            alt=""
            style={{ width: compact ? 56 : 72, height: compact ? 56 : 72, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }}
          />
        </div>
      )}
    </div>
  );
};

const SelectionFieldControl: React.FC<SelectionFieldControlProps> = ({
  label,
  options,
  selectedValues,
  multiple = false,
  description,
  compact = false,
  onChange
}) => {
  const normalizedSelected = multiple ? selectedValues : [selectedValues[0] || ''];

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: compact ? 8 : 10,
        background: '#fff'
      }}
    >
      <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
        {label}
      </label>
      {description && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          {description}
        </div>
      )}
      <select
        multiple={multiple}
        value={multiple ? normalizedSelected : normalizedSelected[0]}
        onChange={(e) => {
          if (multiple) {
            const nextValues = Array.from(e.target.selectedOptions).map((option) => option.value);
            onChange(nextValues);
            return;
          }
          onChange([e.target.value]);
        }}
        style={{
          width: '100%',
          minHeight: multiple ? (compact ? 88 : 116) : 40,
          padding: 8,
          borderRadius: 8,
          border: '1px solid #cbd5e1',
          background: '#fff',
          color: '#0f172a'
        }}
      >
        {!multiple && <option value="">-- اختر --</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {multiple && (
        <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
          اختيار متعدد ({normalizedSelected.length})
        </div>
      )}
    </div>
  );
};

const NumericFieldControl: React.FC<NumericFieldControlProps> = ({
  label,
  value,
  min,
  max,
  description,
  compact = false,
  onChange
}) => {
  const numericValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const hasMin = Number.isFinite(Number(min));
  const hasMax = Number.isFinite(Number(max));
  const minValue = hasMin ? Number(min) : undefined;
  const maxValue = hasMax ? Number(max) : undefined;
  const isBelowMin = typeof minValue === 'number' && numericValue < minValue;
  const isAboveMax = typeof maxValue === 'number' && numericValue > maxValue;
  const hasRangeError = isBelowMin || isAboveMax;

  return (
    <div
      style={{
        border: `1px solid ${hasRangeError ? '#fecaca' : '#e5e7eb'}`,
        borderRadius: 8,
        padding: compact ? 8 : 10,
        background: '#fff'
      }}
    >
      <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
        {label}
      </label>
      {description && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          {description}
        </div>
      )}
      <input
        type="number"
        value={numericValue}
        min={minValue}
        max={maxValue}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
        style={{
          width: '100%',
          padding: 8,
          borderRadius: 8,
          border: `1px solid ${hasRangeError ? '#fca5a5' : '#cbd5e1'}`
        }}
      />
      {(hasMin || hasMax) && (
        <div style={{ marginTop: 6, fontSize: 12, color: hasRangeError ? '#b91c1c' : '#64748b' }}>
          {hasRangeError
            ? `القيمة يجب أن تكون ضمن النطاق${hasMin ? ` >= ${minValue}` : ''}${hasMin && hasMax ? ' و' : ''}${hasMax ? ` <= ${maxValue}` : ''}.`
            : `النطاق المسموح${hasMin ? `: من ${minValue}` : ''}${hasMin && hasMax ? ' إلى ' : ''}${hasMax ? maxValue : ''}`}
        </div>
      )}
    </div>
  );
};

type VariableListSourceEntry = {
  key: string;
  value: string;
  label: string;
};

type VariableListOption = {
  value: string;
  label: string;
  url?: string;
};

type VariableListSelection = {
  source: string;
  value: string;
  url: string;
};

type VariablePickerSort = 'label_asc' | 'label_desc' | 'value_asc' | 'value_desc';

type VariablePickerState = {
  scope: 'top' | 'collection';
  source: string;
  fieldId: string;
  selectedValue: string;
  options: VariableListOption[];
  title: string;
  parentFieldId?: string;
  rowIndex?: number;
};

function getStaticVariableSourceUrl(source: string): string {
  const normalized = String(source || '').trim().toLowerCase();
  if (normalized === 'offers_link') return '/offers';
  if (normalized === 'brands_link') return '/brands';
  if (normalized === 'blog_link') return '/blog';
  return '';
}

function getVariableListSources(field: any): VariableListSourceEntry[] {
  const raw = Array.isArray(field?.variableSources)
    ? field.variableSources
    : Array.isArray(field?.sources)
      ? field.sources
      : [];

  return raw
    .map((entry: any) => {
      const value = String(entry?.value ?? entry?.key ?? '').trim().toLowerCase();
      if (!value) return null;
      return {
        key: String(entry?.key || value),
        value,
        label: pickLocalizedText(entry?.label || value)
      };
    })
    .filter(Boolean) as VariableListSourceEntry[];
}

function getVariableListOptionsBySource(field: any): Record<string, VariableListOption[]> {
  const raw = field?.variableOptions;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const result: Record<string, VariableListOption[]> = {};
  Object.entries(raw).forEach(([sourceKey, options]) => {
    const key = String(sourceKey || '').trim().toLowerCase();
    if (!key || !Array.isArray(options)) return;
    result[key] = options
      .map((option: any) => ({
        value: String(option?.value ?? option?.id ?? '').trim(),
        label: pickLocalizedText(option?.label || option?.name || option?.value || option?.id || ''),
        url: typeof option?.url === 'string' ? option.url : ''
      }))
      .filter((option: VariableListOption) => Boolean(option.value));
  });

  return result;
}

function parseVariableListSelection(rawValue: any, fallbackSource?: any, fallbackValue?: any): VariableListSelection {
  const hintSource = String(fallbackSource || '').trim().toLowerCase();
  const hintValue = String(fallbackValue || '').trim();

  if (typeof rawValue === 'string') {
    return {
      source: hintSource || 'custom',
      value: hintValue || rawValue,
      url: rawValue
    };
  }

  if (Array.isArray(rawValue)) {
    const first = rawValue.find((entry) => entry != null);
    return parseVariableListSelection(first, hintSource, hintValue);
  }

  if (rawValue && typeof rawValue === 'object') {
    const source = String((rawValue as any).type ?? (rawValue as any).source ?? (rawValue as any).__type ?? hintSource ?? '')
      .trim()
      .toLowerCase();
    const value = String((rawValue as any).value ?? (rawValue as any).id ?? (rawValue as any).__value ?? hintValue ?? '').trim();
    const url = normalizeVariableListValue(rawValue);
    return {
      source: source || 'custom',
      value,
      url
    };
  }

  return {
    source: hintSource || '',
    value: hintValue || '',
    url: ''
  };
}

function buildVariableListStoreValue(selection: VariableListSelection) {
  const source = String(selection.source || '').trim().toLowerCase();
  const value = String(selection.value || '').trim();
  const url = String(selection.url || '').trim();
  const staticUrl = getStaticVariableSourceUrl(source);

  if (!source) return url || '';
  if (source === 'custom') {
    return {
      type: 'custom',
      value: url || value,
      url: url || value
    };
  }
  if (staticUrl) {
    return {
      type: source,
      value: value || source,
      url: staticUrl
    };
  }
  return {
    type: source,
    value,
    url
  };
}

function filterVariableOptions(
  options: VariableListOption[],
  query: string,
  selectedValue?: string
): VariableListOption[] {
  const normalizedQuery = String(query || '').trim().toLowerCase();
  if (!normalizedQuery) return options;

  return options.filter((option) => {
    if (selectedValue && option.value === selectedValue) return true;
    const haystack = `${option.label} ${option.value} ${option.url || ''}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function sortVariableOptions(options: VariableListOption[], mode: VariablePickerSort): VariableListOption[] {
  const ranked = [...options];
  ranked.sort((a, b) => {
    const aLabel = String(a.label || '').toLowerCase();
    const bLabel = String(b.label || '').toLowerCase();
    const aValue = String(a.value || '').toLowerCase();
    const bValue = String(b.value || '').toLowerCase();
    if (mode === 'label_desc') return bLabel.localeCompare(aLabel);
    if (mode === 'value_asc') return aValue.localeCompare(bValue);
    if (mode === 'value_desc') return bValue.localeCompare(aValue);
    return aLabel.localeCompare(bLabel);
  });
  return ranked;
}

function getCollectionItemMetaValue(item: any, fieldId: string, suffix: 'type' | 'value') {
  if (!item || typeof item !== 'object') return '';
  const fullKey = `${fieldId}__${suffix}`;
  if (item[fullKey] != null) return item[fullKey];
  const shortKey = `${getCollectionFieldPathTail(fieldId)}__${suffix}`;
  return item[shortKey];
}

function setCollectionItemMetaValue(item: any, fieldId: string, suffix: 'type' | 'value', value: any) {
  const next = { ...(item || {}) };
  const fullKey = `${fieldId}__${suffix}`;
  next[fullKey] = value;
  const shortKey = `${getCollectionFieldPathTail(fieldId)}__${suffix}`;
  if (shortKey !== fullKey && Object.prototype.hasOwnProperty.call(next, shortKey)) {
    delete next[shortKey];
  }
  return next;
}

function applyVariableSelectionToCollectionItem(item: any, fieldId: string, selection: VariableListSelection) {
  let next = setCollectionItemValue(item, fieldId, buildVariableListStoreValue(selection));
  next = setCollectionItemMetaValue(next, fieldId, 'type', selection.source);
  next = setCollectionItemMetaValue(next, fieldId, 'value', selection.value || selection.url || '');
  return next;
}

function buildVariableListSelectionForSource(
  nextSource: string,
  optionsBySource: Record<string, VariableListOption[]>
): VariableListSelection {
  const source = String(nextSource || '').trim().toLowerCase();
  const options = optionsBySource[source] || [];
  const staticUrl = getStaticVariableSourceUrl(source);

  if (staticUrl) {
    return { source, value: source, url: staticUrl };
  }
  if (source === 'custom') {
    return { source: 'custom', value: '', url: '' };
  }
  if (options.length > 0) {
    return {
      source,
      value: options[0].value,
      url: options[0].url || ''
    };
  }
  return { source, value: '', url: '' };
}

interface VariableListFieldControlProps {
  label: string;
  description?: string;
  sourceEntries: VariableListSourceEntry[];
  optionsBySource: Record<string, VariableListOption[]>;
  selection: VariableListSelection;
  compact?: boolean;
  onChange: (nextSelection: VariableListSelection) => void;
  onOpenPicker?: (payload: {
    source: string;
    selectedValue: string;
    options: VariableListOption[];
    title: string;
  }) => void;
}

const VariableListFieldControl: React.FC<VariableListFieldControlProps> = ({
  label,
  description,
  sourceEntries,
  optionsBySource,
  selection,
  compact = false,
  onChange,
  onOpenPicker
}) => {
  const selectedSource = selection.source || sourceEntries[0]?.value || 'custom';
  const activeOptions = optionsBySource[selectedSource] || [];
  const staticUrl = getStaticVariableSourceUrl(selectedSource);
  const isStaticSource = Boolean(staticUrl);
  const isCustomSource = selectedSource === 'custom';
  const shouldUsePicker = !isCustomSource && !isStaticSource && activeOptions.length > 0;
  const selectedOption = activeOptions.find((option) => option.value === selection.value);
  const selectedLabel = selectedOption?.label || selection.value || 'غير محدد';
  const selectedUrl = selectedOption?.url || selection.url || '';

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: compact ? 8 : 10,
        background: '#fff'
      }}
    >
      <label style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>
        {label}
      </label>
      {description && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          {description}
        </div>
      )}

      {sourceEntries.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <SelectionFieldControl
            label="مصدر الرابط"
            options={sourceEntries.map((entry) => ({ value: entry.value, label: entry.label }))}
            selectedValues={[selectedSource]}
            compact={compact}
            onChange={(nextValues) => {
              const nextSource = nextValues[0] || '';
              onChange(buildVariableListSelectionForSource(nextSource, optionsBySource));
            }}
          />
        </div>
      )}

      {shouldUsePicker ? (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: compact ? 8 : 10, background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <strong style={{ fontSize: 12 }}>{selectedLabel}</strong>
            {onOpenPicker && (
              <button
                type="button"
                onClick={() => onOpenPicker({
                  source: selectedSource,
                  selectedValue: selection.value,
                  options: activeOptions,
                  title: label
                })}
                style={{ border: '1px solid #93c5fd', color: '#1d4ed8', background: '#eff6ff', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}
              >
                فتح المحدد
              </button>
            )}
          </div>
          <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>
            الخيارات المتاحة: {activeOptions.length}
          </div>
          <div style={{ color: '#334155', fontSize: 11, direction: 'ltr', wordBreak: 'break-all' }}>
            {selectedUrl || '-'}
          </div>
        </div>
      ) : (
        <TextualFieldControl
          label="الرابط"
          value={isStaticSource ? staticUrl : (selection.url || selection.value)}
          direction="ltr"
          compact={compact}
          disabled={isStaticSource}
          onChange={(nextText) => onChange({
            source: selectedSource || 'custom',
            value: nextText,
            url: nextText
          })}
        />
      )}
    </div>
  );
};

function getFieldDefaultValue(field: any) {
  if (field.type === 'boolean') return Boolean(field.value);
  if (field.type === 'collection' || field.format === 'collection') {
    return Array.isArray(field.value) ? field.value : [];
  }
  if (field.type === 'items' && field.format === 'dropdown-list') {
    const selected = Array.isArray(field.selected) ? field.selected : [];
    if (selected.length > 0) return normalizeItemsFieldValue(selected);
    return normalizeItemsFieldValue(field.value);
  }
  if (field.type === 'items' && field.format === 'variable-list') {
    return field.value ?? '';
  }
  if (typeof field.value !== 'undefined') {
    return pickLocalizedText(field.value);
  }
  return '';
}

function getDefaultProps(fields: any[]): { [key: string]: any } {
  const defaults: any = {};
  fields?.forEach(field => {
    if (field.type === 'static') return;
    defaults[field.id] = getFieldDefaultValue(field);
  });
  return defaults;
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

const DEFAULT_PAGE_ELEMENT_VISIBILITY: PageElementVisibility = {
  enabled: true,
  viewport: 'all'
};

function normalizePageElementVisibility(raw: any): PageElementVisibility {
  const source = raw && typeof raw === 'object' ? raw : {};
  const viewportValue = String(source.viewport || source.device || 'all').toLowerCase();
  const viewport: PageElementViewport =
    viewportValue === 'desktop' || viewportValue === 'mobile' ? viewportValue : 'all';
  const enabled =
    typeof source.enabled === 'boolean'
      ? source.enabled
      : (source.hidden === true ? false : true);

  return {
    enabled,
    viewport
  };
}

const PAGES = [
  { id: 'home', name: 'الرئيسية (index.twig)', path: 'home' },
  { id: 'product-single', name: 'منتج مفرد (product/single.twig)', path: 'product.single' },
  { id: 'product-list', name: 'قائمة المنتجات (product/index.twig)', path: 'product' },
  { id: 'category', name: 'تصنيف (category/index.twig)', path: 'category' },
  { id: 'cart', name: 'السلة (cart.twig)', path: 'cart' },
  { id: 'profile', name: 'الملف الشخصي (customer/profile.twig)', path: 'customer.profile' },
  { id: 'orders-list', name: 'قائمة الطلبات (customer/orders/index.twig)', path: 'customer.orders' },
  { id: 'order-details', name: 'تفاصيل الطلب (customer/orders/single.twig)', path: 'customer.orders.single' },
  { id: 'wishlist', name: 'المفضلة (customer/wishlist.twig)', path: 'customer.wishlist' },
  { id: 'notifications', name: 'الإشعارات (customer/notifications.twig)', path: 'customer.notifications' },
  { id: 'blog-list', name: 'قائمة المدونة (blog/index.twig)', path: 'blog' },
  { id: 'blog-single', name: 'مقالة مدونة (blog/single.twig)', path: 'blog.single' },
  { id: 'brands-list', name: 'قائمة الماركات (brands/index.twig)', path: 'brands' },
  { id: 'brand-single', name: 'ماركة مفردة (brands/single.twig)', path: 'brands.single' },
  { id: 'thank-you', name: 'صفحة الشكر (thank-you.twig)', path: 'thank-you' },
  { id: 'landing-page', name: 'صفحة هبوط (landing-page.twig)', path: 'landing-page' },
  { id: 'page-single', name: 'صفحة ثابتة (page-single.twig)', path: 'page-single' },
];

type PageElementsMap = { [pageId: string]: PageElement[] };

const createEmptyElementsMap = (): PageElementsMap =>
  PAGES.reduce((acc, page) => {
    acc[page.id] = [];
    return acc;
  }, {} as PageElementsMap);


interface PageComponentsEditorProps {
  selectedStoreId: string | null;
}

const PageComponentsEditor: React.FC<PageComponentsEditorProps> = ({ selectedStoreId }) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [elementsMap, setElementsMap] = useState<PageElementsMap>(createEmptyElementsMap());
  const [showAdd, setShowAdd] = useState(false);
  const [editingElement, setEditingElement] = useState<PageElement | null>(null);
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [jsonDraftErrors, setJsonDraftErrors] = useState<Record<string, string>>({});
  const [hiddenFieldSavePolicy, setHiddenFieldSavePolicy] = useState<HiddenFieldSavePolicy>('preserve');
  const [variablePicker, setVariablePicker] = useState<VariablePickerState | null>(null);
  const [variablePickerSearch, setVariablePickerSearch] = useState('');
  const [variablePickerSort, setVariablePickerSort] = useState<VariablePickerSort>('label_asc');
  const [search, setSearch] = useState('');
  const [availableComponents, setAvailableComponents] = useState<PageComponent[]>([]);

  // Load theme components from API (store scoped)
  useEffect(() => {
    if (!selectedStoreId) {
      setAvailableComponents([]);
      return;
    }

    fetch(apiUrl('v1/theme/components'), {
      headers: {
        'X-VTDR-Store-Id': selectedStoreId,
        'Context-Store-Id': selectedStoreId
      }
    })
      .then(res => res.json())
      .then((response) => {
        const components = response?.data?.components || [];
        const comps = components.map((comp: any) => ({
          id: comp.key,
          name: comp.title?.ar || comp.title?.en || comp.key,
          icon: comp.icon || '🧩',
          propsSchema: parsePropsSchema(comp.fields),
          defaultProps: getDefaultProps(comp.fields),
          isThemeSpecial: true,
          path: comp.path || '',
          fields: comp.fields || [],
        }));
        setAvailableComponents(comps);
      })
      .catch(() => {
        setAvailableComponents([]);
      });
  }, [selectedStoreId]);

  // Load existing saved page compositions from theme settings
  useEffect(() => {
    if (!selectedStoreId) {
      setElementsMap(createEmptyElementsMap());
      return;
    }

    fetch(apiUrl('v1/theme/settings'), {
      headers: {
        'X-VTDR-Store-Id': selectedStoreId,
        'Context-Store-Id': selectedStoreId
      }
    })
      .then(res => res.json())
      .then((response) => {
        const saved = response?.data?.values?.page_compositions;
        const nextMap = createEmptyElementsMap();
        if (saved && typeof saved === 'object') {
          Object.entries(saved).forEach(([pageId, value]) => {
            if (!Array.isArray(value)) return;
            nextMap[pageId] = value.map((entry: any) => ({
              id: String(entry?.id || randomId()),
              componentId: String(entry?.componentId || entry?.id || ''),
              props: entry?.props && typeof entry.props === 'object' ? entry.props : {},
              visibility: normalizePageElementVisibility(
                entry?.visibility ?? {
                  enabled: entry?.enabled,
                  viewport: entry?.viewport
                }
              )
            })).filter((entry: PageElement) => Boolean(entry.componentId));
          });
        }
        setElementsMap(nextMap);
      })
      .catch(() => {
        setElementsMap(createEmptyElementsMap());
      });
  }, [selectedStoreId]);

  useEffect(() => {
    if (!editingElement) {
      setJsonDrafts({});
      setJsonDraftErrors({});
      setHiddenFieldSavePolicy('preserve');
      setVariablePicker(null);
      setVariablePickerSearch('');
      setVariablePickerSort('label_asc');
      return;
    }

    const component = availableComponents.find(c => c.id === editingElement.componentId);
    if (!component) {
      setJsonDrafts({});
      setJsonDraftErrors({});
      setHiddenFieldSavePolicy('preserve');
      setVariablePicker(null);
      setVariablePickerSearch('');
      setVariablePickerSort('label_asc');
      return;
    }

    const nextDrafts: Record<string, string> = {};
    (component.fields ?? []).forEach((field: any) => {
      if (field.type === 'collection' || field.format === 'collection') {
        const value = editingElement.props[field.id];
        const normalizedValue = Array.isArray(value) ? value : [];
        nextDrafts[field.id] = JSON.stringify(normalizedValue, null, 2);
      }
    });
    setJsonDrafts(nextDrafts);
    setJsonDraftErrors({});
    setHiddenFieldSavePolicy('preserve');
    setVariablePicker(null);
    setVariablePickerSearch('');
    setVariablePickerSort('label_asc');
  }, [editingElement, availableComponents]);

  // Filter components for the selected page only
  const selectedPageObj = PAGES.find(p => p.id === selectedPage);
  const pagePath = selectedPageObj?.path || '';
  const pageComponents = availableComponents.filter(c => (c.path || '').startsWith(pagePath));
  const elements = elementsMap[selectedPage] || [];

  const setElements = (els: PageElement[]) => setElementsMap(map => ({ ...map, [selectedPage]: els }));

  const handleAddComponent = (comp: PageComponent) => {
    setElements([
      ...elements,
      {
        id: randomId(),
        componentId: comp.id,
        props: { ...comp.defaultProps },
        visibility: { ...DEFAULT_PAGE_ELEMENT_VISIBILITY }
      }
    ]);
    setShowAdd(false);
  };

  const handleEditProps = (
    el: PageElement,
    newProps: any,
    visibility: PageElementVisibility = normalizePageElementVisibility(el.visibility)
  ) => {
    setElements(elements.map(e => (
      e.id === el.id
        ? { ...e, props: newProps, visibility: normalizePageElementVisibility(visibility) }
        : e
    )));
    setEditingElement(null);
  };

  const handleDelete = (id: string) => {
    setElements(elements.filter(e => e.id !== id));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= elements.length) return;
    const arr = [...elements];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setElements(arr);
  };

  const setEditingProp = (fieldId: string, value: any) => {
    setEditingElement((current) => {
      if (!current) return current;
      return {
        ...current,
        props: { ...current.props, [fieldId]: value }
      };
    });
  };

  const setEditingVisibility = (patch: Partial<PageElementVisibility>) => {
    setEditingElement((current) => {
      if (!current) return current;
      return {
        ...current,
        visibility: normalizePageElementVisibility({
          ...normalizePageElementVisibility(current.visibility),
          ...patch
        })
      };
    });
  };

  const updateEditingCollection = (
    fieldId: string,
    updater: (items: Record<string, any>[]) => Record<string, any>[]
  ) => {
    setEditingElement((current) => {
      if (!current) return current;
      const currentItems = normalizeCollectionItems(current.props?.[fieldId]);
      const nextItems = updater(currentItems);
      return {
        ...current,
        props: { ...current.props, [fieldId]: nextItems }
      };
    });
  };

  const openVariablePicker = (payload: VariablePickerState) => {
    setVariablePicker(payload);
    setVariablePickerSearch('');
    setVariablePickerSort('label_asc');
  };

  const closeVariablePicker = () => {
    setVariablePicker(null);
    setVariablePickerSearch('');
  };

  const applyVariablePickerSelection = (option: VariableListOption) => {
    if (!variablePicker) return;

    const nextSelection: VariableListSelection = {
      source: variablePicker.source,
      value: option.value,
      url: option.url || ''
    };

    if (variablePicker.scope === 'top') {
      setEditingProp(variablePicker.fieldId, buildVariableListStoreValue(nextSelection));
      closeVariablePicker();
      return;
    }

    if (
      variablePicker.scope === 'collection' &&
      variablePicker.parentFieldId &&
      typeof variablePicker.rowIndex === 'number'
    ) {
      updateEditingCollection(variablePicker.parentFieldId, (currentItems) => (
        currentItems.map((entry, idx) => (
          idx === variablePicker.rowIndex
            ? applyVariableSelectionToCollectionItem(entry, variablePicker.fieldId, nextSelection)
            : entry
        ))
      ));
    }

    closeVariablePicker();
  };

  const variablePickerOptions = variablePicker
    ? sortVariableOptions(
      filterVariableOptions(variablePicker.options, variablePickerSearch, variablePicker.selectedValue),
      variablePickerSort
    )
    : [];

  const handleSavePageState = async () => {
    if (!selectedStoreId) {
      alert('يرجى اختيار متجر أولاً');
      return;
    }
    const storeId = selectedStoreId;
    const normalizedPageCompositions = Object.fromEntries(
      Object.entries(elementsMap).map(([pageId, pageElements]) => [
        pageId,
        (pageElements || []).map((entry) => ({
          ...entry,
          visibility: normalizePageElementVisibility(entry.visibility)
        }))
      ])
    );
    try {
      await fetch(apiUrl('v1/theme/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-VTDR-Store-Id': storeId,
          'Context-Store-Id': storeId
        },
        body: JSON.stringify({
          page_compositions: normalizedPageCompositions
        })
      });
      alert('تم حفظ ترتيب وخصائص المكونات بنجاح!');
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', direction: 'rtl' }}>
      {/* Pages Sidebar */}
      <div style={{ minWidth: 180, background: '#f9f9f9', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 16, height: '100%' }}>
        <h4 style={{ marginBottom: 16, fontSize: 16 }}>الصفحات</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {PAGES.map(page => (
            <li key={page.id}>
              <button
                onClick={() => setSelectedPage(page.id)}
                style={{
                  width: '100%',
                  background: selectedPage === page.id ? '#e0f7fa' : 'none',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginBottom: 6,
                  fontWeight: selectedPage === page.id ? 700 : 400,
                  color: selectedPage === page.id ? '#2196f3' : '#222',
                  cursor: 'pointer',
                  textAlign: 'right',
                }}
              >
                {page.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Add Component Drawer */}
      {showAdd && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 24, minWidth: 340 }}>
          <h3 style={{ marginBottom: 16 }}>إضافة عنصر جديد</h3>
          <input
            type="text"
            placeholder="اسم العنصر..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #eee' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {pageComponents.filter(c => c.name.includes(search)).map(comp => (
              <button
                key={comp.id}
                onClick={() => handleAddComponent(comp)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, border: '1px solid #eee', borderRadius: 8, background: comp.isThemeSpecial ? '#e0f7fa' : '#f9f9f9', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 32 }}>{comp.icon}</span>
                <span style={{ fontSize: 14, marginTop: 8 }}>{comp.name}</span>
                {comp.isThemeSpecial && <span style={{ color: '#f59e0b', fontSize: 12 }}>★ خاص بالثيم</span>}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(false)} style={{ marginTop: 16 }}>إغلاق</button>
        </div>
      )}
      {/* Main Editor */}
      <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>عناصر {PAGES.find(p => p.id === selectedPage)?.name}</h2>
        <button onClick={() => setShowAdd(true)} style={{ marginBottom: 16, background: '#e0f7fa', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 600 }}>+ إضافة عنصر جديد</button>
        {elements.length === 0 && <div style={{ color: '#888', margin: '32px 0' }}>لا توجد عناصر مضافة بعد.</div>}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {elements.map((el, idx) => {
            const comp = availableComponents.find(c => c.id === el.componentId);
            if (!comp) return null;
            const visibility = normalizePageElementVisibility(el.visibility);
            return (
              <li key={el.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, background: '#f9f9f9', borderRadius: 8, padding: 12 }}>
                <span style={{ fontSize: 24 }}>{comp.icon}</span>
                <div style={{ flex: 1 }}>
                  <div>{comp.name}</div>
                  <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {!visibility.enabled && (
                      <span style={{ fontSize: 11, color: '#991b1b', background: '#fee2e2', padding: '2px 8px', borderRadius: 999 }}>
                        مخفي
                      </span>
                    )}
                    {visibility.viewport !== 'all' && (
                      <span style={{ fontSize: 11, color: '#0f172a', background: '#e2e8f0', padding: '2px 8px', borderRadius: 999 }}>
                        {visibility.viewport === 'mobile' ? 'جوال فقط' : 'سطح المكتب فقط'}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditingElement({ ...el, visibility })}
                  style={{ background: 'none', border: 'none', color: '#2196f3', cursor: 'pointer' }}
                >
                  تعديل
                </button>
                <button onClick={() => handleDelete(el.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>حذف</button>
                <button onClick={() => handleMove(idx, idx - 1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>↑</button>
                <button onClick={() => handleMove(idx, idx + 1)} disabled={idx === elements.length - 1} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>↓</button>
              </li>
            );
          })}
        </ul>
        <button style={{ marginTop: 24, background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 700, fontSize: 16 }} onClick={handleSavePageState}>حفظ التغييرات</button>
      </div>
      {/* Edit Props Drawer */}
      {editingElement && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: 24, minWidth: 340 }}>
          <h3 style={{ marginBottom: 16 }}>تعديل خصائص العنصر</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={normalizePageElementVisibility(editingElement.visibility).enabled}
                onChange={(e) => setEditingVisibility({ enabled: e.target.checked })}
              />
              <span>العنصر مفعل</span>
            </label>
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>الظهور حسب الجهاز</label>
              <select
                value={normalizePageElementVisibility(editingElement.visibility).viewport}
                onChange={(e) => setEditingVisibility({ viewport: e.target.value as PageElementViewport })}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee' }}
              >
                <option value="all">الكل</option>
                <option value="desktop">سطح المكتب فقط</option>
                <option value="mobile">الجوال فقط</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>سياسة حفظ القيم المخفية</label>
            <select
              value={hiddenFieldSavePolicy}
              onChange={(e) => setHiddenFieldSavePolicy(e.target.value as HiddenFieldSavePolicy)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #eee', marginBottom: 6 }}
            >
              <option value="preserve">الاحتفاظ بالقيم المخفية</option>
              <option value="clear">تنظيف القيم المخفية عند الحفظ</option>
            </select>
            <div style={{ color: '#64748b', fontSize: 12 }}>
              {hiddenFieldSavePolicy === 'preserve'
                ? 'يحفظ القيم الحالية حتى لو أصبح الحقل غير ظاهر.'
                : 'يحذف قيم الحقول غير الظاهرة من الخصائص قبل الحفظ.'}
            </div>
          </div>
          {(() => {
            const comp = availableComponents.find(c => c.id === editingElement.componentId);
            if (!comp) return null;
            const editorProps =
              editingElement.props && typeof editingElement.props === 'object'
                ? editingElement.props
                : {};
            return (comp.fields ?? []).map((field: any, fieldIndex: number) => {
              if (!evaluateFieldConditions(field, editorProps)) return null;
              if (field.type === 'static') {
                if (String(field.format || '') === 'line') {
                  return <hr key={field.id || `static-line-${fieldIndex}`} style={{ margin: '12px 0', border: 0, borderTop: '1px solid #e5e7eb' }} />;
                }

                const staticHtml = pickLocalizedText(field.value);
                return (
                  <div key={field.id || `static-${fieldIndex}`} style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                    {field.label && (
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                        {field.label}
                      </div>
                    )}
                    <div
                      style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: staticHtml }}
                    />
                  </div>
                );
              }
              if (field.format === 'dropdown-list' && Array.isArray(field.options)) {
                const isMultiSelect = field.type === 'items' || Boolean(field.multichoice);
                const selectedValues = isMultiSelect
                  ? normalizeItemsFieldValue(editingElement.props[field.id])
                  : [String(editingElement.props[field.id] || '')];
                const normalizedOptions: SelectionFieldOption[] = field.options.map((opt: any) => ({
                  value: String(opt?.value ?? ''),
                  label: pickLocalizedText(opt?.label || opt?.name || opt?.value || '')
                })).filter((opt: SelectionFieldOption) => opt.value);
                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <SelectionFieldControl
                      label={field.label || field.id}
                      description={field.description}
                      options={normalizedOptions}
                      selectedValues={selectedValues}
                      multiple={isMultiSelect}
                      onChange={(nextValues) => {
                        if (isMultiSelect) {
                          setEditingProp(field.id, nextValues);
                          return;
                        }
                        setEditingProp(field.id, nextValues[0] || '');
                      }}
                    />
                  </div>
                );
              }

              if (field.type === 'collection' || field.format === 'collection') {
                const subFields = Array.isArray(field.fields)
                  ? field.fields.filter((subField: any) => Boolean(subField?.id))
                  : [];

                if (subFields.length > 0) {
                  const items = normalizeCollectionItems(editingElement.props[field.id]);
                  const minLength = Number(field.minLength ?? 0);
                  const maxLength = Number(field.maxLength ?? 0);
                  const canAdd = !Number.isFinite(maxLength) || maxLength <= 0 || items.length < maxLength;

                  return (
                    <div key={field.id} style={{ marginBottom: 16, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontWeight: 600 }}>{field.label || field.id}</label>
                        <span style={{ color: '#64748b', fontSize: 12 }}>
                          {items.length}{maxLength > 0 ? ` / ${maxLength}` : ''}
                        </span>
                      </div>

                      {items.length === 0 && (
                        <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>
                          لا توجد عناصر مضافة بعد.
                        </div>
                      )}

                      {items.map((item: Record<string, any>, rowIndex: number) => (
                        <div key={`${field.id}-${rowIndex}`} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 10, background: '#fafafa' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                            <strong style={{ fontSize: 13 }}>
                              {(field.item_label || 'عنصر')} #{rowIndex + 1}
                            </strong>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => updateEditingCollection(field.id, (currentItems) => {
                                  if (rowIndex <= 0) return currentItems;
                                  const next = [...currentItems];
                                  const [moved] = next.splice(rowIndex, 1);
                                  next.splice(rowIndex - 1, 0, moved);
                                  return next;
                                })}
                                disabled={rowIndex === 0}
                                style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '2px 8px', background: '#fff', cursor: rowIndex === 0 ? 'not-allowed' : 'pointer' }}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => updateEditingCollection(field.id, (currentItems) => {
                                  if (rowIndex >= currentItems.length - 1) return currentItems;
                                  const next = [...currentItems];
                                  const [moved] = next.splice(rowIndex, 1);
                                  next.splice(rowIndex + 1, 0, moved);
                                  return next;
                                })}
                                disabled={rowIndex === items.length - 1}
                                style={{ border: '1px solid #d1d5db', borderRadius: 6, padding: '2px 8px', background: '#fff', cursor: rowIndex === items.length - 1 ? 'not-allowed' : 'pointer' }}
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => updateEditingCollection(field.id, (currentItems) => currentItems.filter((_, idx) => idx !== rowIndex))}
                                disabled={items.length <= minLength}
                                style={{ border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 6, padding: '2px 8px', background: '#fff', cursor: items.length <= minLength ? 'not-allowed' : 'pointer' }}
                              >
                                حذف
                              </button>
                            </div>
                          </div>

                          {subFields.map((subField: any, subFieldIndex: number) => {
                            if (!evaluateFieldConditions(subField, editorProps, item)) return null;
                            if (subField.type === 'static') {
                              if (String(subField.format || '') === 'line') {
                                return <hr key={subField.id || `${field.id}-${rowIndex}-line-${subFieldIndex}`} style={{ margin: '10px 0', border: 0, borderTop: '1px solid #e5e7eb' }} />;
                              }
                              const staticHtml = pickLocalizedText(subField.value);
                              return (
                                <div key={subField.id || `${field.id}-${rowIndex}-static-${subFieldIndex}`} style={{ marginBottom: 10, padding: 8, borderRadius: 8, background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                                  {subField.label && (
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                                      {subField.label}
                                    </div>
                                  )}
                                  <div
                                    style={{ fontSize: 12, color: '#334155', lineHeight: 1.6 }}
                                    dangerouslySetInnerHTML={{ __html: staticHtml }}
                                  />
                                </div>
                              );
                            }
                            const currentValue = getCollectionItemValue(item, subField.id);
                            const currentText = currentValue == null ? '' : pickLocalizedText(currentValue);

                            if (subField.type === 'boolean') {
                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <BooleanFieldControl
                                    label={subField.label || getCollectionFieldPathTail(subField.id)}
                                    description={subField.description}
                                    format={subField.format}
                                    checked={Boolean(currentValue)}
                                    compact
                                    onChange={(nextValue) => updateEditingCollection(field.id, (currentItems) => (
                                      currentItems.map((entry, idx) => (
                                        idx === rowIndex ? setCollectionItemValue(entry, subField.id, nextValue) : entry
                                      ))
                                    ))}
                                  />
                                </div>
                              );
                            }

                            if (subField.type === 'number' || subField.format === 'integer') {
                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <NumericFieldControl
                                    label={subField.label || getCollectionFieldPathTail(subField.id)}
                                    description={subField.description}
                                    value={Number.isFinite(Number(currentValue)) ? Number(currentValue) : 0}
                                    min={subField.minimum}
                                    max={subField.maximum}
                                    compact
                                    onChange={(nextValue) => {
                                      updateEditingCollection(field.id, (currentItems) => (
                                        currentItems.map((entry, idx) => (
                                          idx === rowIndex ? setCollectionItemValue(entry, subField.id, nextValue) : entry
                                        ))
                                      ));
                                    }}
                                  />
                                </div>
                              );
                            }

                            if (subField.format === 'dropdown-list' && Array.isArray(subField.options)) {
                              const isMultiSelect = subField.type === 'items' || Boolean(subField.multichoice);
                              const selectedValues = isMultiSelect
                                ? normalizeItemsFieldValue(currentValue)
                                : [String(currentValue || '')];
                              const normalizedOptions: SelectionFieldOption[] = subField.options
                                .map((opt: any) => ({
                                  value: String(opt?.value ?? ''),
                                  label: pickLocalizedText(opt?.label || opt?.name || opt?.value || '')
                                }))
                                .filter((opt: SelectionFieldOption) => opt.value);

                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <SelectionFieldControl
                                    label={subField.label || getCollectionFieldPathTail(subField.id)}
                                    description={subField.description}
                                    options={normalizedOptions}
                                    selectedValues={selectedValues}
                                    multiple={isMultiSelect}
                                    compact
                                    onChange={(nextValues) => {
                                      const nextValue = isMultiSelect ? nextValues : (nextValues[0] || '');
                                      updateEditingCollection(field.id, (currentItems) => (
                                        currentItems.map((entry, idx) => (
                                          idx === rowIndex ? setCollectionItemValue(entry, subField.id, nextValue) : entry
                                        ))
                                      ));
                                    }}
                                  />
                                </div>
                              );
                            }

                            if (subField.type === 'items' && subField.format === 'variable-list') {
                              const sourceEntries = getVariableListSources(subField);
                              const optionsBySource = getVariableListOptionsBySource(subField);
                              const metaSource = getCollectionItemMetaValue(item, subField.id, 'type');
                              const metaValue = getCollectionItemMetaValue(item, subField.id, 'value');
                              const parsedSelection = parseVariableListSelection(currentValue, metaSource, metaValue);

                              return (
                                <div key={subField.id} style={{ marginBottom: 10 }}>
                                  <VariableListFieldControl
                                    label={subField.label || getCollectionFieldPathTail(subField.id)}
                                    description={subField.description}
                                    sourceEntries={sourceEntries}
                                    optionsBySource={optionsBySource}
                                    selection={parsedSelection}
                                    compact
                                    onChange={(nextSelection) => {
                                      updateEditingCollection(field.id, (currentItems) => (
                                        currentItems.map((entry, idx) => (
                                          idx === rowIndex
                                            ? applyVariableSelectionToCollectionItem(entry, subField.id, nextSelection)
                                            : entry
                                        ))
                                      ));
                                    }}
                                    onOpenPicker={({ source, selectedValue, options, title }) => {
                                      openVariablePicker({
                                        scope: 'collection',
                                        source,
                                        fieldId: subField.id,
                                        parentFieldId: field.id,
                                        rowIndex,
                                        selectedValue,
                                        options,
                                        title
                                      });
                                    }}
                                  />
                                </div>
                              );
                            }

                            return (
                              <div key={subField.id} style={{ marginBottom: 10 }}>
                                <TextualFieldControl
                                  label={subField.label || getCollectionFieldPathTail(subField.id)}
                                  description={subField.description}
                                  value={currentText}
                                  placeholder={subField.placeholder}
                                  multiline={String(subField.format || '') === 'textarea'}
                                  direction={String(subField.format || '') === 'image' ? 'ltr' : 'inherit'}
                                  showImagePreview={String(subField.format || '') === 'image'}
                                  compact
                                  onChange={(nextText) => updateEditingCollection(field.id, (currentItems) => (
                                    currentItems.map((entry, idx) => (
                                      idx === rowIndex ? setCollectionItemValue(entry, subField.id, nextText) : entry
                                    ))
                                  ))}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => updateEditingCollection(field.id, (currentItems) => (
                          [...currentItems, createCollectionItemTemplate(field)]
                        ))}
                        disabled={!canAdd}
                        style={{ marginTop: 4, background: '#ecfeff', border: '1px solid #99f6e4', borderRadius: 8, padding: '8px 14px', cursor: canAdd ? 'pointer' : 'not-allowed', color: '#0f766e', fontWeight: 600 }}
                      >
                        + إضافة {(field.item_label || 'عنصر')}
                      </button>
                    </div>
                  );
                }

                const draft = jsonDrafts[field.id] ?? JSON.stringify(
                  Array.isArray(editingElement.props[field.id]) ? editingElement.props[field.id] : [],
                  null,
                  2
                );
                const error = jsonDraftErrors[field.id];
                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <label>{field.label}</label>
                    <textarea
                      value={draft}
                      onChange={e => {
                        const nextText = e.target.value;
                        setJsonDrafts(prev => ({ ...prev, [field.id]: nextText }));
                        try {
                          const parsed = JSON.parse(nextText);
                          const normalized = Array.isArray(parsed) ? parsed : [];
                          setJsonDraftErrors(prev => {
                            const next = { ...prev };
                            delete next[field.id];
                            return next;
                          });
                          setEditingProp(field.id, normalized);
                        } catch {
                          setJsonDraftErrors(prev => ({ ...prev, [field.id]: 'صيغة JSON غير صالحة' }));
                        }
                      }}
                      style={{ width: '100%', minHeight: 140, padding: 8, borderRadius: 6, border: '1px solid #eee', fontFamily: 'monospace', direction: 'ltr' }}
                    />
                    {error && <div style={{ marginTop: 4, color: '#ef4444', fontSize: 12 }}>{error}</div>}
                  </div>
                );
              }

              if (field.format === 'variable-list') {
                const sourceEntries = getVariableListSources(field);
                const optionsBySource = getVariableListOptionsBySource(field);
                const parsedSelection = parseVariableListSelection(editingElement.props[field.id]);

                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <VariableListFieldControl
                      label={field.label || field.id}
                      description={field.description}
                      sourceEntries={sourceEntries}
                      optionsBySource={optionsBySource}
                      selection={parsedSelection}
                      onChange={(nextSelection) => {
                        setEditingProp(field.id, buildVariableListStoreValue(nextSelection));
                      }}
                      onOpenPicker={({ source, selectedValue, options, title }) => {
                        openVariablePicker({
                          scope: 'top',
                          source,
                          fieldId: field.id,
                          selectedValue,
                          options,
                          title
                        });
                      }}
                    />
                  </div>
                );
              }

              if (field.type === 'number' || field.format === 'integer') {
                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <NumericFieldControl
                      label={field.label || field.id}
                      description={field.description}
                      value={Number.isFinite(Number(editingElement.props[field.id])) ? Number(editingElement.props[field.id]) : 0}
                      min={field.minimum}
                      max={field.maximum}
                      onChange={(nextValue) => setEditingProp(field.id, nextValue)}
                    />
                  </div>
                );
              }

              if (field.type === 'boolean') {
                return (
                  <div key={field.id} style={{ marginBottom: 12 }}>
                    <BooleanFieldControl
                      label={field.label || field.id}
                      description={field.description}
                      format={field.format}
                      checked={Boolean(editingElement.props[field.id])}
                      onChange={(nextValue) => setEditingProp(field.id, nextValue)}
                    />
                  </div>
                );
              }
              const currentValue = editingElement.props[field.id];
              const normalizedText = currentValue == null ? '' : pickLocalizedText(currentValue);
              return (
                <div key={field.id} style={{ marginBottom: 12 }}>
                  <TextualFieldControl
                    label={field.label || field.id}
                    description={field.description}
                    value={normalizedText}
                    placeholder={field.placeholder}
                    multiline={String(field.format || '') === 'textarea'}
                    direction={String(field.format || '') === 'image' ? 'ltr' : 'inherit'}
                    showImagePreview={String(field.format || '') === 'image'}
                    onChange={(nextValue) => setEditingProp(field.id, nextValue)}
                  />
                </div>
              );
            });
          })()}
          <button
            onClick={() => {
              if (Object.keys(jsonDraftErrors).length > 0) {
                alert('تحقق من حقول JSON قبل الحفظ');
                return;
              }
              if (editingElement) {
                const comp = availableComponents.find(c => c.id === editingElement.componentId);
                const nextProps =
                  comp
                    ? applyHiddenFieldSavePolicy(
                        comp.fields || [],
                        editingElement.props || {},
                        hiddenFieldSavePolicy
                      )
                    : (editingElement.props || {});
                handleEditProps(
                  editingElement,
                  nextProps,
                  normalizePageElementVisibility(editingElement.visibility)
                );
              }
            }}
            style={{ marginTop: 16, background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600 }}
          >
            حفظ
          </button>
          <button onClick={() => setEditingElement(null)} style={{ marginTop: 16, marginRight: 8 }}>إلغاء</button>
        </div>
      )}

      {variablePicker && (
        <div
          onClick={closeVariablePicker}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(760px, 96vw)',
              maxHeight: '88vh',
              overflow: 'hidden',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 12px 48px rgba(2, 6, 23, 0.25)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 16 }}>{variablePicker.title}</h4>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>اختر عنصر الرابط من القائمة</div>
              </div>
              <button
                type="button"
                onClick={closeVariablePicker}
                style={{ border: '1px solid #e5e7eb', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
              >
                إغلاق
              </button>
            </div>

            <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '1fr 180px', gap: 8 }}>
              <input
                type="text"
                placeholder="ابحث بالاسم أو المعرف أو الرابط..."
                value={variablePickerSearch}
                onChange={(e) => setVariablePickerSearch(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
              />
              <select
                value={variablePickerSort}
                onChange={(e) => setVariablePickerSort(e.target.value as VariablePickerSort)}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
              >
                <option value="label_asc">الاسم: من أ إلى ي</option>
                <option value="label_desc">الاسم: من ي إلى أ</option>
                <option value="value_asc">المعرف: تصاعدي</option>
                <option value="value_desc">المعرف: تنازلي</option>
              </select>
            </div>

            <div style={{ padding: '8px 12px', color: '#64748b', fontSize: 12, borderBottom: '1px solid #f1f5f9' }}>
              النتائج: {variablePickerOptions.length} / {variablePicker.options.length}
            </div>

            <div style={{ padding: 12, overflow: 'auto' }}>
              {variablePickerOptions.length === 0 && (
                <div style={{ padding: 16, border: '1px dashed #cbd5e1', borderRadius: 8, color: '#64748b', textAlign: 'center' }}>
                  لا توجد نتائج مطابقة.
                </div>
              )}

              {variablePickerOptions.map((option) => {
                const isSelected = option.value === variablePicker.selectedValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => applyVariablePickerSelection(option)}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      marginBottom: 8,
                      borderRadius: 10,
                      border: isSelected ? '1px solid #3b82f6' : '1px solid #e5e7eb',
                      background: isSelected ? '#eff6ff' : '#fff',
                      padding: 10,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{option.label}</div>
                    <div style={{ color: '#64748b', fontSize: 12, direction: 'ltr', marginBottom: 4 }}>{option.value}</div>
                    <div style={{ color: '#334155', fontSize: 12, direction: 'ltr', wordBreak: 'break-all' }}>{option.url || '-'}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageComponentsEditor;
