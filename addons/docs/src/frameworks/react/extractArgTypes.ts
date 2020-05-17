import { PropDef, PropsTableRowsProps } from '@storybook/components';
import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor } from '../../lib/docgen';
import { trimQuotes } from '../../lib/sbtypes/utils';
import { extractProps } from './extractProps';

const trim = (val: any) => (val && typeof val === 'string' ? trimQuotes(val) : val);

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const props = extractProps(component);
    const { rows } = props as PropsTableRowsProps;
    if (rows) {
      return rows.reduce((acc: ArgTypes, row: PropDef) => {
        const { type, sbType, defaultValue: defaultSummary, jsDocTags, required } = row;
        let defaultValue = defaultSummary && trim(defaultSummary.detail || defaultSummary.summary);
        try {
          // eslint-disable-next-line no-eval
          defaultValue = eval(defaultValue);
          // eslint-disable-next-line no-empty
        } catch {}

        acc[row.name] = {
          ...row,
          defaultValue,
          type: { required, ...sbType },
          table: {
            type,
            jsDocTags,
            defaultValue,
          },
        };
        return acc;
      }, {});
    }
  }

  return null;
};
