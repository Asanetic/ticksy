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
import TicketsProfile from "../../tickets/uiControl/TicketsProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { EventsSchema } from "../../events/EventsSchema";
import { OrderitemsSchema } from "../../orderitems/OrderitemsSchema";
import { TicketsSchema } from "../../tickets/TicketsSchema";
// </auto-relations:imports>


const TickettypesActions = {
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
  add_tickettypes_orderitems: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.ticket_type_id) return;
    const fk = OrderitemsSchema.fields?.find((f) => f.key === 'ticket_type_id');
    openEntityCreateModal({
      ProfileComponent: OrderitemsProfile,
      schema: OrderitemsSchema,
      title: `New Order item — ${row.name || row.ticket_type_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'ticket_type_id', destKey: 'ticket_type_id', destSchema: OrderitemsSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['ticket_type_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_tickettypes_tickets: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.ticket_type_id) return;
    const fk = TicketsSchema.fields?.find((f) => f.key === 'ticket_type_id');
    // other FKs this row shares with the form: carried over only when the row has a value, else left for the user to pick
    const carried = [
      { column: 'event_id', mirrors: [] },
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
      title: `New Ticket — ${row.name || row.ticket_type_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'ticket_type_id', destKey: 'ticket_type_id', destSchema: TicketsSchema, labelValue: row.name },
        ]),
        ...carriedPreset,
      },
      lockedFields: ['ticket_type_id', fk?.labelKey, ...carriedLocked].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_tickettypes_events: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by event',
    searchSchema: EventsSchema,
    displayField: 'name',
    valueField: 'event_id',
    localColumnKey: 'event_id',
    combine: true,
  }),

  filter_tickettypes_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tickettypes_sales_end_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by sales end at',
    columnKey: 'sales_end_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tickettypes_sales_start_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by sales start at',
    columnKey: 'sales_start_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_tickettypes_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by status',
    columnKey: 'status',
    combine: true,
  }),

  view_tickettypes_events_profile: async ({ rows, router }) => {
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
        title: `Event — ${row.event_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_tickettypes_orderitems: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.ticket_type_id) return;
    const { default: OrderitemsList } = await import('../../orderitems/uiControl/OrderitemsList');
    const fixedQuery = { ticketTypeId: btoa(row.ticket_type_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/orderitems/list?${new URLSearchParams({ order_items_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(OrderitemsList, {
        customProfilePath: '../orderitems/profile',
        title: `Order items — ${row.name || row.ticket_type_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_tickettypes_tickets: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.ticket_type_id) return;
    const { default: TicketsList } = await import('../../tickets/uiControl/TicketsList');
    const fixedQuery = { ticketTypeId: btoa(row.ticket_type_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/tickets/list?${new URLSearchParams({ tickets_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TicketsList, {
        customProfilePath: '../tickets/profile',
        title: `Tickets — ${row.name || row.ticket_type_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default TickettypesActions
