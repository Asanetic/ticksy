'use client';
import { TicketsSchema } from '../TicketsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import TicketsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function TicketsList() {
//   return <SmartGrid moduleActions={TicketsActions} schema={TicketsSchema} title="Tickets" />;
// }PaidInvoicesSchema.label
export default function TicketsList({
  fixedQuery = {},
  dataOut = {},
  title = TicketsSchema.label,
  description = `${TicketsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = TicketsActions,
  schema = TicketsSchema,
  hiddenActions=[],

}) {
  return (
    <GridViewSwitcher
      table={SmartGridClean}
      sheet={ExcelSheetGrid}
      start="table"
      moduleActions={moduleActions}
      schema={schema}
      title={title}
      description={description}
      customProfilePath={customProfilePath}
      fixedQuery={fixedQuery}
      dataOut={dataOut}
      hiddenActions={hiddenActions}
    />
  );
}