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
import '../web/css/static/carbon-components.min.css'
import '../web/css/static/carbon-overrides-common.css'
import '../web/css/static/inverted-colors.css'
import '../web/css/static/ui.css'
import '../web/css/static/repl.scss'
import '../web/css/static/status-stripe.css'
import '../web/css/static/top-tab-stripe.css'
import '../web/css/static/vendor/balloon-css/balloon.min.css'

// we use customized tags since the body view doesn't use a React Component lifecycle for now
declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace JSX {
    interface IntrinsicElements {
      tab: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      repl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export { default as Loading } from './components/Loading'
export { default as HTMLDom } from './components/Scalar/HTMLDom'
export { default as InputStripe } from './components/InputStripe'
export { default as TabContainer } from './components/TabContainer'
export { default as StatusStripe } from './components/StatusStripe'
export { default as ContextWidgets } from './components/StatusStripe/ContextWidgets'
export { default as MeterWidgets } from './components/StatusStripe/MeterWidgets'
export { ViewLevel, default as TextWithIconWidget } from './components/StatusStripe/TextWithIconWidget'
