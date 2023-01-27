/*
 * Copyright 2023 The Kubernetes Authors
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

export {
  ModeOrButton as Mode,
  Button,
  isButton,
  isViewButton,
  Mode as MultiModalMode,
  MultiModalResponse
} from '../models/mmr/types'

export {
  isAbortableResponse,
  isMarkdownResponse,
  ScalarResponse,
  isScalarResponse,
  MetadataNamedResource,
  MixedResponse,
  isMixedResponse,
  RawResponse,
  isReactResponse,
  isRandomErrorResponse1,
  isRandomErrorResponse2,
  hasSourceReferences,
  WithSourceReferences,
  SourceRef,
  MetadataBearingByReference as ResourceByReference,
  MetadataBearingByReferenceWithContent as ResourceByReferenceWithContent,
  isMetadataBearingByReference as isResourceByReference,
  isMetadataBearing as isResourceWithMetadata
} from '../models/entity'

// response types
export { default as isError } from '../repl/error'
export { default as DescriptionList, isDescriptionList } from '../models/DescriptionList'
export {
  isReactProvider,
  isStringWithOptionalContentType,
  isSupportedContentType,
  isStringDiffContent,
  isFunctionContent,
  isCommandStringContent,
  isScalarContent
} from '../models/mmr/content-types'
export { isHTML } from './Util'
export { isTable, isRadioTable } from './Table'
export {
  Breadcrumb,
  NavResponse,
  isNavResponse,
  Link,
  isLink,
  isLinkWithHref,
  isLinkWithCommand,
  Menu
} from '../models/NavResponse'
export { isMultiModalResponse } from '../models/mmr/is'
export { XtermResponse, XtermResponseCell, isXtermResponse, isXtermErrorResponse } from '../models/XtermResponse'
export {
  default as TabLayoutModificationResponse,
  isTabLayoutModificationResponse,
  NewSplitRequest,
  isNewSplitRequest
} from '../models/TabLayoutModificationResponse'

export { KResponse } from '../models/command'

export { CommentaryResponse, isCommentaryResponse, maybeKuiLink } from '../models/CommentaryResponse'

export { isCodedError } from '../models/errors'

export { isUsageError, UsageError, UsageModel, UsageRow } from '../core/usage-error'

// TODO remove these soon; see plugin-client-common/src/components/Scalar/index.ts
export { isMessageWithUsageModel, isMessageWithCode } from '../core/usage-error'
