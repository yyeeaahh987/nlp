
export function filterDuplicateElement(inputArr:any[]) {
    const uniqueArray = inputArr.filter((value, index, self:any[]) => {
        return self.indexOf(value) === index;
    });
    return uniqueArray
}