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
import EventsProfile from "../../events/uiControl/EventsProfile";
import UsersProfile from "../../users/uiControl/UsersProfile";
import { openSmartDateFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { openSmartTagFilter } from "../../moduleControl/UiControl/smartFilterActions";
import { EventsSchema } from "../../events/EventsSchema";
import { UsersSchema } from "../../users/UsersSchema";
// </auto-relations:imports>


const OrganisersActions = {
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
  add_organisers_events: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.organiser_id) return;
    const fk = EventsSchema.fields?.find((f) => f.key === 'organiser_id');
    openEntityCreateModal({
      ProfileComponent: EventsProfile,
      schema: EventsSchema,
      title: `New Event — ${row.name || row.organiser_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'organiser_id', destKey: 'organiser_id', destSchema: EventsSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['organiser_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  add_organisers_users: ({ rows, refresh }) => {
    const row = rows?.[0];
    if (!row?.organiser_id) return;
    const fk = UsersSchema.fields?.find((f) => f.key === 'organiser_id');
    openEntityCreateModal({
      ProfileComponent: UsersProfile,
      schema: UsersSchema,
      title: `New User — ${row.name || row.organiser_id}`,
      presetValues: {
        ...buildPresetFromRow(row, [
          { sourceKey: 'organiser_id', destKey: 'organiser_id', destSchema: UsersSchema, labelValue: row.name },
        ]),
      },
      lockedFields: ['organiser_id', fk?.labelKey].filter(Boolean), // mapped from the row: not shown, not editable, still saved
      onSaved: refresh,
    });
  },

  filter_organisers_reg_date: (ctx) => openSmartDateFilter(ctx, {
    title: 'Filter by created on',
    columnKey: 'reg_date',
    inputType: 'datetime-local',
    combine: true,
  }),

  filter_organisers_status: (ctx) => openSmartTagFilter(ctx, {
    title: 'Filter by status',
    columnKey: 'status',
    combine: true,
  }),

  view_organisers_events: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.organiser_id) return;
    const { default: EventsList } = await import('../../events/uiControl/EventsList');
    const fixedQuery = { organiserId: btoa(row.organiser_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/events/list?${new URLSearchParams({ events_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(EventsList, {
        customProfilePath: '../events/profile',
        title: `Events — ${row.name || row.organiser_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },

  view_organisers_users: async ({ rows, router }) => {
    const row = rows?.[0];
    if (!row?.organiser_id) return;
    const { default: UsersList } = await import('../../users/uiControl/UsersList');
    const fixedQuery = { organiserId: btoa(row.organiser_id) };
    // "View more" link: the list page reads <entity>_mosyfilter through MosySecureFilterEngine
    // (value = base64 of "key=<base64 value>&..."), the same format as multiGridRows links.
    const href = `/mda4/users/list?${new URLSearchParams({ users_mosyfilter: btoa(new URLSearchParams(fixedQuery).toString()) })}`;
    MosyCard('', React.createElement(React.Fragment, null,
      React.createElement(UsersList, {
        customProfilePath: '../users/profile',
        title: `Users — ${row.name || row.organiser_id}`,
        fixedQuery,
        hiddenActions: ['new'],
      }),
      React.createElement(ViewAllLink, { href, label: 'View more', onNavigate: router ? (url) => router.push(url) : undefined }),
    ), true, 'modal4', 'mosycard_wide');
  },
  // </auto-relations:actions>
};


export default OrganisersActions
