import joi from 'joi'

import { componentSchema } from '../../config/shared/componentSchema'

export const baseAdminComponentFields = joi
  .object()
  .keys({
    Cell: componentSchema,
    Field: componentSchema,
    Filter: componentSchema,
  })
  .default({})

export const baseAdminFields = joi.object().keys({
  className: joi.string(),
  components: baseAdminComponentFields,
  condition: joi.func(),
  description: joi
    .alternatives()
    .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()]), componentSchema),
  disableBulkEdit: joi.boolean().default(false),
  disabled: joi.boolean().default(false),
  hidden: joi.boolean().default(false),
  initCollapsed: joi.boolean().default(false),
  position: joi.string().valid('sidebar'),
  readOnly: joi.boolean().default(false),
  style: joi.object().unknown(),
  width: joi.string(),
})

export const baseField = joi
  .object()
  .keys({
    access: joi.object().keys({
      create: joi.func(),
      read: joi.func(),
      update: joi.func(),
    }),
    admin: baseAdminFields.default(),
    custom: joi.object().pattern(joi.string(), joi.any()),
    hidden: joi.boolean().default(false),
    hooks: joi
      .object()
      .keys({
        afterChange: joi.array().items(joi.func()).default([]),
        afterRead: joi.array().items(joi.func()).default([]),
        beforeChange: joi.array().items(joi.func()).default([]),
        beforeValidate: joi.array().items(joi.func()).default([]),
      })
      .default(),
    index: joi.boolean().default(false),
    label: joi
      .alternatives()
      .try(joi.object().pattern(joi.string(), [joi.string()]), joi.string(), joi.valid(false)),
    localized: joi.boolean().default(false),
    required: joi.boolean().default(false),
    saveToJWT: joi.alternatives().try(joi.boolean(), joi.string()).default(false),
    unique: joi.boolean().default(false),
    validate: joi.func(),
  })
  .default()

export const idField = baseField.keys({
  localized: joi.invalid(true),
  name: joi.string().valid('id'),
  required: joi.not(false, 0).default(true),
  type: joi.string().valid('text', 'number'),
})

export const text = baseField.keys({
  admin: baseAdminFields.keys({
    autoComplete: joi.string(),
    placeholder: joi
      .alternatives()
      .try(joi.object().pattern(joi.string(), [joi.string()]), joi.string()),
    rtl: joi.boolean(),
  }),
  defaultValue: joi.alternatives().try(joi.string(), joi.func()),
  maxLength: joi.number(),
  minLength: joi.number(),
  name: joi.string().required(),
  type: joi.string().valid('text').required(),
})

export const number = baseField.keys({
  admin: baseAdminFields.keys({
    autoComplete: joi.string(),
    placeholder: joi.string(),
    step: joi.number(),
  }),
  defaultValue: joi.alternatives().try(joi.number(), joi.func()),
  hasMany: joi.boolean().default(false),
  max: joi.number(),
  maxRows: joi.number().when('hasMany', { is: joi.not(true), then: joi.forbidden() }),
  min: joi.number(),
  minRows: joi.number().when('hasMany', { is: joi.not(true), then: joi.forbidden() }),
  name: joi.string().required(),
  type: joi.string().valid('number').required(),
})

export const textarea = baseField.keys({
  admin: baseAdminFields.keys({
    placeholder: joi.string(),
    rows: joi.number(),
    rtl: joi.boolean(),
  }),
  defaultValue: joi.alternatives().try(joi.string(), joi.func()),
  maxLength: joi.number(),
  minLength: joi.number(),
  name: joi.string().required(),
  type: joi.string().valid('textarea').required(),
})

export const email = baseField.keys({
  admin: baseAdminFields.keys({
    autoComplete: joi.string(),
    placeholder: joi.string(),
  }),
  defaultValue: joi.alternatives().try(joi.string(), joi.func()),
  maxLength: joi.number(),
  minLength: joi.number(),
  name: joi.string().required(),
  type: joi.string().valid('email').required(),
})

export const code = baseField.keys({
  admin: baseAdminFields.keys({
    editorOptions: joi.object().unknown(), // Editor['options'] @monaco-editor/react
    language: joi.string(),
  }),
  defaultValue: joi.alternatives().try(joi.string(), joi.func()),
  name: joi.string().required(),
  type: joi.string().valid('code').required(),
})

export const json = baseField.keys({
  defaultValue: joi.alternatives().try(joi.array(), joi.object()),
  name: joi.string().required(),
  type: joi.string().valid('json').required(),
})

