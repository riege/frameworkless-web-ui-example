export function extractProperty(object, path) {
    if (!path) {
        return object
    }
    return path.split('.').reduce((o, prop) => o ? o[prop] : o, object)
}

export function setProperty(object, path, value) {
    const seperatorIndex = path.lastIndexOf('.')
    const parentPath = path.substring(0, seperatorIndex)
    const propertyToSet = path.substring(seperatorIndex+1, path.length)
    const parentObject = extractProperty(object, parentPath)
    parentObject[propertyToSet] = value
}

export function isEmpty(value) {
    if(typeof(value) === 'string') {
        return value.trim() === ''
    }
    return value === undefined || value === null
}
