/*
 * Copyright 2017-2018 IBM Corporation
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
 * Synonyms for OpenWhisk entities and verbs
 *
 */
export const synonymsTable = {
  entities: {
    actions: ['action'],
    packages: ['package'],
    rules: ['rule'],
    triggers: ['trigger'],
    namespaces: ['namespace', 'ns'],
    activations: ['$', 'activation']
  },
  verbs: {
    invoke: ['call', 'exec'],
    fire: [],
    get: [],
    list: [],
    delete: [],
    create: [
      // these are synonyms from the openwhisk npm standpoint, but not from the openwhisk command experience standpoint
      { nickname: 'update', name: 'update', notSynonym: true },
      {
        nickname: 'bind',
        name: 'bind',
        notSynonym: true,
        limitTo: { packages: true }
      }
    ],
    update: ['up']
  }
}

export const synonyms = (type: string, T?: string): string[] => {
  // either T === entities or T === verbs
  return synonymsTable[T || 'entities'][type].concat([type])
}
