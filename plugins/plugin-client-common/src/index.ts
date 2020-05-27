/*
 * Copyright 2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Here we arrange the CSS for base functionality of Kui. Order is
 * preserved in the resulting <link> tags.
 *
 */
import '../web/css/static/carbon-overrides-common.css'
import '../web/css/static/inverted-colors.css'
import '../web/css/static/ui.css'
import '../web/css/static/repl.scss'
import '../web/css/static/status-stripe.css'

// default client
export { default as Kui, Props as KuiProps } from './components/Client/Kui'

// Client components
export { default as Search } from './components/Client/Search'
export { default as InputStripe } from './components/Client/InputStripe'
export { default as TabContainer } from './components/Client/TabContainer'
export { default as TabContent } from './components/Client/TabContent'
export { default as TabModel } from './components/Client/TabModel'
export { default as StatusStripe } from './components/Client/StatusStripe'
export { default as MeterWidgets } from './components/Client/StatusStripe/MeterWidgets'
export { default as ContextWidgets } from './components/Client/StatusStripe/ContextWidgets'
export { ViewLevel, default as TextWithIconWidget } from './components/Client/StatusStripe/TextWithIconWidget'
export { default as KuiContext } from './components/Client/context'

// Content components
export { default as Loading } from './components/spi/Loading'
export { default as HTMLDom } from './components/Content/Scalar/HTMLDom'

// sidecar components
export { default as ComboSidecar } from './components/Views/Sidecar/ComboSidecar'
export { default as TopNavSidecar } from './components/Views/Sidecar/TopNavSidecar'
export { default as LeftNavSidecar } from './components/Views/Sidecar/LeftNavSidecar'

// Input components
export {
  InputProvider,
  State as InputProviderState,
  Props as InputProviderProps
} from './components/Views/Terminal/Block/Input'
export { default as defaultOnKeyDown } from './components/Views/Terminal/Block/OnKeyDown'
export { default as defaultOnKeyPress } from './components/Views/Terminal/Block/OnKeyPress'
export { onKeyUp as defaultOnKeyUp } from './components/Views/Terminal/Block/ActiveISearch'

// spi
export { default as Icons } from './components/spi/Icons'
export { default as DropDown, DropDownAction } from './components/spi/DropDown'
