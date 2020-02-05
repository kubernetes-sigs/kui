'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
Object.defineProperty(exports, '__esModule', { value: true })
const core_1 = require('@kui-shell/core')
const show_1 = require('./show')
const sidecar_init_1 = require('./sidecar-init')
const viewId = 'kui-default-sidecar'
function attachClickHandlers(sidecar, { pexec }) {
  sidecar.querySelector('.sidecar-screenshot-button').onclick = () => {
    pexec('screenshot sidecar')
  }
}
const registration = registrar =>
  __awaiter(void 0, void 0, void 0, function*() {
    if (!core_1.isHeadless()) {
      sidecar_init_1.oneTimeInit()
      registrar.registerComponent({
        when: () => true,
        render: (entity, tab, repl) =>
          __awaiter(void 0, void 0, void 0, function*() {
            const content = document.createDocumentFragment()
            const { default: html } = require('@kui-shell/plugin-sidecar/web/html/sidecar.html')
            const body = document.createElement('div')
            body.innerHTML = html
            const sidecar = body.querySelector('sidecar')
            content.appendChild(sidecar)
            sidecar_init_1.perSidecarInit(sidecar)
            yield show_1.default(tab, entity, sidecar)
            attachClickHandlers(sidecar, repl)
            core_1.eventBus.once('/resource/deleted', resource =>
              __awaiter(void 0, void 0, void 0, function*() {
                const { maybeHideEntity } = yield Promise.resolve().then(() => require('./sidecar'))
                maybeHideEntity(tab, sidecar, resource)
              })
            )
            return {
              apiVersion: 'kui-shell/component/v1',
              kind: entity.kind,
              metadata: {
                namespace: entity.metadata.namespace
              },
              spec: {
                content,
                position: 'right',
                singleton: true,
                viewId
              }
            }
          })
      })
    }
  })
exports.default = registration
//# sourceMappingURL=preload.js.map
