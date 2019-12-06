/*
 * Copyright 2018 IBM Corporation
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

/** what is the name of the library */
const libraryName = 'composer'
const composerPattern = new RegExp(`${libraryName}.`)

const strings = {
  literal: {
    documentation: 'Inject a constant value',
    detail: 'Inject a constant value',
    args: ['aConstantValue']
  },
  if: {
    documentation: 'Conditionally execute a task',
    detail: 'if (condTask) thenTask; else elseTask',
    args: ['condTask', 'thenTask', 'elseTask']
  },
  sequence: {
    documentation: 'Sequence two or more tasks into a pipeline',
    detail: 'task1 -> task2',
    args: ['task1', 'task2']
  },
  try: {
    documentation: 'Catch errors in tasks with a handler task',
    detail: 'try { task1 } catch { task2 }',
    args: ['task', 'errorHandler']
  },
  let: {
    documentation: 'Bind a variable to a value, then execute a sequence of tasks',
    detail: 'var=value; task1 -> task2',
    args: ['variable', 'value', 'task1', 'task2']
  },
  mask: {
    documentation: 'Execute a given composition masking any enclosing variable bindings',
    detail: 'mask enclosing variable bindings',
    args: ['composition']
  },
  while: {
    documentation: 'While a condition holds, execute a task',
    detail: 'while (cond) task',
    args: ['cond', 'task']
  },
  repeat: {
    documentation: 'Repeat a task N times',
    detail: 'for(i=0;i<N;i++) task',
    args: ['N', 'task']
  },
  retry: {
    documentation: 'If a task fails, retry at most N times',
    detail: 'for(i=0;i<N);i++) if(task) break',
    args: ['N', 'task']
  },
  retain: {
    documentation: 'Execute a task, then re-inject the input',
    detail: 'output=task(input); return Object.assign(output, input)',
    args: ['task']
  },
  task: {
    documentation:
      'You may optionally choose to merge the task input and output (options.merge), or project a given field (options.output)',
    detail: 'Perform a single task',
    args: ['task', 'options']
  }
}

/**
 * The monaco proposal instances for our language. We take all of the
 * keys of the `strings` object above, and make a proposal out of them
 *
 */
const makeProposal = languages => keyword =>
  Object.assign(
    {
      label: keyword,
      kind: languages.CompletionItemKind.Method,
      insertText: {
        // the map changes [x,y] to [${1:x}, ${2:y}], which gives a tab order
        value: `${keyword}(${strings[keyword].args.map((_, idx) => `\${${idx + 1}:${_}}`).join(', ')})`
      }
    },
    strings[keyword]
  )

const proposals = languages => Object.keys(strings).map(makeProposal(languages))

export default languages => ({
  language: 'javascript',

  provider: {
    triggerCharacters: ['.'],
    provideCompletionItems: (model, position) => {
      // Split everything the user has typed on the current line up at each space, and only look at the last word
      const lastChars = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      })
      const words = lastChars.replace('\t', '').split(' ')
      const activeTyping = words[words.length - 1] // What the user is currently typing (everything after the last space)

      // If the last character typed is a period then we need to look at member objects of the obj object
      const isPrefix = activeTyping.match(composerPattern) // activeTyping.charAt(activeTyping.length - 1) === '.'

      if (isPrefix) {
        return proposals(languages)
      } else {
        return []
      }

      /* const textUntilPosition = model.getValueInRange({startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column})
              const match = textUntilPosition.match(/composer/)
              console.error(textUntilPosition, match)
              if (match) {
              return proposals
              } else {
              return []
              } */
    }
  }
})
