'use client';
import { CheckinsSchema } from '../CheckinsSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import CheckinsActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function CheckinsList() {
//   return <SmartGrid moduleActions={CheckinsActions} schema={CheckinsSchema} title="Checkins" />;
// }PaidInvoicesSchema.label
export default function CheckinsList({
  fixedQuery = {},
  dataOut = {},
  title = CheckinsSchema.label,
  description = `${CheckinsSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = CheckinsActions,
  schema = CheckinsSchema,
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