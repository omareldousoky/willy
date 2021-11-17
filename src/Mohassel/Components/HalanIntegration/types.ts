type activeTabs = 'micro' | 'nano' | 'cf' | 'micro-cf'
type mapper = {
  title: (() => void) | string
  key: string
  sortable?: boolean
  render: (data: any) => void
}
