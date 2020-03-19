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
import '../web/css/static/vendor/balloon-css/balloon.min.css'

// default client
export { default as Kui, Props as KuiProps } from './components/Kui'

// core components
export { default as Search } from './components/Search'
export { default as Loading } from './components/Loading'
export { default as HTMLDom } from './components/Scalar/HTMLDom'
export { default as InputStripe } from './components/InputStripe'
export { default as TabContainer } from './components/TabContainer'
export { default as TabContent } from './components/TabContent'
export { default as TabModel } from './components/TabModel'
export { default as StatusStripe } from './components/StatusStripe'
export { default as MeterWidgets } from './components/StatusStripe/MeterWidgets'
export { default as ContextWidgets } from './components/StatusStripe/ContextWidgets'
export { ViewLevel, default as TextWithIconWidget } from './components/StatusStripe/TextWithIconWidget'

// sidecar components
export { default as ComboSidecar } from './components/Sidecar/ComboSidecar'
export { default as TopNavSidecar } from './components/Sidecar/TopNavSidecar'
export { default as LeftNavSidecar } from './components/Sidecar/LeftNavSidecar'
