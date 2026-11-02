// dashboard.schema.js
// Application: Ticksy Tickets
// Purpose: Ticket bookings, events, organizers and payment analytics.
//
// IMPORTANT:
// 1. Tenant filtering must come from the authenticated login token.
// 2. All SQL queries use {db} and the :site parameter.
// 3. Verify payment, order, check-in and event status values.
// 4. Event filter parameter: :f_event_id
// 5. Date parameters: :fromTs and :toExclusive
//
// ASSUMED payment statuses:
//   successful, success, paid, completed, complete
//
// ASSUMED excluded order statuses:
//   cancelled, canceled, expired
//
// RELATIONSHIPS:
//   events.organiser_id   -> organisers.organiser_id
//   orders.event_id       -> events.event_id
//   order_items.order_id  -> orders.order_id
//   tickets.order_item_id -> order_items.order_item_id
//   payments.order_id     -> orders.order_id
//   check_ins.ticket_id   -> tickets.ticket_id

const PAID_PAYMENT_STATUSES = `
  LOWER(TRIM(p.status))
  IN ('successful', 'success', 'paid', 'completed', 'complete')
`;

const VALID_ORDERS = `
  LOWER(TRIM(o.status))
  NOT IN ('cancelled', 'canceled', 'expired')
`;

const DATE_FILTER = (column) => `
  AND (:fromTs IS NULL OR ${column} >= :fromTs)
  AND (:toExclusive IS NULL OR ${column} < :toExclusive)
`;

