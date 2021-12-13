import { CollectionConfig } from 'payload/types';
import { SanitizedOptions, isValidBlockConfig } from './types';
import fields from './fields';
import deepMerge from './deepMerge';

const getFormsCollection = (options: SanitizedOptions): CollectionConfig => deepMerge({
  slug: options?.formsOverrides?.slug || 'forms',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'fields',
      type: 'blocks',
      blocks: options.fields.reduce((blocks, incomingFormField) => {
        if (typeof incomingFormField === 'string') {
          return [
            ...blocks,
            fields[incomingFormField],
          ];
        }

        if (isValidBlockConfig(incomingFormField)) {
          return [
            ...blocks,
            incomingFormField,
          ];
        }

        return blocks;
      }, []),
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
    },
    {
      name: 'confirmationType',
      type: 'radio',
      admin: {
        description: 'Choose whether to display an on-page message or redirect to a different page after they submit the form.',
        layout: 'horizontal',
      },
      options: [
        {
          label: 'Message',
          value: 'message',
        },
        {
          label: 'Redirect',
          value: 'redirect',
        },
      ],
      defaultValue: 'message',
    },
    {
      name: 'confirmationMessage',
      type: 'richText',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.confirmationType === 'message',
      },
    },
    {
      name: 'redirect',
      type: 'group',
      admin: {
        hideGutter: true,
        condition: (_, siblingData) => siblingData?.confirmationType === 'redirect',
      },
      fields: [
        {
          name: 'type',
          type: 'radio',
          options: [
            {
              label: 'Internal link',
              value: 'reference',
            },
            {
              label: 'Custom URL',
              value: 'custom',
            },
          ],
          defaultValue: 'reference',
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'reference',
          label: 'Document to link to',
          type: 'relationship',
          relationTo: ['pages', 'posts', 'housing'],
          required: true,
          maxDepth: 2,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'reference',
          },
        },
        {
          name: 'url',
          label: 'Custom URL',
          type: 'text',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
    {
      name: 'emails',
      type: 'array',
      admin: {
        description: 'Send custom emails upon form submission. Use a comma separated lists to send the same email to multiple recipients. To reference a value from this form, wrap that field\'s name with double curly brackets, i.e. {{firstName}}. Use {{allFields}} to include all fields.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              type: 'text',
              name: 'emailTo',
              label: 'Email To',
              required: true,
              admin: {
                width: '50%',
              }
            },
            {
              type: 'text',
              name: 'emailFrom',
              label: 'Email From',
              admin: {
                width: '50%',
                placeholder: '{{email}}',
              }
            },
          ]
        },
        {
          type: 'row',
          fields: [
            {
              type: 'text',
              name: 'replyTo',
              label: 'Reply To',
              admin: {
                width: '50%'
              }
            },
            {
              type: 'text',
              name: 'bcc',
              label: 'BCC',
              admin: {
                width: '50%'
              }
            },
          ]
        },
        {
          type: 'text',
          name: 'subject',
          label: 'Subject',
          defaultValue: 'You\'ve received a new message.',
          required: true,
        },
        {
          type: 'richText',
          name: 'message',
          label: 'Message',
          admin: {
            description: 'Enter the email message that should be sent in this email.',
          }
        }
      ]
    },
  ],
}, options.formsOverrides || {});

export default getFormsCollection;
