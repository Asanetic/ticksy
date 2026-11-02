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
import TicketsProfile from "../../tickets/uiControl/TicketsProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { OrdersSchema } from "../../orders/OrdersSchema";
import { TickettypesSchema } from "../../tickettypes/TickettypesSchema";
import { TicketsSchema } from "../../tickets/TicketsSchema";
// </auto-relations:imports>


const OrderitemsActions = {
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
  add_orderitems_tickets: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.order_item_id) return;
    const fk = TicketsSchema.fields?.find((f) => f.key === 'order_item_id');
    // other FKs this row shares with the form: carried over only when the row has a value, else left for the user to pick
    const carried = [
      { column: 'ticket_type_id', mirrors: [] },
    ].filter(({ column }) => row[column] !== undefined && row[column] !== null && row[column] !== '');
    const carriedPreset = {};
    const carriedLocked = [];
    carried.forEach(({ column, mirrors }) => {
      const labelKey = TicketsSchema.fields?.find((f) => f.key === column)?.labelKey;
      const copies = [labelKey, ...mirrors].filter((k) => k && row[k] !== undefined);
      carriedPreset[column] = row[column];
      copies.forEach((k) => { carriedPreset[k] = row[k]; });
      carriedLocked.push(column, ...new Set([...(labelKey ? [labelKey] : []), ...copies]));
    });
    openEntityCreateModal({
      ProfileComponent: TicketsProfile,
      schema: TicketsSchema,
      title: `New Ticket — ${row.ticket_name_snapshot || row.order_item_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'order_item_id', destKey: 'order_item_id', destSchema: TicketsSchema, labelValue: row.ticket_name_snapshot },
        ]),
        ...carriedPreset,
      },
      lockedFields: ['order_item_id', fk?.labelKey, ...carriedLocked].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_orderitems_orders: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by order',
    searchSchema: OrdersSchema,
    displayField: 'order_number',
    valueField: 'order_id',
    localColumnKey: 'order_id',
    combine: true,
  }),

  filter_orderitems_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_orderitems_tickettypes: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by ticket type',
    searchSchema: TickettypesSchema,
    displayField: 'name',
    valueField: 'ticket_type_id',
    localColumnKey: 'ticket_type_id',
    combine: true,
  }),

  view_orderitems_orders_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.order_id) return;
    const { default: OrdersList } = await import('../../orders/uiControl/OrdersList');
    const fixedQuery = { orderId: btoa(row.order_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/orders/list?${new URLSearchParams({ orders_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(OrdersList, {
        customProfilePath: '../orders/profile',
        title: `Order — ${row.order_number || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_orderitems_tickets: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.order_item_id) return;
    const { default: TicketsList } = await import('../../tickets/uiControl/TicketsList');
    const fixedQuery = { orderItemId: btoa(row.order_item_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/tickets/list?${new URLSearchParams({ tickets_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TicketsList, {
        customProfilePath: '../tickets/profile',
        title: `Tickets — ${row.ticket_name_snapshot || row.order_item_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_orderitems_tickettypes_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.ticket_type_id) return;
    const { default: TickettypesList } = await import('../../tickettypes/uiControl/TickettypesList');
    const fixedQuery = { ticketTypeId: btoa(row.ticket_type_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/tickettypes/list?${new URLSearchParams({ ticket_types_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TickettypesList, {
        customProfilePath: '../tickettypes/profile',
        title: `Ticket type — ${row.name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default OrderitemsActions
