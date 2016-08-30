export function statsFactory({ collapsed = true } = {}) {
  return (title, stats) => {
    if(console.group && console.table) {
      try {
        console[collapsed ? 'groupCollapsed' : 'group'](title)
        if(stats instanceof Error)
          console.error(stats)
        else
          console.table(Array.isArray(stats) ? stats : Object.entries(stats))
      } catch(err) {
        console.error(err)
      } finally {
        console.groupEnd()
      }
    } else {
      console.info(`${title}\n${JSON.stringify(stats, null, 2)}`)
    }
  }
}

/** Prints stats of a target object to console.  */
export default statsFactory()
