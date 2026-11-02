'use client';
import { OrdersSchema } from '../OrdersSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import OrdersActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function OrdersList() {
//   return <SmartGrid moduleActions={OrdersActions} schema={OrdersSchema} title="Orders" />;
// }PaidInvoicesSchema.label
export default function OrdersList({
  fixedQuery = {},
  dataOut = {},
  title = OrdersSchema.label,
  description = `${OrdersSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = OrdersActions,
  schema = OrdersSchema,
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