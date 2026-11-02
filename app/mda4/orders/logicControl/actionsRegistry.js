/**
 * Register real behavior here, once per action key. Both grid rowLinks
 * AND profile-level buttons (schema.profileActions) route through this
 * SAME registry — one place to add new behavior, works everywhere.
 *
 * Every registered function receives ONE ctx object instead of a fixed
 * list of positional args — see actionRegistryDocs.md (same folder) for
 * the full ctx field list and worked examples for every action shape
 * used elsewhere in this app (cross-module popups, preset create forms,
 * quick-edit modals, grid-toolbar smart filters, sending messages, etc).
 * Copy the block that matches what you're building from there.
 *
 * NOTE: "delete" and "clone" are intercepted directly by
 * useEntityFormController before they ever reach this registry — don't
 * register functions under those two keys, they will never fire.
 */

// <auto-relations:imports>
import React from 'react';
import { MosyCard } from "../../../components/MosyCard";
import ViewAllLink from "../../../components/ViewAllLink";
import { openEntityCreateModal, buildPresetFromRow } from "../../moduleControl/UiControl/EntityCreateModal";
import OrderitemsProfile from "../../orderitems/uiControl/OrderitemsProfile";
import PaymentsProfile from "../../payments/uiControl/PaymentsProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { EventsSchema } from "../../events/EventsSchema";
import { OrderitemsSchema } from "../../orderitems/OrderitemsSchema";
import { PaymentsSchema } from "../../payments/PaymentsSchema";
// </auto-relations:imports>


const OrdersActions = {
  // Bound by gridOptions.checkFunction in schema.js. Fires with every row
  // the user ticked in the grid's checkbox column. Swap the display-name
  // fallback chain for whatever field this module's rows actually have.
  gridCheckBoxAction: async ({ rows }) => {
    const displayName = (row) => row?.title || row?.name || row?.record_id || 'record';
    alert(`${rows.length} record(s) selected: ${rows.map(displayName).join(', ')}`);
  },

  // Add more as needed — see actionRegistryDocs.md for patterns to copy.
  // Every one of them gets whatever's on ctx: { rows, schema, router,
  // refresh, create, update, remove, filter, setFilterValue,
  // setAdvancedQuery, setDateRange, applyFilter, clearFilterValue }.

  // <auto-relations:actions>
  add_orders_orderitems: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.order_id) return;
    const fk = OrderitemsSchema.fields?.find((f) => f.key === 'order_id');
    openEntityCreateModal({
      ProfileComponent: OrderitemsProfile,
      schema: OrderitemsSchema,
      title: `New Order item — ${row.order_number || row.order_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'order_id', destKey: 'order_id', destSchema: OrderitemsSchema, labelValue: row.order_number },
        ]),
      },
      lockedFields: ['order_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_orders_payments: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.order_id) return;
    const fk = PaymentsSchema.fields?.find((f) => f.key === 'order_id');
    openEntityCreateModal({
      ProfileComponent: PaymentsProfile,
      schema: PaymentsSchema,
      title: `New Payment — ${row.order_number || row.order_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'order_id', destKey: 'order_id', destSchema: PaymentsSchema, labelValue: row.order_number },
        ]),
      },
      lockedFields: ['order_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_orders_confirmed_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by confirmed at',
    columnKey: 'confirmed_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_orders_events: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by event',
    searchSchema: EventsSchema,
    displayField: 'name',
    valueField: 'event_id',
    localColumnKey: 'event_id',
    combine: true,
  }),

  filter_orders_expires_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by expires at',
    columnKey: 'expires_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_orders_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_orders_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by status',
    columnKey: 'status',
    combine: true,
  }),

  view_orders_events_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const { default: EventsList } = await import('../../events/uiControl/EventsList');
    const fixedQuery = { eventId: btoa(row.event_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/events/list?${new URLSearchParams({ events_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(EventsList, {
        customProfilePath: '../events/profile',
        title: `Event — ${row.name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_orders_orderitems: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.order_id) return;
    const { default: OrderitemsList } = await import('../../orderitems/uiControl/OrderitemsList');
    const fixedQuery = { orderId: btoa(row.order_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/orderitems/list?${new URLSearchParams({ order_items_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(OrderitemsList, {
        customProfilePath: '../orderitems/profile',
        title: `Order items — ${row.order_number || row.order_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_orders_payments: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.order_id) return;
    const { default: PaymentsList } = await import('../../payments/uiControl/PaymentsList');
    const fixedQuery = { orderId: btoa(row.order_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/payments/list?${new URLSearchParams({ payments_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(PaymentsList, {
        customProfilePath: '../payments/profile',
        title: `Payments — ${row.order_number || row.order_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default OrdersActions