export default {
  brand: 'Ticksy Tickets',
  tz: 'Africa/Nairobi',
  cacheMs: 15000,
  refreshMs: 30000,

  layout: [
    // =======================================================
    // 1. FILTERS
    // =======================================================
    {
      kind: 'filters',
      id: 'filters',
      date: true,

      fields: [
        {
          key: 'event_id',
          label: 'Event',
          column: 'event_id',
          optionsQuery: {
            table: 'events',
            value: 'event_id',
          },
        },
      ],
    },

    // =======================================================
    // 2. KPI CARDS
    // =======================================================
    {
      kind: 'stats',
      id: 'kpis',

      items: [
        // Total ticket quantities booked
        {
          id: 'bookedTickets',
          label: 'Tickets Booked',
          compare: true,
          className: 'od-grad-ocean',

          query: {
            sql: `
              SELECT COALESCE(SUM(oi.quantity), 0) AS value

              FROM {db}.order_items oi

              INNER JOIN {db}.orders o
                ON o.order_id = oi.order_id

              WHERE (:site IS NULL OR oi.hive_site_id = :site)
                AND ${VALID_ORDERS}
                ${DATE_FILTER('o.reg_date')}
                AND (
                  :f_event_id IS NULL
                  OR o.event_id = :f_event_id
                )
            `,
          },
        },

        // Number of issued tickets
        {
          id: 'ticketsIssued',
          label: 'Tickets Issued',
          compare: true,
          className: 'od-grad-emerald',

          query: {
            sql: `
              SELECT COUNT(*) AS value

              FROM {db}.tickets t

              WHERE (:site IS NULL OR t.hive_site_id = :site)
                ${DATE_FILTER('t.issued_at')}
                AND (
                  :f_event_id IS NULL
                  OR t.event_id = :f_event_id
                )
            `,
          },
        },

        // Events registered during the selected period
        {
          id: 'totalEvents',
          label: 'Total Events',
          compare: true,

          query: {
            sql: `
              SELECT COUNT(*) AS value

              FROM {db}.events e

              WHERE (:site IS NULL OR e.hive_site_id = :site)
                ${DATE_FILTER('e.reg_date')}
                AND (
                  :f_event_id IS NULL
                  OR e.event_id = :f_event_id
                )
            `,
          },
        },

        // Organizers registered during the selected period
        {
          id: 'organizers',
          label: 'Organizers',
          compare: true,

          query: {
            sql: `
              SELECT COUNT(*) AS value

              FROM {db}.organisers org

              WHERE (:site IS NULL OR org.hive_site_id = :site)
                ${DATE_FILTER('org.reg_date')}
            `,
          },
        },

        // Successfully collected payments
        {
          id: 'totalRevenue',
          label: 'Payments Received',
          prefix: 'KES ',
          compare: true,

          query: {
            sql: `
              SELECT COALESCE(SUM(p.amount), 0) AS value

              FROM {db}.payments p

              INNER JOIN {db}.orders o
                ON o.order_id = p.order_id

              WHERE (:site IS NULL OR p.hive_site_id = :site)
                AND ${PAID_PAYMENT_STATUSES}
                ${DATE_FILTER('p.paid_at')}
                AND (
                  :f_event_id IS NULL
                  OR o.event_id = :f_event_id
                )
            `,
          },
        },

        // Payments still awaiting completion
        {
          id: 'pendingPayments',
          label: 'Pending Payments',
          prefix: 'KES ',

          query: {
            sql: `
              SELECT COALESCE(SUM(p.amount), 0) AS value

              FROM {db}.payments p

              INNER JOIN {db}.orders o
                ON o.order_id = p.order_id

              WHERE (:site IS NULL OR p.hive_site_id = :site)
                AND LOWER(TRIM(p.status))
                    IN ('pending', 'processing')
                ${DATE_FILTER('p.reg_date')}
                AND (
                  :f_event_id IS NULL
                  OR o.event_id = :f_event_id
                )
            `,
          },
        },

        // Distinct tickets successfully checked in
        {
          id: 'checkedIn',
          label: 'Tickets Checked In',
          className: 'od-grad-ocean',

          query: {
            sql: `
              SELECT COUNT(DISTINCT ci.ticket_id) AS value

              FROM {db}.check_ins ci

              WHERE (:site IS NULL OR ci.hive_site_id = :site)
                AND LOWER(TRIM(ci.result))
                    IN ('success', 'valid', 'accepted')
                ${DATE_FILTER('ci.scanned_at')}
                AND (
                  :f_event_id IS NULL
                  OR ci.event_id = :f_event_id
                )
            `,
          },
        },
      ],
    },

    // =======================================================
    // 3. TICKETS BOOKED BY MONTH
    // =======================================================
    {
      kind: 'chart',
      id: 'monthlyBookings',
      type: 'trend',
      title: 'Tickets Booked by Month',
      unit: 'tickets',
      span: 12,

      query: {
        sql: `
          SELECT
            DATE_FORMAT(o.reg_date, '%Y-%m') AS label,
            COALESCE(SUM(oi.quantity), 0) AS value

          FROM {db}.orders o

          INNER JOIN {db}.order_items oi
            ON oi.order_id = o.order_id

          WHERE (:site IS NULL OR o.hive_site_id = :site)
            AND ${VALID_ORDERS}
            ${DATE_FILTER('o.reg_date')}
            AND (
              :f_event_id IS NULL
              OR o.event_id = :f_event_id
            )

          GROUP BY DATE_FORMAT(o.reg_date, '%Y-%m')
          ORDER BY DATE_FORMAT(o.reg_date, '%Y-%m')
        `,
      },
    },

    // =======================================================
    // 4. PAYMENTS RECEIVED BY MONTH
    // =======================================================
    {
      kind: 'chart',
      id: 'monthlyRevenue',
      type: 'trend',
      title: 'Payments Received by Month',
      prefix: 'KES ',
      span: 12,

      query: {
        sql: `
          SELECT
            DATE_FORMAT(p.paid_at, '%Y-%m') AS label,
            COALESCE(SUM(p.amount), 0) AS value

          FROM {db}.payments p

          INNER JOIN {db}.orders o
            ON o.order_id = p.order_id

          WHERE (:site IS NULL OR p.hive_site_id = :site)
            AND ${PAID_PAYMENT_STATUSES}
            ${DATE_FILTER('p.paid_at')}
            AND (
              :f_event_id IS NULL
              OR o.event_id = :f_event_id
            )

          GROUP BY DATE_FORMAT(p.paid_at, '%Y-%m')
          ORDER BY DATE_FORMAT(p.paid_at, '%Y-%m')
        `,
      },
    },

    // =======================================================
    // 5. TICKETS BOOKED BY ORGANIZER
    // =======================================================
    {
      kind: 'chart',
      id: 'bookingsByOrganizer',
      type: 'bar',
      title: 'Tickets Booked by Organizer',
      unit: 'tickets',
      span: 12,

      query: {
        sql: `
          SELECT
            org.name AS label,
            COALESCE(SUM(oi.quantity), 0) AS value

          FROM {db}.organisers org

          INNER JOIN {db}.events e
            ON e.organiser_id = org.organiser_id

          INNER JOIN {db}.orders o
            ON o.event_id = e.event_id

          INNER JOIN {db}.order_items oi
            ON oi.order_id = o.order_id

          WHERE (:site IS NULL OR org.hive_site_id = :site)
            AND ${VALID_ORDERS}
            ${DATE_FILTER('o.reg_date')}
            AND (
              :f_event_id IS NULL
              OR o.event_id = :f_event_id
            )

          GROUP BY org.organiser_id, org.name
          ORDER BY value DESC
          LIMIT 10
        `,
      },
    },

    // =======================================================
    // 6. PAYMENTS BY ORGANIZER
    // =======================================================
    {
      kind: 'chart',
      id: 'revenueByOrganizer',
      type: 'trend',
      title: 'Payments by Organizer',
      prefix: 'KES ',
      span: 12,

      query: {
        sql: `
          SELECT
            org.name AS label,
            COALESCE(SUM(p.amount), 0) AS value

          FROM {db}.organisers org

          INNER JOIN {db}.events e
            ON e.organiser_id = org.organiser_id

          INNER JOIN {db}.orders o
            ON o.event_id = e.event_id

          INNER JOIN {db}.payments p
            ON p.order_id = o.order_id

          WHERE (:site IS NULL OR org.hive_site_id = :site)
            AND ${PAID_PAYMENT_STATUSES}
            ${DATE_FILTER('p.paid_at')}
            AND (
              :f_event_id IS NULL
              OR o.event_id = :f_event_id
            )

          GROUP BY org.organiser_id, org.name
          ORDER BY value DESC
          LIMIT 10
        `,
      },
    },

    // =======================================================
    // 7. PAYMENTS RECEIVED BY EVENT
    // =======================================================
    {
      kind: 'chart',
      id: 'paymentsByEvent',
      type: 'hbar',
      title: 'Payments Received by Event',
      prefix: 'KES ',
      span: 12,

      query: {
        sql: `
          SELECT
            e.name AS label,
            COALESCE(SUM(p.amount), 0) AS value

          FROM {db}.events e

          INNER JOIN {db}.orders o
            ON o.event_id = e.event_id

          INNER JOIN {db}.payments p
            ON p.order_id = o.order_id

          WHERE (:site IS NULL OR e.hive_site_id = :site)
            AND ${PAID_PAYMENT_STATUSES}
            ${DATE_FILTER('p.paid_at')}
            AND (
              :f_event_id IS NULL
              OR e.event_id = :f_event_id
            )

          GROUP BY e.event_id, e.name
          ORDER BY value DESC
          LIMIT 10
        `,
      },
    },

    // =======================================================
    // 8. TICKETS BY STATUS
    // =======================================================
    {
      kind: 'chart',
      id: 'ticketsByStatus',
      type: 'donut',
      title: 'Tickets by Status',
      unit: 'tickets',
      span: 6,

      query: {
        sql: `
          SELECT
            COALESCE(t.status, 'Unknown') AS label,
            COUNT(*) AS value

          FROM {db}.tickets t

          WHERE (:site IS NULL OR t.hive_site_id = :site)
            ${DATE_FILTER('t.issued_at')}
            AND (
              :f_event_id IS NULL
              OR t.event_id = :f_event_id
            )

          GROUP BY t.status
          ORDER BY value DESC
        `,
      },
    },

    // =======================================================
    // 9. EVENTS BY STATUS
    // =======================================================
    {
      kind: 'chart',
      id: 'eventsByStatus',
      type: 'donut',
      title: 'Events by Status',
      unit: 'events',
      span: 6,

      query: {
        sql: `
          SELECT
            COALESCE(e.status, 'Unknown') AS label,
            COUNT(*) AS value

          FROM {db}.events e

          WHERE (:site IS NULL OR e.hive_site_id = :site)
            ${DATE_FILTER('e.reg_date')}

          GROUP BY e.status
          ORDER BY value DESC
        `,
      },
    },

    // =======================================================
    // 10. NEEDS YOUR ATTENTION
    // =======================================================
    {
      kind: 'attention',
      id: 'attention',
      title: 'Needs Your Attention',

      items: [
        {
          id: 'pendingPaymentsAlert',
          text: '{n} payments are pending',
          tone: 'warn',

          query: {
            sql: `
              SELECT COUNT(*) AS value

              FROM {db}.payments p

              WHERE (:site IS NULL OR p.hive_site_id = :site)
                AND LOWER(TRIM(p.status))
                    IN ('pending', 'processing')
                ${DATE_FILTER('p.reg_date')}
            `,
          },
        },

        {
          id: 'upcomingEvents',
          text: '{n} events are upcoming',
          tone: 'info',

          query: {
            sql: `
              SELECT COUNT(*) AS value

              FROM {db}.events e

              WHERE (:site IS NULL OR e.hive_site_id = :site)
                AND e.starts_at >= NOW()
                AND LOWER(TRIM(e.status))
                    IN ('published', 'active', 'upcoming')
            `,
          },
        },
      ],
    },
  ],
};