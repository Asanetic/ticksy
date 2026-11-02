'use client';
import { useSearchParams } from 'next/navigation';
import DynamicForm from '../../moduleControl/UiControl/DynamicForm';
import { CheckinsSchema } from '../CheckinsSchema';
import { useEntityFormController } from '../../moduleControl/dataControl/useEntityFormController';
import { mosyGetSchemaTitle } from '../../../MosyUtils/hiveUtils';
import CheckinsActions from '../logicControl/actionsRegistry';
import DynamicFormPro from '../../moduleControl/UiControl/Dynamicformpro';

// CheckinsProfile — pure shell. It resolves the id, wires up the
// controller, and hands DynamicForm the two strings that make this page
// look like a Company profile: `eyebrow` and `title`. DynamicForm owns
// every pixel of how those get laid out and styled (including the
// profileActions toolbar) — this file has no markup of its own. Point
// the same pattern at a different schema and both the fields AND the
// header/button set change with zero edits here.
export default function CheckinsProfile({ id: idProp, onDone, hiddenActions = [], presetValues, schemaOverride }) {
  const searchParams = useSearchParams();
  const schema = schemaOverride || CheckinsSchema;
  const id = idProp ?? searchParams.get(`${CheckinsSchema.entity}_dataNode`);
  const form = useEntityFormController(schema, CheckinsActions, {
    id,
    onDone,
    redirectOnDelete: './list',
    initialValues: presetValues,
  });

  return (
    <DynamicFormPro
      controller={form}
      eyebrow={form.isEditing ? `${schema.label}  Profile` : `${schema.label}  Directory`}
      title={form.isEditing ? mosyGetSchemaTitle(schema, form.values, '') : `New ${schema.label}`}
      hiddenActions={hiddenActions}
    />
  );
}


 