export const select = baseField.keys({
  admin: baseAdminFields.keys({
    isClearable: joi.boolean().default(false),
    isSortable: joi.boolean().default(false),
  }),
  defaultValue: joi
    .alternatives()
    .try(joi.string().allow(''), joi.array().items(joi.string().allow('')), joi.func()),
  hasMany: joi.boolean().default(false),
  name: joi.string().required(),
  options: joi
    .array()
    .min(1)
    .items(
      joi.alternatives().try(
        joi.string(),
        joi.object({
          label: joi
            .alternatives()
            .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
          value: joi.string().required().allow(''),
        }),
      ),
    )
    .required(),
  type: joi.string().valid('select').required(),
})

export const radio = baseField.keys({
  admin: baseAdminFields.keys({
    layout: joi.string().valid('vertical', 'horizontal'),
  }),
  defaultValue: joi.alternatives().try(joi.string().allow(''), joi.func()),
  name: joi.string().required(),
  options: joi
    .array()
    .min(1)
    .items(
      joi.alternatives().try(
        joi.string(),
        joi.object({
          label: joi
            .alternatives()
            .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()]))
            .required(),
          value: joi.string().required().allow(''),
        }),
      ),
    )
    .required(),
  type: joi.string().valid('radio').required(),
})

export const row = baseField.keys({
  admin: baseAdminFields.default(),
  fields: joi.array().items(joi.link('#field')),
  type: joi.string().valid('row').required(),
})

export const collapsible = baseField.keys({
  admin: baseAdminFields.default(),
  fields: joi.array().items(joi.link('#field')),
  label: joi.alternatives().try(joi.string(), componentSchema),
  type: joi.string().valid('collapsible').required(),
})

const tab = baseField.keys({
  description: joi.alternatives().try(joi.string(), componentSchema),
  fields: joi.array().items(joi.link('#field')).required(),
  interfaceName: joi.string().when('name', { not: joi.exist(), then: joi.forbidden() }),
  label: joi
    .alternatives()
    .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()]))
    .when('name', { is: joi.not(), then: joi.required() }),
  localized: joi.boolean(),
  name: joi.string().when('localized', { is: joi.exist(), then: joi.required() }),
  saveToJWT: joi.alternatives().try(joi.boolean(), joi.string()),
})

export const tabs = baseField.keys({
  admin: baseAdminFields.keys({
    description: joi.forbidden(),
  }),
  fields: joi.forbidden(),
  localized: joi.forbidden(),
  tabs: joi.array().items(tab).required(),
  type: joi.string().valid('tabs').required(),
})

export const group = baseField.keys({
  admin: baseAdminFields.keys({
    hideGutter: joi.boolean().default(true),
  }),
  defaultValue: joi.alternatives().try(joi.object(), joi.func()),
  fields: joi.array().items(joi.link('#field')),
  interfaceName: joi.string(),
  name: joi.string().required(),
  type: joi.string().valid('group').required(),
})

export const array = baseField.keys({
  admin: baseAdminFields
    .keys({
      components: baseAdminComponentFields
        .keys({
          RowLabel: componentSchema,
        })
        .default({}),
    })
    .default({}),
  defaultValue: joi.alternatives().try(joi.array().items(joi.object()), joi.func()),
  fields: joi.array().items(joi.link('#field')).required(),
  interfaceName: joi.string(),
  labels: joi.object({
    plural: joi
      .alternatives()
      .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
    singular: joi
      .alternatives()
      .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
  }),
  maxRows: joi.number(),
  minRows: joi.number(),
  name: joi.string().required(),
  type: joi.string().valid('array').required(),
})

export const upload = baseField.keys({
  defaultValue: joi.alternatives().try(joi.object(), joi.func()),
  filterOptions: joi.alternatives().try(joi.object(), joi.func()),
  maxDepth: joi.number(),
  name: joi.string().required(),
  relationTo: joi.string().required(),
  type: joi.string().valid('upload').required(),
})

export const checkbox = baseField.keys({
  defaultValue: joi.alternatives().try(joi.boolean(), joi.func()),
  name: joi.string().required(),
  type: joi.string().valid('checkbox').required(),
})

export const point = baseField.keys({
  defaultValue: joi.alternatives().try(joi.array().items(joi.number()).max(2).min(2), joi.func()),
  name: joi.string().required(),
  type: joi.string().valid('point').required(),
})

