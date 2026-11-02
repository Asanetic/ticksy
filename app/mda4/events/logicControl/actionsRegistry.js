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
import CheckinsProfile from "../../checkins/uiControl/CheckinsProfile";
import OrdersProfile from "../../orders/uiControl/OrdersProfile";
import TicketsProfile from "../../tickets/uiControl/TicketsProfile";
import TickettypesProfile from "../../tickettypes/uiControl/TickettypesProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { OrganisersSchema } from "../../organisers/OrganisersSchema";
import { CheckinsSchema } from "../../checkins/CheckinsSchema";
import { OrdersSchema } from "../../orders/OrdersSchema";
import { TicketsSchema } from "../../tickets/TicketsSchema";
import { TickettypesSchema } from "../../tickettypes/TickettypesSchema";
// </auto-relations:imports>


const EventsActions = {
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
  add_events_checkins: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const fk = CheckinsSchema.fields?.find((f) => f.key === 'event_id');
    openEntityCreateModal({
      ProfileComponent: CheckinsProfile,
      schema: CheckinsSchema,
      title: `New Check in — ${row.name || row.event_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'event_id', destKey: 'event_id', destSchema: CheckinsSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['event_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_events_orders: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const fk = OrdersSchema.fields?.find((f) => f.key === 'event_id');
    openEntityCreateModal({
      ProfileComponent: OrdersProfile,
      schema: OrdersSchema,
      title: `New Order — ${row.name || row.event_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'event_id', destKey: 'event_id', destSchema: OrdersSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['event_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_events_tickets: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const fk = TicketsSchema.fields?.find((f) => f.key === 'event_id');
    openEntityCreateModal({
      ProfileComponent: TicketsProfile,
      schema: TicketsSchema,
      title: `New Ticket — ${row.name || row.event_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'event_id', destKey: 'event_id', destSchema: TicketsSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['event_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_events_tickettypes: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const fk = TickettypesSchema.fields?.find((f) => f.key === 'event_id');
    openEntityCreateModal({
      ProfileComponent: TickettypesProfile,
      schema: TickettypesSchema,
      title: `New Ticket type — ${row.name || row.event_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'event_id', destKey: 'event_id', destSchema: TickettypesSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['event_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_events_ends_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by ends at',
    columnKey: 'ends_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_events_organisers: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by organiser',
    searchSchema: OrganisersSchema,
    displayField: 'name',
    valueField: 'organiser_id',
    localColumnKey: 'organiser_id',
    combine: true,
  }),

  filter_events_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_events_starts_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by starts at',
    columnKey: 'starts_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_events_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by status',
    columnKey: 'status',
    combine: true,
  }),

  view_events_checkins: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const { default: CheckinsList } = await import('../../checkins/uiControl/CheckinsList');
    const fixedQuery = { eventId: btoa(row.event_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/checkins/list?${new URLSearchParams({ check_ins_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(CheckinsList, {
        customProfilePath: '../checkins/profile',
        title: `Check ins — ${row.name || row.event_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_events_orders: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const { default: OrdersList } = await import('../../orders/uiControl/OrdersList');
    const fixedQuery = { eventId: btoa(row.event_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/orders/list?${new URLSearchParams({ orders_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(OrdersList, {
        customProfilePath: '../orders/profile',
        title: `Orders — ${row.name || row.event_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_events_organisers_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.organiser_id) return;
    const { default: OrganisersList } = await import('../../organisers/uiControl/OrganisersList');
    const fixedQuery = { organiserId: btoa(row.organiser_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/organisers/list?${new URLSearchParams({ organisers_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(OrganisersList, {
        customProfilePath: '../organisers/profile',
        title: `Organiser — ${row.organiser_name || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_events_tickets: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const { default: TicketsList } = await import('../../tickets/uiControl/TicketsList');
    const fixedQuery = { eventId: btoa(row.event_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/tickets/list?${new URLSearchParams({ tickets_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TicketsList, {
        customProfilePath: '../tickets/profile',
        title: `Tickets — ${row.name || row.event_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_events_tickettypes: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.event_id) return;
    const { default: TickettypesList } = await import('../../tickettypes/uiControl/TickettypesList');
    const fixedQuery = { eventId: btoa(row.event_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/tickettypes/list?${new URLSearchParams({ ticket_types_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TickettypesList, {
        customProfilePath: '../tickettypes/profile',
        title: `Ticket types — ${row.name || row.event_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default EventsActions
