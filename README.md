# @r2n/dst

## R2N Design System Tokens

Design system tokens can be used to define your design system parameters regardless the technology you are using.

This tokens are defined through a json file that can be transformed and converted to different formats so it can be used in yor development. This JSON document follows a schema that can be modified also to meet your design requirements.

This is based on material [design tokens](https://m3.material.io/foundations/design-tokens/overview)

The definition of the desing system tokens can be done in three different parts:

-   `ref` tokens: This ones are associated with specific values

    -   `ref.palette.blue.60.value`

-   `sys` tokens: This ones are associated with the actual design system

    -   `sys.color.primary`

-   `comp` tokens: This ones are associated with specific component attribute

    -   `comp.button.background-color`


The tokens can reference another tokens, this allow you to change values and can be reflected in every place where you are referencing this values. 

```json
{
    ...
    "definition": {
        "ref": {
            "palette": {
                "blue": {
                    "60": {
                        "value": "hsl(221, 51, 60)",
                        "contrast": "&[ref.palette.white.value]"
                    },
                }
            }
        },
        ...
        "sys": {
            "color": {
                "primary": "&[ref.palette.blue.60.value]"
            }
        }
    }
    ...
}
```

## How to install

`yarn add @r2n/dst`

## How to use it

### Initialize the project


## Contribute
