'use client';
import { PaymentsSchema } from '../PaymentsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import PaymentsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function PaymentsList() {
//   return <SmartGrid moduleActions={PaymentsActions} schema={PaymentsSchema} title="Payments" />;
// }PaidInvoicesSchema.label
export default function PaymentsList({
  fixedQuery = {},
  dataOut = {},
  title = PaymentsSchema.label,
  description = `${PaymentsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = PaymentsActions,
  schema = PaymentsSchema,
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