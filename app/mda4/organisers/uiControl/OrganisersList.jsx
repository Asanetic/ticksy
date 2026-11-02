'use client';
import { OrganisersSchema } from '../OrganisersSchema';
import SmartGrid from '../../moduleControl/UiControl/SmartGrid';
import OrganisersActions from '../logicControl/actionsRegistry';
import SmartGridClean from '../../moduleControl/UiControl/SmartGridClean';
import GridViewSwitcher from '../../moduleControl/UiControl/GridViewSwitcher';
import ExcelSheetGrid from '../../moduleControl/UiControl/SmartGridSheet';

// Thin wrapper only — all real grid logic lives in components/EntityGrid.jsx
// export default function OrganisersList() {
//   return <SmartGrid moduleActions={OrganisersActions} schema={OrganisersSchema} title="Organisers" />;
// }PaidInvoicesSchema.label
export default function OrganisersList({
  fixedQuery = {},
  dataOut = {},
  title = OrganisersSchema.label,
  description = `${OrganisersSchema.label} list`,
  customProfilePath = './profile',
  moduleActions = OrganisersActions,
  schema = OrganisersSchema,
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