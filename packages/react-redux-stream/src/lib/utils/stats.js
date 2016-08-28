/** Prints stats of a target object to console.  */
export default function stats (title, target) {
  if(console.group && console.table) {
    console.group(title)
    console.table(Array.isArray(target) ? target : Object.entries(target))
    console.groupEnd()
  } else {
    const serialized = `${title}\n${JSON.stringify(target, null, 2)}`
    console[console.info ? 'info' : 'log'](serialized)
  }
}
