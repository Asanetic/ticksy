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
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartMapFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { EventsSchema } from "../../events/EventsSchema";
import { TicketsSchema } from "../../tickets/TicketsSchema";
// </auto-relations:imports>


const CheckinsActions = {
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
  filter_checkins_events: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by event',
    searchSchema: EventsSchema,
    displayField: 'name',
    valueField: 'event_id',
    localColumnKey: 'event_id',
    combine: true,
  }),

  filter_checkins_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_checkins_scanned_at: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by scanned at',
    columnKey: 'scanned_at',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_checkins_tickets: (ctx) => openSmartMapFilter(ctx, {
    title: 'Filter by ticket',
    searchSchema: TicketsSchema,
    displayField: 'ticket_number',
    valueField: 'ticket_id',
    localColumnKey: 'ticket_id',
    combine: true,
  }),

  view_checkins_events_profile: async ({ rows, router }) => {
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

  view_checkins_tickets_profile: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.ticket_id) return;
    const { default: TicketsList } = await import('../../tickets/uiControl/TicketsList');
    const fixedQuery = { ticketId: btoa(row.ticket_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/tickets/list?${new URLSearchParams({ tickets_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(TicketsList, {
        customProfilePath: '../tickets/profile',
        title: `Ticket — ${row.ticket_number || ''}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default CheckinsActions