export const relationship = baseField.keys({
  admin: baseAdminFields.keys({
    allowCreate: joi.boolean().default(true),
    isSortable: joi.boolean().default(false),
  }),
  defaultValue: joi.alternatives().try(joi.func()),
  filterOptions: joi.alternatives().try(joi.object(), joi.func()),
  hasMany: joi.boolean().default(false),
  max: joi
    .number()
    .when('hasMany', { is: joi.not(true), then: joi.forbidden() })
    .warning('deprecated', { message: 'Use maxRows instead.' }),
  maxDepth: joi.number(),
  maxRows: joi.number().when('hasMany', { is: joi.not(true), then: joi.forbidden() }),
  min: joi
    .number()
    .when('hasMany', { is: joi.not(true), then: joi.forbidden() })
    .warning('deprecated', { message: 'Use minRows instead.' }),
  minRows: joi.number().when('hasMany', { is: joi.not(true), then: joi.forbidden() }),
  name: joi.string().required(),
  relationTo: joi.alternatives().try(joi.string().required(), joi.array().items(joi.string())),
  type: joi.string().valid('relationship').required(),
})

export const blocks = baseField.keys({
  blocks: joi
    .array()
    .items(
      joi.object({
        fields: joi.array().items(joi.link('#field')),
        graphQL: joi.object().keys({
          singularName: joi.string(),
        }),
        imageAltText: joi.string(),
        imageURL: joi.string(),
        interfaceName: joi.string(),
        labels: joi.object({
          plural: joi
            .alternatives()
            .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
          singular: joi
            .alternatives()
            .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
        }),
        slug: joi.string().required(),
      }),
    )
    .required(),
  defaultValue: joi.alternatives().try(joi.array().items(joi.object()), joi.func()),
  labels: joi.object({
    plural: joi
      .alternatives()
      .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
    singular: joi
      .alternatives()
      .try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
  }),
  maxRows: joi.number(),
  minRows: joi.number(),
  name: joi.string().required(),
  type: joi.string().valid('blocks').required(),
})

export const richText = baseField.keys({
  admin: baseAdminFields.keys({
    elements: joi.array().items(
      joi.alternatives().try(
        joi.string(),
        joi.object({
          Button: componentSchema,
          Element: componentSchema,
          name: joi.string().required(),
          plugins: joi.array().items(componentSchema),
        }),
      ),
    ),
    hideGutter: joi.boolean().default(true),
    leaves: joi.array().items(
      joi.alternatives().try(
        joi.string(),
        joi.object({
          Button: componentSchema,
          Leaf: componentSchema,
          name: joi.string().required(),
          plugins: joi.array().items(componentSchema),
        }),
      ),
    ),
    link: joi.object({
      fields: joi.alternatives(joi.array().items(joi.link('#field')), joi.func()),
    }),
    placeholder: joi.string(),
    rtl: joi.boolean(),
    upload: joi.object({
      collections: joi.object().pattern(
        joi.string(),
        joi.object().keys({
          fields: joi.array().items(joi.link('#field')),
        }),
      ),
    }),
  }),
  defaultValue: joi.alternatives().try(joi.array().items(joi.object()), joi.func()),
  name: joi.string().required(),
  type: joi.string().valid('richText').required(),
})

export const date = baseField.keys({
  admin: baseAdminFields.keys({
    date: joi.object({
      displayFormat: joi.string(),
      maxDate: joi.date(),
      maxTime: joi.date(),
      minDate: joi.date(),
      minTime: joi.date(),
      monthsToShow: joi.number(),
      pickerAppearance: joi.string(),
      timeFormat: joi.string(),
      timeIntervals: joi.number(),
    }),
    placeholder: joi.string(),
  }),
  defaultValue: joi.alternatives().try(joi.string(), joi.func()),
  name: joi.string().required(),
  type: joi.string().valid('date').required(),
})

export const ui = joi.object().keys({
  admin: joi
    .object()
    .keys({
      components: joi
        .object()
        .keys({
          Cell: componentSchema,
          Field: componentSchema,
        })
        .default({}),
      condition: joi.func(),
      position: joi.string().valid('sidebar'),
      width: joi.string(),
    })
    .default(),
  custom: joi.object().pattern(joi.string(), joi.any()),
  label: joi.alternatives().try(joi.string(), joi.object().pattern(joi.string(), [joi.string()])),
  name: joi.string().required(),
  type: joi.string().valid('ui').required(),
})

const fieldSchema = joi
  .alternatives()
  .try(
    text,
    number,
    textarea,
    email,
    code,
    json,
    select,
    group,
    array,
    row,
    collapsible,
    tabs,
    radio,
    relationship,
    checkbox,
    upload,
    richText,
    blocks,
    date,
    point,
    ui,
  )
  .id('field')

export default fieldSchema