import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {ActionDefinition, BiDi, ComponentLocalizer, createView, FormViewer, IFormViewer, Validators} from '@react-form-builder/core'
import {useCallback, useRef} from 'react'

// Here you can pass the metadata of your components
const componentsMetadata = rSuiteComponents.map(definer => definer.build().model)

const view = createView(componentsMetadata)
  // The following parameters are required for correct CSS loading in LTR and RTL modes
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

// You can define custom validators for form fields
const customValidators: Validators = {
  'string': {
    'isHex': {
      validate: value => /^[0-9A-F]*$/i.test(value)
    },
    'isHappy': {
      params: [],
      validate: value => value === 'Happy'
    },
    'equals': {
      params: [
        {key: 'value', type: 'string', required: false, default: 'Ring'},
        {key: 'message', type: 'string', required: false, default: 'Value must be equals to '}
      ],
      validate: (value, _, args) => {
        const errorMessage = args?.['message'] as string
        const checkedValue = args?.['value'] as string
        const errorResult = errorMessage ? errorMessage + checkedValue : false
        return value !== args?.['value'] ? errorResult : true
      }
    }
  },
  'number': {},
  'boolean': {
    'onlyTrue': {
      validate: value => value === true
    }
  },
}

// Example form, in JSON format
const emptyForm = `
{
  "version": "1",
  "tooltipType": "RsTooltip",
  "errorType": "RsErrorMessage",
  "form": {
    "key": "Screen",
    "type": "Screen",
    "props": {},
    "children": [
      {
        "key": "name",
        "type": "RsInput",
        "props": {
          "placeholder": {
            "value": "Enter your name"
          },
          "label": {
            "value": "Name"
          }
        },
        "schema": {
          "validations": [
            {
              "key": "required"
            }
          ]
        },
        "tooltipProps": {
          "text": {
            "value": "Name"
          }
        }
      },
      {
        "key": "password",
        "type": "RsInput",
        "props": {
          "label": {
            "value": "Password"
          },
          "passwordMask": {
            "value": true
          }
        },
        "schema": {
          "validations": [
            {
              "key": "required"
            }
          ]
        },
        "tooltipProps": {
          "text": {
            "value": "Password"
          },
          "placement": {
            "value": "left"
          }
        }
      },
      {
        "key": "submit",
        "type": "RsButton",
        "props": {
          "children": {
            "value": "Login"
          },
          "color": {
            "value": "blue"
          },
          "appearance": {
            "value": "primary"
          }
        },
        "events": {
          "onClick": [
            {
              "name": "validate",
              "type": "common"
            },
            {
              "name": "logEventArgs",
              "type": "custom"
            }
          ]
        }
      }
    ]
  },
  "localization": {},
  "languages": [
    {
      "code": "en",
      "dialect": "US",
      "name": "English",
      "description": "American English",
      "bidi": "ltr"
    }
  ],
  "defaultLanguage": "en-US"
}
`

const formName = 'Example'

async function getFormFn(name?: string) {
  if (name === formName) return emptyForm
  throw new Error(`Form '${name}' is not found.`)
}

export const Viewer = () => {
  const ref = useRef<IFormViewer>()

  const setRef = useCallback((viewer: IFormViewer | null) => {
    if (viewer) {
      // if you want to work with the internal FormViewer component in an imperative style
      ref.current = viewer
      console.log(ref.current)
    }
  }, [])

  // custom function for localizing component properties
  const localizeFn = useCallback<ComponentLocalizer>((componentStore, language) => {
    // localizes only the component whose key has the value "password"
    return componentStore.key === 'submit' && language.code === 'en'
      ? {'children': `Submit`}
      : {}
  }, [])

  return (
    <FormViewer
      view={view}
      getForm={getFormFn}
      formName={formName}
      initialData={({})}
      localize={localizeFn}
      onFormDataChange={({data, errors}) => {
        console.log('onFormDataChange', {data, errors})
      }}
      viewerRef={setRef}
      validators={customValidators}
      actions={{
        logEventArgs: e => console.log(e),
        assertArgs: ActionDefinition.functionalAction((e, args) => {
          console.log(e, args)
        }, {
          p1: 'string',
          p2: 'boolean',
          p3: 'number'
        })
      }}
    />
  )
}