# Cloud Shell Developer Help

This document is intended to assist developers of the Shell.

## Theming and Customization

You may choose to customize the branding and look of the Shell. A
custom theme starts with a settings file. An example is provided in
`config/envs/ibm.json`. This file indicates:

- The name of your product, via the `productName` field. The header of the Shell breaks this down into a `companyName`, a `productSubName`, and a name for the tool itself, `shellName`. You will probably choose to define productName as the concatenation of these three sub-fields, but are free to choose otherwise.

- The application icon: `appIcon`

- A large format icon that will appear in the About window: `largeIcon`

- The css theme file to use, `cssTheme`. Define this as the name of a file in `content/css/themes`, but specify only the base name, not the full path to this CSS theme file.

- Optionally, you may set the User-Agent header that will be communicated to the OpenWhisk backend: `userAgent`
