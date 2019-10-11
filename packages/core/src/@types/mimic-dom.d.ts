interface SimpleElementMimic {
  rows: SimpleElementMimic[]
  cells: SimpleElementMimic[]
}

interface SimpleLocalStorage {
}

interface SimpleWindow {
  addEventListener?: () => void
  localStorage?: SimpleLocalStorage
  sessionStorage?: SimpleLocalStorage
}

interface SimpleDocument {
  createElement: (tag: string) => SimpleElementMimic
  body: SimpleElementMimic
  addEventListener: () => void
  createTextNode: (text: string) => SimpleElementMimic
  querySelector: (sel: string) => SimpleElementMimic
}

declare module NodeJS  {
  interface Global {
    window: SimpleWindow
    localStorage: SimpleLocalStorage
    sessionStorage: SimpleLocalStorage
    document: SimpleDocument
  }
}
