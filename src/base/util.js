/*
    Gets a nested property from an object according to a
    dot-separated access path, e.g.

    root = {
        counter: {
            value: 2,
        },
        counterList: [
            { value: 0 },
            { value: 4 },
        ]
    }
    extractProperty(root, 'counter')             // returns { value: 2 }
    extractProperty(root, 'counterList.1.value') // returns 4
*/
export function extractProperty(object, path) {
    if (!path) {
        return object
    }
    return path.split('.').reduce((o, prop) => o ? o[prop] : o, object)
}

/*
    Similar how extractProperty will get a nested property,
    setProperty will set a nested property.
*/
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
