'use client';
import { OrderitemsSchema } from '../OrderitemsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import OrderitemsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function OrderitemsList() {
//   return <SmartGrid moduleActions={OrderitemsActions} schema={OrderitemsSchema} title="Orderitems" />;
// }PaidInvoicesSchema.label
export default function OrderitemsList({
  fixedQuery = {},
  dataOut = {},
  title = OrderitemsSchema.label,
  description = `${OrderitemsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = OrderitemsActions,
  schema = OrderitemsSchema,
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